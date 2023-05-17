import { useEffect, useMemo, useState } from 'react';

import { useAccount, useNetwork } from 'wagmi';
import { getUserOrders, getSubgraphEndpoint } from 'dca-sdk';
import styled from 'styled-components';
import { Container, ContainerTitle } from '../Container';
import { SubgraphOrder } from './types';
import { GraphQLClient } from 'graphql-request';
import { Card, CardInnerWrapper } from '../Card';
import { UserOrder } from './UserOrder';
import dayjs from 'dayjs';

function OrderList({ orders, type }: { orders: SubgraphOrder[]; type: string }) {
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
          <UserOrder key={order.id} order={order} type={type} />
        ))}
      </CardInnerWrapper>
    </OrderListCard>
  );
}

function ActiveOrderList({ orders }: { orders: SubgraphOrder[] }) {
  return (
    <>
      <ContainerTitle>Active Stacks</ContainerTitle>
      <OrderList orders={orders} type={'active'} />
    </>
  );
}

function FinishedOrderList({ orders }: { orders: SubgraphOrder[] }) {
  return (
    <>
      <ContainerTitle>Finished Stacks</ContainerTitle>
      <OrderList orders={orders} type={'finished'} />
    </>
  );
}

export function UserOrdersContainer() {
  const { chain } = useNetwork();
  const account = useAccount();
  const [userOrders, setUserOrders] = useState<SubgraphOrder[]>([]);

  useEffect(() => {
    if (!account.isConnected || chain?.unsupported) {
      return;
    }

    try {
      const graphqlClient = new GraphQLClient(getSubgraphEndpoint(chain?.id ?? 1));

      getUserOrders(graphqlClient, account.address as string).then((vaults) => {
        setUserOrders(vaults.filter((vault) => vault.cancelledAt === null));
      });
    } catch (e) {
      console.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chain, account.address]);

  const [activeOrders, finishedOrders] = useMemo(() => {
    const now = dayjs.utc().unix();

    return userOrders.reduce(
      (acc, order) => {
        // A finished order is either cancelled or the end time has passed
        if (order.cancelledAt !== null) {
          acc[1].push(order);
        } else if (order.endTime < now) {
          acc[1].push(order);
        } else {
          acc[0].push(order);
        }

        return acc;
      },
      [[], []] as [SubgraphOrder[], SubgraphOrder[]]
    );
  }, [userOrders]);

  if (!account.isConnected) {
    return (
      <Container>
        <ContainerTitle>Connect your wallet</ContainerTitle>
      </Container>
    );
  }

  return (
    <Container>
      <ActiveOrderList orders={activeOrders} />
      <FinishedOrderList orders={finishedOrders} />
    </Container>
  );
}

// So that the shadow is not cut off
const OrderListCard = styled(Card)`
  margin-right: 16px;
  background: #fbf4e6;
`;

const OrderListHeader = styled.div`
  display: none;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 16px;
  h5 {
    font-size: 14px;
    font-weight: 500;
  }
  @media (min-width: 768px) {
    display: flex;
  }
`;
