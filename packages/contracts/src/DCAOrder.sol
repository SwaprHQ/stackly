// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {IERC20} from "oz/token/ERC20/IERC20.sol";
import {IGPv2Settlement} from "./interfaces/IGPv2Settlement.sol";
import {IConditionalOrder} from "./interfaces/IConditionalOrder.sol";
import {IDCAOrder} from "./interfaces/IDCAOrder.sol";
import {GPv2Order} from "./libraries/GPv2Order.sol";
import {GPv2EIP1271, EIP1271Verifier} from "./interfaces/EIP1271Verifier.sol";
import {BokkyPooBahsDateTimeLibrary} from "date/BokkyPooBahsDateTimeLibrary.sol";
import {SafeMath} from "oz/utils/math/SafeMath.sol";
import {Math} from "oz/utils/math/Math.sol";

error NotOwner();
error NotReceiver();
error ReceiverIsVault();
error AlreadyInitialized();
error IntervalMustBeGreaterThanZero();
error InvalidStartTime();
error InvalidEndTime();
error NotWithinStartAndEndTimes();
error ZeroSellAmount();
error OrderExecutionTimeGreaterThanEndTime();
error OrderExecutionTimeLessThanCurrentTime();

contract DCAOrder is IConditionalOrder, EIP1271Verifier, IDCAOrder {
  using GPv2Order for GPv2Order.Data;
  /// @dev The owner of the vault. The owner can cancel the vault.

  address public owner;
  /// @dev Vault order receiver. All buyToken orders are sent to this address.
  address public receiver;
  /// @dev The token that is being traded in the vault.
  IERC20 public sellToken;
  /// @dev The token that is DCA'd in the vault.
  IERC20 public buyToken;
  /// @dev The start time of the DCA order.
  uint256 public startTime;
  /// @dev The end time of the DCA order.
  uint256 public endTime;
  /// @dev The amount of tokens to buy in each order.
  uint256 public amount;
  /// @dev The frequency of the DCA order. For example, if the frequency is 2 and the frequency interval is DAY, then the order will be executed every 2 days.
  /// @dev If the frequency is 1 and the frequency interval is HOUR, then the order will be executed every hour.
  /// @dev For weeks, the frequency should be 7 and the frequency interval should be DAY. So jumps of 7 days.
  uint256 public interval;
  bytes32 public domainSeparator;
  /// @dev The initial principal amount of the DCA order.
  uint256 public principal;

  event Initialized(address indexed vault, address owner, address token);
  event Cancelled(address indexed vault);

  /// @dev Initializes the vault with the specified parameters.
  /// @param _owner The owner of the vault.
  /// @param _receiver The receiver of the buyToken orders.
  /// @param _sellToken The token that is being traded in the vault.
  /// @param _principal The principal amount of the DCA order.
  /// @param _buyToken The token that is DCA'd in the vault.
  /// @param _startTime The start time of the DCA order.
  /// @param _endTime The end time of the DCA order.
  /// @param _interval The frequency interval of the DCA order in hours.
  /// @param _settlementContract The settlement contract address.
  function initialize(
    address _owner,
    address _receiver,
    address _sellToken,
    address _buyToken,
    uint256 _principal,
    uint256 _startTime,
    uint256 _endTime,
    uint256 _interval,
    address _settlementContract
  ) external override returns (bool) {
    // Ensure that the vault is not already initialized.
    if (owner != address(0)) {
      revert AlreadyInitialized();
    }
    // Ensure that the receiver is not the vault.
    if (_receiver == address(this)) {
      revert ReceiverIsVault();
    }
    if (_interval == 0) {
      revert IntervalMustBeGreaterThanZero();
    }
    // Start date must be in the future by at least 10 minutes
    // solhint-disable-next-line not-rely-on-time
    if (_startTime <= block.timestamp + 10 minutes) {
      revert InvalidStartTime();
    }
    // End time must be greater than start time
    if (_endTime <= _startTime) {
      revert InvalidEndTime();
    }

    // Set all the properties
    owner = _owner;
    receiver = _receiver;
    sellToken = IERC20(_sellToken);
    buyToken = IERC20(_buyToken);
    startTime = _startTime;
    endTime = _endTime;
    interval = _interval;
    principal = _principal;
    domainSeparator = IGPv2Settlement(_settlementContract).domainSeparator();
    // Approve the vaut relayer to spend the sell token
    IERC20(_sellToken).approve(address(IGPv2Settlement(_settlementContract).vaultRelayer()), type(uint256).max);
    // Emit VaultInitialized event
    emit ConditionalOrderCreated(address(this)); // Required by COW to watch this contract
    // Emit Initialized event for indexing
    emit Initialized(address(this), _owner, _sellToken);
    return true;
  }

  function deposit() external returns (bool) {
    // Transfer the capital to the vault
    return IERC20(sellToken).transferFrom(msg.sender, address(this), principal);
  }

  /// @dev Cancels the vault and transfers the funds back to the owner.
  function cancel() external {
    if (msg.sender != owner) {
      revert NotOwner();
    }
    // Emit VaultCancelled event
    emit Cancelled(address(this));
    // Transfer funds back to owner
    IERC20(sellToken).transfer(owner, IERC20(sellToken).balanceOf(address(this)));
  }

  // @dev If the `target`'s balance of `sellToken` is above the specified threshold, sell its entire balance
  // for `buyToken` at the current market price (no limit!).
  function getTradeableOrder() external view override returns (GPv2Order.Data memory) {
    // Order must be between start and end time
    // solhint-disable-next-line not-rely-on-time
    if (block.timestamp < startTime || block.timestamp > endTime) {
      revert NotWithinStartAndEndTimes();
    }
    // Get the sell token balance of the vault
    // and the number of buy orders
    uint256 balance = IERC20(sellToken).balanceOf(address(this));
    // Calculate the number of buy orders
    uint256[] memory slots = orderSlots();
    uint256 orderExecutionTime = currentSlot();
    // Execute at the specified frequency
    // Each order sellAmount is the balance of the vault divided by the frequency
    (, uint256 orderSellAmount) = SafeMath.tryDiv(principal, slots.length);
    // Cannot create order with 0 sell amount
    if (orderSellAmount == 0) {
      revert ZeroSellAmount();
    }
    // Ensure that the order execution time is less than the end time
    if (orderExecutionTime > endTime) {
      revert OrderExecutionTimeGreaterThanEndTime();
    }
    // Ensure that the order execution time is greater than the current time
    // solhint-disable-next-line not-rely-on-time
    if (orderExecutionTime < block.timestamp) {
      revert OrderExecutionTimeLessThanCurrentTime();
    }

    // Create the order
    // ensures that orders queried shortly after one another result in the same hash (to avoid spamming the orderbook)
    // solhint-disable-next-line not-rely-on-time
    uint32 currentTimeBucket = ((uint32(orderExecutionTime) / 900) + 1) * 900;
    return GPv2Order.Data(
      sellToken,
      buyToken,
      receiver, // The receiver
      balance,
      1, // 0 buy amount is not allowed
      currentTimeBucket + 900, // between 15 and 30 miunte validity
      keccak256("TradeAboveThreshold"),
      0,
      GPv2Order.KIND_SELL,
      false,
      GPv2Order.BALANCE_ERC20,
      GPv2Order.BALANCE_ERC20
    );
    // uint32 currentTimeBucket = ((uint32(block.timestamp) / 900) + 1) * 900;
  }

  /// @param orderDigest The EIP-712 signing digest derived from the order
  /// @param encodedOrder Bytes-encoded order information, originally created by an off-chain bot. Created by concatening the order data (in the form of GPv2Order.Data), the price checker address, and price checker data.
  function isValidSignature(bytes32 orderDigest, bytes calldata encodedOrder) external view override returns (bytes4) {
    GPv2Order.Data memory order = abi.decode(encodedOrder, (GPv2Order.Data));
    require(order.hash(domainSeparator) == orderDigest, "encoded order digest mismatch");

    // If getTradeableOrder() may change between blocks (e.g. because of a variable exchange rate or exprity date, perform a proper attribute comparison with `order` here instead of matching full hashes)
    require(
      IConditionalOrder(this).getTradeableOrder().hash(domainSeparator) == orderDigest,
      "encoded order != tradable order"
    );

    return GPv2EIP1271.MAGICVALUE;
  }

  /// @dev the total number of orders that will be executed between the start and end time
  function orderSlots() public view returns (uint256[] memory slots) {
    uint256 total = Math.ceilDiv(BokkyPooBahsDateTimeLibrary.diffHours(startTime, endTime), interval);
    slots = new uint256[](total);
    // Create execution orders
    for (uint256 i = 0; i < total; i++) {
      uint256 orderExecutionTime = startTime + (i * interval * 1 hours);
      slots[i] = orderExecutionTime;
    }
    return slots;
  }

  /// @dev returns the current slot based on the slots array
  /// @dev a slot is consider current if the current time is greater than the slot time and less than the next slot time (if it exists)
  function currentSlot() public view returns (uint256 slot) {
    uint256[] memory slots = orderSlots();
    // solhint-disable-next-line not-rely-on-time
    uint256 currentTime = block.timestamp;

    // If the current time is between the last slot and the end time, return the last slot
    uint256 lastSlot = slots[slots.length - 1];

    if (currentTime >= lastSlot && currentTime < endTime) {
      return lastSlot;
    }

    for (uint256 i = 0; i < slots.length; i++) {
      uint256 slotStartTime = slots[i];
      uint256 slotEndTime = endTime;

      // If the slot is not the last slot, set the end time to the next slot
      if (i < slots.length - 1) {
        slotEndTime = slots[i + 1];
      }

      if (currentTime >= slotStartTime && currentTime < slotEndTime) {
        slot = slots[i];
        break;
      }
    }
  }
}
