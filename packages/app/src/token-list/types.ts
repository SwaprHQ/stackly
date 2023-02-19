import { TokenList } from '@uniswap/token-lists';
import { Token, WrappedTokenInfo } from 'dca-sdk';

export type TokenAddressMap = Readonly<{
  [chainId: number]: Readonly<{
    [tokenAddress: string]: { token: WrappedTokenInfo; list: TokenList };
  }>;
}>;

/**
 * An extension of the Token class that is only used to identify a token that has been added by the user
 */
export class UserAddedToken extends Token {}

export interface SerializedToken {
  chainId: number
  address: string
  decimals: number
  symbol?: string
  name?: string
}

export interface SerializedPair {
  token0: SerializedToken
  token1: SerializedToken
}
