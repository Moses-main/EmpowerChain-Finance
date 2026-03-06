// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "forge-std/Script.sol";
import "../src/Loan.sol";
import "../src/Lending.sol";
import "../src/LiteracyBadge.sol";
import "../src/MockToken.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy MockToken (only for local/testnets if needed)
        MockToken token = new MockToken();
        console.log("MockToken deployed at:", address(token));

        // 2. Deploy Loan
        Loan loan = new Loan();
        console.log("Loan deployed at:", address(loan));

        // 3. Deploy Lending (requires token address)
        Lending lending = new Lending(address(token));
        console.log("Lending deployed at:", address(lending));

        // 4. Deploy LiteracyBadge
        LiteracyBadge badge = new LiteracyBadge();
        console.log("LiteracyBadge deployed at:", address(badge));

        vm.stopBroadcast();
    }
}
