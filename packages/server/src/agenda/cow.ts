import axios from 'axios';
import { ChainId } from 'dca-sdk';

export enum OrderKind {
  SELL = 'sell',
  BUY = 'buy',
}

interface SharedOrderParams {
  appData: string;
  buyToken: string;
  partiallyFillable: boolean;
  kind: OrderKind;
  sellToken: string;
  receiver: string;
  validTo: number;
}

export type CowQuoteRequestParams = SharedOrderParams & {
  buyToken: string;
  from: string;
  sellToken: string;
  sellAmountBeforeFee: string;
};

export interface CowQuoteResponse {
  quote: SharedOrderParams & {
    sellAmount: string;
    buyAmount: string;
    feeAmount: string;
    sellTokenBalance: 'erc20';
    buyTokenBalance: 'erc20';
    signingScheme: 'eip712';
  };
  from: string;
  expiration: string;
  id: number;
}

export type CowOrderParams = Omit<
  CowQuoteResponse['quote'],
  'signingScheme'
> & {
  signingScheme: 'presign' | 'eip712';
  signature: string | '0x';
  from: string;
  quoteId?: number;
};

export function getCowAPIBaseURL(
  env: 'prod' | 'staging'
): Partial<Record<ChainId, string>> {
  switch (env) {
    case 'staging':
      return {
        [ChainId.ETHEREUM]: 'https://barn.api.cow.fi/mainnet/api',
        [ChainId.GNOSIS]: 'https://barn.api.cow.fi/xdai/api',
      };
    case 'prod':
      return {
        [ChainId.ETHEREUM]: 'https://api.cow.fi/mainnet/api',
        [ChainId.GNOSIS]: 'https://api.cow.fi/xdai/api',
      };

    default:
      return {};
  }
}

export async function getCOWQuote(
  chainId: ChainId,
  order: CowQuoteRequestParams
) {
  const baseURL = getCowAPIBaseURL('prod')[chainId];
  return axios
    .post<CowQuoteResponse>(baseURL + '/v1/quote', order)
    .then((res) => res.data);
}

export async function postCOWOrder(chainId: ChainId, order: CowOrderParams) {
  const baseURL = getCowAPIBaseURL('prod')[chainId];
  return axios
    .post<string>(baseURL + '/v1/orders', order)
    .then((res) => res.data);
}
