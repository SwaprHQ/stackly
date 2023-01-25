import type { getUserVaults } from "dca-sdk";

export type SubgraphVault = Awaited<ReturnType<typeof getUserVaults>>[0];
