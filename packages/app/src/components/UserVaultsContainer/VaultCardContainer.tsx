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
      <VaultCard>
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
            <Text>{order?.executions?.length} DCA orders Executions</Text>
          ) : (
            <Text>No DCA orders</Text>
          )}
        </CardInnerWrapper>
        <VaultButtons>
          {!order && <Link to={`/create?vault=${vault.id}`}>Create</Link>}
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
      </VaultCard>
    </VaultCardOuterWrapper>
  );
}

const VaultCard = styled(Card)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 240px;
`;

const VaultCardOuterWrapper = styled.div`
  position: relative;
  max-width: 500px;
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
    text-decoration: none;
    text-align: center;
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
      text-decoration: none;
      color: #fff;
    }
  }

  @media (min-width: 480px) {
    flex-direction: row;
  }
`;
