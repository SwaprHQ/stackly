import { formatUnits } from '@ethersproject/units';
import { useEffect, useState } from 'react';
import { useNetwork } from 'wagmi';

import type { OrderMetaData } from '@cowprotocol/cow-sdk'; // Should probably use the COW SDK instance
import { ChainId } from 'dca-sdk';
import { SubgraphOrder } from './types';

const COW_API_BASE_URL: Readonly<Record<ChainId, string>> = {
  [ChainId.ETHEREUM]: `https://api.cow.fi/mainnet/api/v1`,
  [ChainId.GNOSIS]: `https://api.cow.fi/xdai/api/v1`,
};

/**
 * Fetches the COW orders for a given user address
 * @param userAddress The user address
 * @param chainId The chain id
 * @returns
 */
export async function getCOWOrders(userAddress: string, chainId: number): Promise<OrderMetaData[]> {
  userAddress = userAddress.toLowerCase();
  const fetchURL = `${COW_API_BASE_URL[chainId as ChainId]}/account/${userAddress}/orders/?limit=500`;
  return fetch(fetchURL).then((res) => res.json() as Promise<OrderMetaData[]>);
}

/**
 * Given an order and a list of COW orders, calculates the average price
 * @param order the original Order from DCA protocol
 * @param cowOrders the COW orders array
 * @returns the average price as a float
 */
export function calculateAveragePrice(order: SubgraphOrder, cowOrders: OrderMetaData[]) {
  const executionPriceList = cowOrders.map((cowOrder) => {
    if (cowOrder.executedBuyAmount === '0') return 0;

    return (
      parseFloat(formatUnits(cowOrder.executedSellAmount, order.sellToken.decimals)) /
      parseFloat(formatUnits(cowOrder.executedBuyAmount, order.buyToken.decimals))
    );
  });

  // Reduce to the average price
  const nextAveragePrice = executionPriceList.reduce((a, b) => a + b) / cowOrders.length;

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
      {averagePrice.toFixed(2)} {order.buyToken.symbol} / {order.sellToken.symbol}
    </>
  );
}
