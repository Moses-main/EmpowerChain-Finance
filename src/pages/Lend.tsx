import Header from '../components/Header'
import Footer from '../components/Footer'
import LoanCard from '../components/LoanCard'
import { useLoans } from '../hooks/useLoans'
import { TrendingUp, Shield, Globe, ArrowRight } from 'lucide-react'

export default function Lend() {
  const { loans, loading, error } = useLoans()

  const benefits = [
    { icon: TrendingUp, title: 'Competitive Returns', description: 'Earn 6-15% APY on your tokenized contributions. Higher returns than traditional savings.' },
    { icon: Shield, title: 'Secure & Transparent', description: 'Smart contracts ensure automatic repayments. On-chain audits provide full transparency.' },
    { icon: Globe, title: 'Global Impact', description: 'Support entrepreneurs worldwide while building wealth. Align investments with your values.' },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="section">
          <div className="container-narrow">
            <div className="rounded-xl p-6 md:p-8 border text-center" style={{ backgroundColor: 'hsl(var(--secondary))', borderColor: 'hsl(var(--border))' }}>
              <h1 className="text-2xl md:text-3xl font-semibold text-[hsl(var(--foreground))] mb-2">Invest in global growth</h1>
              <p className="text-base" style={{ color: 'hsl(var(--muted))' }}>Earn competitive returns while supporting entrepreneurs in underserved communities.</p>
            </div>
          </div>
        </section>

        <section className="section pt-0">
          <div className="container-wide">
            <h2 className="text-xl md:text-2xl font-semibold text-[hsl(var(--foreground))] text-center mb-6 md:mb-8">Why lend on EmpowerChain?</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {benefits.map((b, idx) => {
                const Icon = b.icon
                return (
                  <article key={idx} className="rounded-xl p-5 md:p-6 border" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#e0e7ff' }}>
                        <Icon className="w-5 h-5" style={{ color: 'hsl(var(--primary))' }} />
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-[hsl(var(--foreground))]">{b.title}</h3>
                        <p className="text-sm mt-2" style={{ color: 'hsl(var(--muted))', lineHeight: '1.5' }}>{b.description}</p>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="section pt-0">
          <div className="container-wide">
            <h2 className="text-xl md:text-2xl font-semibold text-[hsl(var(--foreground))] text-center mb-3 md:mb-4">Active loan opportunities</h2>
            <p className="text-center text-base mb-6 md:mb-8 max-w-2xl mx-auto" style={{ color: 'hsl(var(--muted))' }}>Browse and fund loans from verified entrepreneurs. Each loan is backed by smart contracts and transparent terms.</p>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-[hsl(var(--primary))] border-t-transparent rounded-full mx-auto" />
                <p className="mt-4" style={{ color: 'hsl(var(--muted))' }}>Loading loans...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12" style={{ color: 'hsl(var(--muted))' }}>
                <p>Failed to load loans. Please try again.</p>
              </div>
            ) : loans.length === 0 ? (
              <div className="text-center py-12" style={{ color: 'hsl(var(--muted))' }}>
                <p>No active loans available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {loans.map((loan) => (
                  <LoanCard
                    key={loan.id}
                    id={loan.id}
                    borrowerName={loan.borrower_name}
                    businessType={loan.business_type}
                    loanAmount={Number(loan.loan_amount)}
                    interestRate={Number(loan.interest_rate)}
                    fundedPercentage={loan.funded_percentage || Math.round((Number(loan.funded_amount) / Number(loan.loan_amount)) * 100)}
                    daysRemaining={Math.floor(Math.random() * 30) + 1}
                    image={`https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=400&fit=crop&random=${loan.id}`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="section pt-0">
          <div className="container-narrow">
            <h2 className="text-xl md:text-2xl font-semibold text-[hsl(var(--foreground))] text-center mb-6">How to start lending</h2>

            <div className="space-y-3 md:space-y-4">
              {[
                { step: '1', title: 'Connect your wallet', description: 'Link your MetaMask or preferred Web3 wallet to get started.' },
                { step: '2', title: 'Deposit funds', description: 'Transfer USDC or other supported stablecoins to your EmpowerChain account.' },
                { step: '3', title: 'Browse & fund loans', description: 'Review borrower profiles and fund loans that align with your values.' },
                { step: '4', title: 'Earn returns', description: 'Receive automatic repayments with interest directly to your wallet.' },
              ].map((item, index) => (
                <article key={index} className="rounded-xl p-4 md:p-5 border flex gap-3 md:gap-4 items-start" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center font-medium text-white flex-shrink-0" style={{ backgroundColor: 'hsl(var(--primary))' }}>{item.step}</div>
                  <div>
                    <h3 className="text-base font-medium text-[hsl(var(--foreground))]">{item.title}</h3>
                    <p className="text-sm" style={{ color: 'hsl(var(--muted))' }}>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section pt-0 pb-12">
          <div className="container-narrow">
            <div className="rounded-xl p-6 md:p-8 border text-center" style={{ backgroundColor: 'hsl(var(--secondary))', borderColor: 'hsl(var(--border))' }}>
              <h3 className="text-xl font-medium text-[hsl(var(--foreground))] mb-2">Start earning today</h3>
              <p className="text-base mb-5 md:mb-6" style={{ color: 'hsl(var(--muted))' }}>Join lenders supporting global entrepreneurship. Minimum investment: $10 USDC.</p>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg text-white" style={{ backgroundColor: 'hsl(var(--primary))' }}>
                Become a lender
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
