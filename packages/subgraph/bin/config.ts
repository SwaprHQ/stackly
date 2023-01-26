export const config: Record<
  string,
  {
    vaultFactory: {
      address: string;
      startBlock: number;
    };
  }
> = {
  xdai: {
    vaultFactory: {
      address: '0x49ba0d56f7323B102bCb7a1A1b24D17FE4fF6F25',
      startBlock: 26116896,
    },
  },
  mainnet: {
    vaultFactory: {
      address: '0x49ba0d56f7323B102bCb7a1A1b24D17FE4fF6F25', // TODO: update this
      startBlock: 16816896,
    },
  },
};