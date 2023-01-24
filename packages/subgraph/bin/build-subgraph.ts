import { writeFile } from 'fs/promises';
import { stringify as yamlStringify } from 'yaml';

import { config } from './config';

async function main() {
  // get network from command line
  const network = process.argv[2] as string | undefined;
  // validate network
  if (!network || !['mainnet', 'xdai'].includes(network)) {
    throw new Error('Invalid network. Must be one of: mainnet, xdai');
  }

  const subgraph = {
    specVersion: '0.0.4',
    features: ['nonFatalErrors'],
    schema: {
      file: './schema.graphql',
    },
    dataSources: [
      {
        name: 'VaultFactory',
        kind: 'ethereum/contract',
        network,
        source: {
          address: config[network].vaultFactory.address,
          startBlock: config[network].vaultFactory.startBlock,
          abi: 'VaultFactory',
        },
        mapping: {
          kind: 'ethereum/events',
          apiVersion: '0.0.6',
          language: 'wasm/assemblyscript',
          file: './src/mappings/factory.ts',
          entities: ['VaultFactory'],
          abis: [
            {
              name: 'VaultFactory',
              file: './abis/VaultFactory.json',
            },
          ],
          eventHandlers: [
            {
              event: 'VaultCreated(indexed address)',
              handler: 'handleVaultCreated',
            },
          ],
        },
      },
    ],
    templates: [
      {
        name: 'Vault',
        kind: 'ethereum/contract',
        network,
        source: {
          abi: 'Vault',
        },
        mapping: {
          kind: 'ethereum/events',
          apiVersion: '0.0.6',
          language: 'wasm/assemblyscript',
          file: './src/mappings/vault.ts',
          entities: ['Vault', 'Token'],
          abis: [
            {
              name: 'Vault',
              file: './abis/Vault.json',
            },
            {
              name: 'ERC20',
              file: './abis/ERC20.json',
            },
          ],
          eventHandlers: [
            {
              event: 'Initialized(indexed address,address,address)',
              handler: 'handleVaultInitialized',
            },
            {
              event: 'Cancelled(indexed address)',
              handler: 'handleVaultCancelled',
            },
          ],
        },
      },
    ],
  };

  await writeFile(`./subgraph.yaml`, yamlStringify(subgraph));
}

main();
