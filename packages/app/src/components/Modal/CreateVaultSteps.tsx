import { Modal, useModal } from '../../modal';
import {
  ModalOutterWrapper,
  ModalBackdrop,
  ModalInnerWrapper,
  ModalHeader,
  ModalTitle,
  ModalContent as ModalContentBase,
} from './styles';
import { ContractReceipt, ContractTransaction } from 'ethers';
import { ChainId } from 'dca-sdk';
import styled from 'styled-components';
import { Check, X } from 'react-feather';
import { getExplorerLink } from '../../utils';

export enum CreateVaultAndDepositStep {
  APPROVE_FACTORY,
  REJECT_APPROVE_FACTORY,
  CREATE_ORDER,
  REJECT_CREATE_ORDER,
}

export type VaultCreateAndDepositStepsModalProps = {
  stepsCompleted: CreateVaultAndDepositStep[];
  // Approve factory
  approveFactoryTransaction?: ContractTransaction;
  approveFactoryReceipt?: ContractReceipt;
  // Vault creation
  createOrderTransaction?: ContractTransaction;
  createOrderReceipt?: ContractReceipt;
  vault?: string;
  // Required
  tokenSymbol: string;
  tokenDepositAmount: number;
  chainId: ChainId;
};

export function CreateVaultStepsModal() {
  const { modal, data, closeModal } = useModal<VaultCreateAndDepositStepsModalProps>();

  if (modal === null || modal !== Modal.VaultCreateAndDepositSteps) {
    return null;
  }

  if (data === null) {
    throw new Error('No data provided to modal. Expected vault data.');
  }

  const { createOrderReceipt, stepsCompleted, approveFactoryTransaction, createOrderTransaction, chainId } = data;

  const isApprovingFactory = stepsCompleted.includes(CreateVaultAndDepositStep.APPROVE_FACTORY);

  const isFactoryApprovedRejected = stepsCompleted.includes(CreateVaultAndDepositStep.REJECT_APPROVE_FACTORY);

  const isOrderRejected = stepsCompleted.includes(CreateVaultAndDepositStep.REJECT_CREATE_ORDER);

  const isCreateingOrder = !createOrderReceipt && stepsCompleted.includes(CreateVaultAndDepositStep.CREATE_ORDER);

  const isOrderCreated = createOrderReceipt && stepsCompleted.includes(CreateVaultAndDepositStep.CREATE_ORDER);

  // This can be used in the future

  const approveFactoryTransactionLink = approveFactoryTransaction
    ? getExplorerLink(chainId, approveFactoryTransaction.hash, 'transaction')
    : undefined;

  const createOrderTransactionLink = createOrderTransaction
    ? getExplorerLink(chainId, createOrderTransaction.hash, 'transaction')
    : undefined;

  return (
    <ModalBackdrop onClick={closeModal}>
      <ModalOutterWrapper maxWidth="500px" onClick={(e) => e.stopPropagation()}>
        <ModalInnerWrapper>
          <ModalHeader>
            <ModalTitle>Create Order</ModalTitle>
          </ModalHeader>
          <ModalContent>
            {isApprovingFactory && (
              <Message>
                <Text>Approving Factory ...</Text>
              </Message>
            )}
            {isFactoryApprovedRejected && (
              <Message>
                <RejectedCircle>
                  <X />
                </RejectedCircle>
                <RejectedText>Approve Factory Failed</RejectedText>
              </Message>
            )}
            {isCreateingOrder && (
              <Message>
                <Text>Creating Order ...</Text>
              </Message>
            )}
            {isOrderCreated && (
              <Message>
                <ApprovedCircle>
                  <Check />
                </ApprovedCircle>
                <Text>Order Created!</Text>
              </Message>
            )}
            {isOrderRejected && (
              <Message>
                <RejectedCircle>
                  <X />
                </RejectedCircle>
                <RejectedText>Create Order Failed</RejectedText>
              </Message>
            )}
            {(approveFactoryTransactionLink || createOrderTransactionLink) && (
              <>
                <Border />
                <TransactionsRow>
                  {approveFactoryTransactionLink && (
                    <Transaction href={approveFactoryTransactionLink}>Approval transaction</Transaction>
                  )}
                  {createOrderTransactionLink && (
                    <Transaction href={createOrderTransactionLink}>Order transaction</Transaction>
                  )}
                </TransactionsRow>
              </>
            )}
          </ModalContent>
        </ModalInnerWrapper>
      </ModalOutterWrapper>
    </ModalBackdrop>
  );
}
const TransactionsRow = styled.div`
  display: flex;
  margin: 28px auto;
  width: 100%;
  justify-content: space-evenly;
`;

const Transaction = styled.a`
  width: fit-content;
  text-decoration: none;
  color: #000;
  font-weight: 700;
  text-decoration: underline;
`;

const Border = styled.hr`
  width: 100%;
  border-top: 2px solid #000;
`;

const Text = styled.p`
  font-weight: 700;
  font-size: 20px;
`;

const RejectedText = styled(Text)`
  color: #ed3131;
`;

const ApprovedCircle = styled.div`
  background-color: #000;
  border-radius: 50px;
  height: 35px;
  width: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`;

const RejectedCircle = styled.div`
  background-color: #ed3131;
  border-radius: 50px;
  height: 35px;
  width: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
`;

const Message = styled.div`
  margin: 28px auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  & > *:not(:last-child) {
    margin-bottom: 22px;
  }
`;

const ModalContent = styled(ModalContentBase)`
  padding-top: 0;
`;
