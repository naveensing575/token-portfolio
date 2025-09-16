import PortfolioCard from "./components/PortfolioCard";
import WatchlistTable from "./components/WatchlistTable";
import WatchlistHeader from "./components/WatchlistHeader";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 md:bg-gray-900">
      {/* Mobile: Light background, Desktop: Dark background */}
      <div className="max-w-7xl mx-auto px-4 py-4 md:px-6 md:py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 sm:gap-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-green-500 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg md:text-xl">T</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 md:text-white">
              Token Portfolio
            </h1>
          </div>
          <div className="connect-wallet-custom">
            <ConnectButton />
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <PortfolioCard />
          <WatchlistHeader />
          <WatchlistTable />
        </div>
      </div>
    </div>
  );
}

export default App;