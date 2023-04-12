import styled from 'styled-components';

export const StyledInputShadowWrapper = styled.div`
  box-shadow: 3px 3px 0px 1px #31322d;
  border: 3px solid #1e1f1b;
  border-radius: 8px;
  overflow: hidden;
`;

export const StyledInput = styled.input<{ border?: boolean }>(
  ({ border }) => `
  ${border === false ? '' : ''}
  width: 100%;
  background: #fefaf3;
  &, &:focus, &:active {
    outline: none;
    border: none; /** Handled by StyledInputShadowWrapper */
  }
`
);
