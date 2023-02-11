// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

import "forge-std/Test.sol";
import { ERC20Mintable} from './common/ERC20Mintable.sol';
import { MockSettlement } from './common/MockSettlement.sol';

import {DCAOrder, NotOwner} from "../src/DCAOrder.sol";

contract DCAOrderTest is Test {
  MockSettlement public mockSettlement;
  DCAOrder public dcaOrder;
  ERC20Mintable public sellToken;
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
    dcaOrder = new DCAOrder();
    sellToken = new ERC20Mintable('Test Token', 'TEST');
    sellToken.mint(address(this), 10000 ether);

    _owner = address(this);
    _receiver = address(0x2);
    _sellToken = address(sellToken);
    _buyToken = address(0x3);
    _interval = 1; // every 1 hours
    _startTime = block.timestamp + 1 hours;
    _endTime = _startTime + 1 days;
    _principal = 10 ether;
  }

  function testInitialize() public {
    sellToken.approve(address(dcaOrder), type(uint256).max);
    dcaOrder.initialize(
      _owner, _receiver, _sellToken, _buyToken, _principal, _startTime, _endTime, _interval, address(mockSettlement)
    );

    // Assert all properties are set correctly
    assertEq(dcaOrder.owner(), _owner);
    assertEq(dcaOrder.receiver(), _receiver);
    assertEq(address(dcaOrder.sellToken()), address(sellToken));
    assertEq(address(dcaOrder.buyToken()), _buyToken);
    assertEq(dcaOrder.startTime(), _startTime);
    assertEq(dcaOrder.endTime(), _endTime);
    assertEq(dcaOrder.interval(), _interval);
    assertEq(dcaOrder.principal(), _principal);
    assertEq(dcaOrder.domainSeparator(), mockSettlement.domainSeparator());
  }

  function testSlots() public {
    sellToken.approve(address(dcaOrder), type(uint256).max);
    dcaOrder.initialize(
      _owner, _receiver, _sellToken, _buyToken, _principal, _startTime, _endTime, _interval, address(mockSettlement)
    );

    uint256[] memory slots = dcaOrder.orderSlots();
    // In a 24 hour period, there should be 24 slots
    assertEq(slots.length, 24);
    // The first slot should be the startTime
    assertEq(slots[0], _startTime);
    // The last slot should be the endTime - 1 hour
    assertEq(slots[23], _endTime - 1 hours);
    // Between each slot, there should be an interval of 1 hour
    for (uint256 i = 0; i < slots.length - 1; i++) {
      assertEq(slots[i + 1] - slots[i], 1 hours);
    }
  }

  function testCanCancelOrder() public {
    // Approve the dcaOrder to spend the sellToken
    sellToken.approve(address(dcaOrder), type(uint256).max);
    dcaOrder.initialize(
      _owner, _receiver, _sellToken, _buyToken, _principal, _startTime, _endTime, _interval, address(mockSettlement)
    );
    dcaOrder.cancel();
    // Balance should be 0
    assertEq(sellToken.balanceOf(address(dcaOrder)), 0);
  }

  function testCannotCancelOrderIfNotOwner() public {
    sellToken.approve(address(dcaOrder), type(uint256).max);
    dcaOrder.initialize(
      _owner, _receiver, _sellToken, _buyToken, _principal, _startTime, _endTime, _interval, address(mockSettlement)
    );
    vm.prank(address(0x1));
    vm.expectRevert(NotOwner.selector);
    dcaOrder.cancel();
  }

  /// @dev add fuzzing to test the current slot
  function testCurrentSlot() public {
    sellToken.approve(address(dcaOrder), type(uint256).max);
    dcaOrder.initialize(
      _owner, _receiver, _sellToken, _buyToken, _principal, _startTime, _endTime, _interval, address(mockSettlement)
    );
    vm.prank(address(0x1));

    // warp to 1 hour before the startTime
    vm.warp(dcaOrder.startTime() - 1 hours);
    // the current slot should be 0
    assertEq(dcaOrder.currentSlot(), 0);

    // warp to the startTime of the order
    vm.warp(dcaOrder.startTime());
    // the current slot should be the startTime
    assertEq(dcaOrder.currentSlot(), _startTime);
    // warp to 1 hour after the startTime
    vm.warp(dcaOrder.startTime() + 1 hours);
    assertEq(dcaOrder.currentSlot(), _startTime + 1 hours);
    // warp to 10 hours after the startTime
    vm.warp(dcaOrder.startTime() + 10 hours);
    assertEq(dcaOrder.currentSlot(), _startTime + 10 hours);
    // warp to 15 hours after the startTime
    vm.warp(dcaOrder.startTime() + 15 hours);
    assertEq(dcaOrder.currentSlot(), _startTime + 15 hours);
    // warp to the endTime of the order
    vm.warp(dcaOrder.endTime() - 0.5 hours);
    assertEq(dcaOrder.currentSlot(), _endTime - 1 hours);
    // warp to after the endTime of the order
    vm.warp(dcaOrder.endTime() + 0.1 hours);
    // should return 0
    assertEq(dcaOrder.currentSlot(), 0);
  }

  function testHourlyOverWeeksDCAOrders() public {
    _endTime = _startTime + 6 weeks;

    sellToken.approve(address(dcaOrder), type(uint256).max);
    dcaOrder.initialize(
      _owner, _receiver, _sellToken, _buyToken, _principal, _startTime, _endTime, _interval, address(mockSettlement)
    );
    // In a 6 week period, there should be 6 * 7 * 24 = 1008 slots
    uint256[] memory slots = dcaOrder.orderSlots();
    assertEq(slots.length, 1008);
  }

  function testDailyOverWeeksDCAOrders() public {
    _endTime = _startTime + 6 weeks;
    sellToken.approve(address(dcaOrder), type(uint256).max);
    dcaOrder.initialize(
      _owner,
      _receiver,
      _sellToken,
      _buyToken,
      _principal,
      _startTime,
      _endTime,
      24, // 1 day
      address(mockSettlement)
    );
    // In a 6 week period, there should be 6 * 7 = 42 slots
    uint256[] memory slots = dcaOrder.orderSlots();
    assertEq(slots.length, 42);
  }

  function testEveryThreeDaysInWeeksDCAOrders() public {
    _endTime = _startTime + 12 weeks;
    sellToken.approve(address(dcaOrder), type(uint256).max);
    dcaOrder.initialize(
      _owner,
      _receiver,
      _sellToken,
      _buyToken,
      _principal,
      _startTime,
      _endTime,
      24 * 3, // 3 days
      address(mockSettlement)
    );
    // in a 12 week period where buys are every 3 days, there should be 12 * 7 / 3 = 28 slots
    uint256[] memory slots = dcaOrder.orderSlots();
    assertEq(slots.length, 28);
  }
}
