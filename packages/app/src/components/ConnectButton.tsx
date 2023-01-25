import { useAccount, useDisconnect } from 'wagmi';
import { shortenAddress } from '../utils';
import { useModal, Modal } from '../context/Modal';

export function WalletConnectButton() {
  const { openModal } = useModal();
  const { disconnect } = useDisconnect();
  const account = useAccount();

  if (account.isConnected) {
    return (
      <button onClick={() => disconnect()}>
        Disconnect {shortenAddress(account.address)}
      </button>
    );
  }

  return (
    <button onClick={() => openModal(Modal.Wallet)}>Connect Wallet</button>
  );
}
