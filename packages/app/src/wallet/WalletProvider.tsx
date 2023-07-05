import { PropsWithChildren } from 'react';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { chains } from './chains';
import { providers } from './providers';

const { provider } = configureChains(chains, providers);

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
