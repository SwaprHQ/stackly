import { Address } from '@graphprotocol/graph-ts';
import { Token, Vault } from '../../generated/schema';
import { ERC20 as ERC20Contract } from '../../generated/templates/Vault/ERC20';
import { Initialized, Cancelled } from '../../generated/templates/Vault/Vault';

export function createOrReturnTokenEntity(contractAddress: Address): Token {
  // Persist token data if it doesn't already exist
  let token = Token.load(contractAddress.toHex());
  if (token !== null) {
    return token;
  }
  let tokenContract = ERC20Contract.bind(contractAddress);
  token = new Token(contractAddress.toHex());
  token.name = tokenContract.name();
  token.symbol = tokenContract.symbol();
  token.decimals = tokenContract.decimals();
  token.save();
  return token;
}

export function handleVaultInitialized(event: Initialized): void {
  const vault = new Vault(event.params.vault.toHex());
  vault.createdAt = event.block.timestamp;
  vault.owner = event.params.owner;
  vault.token = createOrReturnTokenEntity(event.params.token).id;
  vault.save();
}

export function handleVaultCancelled(event: Cancelled): void {
  const vault = Vault.load(event.params.vault.toHex());
  if (vault === null) {
    return;
  }
  vault.cancelledAt = event.block.timestamp;
  vault.save();
}
