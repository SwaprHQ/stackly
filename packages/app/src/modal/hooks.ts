import { useContext } from "react";
import { IModalContext, ModalContext } from "./ModalProvider";

export function useModal<ModalData = unknown>() {
  return useContext(ModalContext as React.Context<IModalContext<ModalData>>);
}
