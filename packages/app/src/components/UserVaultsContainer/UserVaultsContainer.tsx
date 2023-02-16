import { useEffect, useState } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { getUserOrders, getSubgraphEndpoint } from 'dca-sdk';
import styled from 'styled-components';
import { Container, ContainerTitle } from '../Container';
import { VaultCardContainer } from './VaultCardContainer';
import { SubgraphOrder } from './types';
import { GraphQLClient } from 'graphql-request';

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
  }, [account.address]);

  if (!account.isConnected) {
    return (
      <Container>
        <ContainerTitle>Connect your wallet</ContainerTitle>
      </Container>
    );
  }

  return (
    <Container>
      <ContainerTitle>Your Stacks</ContainerTitle>
      <VaultGridList>
        {userOrders.map((order) => (
          <VaultCardContainer
            key={`${order.id}-${order.sellToken.id}-${order.buyToken.id}`}
            order={order}
          />
        ))}
      </VaultGridList>
    </Container>
  );
}

const VaultGridList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 24px;
  @media (min-width: 480px) {
    flex-direction: row;
    flex-wrap: wrap;
  }
`;
