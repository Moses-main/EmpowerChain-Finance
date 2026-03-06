import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAccount } from 'wagmi'
import { useInvestments, useLoanApplications } from '../hooks/useLoans'
import { Wallet, TrendingUp, DollarSign, BarChart3 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import ApiStatusNotice from '../components/ApiStatusNotice'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

import { useReadContract } from 'wagmi'

const LITERACY_BADGE_ADDRESS = import.meta.env.VITE_LITERACY_BADGE_ADDRESS || '0x0000000000000000000000000000000000000000'

export default function Dashboard() {
  const { t } = useTranslation()
  const { address, isConnected } = useAccount()
  const { data: investments, error: investmentsError, isLoading: investmentsLoading } = useInvestments(address)
  const { data: applications, error: applicationsError, isLoading: applicationsLoading } = useLoanApplications(address)
  const [activeTab, setActiveTab] = useState<'loans' | 'investments'>('loans')

  const borrowerLoans = applications || []
  const lenderInvestments = investments || []

  // Calculate stats
  const totalBorrowed = borrowerLoans
    .filter((a) => a.status === 'approved')
    .reduce((sum, a) => sum + Number(a.loan_amount), 0)

  const totalInvested = lenderInvestments
    .reduce((sum, i) => sum + Number(i.amount), 0)

  const totalEarned = lenderInvestments
    .filter((i) => i.status === 'repaid')
    .reduce((sum, i) => sum + Number(i.expected_return - i.amount), 0)

  // Risk Assessment based on Badge Tier
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

  const highestTier = Array.isArray(userTiers) && userTiers.length > 0 
    ? Math.max(...(userTiers as number[]).map(Number)) 
    : -1

  const riskScoreText = highestTier === 2 ? t('dashboard.risk.excellent') : highestTier === 1 ? t('dashboard.risk.good') : highestTier === 0 ? t('dashboard.risk.fair') : t('dashboard.risk.pending')
  const riskScoreColor = highestTier === 2 ? '#10b981' : highestTier === 1 ? '#3b82f6' : highestTier === 0 ? '#f59e0b' : '#6b7280'

  // Mock Dynamic Chart Data
  const dynamicChartData = lenderInvestments.length > 0 ? [
    { month: 'Start', returns: 0 },
    { month: 'Current', returns: totalEarned || (totalInvested * 0.05) }, 
  ] : []

  const stats = isConnected ? [
    { label: t('dashboard.stats.activeLoans'), value: borrowerLoans.filter((a) => a.status === 'pending').length, icon: Wallet, color: '#10b981' },
    { label: t('dashboard.stats.totalBorrowed'), value: `$${totalBorrowed.toLocaleString()}`, icon: TrendingUp, color: '#4f46e5' },
    { label: t('dashboard.stats.totalInvested'), value: `$${totalInvested.toLocaleString()}`, icon: DollarSign, color: '#8b5cf6' },
    { label: t('dashboard.stats.earnings'), value: `$${totalEarned.toLocaleString()}`, icon: BarChart3, color: '#10b981' },
  ] : [
    { label: t('dashboard.stats.connect_wallet'), value: '--', icon: Wallet, color: '#6b7280' },
  ]

  const isLoading = applicationsLoading || investmentsLoading

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-8 md:py-12">
        <div className="container-wide">
          <div className="mb-8 md:mb-12">
            <h1 className="text-2xl md:text-3xl font-semibold text-[hsl(var(--foreground))] mb-2">
              {isConnected ? t('dashboard.title') : t('dashboard.welcome')}
            </h1>
            <p className="text-base" style={{ color: 'hsl(var(--muted))' }}>
              {isConnected 
                ? t('dashboard.manage_loans') 
                : t('dashboard.connectWallet')}
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
              {(applicationsError || investmentsError) && (
                <ApiStatusNotice
                  type="error"
                  message={applicationsError?.message || investmentsError?.message || 'Unable to load dashboard data right now.'}
                />
              )}

              {isLoading && (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              )}

              {/* Tabs */}
              {!isLoading && (
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setActiveTab('loans')}
                    className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                    style={{
                      backgroundColor: activeTab === 'loans' ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
                      color: activeTab === 'loans' ? 'white' : 'hsl(var(--foreground))',
                    }}
                  >
                    {t('dashboard.tabs.loans')}
                  </button>
                  <button
                    onClick={() => setActiveTab('investments')}
                    className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                    style={{
                      backgroundColor: activeTab === 'investments' ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
                      color: activeTab === 'investments' ? 'white' : 'hsl(var(--foreground))',
                    }}
                  >
                    {t('dashboard.tabs.investments')}
                  </button>
                </div>
              )}

              {/* Loans Tab */}
              {activeTab === 'loans' && !isLoading && (
                <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                  <div className="p-4 md:p-6 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
                    <h2 className="text-lg md:text-xl font-semibold text-[hsl(var(--foreground))]">{t('dashboard.loans.title')}</h2>
                  </div>

                  {borrowerLoans.length === 0 ? (
                    <div className="p-8 text-center" style={{ color: 'hsl(var(--muted))' }}>
                      <p>{t('dashboard.loans.no_loans')}</p>
                      <a href="/borrow" className="text-sm font-medium mt-2 inline-block" style={{ color: 'hsl(var(--primary))' }}>
                        {t('dashboard.loans.apply_now')}
                      </a>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[500px]">
                        <thead style={{ backgroundColor: 'hsl(var(--secondary))' }}>
                          <tr>
                            <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-[hsl(var(--foreground))]">{t('dashboard.loans.table.amount')}</th>
                            <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-[hsl(var(--foreground))]">{t('dashboard.loans.table.business')}</th>
                            <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-[hsl(var(--foreground))]">{t('dashboard.loans.table.status')}</th>
                            <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-[hsl(var(--foreground))]">{t('dashboard.loans.table.date')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {borrowerLoans.map((app) => (
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
                                {app.created_at ? new Date(app.created_at).toLocaleDateString() : '-'}
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
              {activeTab === 'investments' && !isLoading && (
                <div className="space-y-6">
                  {lenderInvestments.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="rounded-xl border p-4 md:p-6" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                        <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">{t('dashboard.investments.performance')}</h3>
                        <div className="h-[300px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dynamicChartData}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                              <XAxis dataKey="month" stroke="hsl(var(--muted))" fontSize={12} tickLine={false} axisLine={false} />
                              <YAxis stroke="hsl(var(--muted))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                              <Tooltip 
                                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                                itemStyle={{ color: 'hsl(var(--foreground))' }}
                              />
                              <Line type="monotone" dataKey="returns" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      <div className="rounded-xl border p-4 md:p-6" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                        <h3 className="text-lg font-semibold text-[hsl(var(--foreground))] mb-4">{t('dashboard.investments.risk_assessment')}</h3>
                        <div className="h-[300px] w-full flex flex-col items-center justify-center p-6 border rounded-lg" style={{ backgroundColor: 'hsl(var(--secondary))', borderColor: 'hsl(var(--border))' }}>
                            <div className="text-5xl font-bold mb-4" style={{ color: riskScoreColor }}>
                              {highestTier >= 0 ? ['C', 'B', 'A'][highestTier] : 'N/A'}
                            </div>
                            <h4 className="text-xl font-medium text-[hsl(var(--foreground))] mb-2">{riskScoreText}</h4>
                            <p className="text-sm text-center" style={{ color: 'hsl(var(--muted))' }}>
                              {t('dashboard.risk.description')}
                            </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                    <div className="p-4 md:p-6 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
                      <h2 className="text-lg md:text-xl font-semibold text-[hsl(var(--foreground))]">{t('dashboard.investments.recent')}</h2>
                    </div>

                    {lenderInvestments.length === 0 ? (
                      <div className="p-8 text-center" style={{ color: 'hsl(var(--muted))' }}>
                        <p>{t('dashboard.investments.no_investments')}</p>
                        <a href="/lend" className="text-sm font-medium mt-2 inline-block" style={{ color: 'hsl(var(--primary))' }}>
                          {t('dashboard.investments.browse_loans')}
                        </a>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[500px]">
                          <thead style={{ backgroundColor: 'hsl(var(--secondary))' }}>
                            <tr>
                              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-[hsl(var(--foreground))]">{t('dashboard.loans.table.amount')}</th>
                              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-[hsl(var(--foreground))]">{t('dashboard.investments.table.interest')}</th>
                              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-[hsl(var(--foreground))]">{t('dashboard.investments.table.expected_return')}</th>
                              <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-[hsl(var(--foreground))]">{t('dashboard.loans.table.status')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {lenderInvestments.map((inv) => (
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
