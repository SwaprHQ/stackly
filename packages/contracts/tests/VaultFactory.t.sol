// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import 'forge-std/Test.sol';
import {ERC20Mintable} from './common/ERC20Mintable.sol';
import {Vault, AlreadyInitialized} from '../src/Vault.sol';
import {VaultFactory} from '../src/VaultFactory.sol';

contract VaultFactoryTest is Test {
  Vault public vaultMastercopy;
  VaultFactory public vaultFactory;
  ERC20Mintable public testToken;

  function setUp() public {
    vaultMastercopy = new Vault();
    vaultFactory = new VaultFactory();
    testToken = new ERC20Mintable('Test Token', 'TEST');
  }

  function testCanCreateVaultWithNonce() public {
    address owner = msg.sender;
    address driver = address(0x2);
    bytes memory initializer = abi.encodeWithSignature(
      'initialize(address,address,address)',
      owner,
      driver,
      address(testToken)
    );

    Vault vault = vaultFactory.createVaultWithNonce(
      address(vaultMastercopy),
      initializer,
      1
    );
    assertEq(address(vault.owner()), owner);
    assertEq(address(vault.driver()), driver);
    assertEq(address(vault.token()), address(testToken));
  }

  function testMastercopyCanBeInitializedOnce() public {
    vaultMastercopy.initialize(msg.sender, address(0x2), address(testToken));
    vm.expectRevert(AlreadyInitialized.selector);
    vaultMastercopy.initialize(msg.sender, address(0x2), address(testToken));
  }

  function testCanCreateVaultWithNonceEvenIfVaultIsInitialized() public {
    vaultMastercopy.initialize(address(0x5), address(0x2), address(testToken));

    address owner = msg.sender;
    address driver = address(0x2);
    bytes memory initializer = abi.encodeWithSignature(
      'initialize(address,address,address)',
      owner,
      driver,
      address(testToken)
    );
    Vault vault = vaultFactory.createVaultWithNonce(
      address(vaultMastercopy),
      initializer,
      1
    );
    assertTrue(address(vault) != address(vaultMastercopy));
    assertEq(address(vault.owner()), owner);
    assertEq(address(vault.driver()), driver);
    assertEq(address(vault.token()), address(testToken));
  }
}
