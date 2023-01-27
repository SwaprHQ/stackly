import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { WalletConnectButton } from './ConnectButton';

export const HEADER_HEIGHT = '64px';

export function Header() {
  return (
    <HeaderFrame>
      <HeaderTitleContainer>
        <h2>{`///`}</h2>
      </HeaderTitleContainer>
      <Nav>
        <Link to="/">Home</Link>
        <Link to="/vaults">Your Vaults</Link>
      </Nav>
      <WalletConnectButtonContainer>
        <WalletConnectButton />
      </WalletConnectButtonContainer>
    </HeaderFrame>
  );
}

const WalletConnectButtonContainer = styled.div`
  & > button {
    height: 100%;
    width: 100%;
    background: #000;
    color: #fff;
    outline: none;
    border: 0;
    display: block;
    padding: 20px;
    font-weight: bold;
    text-transform: uppercase;
    border-top: 2px solid #000;
    font-size: 16px;
    &:hover {
      background: #ffc900;
      color: #000;
    }
  }
  @media (min-width: 480px) {
    & > button {
      border-top: 0;
      border-left: 2px solid #000;
      padding: 0 20px;
    }
  }
`;

const HeaderTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 8px;
`;

const HeaderFrame = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 280px;
  background: #fff;
  z-index: 1000;
  border-right: 2px solid #000;
  display: flex;
  align-items: stretch;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
  @media (min-width: 480px) {
    height: ${HEADER_HEIGHT};
    width: 100%;
    flex-direction: row;
    border-right: 0;
    border-bottom: 2px solid #000;
  }
`;

const Nav = styled.nav`
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: column;
  justify-content: start;
  gap: 16px;
  width: 100%;

  @media (min-width: 480px) {
    flex-direction: row;
  }

  & > a {
    text-decoration: none;
    color: #000;
    font-weight: bold;
    text-transform: uppercase;
    padding: 16px 24px;
    display: block;
    border-radius: 0;
    border: 0;
  }

  & > a:hover {
    text-decoration: underline;
  }
`;
