import { ModalContent } from '../../components/Modal/styles';
import { FooterContent } from '../../components/Footer';
import { ModalBackdrop, ModalHeader, ModalInnerWrapper, ModalOutterWrapper } from '../../components/Modal/styles';
import { Button } from '../../ui/components/Button';
import { ReactComponent as DiscordLogo } from '../../assets/svg/discord-mark-black.svg';
import styled from 'styled-components';
import { useSimpleAnalyticsEvent } from '../../hooks/useSimpleAnalyticsEvent';
import { DISCORD_BUTTON_CLICK } from '../../analytics';
import { useAccount, useDisconnect, useNetwork, useSigner } from 'wagmi';
import { getNftWhitelistAddress, getWhitelist, nftWhitelistBalanceOf } from 'dca-sdk';
import { useEffect, useState } from 'react';

export const Modal = () => {
  const trackEvent = useSimpleAnalyticsEvent();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const account = useAccount();
  const [showModal, setShowModal] = useState(false);
  const { disconnect } = useDisconnect();

  useEffect(() => {
    const getNFTHolder = async () => {
      if (process.env.REACT_APP_WHITELIST_STATUS !== 'true') {
        return;
      }

      if (account.address && chain && signer) {
        const nftWhitelist = getWhitelist(getNftWhitelistAddress(chain.id), signer);
        const amount = await nftWhitelistBalanceOf(nftWhitelist, account.address);
        setShowModal(amount.eq(0));
      }
    };

    getNFTHolder();
  }, [account.address, chain, signer]);

  useEffect(() => {
    if (!account.isConnected) {
      setShowModal(false);
    }
  }, [account.isConnected]);

  if (!showModal || process.env.REACT_APP_WHITELIST_STATUS !== 'true') {
    return <></>;
  }

  const discordLink = process.env.REACT_APP_DISCORD_WAITLIST_LINK;
  
  return (
    <Overlay>
      <ModalBackdrop>
        <ModalOutterWrapper maxWidth="600px">
          <ModalInnerWrapper>
            <ModalHeader>
              <Header1>Stackly beta is here</Header1>
            </ModalHeader>
            <ModalContent>
              <Paragraph>
                Stackly beta is exclusive for
                <br />
                our NFT holders.
                <br />
                <br />
                Mint your free NFT via our Discord.
              </Paragraph>
              <ButtonLink as="a" href={discordLink} target="_blank" onClick={() => trackEvent(DISCORD_BUTTON_CLICK)}>
                <Flex>
                  Go to Discord <DiscordLogo height="14px" />
                </Flex>
              </ButtonLink>
              <SmallFontParagraph>Probably nothing...</SmallFontParagraph>
              <Paragraph>
                <SmallText>
                  <p>You have another wallet?</p>
                  <DisconnectButton onClick={() => disconnect()}>Disconnect wallet</DisconnectButton>
                </SmallText>
              </Paragraph>
              <FooterContent />
            </ModalContent>
          </ModalInnerWrapper>
        </ModalOutterWrapper>
      </ModalBackdrop>
    </Overlay>
  );
};

const SmallText = styled.div`
  font-size: 14px;
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
