import { useState, useEffect } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { useSubmitApplication } from '../hooks/useLoans'
import { CheckCircle, Loader2, ArrowRight, ArrowLeft, DollarSign, Users, Building, Save, TrendingDown } from 'lucide-react'

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

interface FormData {
  borrower_name: string
  email: string
  business_type: string
  loan_amount: string
  loan_purpose: string
  business_description: string
}

const STORAGE_KEY = 'empowerchain_loan_draft'

export function LoanApplicationForm({ onSuccess }: LoanApplicationFormProps) {
  const { address, isConnected } = useAccount()
  const { mutateAsync: submitApplication, isPending: loading } = useSubmitApplication()
  
  // Dummy contract address for now, usually would be an env var
  const LITERACY_BADGE_ADDRESS = import.meta.env.VITE_LITERACY_BADGE_ADDRESS || '0x0000000000000000000000000000000000000000'
  const { data: userTiers } = useReadContract({
    address: LITERACY_BADGE_ADDRESS as `0x${string}`,
    abi: [{
      "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
      "name": "getUserTiers",
      "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
      "stateMutability": "view",
      "type": "function"
    }],
    functionName: 'getUserTiers',
    args: address ? [address as `0x${string}`] : undefined,
    query: {
      enabled: !!address && isConnected,
    }
  })

  // Calculate highest tier (0 = Bronze, 1 = Silver, 2 = Gold)
  const highestTier = Array.isArray(userTiers) && userTiers.length > 0 
    ? Math.max(...(userTiers as number[]).map(Number)) 
    : -1

  // Base rate 15%, Bronze (0) = 10%, Silver (1) = 5%, Gold (2) = 0%
  const calculateInterestRate = (tier: number) => {
    switch(tier) {
      case 2: return 0;
      case 1: return 5;
      case 0: return 10;
      default: return 15;
    }
  }

  const effectiveInterestRate = calculateInterestRate(highestTier)

  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({
    borrower_name: '',
    email: '',
    business_type: '',
    loan_amount: '',
    loan_purpose: '',
    business_description: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [saveMessage, setSaveMessage] = useState('')

  const steps = [
    { title: 'Personal Info', icon: Users },
    { title: 'Business Details', icon: Building },
    { title: 'Loan Request', icon: DollarSign },
  ]

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.address === address) {
          setFormData(parsed.formData)
          setSaveMessage('Draft loaded')
          setTimeout(() => setSaveMessage(''), 3000)
        }
      } catch (e) {
        console.error('Failed to load draft', e)
      }
    }
  }, [address])

  const saveDraft = () => {
    if (!address) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        address,
        formData,
        savedAt: Date.now()
      }))
      setSaveMessage('Draft saved')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (e) {
      console.error('Failed to save draft', e)
    }
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!formData.borrower_name && !!formData.email
      case 1:
        return !!formData.business_type && !!formData.business_description
      case 2:
        return !!formData.loan_amount && parseFloat(formData.loan_amount) >= 100 && parseFloat(formData.loan_amount) <= 10000
      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    } else {
      setError('Please fill in all required fields')
    }
  }

  const prevStep = () => {
    setCurrentStep(currentStep - 1)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!isConnected || !address) {
      setError('Please connect your wallet first')
      return
    }

    if (!validateStep(2)) {
      setError('Please fill in all required fields')
      return
    }

    try {
      await submitApplication({
        borrower_address: address,
        borrower_name: formData.borrower_name,
        email: formData.email,
        business_type: formData.business_type,
        loan_amount: parseFloat(formData.loan_amount),
        loan_purpose: formData.loan_purpose,
        business_description: formData.business_description,
      })

      localStorage.removeItem(STORAGE_KEY)
      setSubmitted(true)
      onSuccess?.()
    } catch (err: any) {
      setError(err.message || 'Failed to submit application')
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
    <div className="rounded-xl p-5 md:p-8 border" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-[hsl(var(--foreground))]">Loan Application</h3>
        <button
          onClick={saveDraft}
          className="flex items-center gap-1 text-xs font-medium"
          style={{ color: 'hsl(var(--muted))' }}
        >
          <Save className="w-3 h-3" />
          {saveMessage || 'Save draft'}
        </button>
      </div>

      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isActive = index === currentStep
          const isCompleted = index < currentStep

          return (
            <div key={index} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: isCompleted ? 'hsl(var(--primary))' : isActive ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
                    color: isCompleted || isActive ? 'white' : 'hsl(var(--muted))'
                  }}
                >
                  {isCompleted ? <CheckCircle className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className="hidden sm:block text-xs font-medium" style={{ color: isActive ? 'hsl(var(--foreground))' : 'hsl(var(--muted))' }}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="w-8 sm:w-16 h-0.5 mx-2" style={{ backgroundColor: isCompleted ? 'hsl(var(--primary))' : 'hsl(var(--border))' }} />
              )}
            </div>
          )
        })}
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg border" style={{ backgroundColor: '#fee2e2', borderColor: '#fca5a5' }}>
          <p className="text-sm" style={{ color: '#dc2626' }}>{error}</p>
        </div>
      )}

      {!isConnected && (
        <div className="mb-6 p-4 rounded-lg border" style={{ backgroundColor: '#fef3c7', borderColor: '#fcd34d' }}>
          <p className="text-sm" style={{ color: '#92400e' }}>Please connect your wallet to apply for a loan</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {currentStep === 0 && (
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
          </div>
        )}

        {currentStep === 1 && (
          <div className="grid grid-cols-1 gap-4 md:gap-6">
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
              <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">Business Description *</label>
              <textarea
                value={formData.business_description}
                onChange={(e) => setFormData({ ...formData, business_description: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border text-sm"
                style={{ borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}
                placeholder="Tell us about your business and how you plan to use the loan..."
                rows={4}
                required
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="grid grid-cols-1 gap-4 md:gap-6">
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
              <p className="mt-1 text-xs" style={{ color: 'hsl(var(--muted))' }}>Min: $100 - Max: $10,000</p>
            </div>
            <div>
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
          </div>
        )}

        {currentStep === 2 && (
          <div className="mt-6 p-4 rounded-lg flex items-start gap-4" style={{ backgroundColor: highestTier >= 0 ? '#eff6ff' : 'hsl(var(--secondary))' }}>
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: highestTier >= 0 ? '#bfdbfe' : 'hsl(var(--card))' }}>
              <TrendingDown className="w-5 h-5" style={{ color: highestTier >= 0 ? '#1d4ed8' : 'hsl(var(--muted))' }} />
            </div>
            <div>
              <h4 className="text-sm font-medium text-[hsl(var(--foreground))]">Your Effective Interest Rate: <span className="text-lg font-bold" style={{ color: 'hsl(var(--primary))' }}>{effectiveInterestRate}%</span></h4>
              <p className="text-xs mt-1" style={{ color: 'hsl(var(--muted))', lineHeight: '1.5' }}>
                {highestTier >= 0 
                  ? `Congratulations! As a ${highestTier === 2 ? 'Gold' : highestTier === 1 ? 'Silver' : 'Bronze'} tier badge holder, you've earned a discount on your base 15% rate.`
                  : "Base interest rate is 15%. Complete Financial Literacy Modules in the Learn tab to mint NFT badges and lower your rate!"}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-8 gap-4">
          {currentStep > 0 ? (
            <button
              type="button"
              onClick={prevStep}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border transition-colors"
              style={{ borderColor: 'hsl(var(--border))' }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : <div />}

          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg text-white transition-all duration-200"
              style={{ backgroundColor: 'hsl(var(--primary))' }}
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg text-white transition-all duration-200"
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
          )}
        </div>
      </form>

      <p className="mt-4 text-xs text-center" style={{ color: 'hsl(var(--muted))' }}>
        By submitting, you agree to our terms and authorize smart contract verification
      </p>
    </div>
  )
}
