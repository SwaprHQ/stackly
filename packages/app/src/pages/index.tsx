import { Amount, getVault, getVaultContract, Token } from 'dca-sdk';
import { isAddress } from 'ethers/lib/utils.js';
import { useEffect, useState } from 'react';
import { useProvider } from 'wagmi';
import {
  CreateDCAVaultContainer,
  findTokenByAddress,
} from '../components/CreateDCAVaultContainer';
import { SubgraphVault } from '../components/UserVaultsContainer/types';
import { PageLayout } from '../layout';

function CreateDCAVaultContainerFromExistingVault({
  vaultAddress,
}: {
  vaultAddress: string;
}) {
  const provider = useProvider();
  const [isLoadingVault, setIsLoadingVault] = useState(true);
  const [existingVault, setExistingVault] = useState<SubgraphVault | undefined>(
    undefined
  );
  const [existingVaultBalance, setExistingVaultBalance] = useState<
    Amount<Token> | undefined
  >(undefined);

  useEffect(() => {
    const fetchVaultInfo = async () => {
      try {
        const vault = await getVault(vaultAddress);
        if (!vault) {
          throw new Error('Vault not found');
        }
        setExistingVault(vault);
        const vaultContract = getVaultContract(vaultAddress, provider);
        const vaultTokenBalance = await vaultContract.balance();
        const vaultToken = findTokenByAddress(vault.token.id);
        if (!vaultToken) {
          throw new Error('Vault token not found');
        }
        setExistingVaultBalance(
          Amount.fromRawAmount(vaultToken, vaultTokenBalance)
        );
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoadingVault(false);
      }
    };
    fetchVaultInfo();
  }, [vaultAddress, provider]);

  if (isLoadingVault) {
    return <div>Loading vault...</div>;
  }

  console.log(existingVault);

  return (
    <CreateDCAVaultContainer
      existingVault={existingVault}
      existingVaultBalance={existingVaultBalance}
    />
  );
}

export default function IndexPage() {
  const query = new URLSearchParams(window.location.search);
  const vaultAddress = query.get('vault');

  return (
    <PageLayout>
      {vaultAddress && isAddress(vaultAddress) ? (
        <CreateDCAVaultContainerFromExistingVault vaultAddress={vaultAddress} />
      ) : (
        <CreateDCAVaultContainer />
      )}
    </PageLayout>
  );
}
