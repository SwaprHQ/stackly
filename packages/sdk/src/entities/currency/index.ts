import { getAddress, isAddress } from '@ethersproject/address';
import { ChainId, NATIVE_TOKEN_ADDRESS } from '../../constants';
import { enforce } from '../../utils/invariant';

export class Currency {
  public static USD = new Currency(
    '0x0000000000000000000000000000000000000000',
    'USD',
    18
  );
  public static ETH = new Currency(NATIVE_TOKEN_ADDRESS, 'ETH', 18);
  public static XDAI = new Currency(NATIVE_TOKEN_ADDRESS, 'XDAI', 18);
  private static readonly NATIVE_CURRENCY: Record<ChainId, Currency> = {
    [ChainId.ETHEREUM]: Currency.ETH,
    [ChainId.GNOSIS]: Currency.XDAI,
  };

  protected constructor(
    public readonly address: string,
    public readonly symbol: string,
    public readonly decimals: number
  ) {
    enforce(isAddress(address), `${address} is not a valid address.`);
    this.address = getAddress(address);
  }

  public static getNative(chainId: ChainId) {
    return Currency.NATIVE_CURRENCY[chainId];
  }
}
