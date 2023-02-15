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
      address: '0x6fee18b2d1373304246bf7fdf734a4c539cc8566',
      startBlock: 26488660,
    },
  },
  mainnet: {
    orderFactory: {
      address: '0x6fee18b2d1373304246bf7fdf734a4c539cc8566', // TODO: update this
      startBlock: 16816896,
    },
  },
};
