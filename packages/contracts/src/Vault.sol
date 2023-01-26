// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import {IERC20} from 'oz/token/ERC20/IERC20.sol';
import {IGPv2Settlement} from './interfaces/IGPv2Settlement.sol';

error NotOwner();
error NotDriver();
error AlreadyInitialized();

contract Vault {
  /// @dev The owner of the vault. The owner can cancel the vault.
  address public owner;
  /// @dev Vault driver, a bot that signs orders on behalf of the owner.
  address public driver;
  /// @dev The token that is being traded in the vault.
  address public token;
  address immutable GPV2_SETTLEMENT =
    address(0x9008D19f58AAbD9eD0D60971565AA8510560ab41);

  event Initialized(address indexed vault, address owner, address token);
  event Cancelled(address indexed vault);

  /// @dev Creates a new vault.
  function initialize(address _owner, address _driver, address _token) public {
    // Ensure that the vault is not already initialized.
    if (owner != address(0)) {
      revert AlreadyInitialized();
    }

    owner = _owner;
    driver = _driver;
    token = _token;
    // Emit Initialized event
    emit Initialized(address(this), owner, token);
    approve();
  }

  /// @dev Cancels the vault and transfers the funds back to the owner.
  function cancel() public {
    if (msg.sender != owner) {
      revert NotOwner();
    }
    // Emit VaultCancelled event
    emit Cancelled(address(this));
    // Transfer funds back to owner
    IERC20(token).transfer(owner, IERC20(token).balanceOf(address(this)));
  }

  /// @dev Executes a signed order on behalf of the vault owner.
  function execute(bytes calldata orderUid, bool signed) public {
    if (msg.sender != driver && msg.sender != owner) {
      revert NotDriver();
    }

    return IGPv2Settlement(GPV2_SETTLEMENT).setPreSignature(orderUid, signed);
  }

  /// @dev Returns the token balance of the vault.
  function balance() public view returns (uint256) {
    return IERC20(token).balanceOf(address(this));
  }

  /// @dev Approves the settlement contract to spend the vault's tokens.
  function approve() internal {
    IERC20(token).approve(GPV2_SETTLEMENT, type(uint256).max);
  }
}
