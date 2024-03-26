import { Address, BigInt } from '@graphprotocol/graph-ts';
import { Token, DCAOrder } from '../../generated/schema';
import { ERC20 as ERC20Contract } from '../../generated/templates/DCAOrder/ERC20';
import { Initialized, Cancelled, DCAOrder as DCAOrderContract } from '../../generated/templates/DCAOrder/DCAOrder';
import { OrderFactory } from '../../generated/OrderFactory/OrderFactory';

const HUNDRED_PERCENT = BigInt.fromI32(10000);

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

  let protocolFee: BigInt = BigInt.fromI32(0);
  let orderSlots;
  let orderFactoryAddress: Address = (
    event.transaction.to !== null ? event.transaction.to : Address.fromString('0x0')
  )!;

  const factory = OrderFactory.bind(orderFactoryAddress);
  let tryProtocolFee = factory.try_protocolFee();
  let tryOrderSlots = factory.try_orderSlots();
  if (!tryProtocolFee.reverted) {
    protocolFee = BigInt.fromI32(tryProtocolFee.value);
  }
  if (!tryOrderSlots.reverted) {
    orderSlots = BigInt.fromI32(tryOrderSlots.value);
  }

  order.amount = orderContract.amount();
  order.fee = protocolFee;
  order.feeAmount = order.amount.times(protocolFee).div(HUNDRED_PERCENT.minus(protocolFee));
  order.endTime = orderContract.endTime().toI32();
  order.startTime = orderContract.startTime().toI32();
  order.orderSlots = orderSlots;
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
