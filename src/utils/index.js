import axios from "axios";
import DiamondGif from "../assets/images/diamond-icon.gif";
import RubyGif from "../assets/images/ruby-gif.gif";
import OpalGif from "../assets/images/opal-icon-gif.gif";
import EmeraldIcon from "../assets/images/emerald-gif.gif";
import RareSrc from "../assets/images/citrine-gif.gif";
import SpecialSrc from "../assets/images/special.gif";

import { ethers } from "ethers";
import { getCollectionContract } from "../contract";
import moment from "moment";

export const getIpfsHash = async (data) => {
	try {
		const response = await axios.post(
			"https://api.pinata.cloud/pinning/pinJSONToIPFS",
			data,
			{
				headers: {
					pinata_api_key: process.env.REACT_APP_PINATA_KEY,
					pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET,
				},
			}
		);
		console.log("response1111", response);
		return response.data.IpfsHash;
	} catch (error) {
		console.error(error);
		console.log("getIpfsHash", getIpfsHash);
		throw error;
	}
};

export const getIpfsHashFromFile = async (file) => {
	try {
		const formData = new FormData();
		formData.append("file", file);

		const response = await axios.post(
			"https://api.pinata.cloud/pinning/pinFileToIPFS",
			formData,
			{
				maxContentLength: "Infinity",
				headers: {
					pinata_api_key: process.env.REACT_APP_PINATA_KEY,
					pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET,
					"Content-Type": `multipart/form-data;boundary=${formData._boundary}`, // Set appropriate content-type headers for FormData
				},
			}
		);

		return response.data.IpfsHash;
	} catch (error) {
		console.error(error);
		console.log("getipfsHashFormfile", error);
		throw error;
	}
};

export const convertToPinataLinks = (imageLinks) => {
	return imageLinks.map((link) => {
		const hash = link.split("ipfs/")[1];
		return `https://gateway.pinata.cloud/ipfs/${hash}`;
	});
};

