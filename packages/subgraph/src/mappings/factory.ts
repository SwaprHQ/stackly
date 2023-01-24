import { VaultCreated } from '../../generated/VaultFactory/VaultFactory';
import { Vault as VaultTemplate } from '../../generated/templates';
import { VaultFactory } from '../../generated/schema'

// This handler is called by block handlers
export function handleVaultCreated(event: VaultCreated): void {

  let vaultFactory = VaultFactory.load('1');

  if (vaultFactory === null) {
    vaultFactory = new VaultFactory('1');
    vaultFactory.address = event.address;
    vaultFactory.vaultCount =  0;
  }

  vaultFactory.vaultCount = vaultFactory.vaultCount + 1;
  vaultFactory.save();

  const vaultAddress = event.params.vault;
  // Create a new Vault entity
  VaultTemplate.create(vaultAddress);
}
