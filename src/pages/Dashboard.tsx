import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Wallet, TrendingUp, Clock, CheckCircle } from 'lucide-react';

export default function Dashboard() {
  const [userType] = useState<'borrower' | 'lender'>('borrower');

  const borrowerStats = { activeLoans: 2, totalBorrowed: 8500, totalRepaid: 3200, nextPayment: 425, nextPaymentDate: '2026-02-15' };
  const lenderStats = { totalInvested: 15000, activeLoans: 8, totalEarned: 1240, pendingReturns: 340 };

  const borrowerLoans = [
    { id: 1, amount: 5000, interestRate: 8, repaid: 2000, status: 'active', nextPayment: 425, nextPaymentDate: '2026-02-15' },
    { id: 2, amount: 3500, interestRate: 7, repaid: 1200, status: 'active', nextPayment: 300, nextPaymentDate: '2026-02-20' },
  ];

  const lenderPortfolio = [
    { id: 1, borrowerName: 'Amara Okafor', amount: 2000, interestRate: 8, earned: 120, status: 'active' },
    { id: 2, borrowerName: 'Carlos Mendez', amount: 3500, interestRate: 7, earned: 245, status: 'active' },
    { id: 3, borrowerName: 'Fatima Hassan', amount: 1500, interestRate: 6, earned: 45, status: 'active' },
  ];

  const stats = userType === 'borrower' ? [
    { label: 'Active Loans', value: borrowerStats.activeLoans, icon: Wallet, color: '#10b981' },
    { label: 'Total Borrowed', value: `$${borrowerStats.totalBorrowed.toLocaleString()}`, icon: TrendingUp, color: '#4f46e5' },
    { label: 'Total Repaid', value: `$${borrowerStats.totalRepaid.toLocaleString()}`, icon: CheckCircle, color: '#10b981' },
    { label: 'Next Payment', value: `$${borrowerStats.nextPayment}`, icon: Clock, color: '#f59e0b', sub: borrowerStats.nextPaymentDate },
  ] : [
    { label: 'Total Invested', value: `$${lenderStats.totalInvested.toLocaleString()}`, icon: Wallet, color: '#4f46e5' },
    { label: 'Active Loans', value: lenderStats.activeLoans, icon: TrendingUp, color: '#10b981' },
    { label: 'Total Earned', value: `$${lenderStats.totalEarned.toLocaleString()}`, icon: CheckCircle, color: '#10b981' },
    { label: 'Pending Returns', value: `$${lenderStats.pendingReturns.toLocaleString()}`, icon: Clock, color: '#f59e0b' },
  ];

  const items = userType === 'borrower' ? borrowerLoans : lenderPortfolio;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="py-8 md:py-12">
        <div className="container-wide">
          <div className="mb-8 md:mb-12">
            <h1 className="text-2xl md:text-3xl font-semibold text-[hsl(var(--foreground))] mb-2">
              Welcome Back, {userType === 'borrower' ? 'Entrepreneur' : 'Investor'}!
            </h1>
            <p className="text-base" style={{ color: 'hsl(var(--muted))' }}>
              {userType === 'borrower' ? 'Manage your loans and track your repayment progress.' : 'Monitor your investments and earnings.'}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
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
                  <p className="text-xl md:text-3xl font-semibold text-[hsl(var(--foreground))]">{stat.value}</p>
                  {stat.sub && <p className="text-xs mt-1" style={{ color: 'hsl(var(--muted))' }}>{stat.sub}</p>}
                </div>
              );
            })}
          </div>

          <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
            <div className="p-4 md:p-6 border-b" style={{ borderColor: 'hsl(var(--border))' }}>
              <h2 className="text-lg md:text-xl font-semibold text-[hsl(var(--foreground))]">
                {userType === 'borrower' ? 'Your Loans' : 'Your Portfolio'}
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead style={{ backgroundColor: 'hsl(var(--secondary))' }}>
                  <tr>
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-[hsl(var(--foreground))]">
                      {userType === 'borrower' ? 'Loan ID' : 'Borrower'}
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-[hsl(var(--foreground))]">Amount</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-[hsl(var(--foreground))]">Rate</th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-[hsl(var(--foreground))]">
                      {userType === 'borrower' ? 'Repaid' : 'Earned'}
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-[hsl(var(--foreground))]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: any) => (
                    <tr key={item.id} className="border-t" style={{ borderColor: 'hsl(var(--border))' }}>
                      <td className="px-4 md:px-6 py-3 text-sm font-medium text-[hsl(var(--foreground))]">
                        {userType === 'borrower' ? `#${item.id}` : item.borrowerName}
                      </td>
                      <td className="px-4 md:px-6 py-3 text-sm text-[hsl(var(--foreground))]">${item.amount.toLocaleString()}</td>
                      <td className="px-4 md:px-6 py-3 text-sm text-[hsl(var(--foreground))]">{item.interestRate}%</td>
                      <td className="px-4 md:px-6 py-3 text-sm font-medium" style={{ color: '#10b981' }}>${userType === 'borrower' ? item.repaid : item.earned}</td>
                      <td className="px-4 md:px-6 py-3">
                        <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#d1fae5', color: '#059669' }}>Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
