export const contractAddresses = {
  loan: (import.meta.env.VITE_LOAN_CONTRACT_ADDRESS as `0x${string}`) || '0x0000000000000000000000000000000000000000',
  lending: (import.meta.env.VITE_LENDING_CONTRACT_ADDRESS as `0x${string}`) || '0x0000000000000000000000000000000000000000',
  literacyBadge: (import.meta.env.VITE_LITERACY_BADGE_CONTRACT_ADDRESS as `0x${string}`) || '0x0000000000000000000000000000000000000000',
  usdc: (import.meta.env.VITE_USDC_CONTRACT_ADDRESS as `0x${string}`) || '0x0000000000000000000000000000000000000000',
} as const

export const loanAbi = [
  {
    type: "function",
    name: "createLoan",
    inputs: [
      { name: "borrowerName", type: "string" },
      { name: "amount", type: "uint256" },
      { name: "interestRate", type: "uint256" },
      { name: "duration", type: "uint256" },
      { name: "purpose", type: "string" },
      { name: "description", type: "string" }
    ],
    outputs: [{ name: "", type: "bytes32" }],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "approveLoan",
    inputs: [{ name: "loanId", type: "bytes32" }],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "fundLoan",
    inputs: [{ name: "loanId", type: "bytes32" }],
    outputs: [],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "repayLoan",
    inputs: [{ name: "loanId", type: "bytes32" }],
    outputs: [],
    stateMutability: "payable"
  },
  {
    type: "function",
    name: "getLoan",
    inputs: [{ name: "loanId", type: "bytes32" }],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "id", type: "bytes32" },
          { name: "borrower", type: "address" },
          { name: "borrowerName", type: "string" },
          { name: "amount", type: "uint256" },
          { name: "interestRate", type: "uint256" },
          { name: "duration", type: "uint256" },
          { name: "purpose", type: "string" },
          { name: "description", type: "string" },
          { name: "fundedAmount", type: "uint256" },
          { name: "status", type: "uint8" },
          { name: "createdAt", type: "uint256" },
          { name: "fundedAt", type: "uint256" },
          { name: "repaidAt", type: "uint256" }
        ]
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getActiveLoans",
    inputs: [],
    outputs: [
      {
        type: "tuple[]",
        components: [
          { name: "id", type: "bytes32" },
          { name: "borrower", type: "address" },
          { name: "borrowerName", type: "string" },
          { name: "amount", type: "uint256" },
          { name: "interestRate", type: "uint256" },
          { name: "duration", type: "uint256" },
          { name: "purpose", type: "string" },
          { name: "description", type: "string" },
          { name: "fundedAmount", type: "uint256" },
          { name: "status", type: "uint8" },
          { name: "createdAt", type: "uint256" },
          { name: "fundedAt", type: "uint256" },
          { name: "repaidAt", type: "uint256" }
        ]
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "calculateTotalRepayment",
    inputs: [{ name: "loanId", type: "bytes32" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getBorrowerLoans",
    inputs: [{ name: "borrower", type: "address" }],
    outputs: [
      {
        type: "tuple[]",
        components: [
          { name: "id", type: "bytes32" },
          { name: "borrower", type: "address" },
          { name: "borrowerName", type: "string" },
          { name: "amount", type: "uint256" },
          { name: "interestRate", type: "uint256" },
          { name: "duration", type: "uint256" },
          { name: "purpose", type: "string" },
          { name: "description", type: "string" },
          { name: "fundedAmount", type: "uint256" },
          { name: "status", type: "uint8" },
          { name: "createdAt", type: "uint256" },
          { name: "fundedAt", type: "uint256" },
          { name: "repaidAt", type: "uint256" }
        ]
      }
    ],
    stateMutability: "view"
  },
  {
    type: "event",
    name: "LoanCreated",
    inputs: [
      { name: "id", type: "bytes32", indexed: true },
      { name: "borrower", type: "address", indexed: true },
      { name: "borrowerName", type: "string" },
      { name: "amount", type: "uint256" },
      { name: "interestRate", type: "uint256" }
    ]
  },
  {
    type: "event",
    name: "LoanApproved",
    inputs: [{ name: "id", type: "bytes32", indexed: true }]
  },
  {
    type: "event",
    name: "LoanFunded",
    inputs: [
      { name: "id", type: "bytes32", indexed: true },
      { name: "lender", type: "address", indexed: true },
      { name: "amount", type: "uint256" }
    ]
  },
  {
    type: "event",
    name: "LoanRepaid",
    inputs: [
      { name: "id", type: "bytes32", indexed: true },
      { name: "amount", type: "uint256" }
    ]
  }
] as const

export const lendingAbi = [
  {
    type: "function",
    name: "invest",
    inputs: [
      { name: "loanId", type: "bytes32" },
      { name: "amount", type: "uint256" }
    ],
    outputs: [],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "getInvestment",
    inputs: [{ name: "loanId", type: "bytes32" }, { name: "lender", type: "address" }],
    outputs: [
      {
        type: "tuple",
        components: [
          { name: "loanId", type: "bytes32" },
          { name: "lender", type: "address" },
          { name: "amount", type: "uint256" },
          { name: "interestRate", type: "uint256" },
          { name: "expectedReturn", type: "uint256" },
          { name: "status", type: "uint8" }
        ]
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getLenderInvestments",
    inputs: [{ name: "lender", type: "address" }],
    outputs: [
      {
        type: "tuple[]",
        components: [
          { name: "loanId", type: "bytes32" },
          { name: "lender", type: "address" },
          { name: "amount", type: "uint256" },
          { name: "interestRate", type: "uint256" },
          { name: "expectedReturn", type: "uint256" },
          { name: "status", type: "uint8" }
        ]
      }
    ],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "calculateReturns",
    inputs: [{ name: "loanId", type: "bytes32" }, { name: "lender", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view"
  }
] as const

export const literacyBadgeAbi = [
  {
    type: "function",
    name: "mintBadge",
    inputs: [
      { name: "to", type: "address" },
      { name: "tier", type: "uint8" }
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "getBadgeTier",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "getUserBadge",
    inputs: [{ name: "user", type: "address" }],
    outputs: [{ name: "tokenId", type: "uint256" }, { name: "tier", type: "uint8" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "owner", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "tokenURI",
    inputs: [{ name: "tokenId", type: "uint256" }],
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view"
  }
] as const

export const usdcAbi = [
  {
    type: "function",
    name: "transfer",
    inputs: [
      { name: "to", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "approve",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable"
  },
  {
    type: "function",
    name: "balanceOf",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view"
  },
  {
    type: "function",
    name: "allowance",
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" }
    ],
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view"
  }
] as const
