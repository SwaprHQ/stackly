import { Address } from '@graphprotocol/graph-ts';
import { Token, DCAOrder } from '../../generated/schema';
import { ERC20 as ERC20Contract } from '../../generated/templates/DCAOrder/ERC20';
import { Initialized, Cancelled, DCAOrder as DCAOrderContract } from '../../generated/templates/DCAOrder/DCAOrder';

export function createOrReturnTokenEntity(contractAddress: Address): Token {
  // Persist token data if it doesn't already exist
  let token = Token.load(contractAddress.toHex());
  if (token !== null) {
    return token;
  }
  let tokenContract = ERC20Contract.bind(contractAddress);
  token = new Token(contractAddress.toHex());
  token.name = tokenContract.name();
  token.symbol = tokenContract.symbol();
  token.decimals = tokenContract.decimals();
  token.save();
  return token;
}

export function handleDCAOrderInitialized(event: Initialized): void {
  const orderContract = DCAOrderContract.bind(event.params.order);
  const order = new DCAOrder(event.params.order.toHex());
  order.createdAt = event.block.timestamp;
  order.owner = orderContract.owner();
  order.sellToken = createOrReturnTokenEntity(orderContract.sellToken()).id;
  order.buyToken = createOrReturnTokenEntity(orderContract.buyToken()).id;
  order.receiver = orderContract.receiver();
  order.amount = orderContract.amount();
  order.endTime = orderContract.endTime().toI32();
  order.startTime = orderContract.startTime().toI32();
  order.orderSlots = orderContract.orderSlots();
  order.interval = orderContract.interval();
  order.save();
}

export function handleDCAOrderCancelled(event: Cancelled): void {
  const order = DCAOrder.load(event.params.order.toHex());
  if (order === null) {
    return;
  }
  order.cancelledAt = event.block.timestamp;
  order.save();
}
