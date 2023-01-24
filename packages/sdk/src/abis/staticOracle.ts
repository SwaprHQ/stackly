export const STATIC_ORACLE_ABI = [
  {
    inputs: [
      {
        internalType: 'contract IUniswapV3Factory',
        name: '_UNISWAP_V3_FACTORY',
        type: 'address',
      },
      {
        internalType: 'uint8',
        name: '_CARDINALITY_PER_MINUTE',
        type: 'uint8',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'CARDINALITY_PER_MINUTE',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'UNISWAP_V3_FACTORY',
    outputs: [
      {
        internalType: 'contract IUniswapV3Factory',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint24',
        name: '_feeTier',
        type: 'uint24',
      },
    ],
    name: 'addNewFeeTier',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_tokenA',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_tokenB',
        type: 'address',
      },
    ],
    name: 'getAllPoolsForPair',
    outputs: [
      {
        internalType: 'address[]',
        name: '',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_tokenA',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_tokenB',
        type: 'address',
      },
    ],
    name: 'isPairSupported',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_tokenA',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_tokenB',
        type: 'address',
      },
      {
        internalType: 'uint16',
        name: '_cardinality',
        type: 'uint16',
      },
    ],
    name: 'prepareAllAvailablePoolsWithCardinality',
    outputs: [
      {
        internalType: 'address[]',
        name: '_preparedPools',
        type: 'address[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_tokenA',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_tokenB',
        type: 'address',
      },
      {
        internalType: 'uint32',
        name: '_period',
        type: 'uint32',
      },
    ],
    name: 'prepareAllAvailablePoolsWithTimePeriod',
    outputs: [
      {
        internalType: 'address[]',
        name: '_preparedPools',
        type: 'address[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_tokenA',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_tokenB',
        type: 'address',
      },
      {
        internalType: 'uint24[]',
        name: '_feeTiers',
        type: 'uint24[]',
      },
      {
        internalType: 'uint16',
        name: '_cardinality',
        type: 'uint16',
      },
    ],
    name: 'prepareSpecificFeeTiersWithCardinality',
    outputs: [
      {
        internalType: 'address[]',
        name: '_preparedPools',
        type: 'address[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_tokenA',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_tokenB',
        type: 'address',
      },
      {
        internalType: 'uint24[]',
        name: '_feeTiers',
        type: 'uint24[]',
      },
      {
        internalType: 'uint32',
        name: '_period',
        type: 'uint32',
      },
    ],
    name: 'prepareSpecificFeeTiersWithTimePeriod',
    outputs: [
      {
        internalType: 'address[]',
        name: '_preparedPools',
        type: 'address[]',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: '_pools',
        type: 'address[]',
      },
      {
        internalType: 'uint16',
        name: '_cardinality',
        type: 'uint16',
      },
    ],
    name: 'prepareSpecificPoolsWithCardinality',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: '_pools',
        type: 'address[]',
      },
      {
        internalType: 'uint32',
        name: '_period',
        type: 'uint32',
      },
    ],
    name: 'prepareSpecificPoolsWithTimePeriod',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint128',
        name: '_baseAmount',
        type: 'uint128',
      },
      {
        internalType: 'address',
        name: '_baseToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_quoteToken',
        type: 'address',
      },
      {
        internalType: 'uint32',
        name: '_period',
        type: 'uint32',
      },
    ],
    name: 'quoteAllAvailablePoolsWithTimePeriod',
    outputs: [
      {
        internalType: 'uint256',
        name: '_quoteAmount',
        type: 'uint256',
      },
      {
        internalType: 'address[]',
        name: '_queriedPools',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint128',
        name: '_baseAmount',
        type: 'uint128',
      },
      {
        internalType: 'address',
        name: '_baseToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_quoteToken',
        type: 'address',
      },
      {
        internalType: 'uint24[]',
        name: '_feeTiers',
        type: 'uint24[]',
      },
      {
        internalType: 'uint32',
        name: '_period',
        type: 'uint32',
      },
    ],
    name: 'quoteSpecificFeeTiersWithTimePeriod',
    outputs: [
      {
        internalType: 'uint256',
        name: '_quoteAmount',
        type: 'uint256',
      },
      {
        internalType: 'address[]',
        name: '_queriedPools',
        type: 'address[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint128',
        name: '_baseAmount',
        type: 'uint128',
      },
      {
        internalType: 'address',
        name: '_baseToken',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_quoteToken',
        type: 'address',
      },
      {
        internalType: 'address[]',
        name: '_pools',
        type: 'address[]',
      },
      {
        internalType: 'uint32',
        name: '_period',
        type: 'uint32',
      },
    ],
    name: 'quoteSpecificPoolsWithTimePeriod',
    outputs: [
      {
        internalType: 'uint256',
        name: '_quoteAmount',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'supportedFeeTiers',
    outputs: [
      {
        internalType: 'uint24[]',
        name: '',
        type: 'uint24[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
