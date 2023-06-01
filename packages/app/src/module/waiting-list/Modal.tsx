import { ModalContent } from '../../components/Modal/styles';
import { FooterContent } from '../../components/Footer';
import { ModalBackdrop, ModalHeader, ModalInnerWrapper, ModalOutterWrapper } from '../../components/Modal/styles';
import { Button } from '../../ui/components/Button';
import { ReactComponent as DiscordLogo } from '../../assets/svg/discord-mark-black.svg';
import styled from 'styled-components';
import { ReactNode } from 'react';
import { useDisconnect } from 'wagmi';
import { DISCORD_BUTTON_CLICK } from '../../analytics';
import { useSimpleAnalyticsEvent } from '../../hooks/useSimpleAnalyticsEvent';

interface IModal {
  children: ReactNode;
  title: string;
}

export const Modal = ({ children, title }: IModal) => {
  const trackEvent = useSimpleAnalyticsEvent();
  return (
    <Overlay>
      <ModalBackdrop>
        <ModalOutterWrapper maxWidth="600px">
          <ModalInnerWrapper>
            <ModalHeader>
              <Header1>{title}</Header1>
            </ModalHeader>
            <ModalContent>
              {children}
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

export const LaunchModal = () => {
  return (
    <Modal title="Stackly is launching soon">
      <Content>
        A new way to stack your crypto over time
        <br />
        with DCA is coming.
        <br />
        <br />
        Join the waitlist via our Discord.
      </Content>
    </Modal>
  );
};

export const WaitingListModal = () => {
  const { disconnect } = useDisconnect();

  return (
    <Modal title="You need to be on the waitlist">
      <Content>
        This address is not present on our waitlist.
        <br />
        <br />
        To try Stackly DCA,
        <br />
        join the waitlist via our Discord.
        <br />
        <br />
        <SmallText>
          <p>You have another wallet?</p>
          <DisconnectButton onClick={() => disconnect()}>Disconnect wallet</DisconnectButton>
        </SmallText>
      </Content>
    </Modal>
  );
};

const SmallText = styled.div`
  font-size: 16px;
`;

const DisconnectButton = styled.button`
  text-decoration: underline;
  border: none;
  background: transparent;
  color: #000;
  font-size: inherit;
`;

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
  top: 0;
`;

const Flex = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
`;

const Content = styled.div`
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
