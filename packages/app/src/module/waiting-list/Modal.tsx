import { ModalContent } from '../../components/Modal/styles';
import { FooterContent } from '../../components/Footer';
import { ModalBackdrop, ModalHeader, ModalInnerWrapper, ModalOutterWrapper } from '../../components/Modal/styles';
import { Button } from '../../ui/components/Button';
import { ReactComponent as DiscordLogo } from '../../assets/svg/discord-mark-black.svg';
import styled from 'styled-components';
import { useSimpleAnalyticsEvent } from '../../hooks/useSimpleAnalyticsEvent';
import { DISCORD_BUTTON_CLICK } from '../../analytics';

export const Modal = () => {
  const trackEvent = useSimpleAnalyticsEvent();

  return (
    <Overlay>
      <ModalBackdrop>
        <ModalOutterWrapper maxWidth="600px">
          <ModalInnerWrapper>
            <ModalHeader>
              <Header1>Stackly is launching soon</Header1>
            </ModalHeader>
            <ModalContent>
              <Paragraph>
                A new way to stack your crypto over time
                <br />
                with DCA is coming.
                <br />
                <br />
                Join the waitlist via our Discord.
              </Paragraph>
              <ButtonLink
                as="a"
                href="https://discord.gg/aypsC8nrkP"
                target="_blank"
                onClick={() => trackEvent(DISCORD_BUTTON_CLICK)}
              >
                <Flex>
                  Go to Discord <DiscordLogo height="14px" />
                </Flex>
              </ButtonLink>
              <SmallFontParagraph>Probably nothing...</SmallFontParagraph>
              <FooterContent />
            </ModalContent>
          </ModalInnerWrapper>
        </ModalOutterWrapper>
      </ModalBackdrop>
    </Overlay>
  );
};
const ButtonLink = styled(Button)`
  text-decoration: none;
  margin-bottom: 10px;
`;

const Overlay = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(10px);
  z-index: 1001;
`;

const Flex = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;

const Paragraph = styled.p`
  font-size: 24px;
  text-align: center;
  margin-bottom: 40px;
`;

const SmallFontParagraph = styled.p`
  font-size: 12px;
  opacity: 60%;
  margin-bottom: 40px;
`;

const Header1 = styled.h1`
  text-align: center;
`;
