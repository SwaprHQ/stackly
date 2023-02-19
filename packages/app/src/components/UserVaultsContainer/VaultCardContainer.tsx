import { getERC20Interface } from 'dca-sdk';
import { BigNumber } from 'ethers';
import { formatUnits, Fragment } from 'ethers/lib/utils.js';
import { useEffect } from 'react';
import styled from 'styled-components';
import { useContractRead, useNetwork, useSigner } from 'wagmi';
import { Modal, useModal } from '../../modal';
import { CancelOrderModalProps } from '../../components/Modal/CancelOrder';

import { getExplorerLink } from '../../utils';
import { Card, CardInnerWrapper } from '../Card';
import { SubgraphOrder } from './types';

export function VaultCardContainer({ order }: { order: SubgraphOrder }) {
  const { chain } = useNetwork();

  const { openModal } = useModal<CancelOrderModalProps>();
  const { data: signer } = useSigner();
  const { isLoading: isLoadingVaultBalance, data: vaultBalance } =
    useContractRead<readonly Fragment[], 'balanceOf', BigNumber>({
      abi: getERC20Interface().fragments,
      address: order.sellToken.id,
      functionName: 'balanceOf',
      enabled: !!signer,
      watch: true,
      cacheTime: 30_000,
      staleTime: 30_000,
      args: [order.id],
    });

  useEffect(() => {
    if (!signer) {
      return;
    }
  }, [signer, order.id]);

  return (
    <VaultCardOuterWrapper>
      <VaultCard>
        <CardInnerWrapper>
          <OrderTitle
            href={getExplorerLink(chain?.id || 1, order.id, 'address')}
            target="_blank"
            rel="noreferrer"
          >
            <h2>{order.id.slice(2, 8)}</h2>
          </OrderTitle>
          <Text>
            {isLoadingVaultBalance || vaultBalance === undefined
              ? 'Loading...'
              : `${formatUnits(vaultBalance, order.sellToken.decimals)} ${
                  order.sellToken.symbol
                }`}
          </Text>
          <Text>{order.orderSlots.length} Stacks</Text>
        </CardInnerWrapper>
        <VaultButtons>
          <button
            onClick={() =>
              openModal(Modal.CancelOrder, {
                chainId: chain?.id as any,
                signer: signer as any,
                orderId: order.id,
              })
            }
            title={`Withdraw remaining USDC ${order.sellToken.symbol} from this vault and cancel the DCA order`}
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

const OrderTitle = styled.a`
  font-size: 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  text-decoration: none;
  color: #000;
  &:hover {
    text-decoration: underline;
  }
`;
