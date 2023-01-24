import { Currency } from '../currency';
import { enforce } from '../../utils/invariant';
import { ChainId } from '../../constants';

export class Token extends Currency {
  public constructor(
    public readonly chainId: ChainId,
    public readonly address: string,
    decimals: number,
    symbol: string
  ) {
    super(address, symbol, decimals);
  }

  public static getNativeWrapper(chainId: ChainId) {
    const wrapper: Record<ChainId, Token> = {
      [ChainId.ETHEREUM]: WETH[ChainId.ETHEREUM],
      [ChainId.GNOSIS]: WXDAI,
    };
    return wrapper[chainId];
  }

  public equals(other: Token): boolean {
    return (
      this === other ||
      (this.chainId === other.chainId && this.address === other.address)
    );
  }

  public sort(other: Token): [Token, Token] {
    enforce(this.chainId === other.chainId, 'inconsistent chain ids');
    enforce(this.address !== other.address, 'same token');
    return this.address.toLowerCase() < other.address.toLowerCase()
      ? [this, other]
      : [other, this];
  }
}

export function currencyEquals(
  currencyA: Currency,
  currencyB: Currency
): boolean {
  if (currencyA instanceof Token && currencyB instanceof Token)
    return currencyA.equals(currencyB);
  else if (currencyA instanceof Token) return false;
  else if (currencyB instanceof Token) return false;
  else return currencyA === currencyB;
}

export const USDC: Readonly<Record<ChainId, Token>> = {
  [ChainId.ETHEREUM]: new Token(
    ChainId.ETHEREUM,
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    6,
    'USDC'
  ),
  [ChainId.GNOSIS]: new Token(
    ChainId.GNOSIS,
    '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83',
    6,
    'USDC'
  ),
};

export const SETH2 = new Token(
  ChainId.ETHEREUM,
  '0xFe2e637202056d30016725477c5da089Ab0A043A',
  18,
  'sETH2'
);

export const RETH2 = new Token(
  ChainId.ETHEREUM,
  '0x20bc832ca081b91433ff6c17f85701b6e92486c5',
  18,
  'rETH2'
);

export const WETH: Readonly<Record<ChainId, Token>> = {
  [ChainId.ETHEREUM]: new Token(
    ChainId.ETHEREUM,
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    18,
    'WETH'
  ),
  [ChainId.GNOSIS]: new Token(
    ChainId.GNOSIS,
    '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1',
    18,
    'WETH'
  ),
};

export const SWPR: Readonly<Record<ChainId, Token>> = {
  [ChainId.ETHEREUM]: new Token(
    ChainId.ETHEREUM,
    '0x6cacdb97e3fc8136805a9e7c342d866ab77d0957',
    18,
    'SWPR'
  ),
  [ChainId.GNOSIS]: new Token(
    ChainId.GNOSIS,
    '0x532801ed6f82fffd2dab70a19fc2d7b2772c4f4b',
    18,
    'SWPR'
  ),
};

export const WXDAI = new Token(
  ChainId.GNOSIS,
  '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d',
  18,
  'WXDAI'
);

export const DAI = new Token(
  ChainId.ETHEREUM,
  '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  18,
  'DAI'
);

export const GNO: Record<ChainId, Token> = {
  [ChainId.ETHEREUM]: new Token(
    ChainId.ETHEREUM,
    '0x6810e776880c02933d47db1b9fc05908e5386b96',
    18,
    'GNO'
  ),
  [ChainId.GNOSIS]: new Token(
    ChainId.GNOSIS,
    '0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb',
    18,
    'GNO'
  ),
};

export const DXD: Record<ChainId, Token> = {
  [ChainId.ETHEREUM]: new Token(
    ChainId.ETHEREUM,
    '0xa1d65E8fB6e87b60FECCBc582F7f97804B725521',
    18,
    'DXD'
  ),
  [ChainId.GNOSIS]: new Token(
    ChainId.GNOSIS,
    '0xb90d6bec20993be5d72a5ab353343f7a0281f158',
    18,
    'DXD'
  ),
};

export const WBTC: Record<ChainId, Token> = {
  [ChainId.ETHEREUM]: new Token(
    ChainId.ETHEREUM,
    '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    8,
    'WBTC'
  ),
  [ChainId.GNOSIS]: new Token(
    ChainId.GNOSIS,
    '0x8e5bbbb09ed1ebde8674cda39a0c169401db4252',
    8,
    'WBTC'
  ),
};

export const DPI: Record<ChainId, Token> = {
  [ChainId.ETHEREUM]: new Token(
    ChainId.ETHEREUM,
    '0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b',
    18,
    'DPI'
  ),
  [ChainId.GNOSIS]: new Token(
    ChainId.GNOSIS,
    '0xd3d47d5578e55c880505dc40648f7f9307c3e7a8',
    18,
    'DPI'
  ),
};

export const STETH = new Token(
  ChainId.ETHEREUM,
  '0xae7ab96520de3a18e5e111b5eaab095312d7fe84',
  18,
  'stETH'
);

export const RETH = new Token(
  ChainId.ETHEREUM,
  '0xae78736cd615f374d3085123a210448e74fc6393',
  18,
  'rETH'
);

export const USDT = new Token(
  ChainId.ETHEREUM,
  '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  6,
  'USDT'
);

export const LUSD = new Token(
  ChainId.ETHEREUM,
  '0x5f98805A4E8be255a32880FDeC7F6728C6568bA0',
  18,
  'LUSD'
);

export const SUSD = new Token(
  ChainId.ETHEREUM,
  '0x57ab1ec28d129707052df4df418d58a2d46d5f51',
  18,
  'SUSD'
);

export const ENS = new Token(
  ChainId.ETHEREUM,
  '0xc18360217d8f7ab5e7c516566761ea12ce7f9d72',
  18,
  'ENS'
);
