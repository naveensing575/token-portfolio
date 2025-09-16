import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store/store";
import "./index.css";

import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Setup react-query client
const queryClient = new QueryClient();

const { connectors } = getDefaultWallets({
  appName: "Token Portfolio",
  projectId: "1835993f47bbb4e3e94501e210a2274e", // WalletConnect Cloud projectId
});

// Wagmi config (chains declared here)
const config = createConfig({
  connectors,
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(),
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <App />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </Provider>
  </React.StrictMode>
);
