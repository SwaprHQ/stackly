import { PropsWithChildren } from 'react';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { chains } from './chains';
import { providers } from './providers';

const { provider } = configureChains(chains, providers);
const walletConnectProjectId = process.env.WALLETCONNECT_PROJECT_ID ? process.env.WALLETCONNECT_PROJECT_ID : "fb4b8f5f1c8ebab0c0d3f1ae09c8c9e1";

// Set up client
export const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'Stacks',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: walletConnectProjectId
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
  provider,
});

/**
 * WalletProvider
 * @param param0
 * @returns
 */
export function WalletProvider({ children }: PropsWithChildren) {
  return <WagmiConfig client={wagmiClient}>{children}</WagmiConfig>;
}
