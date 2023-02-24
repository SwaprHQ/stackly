import { Currency } from './Currency';
import { NativeCurrency } from './NativeCurrency';
import { WXDAI } from './defaultTokens';
/**
 * xDAI is the native currency of the Gnosis Chain chain
 */
export class xDAI extends NativeCurrency {
  constructor() {
    super(100, 18, 'xDAI', 'xDAI');
  }

  get wrapped() {
    return WXDAI;
  }

  /**
   * Returns true if the two tokens are equivalent, i.e. have the same chainId and address.
   * @param other other token to compare
   */
  public equals(other: Currency): boolean {
    return other.isNative && this.chainId === other.chainId && this.address === other.address;
  }
}
