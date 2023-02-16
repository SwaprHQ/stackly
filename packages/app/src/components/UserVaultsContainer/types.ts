import type { getUserOrders } from "dca-sdk";

export type SubgraphOrder = Awaited<ReturnType<typeof getUserOrders>>[0];
