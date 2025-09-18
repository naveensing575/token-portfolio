import { ConnectButton } from "@rainbow-me/rainbowkit";
import walletSvg from "../assets/wallet.svg";

const ConnectWalletButton: React.FC = () => {
  return (
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
                      className="flex items-center gap-2 bg-[#A9E851] hover:bg-[#98d147] text-black font-medium px-3 md:px-4 py-2 md:py-2.5 rounded-full transition-colors duration-200 shadow-lg text-sm md:text-base border border-[#8bc840]"
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
                      className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium px-3 md:px-4 py-2 md:py-2.5 rounded-full transition-colors duration-200 shadow-lg text-sm md:text-base"
                    >
                      Wrong network
                    </button>
                  );
                }

                return (
                  <button
                    onClick={openAccountModal}
                    className="flex items-center gap-2 bg-[#A9E851] hover:bg-[#98d147] text-black font-medium px-3 md:px-4 py-2 md:py-2.5 rounded-lg transition-colors duration-200 shadow-lg text-sm md:text-base border border-[#8bc840]"
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
  );
};

export default ConnectWalletButton;