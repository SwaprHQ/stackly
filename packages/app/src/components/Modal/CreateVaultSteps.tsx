import { Modal, useModal } from '../../context/Modal';

import {
  ModalOutterWrapper,
  ModalBackdrop,
  ModalInnerWrapper,
  ModalHeader,
  ModalContentWithNoPadding,
} from './styles';
import { ContractReceipt, ContractTransaction } from 'ethers';
import styled from 'styled-components';
import { getExplorerLink, numberFormatter, shortenAddress } from '../../utils';
import { ChainId } from 'dca-sdk';

export enum CreateVaultAndDeposiStep {
  CREATE_VAULT,
  DEPOSIT_TOKEN,
  CREATE_ORDER,
}

export type VaultCreateAndDepositStepsModalProps = {
  stepsCompleted: CreateVaultAndDeposiStep[];
  // Vault creation
  createVaultTransaction?: ContractTransaction;
  createVaultReceipt?: ContractReceipt;
  vault?: string;
  // Token deposit
  depositTokenTransaction?: ContractTransaction;
  depositTokenReceipt?: ContractReceipt;

  // Order creation
  isCreatingOrder?: boolean;

  // Required
  tokenSymbol: string;
  tokenDepositAmount: number;
  chainId: ChainId;
};

export function CreateVaultStepsModal() {
  const { modal, data, closeModal } =
    useModal<VaultCreateAndDepositStepsModalProps>();

  if (modal === null || modal !== Modal.VaultCreateAndDepositSteps) {
    return null;
  }

  if (data === null) {
    throw new Error('No data provided to modal. Expected vault data.');
  }

  const {
    tokenSymbol,
    vault,
    stepsCompleted,
    createVaultTransaction,
    depositTokenTransaction,
    depositTokenReceipt,
    createVaultReceipt,
    chainId,
    isCreatingOrder,
  } = data;

  const isVaultCreated =
    createVaultReceipt &&
    vault &&
    stepsCompleted.includes(CreateVaultAndDeposiStep.CREATE_VAULT)
      ? true
      : false;

  const isTokenDeposited =
    depositTokenReceipt &&
    stepsCompleted.includes(CreateVaultAndDeposiStep.DEPOSIT_TOKEN)
      ? true
      : false;

  const isOrderCreated = stepsCompleted.includes(
    CreateVaultAndDeposiStep.CREATE_ORDER
  );

  const tokenDepositAmount = numberFormatter.format(data.tokenDepositAmount);

  const createVaultTransactionLink = createVaultTransaction
    ? getExplorerLink(chainId, createVaultTransaction.hash, 'transaction')
    : undefined;

  const depositTokenTransactionLink = depositTokenTransaction
    ? getExplorerLink(chainId, depositTokenTransaction.hash, 'transaction')
    : undefined;

  return (
    <ModalBackdrop onClick={closeModal}>
      <ModalOutterWrapper maxWidth="500px" onClick={(e) => e.stopPropagation()}>
        <ModalInnerWrapper>
          <ModalHeader>
            <h2>Create New {tokenSymbol} Vault</h2>
          </ModalHeader>
          <ModalContentWithNoPadding>
            <Step
              href={createVaultTransactionLink}
              isSuccess={isVaultCreated}
              target="_blank"
              rel="noopener noreferrer"
            >
              {isVaultCreated ? (
                <div>Created Vault {shortenAddress(vault)}</div>
              ) : createVaultTransaction ? (
                <div>Creating Vault</div>
              ) : (
                <div>Creating Vault</div>
              )}
            </Step>
            <Step
              href={depositTokenTransactionLink}
              isSuccess={isTokenDeposited}
              target="_blank"
              rel="noopener noreferrer"
            >
              {isTokenDeposited ? (
                <div>
                  Deposited {tokenDepositAmount} {tokenSymbol} into the vault
                </div>
              ) : depositTokenTransaction ? (
                <div>
                  Depositing {tokenDepositAmount} {tokenSymbol} into the vault
                </div>
              ) : (
                <div>
                  Deposit {tokenDepositAmount} {tokenSymbol} into the vault
                </div>
              )}
            </Step>
            <Step isSuccess={isOrderCreated}>
              {isOrderCreated ? (
                <div>Order created</div>
              ) : isCreatingOrder ? (
                <div>Creating order</div>
              ) : (
                <div>Create order</div>
              )}
            </Step>
          </ModalContentWithNoPadding>
        </ModalInnerWrapper>
      </ModalOutterWrapper>
    </ModalBackdrop>
  );
}

const Step = styled.a<{
  isSuccess?: boolean;
}>(
  (props) => `
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 0 20px;
  text-align: center;
  padding: 20px;
  font-size: 20px;
  font-weight: bold;
  text-transform: uppercase;
  text-decoration: none;
  color: #000;

  &:not(:last-child) {
    border-bottom: 2px solid #000;
  }
  &:hover {
    background: #ffc900;
  }

  ${
    props.isSuccess &&
    `
    background: #1dff72;
    &:hover {
      background: #1dff72;
    }
    `
  }
  `
);
