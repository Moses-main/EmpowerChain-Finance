import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAccount } from 'wagmi'
import { useInvestments, useLoanApplications } from '../hooks/useLoans'
import { Wallet, TrendingUp, DollarSign, BarChart3 } from 'lucide-react'

export default function Dashboard() {
  const { address, isConnected } = useAccount()
  const { investments, fetchInvestments } = useInvestments()
  const { applications, fetchMyApplications } = useLoanApplications()
  const [activeTab, setActiveTab] = useState<'loans' | 'investments'>('loans')

  useEffect(() => {
    if (address) {
      fetchMyApplications(address)
      fetchInvestments(address)
    }
  }, [address, fetchMyApplications, fetchInvestments])

  const borrowerLoans = applications || []
  const lenderInvestments = investments || []

  // Calculate stats
  const totalBorrowed = borrowerLoans
    .filter((a: any) => a.status === 'approved' || a.status === 'funded')
    .reduce((sum: number, a: any) => sum + Number(a.loan_amount), 0)

  const totalInvested = lenderInvestments
    .reduce((sum: number, i: any) => sum + Number(i.amount), 0)

  const totalEarned = lenderInvestments
    .filter((i: any) => i.status === 'repaid')
    .reduce((sum: number, i: any) => sum + Number(i.expected_return - i.amount), 0)

  const stats = isConnected ? [
    { label: 'Active Loans', value: borrowerLoans.filter((a: any) => a.status === 'pending').length, icon: Wallet, color: '#10b981' },
    { label: 'Total Borrowed', value: `$${totalBorrowed.toLocaleString()}`, icon: TrendingUp, color: '#4f46e5' },
    { label: 'Total Invested', value: `$${totalInvested.toLocaleString()}`, icon: DollarSign, color: '#8b5cf6' },
    { label: 'Earnings', value: `$${totalEarned.toLocaleString()}`, icon: BarChart3, color: '#10b981' },
  ] : [
    { label: 'Connect wallet to view stats', value: '--', icon: Wallet, color: '#6b7280' },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-8 md:py-12">
        <div className="container-wide">
          <div className="mb-8 md:mb-12">
            <h1 className="text-2xl md:text-3xl font-semibold text-[hsl(var(--foreground))] mb-2">
              {isConnected ? 'Dashboard' : 'Welcome!'}
            </h1>
            <p className="text-base" style={{ color: 'hsl(var(--muted))' }}>
              {isConnected 
                ? 'Manage your loans and track your investments.' 
                : 'Connect your wallet to view your dashboard.'}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
            {stats.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <div 
                  key={idx}
                  className="rounded-xl p-4 md:p-6 border"
                  style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs md:text-sm font-medium" style={{ color: 'hsl(var(--muted))' }}>{stat.label}</h3>
                    <Icon className="w-4 h-4 md:w-5 md:h-5" style={{ color: stat.color }} />
                  </div>
                  <p className="text-xl md:text-2xl font-semibold text-[hsl(var(--foreground))]">{stat.value}</p>
                </div>
              )
            })}
          </div>

          {isConnected ? (
            <>
              {/* Tabs */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setActiveTab('loans')}
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                  style={{
                    backgroundColor: activeTab === 'loans' ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
                    color: activeTab === 'loans' ? 'white' : 'hsl(var(--foreground))',
                  }}
                >
                  My Loans
                </button>
                <button
                  onClick={() => setActiveTab('investments')}
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                  style={{
                    backgroundColor: activeTab === 'investments' ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
                    color: activeTab === 'investments' ? 'white' : 'hsl(var(--foreground))',
                  }}
                >
                  My Investments
                </button>
              </div>

              {/* Loans Tab */}
              {activeTab === 'loans' && (
                <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                  <div className="p-4 md:p-6 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
                    <h2 className="text-lg md:text-xl font-semibold text-[hsl(var(--foreground))]">My Loan Applications</h2>
                  </div>

                  {borrowerLoans.length === 0 ? (
                    <div className="p-8 text-center" style={{ color: 'hsl(var(--muted))' }}>
                      <p>No loan applications yet.</p>
                      <a href="/borrow" className="text-sm font-medium mt-2 inline-block" style={{ color: 'hsl(var(--primary))' }}>
                        Apply for a loan →
                      </a>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[500px]">
                        <thead style={{ backgroundColor: 'hsl(var(--secondary))' }}>
                          <tr>
                            <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-[hsl(var(--foreground))]">Amount</th>
                            <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-[hsl(var(--foreground))]">Business</th>
                            <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-[hsl(var(--foreground))]">Status</th>
                            <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-[hsl(var(--foreground))]">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {borrowerLoans.map((app: any) => (
                            <tr key={app.id} className="border-t" style={{ borderColor: 'hsl(var(--border))' }}>
                              <td className="px-4 md:px-6 py-3 text-sm font-medium text-[hsl(var(--foreground))]">
                                ${Number(app.loan_amount).toLocaleString()}
                              </td>
                              <td className="px-4 md:px-6 py-3 text-sm text-[hsl(var(--foreground))]">
                                {app.business_type}
                              </td>
                              <td className="px-4 md:px-6 py-3">
                                <span 
                                  className="px-2 py-1 rounded-full text-xs font-medium"
                                  style={{
                                    backgroundColor: app.status === 'pending' ? '#fef3c7' : app.status === 'approved' ? '#d1fae5' : '#fee2e2',
                                    color: app.status === 'pending' ? '#92400e' : app.status === 'approved' ? '#059669' : '#dc2626',
                                  }}
                                >
                                  {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-4 md:px-6 py-3 text-sm" style={{ color: 'hsl(var(--muted))' }}>
                                {new Date(app.created_at).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Investments Tab */}
              {activeTab === 'investments' && (
                <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                  <div className="p-4 md:p-6 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
                    <h2 className="text-lg md:text-xl font-semibold text-[hsl(var(--foreground))]">My Investments</h2>
                  </div>

                  {lenderInvestments.length === 0 ? (
                    <div className="p-8 text-center" style={{ color: 'hsl(var(--muted))' }}>
                      <p>No investments yet.</p>
                      <a href="/lend" className="text-sm font-medium mt-2 inline-block" style={{ color: 'hsl(var(--primary))' }}>
                        Browse loans to fund →
                      </a>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[500px]">
                        <thead style={{ backgroundColor: 'hsl(var(--secondary))' }}>
                          <tr>
                            <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-[hsl(var(--foreground))]">Amount</th>
                            <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-[hsl(var(--foreground))]">Interest</th>
                            <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-[hsl(var(--foreground))]">Expected Return</th>
                            <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-[hsl(var(--foreground))]">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lenderInvestments.map((inv: any) => (
                            <tr key={inv.id} className="border-t" style={{ borderColor: 'hsl(var(--border))' }}>
                              <td className="px-4 md:px-6 py-3 text-sm font-medium text-[hsl(var(--foreground))]">
                                ${Number(inv.amount).toLocaleString()}
                              </td>
                              <td className="px-4 md:px-6 py-3 text-sm text-[hsl(var(--foreground))]">
                                {inv.interest_rate}%
                              </td>
                              <td className="px-4 md:px-6 py-3 text-sm font-medium" style={{ color: '#10b981' }}>
                                ${Number(inv.expected_return).toLocaleString()}
                              </td>
                              <td className="px-4 md:px-6 py-3">
                                <span 
                                  className="px-2 py-1 rounded-full text-xs font-medium"
                                  style={{
                                    backgroundColor: inv.status === 'active' ? '#d1fae5' : '#e5e7eb',
                                    color: inv.status === 'active' ? '#059669' : '#6b7280',
                                  }}
                                >
                                  {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="rounded-xl p-8 border text-center" style={{ backgroundColor: 'hsl(var(--secondary))', borderColor: 'hsl(var(--border))' }}>
              <Wallet className="w-12 h-12 mx-auto mb-4" style={{ color: 'hsl(var(--primary))' }} />
              <h3 className="text-lg font-medium text-[hsl(var(--foreground))] mb-2">Connect Your Wallet</h3>
              <p className="text-sm mb-4" style={{ color: 'hsl(var(--muted))' }}>Connect your wallet to view your dashboard</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
