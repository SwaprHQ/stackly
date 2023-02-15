import { badRequest } from '@hapi/boom';
import { Request, ResponseToolkit } from '@hapi/hapi';
import Joi from 'joi';
import { formatUnits, parseUnits } from '@ethersproject/units';
import { DollarCostAveragingOrderModel } from '../models/DollarCostAveragingOrder';
import {
  ChainId,
  getVaultContract,
  DCAFrequencyInterval,
  DollarCostAveragingOrderWithSignature,
  getERC20Contract,
  getOrderSigner,
} from 'dca-sdk';
import { getProvider } from '../web3';

import dayjs from 'dayjs';
import dayjsUTCPlugin from 'dayjs/plugin/utc';
import { createDollarCostAveragingExecutionOrder } from '../models/DCAExecutionOrder';
import mongoose, { ClientSession } from 'mongoose';

dayjs.extend(dayjsUTCPlugin);
interface ICreateOrderRequest extends Request {
  payload: DollarCostAveragingOrderWithSignature;
}

export async function handleCreateOrder(
  request: ICreateOrderRequest,
  response: ResponseToolkit
) {
  let session: ClientSession | null = null;
  try {
    const { signature, ...order } = request.payload;

    const vaultContract = await getVaultContract(
      order.vault,
      getProvider(order.chainId as ChainId)
    );

    const vaultTokenContract = getERC20Contract(
      order.sellToken,
      getProvider(order.chainId as ChainId)
    );

    const vaultTokenDecimals = await vaultTokenContract.decimals();
    const vaultBalance = await vaultContract.balance();

    if (vaultBalance.lt(order.sellAmount)) {
      throw badRequest(
        `The vault does not have enough balance to execute the order.`
      );
    }

    const vaultOwner = await vaultContract.owner();

    const orderSignerAddress = await getOrderSigner(order, signature);

    if (orderSignerAddress.toLowerCase() !== vaultOwner.toLowerCase()) {
      throw badRequest(
        `Order signature is invalid. The order signer must be the vault owner.`
      );
    }

    const startAt = dayjs.unix(order.startAt);
    const endAt = dayjs.unix(order.endAt);
    // Calculate the number of buy orders
    const buyOrders = Math.ceil(
      endAt.diff(startAt, order.frequencyInterval) / order.frequency
    );

    // Calculate the amount to buy per order
    const sellAmountPerExecutionFloat =
      parseFloat(formatUnits(order.sellAmount, vaultTokenDecimals)) /
      (buyOrders === 0 ? 1 : buyOrders);

    const sellAmountPerExecution = parseUnits(
      sellAmountPerExecutionFloat.toString(),
      vaultTokenDecimals
    ).toString();
    // Start a transaction
    session = await mongoose.startSession();
    session.startTransaction();

    // Create main order
    const dcaOrderDocument = await new DollarCostAveragingOrderModel({
      chainId: order.chainId,
      vault: order.vault.toLowerCase(),
      vaultOwner: vaultOwner.toLowerCase(),
      sellToken: order.sellToken.toLowerCase(),
      buyToken: order.buyToken.toLowerCase(),
      sellAmount: order.sellAmount,
      startAt: startAt.toDate(),
      endAt: endAt.toDate(),
      frequency: order.frequency,
      frequencyInterval: order.frequencyInterval,
      recipient: order.recipient.toLowerCase(),
      signature,
      averagePrice: '0',
    });

    // Create execution orders
    for (let i = 0; i < buyOrders; i++) {
      let executeAt = startAt
        .clone()
        .millisecond(0)
        .second(0)
        .add(i * order.frequency, order.frequencyInterval);
      // First item moves to the next minute
      if (i === 0) {
        executeAt = executeAt.add(1, 'minute');
      }
      // Last item moves to the previous minute
      if (i === buyOrders - 1) {
        executeAt = executeAt.subtract(1, 'minute');
      }
      const executionOrderDocument =
        await createDollarCostAveragingExecutionOrder(
          {
            executeAt: executeAt.toDate(),
            executeAmount: sellAmountPerExecution,
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          dcaOrderDocument as any,
          session
        );

      dcaOrderDocument.executions.push(executionOrderDocument._id);
    }

    await dcaOrderDocument.save({
      session,
    });

    // End mongoose session
    await session.commitTransaction();
    await session.endSession();

    return response
      .response(
        dcaOrderDocument.toJSON({
          flattenMaps: true,
        })
      )
      .code(201);
  } catch (error) {
    console.error(error);
    if (error.isBoom) {
      throw error;
    }
    throw badRequest(error);
  }
}

export const createOrderRequestDTO =
  Joi.object<DollarCostAveragingOrderWithSignature>({
    sellToken: Joi.string()
      .required()
      .description('The token to sell. Also, deposited into the vault'),
    sellAmount: Joi.string()
      .required()
      .description('Sell amount. Also, deposited into the vault'),
    signature: Joi.string()
      .required()
      .description('The signature of the order. Signed by the vault owner'),
    buyToken: Joi.string().required().description('The token to buy'),
    vault: Joi.string().required().description('The vault to buy from'),
    frequency: Joi.number()
      .required()
      .description('The frequency of the order; number of orders per interval'),
    frequencyInterval: Joi.string()
      .allow(
        DCAFrequencyInterval.HOUR,
        DCAFrequencyInterval.DAY,
        DCAFrequencyInterval.WEEK,
        DCAFrequencyInterval.MONTH
      )
      .description('The frequency interval of the order'),
    startAt: Joi.number().required().description('The start date of the order'),
    endAt: Joi.number().required().description('The end date of the order'),
    chainId: Joi.number()
      .required()
      .allow(ChainId.ETHEREUM, ChainId.GNOSIS)
      .description('The chain id of the order'),
    recipient: Joi.string(),
  }).label('CreateOrderRequestDTO');
