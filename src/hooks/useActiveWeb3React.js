import {
	NATIVE_TOKEN_ADDRESS,
	useAddress,
	useBalance,
	useChain,
	useConnect,
	useDisconnect,
	useSDK,
	useSigner,
	useSwitchChain,
	useWallet,
} from "@thirdweb-dev/react";
import { pulsechain } from "../utils";

export function useActiveWeb3React() {
	const connect = useConnect();
	const disconnect = useDisconnect();

	const chain = useChain();
	const address = useAddress();
	const library = useSigner();
	const switchNetwork = useSwitchChain();
	const sdk = useSDK();
	const { data: balance, error } = useBalance(NATIVE_TOKEN_ADDRESS);

	// console.log(address)
	// console.log("balance NATIVE_TOKEN_ADDRESS", balance);
	// console.log("error1612199", error);
	// console.log("chain", chain);
	// console.log("walletInstance", walletInstance);
	// console.log("library", library);
	if (address && chain && chain.chainId) {
		return {
			activate: connect,
			deactivate: disconnect,
			account: address,
			chainId: chain.chainId,
			active: true,
			library: library,
			error: error,
			balance:
				+balance?.displayValue < 10
					? +parseFloat(balance?.displayValue || 0).toFixed(4)
					: +parseInt(balance?.displayValue || 0),
			switchNetwork, //switchNetwork(id)
			sdk: sdk,
		};
	} else {
		return {
			activate: connect,
			deactivate: disconnect,
			account: null,
			chainId: null,
			active: false,
			library: null,
			error: null,
			balance: null,
			// chains: [],
			switchNetwork: () => {},
			sdk: null,
		};
	}
}
