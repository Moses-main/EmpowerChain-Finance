import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useLoanApplications } from '../hooks/useLoans'
import { CheckCircle, Loader2, ArrowRight, DollarSign, FileText, Users } from 'lucide-react'

const businessTypes = [
  'Retail / E-commerce',
  'Agriculture / Farming',
  'Food & Beverage',
  'Manufacturing',
  'Services / Consulting',
  'Technology / IT',
  'Healthcare',
  'Education',
  'Transportation',
  'Other',
]

interface LoanApplicationFormProps {
  onSuccess?: () => void
}

export function LoanApplicationForm({ onSuccess }: LoanApplicationFormProps) {
  const { address, isConnected } = useAccount()
  const { submitApplication, loading } = useLoanApplications()
  const [formData, setFormData] = useState({
    borrower_name: '',
    email: '',
    business_type: '',
    loan_amount: '',
    loan_purpose: '',
    business_description: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!isConnected || !address) {
      setError('Please connect your wallet first')
      return
    }

    if (!formData.borrower_name || !formData.email || !formData.business_type || !formData.loan_amount) {
      setError('Please fill in all required fields')
      return
    }

    const result = await submitApplication({
      borrower_address: address,
      borrower_name: formData.borrower_name,
      email: formData.email,
      business_type: formData.business_type,
      loan_amount: parseFloat(formData.loan_amount),
      loan_purpose: formData.loan_purpose,
      business_description: formData.business_description,
    })

    if (result.success) {
      setSubmitted(true)
      onSuccess?.()
    } else {
      setError(result.error || 'Failed to submit application')
    }
  }

  if (submitted) {
    return (
      <div className="rounded-xl p-6 md:p-8 border text-center" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
        <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#d1fae5' }}>
          <CheckCircle className="w-8 h-8" style={{ color: '#059669' }} />
        </div>
        <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">Application Submitted!</h3>
        <p className="mb-4" style={{ color: 'hsl(var(--muted))' }}>
          Your loan application has been submitted for review. You'll be notified once it's approved.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-sm font-medium"
          style={{ color: 'hsl(var(--primary))' }}
        >
          Submit another application
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl p-5 md:p-8 border" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
      <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-6">Loan Application</h3>

      {!isConnected && (
        <div className="mb-6 p-4 rounded-lg border" style={{ backgroundColor: '#fef3c7', borderColor: '#fcd34d' }}>
          <p className="text-sm" style={{ color: '#92400e' }}>Please connect your wallet to apply for a loan</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-lg border" style={{ backgroundColor: '#fee2e2', borderColor: '#fca5a5' }}>
          <p className="text-sm" style={{ color: '#dc2626' }}>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div>
          <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">Full Name *</label>
          <input
            type="text"
            value={formData.borrower_name}
            onChange={(e) => setFormData({ ...formData, borrower_name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border text-sm"
            style={{ borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">Email *</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border text-sm"
            style={{ borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}
            placeholder="john@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">Business Type *</label>
          <select
            value={formData.business_type}
            onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border text-sm"
            style={{ borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}
            required
          >
            <option value="">Select business type</option>
            {businessTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">Loan Amount (USDC) *</label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(var(--muted))' }} />
            <input
              type="number"
              value={formData.loan_amount}
              onChange={(e) => setFormData({ ...formData, loan_amount: e.target.value })}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm"
              style={{ borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}
              placeholder="1000"
              min="100"
              max="10000"
              required
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">Loan Purpose</label>
          <input
            type="text"
            value={formData.loan_purpose}
            onChange={(e) => setFormData({ ...formData, loan_purpose: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border text-sm"
            style={{ borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}
            placeholder="Inventory, equipment, working capital..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">Business Description</label>
          <textarea
            value={formData.business_description}
            onChange={(e) => setFormData({ ...formData, business_description: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border text-sm"
            style={{ borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}
            placeholder="Tell us about your business and how you plan to use the loan..."
            rows={4}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-6 py-3 px-5 rounded-lg text-sm font-medium text-white transition-all duration-200 flex items-center justify-center gap-2"
        style={{ backgroundColor: loading ? 'hsl(var(--muted))' : 'hsl(var(--primary))' }}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            Submit Application
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <p className="mt-4 text-xs text-center" style={{ color: 'hsl(var(--muted))' }}>
        By submitting, you agree to our terms and authorize smart contract verification
      </p>
    </form>
  )
}
