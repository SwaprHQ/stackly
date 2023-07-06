import { useEffect, useState } from 'react';

import { useAccount, useNetwork, useSigner, useSwitchNetwork } from 'wagmi';
import { Button } from '../../ui/components/Button/Button';
import {
  getWhitelist,
  getNftWhitelistAddress,
  nftWhitelistMint,
  nftWhitelistBalanceOf,
  nftWhitelistTotalSupply,
  nftWhitelistMaxSupply,
  ChainId,
} from 'dca-sdk';
import styled from 'styled-components';
import { Container } from '../Container';
import { Link } from 'react-router-dom';
import { Modal, useModal } from '../../modal';

export function Mint() {
  const { chain, chains } = useNetwork();
  const { openModal } = useModal();
  const { data: signer } = useSigner();
  const account = useAccount();
  const { switchNetworkAsync } = useSwitchNetwork();

  const [mintedAmount, setMintedAmount] = useState<string>('-');
  const [maxSupply, setMaxSupply] = useState<string>('-');
  const [isNFTHolder, setIsNFTHolder] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();
  const [waitForMint, setWaitForMint] = useState(false);

  const isNetworkSupported = chains.find((c) => c.id === chain?.id);

  useEffect(() => {
    const fetchData = async () => {
      if (!signer || !chain || !account.address) {
        return;
      }

      setError(undefined);

      if (!isNetworkSupported) {
        setIsNFTHolder(false);
      }

      const nftWhitelist = getWhitelist(getNftWhitelistAddress(chain.id), signer);

      Promise.all([
        nftWhitelistTotalSupply(nftWhitelist),
        nftWhitelistMaxSupply(nftWhitelist),
        nftWhitelistBalanceOf(nftWhitelist, account.address),
      ])
        .then(([newMintedAmount, newMaxSupply, newBalance]) => {
          setMintedAmount(newMintedAmount.toString());
          setMaxSupply(newMaxSupply.toString());
          setIsNFTHolder(newBalance.gt(0));
        })
        .catch(console.error);
    };

    fetchData();
  }, [account.address, chain, isNetworkSupported, signer]);

  useEffect(() => {
    if (account.isDisconnected) {
      setError(undefined);
      setIsNFTHolder(false);
    }
  }, [account.isDisconnected]);

  const mint = async () => {
    if (!signer || !account.address || !chain) {
      return;
    }

    setLoading(true);
    setError(undefined);

    const nftWhitelist = getWhitelist(getNftWhitelistAddress(chain.id), signer);
    try {
      await nftWhitelistMint(nftWhitelist);
      setWaitForMint(true);
    } catch (e: any) {
      console.error(e);
      if (e.code === 'ACTION_REJECTED') setError('Minting rejected.');
      else setError('Oops! Something went wrong.');
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (waitForMint) {
      interval = setInterval(async () => {
        if (!signer || !account.address || !chain) {
          return;
        }

        const nftWhitelist = getWhitelist(getNftWhitelistAddress(chain.id), signer);
        const amount = await nftWhitelistBalanceOf(nftWhitelist, account.address);
        const totalMinted = await nftWhitelistTotalSupply(nftWhitelist);

        if (amount.gt(0)) {
          setMintedAmount(totalMinted.toString());
          setIsNFTHolder(true);
          setWaitForMint(false);
          setLoading(false);
        }
      }, 2000);
    } else {
      if (interval !== null) {
        clearInterval(interval);
      }
    }

    return () => {
      if (interval !== null) {
        clearInterval(interval);
      }
    };
  }, [account.address, chain, signer, waitForMint]);

  return (
    <Container>
      <BigText>Stackly Closed Beta NFT - Mint to get early access</BigText>
      <ImageContainer>
        <img
          width={300}
          height={300}
          alt={'Stackly Beta Badge'}
          src={'https://ipfs.io/ipfs/QmZdgaXjCr36Kys6mBRMuKG5tipKAhhazCcbxKYBKvaqdD'}
        />
      </ImageContainer>

      {account.isConnected && isNetworkSupported && <Text>{`${mintedAmount}/${maxSupply} NFTs minted so far.`}</Text>}

      <ButtonContainer>
        {!account.isConnected ? (
          <Button type="button" onClick={() => openModal(Modal.Wallet)} title="Connect Wallet">
            Connect Wallet
          </Button>
        ) : !isNetworkSupported ? (
          <Button onClick={() => switchNetworkAsync?.(ChainId.GNOSIS)}>Unsupported Network</Button>
        ) : !isNFTHolder ? (
          <Button type="button" title="Mint NFT to access" onClick={mint}>
            {isLoading ? 'Minting...' : 'Mint NFT to access'}
          </Button>
        ) : (
          <LinkButton as={Link} to="/" type="button" title="Create a stack">
            Create a stack
          </LinkButton>
        )}
      </ButtonContainer>

      {isNFTHolder && <Text>Congratulations, you hold the Stackly Beta NFT!</Text>}
      {error && <Text>{error}</Text>}
    </Container>
  );
}

const ImageContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 20px 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 16px;
  img {
    width: 300px;
  }
`;

const Text = styled.p`
  margin-left: 12px;
  text-wrap: wrap;
  text-align: center;

  font-weight: 600;
  font-size: 14px;

  justify-content: space-around;
  align-items: center;
  margin-bottom: 16px;

  display: flex;
  @media (min-width: 768px) {
    font-size: 16px;
    line-height: 19px;
    display: flex;
  }
`;

const LinkButton = styled(Button)`
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  text-wrap: nowrap;
  cursor: pointer;
  text-decoration: none;
  display: flex;
`;

const BigText = styled(Text)`
  font-size: 22px;
`;
