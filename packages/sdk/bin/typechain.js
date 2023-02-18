const { runTypeChain, glob } = require('typechain');

async function main() {
  const cwd = process.cwd();
  const allFiles = glob(cwd, [`./abis/**/*.json`]);

  console.log({
    cwd,
    allFiles,
  });

  const result = await runTypeChain({
    cwd,
    filesToProcess: allFiles,
    allFiles,
    outDir: './src/generated/contracts',
    target: 'ethers-v5',
    prettier: undefined,
  });
}

main().catch(console.error);
