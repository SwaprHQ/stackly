import { PropsWithChildren } from 'react';
import { ModalBackdrop, ModalInnerWrapper, ModalOutterWrapper } from './styles';

export function Modal({
  isOpen,
  onDismiss,
}: PropsWithChildren<{
  isOpen: boolean;
  onDismiss: () => void;
}>) {
  if (!isOpen) {
    return null;
  }

  return (
    <ModalBackdrop onClick={onDismiss}>
      <ModalOutterWrapper maxWidth="500px" onClick={(e) => e.stopPropagation()}>
        <ModalInnerWrapper></ModalInnerWrapper>
      </ModalOutterWrapper>
    </ModalBackdrop>
  );
}
