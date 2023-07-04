import styled from 'styled-components';
import { FlexContainer } from '../components/Container';
import { CreateDCAVaultContainer } from '../components/CreateDCAVaultContainer';
import { PageLayout } from '../layout';
import { ReactNode, useState } from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';
import { Card, CardInnerWrapper as _CardInnerWrapper } from '../components/Card';
import { WhiteButton } from '../ui/components/Button';

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
              {/* React icons FaCoins */}
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
              {/* React icons BsIncognito */}
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
              <FeaturesPointText>Self Custodial</FeaturesPointText>
            </FeaturePoint>
            <FeaturePoint>
              {/* React icons GiPalmTree */}
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
      <Section>
        <WhatIsDCATitle>A new way to stack your crypto over time with DCA.</WhatIsDCATitle>
        <WhatIsDCAPoint>
          <WhatIsDCAPointTitle>Neutralizing Short-Term Volatility</WhatIsDCAPointTitle>
          <WhatIsDCAPointDescription>
            Stackly's dollar-cost averaging strategy neutralizes short-term volatility and reduces the need for market
            timing, making it an ideal tool for investors who want to minimize risk while building wealth.
          </WhatIsDCAPointDescription>
        </WhatIsDCAPoint>
        <WhatIsDCAPoint>
          <WhatIsDCAPointTitle>Greater Control Over Your Crypto</WhatIsDCAPointTitle>
          <WhatIsDCAPointDescription>
            With Stackly, you can choose the token you want to stack, the frequency of the stacks, and when to start and
            end them, giving you greater control over your investments.
          </WhatIsDCAPointDescription>
        </WhatIsDCAPoint>
      </Section>
      <Section>
        <FAQWrapper>
          <FAQTitle>Frequent Asked Questions</FAQTitle>
          <FAQColumn>
            <Accordion title="What is Stackly?">
              Stackly is a simple non-custodial DCA based tool that uses CoW protocol to place recurring swaps. This
              will be self-custodial and will be a simple approach to cost averaging. The user will have the possibility
              to choose different stack frequencies.
            </Accordion>
            <Accordion title="How does Stackly work?">
              1. Choose the token and amount you want to swap from.
              <br />
              2. Choose the token you want to stack.
              <br />
              3. Choose the frequency you want to swap.
              <br />
              4. Choose the start date and end date Confirm the order.
            </Accordion>
            <Accordion title="What is DCA and why should one use it?">
              Dollar-cost averaging is a tool an investor can use to build savings and wealth over a long period. DCA
              removes the need to time the market and helps you build a portfolio distributed over a period of time.
              This helps neutralize the short term market volatility, the need to time the market and helps the user to
              build a portfolio distributed over a period of time. Basically, it neutralizes short term volatility and
              doesn't worry about timing the market.
            </Accordion>
            <Accordion title="Does Stackly have any fees?">
              Stackly has a 0.5% fees on the stack amount. During the initial beta period for the wallets that are part
              of the allowlist, there is a 50% fee discount and charges 0.25% fee on the initial stack amount.
            </Accordion>
            <Accordion title="How can I cancel my stacks?">
              You can always go to “Your Stacks” page and cancel any active stacks. Once canceled, the remaining amount
              that is in the vault will be transferred to the wallet that created the stack.
            </Accordion>
          </FAQColumn>
        </FAQWrapper>
      </Section>
      <FooterCard>
        <CardInnerWrapper>
          <FooterText>Join our awesome community</FooterText>
          <FooterButtons>
            <LinkButton as="a" href="https://discord.gg/QFkNsjTkzD" target="_blank">
              {/* React icons FaDiscord */}
              <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 640 512">
                <path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z" />
              </svg>
              <span>Discord</span>
            </LinkButton>
            <LinkButton as="a" href="https://twitter.com/Stacklydapp" target="_blank">
              {/* React icons FaTwitter */}
              <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                <path d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z" />
              </svg>
              <span>Twitter</span>
            </LinkButton>
            <LinkButton as="a" href="https://t.me/Stackly" target="_blank">
              {/* React icons FaTelegram */}
              <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
                <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
              </svg>
              <span>Telegram</span>
            </LinkButton>
          </FooterButtons>
        </CardInnerWrapper>
      </FooterCard>
    </PageLayout>
  );
}

