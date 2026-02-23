import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
      <div className="container-wide py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--primary))' }}>
                <span className="text-white font-semibold text-sm">EC</span>
              </div>
              <div>
                <div className="text-sm font-medium text-[hsl(var(--foreground))]">EmpowerChain</div>
                <div className="text-xs" style={{ color: 'hsl(var(--muted))' }}>Decentralized microfinance</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'hsl(var(--muted))' }}>Transparent, inclusive financing for entrepreneurs worldwide.</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-4">Product</h4>
            <nav className="flex flex-col gap-2.5 text-sm">
              <Link to="/borrow" className="transition-colors duration-200" style={{ color: 'hsl(var(--muted))' }}>For Borrowers</Link>
              <Link to="/lend" className="transition-colors duration-200" style={{ color: 'hsl(var(--muted))' }}>For Lenders</Link>
              <Link to="/learn" className="transition-colors duration-200" style={{ color: 'hsl(var(--muted))' }}>Financial Literacy</Link>
            </nav>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-4">Company</h4>
            <nav className="flex flex-col gap-2.5 text-sm">
              <a href="#about" className="transition-colors duration-200" style={{ color: 'hsl(var(--muted))' }}>About</a>
              <a href="#impact" className="transition-colors duration-200" style={{ color: 'hsl(var(--muted))' }}>Impact</a>
              <a href="#blog" className="transition-colors duration-200" style={{ color: 'hsl(var(--muted))' }}>Blog</a>
            </nav>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-4">Legal</h4>
            <nav className="flex flex-col gap-2.5 text-sm">
              <a href="#privacy" className="transition-colors duration-200" style={{ color: 'hsl(var(--muted))' }}>Privacy</a>
              <a href="#terms" className="transition-colors duration-200" style={{ color: 'hsl(var(--muted))' }}>Terms</a>
              <a href="#security" className="transition-colors duration-200" style={{ color: 'hsl(var(--muted))' }}>Security</a>
            </nav>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t" style={{ borderColor: 'hsl(var(--border))' }}>
          <div className="flex items-center gap-4">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="transition-colors duration-200" style={{ color: 'hsl(var(--muted))' }}>
              <Github className="w-5 h-5" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="transition-colors duration-200" style={{ color: 'hsl(var(--muted))' }}>
              <Twitter className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="transition-colors duration-200" style={{ color: 'hsl(var(--muted))' }}>
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="mailto:hello@empowerchain.finance" aria-label="Email" className="transition-colors duration-200" style={{ color: 'hsl(var(--muted))' }}>
              <Mail className="w-5 h-5" />
            </a>
          </div>

          <div className="text-sm" style={{ color: 'hsl(var(--muted))' }}>&copy; {currentYear} EmpowerChain Finance. MIT License.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
