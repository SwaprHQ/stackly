export const config: Record<
  string,
  {
    orderFactory: {
      address: string;
      startBlock: number;
    };
  }
> = {
  xdai: {
    orderFactory: {
      address: '0x40CF89E715F1fA37799fC3a17681a4C6a7bdfdd0',
      startBlock: 26488660,
    },
  },
  mainnet: {
    orderFactory: {
      address: '0x40CF89E715F1fA37799fC3a17681a4C6a7bdfdd0', // TODO: update this
      startBlock: 16816896,
    },
  },
};
