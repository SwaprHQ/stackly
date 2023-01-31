import { isAddress } from '@ethersproject/address';
import { Document, model, Schema } from 'mongoose';
import {
  ChainId,
  DCAFrequencyInterval,
  DollarCostAveragingOrder,
} from 'dca-sdk';
import dayjs from 'dayjs';

import dayjsUTCPlugin from 'dayjs/plugin/utc';
import { DCAExecutionOrderDocument } from './DCAExecutionOrder';

dayjs.extend(dayjsUTCPlugin);

export interface DollarCostAveragingOrderDocument
  extends Document, Omit<DollarCostAveragingOrder, 'startAt' | 'endAt'> {
  startAt: Date;
  endAt: Date;
  createdAt: Date;
  updatedAt: Date;
  vaultOwner: string;
  /**
   * The average price of the order.
   */
  averagePrice: string;
  /**
   * The executions of the order.
   * @type {DCAExecutionOrderDocument[]}
   */
  executions: string[];
}

export interface DollarCostAveragingOrderDocument_Populated
  extends Omit<DollarCostAveragingOrderDocument, 'executions'> {
  executions: DCAExecutionOrderDocument[];
}

export const dollarCostAveragingOrderSchema = new Schema<
  DollarCostAveragingOrderDocument
>(
  {
    vault: {
      type: String,
      required: true,
      validate: isAddress,
    },
    vaultOwner: {
      type: String,
      required: true,
      validate: isAddress,
    },
    recipient: {
      type: String,
      required: true,
      validate: isAddress,
    },
    sellToken: {
      type: String,
      required: true,
      validate: isAddress,
    },
    buyToken: {
      type: String,
      required: true,
      validate: isAddress,
    },
    sellAmount: {
      type: String,
      required: true,
    },
    chainId: {
      type: Number,
      required: true,
      enum: ChainId,
    },
    frequency: {
      type: Number,
      required: true,
      validate: {
        validator: (value: number) => value > 0,
        message: `frequency must be greater than 0`,
      },
    },
    frequencyInterval: {
      type: String,
      required: true,
      enum: DCAFrequencyInterval,
    },
    startAt: {
      type: Date,
      required: true,
    },
    endAt: {
      type: Date,
      required: true,
    },
    averagePrice: {
      type: String,
      required: true,
      default: '0', // Set the default value to 0
    },
    executions: [
      {
        type: Schema.Types.ObjectId,
        ref: 'DCAExecutionOrder',
      },
    ],
  },
  {
    timestamps: true,
  }
)
  // .index({
  //   vault: 1,
  //   buyToken: 1,
  // }, {
  //   unique: true,
  // })
  .pre('save', function (next) {
    const now = dayjs.utc();
    const startAt = dayjs(this.startAt).utc();
    const endAt = dayjs(this.endAt).utc();

    if (startAt.isBefore(now)) {
      throw new Error('startAt must be in the future');
    }

    if (endAt.isBefore(startAt)) {
      throw new Error('endAt must be after startAt');
    }

    next();
  });

export const modelName = 'DollarCostAveragingOrder';

export const DollarCostAveragingOrderModel = model<
  DollarCostAveragingOrderDocument
>(modelName, dollarCostAveragingOrderSchema);

// 1674765595 payload
// 1674765
