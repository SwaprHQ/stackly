// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity >=0.7.0 <0.9.0;

import {Vault} from "./Vault.sol";

error Create2CallFailed();
error InvalidSingletonAddress();

/// @title Proxy Factory - Allows to create a new proxy contract and execute a message call to the new proxy within one transaction.
/// @author Stefan George - <stefan@gnosis.pm>
contract VaultFactory {
    event VaultCreated(address indexed vault);
    /// @dev Allows to retrieve the creation code used for the Proxy deployment. With this it is easily possible to calculate predicted address.

    function vaultCreationCode() public pure returns (bytes memory) {
        return type(Vault).creationCode;
    }

    /// @dev Allows to create a new proxy contract using CREATE2. Optionally executes an initializer call to a new proxy.
    ///      This method is only meant as an utility to be called from other methods
    /// @param _singleton Address of singleton contract. Must be deployed at the time of execution.
    /// @param initializer Payload for a message call to be sent to a new proxy contract.
    /// @param salt Create2 salt to use for calculating the address of the new proxy contract.
    function deployVault(address _singleton, bytes memory initializer, bytes32 salt) internal returns (Vault proxy) {
        if (!isContract(_singleton)) {
            revert InvalidSingletonAddress();
        }

        bytes memory deploymentData = abi.encodePacked(type(Vault).creationCode, uint256(uint160(_singleton)));
        // solhint-disable-next-line no-inline-assembly
        assembly {
            proxy := create2(0x0, add(0x20, deploymentData), mload(deploymentData), salt)
        }

        if (address(proxy) == address(0)) {
            revert Create2CallFailed();
        }

        emit VaultCreated(address(proxy));

        if (initializer.length > 0) {
            // solhint-disable-next-line no-inline-assembly
            assembly {
                if eq(call(gas(), proxy, 0, add(initializer, 0x20), mload(initializer), 0, 0), 0) { revert(0, 0) }
            }
        }
    }

    /// @dev Allows to create a new proxy contract and execute a message call to the new proxy within one transaction.
    /// @param _singleton Address of singleton contract. Must be deployed at the time of execution.
    /// @param initializer Payload for a message call to be sent to a new proxy contract.
    /// @param saltNonce Nonce that will be used to generate the salt to calculate the address of the new proxy contract.
    function createVaultWithNonce(address _singleton, bytes memory initializer, uint256 saltNonce)
        public
        returns (Vault vault)
    {
        // If the initializer changes the proxy address should change too. Hashing the initializer data is cheaper than just concatinating it
        bytes32 salt = keccak256(abi.encodePacked(keccak256(initializer), saltNonce));
        vault = deployVault(_singleton, initializer, salt);
    }

    /// @dev Returns true if `account` is a contract.
    /// @param account The address being queried
    function isContract(address account) internal view returns (bool) {
        uint256 size;
        // solhint-disable-next-line no-inline-assembly
        assembly {
            size := extcodesize(account)
        }
        return size > 0;
    }

    /// @dev Returns the chain id used by this contract.
    function getChainId() public view returns (uint256) {
        uint256 id;
        // solhint-disable-next-line no-inline-assembly
        assembly {
            id := chainid()
        }
        return id;
    }
}
