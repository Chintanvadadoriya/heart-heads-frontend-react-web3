import ComposibleNftABI from "../abis/HeartHeads.json";
import HexToysMarketV2ABI from "../abis/HexToysMarketV2.json";
import HeartHeadGovernanceABI from "../abis/HeartHeadGovernance.json";
import HeartHeadWrappedABI from "../abis/HeartHeadWrapped.json";
import HeartHeadRewardStakingABI from "../abis/HeartHeadStaking.json"


export const chainTypeId={
	testPulseChain:943,
	pulseChain:369
}

export const NetworkParams = {
	chainId: 943,
	chainName: "Pulse Chain Testnet V4",
	nativeCurrency: {
		name: "Pulse Chain Testnet V4",
		symbol: "tPLS",
		decimals: 18,
	},
	rpcUrls: ["https://rpc.v4.testnet.pulsechain.com/"],
	blockExplorerUrls: ["https://scan.pulsechain.com"],
};


// export const NetworkParams = {
// 	id: 369,
// 	network: "pulsechain",
// 	name: "PulseChain",
// 	nativeCurrency: { name: "Pulse", symbol: "PLS", decimals: 18 },
// 	testnet: false,
// 	rpcUrls: ["https://pulsechain.publicnode.com/","https://rpc.pulsechain.com/"],
// 	blockExplorers: {
// 		default: {
// 			name: "PulseScan",
// 			url: "https://scan.pulsechain.com",
// 		},
// 	}
// };


export const CONTRACTS_BY_NETWORK = {
	HexToysMarketV2: {
		address: process.env.REACT_APP_API_MARKET_PLACE_V2,
		abi: HexToysMarketV2ABI,
	},
	ComposibleNft: {
		address: process.env.REACT_APP_API_ITEM_COLLECTION_ADDRESS,
		abi: ComposibleNftABI,
	},
	HeartHeadWrapped: {
		address: process.env.REACT_APP_API_HEARTHEAD_WRAPPED_ADDRESS,
		abi: HeartHeadWrappedABI,
	},
	HeartHeadGovernance: {
		address: process.env.REACT_APP_API_HEARTHEAD_GOVERNANCE_ADDRESS,
		abi: HeartHeadGovernanceABI,
	},
	HeartHeadRewardStaking: {
		address: process.env.REACT_APP_API_HEARTHEAD_REWARD_STAKEING_ADDRESS,
		abi: HeartHeadRewardStakingABI,
	},
	
};


export const Tokens = [
	{
		name: "PulseChain",
		symbol: "PLS",
		address: "0x0000000000000000000000000000000000000000",
		decimals: 18,
		logoURI:
			"https://tokens.app.pulsex.com/images/tokens/0xA1077a294dDE1B09bB078844df40758a5D0f9a27.png",
	},
	{
		name: "Wrapped Pulse",
		symbol: "WPLS",
		address: "0xa1077a294dde1b09bb078844df40758a5d0f9a27",
		decimals: 18,
		logoURI:
			"https://tokens.app.pulsex.com/images/tokens/0xA1077a294dDE1B09bB078844df40758a5D0f9a27.png",
	},
	// {
	// 	name: "Pepe",
	// 	symbol: "PEPE",
	// 	address: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
	// 	decimals: 18,
	// 	logoURI:
	// 		"https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x6982508145454Ce325dDbE47a25d4ec3d2311933/logo.png",
	// },
	{
		name: "Dai Stablecoin from Ethereum",
		symbol: "DAI",
		address: "0xefd766ccb38eaf1dfd701853bfce31359239f305",
		decimals: 18,
		logoURI:
			"https://tokens.app.pulsex.com/images/tokens/0xefD766cCb38EaF1dfd701853BFCe31359239F305.png",
	},
	{
		name: "Wrapped BTC",
		symbol: "WBTC",
		address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
		decimals: 8,
		logoURI:
			"https://tokens.app.pulsex.com/images/tokens/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599.png",
	},
	{
		name: "PulseX",
		symbol: "PLSX",
		address: "0x95b303987a60c71504d99aa1b13b4da07b0790ab",
		decimals: 18,
		logoURI:
			"https://tokens.app.pulsex.com/images/tokens/0x95B303987A60C71504D99Aa1b13B4DA07b0790ab.png",
	},
	{
		name: "USD Coin from Ethereum",
		symbol: "USDC",
		address: "0x15d38573d2feeb82e7ad5187ab8c1d52810b1f07",
		decimals: 6,
		logoURI:
			"https://tokens.app.pulsex.com/images/tokens/0x15D38573d2feeb82e7ad5187aB8c1D52810B1f07.png",
	},
	{
		name: "HEX",
		symbol: "HEX",
		address: "0x2b591e99afe9f32eaa6214f7b7629768c40eeb39",
		decimals: 8,
		logoURI:
			"https://tokens.app.pulsex.com/images/tokens/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39.png",
	},
	{
		name: "Wrapped Ether from Ethereum",
		symbol: "WETH",
		address: "0x02dcdd04e3f455d838cd1249292c58f3b79e3c3c",
		decimals: 18,
		logoURI:
			"https://tokens.app.pulsex.com/images/tokens/0x02DcdD04e3F455D838cd1249292C58f3B79e3C3C.png",
	},
	{
		name: "Incentive",
		symbol: "INC",
		address: "0x2fa878ab3f87cc1c9737fc071108f904c0b0c95d",
		decimals: 18,
		logoURI:
			"https://tokens.app.pulsex.com/images/tokens/0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d.png",
	},
	{
		name: "Tether USD from Ethereum",
		symbol: "USDT",
		address: "0x0cb6f5a34ad42ec934882a05265a7d5f59b51a2f",
		decimals: 6,
		logoURI:
			"https://tokens.app.pulsex.com/images/tokens/0x0Cb6F5a34ad42ec934882A05265A7d5F59b51A2f.png",
	},
];
