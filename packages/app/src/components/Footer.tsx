import styled from 'styled-components';

export const FOOTER_HEIGHT = '64px';

export function Footer() {
  return (
    <FooterWrapper>
      <FooterTitle>
        Made with ❤️ from{' '}
        <a href="https://swapr.eth.limo" target="_blank">
          Swapr
        </a>
      </FooterTitle>
    </FooterWrapper>
  );
}

const FooterTitle = styled.span`
  font-size: 12px;
  font-weight: bold;
`;

const FooterWrapper = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  color: #000;
  height: ${FOOTER_HEIGHT};
`;
