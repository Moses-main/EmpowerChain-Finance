import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FileText, CheckCircle, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Borrow() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { number: 1, title: 'Create Profile', description: 'Connect your wallet and complete your borrower profile with basic information.', icon: FileText },
    { number: 2, title: 'Submit Application', description: 'Describe your business, loan amount needed, and how you plan to use the funds.', icon: FileText },
    { number: 3, title: 'Community Review', description: 'Community review and smart contract verification. Approval typically within 48 hours.', icon: CheckCircle },
    { number: 4, title: 'Receive Funds', description: 'Once funded by lenders, receive your loan directly to your wallet.', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <section className="section">
          <div className="container-narrow">
            <div className="rounded-xl p-6 md:p-8 border" style={{ backgroundColor: 'hsl(var(--secondary))', borderColor: 'hsl(var(--border))' }}>
              <h1 className="text-2xl md:text-3xl font-semibold text-[hsl(var(--foreground))] mb-2">Borrow with confidence</h1>
              <p className="text-base" style={{ color: 'hsl(var(--muted))' }}>Access collateral-free microloans designed for entrepreneurs. Transparent terms, no hidden fees.</p>
            </div>
          </div>
        </section>

        <section className="section pt-0">
          <div className="container-wide">
            <h2 className="text-xl md:text-2xl font-semibold text-[hsl(var(--foreground))] text-center mb-6 md:mb-8">How it works</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {steps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <article
                    key={index}
                    onClick={() => setActiveStep(index)}
                    className="rounded-xl p-5 md:p-6 border cursor-pointer transition-all duration-200"
                    style={{ 
                      backgroundColor: activeStep === index ? 'hsl(var(--card))' : 'hsl(var(--card))',
                      borderColor: activeStep === index ? 'hsl(var(--primary))' : 'hsl(var(--border))',
                      boxShadow: activeStep === index ? 'var(--shadow-md)' : 'none'
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div 
                        className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium"
                        style={{ 
                          backgroundColor: activeStep === index ? 'hsl(var(--primary))' : 'hsl(var(--secondary))',
                          color: activeStep === index ? 'white' : 'hsl(var(--muted))'
                        }}
                      >
                        {step.number}
                      </div>
                      <Icon 
                        className="w-5 h-5" 
                        style={{ color: activeStep === index ? 'hsl(var(--primary))' : 'hsl(var(--muted))' }} 
                      />
                    </div>

                    <h3 className="text-base font-medium text-[hsl(var(--foreground))] mb-1">{step.title}</h3>
                    <p className="text-sm" style={{ color: 'hsl(var(--muted))', lineHeight: '1.5' }}>{step.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section pt-0">
          <div className="container-narrow">
            <h2 className="text-xl md:text-2xl font-semibold text-[hsl(var(--foreground))] text-center mb-6 md:mb-8">Borrower requirements</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="rounded-xl p-5 md:p-6 border" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                <h3 className="text-lg font-medium text-[hsl(var(--foreground))] mb-3">Basic</h3>
                <ul className="space-y-3 text-sm">
                  {['Age 18 or older', 'Valid government ID', 'Active crypto wallet (MetaMask, etc.)', 'Business plan or description', 'Proof of business registration (if applicable)'].map((req, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'hsl(var(--primary))' }} />
                      <span style={{ color: 'hsl(var(--muted))' }}>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl p-5 md:p-6 border" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                <h3 className="text-lg font-medium text-[hsl(var(--foreground))] mb-3">Loan terms</h3>
                <ul className="space-y-3 text-sm">
                  {['Loan Amount: $100 - $10,000 USD', 'Interest Rate: 5% - 15% APR', 'Repayment Period: 6 - 24 months', 'No collateral required', 'Transparent on-chain terms'].map((term, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'hsl(var(--primary))' }} />
                      <span style={{ color: 'hsl(var(--muted))' }}>{term}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="section pt-0 pb-12">
          <div className="container-narrow">
            <div className="rounded-xl p-6 md:p-8 border text-center" style={{ backgroundColor: 'hsl(var(--secondary))', borderColor: 'hsl(var(--border))' }}>
              <h3 className="text-xl font-medium text-[hsl(var(--foreground))] mb-2">Ready to grow your business?</h3>
              <p className="text-base mb-5 md:mb-6" style={{ color: 'hsl(var(--muted))' }}>Start your loan application — it takes less than 10 minutes.</p>
              <Link 
                to="/borrow" 
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg text-white transition-all duration-200"
                style={{ backgroundColor: 'hsl(var(--primary))' }}
              >
                Apply now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
