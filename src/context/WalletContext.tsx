import { WagmiProvider, createConfig, http, injected } from 'wagmi'
import { coinbaseWallet, walletConnect } from 'wagmi/connectors'
import { mainnet, polygon, polygonAmoy } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { createContext, useContext, useMemo } from 'react'
import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'

const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

const connectors = [
  injected(),
  coinbaseWallet({ appName: 'EmpowerChain Finance' }),
  ...(walletConnectProjectId
    ? [walletConnect({ projectId: walletConnectProjectId, showQrModal: true })]
    : []),
]

const config = createConfig({
  chains: [mainnet, polygon, polygonAmoy],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [polygonAmoy.id]: http(),
  },
  connectors,
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
  isSupportedNetwork: boolean
  recommendedChainId: number
}

const WalletContext = createContext<WalletContextType | null>(null)

function WalletInner({ children }: { children: ReactNode }) {
  const { address, isConnected, chainId } = useAccount()
  const { connect, connectors: availableConnectors, isPending: isConnecting } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()

  const recommendedChainId = polygonAmoy.id
  const supportedChainIds = useMemo(() => config.chains.map((chain) => chain.id), [])
  const isSupportedNetwork = !chainId || supportedChainIds.includes(chainId as number)

  const handleConnect = () => {
    const connector = availableConnectors.find((c) => c.type === 'injected') || availableConnectors[0]
    if (connector) {
      connect({ connector })
    }
  }

  const handleSwitchNetwork = (targetChainId: number) => {
    switchChain({ chainId: targetChainId as 1 | 137 | 80002 })
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
        isSupportedNetwork,
        recommendedChainId,
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
