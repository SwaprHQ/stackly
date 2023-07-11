import { PropsWithChildren } from 'react';
import styled from 'styled-components';

import { Footer, FOOTER_HEIGHT } from '../components/Footer';
import { Header, HEADER_HEIGHT } from '../components/Header/Header';

export function PageLayout({ children }: PropsWithChildren) {
  return (
    <Container>
      <Header />
      <Content>{children}</Content>
      <Footer />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
`;

const Content = styled.main`
  width: 100%;
  min-height: calc(100vh - (${HEADER_HEIGHT} + ${FOOTER_HEIGHT}));
  flex: 1; /* to fill the remaining space */
  margin: 0 auto;
  @media (min-width: 768px) {
    padding-top: 0px;
  }
`;
