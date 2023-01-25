import { AddressZero } from '@ethersproject/constants';
import type { ContractReceipt } from '@ethersproject/contracts';
import type { Provider } from '@ethersproject/abstract-provider';
import type { Signer } from '@ethersproject/abstract-signer';

import {
  VAULT_DRIVER_ADDRESS_LIST,
  VAULT_FACTORY_ADDRESS_LIST,
} from './constants';
import { ChainId } from '../constants';
import {
  VaultFactory__factory,
  Vault__factory,
  ERC20__factory,
  VaultFactory,
} from '../types/contracts';

/**
 * Creates a contract instance for a vault
 * @param vaultAddress
 * @param provider
 * @returns
 */
export function getVaultContract(
  vaultAddress: string,
  signerOrProvider: Provider | Signer
) {
  return Vault__factory.connect(vaultAddress, signerOrProvider);
}

/**
 * Create a contract instance for an ERC20 token
 * @param tokenAddress
 * @param provider
 * @returns
 */
export function getERC20Contract(
  tokenAddress: string,
  signerOrProvider: Provider | Signer
) {
  return ERC20__factory.connect(tokenAddress, signerOrProvider);
}

/**
 * Returns the address of the vault factory for a given chain id
 * @param chainId The chain id
 * @returns
 */
export function getVaultFactoryAddress(chainId: ChainId): string {
  const address = VAULT_FACTORY_ADDRESS_LIST[chainId];
  if (address === AddressZero) {
    throw new Error(`Vault factory is not deployed on chain ${chainId}`);
  }

  return address;
}

/**
 * Gets the address of the vault singleton for a given chain id
 * @param chainId The chain id
 * @returns
 */
export function getVaultSingletonAddress(chainId: ChainId): string {
  const address = VAULT_FACTORY_ADDRESS_LIST[chainId];
  if (address === AddressZero) {
    throw new Error(`Vault singleton is not deployed on chain ${chainId}`);
  }

  return address;
}

/**
 *
 * @param address
 * @param provider
 * @returns
 */
export function getVaultFactory(
  address: string,
  signerOrProvider: Provider | Signer
) {
  if (address === AddressZero) {
    throw new Error(`Zero address is not a valid vault factory address`);
  }

  return VaultFactory__factory.connect(address, signerOrProvider);
}

export function getVaultFactoryInterface() {
  return VaultFactory__factory.createInterface();
}

export function getVaultInterface() {
  return Vault__factory.createInterface();
}

export function getERC20Interface() {
  return ERC20__factory.createInterface();
}

export function getVaultAddressFromTransactionReceipt(
  receipt: ContractReceipt
) {
  const vaultFactoryInterface = getVaultFactoryInterface();

  let vaultAddress: undefined | string;

  receipt.events?.forEach((event) => {
    if (
      event.event === vaultFactoryInterface.events['VaultCreated(address)'].name
    ) {
      vaultAddress = event.args?.vault;
    }
  });

  return vaultAddress;
}



interface CreateVaultWithNonceParams {
  vaultFactory: VaultFactory;
  token: string;
  owner: string;
  nonce: number;
  /**
   * The driver to use for the vault. If not provided, the default driver will be used
   */
  driver?: string;
}



/**
 * Creates a new vault using the vault factory
 * @param param0
 * @returns
 */
export async function createVaultWithNonce({
  vaultFactory,
  token,
  owner,
  nonce,
  driver,
}: CreateVaultWithNonceParams): Promise<{
  vault?: string;
  error ?: Error;
  receipt: ContractReceipt;
}> {
  const rawChainId = (await vaultFactory.provider
    .getNetwork()
    .then((n) => n.chainId)) as number;
  const chainId = rawChainId as ChainId;

  driver = driver || VAULT_DRIVER_ADDRESS_LIST[chainId];

  if (!driver || driver === AddressZero) {
    throw new Error(`No driver found for chain ${chainId}`);
  }

  const initilizer = getVaultInterface().encodeFunctionData('initialize', [
    owner,
    driver,
    token,
  ]);

  const createVaultWithNonceTx = await vaultFactory.createVaultWithNonce(
    getVaultSingletonAddress(chainId),
    initilizer,
    nonce
  );

  const receipt = await createVaultWithNonceTx.wait();
  const vault = getVaultAddressFromTransactionReceipt(receipt);

  if (!vault) {
    return {
      error: new Error('Vault address not found in transaction receipt'),
      receipt,
    }
  }

  return {
    vault,
    receipt,
  };
}
