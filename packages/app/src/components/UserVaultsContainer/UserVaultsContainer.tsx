import { useEffect, useState } from 'react';

import { ChevronDown } from 'react-feather';
import { useAccount, useNetwork } from 'wagmi';
import { getUserOrders, getSubgraphEndpoint, ChainId } from 'dca-sdk';
import styled from 'styled-components';
import { Container, ContainerTitle } from '../Container';
import { SubgraphOrder } from './types';
import { GraphQLClient } from 'graphql-request';
import { Card, CardInnerWrapper } from '../Card';
import { getExplorerLink } from '../../utils';
import { calculateAveragePrice, getCOWOrders } from './AveragePrice';
import { formatUnits } from '@ethersproject/units';

function OrderContainer({ order }: { order: SubgraphOrder }) {
  const { chain } = useNetwork();
  const [fundsUsed, setFundsUsed] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [averagePrice, setAveragePrice] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [totalBuyAmount, setTotalBuyAmount] = useState(0);

  const handleShowDetails = () => {
    setShowDetails(!showDetails);
  };

  useEffect(() => {
    getCOWOrders(
      order.id, // order.id is the contract address
      chain?.id as ChainId
    ).then((cowOrders) => {
      // Funds used
      const nextFundsUsed = cowOrders.reduce((acc, cowOrder) => {
        return (
          acc +
          parseFloat(
            formatUnits(cowOrder.executedSellAmount, order.sellToken.decimals)
          )
        );
      }, 0);
      const nextAveragePrice = calculateAveragePrice(order, cowOrders);
      const nextTotalBuyAmount = cowOrders.reduce((acc, cowOrder) => {
        return (
          acc +
          parseFloat(
            formatUnits(cowOrder.executedBuyAmount, order.buyToken.decimals)
          )
        );
      }, 0);
      setFundsUsed(nextFundsUsed);
      setAveragePrice(nextAveragePrice);
      setTotalBuyAmount(nextTotalBuyAmount);
      setIsLoading(false);
    });
  }, [chain, order]);

  return (
    <OrderContainerWrapper>
      <div>
        <OrderTitle
          href={getExplorerLink(chain?.id || 1, order.id, 'address')}
          target="_blank"
          rel="noreferrer"
        >
          <h2>{order.id.slice(2, 8)}</h2>
        </OrderTitle>
        <div>
          {fundsUsed.toFixed(2)} /{' '}
          {parseFloat(
            formatUnits(order.principal, order.sellToken.decimals)
          ).toFixed(2)}{' '}
          {order.sellToken.symbol}
        </div>
        <div>
          {averagePrice.toFixed(2)} {order.buyToken.symbol} /{' '}
          {order.sellToken.symbol}
        </div>
        <TotalBuyAmount>
          {totalBuyAmount.toFixed(2)} {order.buyToken.symbol}
        </TotalBuyAmount>
      </div>
      <ToggleShowDetailsButton onClick={handleShowDetails} />
    </OrderContainerWrapper>
  );
}

const ToggleShowDetailsButton = styled(ChevronDown)`
  position: absolute;
  right: 32px;
  cursor: pointer;
  top: 0px;
  bottom: 0;
  margin: auto;
`;

const OrderContainerWrapper = styled.div`
  margin-bottom: 16px;
  background: #ece4d5;
  border-radius: 22px;
  padding: 32px;
  position: relative;
  > div {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    @media (min-width: 768px) {
      flex-direction: row;
      margin-right: 44px;
    }
    /** Details */
    font-size: 14px;
    font-weight: 700;
  }
`;

const TotalBuyAmount = styled.div`
  font-size: 24px;
`;

function ActiveOrderList({ orders }: { orders: SubgraphOrder[] }) {
  return (
    <OrderListCard>
      <CardInnerWrapper>
        <OrderListHeader>
          <h5>Stack</h5>
          <h5>Used Funds</h5>
          <h5>Avg. Price</h5>
          <h5>Stacked</h5>
        </OrderListHeader>
        {orders.map((order) => (
          <OrderContainer key={order.id} order={order} />
        ))}
      </CardInnerWrapper>
    </OrderListCard>
  );
}

export function UserVaultsContainer() {
  const { chain } = useNetwork();
  const account = useAccount();
  const [userOrders, setUserOrders] = useState<SubgraphOrder[]>([]);

  useEffect(() => {
    if (!account.isConnected || chain?.unsupported) {
      return;
    }

    try {
      getUserOrders(
        new GraphQLClient(getSubgraphEndpoint(chain?.id ?? 1)),
        account.address as string
      ).then((vaults) => {
        setUserOrders(vaults.filter((vault) => vault.cancelledAt === null));
      });
    } catch (e) {
      console.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain, account.address]);

  if (!account.isConnected) {
    return (
      <Container>
        <ContainerTitle>Connect your wallet</ContainerTitle>
      </Container>
    );
  }

  return (
    <Container>
      <ContainerTitle>Active Stacks</ContainerTitle>
      <ActiveOrderList orders={userOrders} />
    </Container>
  );
}

// So that the shadow is not cut off
const OrderListCard = styled(Card)`
  margin-right: 16px;
  background: #fbf4e6;
`;

const OrderListHeader = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 16px;
  h5 {
    font-size: 14px;
    font-weight: 500;
  }
`;

const OrderTitle = styled.a`
  font-weight: 700;
  text-transform: uppercase;
  text-decoration: none;
  color: #000;
  &:hover {
    text-decoration: underline;
  }
  &,
  & > * {
    font-size: 24px;
  }
`;