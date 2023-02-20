import styled from 'styled-components';
import { FlexContainer } from '../components/Container';
import { CreateDCAVaultContainer } from '../components/CreateDCAVaultContainer';
import { PageLayout } from '../layout';

import { ReactComponent as _HeaderSplash } from './splash.svg';

export default function IndexPage() {
  return (
    <PageLayout>
      <PageHeader>
        <FlexContainer>
          <HeaderSplash />
          <PageHeaderSubSection>
            <h1>Effortless DCA</h1>
            <h1>NO KYC</h1>
          </PageHeaderSubSection>
        </FlexContainer>
      </PageHeader>
      <CreateDCAVaultContainer />
    </PageLayout>
  );
}

const PageHeader = styled.header`
  margin-bottom: 2rem;
`;

const HeaderSplash = styled(_HeaderSplash)`
  width: 100%;
  margin-bottom: 1rem;
`;

const PageHeaderSubSection = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 768px) {
    gap: 0;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
  }

  & h1 {
    font-size: 16px;
    font-weight: 800;
    line-height: 19px;
    letter-spacing: 0em;
    text-align: center;
  }
`;
