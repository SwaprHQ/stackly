import { formatUnits } from '@ethersproject/units';
import { useEffect, useState } from 'react';
import { useNetwork } from 'wagmi';
import { SubgraphOrder } from './types';

import { OrderMetaData } from '@cowprotocol/cow-sdk';
import { ChainId } from 'dca-sdk';

const COW_API_BASE_URL: Readonly<Record<ChainId, string>> = {
  [ChainId.ETHEREUM]: `https://api.cow.fi/mainnet/api/v1`,
  [ChainId.GNOSIS]: `https://api.cow.fi/xdai/api/v1`,
};

export async function getCOWOrders(
  userAddress: string,
  chainId: number
): Promise<OrderMetaData[]> {
  userAddress = userAddress.toLowerCase();

  return fetch(
    `${
      COW_API_BASE_URL[chainId as ChainId]
    }/account/${userAddress}/orders/?limit=100`
  ).then((res) => res.json() as Promise<OrderMetaData[]>);
}

export function calculateAveragePrice(
  order: SubgraphOrder,
  cowOrders: OrderMetaData[]
) {
  const executionPriceList = cowOrders.map((cowOrder) => {
    return (
      parseFloat(
        formatUnits(cowOrder.executedSellAmount, order.sellToken.decimals)
      ) /
      parseFloat(
        formatUnits(cowOrder.executedBuyAmount, order.buyToken.decimals)
      )
    );
  });

  // Reduce to the average price
  const nextAveragePrice =
    executionPriceList.reduce((a, b) => a + b) / cowOrders.length;

  return nextAveragePrice;
}

export function AveragePrice({ order }: { order: SubgraphOrder }) {
  const { chain } = useNetwork();
  const [averagePrice, setAveragePrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (chain && chain?.unsupported) {
      setAveragePrice(0);
      setIsLoading(false);
      return;
    }

    try {
      getCOWOrders(
        order.id, // order.id is the contract address
        chain?.id as ChainId
      ).then((cowOrders) => {
        const nextAveragePrice = calculateAveragePrice(order, cowOrders);
        setAveragePrice(nextAveragePrice);
        setIsLoading(false);
      });
    } catch (e) {
      console.error(e);
    }
  }, [chain, order]);

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <>
      {averagePrice.toFixed(2)} {order.buyToken.symbol} /{' '}
      {order.sellToken.symbol}
    </>
  );
}