export const getTimeAgo = (timestamp) => {
	const currentTimestamp = new Date().getTime();

	const distanceToDate = currentTimestamp - timestamp * 1000;
	let months = Math.floor(distanceToDate / (1000 * 60 * 60 * 24 * 30));
	let days = Math.floor(
		(distanceToDate % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)
	);
	let hours = Math.floor(
		(distanceToDate % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
	);
	let minutes = Math.floor((distanceToDate % (1000 * 60 * 60)) / (1000 * 60));
	let seconds = Math.floor((distanceToDate % (1000 * 60)) / 1000);
	if (months > 0) {
		return `${months}months ago`;
	} else if (days > 0) {
		return `${days}days ago`;
	} else if (hours > 0) {
		return `${hours}hours ago`;
	} else if (minutes > 0) {
		return `${minutes}mins ago`;
	} else if (seconds > 0) {
		return `${seconds}s ago`;
	}
};

export function capitalizeFirstLetter(str) {
	return str?.charAt(0).toUpperCase() + str?.slice(1);
}

export function getRarityClass(attributes) {
	switch (attributes?.value || attributes) {
		case "Rare":
			return "ruby-bg"; // need to change Rare bg class colour, right now bg is God Tier class
		case "Legendary":
			return "legendary-bg";
		case "Ultra Rare":
			return "rare-bg";
		case "Common":
			return "common-bg";
		case "God Tier":
			return "ruby-bg";
		case "Special":
			return "special-bg";
		default:
			return;
	}
}

export function getRaritySrc(attributes) {
	switch (attributes?.value || attributes) {
		case "Rare": // or God Tier
			return RareSrc;
		case "Legendary":
			return OpalGif;
		case "Ultra Rare":
			return EmeraldIcon;
		case "God Tier":
			return RubyGif;
		case "Common":
			return DiamondGif;
		case "Special":
			return SpecialSrc;
		default:
			return;
	}
}

export function getRarityName(attributes) {
	switch (attributes?.value) {
		case "Rare":
			return "Rare"; //God Tier
		case "Legendary":
			return "Legendary";
		case "Ultra Rare":
			return "Ultra Rare";
		case "Common":
			return "Common";
		case "God Tier":
			return "God Tier";
		case "Special":
			return "Special";
		default:
			return;
	}
}

export function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

export function isAddress(address) {
	try {
		ethers.utils.getAddress(address);
	} catch (e) {
		return false;
	}
	return true;
}

export function toEth(amount, decimal) {
	let data = (ethers.utils.formatUnits(String(amount), decimal))
	let valueAmount = (+data).toFixed(2)
	return valueAmount
}

export function toWei(amount, decimal) {
	return ethers.utils.parseUnits(String(amount), decimal);
}

export const sleep = (ms) => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

export function formatNum(value) {
	let intValue = Math.floor(value);
	if (intValue < 10) {
		return "" + parseFloat(value).toPrecision(2);
	} else if (intValue < 1000) {
		return "" + intValue;
	} else if (intValue < 1000000) {
		return parseFloat(intValue / 1000).toFixed(1) + "K";
	} else if (intValue < 1000000000) {
		return parseFloat(intValue / 1000000).toFixed(1) + "M";
	} else {
		return parseFloat(intValue / 1000000000).toFixed(1) + "B";
	}
}

export function formatAddress(address) {
	const prefix = address?.slice(0, 6) || " ";
	const suffix = address?.slice(-4);

	return `${prefix}...${suffix}` || " ";
}

export async function transferMultiItem(
	collection,
	from,
	to,
	tokenId,
	amount,
	provider
) {
	const nftToken = getCollectionContract("multi", collection, provider);
	var data = [];
	try {
		const tx = await nftToken.safeTransferFrom(
			from,
			to,
			tokenId,
			amount,
			data
		);
		await tx.wait(1);

		return true;
	} catch (e) {
		// console.log(e);
		return false;
	}
}

export async function transferSingleItem(
	collection,
	from,
	to,
	tokenId,
	provider
) {
	const nftToken = getCollectionContract("single", collection, provider);

	try {
		const tx = await nftToken?.transferFrom(from, to, tokenId);
		await tx.wait(1);

		return true;
	} catch (e) {
		console.log("1612199", e);
		return false;
	}
}

export async function sendNFT(
	collection,
	type,
	from,
	to,
	tokenId,
	amount,
	provider
) {


	const result = await transferSingleItem(
		collection,
		from,
		to,
		tokenId,
		provider
	);
	return result;

}

export function formatTimestamp(timestamp) {
	// Convert the timestamp to milliseconds
	const timestampInMilliseconds = timestamp * 1000;

	// Use moment to format the timestamp
	const formattedDate = moment(timestampInMilliseconds).format('MMM D, HH:mm');

	return formattedDate;
}

export const shorter = (str) =>
	str?.length > 8 ? str.slice(0, 6) + '...' + str.slice(-4) : str

export const Tokens = [
	{
		name: "PulseChain",
		symbol: "PLS",
		address: "0x0000000000000000000000000000000000000000",
		decimals: 18,
		logoURI: "https://tokens.app.pulsex.com/images/tokens/0xA1077a294dDE1B09bB078844df40758a5D0f9a27.png"
	},
	{
		name: "Wrapped Pulse",
		symbol: "WPLS",
		address: "0xa1077a294dde1b09bb078844df40758a5d0f9a27",
		decimals: 18,
		logoURI: "https://tokens.app.pulsex.com/images/tokens/0xA1077a294dDE1B09bB078844df40758a5D0f9a27.png"
	},
	{
		name: "Pepe",
		symbol: "PEPE",
		address: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
		decimals: 18,
		logoURI: "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x6982508145454Ce325dDbE47a25d4ec3d2311933/logo.png"
	},
	{
		name: "Dai Stablecoin from Ethereum",
		symbol: "DAI",
		address: "0xefd766ccb38eaf1dfd701853bfce31359239f305",
		decimals: 18,
		logoURI: "https://tokens.app.pulsex.com/images/tokens/0xefD766cCb38EaF1dfd701853BFCe31359239F305.png"
	},
	{
		name: "Wrapped BTC",
		symbol: "WBTC",
		address: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
		decimals: 8,
		logoURI: "https://tokens.app.pulsex.com/images/tokens/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599.png"
	},
	{
		name: "PulseX",
		symbol: "PLSX",
		address: "0x95b303987a60c71504d99aa1b13b4da07b0790ab",
		decimals: 18,
		logoURI: "https://tokens.app.pulsex.com/images/tokens/0x95B303987A60C71504D99Aa1b13B4DA07b0790ab.png"
	},
	{
		name: "USD Coin from Ethereum",
		symbol: "USDC",
		address: "0x15d38573d2feeb82e7ad5187ab8c1d52810b1f07",
		decimals: 6,
		logoURI: "https://tokens.app.pulsex.com/images/tokens/0x15D38573d2feeb82e7ad5187aB8c1D52810B1f07.png"
	},
	{
		name: "HEX",
		symbol: "HEX",
		address: "0x2b591e99afe9f32eaa6214f7b7629768c40eeb39",
		decimals: 8,
		logoURI: "https://tokens.app.pulsex.com/images/tokens/0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39.png"
	},
	{
		name: "Wrapped Ether from Ethereum",
		symbol: "WETH",
		address: "0x02dcdd04e3f455d838cd1249292c58f3b79e3c3c",
		decimals: 18,
		logoURI: "https://tokens.app.pulsex.com/images/tokens/0x02DcdD04e3F455D838cd1249292C58f3B79e3C3C.png"
	},
	{
		name: "Incentive",
		symbol: "INC",
		address: "0x2fa878ab3f87cc1c9737fc071108f904c0b0c95d",
		decimals: 18,
		logoURI: "https://tokens.app.pulsex.com/images/tokens/0x2fa878Ab3F87CC1C9737Fc071108F904c0B0C95d.png"
	},
	{
		name: "Tether USD from Ethereum",
		symbol: "USDT",
		address: "0x0cb6f5a34ad42ec934882a05265a7d5f59b51a2f",
		decimals: 6,
		logoURI: "https://tokens.app.pulsex.com/images/tokens/0x0Cb6F5a34ad42ec934882A05265A7d5F59b51A2f.png"
	},
]


// get payment curreny information
export function getCurrencyInfoFromAddress(address) {
	let filtered = Tokens.filter(token => token?.address?.toLowerCase() === address?.toLowerCase())
	if (filtered && filtered?.length > 0) {
		return filtered[0];
	} else {
		return null;
	}
}

// convert wei to PLS

export function convertWerToPLS(amount) {
	let plsamount = (amount / 10000000000000000000).toFixed(2)
	return plsamount
}

// pogressbar remaining time show parcentage

export function remainingTimePercentage(enddate,startdate){
	const currentTime = Date.now(); // Current time in milliseconds
	const endTime = new Date(enddate).getTime()*1000; // End time in milliseconds assuming `enddate` is a valid date string or timestamp
	const startTime = new Date(startdate).getTime()*1000;

	const totalDuration = endTime - startTime;

	const remainingTime = endTime-currentTime;

	const progressPercentage = ((totalDuration - remainingTime) / totalDuration) * 100;

	// Set the progress percentage
	return progressPercentage.toFixed(1)
}

 

