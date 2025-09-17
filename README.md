# Token Portfolio

A modern, responsive cryptocurrency portfolio tracker built with React, TypeScript, and Redux. Features real-time token data, interactive charts, wallet integration, and persistent storage for tracking your crypto investments.

## Live Demo

[**View Live Application**](https://token-portfolio-ten.vercel.app/)

<img width="470" height="496" alt="image" src="https://github.com/user-attachments/assets/24cfcdc8-0763-47a3-83d2-218677892635" />


## Features

- **Portfolio Overview**: Interactive donut chart showing portfolio breakdown with real-time calculations
- **Token Management**: Add, remove, and track cryptocurrency tokens with CoinGecko integration
- **Holdings Tracking**: Edit and manage token holdings with automatic value calculations
- **Price Updates**: Real-time price data with 24h change indicators and 7-day sparkline charts
- **Wallet Integration**: Connect cryptocurrency wallets using RainbowKit and Wagmi
- **Responsive Design**: Fully responsive UI matching provided Figma designs for desktop and mobile
- **Data Persistence**: LocalStorage integration to maintain watchlist across sessions
- **Search & Discovery**: Token search with trending tokens display in modal interface

## Tech Stack

### Frontend
- **React 19** - Latest React with modern features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework with custom design system

### State Management
- **Redux Toolkit** - Predictable state container
- **React Redux** - Official React bindings for Redux

### Charts & Visualization
- **Recharts** - Responsive charts built on D3
- **Custom Sparklines** - Real-time 7-day price trends

### Wallet Integration
- **RainbowKit** - Wallet connection UI
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript interface for Ethereum

### Data & API
- **CoinGecko API** - Real-time cryptocurrency data
- **Axios** - HTTP client for API requests

### UI Components
- **Radix UI** - Unstyled, accessible components
- **Lucide React** - Beautiful icon library
- **Custom Components** - Optimized, reusable UI components

## Architecture

### Component Structure
```
components/
├── watchlist/           # Watchlist-specific components
│   ├── WatchlistTable.tsx
│   ├── TokenRow.tsx
│   ├── TokenImage.tsx
│   └── ...
├── PortfolioCard.tsx    # Portfolio overview
└── AddTokenModal.tsx    # Token search and addition
```

### Performance Optimizations
- **React.memo** for component memoization
- **useMemo** for expensive calculations
- **useCallback** for stable function references
- **Custom hooks** for reusable logic
- **Component splitting** for better bundle sizing

### State Management
- Centralized Redux store with TypeScript
- LocalStorage persistence middleware
- Optimistic UI updates for better UX

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/naveensing575/token-portfolio.git
cd token-portfolio
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
```bash
cp .env.example .env
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
VITE_COINGECKO_API_URL=https://api.coingecko.com/api/v3
```

4. **Start development server**
```bash
npm run dev
```

5. **Build for production**
```bash
npm run build
```

## Project Structure

```
src/
├── components/          # React components
├── hooks/              # Custom React hooks
├── features/           # Redux slices and features
├── services/           # API services and external integrations
├── store/              # Redux store configuration
├── utils/              # Utility functions
├── assets/             # Static assets (SVGs, images)
└── types/              # TypeScript type definitions
```

## API Integration

### CoinGecko API
- Token search and trending data
- Real-time price information
- Historical price charts (sparklines)
- Market data and statistics

### Wallet Integration
- Multi-wallet support via RainbowKit
- Ethereum mainnet integration
- Connection state management
- Custom styled wallet buttons

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ using modern React and TypeScript
