import { ChainProviderFn } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';

const ALCHEMY_KEY = process.env.REACT_APP_ALCHEMY_KEY;

if (!ALCHEMY_KEY) {
  throw new Error('Missing REACT_APP_ALCHEMY_KEY');
}

const gnosis = jsonRpcProvider({
    rpc: () => {
    return {
      http: 'https://rpc.gnosischain.com/',
      ws: 'wss://rpc.gnosischain.com/ws',
    }
  },
})


const alchemy = alchemyProvider({ apiKey: ALCHEMY_KEY, priority: 1 });

export const providers: ChainProviderFn[] = [alchemy, gnosis];
