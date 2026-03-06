import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useWallet } from '../context/WalletContext'

export default function Profile() {
  const { user, profile, updateProfile, signOut } = useAuth()
  const { address, isConnected } = useWallet()
  
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '')
      setEmail(profile.email || '')
    }
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')

    const { error } = await updateProfile({ full_name: fullName, email })

    if (error) {
      setMessage('Failed to update profile')
    } else {
      setMessage('Profile updated successfully')
    }
    setSaving(false)
  }

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Wallet Connection</h2>
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Connected
                </span>
                <span className="text-gray-600 font-mono">
                  {address?.slice(0, 6)}...{address?.slice(-4)}
                </span>
              </>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                Not connected
              </span>
            )}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Account</h2>
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  Email Verified
                </span>
                <span className="text-gray-600">{user.email}</span>
              </>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                Wallet-only account
              </span>
            )}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-6">Edit Profile</h2>
        
        {message && (
          <div className={`mb-4 p-3 rounded ${message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {message}
          </div>
        )}
        
        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          <button
            type="button"
            onClick={handleSignOut}
            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Sign Out
          </button>
        </div>
      </form>
    </div>
  )
}
