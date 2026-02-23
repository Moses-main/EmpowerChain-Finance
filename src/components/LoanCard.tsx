import { useState } from 'react'
import { Clock, Users, DollarSign } from 'lucide-react'
import { FundLoanModal } from './FundLoanModal'

interface LoanCardProps {
  id: string
  borrowerName: string
  businessType: string
  loanAmount: number
  interestRate: number
  fundedPercentage: number
  daysRemaining: number
  image: string
}

export default function LoanCard({
  id,
  borrowerName,
  businessType,
  loanAmount,
  interestRate,
  fundedPercentage,
  daysRemaining,
  image,
}: LoanCardProps) {
  const [showFundModal, setShowFundModal] = useState(false)

  return (
    <>
      <article 
        className="rounded-xl border overflow-hidden transition-all duration-200 hover:shadow-md" 
        style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
      >
        <div className="h-40 sm:h-44 bg-[hsl(var(--input))] flex items-center justify-center overflow-hidden">
          <img src={image} alt={`${borrowerName} portrait`} className="w-full h-full object-cover" />
        </div>

        <div className="p-4 sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium text-[hsl(var(--foreground))]">{borrowerName}</h3>
              <p className="text-sm" style={{ color: 'hsl(var(--muted))' }}>{businessType}</p>
            </div>
            <div className="text-sm" style={{ color: 'hsl(var(--muted))' }}>
              <div className="font-semibold" style={{ color: 'hsl(var(--primary))' }}>{interestRate}% APR</div>
            </div>
          </div>

          <div className="mt-4 sm:mt-5 space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: 'hsl(var(--muted))' }}>Loan</span>
              <span className="font-medium text-[hsl(var(--foreground))]">${loanAmount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span style={{ color: 'hsl(var(--muted))' }}>Funded</span>
              <span className="font-medium" style={{ color: 'hsl(var(--primary))' }}>{fundedPercentage}%</span>
            </div>
          </div>

          <div className="mt-3 sm:mt-4">
            <div className="w-full rounded-full h-2" style={{ backgroundColor: 'hsl(var(--secondary))' }}>
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{ 
                  width: `${fundedPercentage}%`, 
                  background: 'linear-gradient(90deg, hsl(var(--primary)), #34d399)' 
                }}
                aria-hidden
              />
            </div>
          </div>

          <div className="mt-3 sm:mt-4 grid grid-cols-2 gap-2 sm:gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 flex-shrink-0" style={{ color: 'hsl(var(--primary))' }} />
              <span style={{ color: 'hsl(var(--muted))' }}>{daysRemaining} days left</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 flex-shrink-0" style={{ color: 'hsl(var(--primary))' }} />
              <span style={{ color: 'hsl(var(--muted))' }}>24 lenders</span>
            </div>
          </div>

          <div className="mt-4 sm:mt-6">
            <button 
              onClick={() => setShowFundModal(true)}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 text-sm font-medium rounded-lg text-white transition-all duration-200 hover:shadow-md"
              style={{ backgroundColor: 'hsl(var(--primary))' }}
            >
              <DollarSign className="w-4 h-4" />
              Fund this loan
            </button>
          </div>
        </div>
      </article>

      {showFundModal && (
        <FundLoanModal
          loan={{
            id: id,
            borrowerName: borrowerName,
            businessType: businessType,
            loanAmount: loanAmount,
            interestRate: interestRate,
            fundedPercentage: fundedPercentage,
          }}
          onClose={() => setShowFundModal(false)}
          onSuccess={() => setShowFundModal(false)}
        />
      )}
    </>
  )
}
