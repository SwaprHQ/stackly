import {
  PropsWithChildren,
  useCallback,
  useState,
  createContext,
  useContext,
} from 'react';

export enum Modal {
  VaultDeposit = 'VaultDeposit',
  Withdraw = 'Withdraw',
  Wallet = 'Wallet',
}

export interface IModalContext<ModalData = unknown> {
  modal: Modal | null;
  /**
   * If you want to pass data to the modal, you can do so here.
   * @param modal The modal to open
   * @param data The data to pass to the modal
   * @returns
   */
  openModal: (modal: Modal, data?: ModalData) => void;
  closeModal: () => void;
  data: ModalData | null;
}

export const ModalContext = createContext({
  modal: null,
  openModal: () => {},
  closeModal: () => {},
  data: null,
} as IModalContext);

export function ModalProvider({ children }: PropsWithChildren) {
  const [modal, setModal] = useState<Modal | null>(null);
  const [data, setData] = useState<unknown>(null);

  const openModal = useCallback((modal: Modal, data?: unknown) => {
    setModal(modal);
    setData(data);
  }, []);

  const closeModal = useCallback(() => {
    setModal(null);
  }, []);

  return (
    <ModalContext.Provider
      value={{
        modal,
        data,
        openModal,
        closeModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal<ModalData = unknown>() {
  return useContext(ModalContext as React.Context<IModalContext<ModalData>>);
}
