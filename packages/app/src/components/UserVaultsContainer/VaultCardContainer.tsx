import { ChainId, getVaultContract, getVaultInterface } from 'dca-sdk';
import { BigNumber } from 'ethers';
import { formatUnits, Fragment } from 'ethers/lib/utils.js';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useContractRead, useNetwork, useSigner } from 'wagmi';
import { getVaultOrders } from '../../api';
import { Modal, useModal } from '../../context/Modal';
import { shortenAddress } from '../../utils';
import { Card, CardInnerWrapper } from '../Card';

import { SubgraphVault } from './types';

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  text-transform: uppercase;
  font-size: 1.5rem;
  font-weight: 700;
  height: 32px;
  &:hover {
    background-color: #000;
    color: #fff;
  }
  padding: 0.5rem 1rem;
`;
export function VaultCardContainer({ vault }: { vault: SubgraphVault }) {
  const { openModal } = useModal<{
    vault: SubgraphVault;
  }>();

  const [order, setOrder] =
    useState<Awaited<ReturnType<typeof getVaultOrders>>[0]>();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();

  const {
    isLoading: isLoadingVaultBalance,
    data: vaultBalance,
    refetch: refetchVaultBalance,
  } = useContractRead<readonly Fragment[], 'balance', BigNumber>({
    abi: getVaultInterface().fragments,
    address: vault.id,
    functionName: 'balance',
    enabled: !!signer,
    watch: true,
    cacheTime: 30_000,
    staleTime: 30_000,
  });

  useEffect(() => {
    const chainId = chain?.id as ChainId;

    // fetch vault orders
    getVaultOrders(chainId, vault.id)
      .then((orders) => {
        setOrder(orders[0]);
      })
      .catch((error) => {
        console.error(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vault]);

  const onDepositHandler = () => {
    if (!signer) {
      return;
    }
    openModal(Modal.VaultDeposit, { vault });
  };
  const onWithdrawHandler = async () => {
    if (!signer) {
      return;
    }
    const cancelTx = await getVaultContract(vault.id, signer).cancel();
    await cancelTx.wait();
    await refetchVaultBalance();
  };

  return (
    <VaultCardOuterWrapper>
      <Card>
        <CardInnerWrapper>
          <h2>{shortenAddress(vault.id)}</h2>
          <Text>
            {isLoadingVaultBalance || vaultBalance === undefined
              ? 'Loading...'
              : `${formatUnits(vaultBalance, vault.token.decimals)} ${
                  vault.token.symbol
                }`}
          </Text>
          {order ? (
            <Text>{order.executions.length} DCA orders Executions</Text>
          ) : (
            <Text>No DCA orders</Text>
          )}
        </CardInnerWrapper>
        {!order && (
          <MainButtonContainer>
            <StyledLink to={`/create?vault=${vault.id}`}>
              Create orders
            </StyledLink>
          </MainButtonContainer>
        )}
        <VaultButtons>
          <button
            onClick={onDepositHandler}
            title={`Add more ${vault.token.symbol}`}
          >
            Deposit
          </button>
          <button
            onClick={onWithdrawHandler}
            title={`Withdraw remaining USDC ${vault.token.symbol} from this vault and cancel the DCA order`}
          >
            Cancel
          </button>
        </VaultButtons>
      </Card>
    </VaultCardOuterWrapper>
  );
}

const MainButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  align-items: stretch;
  height: 100%;
  width: 100%;
`;

const VaultCardOuterWrapper = styled.div`
  position: relative;
  max-width: 400px;
  width: 100%;
  height: 100%;
`;

const Text = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
`;

const VaultButtons = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  align-items: stretch;
  height: 100%;
  width: 100%;
  border-top: 2px solid;

  button,
  a {
    border: none;
    background-color: #fff;
    color: #000;
    font-size: 1.5rem;
    font-weight: 700;
    text-transform: uppercase;
    flex: 1;
    padding: 12px 4px;

    &:hover {
      background-color: #000;
      color: #fff;
    }

    &:first-child {
      border-bottom: 2px solid;
    }
  }

  @media (min-width: 480px) {
    flex-direction: row;

    button {
      &:first-child {
        border-bottom: none;
        border-right: 2px solid;
      }
    }
  }
`;
