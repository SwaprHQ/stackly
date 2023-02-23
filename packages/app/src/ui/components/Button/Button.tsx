import styled from 'styled-components';

export const Button = styled.button`
  border: 4px solid #000;
  box-shadow: 3px 3px 0px -1px #31322d;
  border-radius: 16px;
  font-family: inherit;
  font-size: 16px;
  font-weight: 800;
  min-width: 200px;
  text-transform: uppercase;
  background: linear-gradient(300.79deg, #ff8a00 -76.85%, #fac336 93.6%);
  height: 53px;
  transition: all 0.2s ease-in-out;
  &:hover {
    transform: translateY(-2px);
  }
`;

export const WhiteButton = styled(Button)`
  background: #fff;
`;

export const PrimaryButton = styled(Button)``;
