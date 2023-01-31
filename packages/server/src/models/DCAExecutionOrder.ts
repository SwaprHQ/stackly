import dayjs from 'dayjs';
import {
  ClientSession,
  Document,
  LeanDocument,
  model,
  ObjectId,
  Schema,
} from 'mongoose';
import { DollarCostAveragingOrderDocument } from './DollarCostAveragingOrder';
import dayjsIsBetweenPlugin from 'dayjs/plugin/isBetween';

dayjs.extend(dayjsIsBetweenPlugin);

export enum DCAExecutionOrderStatus {
  PENDING = 'pending',
  EXECUTING = 'executing', // describes the state of the order being executed on-chain or with the COW protocol
  EXECUTED = 'executed',
  FAILED = 'failed',
}

export interface DCAExecutionOrderDocument extends Document {
  /**
   * The date and time to execute the order
   */
  executeAt: Date;
  /**
   * The amount to execute in the order's sell token
   */
  executeAmount: string;
  /**
   * The order of which this execution order is a part of
   */
  order: ObjectId;
  /**
   * The status of the execution order
   */
  status: DCAExecutionOrderStatus;
  /**
   * The provider data of the execution order
   */
  providerData: Record<string, unknown>;
}

export interface DCAExecutionOrderDocument_OrderPopulated
  extends Omit<DCAExecutionOrderDocument, 'order'> {
  /**
   * The order of which this execution order is a part of
   */
  order: DollarCostAveragingOrderDocument;
}

export const dcaExecutionOrderSchema = new Schema<DCAExecutionOrderDocument>(
  {
    executeAt: {
      type: Date,
      required: true,
    },
    executeAmount: {
      type: String,
      required: true,
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: 'DollarCostAveragingOrder',
    },
    status: {
      type: String,
      enum: Object.values(DCAExecutionOrderStatus),
      default: DCAExecutionOrderStatus.PENDING,
    },
    providerData: {
      type: Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

export const DCAExecutionOrderModel = model<DCAExecutionOrderDocument>(
  'DCAExecutionOrder',
  dcaExecutionOrderSchema
);

export async function createDollarCostAveragingExecutionOrder(
  {
    executeAt,
    executeAmount,
  }: Pick<DCAExecutionOrderDocument, 'executeAt' | 'executeAmount'>,
  order: DollarCostAveragingOrderDocument & { _id: ObjectId },
  session: ClientSession
): Promise<DCAExecutionOrderDocument> {
  if (!order._id || !order.startAt || !order.endAt) {
    throw new Error(
      `order must have an _id, startAt, and endAt to create an execution order`
    );
  }

  // executeAt must be within the order's startAt and endAt
  const orderStartAt = dayjs(order.startAt);
  const orderEndAt = dayjs(order.endAt);
  const executeAtDayJS = dayjs(executeAt);

  if (!executeAtDayJS.isBetween(orderStartAt, orderEndAt, 'minute', '[]')) {
    throw new Error(
      `executeAt (${executeAtDayJS.format(
        'YYYY-MM-DD HH:mm:ss'
      )}) must be within the order's startAt (${orderStartAt.format(
        'YYYY-MM-DD HH:mm:ss'
      )}) and endAt (${orderEndAt.format('YYYY-MM-DD HH:mm:ss')})`
    );
  }

  return await new DCAExecutionOrderModel({
    executeAt,
    executeAmount,
    order: order._id,
  }).save({ session });
}
