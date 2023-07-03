// SPDX-License-Identifier: LGPL-3.0-only
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "./DCAOrder.sol";
import "./OrderFactory.sol";

contract Deploy is Script {
    address whitelistNFT = vm.envAddress("WHITELIST_NFT_ADDRESS");
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        new DCAOrder();
        new OrderFactory(whitelistNFT);

        vm.stopBroadcast();
    }
}
