// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity 0.8.19;

import {IERC20} from "oz/token/ERC20/IERC20.sol";
import {Clones} from "oz/proxy/Clones.sol";
import {Ownable2Step} from "oz/access/Ownable2Step.sol";

error ForbiddenValue();

contract OrderFactory is Ownable2Step {

  uint16 public protocolFee = 5; // default 0.05% (range: 0-10000)

  event OrderCreated(address indexed order);

  /// @dev Allows to create a new proxy contract and execute a message call to the new proxy within one transaction.
  /// @param _singleton Address of singleton contract. Must be deployed at the time of execution.
  /// @param _initializer Payload for a message call to be sent to a new proxy contract.
  /// @param saltNonce Nonce that will be used to generate the salt to calculate the address of the new proxy contract.
  function createProxy(address _singleton, bytes memory _initializer, uint256 saltNonce)
    internal
    returns (address order)
  {
    // Adds protocolFee param to initializer
    bytes memory initializer = abi.encodePacked(_initializer, abi.encodePacked(bytes30(0), protocolFee));

    // If the initializer changes the proxy address should change too. Hashing the initializer data is cheaper than just concatinating it
    bytes32 salt = keccak256(abi.encodePacked(keccak256(initializer), saltNonce));
    order = Clones.cloneDeterministic(_singleton, salt);

    if (initializer.length > 0) {
      // solhint-disable-next-line no-inline-assembly
      assembly {
        if eq(call(gas(), order, 0, add(initializer, 0x20), mload(initializer), 0, 0), 0) { revert(0, 0) }
      }
    }
  }

  /// @dev Allows to create a new order contract and execute a message call to the new order within one transaction.
  /// @param _singleton Address of singleton contract. Must be deployed at the time of execution.
  /// @param initializer Payload for a message call to be sent to a new order contract.
  /// @param saltNonce Nonce that will be used to generate the salt to calculate the address of the new order contract.
  function createOrderWithNonce(address _singleton, bytes calldata initializer, uint256 saltNonce)
    public
    returns (address order)
  {
    // Deploy a new order
    order = createProxy(_singleton, initializer, saltNonce);

    // Extract the principal from the initializer
    (,, address _sellToken,, uint256 _principal,,,,) =
      abi.decode(initializer[4:], (address, address, address, address, uint256, uint256, uint256, uint256, address));
    emit OrderCreated(order);

    // Transfer the principal to the order
    IERC20(_sellToken).transferFrom(msg.sender, order, _principal - ((_principal * protocolFee) / 100));

    // Transfer the fee to the factory
    IERC20(_sellToken).transferFrom(msg.sender, address(this), (_principal * protocolFee) / 100);
  }

  /// @dev Set the protocol fee percent  
  /// @param _fee The new protocol fee percent 0-5% (range: 0-500)
  function setProtocolFee(uint16 _fee) external onlyOwner {
      if (_fee > 500) revert ForbiddenValue();
      protocolFee = _fee;
  }

  /// @dev Withdraw protocol fee share
  /// @param tokens Tokens' addresses transferred to the owner as protocol fee
  function withdrawTokens(address[] calldata tokens) external onlyOwner {
      for (uint256 i = 0; i < tokens.length; i++) {
        IERC20(tokens[i]).transfer(owner(), IERC20(tokens[i]).balanceOf(address(this)));
      }
  }
}
