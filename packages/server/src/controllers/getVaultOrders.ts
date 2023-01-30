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
  };
}

export async function handleGetVaultOrders(request: IGetVaultOrdersRequest) {
  try {
    const { chainId, owner, vault } = request.query;

    const query = DollarCostAveragingOrderModel.find({ chainId }).populate(
      'executions'
    );

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
}).label('GetVaultOrdersRequestDTO');