const Accordion = ({ title, children }: { title: string; children: ReactNode }) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <AccordionColumn>
      <AccordionTitle onClick={() => setIsActive(!isActive)}>
        <div>{title}</div>
        <div>{isActive ? <ChevronUp /> : <ChevronDown />}</div>
      </AccordionTitle>
      {isActive && <AccordionContent>{children}</AccordionContent>}
    </AccordionColumn>
  );
};

const Section = styled.div`
  max-width: 1000px;
  margin: 8rem auto;
  padding: 0 16px;

  @media (min-width: 500px) {
    margin: 10rem auto;
  }
`;

const WhatIsDCAPoint = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 3rem;
  border-top: 1px solid #e2e4e1;
  padding-top: 32px;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const WhatIsDCAPointDescription = styled.p`
  max-width: 480px;
  color: #4d4f4c;
  line-height: 24px;
`;
const WhatIsDCAPointTitle = styled.h4`
  font-size: 20px;
  font-weight: 500;
  margin-bottom: 1rem;
`;

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
  max-width: 600px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;

  @media (min-width: 540px) {
    margin-bottom: 2.5rem;
    justify-content: space-between;
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
  text-wrap: nowrap;

  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;

  @media (min-width: 768px) {
    font-size: 16px;
    line-height: 19px;
  }
`;

const WhatIsDCATitle = styled.h3`
  max-width: 600px;
  font-weight: 600;
  font-size: 28px;
  line-height: 40px;
  margin-bottom: 3rem;

  @media (min-width: 500px) {
    margin-bottom: 5rem;
  }
`;

const AccordionColumn = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #e2e4e1;
  margin-bottom: 1rem;
`;

const FAQColumn = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  @media (min-width: 500px) {
    margin-left: 8rem;
  }
`;

const AccordionTitle = styled(WhatIsDCAPointTitle)`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`;

const AccordionContent = styled.p`
  margin-bottom: 1rem;
  color: #4d4f4c;
  max-width: 650px;
  line-height: 24px;
`;

const FAQTitle = styled.h3`
  white-space: nowrap;
  font-size: 28px;
  line-height: 28px;
  margin-bottom: 5rem;

  @media (min-width: 500px) {
    margin-bottom: 0rem;
  }
`;

const FAQWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 500px) {
    flex-direction: row;
  }
`;

const FooterButtons = styled.div`
  display: flex;
  flex-direction: column;
  & > *:not(:first-child) {
    margin-top: 8px;
  }

  @media (min-width: 768px) {
    flex-direction: row;
    & > *:not(:first-child) {
      margin-top: 0px;
    }
  }
`;

const FooterText = styled.span`
  font-weight: 600;
  font-size: 24px;
  text-align: center;

  @media (min-width: 768px) {
    text-align: start;
  }
`;

const LinkButton = styled(WhiteButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 200px;
  padding: 6px 10px;
  margin-left: 10px;
  text-wrap: nowrap;
  cursor: pointer;
  text-decoration: none;

  & > *:not(:first-child) {
    margin-left: 8px;
  }

  @media (min-width: 768px) {
    min-width: min-content;
  }
`;

const CardInnerWrapper = styled(_CardInnerWrapper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  & > *:not(:first-child) {
    margin-top: 24px;
  }

  @media (min-width: 768px) {
    flex-direction: row;
    & > *:not(:first-child) {
      margin-top: 0px;
    }
  }
`;

const FooterCard = styled(Card)`
  max-width: 1000px;
  margin: 10rem 24px;

  @media (min-width: 768px) {
    margin: 10rem auto;
  }
`;
