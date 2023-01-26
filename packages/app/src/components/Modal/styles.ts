import styled from 'styled-components';

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
  border-bottom: 2px solid;
  background: #ff90e8;
`;

export const ModalFooter = styled(ModalSection)`
  align-items: center;
  justify-content: center;
  padding: 24px;
  width: 100%;
  position: relative;
  overflow: hidden;
  border-bottom: 2px solid;
`;

export const ModalInnerWrapper = styled.div`
  align-items: center;
  background: #fff;
  width: 100%;
  position: relative;
  overflow: hidden;
  border: 2px solid;
  -webkit-box-shadow: 8px 8px 0px -1px rgba(0, 0, 0, 1);
  -moz-box-shadow: 8px 8px 0px -1px rgba(0, 0, 0, 1);
  box-shadow: 8px 8px 0px -1px rgba(0, 0, 0, 1);
`;

export const ModalContent = styled(ModalSection)<{ minHeight?: string }>(props => `
  padding: 24px;
  align-items: center;
  background: #fff;
  width: 100%;
  position: relative;
  overflow: hidden;
  min-height: ${props.minHeight || 'auto'};
`);


export const ModalContentWithNoPadding = styled(ModalContent)`
  padding: 0;
  align-items: stretch;
  width: 100%;
  border-bottom: 2px solid #000;
`;


export const Blackbox = styled.div`
  position: absolute;
  left: auto;
  top: auto;
  right: -12px;
  bottom: -12px;
  width: 340px;
  height: 396px;
  margin-top: 0px;
  margin-left: 0px;
  border-radius: 10px;
  background-color: #000;
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
  z-index: 999;
  /** Inner layout */
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalOutterWrapper = styled.div<{ maxWidth?: string }>(  props => `
  position: relative;
  width: 100%;
  max-width: ${props.maxWidth || '400px'};
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
`);
