import { useEffect, useState } from 'react';

import { useAccount, useNetwork, useSigner } from 'wagmi';
import { Button, WhiteButton } from '../../ui/components/Button/Button';
import {
  getWhitelist,
  getNftWhitelistAddress,
  nftWhitelistMint,
  nftWhitelistBalanceOf,
  nftWhitelistTotalSupply,
} from 'dca-sdk';
import styled from 'styled-components';
import { Container, ContainerTitle } from '../Container';
import { Link } from 'react-router-dom';
import { waitForTransaction } from '@wagmi/core';
import { nftWhitelistMaxSupply } from 'dca-sdk';

export function Mint() {
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const account = useAccount();

  const [mintedAmount, setMintedAmount] = useState<string>('-');
  const [maxSupply, setMaxSupply] = useState<string>('-');
  const [isNFTHolder, setIsNFTHolder] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    const fetchData = async () => {
      if (!signer || !chain || !account.address) {
        return;
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
  }, [account.address, chain, signer]);

  const mint = async () => {
    if (!signer || !account.address || !chain) {
      return;
    }
    setLoading(true);

    const nftWhitelist = getWhitelist(getNftWhitelistAddress(chain.id), signer);
    try {
      const tx = await nftWhitelistMint(nftWhitelist);

      await waitForTransaction({
        confirmations: 2,
        hash: tx.hash as `0x${string}`,
      });

      setError(undefined);

      if (account.address) {
        const nftWhitelist = getWhitelist(getNftWhitelistAddress(chain.id), signer);
        const amount = await nftWhitelistBalanceOf(nftWhitelist, account.address);
        setIsNFTHolder(amount.gt(0));
      }
    } catch (e: any) {
      if (e.code === 'ACTION_REJECTED') setError('Minting rejected.');
      else setError('Oops! Something went wrong.');
    }
    setLoading(false);
  };

  if (!account.isConnected) {
    return (
      <Container>
        <ContainerTitle>Connect your wallet</ContainerTitle>
      </Container>
    );
  }

  return (
    <Container>
      <ImageContainer>
        <img alt={'Stackly Beta Badge'} src={'https://ipfs.io/ipfs/QmZdgaXjCr36Kys6mBRMuKG5tipKAhhazCcbxKYBKvaqdD'} />
      </ImageContainer>

      <Text>{`${mintedAmount}/${maxSupply} NFTs minted so far.`}</Text>

      {!isNFTHolder ? (
        <ButtonContainer>
          <Button type="button" title="Mint free Beta NFT" onClick={mint}>
            {isLoading ? 'Minting...' : 'Mint free Beta NFT'}
          </Button>
        </ButtonContainer>
      ) : (
        <ButtonContainer>
          <LinkButton as={Link} to="/" type="button" title="Create a stack">
            Create a stack
          </LinkButton>
        </ButtonContainer>
      )}

      {isNFTHolder && <Text>Congratulations, you hold the Stackly Beta NFT!</Text>}
      {error && <Text> {error}</Text>}
    </Container>
  );
}

const ImageContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-bottom: 16px;
  img {
    width: 300px;
  }
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
  text-wrap: nowrap;

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

