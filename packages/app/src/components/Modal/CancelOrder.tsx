import { Modal, useModal } from '../../modal';
import {
  ModalOutterWrapper,
  ModalBackdrop,
  ModalInnerWrapper,
  ModalHeader,
  ModalContent,
  Step,
  Text,
  ModalContentWithNoPadding,
  ModalTitle,
} from './styles';
import { ContractReceipt, ContractTransaction } from 'ethers';
import { getExplorerLink } from '../../utils';
import { ChainId, getDCAOrderContract } from 'dca-sdk';
import { Signer } from '@wagmi/core';
import { useState } from 'react';
import { ShadowButton } from '../form';

export enum CreateVaultAndDepositStep {
  APPROVE_FACTORY,
  CREATE_ORDER,
}

export type CancelOrderModalProps = {
  chainId: ChainId;
  orderId: string;
  signer: Signer;
};

export function CancelOrderModal() {
  const { modal, data, closeModal } = useModal<CancelOrderModalProps>();
  const [isCanceling, setIsCanceling] = useState(false);
  const [cancelOrderTransaction, setCancelOrderTransaction] =
    useState<ContractTransaction | null>(null);
  const [cancelOrderReceipt, setCancelOrderReceipt] =
    useState<ContractReceipt | null>(null);

  if (modal === null || modal !== Modal.CancelOrder) {
    return null;
  }

  if (data === null) {
    throw new Error('No data provided to modal. Expected vault data.');
  }

  const conditionalOnClose = () => {
    if (isCanceling) {
      return;
    }

    closeModal();
  };

  const onConfirm = async () => {
    if (!data.signer) {
      return;
    }

    try {
      setIsCanceling(true);
      const tx = await getDCAOrderContract(data.orderId, data.signer).cancel();
      setCancelOrderTransaction(tx);
      const receipt = await tx.wait();
      setCancelOrderReceipt(receipt);
      setIsCanceling(false);
    } catch (e) {
      setIsCanceling(false);
      console.error(e);
    }
  };

  const createOrderTransactionLink = cancelOrderTransaction
    ? getExplorerLink(data.chainId, cancelOrderTransaction.hash, 'transaction')
    : undefined;

  const orderIdShort = data.orderId.slice(2, 8);

  return (
    <ModalBackdrop onClick={conditionalOnClose}>
      <ModalOutterWrapper maxWidth="500px" onClick={(e) => e.stopPropagation()}>
        <ModalInnerWrapper>
          <ModalHeader>
            <ModalTitle>Cancel Order {orderIdShort}</ModalTitle>
          </ModalHeader>
          <ModalContentWithNoPadding>
            {cancelOrderReceipt?.status ? (
              <Step
                href={createOrderTransactionLink}
                isSuccess={true}
                target="_blank"
                rel="noopener noreferrer"
              >
                Cancelled {data.orderId.slice(0, 8)}
              </Step>
            ) : cancelOrderTransaction || isCanceling ? (
              <Step
                href={createOrderTransactionLink}
                isBusy={true}
                target="_blank"
                rel="noopener noreferrer"
              >
                Cancelling {orderIdShort} ...
              </Step>
            ) : (
              <ModalContent>
                <Text>
                  Cancelling this order will stop your DCA and refund your
                  remaining deposit. Are you sure you want to cancel this?
                </Text>
                <ShadowButton
                  type="button"
                  onClick={onConfirm}
                  title="Create Order"
                >
                  Cancel Order
                </ShadowButton>
              </ModalContent>
            )}
          </ModalContentWithNoPadding>
        </ModalInnerWrapper>
      </ModalOutterWrapper>
    </ModalBackdrop>
  );
}
