import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Borrow', path: '/borrow' },
    { label: 'Lend', path: '/lend' },
    { label: 'Learn', path: '/learn' },
    { label: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b" style={{ borderColor: 'hsl(var(--border))' }}>
      <div className="container-wide">
        <div className="flex items-center justify-between py-4 md:py-5">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'hsl(var(--primary))' }}>
              <span className="text-white font-semibold text-sm">EC</span>
            </div>
            <div className="hidden sm:block">
              <span className="text-sm font-medium text-[hsl(var(--foreground))]">EmpowerChain</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200"
                style={{
                  color: isActive(link.path) ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                  backgroundColor: isActive(link.path) ? 'hsl(var(--primary) / 0.08)' : 'transparent',
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              className="px-4 py-2 text-sm font-medium rounded-lg text-white transition-all duration-200"
              style={{ backgroundColor: 'hsl(var(--primary))' }}
            >
              Connect Wallet
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg transition-colors"
            style={{ color: 'hsl(var(--foreground))' }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t" style={{ borderColor: 'hsl(var(--border))' }}>
          <nav className="container-wide py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-sm font-medium rounded-lg transition-colors"
                style={{
                  backgroundColor: isActive(link.path) ? 'hsl(var(--primary) / 0.08)' : 'transparent',
                  color: isActive(link.path) ? 'hsl(var(--primary))' : 'hsl(var(--foreground))',
                }}
              >
                {link.label}
              </Link>
            ))}
            <button className="mt-2 px-4 py-3 text-sm font-medium rounded-lg text-white"
              style={{ backgroundColor: 'hsl(var(--primary))' }}>
              Connect Wallet
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
