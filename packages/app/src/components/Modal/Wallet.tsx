import { ChainId } from 'dca-sdk';
import styled from 'styled-components';
import { useConnect } from 'wagmi';
import { Modal, useModal } from '../../modal';
import { PrimaryButton } from '../../ui/components/Button/Button';
import {
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalInnerWrapper,
  ModalOutterWrapper,
} from './styles';

export function WalletModal() {
  const { closeModal, modal } = useModal();
  const { connectors, isLoading, pendingConnector, connectAsync } =
    useConnect();

  if (modal == null || modal !== Modal.Wallet) {
    return null;
  }

  return (
    <ModalBackdrop onClick={closeModal}>
      <ModalOutterWrapper onClick={(e) => e.stopPropagation()}>
        <ModalInnerWrapper>
          <ModalHeader>
            <h2>Choose A Wallet</h2>
          </ModalHeader>
          <ModalContent>
            {connectors.map((connector) => (
              <WalletButton
                type="button"
                disabled={!connector.ready}
                key={connector.id}
                onClick={async () => {
                  await connectAsync({
                    connector,
                    chainId: ChainId.GNOSIS,
                  });
                  closeModal();
                }}
              >
                {connector.name}
                {!connector.ready && ' (unsupported)'}
                {isLoading &&
                  connector.id === pendingConnector?.id &&
                  ' (connecting)'}
              </WalletButton>
            ))}
          </ModalContent>
        </ModalInnerWrapper>
      </ModalOutterWrapper>
    </ModalBackdrop>
  );
}

const WalletButton = styled(PrimaryButton)`
  margin-bottom: 1rem;
`;