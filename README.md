# COW Dollar Cost Averaging (DCA) Monorepo

## What's inside?

This turborepo uses [pnpm](https://pnpm.io) as a package manager. It includes the following
packages/apps:

### Apps and Packages

- `contracts`: smart contracts developed with Solidity and Foundry
- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo
- `app`: the main app for the DCA

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Getting Started


[Install pnpm](https://pnpm.io/installation) if not installed. Clone the monorepo:
```bash
git clone git@github.com:ImpeccableHQ/stackly.git
```

Build the SDK first, 

```bash
pnpm run build --filter=dca-sdk
```

Then run the CRA 

```
cd packages/app 
pnpm run start
```
