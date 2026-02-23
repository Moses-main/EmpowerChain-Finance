import { ArrowRight, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTASection = () => {
  return (
    <section className="section" style={{ backgroundColor: 'hsl(var(--secondary))' }}>
      <div className="container-narrow">
        <div className="rounded-2xl p-8 md:p-12 border text-center" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', boxShadow: 'var(--shadow-md)' }}>
          <h2 className="text-3xl md:text-4xl font-semibold text-[hsl(var(--foreground))] mb-4">
            Ready to participate?
          </h2>
          <p className="text-lg mb-8 max-w-lg mx-auto" style={{ color: 'hsl(var(--muted))', lineHeight: '1.6' }}>
            Connect your wallet or create an account to start borrowing, lending, or learning.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/borrow"
              className="px-6 py-3 text-sm font-medium rounded-lg text-white transition-all duration-200"
              style={{ backgroundColor: 'hsl(var(--primary))' }}
            >
              <span className="flex items-center gap-2">
                Start Application
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
            <Link
              to="/learn"
              className="px-6 py-3 text-sm font-medium rounded-lg border transition-all duration-200"
              style={{ borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }}
            >
              Explore Education
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t" style={{ borderColor: 'hsl(var(--border))' }}>
            <div className="flex items-center justify-center gap-2 text-sm" style={{ color: 'hsl(var(--muted))' }}>
              <Wallet className="w-4 h-4" />
              <span>MetaMask, WalletConnect, Coinbase Wallet supported</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
