import PortfolioCard from "./components/PortfolioCard";
import WatchlistTable from "./components/WatchlistTable";
import WatchlistHeader from "./components/WatchlistHeader";
import { ConnectButton } from "@rainbow-me/rainbowkit";

function App() {
  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Token Portfolio</h1>
        <ConnectButton />
      </div>

      <PortfolioCard />
      <WatchlistHeader />
      <WatchlistTable />
    </div>
  );
}

export default App;