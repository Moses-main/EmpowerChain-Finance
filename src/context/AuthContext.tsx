import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '../lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

interface Profile {
  wallet_address: string
  full_name: string | null
  email: string | null
  avatar_url: string | null
}

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  signUp: (email: string, password: string, walletAddress?: string) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signInWithWallet: (walletAddress: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<Profile>) => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (walletAddress: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/profile/${walletAddress}`)
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      }
    } catch {
      // Profile not found
    }
  }

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user?.email) {
        fetchProfile(session.user.email)
      }
      setLoading(false)
    })

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user?.email) {
        fetchProfile(session.user.email)
      } else {
        setProfile(null)
      }
    })

    return () => data.subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, walletAddress?: string) => {
    if (!supabase) {
      return { error: new Error('Supabase not configured') }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            wallet_address: walletAddress,
          },
        },
      })

      if (error) return { error }

      if (walletAddress && data?.user) {
        await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/profile`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            wallet_address: walletAddress,
            full_name: email.split('@')[0],
            email,
          }),
        })
      }

      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { error: new Error('Supabase not configured') }
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) return { error }
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const signInWithWallet = async (walletAddress: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/profile/${walletAddress}`)
      if (!response.ok) {
        return { error: new Error('No profile found for this wallet') }
      }
      const data = await response.json()
      setProfile(data)
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const signOut = async () => {
    await supabase?.auth.signOut()
    setUser(null)
    setSession(null)
    setProfile(null)
  }

  const updateProfile = async (data: Partial<Profile>) => {
    if (!profile?.wallet_address) {
      return { error: new Error('No profile found') }
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet_address: profile.wallet_address,
          ...data,
        }),
      })

      if (!response.ok) {
        return { error: new Error('Failed to update profile') }
      }

      const updatedProfile = await response.json()
      setProfile(updatedProfile)
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signUp,
        signIn,
        signInWithWallet,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
