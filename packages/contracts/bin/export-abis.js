// Path: packages/contracts/bin/export-abis.js
import { writeFile, mkdir } from 'fs/promises';
import DCAOrderArtifacts from '../out/DCAOrder.sol/DCAOrder.json' assert { type: 'json' };
import OrderFactoryArtifacts from '../out/OrderFactory.sol/OrderFactory.json' assert { type: 'json' };
import ERC20Artifacts from '../out/ERC20.sol/ERC20.json' assert { type: 'json' };

async function main() {
  await mkdir('./abis', { recursive: true });

  await writeFile('./abis/DCAOrder.json', JSON.stringify(DCAOrderArtifacts.abi, null, 2));
  await writeFile('./abis/OrderFactory.json', JSON.stringify(OrderFactoryArtifacts.abi, null, 2));
  await writeFile('./abis/ERC20.json', JSON.stringify(ERC20Artifacts.abi, null, 2));
}

main();
