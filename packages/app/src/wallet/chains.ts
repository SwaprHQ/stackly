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

const goerli: Chain = {
  id: 5,
  name: 'Goerli',
  network: 'goerli',
  nativeCurrency: {
    decimals: 18,
    name: 'goerliETH',
    symbol: 'goerliETH',
  },
  rpcUrls: {
    public: { http: ['https://rpc.ankr.com/eth_goerli/'] },
    default: { http: ['https://rpc.ankr.com/eth_goerli'] },
  },
  blockExplorers: {
    default: { name: 'Goerli', url: 'https://goerli.etherscan.io' },
  },
  testnet: true,
};

export const chains: Chain[] = [goerli, gnosisChain];
