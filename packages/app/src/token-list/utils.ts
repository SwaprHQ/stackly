import { TokenInfo, TokenList } from '@uniswap/token-lists';
import { Token, WrappedTokenInfo } from 'dca-sdk';
import { DEFAULT_LIST_OF_LISTS } from './lists';
import { SerializedToken, TokenAddressMap } from './types';

const DEFAULT_LIST_PRIORITIES = DEFAULT_LIST_OF_LISTS.reduce<{
  [listUrl: string]: number;
}>((memo, listUrl, index) => {
  memo[listUrl] = index + 1;
  return memo;
}, {});

// use ordering of default list of lists to assign priority
export function sortByListPriority(urlA: string, urlB: string) {
  if (DEFAULT_LIST_PRIORITIES[urlA] && DEFAULT_LIST_PRIORITIES[urlB]) {
    return DEFAULT_LIST_PRIORITIES[urlA] - DEFAULT_LIST_PRIORITIES[urlB];
  }
  return 0;
}

type Mutable<T> = {
  -readonly [P in keyof T]: Mutable<T[P]>;
};

/**
 * Combine the tokens in map2 with the tokens on map1, where tokens on map1 take precedence
 * @param map1 the base token map
 * @param map2 the map of additioanl tokens to add to the base map
 */
export function combineMaps(
  map1: TokenAddressMap,
  map2: TokenAddressMap
): TokenAddressMap {
  const chainIds = Object.keys(
    Object.keys(map1)
      .concat(Object.keys(map2))
      .reduce<{ [chainId: string]: true }>((memo, value) => {
        memo[value] = true;
        return memo;
      }, {})
  ).map((id) => parseInt(id));

  return chainIds.reduce<Mutable<TokenAddressMap>>((memo, chainId) => {
    memo[chainId] = {
      ...map2[chainId],
      // map1 takes precedence
      ...map1[chainId],
    };
    return memo;
  }, {}) as TokenAddressMap;
}

type TokenMap = Readonly<{
  [tokenAddress: string]: { token: WrappedTokenInfo; list?: TokenList };
}>;
export type ChainTokenMap = Readonly<{ [chainId: number]: TokenMap }>;

const mapCache =
  typeof WeakMap !== 'undefined'
    ? new WeakMap<TokenList | TokenInfo[], ChainTokenMap>()
    : null;

export function tokensToChainTokenMap(
  tokens: TokenList | TokenInfo[]
): ChainTokenMap {
  const cached = mapCache?.get(tokens);
  if (cached) return cached;

  const [list, infos] = Array.isArray(tokens)
    ? [undefined, tokens]
    : [tokens, tokens.tokens];
  const map = infos.reduce<Mutable<ChainTokenMap>>((map, info) => {
    try {
      const token = new WrappedTokenInfo(info, list);
      if (map[token.chainId]?.[token.address] !== undefined) {
        console.warn(`Duplicate token skipped: ${token.address}`);
        return map;
      }
      if (!map[token.chainId]) {
        map[token.chainId] = {};
      }
      map[token.chainId][token.address] = { token, list };
      return map;
    } catch {
      return map;
    }
  }, {}) as ChainTokenMap;
  mapCache?.set(tokens, map);
  return map;
}

/**
 * Serialize a token to a plain JS object
 * @param token
 * @returns
 */
export function serializeToken(token: Token): SerializedToken {
  return {
    chainId: token.chainId,
    address: token.address,
    decimals: token.decimals,
    symbol: token.symbol,
    name: token.name,
  };
}

/**
 * Deserialize a token from a plain JS object
 * @param serializedToken the serialized token object
 * @param Class the class to deserialize to
 * @returns
 */
export function deserializeToken(
  serializedToken: SerializedToken,
  Class: typeof Token = Token
): Token {
  return new Class(
    serializedToken.chainId,
    serializedToken.address,
    serializedToken.decimals,
    serializedToken.symbol,
    serializedToken.name
  );
}


/**
 * Check if a token is on a list
 * @param chainTokenMap the token map
 * @param token the token to check
 * @returns
 */
export function isTokenOnList(chainTokenMap: ChainTokenMap, token?: Token): boolean {
  return Boolean(token?.isToken && chainTokenMap[token.chainId]?.[token.address])
}
