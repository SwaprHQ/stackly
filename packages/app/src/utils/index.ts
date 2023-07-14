import { ChainId, Currency } from 'dca-sdk';

/**
 * Shorten the checksummed version of the input address to have 0x + 4 characters at start and end
 * @param address The input address
 * @param charsBefore The number of characters to show before the trimmed part
 * @param charsAfter The number of characters to show after the trimmed part
 * @returns The shortened address
 * @throws If the address is not checksummed
 */
export function shortenAddress(address?: string, charsBefore = 4, charsAfter = 4): string {
  if (!address) return '';
  return `${address.substring(0, charsBefore + 2)}...${address.substring(42 - charsAfter)}`;
}

export const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 3,
});

export const EXPLORER_LINK_TYPE: Record<string, string> = {
  transaction: 'transaction',
  token: 'token',
  address: 'address',
  block: 'block',
};

export enum ExplorerDataType {
  TRANSACTION = 'transaction',
  TOKEN = 'token',
  ADDRESS = 'address',
  BLOCK = 'block',
}

const ETHERSCAN_PREFIXES: { [chainId in ChainId | number]: string } = {
  [ChainId.ETHEREUM]: '',
  [ChainId.GOERLI]: 'goerli.',
};

function getExplorerPrefix(chainId: ChainId) {
  switch (chainId) {
    case ChainId.GNOSIS:
      return 'https://gnosisscan.io';
    default:
      return `https://${ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]}etherscan.io`;
  }
}

export function getExplorerLink(chainId: ChainId, hash: string, type: keyof typeof EXPLORER_LINK_TYPE): string {
  const prefix = getExplorerPrefix(chainId);
  switch (type) {
    case EXPLORER_LINK_TYPE.transaction: {
      return `${prefix}/tx/${hash}`;
    }
    case EXPLORER_LINK_TYPE.token: {
      return `${prefix}/token/${hash}`;
    }
    case EXPLORER_LINK_TYPE.block: {
      return `${prefix}/block/${hash}`;
    }
    case EXPLORER_LINK_TYPE.address:
    default: {
      return `${prefix}/address/${hash}`;
    }
  }
}

/**
 * Given a URI that may be ipfs, ipns, http, or https protocol, return the fetch-able http(s) URLs for the same content
 * @param uri to convert to fetch-able http url
 */
export function uriToHttp(uri: string): string[] {
  const protocol = uri.split(':')[0].toLowerCase();
  switch (protocol) {
    case 'https':
      return [uri];
    case 'http':
      return ['https' + uri.substr(4), uri];
    case 'ipfs':
      const hash = uri.match(/^ipfs:(\/\/)?(.*)$/i)?.[2];
      return [`https://ipfs.io/ipfs/${hash}/`, `https://ipfs.io/ipfs/${hash}/`];
    case 'ipns':
      const name = uri.match(/^ipns:(\/\/)?(.*)$/i)?.[2];
      return [`https://cloudflare-ipfs.com/ipns/${name}/`, `https://ipfs.io/ipns/${name}/`];
    default:
      return [];
  }
}

/**
 * Returns the checksummed address if the address is valid, otherwise returns false
 * @param currency
 * @returns
 */
export function currencyId(currency: Currency): string {
  if (currency.isNative) return `${currency.chainId}-ETH`;
  if (currency.isToken) return `${currency.chainId}-${currency.address}`;
  throw new Error('invalid currency');
}
