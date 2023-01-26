import { ChainId } from 'dca-sdk';

/**
 * Shorten the checksummed version of the input address to have 0x + 4 characters at start and end
 * @param address The input address
 * @param charsBefore The number of characters to show before the trimmed part
 * @param charsAfter The number of characters to show after the trimmed part
 * @returns The shortened address
 * @throws If the address is not checksummed
 */
export function shortenAddress(
  address?: string,
  charsBefore = 4,
  charsAfter = 4
): string {
  if (!address) return '';
  return `${address.substring(0, charsBefore + 2)}...${address.substring(
    42 - charsAfter
  )}`;
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

const ETHERSCAN_PREFIXES: { [chainId in ChainId | number]: string } = {
  1: '',
};

function getExplorerPrefix(chainId: ChainId) {
  switch (chainId) {
    case ChainId.GNOSIS:
      return 'https://gnosisscan.io/';
    default:
      return `https://${
        ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[1]
      }etherscan.io`;
  }
}

export function getExplorerLink(
  chainId: ChainId,
  hash: string,
  type: keyof typeof EXPLORER_LINK_TYPE
): string {
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
