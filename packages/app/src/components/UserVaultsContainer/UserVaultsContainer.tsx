import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { getUserVaults } from 'dca-sdk';
import styled from 'styled-components';
import { Container, ContainerTitle } from '../Container';
import { VaultCardContainer } from './VaultCardContainer';
import { SubgraphVault } from './types';

export function UserVaultsContainer() {
  const account = useAccount();
  const [userVaults, setUserVaults] = useState<SubgraphVault[]>([]);

  useEffect(() => {
    if (!account) {
      return;
    }
    getUserVaults(account.address as string).then((vaults) => {
      setUserVaults(vaults.filter((vault) => vault.cancelledAt === null));
    });
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
      <ContainerTitle>Your Vaults</ContainerTitle>
      <VaultGridList>
        {userVaults.map((vault) => (
          <VaultCardContainer
            key={`${vault.id}-${vault.token.id}`}
            vault={vault}
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
