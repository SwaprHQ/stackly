import styled from 'styled-components';
import { FlexContainer } from '../components/Container';
import { CreateDCAVaultContainer } from '../components/CreateDCAVaultContainer';
import { PageLayout } from '../layout';
import { ReactComponent as _HeaderSplash } from '../assets/svg/homepage-splash.svg';

export default function IndexPage() {
  return (
    <PageLayout>
      <PageHeader>
        <FlexContainer>
          <HeaderSplash>Stack crypto over time</HeaderSplash>
          <HeaderSplashDescription>
            Stackly is a simple non-custodial DCA based tool that uses CoW protocol to place recurring swaps.
          </HeaderSplashDescription>
          <PageHeaderSubSection>
            <FeaturePoint>
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 405.3V448c0 35.3 86 64 192 64s192-28.7 192-64v-42.7C342.7 434.4 267.2 448 192 448S41.3 434.4 0 405.3zM320 128c106 0 192-28.7 192-64S426 0 320 0 128 28.7 128 64s86 64 192 64zM0 300.4V352c0 35.3 86 64 192 64s192-28.7 192-64v-51.6c-41.3 34-116.9 51.6-192 51.6S41.3 334.4 0 300.4zm416 11c57.3-11.1 96-31.7 96-55.4v-42.7c-23.2 16.4-57.3 27.6-96 34.5v63.6zM192 160C86 160 0 195.8 0 240s86 80 192 80 192-35.8 192-80-86-80-192-80zm219.3 56.3c60-10.8 100.7-32 100.7-56.3v-42.7c-35.5 25.1-96.5 38.6-160.7 41.8 29.5 14.3 51.2 33.5 60 57.2z"></path>
              </svg>
              <FeaturesPointText>Effortless DCA</FeaturesPointText>
            </FeaturePoint>
            <FeaturePoint>
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 16 16"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="m4.736 1.968-.892 3.269-.014.058C2.113 5.568 1 6.006 1 6.5 1 7.328 4.134 8 8 8s7-.672 7-1.5c0-.494-1.113-.932-2.83-1.205a1.032 1.032 0 0 0-.014-.058l-.892-3.27c-.146-.533-.698-.849-1.239-.734C9.411 1.363 8.62 1.5 8 1.5c-.62 0-1.411-.136-2.025-.267-.541-.115-1.093.2-1.239.735Zm.015 3.867a.25.25 0 0 1 .274-.224c.9.092 1.91.143 2.975.143a29.58 29.58 0 0 0 2.975-.143.25.25 0 0 1 .05.498c-.918.093-1.944.145-3.025.145s-2.107-.052-3.025-.145a.25.25 0 0 1-.224-.274ZM3.5 10h2a.5.5 0 0 1 .5.5v1a1.5 1.5 0 0 1-3 0v-1a.5.5 0 0 1 .5-.5Zm-1.5.5c0-.175.03-.344.085-.5H2a.5.5 0 0 1 0-1h3.5a1.5 1.5 0 0 1 1.488 1.312 3.5 3.5 0 0 1 2.024 0A1.5 1.5 0 0 1 10.5 9H14a.5.5 0 0 1 0 1h-.085c.055.156.085.325.085.5v1a2.5 2.5 0 0 1-5 0v-.14l-.21-.07a2.5 2.5 0 0 0-1.58 0l-.21.07v.14a2.5 2.5 0 0 1-5 0v-1Zm8.5-.5h2a.5.5 0 0 1 .5.5v1a1.5 1.5 0 0 1-3 0v-1a.5.5 0 0 1 .5-.5Z"
                ></path>
              </svg>
              <FeaturesPointText>NO KYC</FeaturesPointText>
            </FeaturePoint>
            <FeaturePoint>
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 512 512"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M179.125 20.625c-28.052.12-54.046 5.813-66.72 9.78 0 0 114.968 19.51 124.532 98.876C149.573 3.32 54.28 155.657 54.28 155.657c19.868-5.212 76.76-20.682 114.75-14.156 25.992 4.465 51.33 28.03 50.236 27.733-61.943 15.24-160.35 290.92-143.64 313.308 14.9 17.12 29.816 11.28 44.718 2.595 7.376-58.425 64.938-314.765 135.375-294.072.01.003.02-.003.03 0 5.93 2.03 11.54 5.59 11.844 11.03.58 10.363-6.11 27.3-4.53 39.063 3.662 27.296 9.007 36.79 16.78 46.313 18.564-10.435 36.326-48.057 40-67.564 16.634 7.284 43.373 24.155 65.187 86.813 11.404-58.716-5.042-105.03-59.03-125.595 23.38-10.105 125.142 41.03 137.563 69.53C475.648 199.264 390.167 136.378 319 139.72c13.644-3.56 28.638.6 42.906-9.907 19.146-14.098 41.474-26.24 62.28-39.282-69.972-30.435-134.545-15.407-139.092 16.095-3.573-69.916-57.83-86.204-105.97-86z"></path>
              </svg>
              <FeaturesPointText>Cancel anytime</FeaturesPointText>
            </FeaturePoint>
          </PageHeaderSubSection>
        </FlexContainer>
      </PageHeader>
      <CreateDCAVaultContainer />
    </PageLayout>
  );
}
const FeaturePoint = styled.div`
  display: flex;
  align-items: center;
`;

const PageHeader = styled.header`
  margin-bottom: 2rem;
`;

const HeaderSplash = styled.h1`
  text-align: center;
  font-size: 32px;
  width: 100%;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    font-size: 59px;
  }
`;

const HeaderSplashDescription = styled.p`
  max-width: 600px;

  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
  text-align: center;
  color: #4d4f4c;

  margin-bottom: 2.5rem;
`;

const PageHeaderSubSection = styled.div`
  width: 100%;
  max-width: 508px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (min-width: 468px) {
    margin-bottom: 2.5rem;
    flex-direction: row;
  }

  @media (min-width: 768px) {
    gap: 0;
  }

  & h1 {
    font-size: 16px;
    font-weight: 800;
    line-height: 19px;
    letter-spacing: 0em;
    text-align: center;
  }
`;

const FeaturesPointText = styled.p`
  margin-left: 12px;

  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;

  @media (min-width: 768px) {
    font-size: 16px;
    line-height: 19px;
  }
`;
