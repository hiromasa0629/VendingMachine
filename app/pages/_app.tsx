import 'bootstrap/dist/css/bootstrap.min.css';
import '@rainbow-me/rainbowkit/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { sepolia, hardhat } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { ToastContainer } from 'react-toastify';
import { ReactNode } from 'react';
import { AlchemyProvider } from 'alchemy-sdk';
import AlchemySdkProvider from '../providers/AlchemySdkProvider';



const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia],
  [publicProvider(), alchemyProvider({ apiKey: process.env.ALCHEMY_SEPOLIA_API_KEY! })]
);

const { connectors } = getDefaultWallets({
  appName: 'RainbowKit App',
  projectId: process.env.WALLETCONNECT_PROJECTID,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} coolMode>
				<AlchemySdkProvider>
					<ToastContainer />
					<Component {...pageProps} />
				</AlchemySdkProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
