import styled from 'styled-components';

export const SelectBalanceButton = styled.button<{ alignRight?: boolean }>(
  (props) => `
  background: none;
  border: none;
  color: #000;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  padding: 0;
  text-decoration: underline;
  text-transform: uppercase;
  transition: all 0.2s ease-in-out;
  ${props.alignRight ? 'margin-left: auto; text-align:right;' : ''}
  &:hover {
    color: #000;
  }
`
);
