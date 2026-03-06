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
- [x] Smart contracts (Solidity) with Foundry
- [x] React 19 + TypeScript frontend
- [x] Express.js API server
- [x] PostgreSQL database (Aiven)
- [x] Wagmi for Web3 integration
- [x] Multi-language support (English, Spanish, French)
- [x] Accessibility (ARIA, Keyboard nav)

## Quick Start

### Prerequisites
- Node.js 18+
- Foundry (forge, cast, anvil)
- PostgreSQL database
- MetaMask wallet

### Installation

```bash
# Clone the repository
git clone https://github.com/Moses-main/EmpowerChain-Finance.git
cd EmpowerChain-Finance

# Install frontend dependencies
npm install

# Install smart contract dependencies (Foundry)
cd contracts
forge install
cd ..
```

### Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Edit .env with your database URL and Private Key
# DATABASE_URL=postgres://...
# PRIVATE_KEY=0x...
# RPC_URL=https://polygon-amoy...
```

### Running the Application

```bash
# Start the API server (in one terminal)
npm run server

# Start the frontend (in another terminal)
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Smart Contract Workflows (Foundry)

```bash
cd contracts

# Build contracts
forge build

# Run unit tests
forge test

# Deploy simulation
forge script script/Deploy.s.sol
```

## Project Structure

```
EmpowerChain-Finance/
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── context/           # React context (wallet, auth)
│   ├── hooks/             # Custom hooks (useLoans, useStats)
│   ├── i18n/              # Translation resources
│   ├── pages/             # Page components
│   └── lib/               # Utilities
├── server/                # Express API server
│   └── index.js           # API endpoints & NFT minter
├── contracts/             # Foundry smart contract project
│   ├── src/               # Solidity contracts (Lending, Loan, LiteracyBadge)
│   ├── test/             # Solidity unit tests
│   ├── script/           # Deployment scripts
│   └── foundry.toml      # Foundry configuration
└── tests/                 # Playwright E2E tests
```

## API Endpoints

### Loans & Stats
- `GET /api/loans` - List active loans
- `GET /api/stats` - Platform-wide impact metrics
- `POST /api/applications` - Submit loan application
- `GET /api/applications?address=` - Get applications by address

### Investments
- `POST /api/investments` - Create investment
- `GET /api/investments?address=` - Get investments by address

### Educational Modules
- `POST /api/quiz-progress` - Save module completion
- `POST /api/mint-badge` - Gassless NFT badge minting (Server-side)

## Smart Contracts

### LiteracyBadge.sol
ERC-721 NFT badges issued to borrowers upon completing educational modules. 
- **Utility**: Holders earn up to 15% discount on loan interest rates.
- **Tiers**: Bronze, Silver, Gold based on quiz performance.

### Loan.sol & Lending.sol
Core P2P lending engine. Handles loan request lifecycle and lender yield distribution.

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

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgres://user:password@host:port/database
DB_SSL_MODE=require

# API
PORT=3001
VITE_API_URL=http://localhost:3001

# WalletConnect (optional)
VITE_WALLETCONNECT_PROJECT_ID=your_project_id

# Supabase (optional)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

# Smart Contracts (for frontend)
VITE_LOAN_CONTRACT_ADDRESS=0x...
VITE_LENDING_CONTRACT_ADDRESS=0x...
VITE_LITERACY_BADGE_CONTRACT_ADDRESS=0x...
VITE_USDC_CONTRACT_ADDRESS=0x...
```

## API Endpoints

### Loans
- `GET /api/loans` - Get all active loans
- `GET /api/loans/:id` - Get loan by ID
- `POST /api/applications` - Submit loan application
- `GET /api/applications?address=` - Get applications by address

### Investments
- `POST /api/investments` - Create investment
- `GET /api/investments?address=` - Get investments by address

### User Profile
- `GET /api/profile/:address` - Get user profile
- `POST /api/profile` - Create/update profile

### Quiz Progress
- `GET /api/quiz-progress?address=` - Get quiz progress by address
- `POST /api/quiz-progress` - Save quiz progress

## Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
```

### Backend (Railway/Render/DigitalOcean)
```bash
npm run server
```

### Smart Contracts
```bash
cd contracts
npm run compile
npm run deploy:amoy  # Deploy to Polygon Amoy testnet
```

## Contributing

Contributions are welcome! Please read our [contributing guidelines](CONTRIBUTING.md) first.

## License

MIT License - see [LICENSE](LICENSE) for details.
