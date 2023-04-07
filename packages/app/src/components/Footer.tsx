import styled from 'styled-components';

export const FOOTER_HEIGHT = '64px';

export function Footer() {
  return (
    <FooterWrapper>
      <FooterContent />
    </FooterWrapper>
  );
}

export function FooterContent() {
  return (
    <FooterTitle>
      Made with ❤️ from{' '}
      <HyperLink href="https://swapr.eth.limo" target="_blank">
        Swapr
      </HyperLink>
    </FooterTitle>
  );
}

const HyperLink = styled.a`
  color: inherit;
`;

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
