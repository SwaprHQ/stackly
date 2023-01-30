import { SubgraphVault } from '../UserVaultsContainer/types';

interface CreateOrderFromExistingVaultContainerProps {
  vault: SubgraphVault;
}

/**
 * Allows for creating a new DCA order from an existing vault
 * @param param0
 * @returns
 */
export function CreateOrderFromExistingVaultContainer({
  vault,
}: CreateOrderFromExistingVaultContainerProps) {
  return (
    <div>
      <h1>Create Order From Vault</h1>
    </div>
  );
}
