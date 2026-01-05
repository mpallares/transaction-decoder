# Transaction Decoder

A Next.js web application that decodes Ethereum and EVM transaction hashes into human-readable summaries. Built with Next.js 15, TypeScript, Tailwind CSS, and viem.

## Features

- **Multi-Chain Support**: Decode transactions from Ethereum, Base, Arbitrum, and Polygon
- **Human-Readable Summaries**: Get clear, concise descriptions of what happened in a transaction
- **Token Transfers**: View all ERC20 token transfers with proper formatting
- **Function Call Decoding**: See decoded function names and parameters
- **Event Log Parsing**: View all emitted events from the transaction
- **Gas Cost in USD**: Real-time gas cost calculation using CoinGecko API
- **Dark Mode**: Automatic dark mode support based on system preferences
- **Block Explorer Links**: Quick links to view addresses, transactions, and blocks on explorers
- **Copy to Clipboard**: Easy copying of addresses and transaction hashes

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd transaction-decoder
```

2. Install dependencies:
```bash
npm install
```

3. (Optional) Set up environment variables:
Create a `.env.local` file based on `.env.example`:
```bash
cp .env.example .env.local
```

Add your API keys for better rate limits and ABI fetching:
- RPC provider keys (Alchemy/Infura)
- Block explorer API keys (Etherscan, Basescan, etc.)

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Usage

1. Select the blockchain network (Ethereum, Base, Arbitrum, Optimism, or Polygon)
2. Paste a transaction hash (0x...)
3. Click "Decode Transaction"
4. View the decoded transaction details including:
   - Transaction summary
   - From/To addresses
   - Token transfers
   - Gas costs
   - Function calls
   - Event logs

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **viem** - Ethereum library for blockchain interactions
- **Lucide React** - Icon library

## Project Structure

```
transaction-decoder/
├── app/
│   ├── layout.tsx          # Root layout with metadata
│   ├── page.tsx             # Main page component
│   └── globals.css          # Global styles
├── components/
│   ├── SearchBar.tsx        # Transaction search input
│   ├── TransactionDetails.tsx  # Main transaction display
│   ├── LoadingSkeleton.tsx  # Loading state
│   └── ErrorDisplay.tsx     # Error state
├── hooks/
│   └── useTransactionDecoder.ts  # Transaction decoding hook
├── lib/
│   ├── chains.ts            # Chain configurations
│   ├── abis.ts              # Common ABIs
│   ├── abi-fetcher.ts       # ABI fetching from block explorers
│   ├── decoder.ts           # Transaction decoding logic
│   ├── format.ts            # Formatting utilities
│   └── types.ts             # TypeScript types
└── .env.example             # Environment variables template
```
