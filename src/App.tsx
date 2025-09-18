import PortfolioCard from "./components/PortfolioCard";
import WatchlistTable from "./components/watchlist/WatchlistTable";
import WatchlistHeader from "./components/watchlist/WatchlistHeader";
import ConnectWalletButton from "./components/ConnectWalletButton";
import logoSvg from "./assets/logo.svg";

function App() {
  return (
    <div className="min-h-screen bg-[#21214]">
      <div className="max-w-7xl mx-auto px-4 py-4 md:px-6 md:py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
            <div className="w-6 h-6 md:w-10 md:h-10 bg-[#A9E851] rounded-lg md:rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <img
                src={logoSvg}
                alt="Logo"
                className="w-5 h-5 md:w-7 md:h-7"
              />
            </div>
            <h1 className="text-md md:text-3xl font-semibold text-white truncate">
              Token Portfolio
            </h1>
          </div>
          <ConnectWalletButton />
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