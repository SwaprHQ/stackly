import { OrderCreated } from '../../generated/OrderFactory/OrderFactory';
import { DCAOrder as DCAOrderTemplate } from '../../generated/templates';
import { OrderFactory } from '../../generated/schema';

// This handler is called by block handlers
export function handleDCAOrderCreated(event: OrderCreated): void {
  let orderFactory = OrderFactory.load('1');

  if (orderFactory === null) {
    orderFactory = new OrderFactory('1');
    orderFactory.address = event.address;
    orderFactory.orderCount = 0;
  }

  orderFactory.orderCount = orderFactory.orderCount + 1;
  orderFactory.save();

  // Create a new Vault entity
  DCAOrderTemplate.create(event.params.order);
}
