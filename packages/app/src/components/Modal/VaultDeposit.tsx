import { useState } from 'react';
import { Modal, useModal } from '../../context/Modal';
import { FormButtonGroup } from '../CreateDCAVaultContainer/styled';
import { InputGroup, NumberInput } from '../form';
import { FormGroup } from '../form/FormGroup';
import { ShadowButton } from '../form/FormButton';

import { SubgraphVault } from '../UserVaultsContainer/types';
import {
  ModalOutterWrapper,
  ModalBackdrop,
  ModalInnerWrapper,
  ModalHeader,
  ModalContent,
} from './styles';
import { shortenAddress } from '../../utils';
import { getERC20Contract } from 'dca-sdk';
import { useAccount, useSigner } from 'wagmi';
import { utils } from 'ethers';
import { SelectBalanceButtonContainer } from '../SelectBalanceButtonContainer';

const { formatUnits, parseUnits } = utils;

export function VaultDepositModal() {
  const account = useAccount();
  const { data: signer } = useSigner();
  const { modal, data, closeModal } = useModal<{
    vault: SubgraphVault;
  }>();

  // No need for abstraction here, just use useState
  const [sellTokenAmount, setSellTokenAmount] = useState<string>('0');

  const onDepositHandler = async () => {
    if (!signer || data === null) {
      return;
    }

    getERC20Contract(data.vault.token.id, signer).transfer(
      data.vault.id,
      parseUnits(sellTokenAmount, data.vault.token.decimals)
    );
  };

  if (modal === null || modal !== Modal.VaultDeposit) {
    return null;
  }

  if (data === null) {
    throw new Error('No data provided to modal. Expected vault data.');
  }

  const tokenSymbol = data.vault.token.symbol;

  return (
    <ModalBackdrop onClick={closeModal}>
      <ModalOutterWrapper maxWidth="500px" onClick={(e) => e.stopPropagation()}>
        <ModalInnerWrapper>
          <ModalHeader>
            <h2>
              Deposit {tokenSymbol} into {shortenAddress(data.vault.id)}
            </h2>
          </ModalHeader>
          <ModalContent minHeight="220px">
            <form>
              <FormGroup>
                <label>{tokenSymbol}</label>
                <InputGroup>
                  <NumberInput
                    value={sellTokenAmount}
                    onChange={(nextSellAmount) => {
                      setSellTokenAmount(nextSellAmount);
                    }}
                  />
                </InputGroup>
                <SelectBalanceButtonContainer
                  tokenAddress={data.vault.token.id}
                  tokenDecimals={data.vault.token.decimals}
                  userAddress={account.address as string}
                  onBalanceSelect={(balance) => {
                    setSellTokenAmount(
                      formatUnits(balance, data.vault.token.decimals)
                    );
                  }}
                />
              </FormGroup>
              <FormButtonGroup>
                <ShadowButton
                  type="button"
                  title="Deposit"
                  onClick={onDepositHandler}
                >
                  Deposit
                </ShadowButton>
              </FormButtonGroup>
            </form>
          </ModalContent>
        </ModalInnerWrapper>
      </ModalOutterWrapper>
    </ModalBackdrop>
  );
}
