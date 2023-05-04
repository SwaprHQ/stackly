# Project Name

## Description

Stackly is a simple DCA (Dollar-Cost Averaging) tool that utilizes the CoW (Conditional Order
Workflow) Protocol to place TWAP (Time-Weighted Average Price) orders. It allows users to stack
their favorite cryptocurrencies at any frequency they choose, such as hourly, daily, weekly, or
monthly. By following a DCA strategy, users can reduce their exposure to short-term price
fluctuations and potentially build a more stable and profitable long-term portfolio.

## Smart Contracts

### Dependencies

- OpenZeppelin
  Contracts:[ IERC20](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol),[ Clones](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/proxy/Clones.sol),[ Ownable2Step](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable2Step.sol)
- Gnosis Protocol
  v2:[ IGPv2Settlement](https://github.com/gnosis/gp-v2-contracts/blob/main/src/contracts/interfaces/IGPv2Settlement.sol),[ GPv2Order](https://github.com/gnosis/gp-v2-contracts/blob/main/src/contracts/libraries/GPv2Order.sol),[ GPv2EIP1271](https://github.com/gnosis/gp-v2-contracts/blob/main/src/contracts/interfaces/GPv2EIP1271.sol)
- Interfaces:[ IConditionalOrder](https://chat.openai.com/chat/interfaces/IConditionalOrder.sol),[ IDCAOrder](https://chat.openai.com/chat/interfaces/IDCAOrder.sol)
- BokkyPooBah's DateTime
  Library:[ BokkyPooBahsDateTimeLibrary](https://github.com/bokkypoobah/BokkyPooBahsDateTimeLibrary)
- OpenZeppelin
  Utils:[ SafeMath](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol),[ Math](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/Math.sol)

### Deployment

```
forge create --rpc-url {YOUR_RPC_URL} src/DCAOrder.sol:DCAOrder
forge create --rpc-url {YOUR_RPC_URL} src/OrderFactory.sol:OrderFactory
```

## OrderFactory Contract

Creates orders for CoW protocol. It allows creating new proxy contracts, and then executes the
initialization call to the new proxy within one transaction, sending all the required order
parameters. The contract charges a protocol fee for creating orders, which stays in the factory and
can be withdrawn by the contract owner.

### Variables

- `protocolFee`: uint16 public variable representing the protocol fee percent (default: 0.05%,
  range: 0-10000)

### Events

- `OrderCreated(address indexed order)`: Event emitted after the creation of an order contract.

### Functions

#### `createOrderWithNonce(address _singleton, address _owner, address _receiver, address _sellToken, address _buyToken, uint256 _amount, uint256 _startTime, uint256 _endTime, uint256 _interval, address _settlementContract, uint256 _saltNonce) public returns (address order)`

This function creates a new order contract and executes a message call to the new order within one
transaction.

- `_singleton`: Address of singleton contract. Must be deployed at the time of execution.
- `_owner`: The owner of the order.
- `_receiver`: The receiver of the buyToken orders.
- `_sellToken`: The token that is being traded in the order.
- `_amount`: The amount of the DCA order.
- `_buyToken`: The token that is DCA'd in the order.
- `_startTime`: The start time of the DCA order.
- `_endTime`: The end time of the DCA order.
- `_interval`: The frequency interval of the DCA order in hours.
- `_settlementContract`: The settlement contract address.
- `_saltNonce`: Nonce that will be used to generate the salt to calculate the address of the new
  order contract.

Returns the address of the new order contract.

## DCAOrder Contract

It's a CoW protocol order contract order. It's only deployed once and referenced by minimal proxies
deployments created by the factory. The contract enables the buyer of an asset to create an order
that executes at a regular interval for a specified duration. The buyer specifies the sell and buy
tokens. The smart contract sets up a series of trades at specified intervals in time between start
and end times. It requires the buyer to approve the sellToken for the vaultRelayer to spend on their
behalf.

The contract is an implementation of the IConditionalOrder, EIP1271Verifier, and IDCAOrder
interfaces.

### Events

- `Initialized(address indexed order)`: Emitted when the contract has been initialized correctly
- `ConditionalOrderCreated(address indexed order)`: Emitted when the order has been created and all
  the required parameters are ok. Used by CoW Protocol to index orders and start tracking them for
  future execution
- `Cancelled(address indexed order)`: Emmited when the `owner` cancels the order

### Functions

#### `initialize(address _owner, address _receiver, address _sellToken, address _buyToken, uint256 _amount, uint256 _startTime, uint256 _endTime, uint256 _interval, address _settlementContract) external override returns (bool)`

Initializes the DCA order with the specified parameters.

- `_owner`: The owner of the order.
- `_receiver`: The receiver of the buyToken orders.
- `_sellToken`: The token that is being traded in the order.
- `_amount`: The amount of the DCA order.
- `_buyToken`: The token that is DCA'd in the order.
- `_startTime`: The start time of the DCA order.
- `_endTime`: The end time of the DCA order.
- `_interval`: The frequency interval of the DCA order in hours.
- `_settlementContract`: The settlement contract address.

#### `cancel() external override`

Cancels the DCA order.

## Infrastructure

![](https://global.discourse-cdn.com/standard14/uploads/daostack/original/2X/5/568866eeb0b1532a3cf80d3ddb64c728c7a92eff.png)

## License

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Contact

[<img src="https://global-uploads.webflow.com/5e157548d6f7910beea4e2d6/62a07b53139aec4c1fd07771_discord-logo.png" width="100">](https://discord.gg/dxdao)
