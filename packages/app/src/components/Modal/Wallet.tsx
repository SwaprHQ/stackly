import styled from 'styled-components';
import { useConnect } from 'wagmi';
import { Modal, useModal } from '../../context/Modal';
import {
  ModalBackdrop,
  ModalContentWithNoPadding,
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
          <ModalContentWithNoPadding>
            <ConnectorListBig>
              {connectors.map((connector) => (
                <WalletButton
                  type="button"
                  disabled={!connector.ready}
                  key={connector.id}
                  onClick={async () => {
                    await connectAsync({ connector });
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
              {/* {error && (
                  <div>
                    <p> {error.message}</p>
                  </div>
                )} */}
            </ConnectorListBig>
          </ModalContentWithNoPadding>
        </ModalInnerWrapper>
      </ModalOutterWrapper>
    </ModalBackdrop>
  );
}

const WalletButton = styled.button`
  background: #fff;
  border-radius: 0;
  color: #000;
  border: 2px solid #000;
  padding: 8px 16px;
`;

const ConnectorListBig = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;

  ${WalletButton} {
    width: 100%;
    border-radius: 0;
    border: 0;
    padding: 16px 24px;
    font-size: 1.5rem;
    &:not(:last-child) {
      border-bottom: 2px solid #000;
    }

    &:hover {
      background: #ffc900;
    }
  }
`;
