import PortfolioCard from "./components/PortfolioCard";
import WatchlistTable from "./components/watchlist/WatchlistTable";
import WatchlistHeader from "./components/watchlist/WatchlistHeader";
import logoSvg from "./assets/logo.svg";
import walletSvg from "./assets/wallet.svg";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-4 md:px-6 md:py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
            <div className="w-7 h-7 md:w-10 md:h-10 bg-[#A9E851] rounded-lg md:rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
              <img
                src={logoSvg}
                alt="Logo"
                className="w-4 h-4 md:w-6 md:h-6"
              />
            </div>
            <h1 className="text-lg md:text-3xl font-bold text-white truncate">
              Token Portfolio
            </h1>
          </div>

          <div className="flex-shrink-0 ml-3">
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => {
                const ready = mounted && authenticationStatus !== 'loading';
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus ||
                    authenticationStatus === 'authenticated');

                return (
                  <div
                    {...(!ready && {
                      'aria-hidden': true,
                      style: {
                        opacity: 0,
                        pointerEvents: 'none',
                        userSelect: 'none',
                      },
                    })}
                  >
                    {(() => {
                      if (!connected) {
                        return (
                          <button
                            onClick={openConnectModal}
                            className="flex items-center gap-2 bg-[#A9E851] hover:bg-[#98d147] text-black font-medium px-3 md:px-4 py-2 md:py-2.5 rounded-lg transition-colors duration-200 shadow-lg text-sm md:text-base"
                          >
                            <img
                              src={walletSvg}
                              alt="Wallet"
                              className="w-3.5 h-3.5 md:w-4 md:h-4"
                            />
                            <span className="hidden sm:inline">Connect Wallet</span>
                            <span className="sm:hidden">Connect</span>
                          </button>
                        );
                      }

                      if (chain.unsupported) {
                        return (
                          <button
                            onClick={openChainModal}
                            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium px-3 md:px-4 py-2 md:py-2.5 rounded-lg transition-colors duration-200 shadow-lg text-sm md:text-base"
                          >
                            Wrong network
                          </button>
                        );
                      }

                      return (
                        <button
                          onClick={openAccountModal}
                          className="flex items-center gap-2 bg-[#A9E851] hover:bg-[#98d147] text-black font-medium px-3 md:px-4 py-2 md:py-2.5 rounded-lg transition-colors duration-200 shadow-lg text-sm md:text-base"
                        >
                          <img
                            src={walletSvg}
                            alt="Wallet"
                            className="w-3.5 h-3.5 md:w-4 md:h-4"
                          />
                          <span className="font-mono text-xs md:text-sm">
                            {account.displayName}
                          </span>
                        </button>
                      );
                    })()}
                  </div>
                );
              }}
            </ConnectButton.Custom>
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