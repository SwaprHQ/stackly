import { badRequest } from '@hapi/boom';
import { Request } from '@hapi/hapi';
import Joi from 'joi';
import { ChainId } from 'dca-sdk';
import { DollarCostAveragingOrderModel } from '../models/DollarCostAveragingOrder';

interface IGetVaultOrdersRequest extends Request {
  query: {
    chainId: ChainId;
    owner?: string;
    vault?: string;
    fields?: string;
  };
}

export const disallowFields = [
  'createdAt',
  'updatedAt',
  '_id',
  '__v',
  'executions._id',
  'executions.createdAt',
  'executions.updatedAt',
];

export async function handleGetVaultOrders(request: IGetVaultOrdersRequest) {
  try {
    const { chainId, owner, vault, fields } = request.query;
    // break down the fields into an array
    const fieldsArray =
      fields?.split(',').filter((field) => {
        // Remove empty strings
        return !disallowFields.includes(field);
      }) || [];
    // Fitler out executions fields
    const orderFields = fieldsArray.filter(
      (field) => !field.startsWith('executions.')
    );

    // Get exeuctions fields
    const executionFields = fieldsArray.filter((field) =>
      field.startsWith('executions.')
    );
    const query = DollarCostAveragingOrderModel.find({ chainId })
      .select(orderFields.join(' '))
      // Manually remove fields
      .select({
        updatedAt: 0,
        _id: 0,
        __v: 0,
        executions: 0,
      });

    // Populate executions
    if (orderFields.includes('executions')) {
      query
        .populate('executions', executionFields.join(' '))
        .populate('executions', {
          updatedAt: 0,
          _id: 0,
          __v: 0,
        });
    }

    if (owner) {
      query.where('vaultOwner').equals(owner.toLowerCase());
    }

    if (vault) {
      query.where('vault').equals(vault.toLowerCase());
    }

    const orders = (await query.exec()).map((order) => order.toJSON());

    return {
      data: orders,
    };
  } catch (error) {
    console.error(error);
    if (error.isBoom) {
      throw error;
    }
    throw badRequest(error);
  }
}

export const createOrderRequestDTO = Joi.object<
  IGetVaultOrdersRequest['query']
>({
  chainId: Joi.number()
    .required()
    .allow(ChainId.ETHEREUM, ChainId.GNOSIS)
    .description('The chain id of the order'),
  vault: Joi.string().description('The vault address of the order'),
  owner: Joi.string().description('The owner of the orders'),
  fields: Joi.string().description(
    'The fields to return. Comma separated. Example: id,chainId,vault,vaultOwner,amount,token,period,executions,createdAt'
  ),
}).label('GetVaultOrdersRequestDTO');
