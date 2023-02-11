// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import 'forge-std/Test.sol';
import {ERC20Mintable} from './common/ERC20Mintable.sol';
import {MockSettlement} from './common/MockSettlement.sol';

import {DCAOrder, AlreadyInitialized} from '../src/DCAOrder.sol';
import {OrderFactory} from '../src/OrderFactory.sol';

contract VaultFactoryTest is Test {
  MockSettlement public mockSettlement;
  DCAOrder public mastercopy;
  ERC20Mintable public sellToken;
  OrderFactory public factory;

  address public _owner;
  address public _receiver;
  address public _sellToken;
  address public _buyToken;
  uint256 public _interval;
  uint256 public _startTime;
  uint256 public _endTime;
  uint256 public _principal;

  function setUp() public {
    mockSettlement = new MockSettlement();
    sellToken = new ERC20Mintable('Test Token', 'TEST');
    mastercopy = new DCAOrder();
    factory = new OrderFactory();



    uint256 mastercopyStartTime = block.timestamp + 1 days;
    uint256 mastercopyEndTime = mastercopyStartTime + 1 hours;
    mastercopy.initialize(
      address(1),
      address(1),
      address(sellToken),
      address(1),
      1,
      mastercopyStartTime,
      mastercopyEndTime,
      1,
      address(mockSettlement)
    );

    sellToken.mint(address(this), 10000 ether);
    _owner = address(this);
    _receiver = address(0x2);
    _sellToken = address(sellToken);
    _buyToken = address(0x3);

    _startTime = block.timestamp + 1 hours;
    _endTime = _startTime + 1 days;
    _principal = 10 ether;
    _interval= 1;
  }

  function testMastercopy() public {

  }

  function testCreateOrderWithNonce() public {
    // Approve the factory to spend the sell token
    sellToken.approve(address(factory), type(uint256).max);

    // Create the vault
    address order = factory.createOrderWithNonce(
      address(mastercopy),
      abi.encodeWithSignature(
        'initialize(address,address,address,address,uint256,uint256,uint256,uint256,address)',
        _owner,
        _receiver,
        _sellToken,
        _buyToken,
        _principal,
        _startTime,
        _endTime,
        _interval,
        address(mockSettlement)
      ),
      1
    );

    // // Balance has been transferred to the vault
    // assertEq(sellToken.balanceOf(order), _principal);
  }
}
