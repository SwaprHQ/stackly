import { getVault } from 'dca-sdk';
import { isAddress } from 'ethers/lib/utils.js';
import { useEffect, useState } from 'react';
import { CreateDCAVaultContainer } from '../components/CreateDCAVaultContainer';
import { SubgraphVault } from '../components/UserVaultsContainer/types';
import { PageLayout } from '../layout';

function CreateDCAVaultContainerFromExistingVault({
  vaultAddress,
}: {
  vaultAddress: string;
}) {
  const [isLoadingVault, setIsLoadingVault] = useState(true);

  const [existingVault, setExistingVault] = useState<SubgraphVault | undefined>(
    undefined
  );

  useEffect(() => {
    getVault(vaultAddress)
      .then((vault) => {
        if (vault) {
          setExistingVault(vault);
        }
      })
      .finally(() => {
        setIsLoadingVault(false);
      });
  }, [vaultAddress]);

  if (isLoadingVault) {
    return <div>Loading vault...</div>;
  }

  console.log(existingVault);

  return <CreateDCAVaultContainer existingVault={existingVault} />;
}

export function IndexPage() {
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
