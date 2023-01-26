// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import 'forge-std/Test.sol';
import {ERC20} from 'oz/token/ERC20/ERC20.sol';
import {Vault, AlreadyInitialized, NotOwner} from '../src/Vault.sol';

contract ERC20Mintable is ERC20 {
  constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

  function mint(address to, uint256 amount) public {
    _mint(to, amount);
  }
}

contract VaultTest is Test {
  Vault public vault;
  ERC20Mintable public testToken;
  address sender;

  event VaultCancelled(address vault);

  function setUp() public {
    sender = msg.sender;
    vault = new Vault();
    testToken = new ERC20Mintable('Test Token', 'TEST');
    testToken.mint(address(this), 10 ether);
  }

  function testInitialize() public {
    vault.initialize(address(0x1), address(0x2), address(testToken));
    assertEq(vault.owner(), address(0x1));
    assertEq(vault.driver(), address(0x2));
    assertEq(vault.token(), address(testToken));
    assertEq(vault.balance(), 0);
  }

  function testVaultTokenAllowanceInitializeIsMax() public {
    vault.initialize(address(0x1), address(0x2), address(testToken));
    assertEq(vault.owner(), address(0x1));
    assertEq(vault.driver(), address(0x2));
    assertEq(vault.token(), address(testToken));
    assertEq(vault.balance(), 0);

    uint256 vaultTokenAllowanceWithGPv2 = testToken.allowance(
      address(vault),
      address(0x9008D19f58AAbD9eD0D60971565AA8510560ab41)
    );

    assertEq(vaultTokenAllowanceWithGPv2, type(uint256).max);

  }

  function testCanDepositTokenIntoVault() public {
    testToken.transfer(address(vault), 10);
    vault.initialize(address(0x1), address(0x2), address(testToken));
    assertEq(vault.balance(), 10);
  }

  function testCanBeInitializedOnce() public {
    vault.initialize(address(0x1), address(0x2), address(testToken));
    vm.expectRevert(AlreadyInitialized.selector);
    vault.initialize(address(0x1), address(0x2), address(testToken));
    assertEq(vault.owner(), address(0x1));
  }

  function testCanCancelVault() public {
    vault.initialize(address(this), address(0x2), address(testToken));
    testToken.transfer(address(vault), 10);
    // Except event VaultCancelled(address(this))
    vault.cancel();
    assertEq(vault.balance(), 0);
  }

  function testCannnotCancelVaultIfNotOwner() public {
    vault.initialize(address(this), address(0x2), address(testToken));
    testToken.transfer(address(vault), 10);
    vm.prank(address(0x1));
    vm.expectRevert(NotOwner.selector);
    vault.cancel();
  }
}
