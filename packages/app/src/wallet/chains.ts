import { Chain } from 'wagmi';

const gnosisChain: Chain = {
  id: 100,
  name: 'Gnosis',
  network: 'gnosis',
  nativeCurrency: {
    decimals: 18,
    name: 'xDAI',
    symbol: 'xDAI',
  },
  rpcUrls: {
    public: { http: ['https://rpc.gnosischain.com/'] },
    default: { http: ['https://rpc.gnosischain.com/'] },
  },
  blockExplorers: {
    default: { name: 'Gnosis', url: 'https://gnosisscan.io' },
  },
  testnet: false,
};

export const chains: Chain[] = [gnosisChain];
