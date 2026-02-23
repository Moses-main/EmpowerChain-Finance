import { useState } from 'react'
import { Menu, X, Wallet, ChevronDown } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAccount, useConnect, useDisconnect } from 'wagmi'

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showWalletMenu, setShowWalletMenu] = useState(false)
  const location = useLocation()
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const isActive = (path: string) => location.pathname === path

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Borrow', path: '/borrow' },
    { label: 'Lend', path: '/lend' },
    { label: 'Learn', path: '/learn' },
    { label: 'Dashboard', path: '/dashboard' },
  ]

  const formatAddress = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

  const handleConnect = (connector: any) => {
    connect({ connector })
    setShowWalletMenu(false)
  }

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
            {isConnected && address ? (
              <div className="relative">
                <button
                  onClick={() => setShowWalletMenu(!showWalletMenu)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border"
                  style={{ borderColor: 'hsl(var(--border))', backgroundColor: 'hsl(var(--card))' }}
                >
                  <Wallet className="w-4 h-4" style={{ color: 'hsl(var(--primary))' }} />
                  <span>{formatAddress(address)}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
                {showWalletMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg border shadow-lg py-1" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                    <button
                      onClick={() => { disconnect(); setShowWalletMenu(false) }}
                      className="w-full px-4 py-2 text-sm text-left hover:bg-opacity-50"
                      style={{ color: 'hsl(var(--foreground))' }}
                    >
                      Disconnect
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowWalletMenu(!showWalletMenu)}
                  className="px-4 py-2 text-sm font-medium rounded-lg text-white transition-all duration-200"
                  style={{ backgroundColor: 'hsl(var(--primary))' }}
                >
                  Connect Wallet
                </button>
                {showWalletMenu && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg border shadow-lg py-1" style={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))' }}>
                    <div className="px-4 py-2 text-xs font-medium" style={{ color: 'hsl(var(--muted))' }}>Select wallet</div>
                    {connectors.map((connector) => (
                      <button
                        key={connector.uid}
                        onClick={() => handleConnect(connector)}
                        className="w-full px-4 py-2.5 text-sm text-left hover:bg-opacity-50 transition-colors"
                        style={{ color: 'hsl(var(--foreground))' }}
                      >
                        {connector.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
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
            <div className="pt-2">
              {isConnected && address ? (
                <button
                  onClick={() => { disconnect(); setMobileMenuOpen(false) }}
                  className="w-full px-4 py-3 text-sm font-medium rounded-lg border"
                  style={{ borderColor: 'hsl(var(--border))' }}
                >
                  Disconnect ({formatAddress(address)})
                </button>
              ) : (
                <button
                  onClick={() => { setShowWalletMenu(!showWalletMenu); setMobileMenuOpen(false) }}
                  className="w-full px-4 py-3 text-sm font-medium rounded-lg text-white"
                  style={{ backgroundColor: 'hsl(var(--primary))' }}
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
