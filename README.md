# EmpowerChain Finance

A decentralized microfinance hub (P2P lending platform on blockchain) for entrepreneurs in low-income or underserved communities worldwide.

![EmpowerChain Finance](https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=400&fit=crop)

## Problem Statement

Entrepreneurs in underserved communities face significant barriers to accessing capital:
- Lack of traditional credit history
- High fees and interest rates
- Bias in traditional banking systems
- Geographic limitations

## Solution

EmpowerChain Finance provides:
- **Collateral-free microloans** on blockchain (Polygon)
- **Transparent, on-chain transactions** with verifiable terms
- **Financial literacy modules** with NFT badges that unlock better rates
- **Global lender network** supporting entrepreneurs worldwide

## Features

### For Borrowers
- [x] Multi-step loan application with draft saving
- [x] Wallet connection (MetaMask, injected wallets)
- [x] Application status tracking
- [x] Financial literacy modules with quizzes
- [x] NFT badges that unlock lower interest rates
- [x] Dashboard to manage loans

### For Lenders
- [x] Browse active loan opportunities
- [x] Filter and sort loans by various criteria
- [x] Fund loans directly from wallet
- [x] Track investments portfolio
- [x] View expected returns

### Technical
- [x] Smart contracts (Solidity)
- [x] React 19 + TypeScript frontend
- [x] Express.js API server
- [x] PostgreSQL database (Aiven)
- [x] Wagmi for Web3 integration

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (or use provided Aiven connection)
- MetaMask wallet

### Installation

```bash
# Clone the repository
git clone https://github.com/Moses-main/EmpowerChain-Finance.git
cd EmpowerChain-Finance

# Install frontend dependencies
npm install

# Install smart contract dependencies
cd contracts
npm install
cd ..
```

### Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Edit .env with your database URL
# DATABASE_URL=postgres://...
# DB_SSL_MODE=disable   # use "require" or "verify-full" in hosted/prod environments
# VITE_ENABLE_MOCK_LOANS=true   # development-only fallback mock loans for /lend
# VITE_WALLETCONNECT_PROJECT_ID=...  # optional, enables WalletConnect connector
```

### Running the Application

```bash
# Start the API server (in one terminal)
npm run server

# Start the frontend (in another terminal)
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Deploying Smart Contracts

```bash
cd contracts

# Compile contracts
npm run compile

# Deploy to local network
npm run deploy:local

# Deploy to Polygon Amoy testnet
npm run deploy:amoy
```

## Project Structure

```
EmpowerChain-Finance/
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── context/           # React context (wallet)
│   ├── hooks/             # Custom hooks (useLoans)
│   ├── pages/             # Page components
│   └── lib/               # Utilities
├── server/                # Express API server
│   └── index.js           # API endpoints
├── contracts/             # Solidity smart contracts
│   ├── Loan.sol           # Loan management
│   ├── Lending.sol        # Investment tracking
│   └── LiteracyBadge.sol  # NFT badges
└── supabase/              # Database migrations
```

## API Endpoints

- `GET /api/loans` - List active loans
- `POST /api/applications` - Submit loan application
- `GET /api/applications?address=` - Get applications by address
- `POST /api/investments` - Create investment
- `GET /api/investments?address=` - Get investments by address
- `GET /api/profile/:address` - Get user profile

## Smart Contracts

### Loan.sol
Manages loan lifecycle:
- Create loan applications
- Approve/reject loans
- Fund loans
- Track repayments

### Lending.sol
Handles lender investments:
- Track investments per loan
- Calculate expected returns
- Distribute repayments

### LiteracyBadge.sol
ERC-721 NFT badges:
- Mint badges on module completion
- Three tiers: Bronze, Silver, Gold
- Score-based tier calculation

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS
- **Blockchain**: wagmi, viem, Polygon
- **Backend**: Express.js, PostgreSQL
- **Smart Contracts**: Solidity, Hardhat, OpenZeppelin

## SDG Alignment

This project aligns with:
- **SDG 8**: Decent Work and Economic Growth
- **SDG 10**: Reduced Inequalities
- **SDG 17**: Partnerships for the Goals

## License

MIT License - see [LICENSE](LICENSE) for details.

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) first.

## Acknowledgments

- Built with [wagmi](https://wagmi.sh/) and [viem](https://viem.sh/)
- Smart contracts use [OpenZeppelin](https://openzeppelin.com/) contracts
- Database hosted on [Aiven](https://aiven.io/)
