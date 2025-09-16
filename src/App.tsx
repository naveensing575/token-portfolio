import PortfolioCard from "./components/PortfolioCard";
import WatchlistTable from "./components/WatchlistTable";
import WatchlistHeader from "./components/WatchlistHeader";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function App() {
  return (
    <div className="min-h-screen bg-gray-900 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-3 sm:gap-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm sm:text-lg">T</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Token Portfolio</h1>
          </div>
          <div className="connect-wallet-custom">
            <ConnectButton />
          </div>
        </div>

        {/* Main Content */}
        <PortfolioCard />
        <WatchlistHeader />
        <WatchlistTable />
      </div>
    </div>
  );
}

export default App;