import { Wallet } from '@ethersproject/wallet';
import { Agenda } from '@hokify/agenda';
import dayjs from 'dayjs';
import { getVaultContract } from 'dca-sdk';

import {
  DCAExecutionOrderDocument_OrderPopulated,
  DCAExecutionOrderModel,
} from '../models/DCAExecutionOrder';
import { getRequiredEnv } from '../utils/env';
import { getProvider } from '../web3';
import { postCOWOrder, getCOWQuote, OrderKind } from './cow';

const mongoURI = getRequiredEnv('MONGO_URI');
const vaultDriverPrivateKey = getRequiredEnv('VAULT_DRIVER_PRIVATE_KEY');

export enum AgendaJobNames {
  EXECUTE_DCA_ORDERS = 'Execute DCA Order',
}

const agenda = new Agenda({
  name: 'dcaOrders',
  db: {
    address: mongoURI,
    collection: 'agendajobs',
  },
  processEvery: '1 minute',
});

export async function findAndProcessDCAOrders() {
  // Coverage is 12 minutes (6 minutes before and 6 minutes after)
  // Since jobs are executed every 10 minutes, we have 2 minutes of overlap, ensuring that all orders are executed
  const rangePast = dayjs().utc().subtract(6, 'minutes');
  const rangeFuture = dayjs().utc().add(6, 'minutes');

  const query = {
    executeAt: {
      $gte: rangePast.toDate(),
      $lte: rangeFuture.toDate(),
    },
  };

  console.log(query);

  const executionOrders = await DCAExecutionOrderModel.find(query)
    .populate('order')
    .exec();

  console.log({
    executionOrders,
  });
  // Execute orders
  for await (const executionOrder of executionOrders) {
    try {
      await handleExecutionOrder(executionOrder as any);
    } catch (error) {
      console.error(error);
    }
  }
}

agenda.define(AgendaJobNames.EXECUTE_DCA_ORDERS, findAndProcessDCAOrders);

export async function startAgenda() {
  await agenda.start();

  await agenda.every(
    '2 minutes',
    AgendaJobNames.EXECUTE_DCA_ORDERS,
    {},
    {
      timezone: 'utc',
    }
  );
}

async function graceful() {
  await agenda.stop();
  process.exit(0);
}

process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);

async function handleExecutionOrder(
  executionOrder: DCAExecutionOrderDocument_OrderPopulated
) {
  const vaultContract = getVaultContract(
    executionOrder.order.vault,
    getProvider(executionOrder.order.chainId)
  );
  const receiver = await vaultContract.owner(); // attacker's address
  // const cowSdk = new CowSdk(executionOrder.order.chainId as number);
  const validTo = dayjs().utc().add(1, 'hour').unix();
  const cowQuote = await getCOWQuote(executionOrder.order.chainId, {
    appData:
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    from: executionOrder.order.vault, // the vault address will,
    buyToken: executionOrder.order.buyToken,
    sellToken: executionOrder.order.sellToken,
    sellAmountBeforeFee: executionOrder.executeAmount,
    kind: OrderKind.SELL,
    partiallyFillable: false,
    validTo,
    receiver,
  });

  const cowOrderId = await postCOWOrder(executionOrder.order.chainId, {
    ...cowQuote.quote,
    from: cowQuote.from,
    sellTokenBalance: 'erc20',
    buyTokenBalance: 'erc20',
    signingScheme: 'presign',
    signature: '0x',
  });

  // Append the order to the vault
  executionOrder.providerData = {
    cowOrderId,
  };

  const vaultSigner = new Wallet(
    vaultDriverPrivateKey,
    getProvider(executionOrder.order.chainId)
  );

  const executeTx = await vaultContract
    .connect(vaultSigner)
    .execute(cowOrderId, true);

  console.log(executeTx);

  console.log(cowQuote);
}
