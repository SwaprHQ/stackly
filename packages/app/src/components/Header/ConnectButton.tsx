import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';
import { shortenAddress } from '../../utils';
import { useModal, Modal } from '../../modal';
import { ChainId } from 'dca-sdk';
import { WhiteButton as _Button } from '../../ui/components/Button/Button';
import styled from 'styled-components';

export function WalletConnectButton() {
  const { chains, chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const { openModal } = useModal();
  const { disconnect } = useDisconnect();
  const account = useAccount();

  const isNetworkSupported = chains.find((c) => c.id === chain?.id);

  if (account.isConnected) {
    if (isNetworkSupported) {
      return (
        <Button onClick={() => disconnect()}>
          Disconnect {shortenAddress(account.address)}
        </Button>
      );
    } else {
      return (
        <Button onClick={() => switchNetworkAsync?.(ChainId.GOERLI)}>
          Unsupported Network
        </Button>
      );
    }
  }

  return (
    <Button onClick={() => openModal(Modal.Wallet)}>Connect Wallet</Button>
  );
}

const Button = styled(_Button)`
  height: 40px;
`;
