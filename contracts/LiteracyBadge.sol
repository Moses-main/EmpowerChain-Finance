// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract LiteracyBadge is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard {
    uint256 private _nextTokenId;

    enum BadgeTier {
        Bronze,
        Silver,
        Gold
    }

    struct Badge {
        address recipient;
        string moduleId;
        uint256 score;
        BadgeTier tier;
        uint256 mintedAt;
    }

    mapping(uint256 => Badge) public badges;
    mapping(address => uint256[]) public userBadges;
    mapping(address => mapping(string => bool)) public hasCompletedModule;

    event BadgeMinted(
        uint256 indexed tokenId,
        address indexed recipient,
        string moduleId,
        BadgeTier tier,
        uint256 score
    );
    event BadgeTierUpgraded(
        uint256 indexed tokenId,
        BadgeTier oldTier,
        BadgeTier newTier
    );

    constructor() ERC721("EmpowerChain Literacy Badge", "ECLB") Ownable(msg.sender) {}

    function mintBadge(
        address recipient,
        string memory moduleId,
        uint256 score
    ) external onlyOwner nonReentrant returns (uint256) {
        require(recipient != address(0), "Invalid recipient");
        require(score >= 0 && score <= 100, "Invalid score");
        require(!hasCompletedModule[recipient][moduleId], "Module already completed");

        BadgeTier tier = _calculateTier(score);
        
        uint256 tokenId = _nextTokenId++;
        _safeMint(recipient, tokenId);
        
        string memory uri = _generateTokenURI(moduleId, tier, score);
        _setTokenURI(tokenId, uri);

        Badge memory newBadge = Badge({
            recipient: recipient,
            moduleId: moduleId,
            score: score,
            tier: tier,
            mintedAt: block.timestamp
        });

        badges[tokenId] = newBadge;
        userBadges[recipient].push(tokenId);
        hasCompletedModule[recipient][moduleId] = true;

        emit BadgeMinted(tokenId, recipient, moduleId, tier, score);

        return tokenId;
    }

    function batchMintBadges(
        address[] calldata recipients,
        string[] calldata moduleIds,
        uint256[] calldata scores
    ) external onlyOwner nonReentrant {
        require(
            recipients.length == moduleIds.length && 
            recipients.length == scores.length,
            "Array length mismatch"
        );

        for (uint256 i = 0; i < recipients.length; i++) {
            mintBadge(recipients[i], moduleIds[i], scores[i]);
        }
    }

    function upgradeBadgeTier(uint256 tokenId, uint256 newScore) external onlyOwner {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        
        BadgeTier newTier = _calculateTier(newScore);
        Badge storage badge = badges[tokenId];
        
        require(newTier > badge.tier, "New tier must be higher");

        BadgeTier oldTier = badge.tier;
        badge.tier = newTier;
        badge.score = newScore;

        string memory uri = _generateTokenURI(badge.moduleId, newTier, newScore);
        _setTokenURI(tokenId, uri);

        emit BadgeTierUpgraded(tokenId, oldTier, newTier);
    }

    function _calculateTier(uint256 score) internal pure returns (BadgeTier) {
        if (score >= 90) {
            return BadgeTier.Gold;
        } else if (score >= 70) {
            return BadgeTier.Silver;
        } else {
            return BadgeTier.Bronze;
        }
    }

    function _generateTokenURI(
        string memory moduleId,
        BadgeTier tier,
        uint256 score
    ) internal pure returns (string memory) {
        string memory tierName;
        
        if (tier == BadgeTier.Gold) {
            tierName = "Gold";
        } else if (tier == BadgeTier.Silver) {
            tierName = "Silver";
        } else {
            tierName = "Bronze";
        }

        return string(
            abi.encodePacked(
                "data:application/json,{",
                '"name":"EmpowerChain ', 
                tierName, 
                ' Badge",',
                '"description":"Financial Literacy Badge for completing module: ',
                moduleId,
                '",',
                '"attributes":[',
                '{"trait_type":"Module","value":"',
                moduleId,
                '"},',
                '{"trait_type":"Score","value":',
                _toString(score),
                '},',
                '{"trait_type":"Tier","value":"',
                tierName,
                '"}',
                "]}"
            )
        );
    }

    function _toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }

    function getUserBadges(address user) external view returns (uint256[] memory) {
        return userBadges[user];
    }

    function getBadgeDetails(uint256 tokenId) external view returns (Badge memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return badges[tokenId];
    }

    function hasCompleted(address user, string memory moduleId) external view returns (bool) {
        return hasCompletedModule[user][moduleId];
    }

    function getUserBadgeCount(address user) external view returns (uint256) {
        return userBadges[user].length;
    }

    function getUserTiers(address user) external view returns (uint256[] memory) {
        uint256[] memory userBadgeIds = userBadges[user];
        uint256[] memory tiers = new uint256[](userBadgeIds.length);
        
        for (uint256 i = 0; i < userBadgeIds.length; i++) {
            tiers[i] = uint256(badges[userBadgeIds[i]].tier);
        }
        
        return tiers;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
