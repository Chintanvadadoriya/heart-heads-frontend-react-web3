import {
	ThirdwebProvider,
	metamaskWallet,
	coinbaseWallet,
	walletConnect,
	safeWallet,
	trustWallet,
	zerionWallet,
	rainbowWallet,
	en,
	localWallet,
} from "@thirdweb-dev/react";

import { PulsechainTestnetV4, Pulsechain, Mumbai } from "@thirdweb-dev/chains";
import LogoNewTwo from "../../assets/images/logo-new-2.svg";


console.log("111", process.env.REACT_APP_THIRD_WEB_CLIENTID);

const WalletProvider = ({ children }) => {
	return (
		<ThirdwebProvider
			activeChain={PulsechainTestnetV4}
			clientId="f893cbeb5baae2b8dc1e625df6d6e9da"
			locale={en()}
			supportedWallets={[
				metamaskWallet({ recommended: true }),
				coinbaseWallet(),
				walletConnect({ recommended: true }),
				// safeWallet({
				// 	personalWallets: [
				// 		metamaskWallet({ recommended: true }),
				// 		coinbaseWallet(),
				// 		walletConnect({ recommended: true }),
				// 		trustWallet(),
				// 		zerionWallet(),
				// 		rainbowWallet(),
				// 	],
				// }),
				trustWallet(),
				// zerionWallet(),
				// rainbowWallet(),
			]}

			dAppMeta={{
	
				name: "heart-heads.com",
				url: "https://heart-heads.com/",
				logoUrl: "../../assets/images/logo-new-2.svg",
				description: "HEART HEADS - Composable NFT's ,Mint items and create your unique heart head on PulseChain!",
				isDarkMode: true,
				
				/**
				 * optional - a description of your app
				 */
				/**
				 * optional - a url that points to a logo (or favicon) of your app
				 */
				/**
				 * optional - whether to show the connect dialog in darkmode or not
				 */
			}}
		>
			{children}
		</ThirdwebProvider>
	);
};

export default WalletProvider;
