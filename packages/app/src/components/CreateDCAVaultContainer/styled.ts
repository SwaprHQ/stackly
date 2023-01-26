import styled from 'styled-components';
import { FormGroup } from '../form/FormGroup';

export const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

export const InnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 360px;
  width: 100%;
  gap: 16px;
`;


export const FormButtonGroup = styled(FormGroup)`
  margin: 20px 0;
  align-items: center;
`;
