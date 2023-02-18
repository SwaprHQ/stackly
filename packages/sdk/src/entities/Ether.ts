import { Currency } from './Currency';
import { NativeCurrency } from './NativeCurrency';
import { WETH } from './defaultTokens';
import { ChainId } from '../constants';

/**
 * Ether is the main usage of a 'native' currency, i.e. for Ethereum mainnet and all testnets
 */
export class Ether extends NativeCurrency {
  protected constructor(chainId: number) {
    super(chainId, 18, 'ETH', 'Ether');
  }

  get wrapped() {
    const chainId = this.chainId as ChainId;
    const weth = WETH[chainId];
    if (!weth) {
      throw new Error(`No WETH available on chain ${chainId}`);
    }

    return weth;
  }

  private static _etherCache: { [chainId: number]: Ether } = {};

  static onChain(chainId: number): Ether {
    return (
      this._etherCache[chainId] ||
      (this._etherCache[chainId] = new Ether(chainId))
    );
  }

  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */
  public equals(other: Currency): boolean {
    return (
      other.isNative &&
      this.chainId === other.chainId &&
      this.address === other.address
    );
  }
}
