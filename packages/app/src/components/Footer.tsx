import styled from 'styled-components';

export const FOOTER_HEIGHT = '64px';

export function Footer() {
  return <FooterWrapper>Footer</FooterWrapper>;
}

const FooterWrapper = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  font-size: 0.8rem;
  color: #000;
  height: ${FOOTER_HEIGHT};
`;
