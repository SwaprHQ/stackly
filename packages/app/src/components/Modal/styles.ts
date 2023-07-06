import styled from 'styled-components';
import { Card } from '../Card';

export const ModalSection = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ModalHeader = styled(ModalSection)`
  align-items: center;
  justify-content: center;
  padding: 24px;
  width: 100%;
  position: relative;
  overflow: hidden;
`;

export const ModalTitle = styled.h2`
  margin: 0;
`;

export const ModalFooter = styled(ModalSection)`
  align-items: center;
  justify-content: center;
  padding: 24px;
  width: 100%;
  position: relative;
  overflow: hidden;
`;

export const ModalInnerWrapper = styled(Card)`
  align-items: center;
  width: 100%;
  position: relative;
  overflow: hidden;
`;

export const ModalContent = styled(ModalSection)<{ minHeight?: string }>(
  (props) => `
  padding: 24px;
  align-items: center;
  width: 100%;
  position: relative;
  overflow: hidden;
  min-height: ${props.minHeight || 'auto'};
`
);

export const ModalContentWithNoPadding = styled(ModalContent)`
  padding: 0;
  align-items: stretch;
  width: 100%;
  border-bottom: 2px solid #000;
`;

export const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0);
  backdrop-filter: blur(6px);
  overflow-y: hidden;
  z-index: 80;
  /** Inner layout */
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalOutterWrapper = styled.div<{ maxWidth?: string }>(
  (props) => `
  position: relative;
  width: 100%;
  max-width: ${props.maxWidth || '400px'};
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
`
);

/**
 * Step component
 * @todo fix state colors and hover
 */
export const Step = styled.a<{
  isSuccess?: boolean;
  isBusy?: boolean;
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
  text-decoration: none;
  color: #000;
  &:not(:last-child) {
    border-bottom: 2px solid #000;
  }

  ${props.isBusy ? '/* background: #ffc900; &:hover { background: #ffc900; } */' : ''}
  ${props.isSuccess ? '/* background: #1dff72; &:hover { background: #1dff72; } */' : ''}
  `
);

export const Text = styled.p`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
`;
