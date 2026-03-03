import { WagmiProvider, createConfig, http, injected } from 'wagmi'
import { mainnet, polygon, polygonAmoy } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { createContext, useContext, useState } from 'react'
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'

const config = createConfig({
  chains: [mainnet, polygon, polygonAmoy],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [polygonAmoy.id]: http(),
  },
  connectors: [
    injected(),
  ],
})

const queryClient = new QueryClient()

interface WalletContextType {
  address: string | undefined
  isConnected: boolean
  chainId: number | undefined
  isConnecting: boolean
  connect: () => void
  disconnect: () => void
  switchNetwork: (chainId: number) => void
  supportedChains: typeof config.chains
}

const WalletContext = createContext<WalletContextType | null>(null)

function WalletInner({ children }: { children: ReactNode }) {
  const { address, isConnected, chainId } = useAccount()
  const { connect, connectors, isPending: isConnecting } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const [hasTriggeredConnect, setHasTriggeredConnect] = useState(false)

  const handleConnect = () => {
    if (!hasTriggeredConnect) {
      const connector = connectors.find(c => c.type === 'injected') || connectors[0]
      if (connector) {
        connect({ connector })
        setHasTriggeredConnect(true)
      }
    }
  }

  const handleSwitchNetwork = (targetChainId: number) => {
    switchChain({ chainId: targetChainId })
  }

  return (
    <WalletContext.Provider
      value={{
        address,
        isConnected,
        chainId,
        isConnecting,
        connect: handleConnect,
        disconnect,
        switchNetwork: handleSwitchNetwork,
        supportedChains: config.chains,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider')
  }
  return context
}

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <WalletInner>{children}</WalletInner>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export { useAccount, useConnect, useDisconnect, useBalance, useSwitchChain } from 'wagmi'
