import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';
import { shortenAddress } from '../../utils';
import { useModal, Modal } from '../../context/Modal';
import { ChainId } from 'dca-sdk';

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
        <button onClick={() => disconnect()}>
          Disconnect {shortenAddress(account.address)}
        </button>
      );
    } else {
      return (
        <button onClick={() => switchNetworkAsync?.(ChainId.GNOSIS)}>
          Unsupported Network
        </button>
      );
    }
  }

  return (
    <button onClick={() => openModal(Modal.Wallet)}>Connect Wallet</button>
  );
}
