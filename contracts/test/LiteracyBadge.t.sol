// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "forge-std/Test.sol";
import "../src/LiteracyBadge.sol";

contract LiteracyBadgeTest is Test {
    LiteracyBadge public badge;
    address public owner;
    address public user1 = address(0x1);
    address public user2 = address(0x2);

    function setUp() public {
        owner = address(this);
        badge = new LiteracyBadge();
    }

    function test_MintBadge() public {
        badge.mintBadge(user1, "module1", 85);
        
        assertEq(badge.getUserBadgeCount(user1), 1);
        assertEq(badge.hasCompleted(user1, "module1"), true);
        
        uint256[] memory tokens = badge.getUserBadges(user1);
        LiteracyBadge.Badge memory details = badge.getBadgeDetails(tokens[0]);
        
        assertEq(details.moduleId, "module1");
        assertEq(details.score, 85);
        assertEq(uint256(details.tier), uint256(LiteracyBadge.BadgeTier.Silver));
    }

    function test_MintBadgeGold() public {
        badge.mintBadge(user1, "module1", 95);
        uint256[] memory tokens = badge.getUserBadges(user1);
        LiteracyBadge.Badge memory details = badge.getBadgeDetails(tokens[0]);
        assertEq(uint256(details.tier), uint256(LiteracyBadge.BadgeTier.Gold));
    }

    function test_RevertMintDuplicateModule() public {
        badge.mintBadge(user1, "module1", 80);
        vm.expectRevert("Module already completed");
        badge.mintBadge(user1, "module1", 90);
    }

    function test_UpgradeBadgeTier() public {
        uint256 tokenId = badge.mintBadge(user1, "module1", 75); // Silver
        badge.upgradeBadgeTier(tokenId, 95); // Gold
        
        LiteracyBadge.Badge memory details = badge.getBadgeDetails(tokenId);
        assertEq(uint256(details.tier), uint256(LiteracyBadge.BadgeTier.Gold));
        assertEq(details.score, 95);
    }

    function test_OnlyOwnerCanMint() public {
        vm.prank(user1);
        vm.expectRevert(
            abi.encodeWithSelector(
                bytes4(keccak256("OwnableUnauthorizedAccount(address)")),
                user1
            )
        );
        badge.mintBadge(user2, "module1", 80);
    }
}
