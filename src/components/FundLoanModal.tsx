import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useInvestments } from '../hooks/useLoans'
import { Loader2, CheckCircle, X, DollarSign, TrendingUp } from 'lucide-react'

interface FundLoanModalProps {
  loan: {
    id: string
    borrowerName: string
    businessType: string
    loanAmount: number
    interestRate: number
    fundedPercentage: number
  }
  onClose: () => void
  onSuccess?: () => void
}

export function FundLoanModal({ loan, onClose, onSuccess }: FundLoanModalProps) {
  const { address, isConnected } = useAccount()
  const { createInvestment } = useInvestments()
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const maxAmount = loan.loanAmount * (100 - loan.fundedPercentage) / 100
  const potentialReturn = amount ? (parseFloat(amount) * loan.interestRate / 100).toFixed(2) : '0'

  const handleFund = async () => {
    setError('')
    
    if (!isConnected || !address) {
      setError('Please connect your wallet first')
      return
    }

    if (!amount || parseFloat(amount) < 10) {
      setError('Minimum investment is 10 USDC')
      return
    }

    if (parseFloat(amount) > maxAmount) {
      setError(`Maximum investment is ${maxAmount.toFixed(0)} USDC`)
      return
    }

    setLoading(true)
    
    const result = await createInvestment({
      loan_id: loan.id,
      lender_address: address,
      amount: parseFloat(amount),
      interest_rate: loan.interestRate,
    })

    setLoading(false)
    
    if (result.success) {
      setSuccess(true)
      onSuccess?.()
    } else {
      setError(result.error || 'Failed to process investment')
    }
  }

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="relative rounded-xl p-6 md:p-8 border text-center max-w-md w-full" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#d1fae5' }}>
            <CheckCircle className="w-8 h-8" style={{ color: '#059669' }} />
          </div>
          <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-2">Investment Successful!</h3>
          <p className="mb-4" style={{ color: 'hsl(var(--muted))' }}>
            You've invested {amount} USDC in {loan.borrowerName}'s loan. You'll receive repayments with interest.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg text-sm font-medium text-white"
            style={{ backgroundColor: 'hsl(var(--primary))' }}
          >
            Done
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative rounded-xl p-5 md:p-8 border max-w-md w-full" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg transition-colors"
          style={{ color: 'hsl(var(--muted))' }}
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-semibold text-[hsl(var(--foreground))] mb-1">Fund Loan</h3>
        <p className="text-sm mb-6" style={{ color: 'hsl(var(--muted))' }}>
          {loan.borrowerName} • {loan.businessType}
        </p>

        {!isConnected && (
          <div className="mb-6 p-4 rounded-lg border" style={{ backgroundColor: '#fef3c7', borderColor: '#fcd34d' }}>
            <p className="text-sm" style={{ color: '#92400e' }}>Please connect your wallet to invest</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 rounded-lg border" style={{ backgroundColor: '#fee2e2', borderColor: '#fca5a5' }}>
            <p className="text-sm" style={{ color: '#dc2626' }}>{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[hsl(var(--foreground))] mb-2">
              Investment Amount (USDC)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'hsl(var(--muted))' }} />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm"
                style={{ borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}
                placeholder="100"
                min="10"
                max={maxAmount}
              />
            </div>
            <p className="mt-1 text-xs" style={{ color: 'hsl(var(--muted))' }}>
              Available: {maxAmount.toFixed(0)} USDC • Min: 10 USDC
            </p>
          </div>

          {amount && parseFloat(amount) > 0 && (
            <div className="p-4 rounded-lg" style={{ backgroundColor: 'hsl(var(--secondary))' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm" style={{ color: 'hsl(var(--muted))' }}>Interest Rate</span>
                <span className="text-sm font-medium text-[hsl(var(--foreground))]">{loan.interestRate}% APR</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: 'hsl(var(--muted))' }}>Expected Return</span>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" style={{ color: '#10b981' }} />
                  <span className="text-sm font-medium" style={{ color: '#10b981' }}>${potentialReturn}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={handleFund}
          disabled={loading || !isConnected}
          className="w-full mt-6 py-3 px-5 rounded-lg text-sm font-medium text-white transition-all duration-200 flex items-center justify-center gap-2"
          style={{ backgroundColor: loading || !isConnected ? 'hsl(var(--muted))' : 'hsl(var(--primary))' }}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Invest ${amount || '0'} USDC`
          )}
        </button>

        <p className="mt-4 text-xs text-center" style={{ color: 'hsl(var(--muted))' }}>
          Transactions are secured by smart contracts on Polygon
        </p>
      </div>
    </div>
  )
}
