// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Lending is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    IERC20 public immutable token;

    struct Investment {
        bytes32 loanId;
        address lender;
        uint256 amount;
        uint256 interestRate;
        uint256 expectedReturn;
        bool repaid;
        uint256 investedAt;
    }

    mapping(bytes32 => Investment[]) public loanInvestments;
    mapping(address => Investment[]) public lenderInvestments;
    mapping(bytes32 => uint256) public loanTotalInvested;

    event InvestmentMade(
        bytes32 indexed loanId,
        address indexed lender,
        uint256 amount,
        uint256 interestRate,
        uint256 expectedReturn
    );
    event InvestmentRepaid(
        bytes32 indexed loanId,
        address indexed lender,
        uint256 amount
    );

    constructor(address _token) Ownable(msg.sender) {
        require(_token != address(0), "Invalid token address");
        token = IERC20(_token);
    }

    function invest(
        bytes32 loanId,
        uint256 amount,
        uint256 interestRate,
        uint256 expectedReturn
    ) external nonReentrant {
        require(amount > 0, "Investment amount must be greater than 0");
        require(interestRate > 0 && interestRate <= 100, "Invalid interest rate");

        token.safeTransferFrom(msg.sender, address(this), amount);

        Investment memory investment = Investment({
            loanId: loanId,
            lender: msg.sender,
            amount: amount,
            interestRate: interestRate,
            expectedReturn: expectedReturn,
            repaid: false,
            investedAt: block.timestamp
        });

        loanInvestments[loanId].push(investment);
        lenderInvestments[msg.sender].push(investment);
        loanTotalInvested[loanId] += amount;

        emit InvestmentMade(loanId, msg.sender, amount, interestRate, expectedReturn);
    }

    function repayInvestment(
        bytes32 loanId,
        address lender,
        uint256 amount
    ) external onlyOwner nonReentrant {
        Investment[] storage investments = loanInvestments[loanId];
        
        for (uint256 i = 0; i < investments.length; i++) {
            if (investments[i].lender == lender && !investments[i].repaid) {
                investments[i].repaid = true;
                
                address[] memory lenders = new address[](1);
                lenders[0] = lender;
                _repayToLenders(lenders, amount);

                emit InvestmentRepaid(loanId, lender, amount);
                break;
            }
        }
    }

    function batchRepayInvestment(
        bytes32 loanId,
        address[] calldata lenders,
        uint256[] calldata amounts
    ) external onlyOwner nonReentrant {
        require(lenders.length == amounts.length, "Length mismatch");

        for (uint256 i = 0; i < lenders.length; i++) {
            _markInvestmentAsRepaid(loanId, lenders[i]);
            emit InvestmentRepaid(loanId, lenders[i], amounts[i]);
        }

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        
        token.safeTransfer(owner(), totalAmount);
    }

    function _repayToLenders(address[] memory lenders, uint256 totalAmount) internal {
        token.safeTransfer(owner(), totalAmount);
    }

    function _markInvestmentAsRepaid(bytes32 loanId, address lender) internal {
        Investment[] storage investments = loanInvestments[loanId];
        
        for (uint256 i = 0; i < investments.length; i++) {
            if (investments[i].lender == lender) {
                investments[i].repaid = true;
            }
        }

        Investment[] storage lenderInvs = lenderInvestments[lender];
        for (uint256 i = 0; i < lenderInvs.length; i++) {
            if (lenderInvs[i].loanId == loanId) {
                lenderInvs[i].repaid = true;
            }
        }
    }

    function getLoanInvestments(bytes32 loanId) external view returns (Investment[] memory) {
        return loanInvestments[loanId];
    }

    function getLenderInvestments(address lender) external view returns (Investment[] memory) {
        return lenderInvestments[lender];
    }

    function getLenderTotalInvested(address lender) external view returns (uint256) {
        Investment[] storage investments = lenderInvestments[lender];
        uint256 total = 0;
        
        for (uint256 i = 0; i < investments.length; i++) {
            total += investments[i].amount;
        }
        
        return total;
    }

    function getLenderTotalReturns(address lender) external view returns (uint256) {
        Investment[] storage investments = lenderInvestments[lender];
        uint256 total = 0;
        
        for (uint256 i = 0; i < investments.length; i++) {
            if (investments[i].repaid) {
                total += investments[i].expectedReturn;
            }
        }
        
        return total;
    }

    function getActiveInvestments(address lender) external view returns (Investment[] memory) {
        Investment[] storage allInvestments = lenderInvestments[lender];
        uint256 count = 0;
        
        for (uint256 i = 0; i < allInvestments.length; i++) {
            if (!allInvestments[i].repaid) {
                count++;
            }
        }

        Investment[] memory result = new Investment[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < allInvestments.length; i++) {
            if (!allInvestments[i].repaid) {
                result[index] = allInvestments[i];
                index++;
            }
        }
        
        return result;
    }

    function withdrawTokens(address _token, uint256 amount) external onlyOwner {
        require(_token != address(0), "Invalid token address");
        IERC20(_token).safeTransfer(owner(), amount);
    }

    function withdrawETH() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    receive() external payable {}
}
