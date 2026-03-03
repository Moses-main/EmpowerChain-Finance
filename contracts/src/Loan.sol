// SPDX-License-Identifier: MIT
pragma solidity ^0.8.25;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Loan is Ownable, ReentrancyGuard {
    enum LoanStatus {
        Pending,
        Approved,
        Funded,
        Repaid,
        Defaulted,
        Rejected
    }

    struct LoanData {
        bytes32 id;
        address borrower;
        string borrowerName;
        uint256 amount;
        uint256 interestRate;
        uint256 duration;
        string purpose;
        string description;
        uint256 fundedAmount;
        LoanStatus status;
        uint256 createdAt;
        uint256 fundedAt;
        uint256 repaidAt;
    }

    mapping(bytes32 => LoanData) public loans;
    mapping(address => bytes32[]) public borrowerLoanIds;
    bytes32[] public allLoanIds;

    event LoanCreated(
        bytes32 indexed id,
        address indexed borrower,
        string borrowerName,
        uint256 amount,
        uint256 interestRate
    );
    event LoanApproved(bytes32 indexed id);
    event LoanFunded(bytes32 indexed id, address indexed lender, uint256 amount);
    event LoanRepaid(bytes32 indexed id, uint256 amount);
    event LoanDefaulted(bytes32 indexed id);
    event LoanRejected(bytes32 indexed id);

    constructor() Ownable(msg.sender) {}

    function createLoan(
        string memory borrowerName,
        uint256 amount,
        uint256 interestRate,
        uint256 duration,
        string memory purpose,
        string memory description
    ) external returns (bytes32) {
        require(amount > 0, "Loan amount must be greater than 0");
        require(interestRate > 0 && interestRate <= 100, "Invalid interest rate");
        require(duration > 0, "Duration must be greater than 0");

        bytes32 id = keccak256(
            abi.encodePacked(msg.sender, amount, block.timestamp)
        );

        LoanData storage loan = loans[id];
        loan.id = id;
        loan.borrower = msg.sender;
        loan.borrowerName = borrowerName;
        loan.amount = amount;
        loan.interestRate = interestRate;
        loan.duration = duration;
        loan.purpose = purpose;
        loan.description = description;
        loan.fundedAmount = 0;
        loan.status = LoanStatus.Pending;
        loan.createdAt = block.timestamp;

        borrowerLoanIds[msg.sender].push(id);
        allLoanIds.push(id);

        emit LoanCreated(id, msg.sender, borrowerName, amount, interestRate);

        return id;
    }

    function approveLoan(bytes32 loanId) external onlyOwner {
        LoanData storage loan = loans[loanId];
        require(loan.borrower != address(0), "Loan does not exist");
        require(loan.status == LoanStatus.Pending, "Loan is not pending");

        loan.status = LoanStatus.Approved;
        emit LoanApproved(loanId);
    }

    function fundLoan(bytes32 loanId) external payable nonReentrant {
        LoanData storage loan = loans[loanId];
        require(loan.borrower != address(0), "Loan does not exist");
        require(loan.status == LoanStatus.Approved, "Loan is not approved for funding");
        require(msg.value > 0, "Funding amount must be greater than 0");
        require(loan.fundedAmount + msg.value <= loan.amount, "Exceeds loan amount");

        loan.fundedAmount += msg.value;

        if (loan.fundedAmount >= loan.amount) {
            loan.status = LoanStatus.Funded;
            loan.fundedAt = block.timestamp;
        }

        emit LoanFunded(loanId, msg.sender, msg.value);
    }

    function repayLoan(bytes32 loanId) external payable nonReentrant {
        LoanData storage loan = loans[loanId];
        require(loan.borrower != address(0), "Loan does not exist");
        require(loan.status == LoanStatus.Funded, "Loan is not funded");
        require(msg.value > 0, "Repayment amount must be greater than 0");

        uint256 totalRepayment = calculateTotalRepayment(loanId);
        require(msg.value >= totalRepayment, "Insufficient repayment amount");

        loan.status = LoanStatus.Repaid;
        loan.repaidAt = block.timestamp;

        emit LoanRepaid(loanId, msg.value);
    }

    function calculateTotalRepayment(bytes32 loanId) public view returns (uint256) {
        LoanData storage loan = loans[loanId];
        uint256 interest = (loan.fundedAmount * loan.interestRate * loan.duration) / (100 * 365 days);
        return loan.fundedAmount + interest;
    }

    function markAsDefaulted(bytes32 loanId) external onlyOwner {
        LoanData storage loan = loans[loanId];
        require(loan.borrower != address(0), "Loan does not exist");
        require(loan.status == LoanStatus.Funded, "Loan is not funded");

        loan.status = LoanStatus.Defaulted;
        emit LoanDefaulted(loanId);
    }

    function rejectLoan(bytes32 loanId) external onlyOwner {
        LoanData storage loan = loans[loanId];
        require(loan.borrower != address(0), "Loan does not exist");
        require(loan.status == LoanStatus.Pending, "Loan is not pending");

        loan.status = LoanStatus.Rejected;
        emit LoanRejected(loanId);
    }

    function getLoan(bytes32 loanId) external view returns (LoanData memory) {
        return loans[loanId];
    }

    function getBorrowerLoans(address borrower) external view returns (LoanData[] memory) {
        bytes32[] storage loanIds = borrowerLoanIds[borrower];
        LoanData[] memory result = new LoanData[](loanIds.length);

        for (uint256 i = 0; i < loanIds.length; i++) {
            result[i] = loans[loanIds[i]];
        }

        return result;
    }

    function getAllLoans() external view returns (LoanData[] memory) {
        LoanData[] memory result = new LoanData[](allLoanIds.length);

        for (uint256 i = 0; i < allLoanIds.length; i++) {
            result[i] = loans[allLoanIds[i]];
        }

        return result;
    }

    function getActiveLoans() external view returns (LoanData[] memory) {
        uint256 count = 0;
        for (uint256 i = 0; i < allLoanIds.length; i++) {
            LoanData storage loan = loans[allLoanIds[i]];
            if (loan.status == LoanStatus.Approved || loan.status == LoanStatus.Funded) {
                count++;
            }
        }

        LoanData[] memory result = new LoanData[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < allLoanIds.length; i++) {
            LoanData storage loan = loans[allLoanIds[i]];
            if (loan.status == LoanStatus.Approved || loan.status == LoanStatus.Funded) {
                result[index] = loan;
                index++;
            }
        }

        return result;
    }

    function withdrawFunds() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    receive() external payable {}
}
