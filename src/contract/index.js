import { BigNumber, Contract, ethers } from "ethers";
import { CONTRACTS_BY_NETWORK, NetworkParams, Tokens } from "../constant";
import { toEth, toWei } from "../utils";
import SingleNFTABI from "../abis/SingleNFT.json";
import MultipleNFTABI from "../abis/MultipleNFT.json";
import TokenABI from "../abis/Token.json";

export function getContractInfo(name) {
	return CONTRACTS_BY_NETWORK?.[name];
}
export function getContractObj(name, provider) {
	var newProvider;
	if (!!provider) {
		newProvider = provider;
	} else {
		newProvider = new ethers.providers.JsonRpcProvider(
			NetworkParams?.rpcUrls[0]
		);
	}

	const info = getContractInfo(name);
	return !!info && new Contract(info.address, info.abi, newProvider);
}

// for heart-heads  contract  instance
export async function ComposeNft(uri, provider) {
	const ConposiblemintContract = getContractObj("ComposibleNft", provider);
	if (!ConposiblemintContract) return null;
	try {
		const tx = await ConposiblemintContract.safeMint(uri);
		const receipt = await tx.wait(1);
		if (receipt.confirmations) return true;
		return false;
	} catch (error) {
		console.error("error.message", error.message);
		return false;
	}
}

export async function ComposibleNftMint(mintCountCnf, amount, provider) {
	const ConposiblemintContract = getContractObj("ComposibleNft", provider);
	if (!ConposiblemintContract) return null;
	try {
		const tx = await ConposiblemintContract.safeMintWithRandomTokenURI(
			mintCountCnf,
			{
				value: toWei(mintCountCnf * amount, 18),
			}
		);
		await tx.wait(2);
		return true;
	} catch (error) {
		console.error("111onAddItemMintContract11", error.message);
		return error;
	}
}

export async function getComposibleNftMintAmount(provider) {
	const mintContract = getContractObj("ComposibleNft", provider);
	let amount = await mintContract.nftprice();
	let MintAmount = toEth(amount, 18);
	return MintAmount;
}

export async function getTotalrandomMint(provider) {
	const HeartHeadContract = getContractObj("ComposibleNft", provider);

	let totalrandommintNft = await HeartHeadContract.totalrandommint();
	let TotalMinted = totalrandommintNft.toNumber();

	return TotalMinted;
}

export async function HeartHeadWrappedContract(provider) {
	// make instance for HeartHeadWrapped contract for get all functions inside HeartHeadWrappedABI.
	const HeartHeadContract = getContractObj("HeartHeadWrapped", provider);
	return HeartHeadContract
}

export async function HeartHeadGovernanceContract(provider) {
	// make instance for HeartHeadGovernance contract for get all functions inside HeartHeadGovernanceABI.
	const HeartHeadContract = getContractObj("HeartHeadGovernance", provider);
	return HeartHeadContract
}

export async function HeartHeadRewardStakingContract(provider) {
	try{
		// make instance for HeartHeadRewardStakingContract contract for get all functions inside HeartHeadGovernanceABI.
		const HeartHeadContract = getContractObj("HeartHeadRewardStaking", provider);
		return HeartHeadContract

	}catch(err){
		console.log('HeartHeadRewardStakingContract 1612', err)
	}
}

// get single/multiple collection contract
export function getCollectionContract(type, address, provider) {
	var newProvider;
	if (!!provider) {
		newProvider = provider;
	} else {
		newProvider = new ethers.providers.JsonRpcProvider(
			NetworkParams.rpcUrls[0]
		);
	}
	if (type === "single") {
		return new Contract(address, SingleNFTABI, newProvider);
	} else if (type === "multi") {
		return new Contract(address, MultipleNFTABI, newProvider);
	}
	return new Contract(address, SingleNFTABI, newProvider);
}

export async function isNFTApproved(type, collection, to, account, provider) {
	const nftToken = getCollectionContract(type, collection, provider);
	if (!nftToken) return false;
	return await nftToken.isApprovedForAll(account, to);
}

export async function setNFTApproval(type, collection, to, provider) {
	const nftToken = getCollectionContract(type, collection, provider);

	if (!nftToken) return false;
	try {
		const tx = await nftToken.setApprovalForAll(to, true);
		await tx.wait(1);
		return true;
	} catch (e) {
		// console.log(e)
	}
	return false;
}

export async function approveNFTOnMarket(type, collection, account, provider) {
	try {
		let isApproved = await isNFTApproved(
			type,
			collection,
			CONTRACTS_BY_NETWORK.HexToysMarketV2.address,
			account,
			provider
		);
		if (isApproved) {
			console.log("isApproved", isApproved);
			return true;
		} else {
			isApproved = await setNFTApproval(
				type,
				collection,
				CONTRACTS_BY_NETWORK.HexToysMarketV2.address,
				provider
			);
			console.log("isApproved else", isApproved);

			if (isApproved) {
				return true;
			} else {
				return false;
			}
		}
	} catch (e) {
		console.log(e);
		return false;
	}
}

export function getTokenContract(address, provider) {
	if (!!provider) {
		return new Contract(address, TokenABI, provider);
	} else {
		const rpcProvider = new ethers.providers.JsonRpcProvider(
			NetworkParams.rpcUrls[0]
		);
		return new Contract(address, TokenABI, rpcProvider);
	}
}

export async function isTokenApproved(
	account,
	tokenAddr,
	amount,
	toAddr,
	provider
) {
	const tokenContract = getTokenContract(tokenAddr, provider);
	if (!tokenContract) return false;

	const decimal = await tokenContract.decimals();
	const allowance = await tokenContract.allowance(account, toAddr);
	if (BigNumber.from(toWei(amount, decimal)).gt(allowance)) {
		return false;
	}
	return true;
}

export async function approveToken(tokenAddr, toAddr, provider) {
	const tokenContract = getTokenContract(tokenAddr, provider);
	if (!tokenContract) return false;

	const approveAmount =
		"0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF";
	try {
		const approve_tx = await tokenContract.approve(toAddr, approveAmount);
		await approve_tx.wait(1);
		return true;
	} catch (e) {
		// console.log(e)
		return false;
	}
}

export async function buyNFT(
	account,
	collection,
	tokenId,
	productId,
	amount,
	price,
	tokenAddr,
	seller,
	nftType,
	_royaltyArray,
	_receiverArray,
	_signature,
	provider
) {
	const contract = getContractObj("HexToysMarketV2", provider);
	const contractInfo = getContractInfo("HexToysMarketV2");
	if (!contract || !contractInfo) return false;
	try {
		if (tokenAddr === "0x0000000000000000000000000000000000000000") {
			const tx = await contract.buyNFT(
				collection,
				tokenId,
				productId,
				amount,
				toWei(price, 18),
				tokenAddr,
				seller,
				nftType,
				_royaltyArray,
				_receiverArray,
				_signature,
				{
					value: toWei(price * amount, 18),
				}
			);
			await tx.wait(2);
			return true;
		} else {
			const Token = getTokenContract(tokenAddr, provider);
			if (!Token) return false;
			let tokenApproveStatus = await isTokenApproved(
				account,
				tokenAddr,
				price * amount,
				contractInfo.address,
				provider
			);
			if (!tokenApproveStatus) {
				tokenApproveStatus = await approveToken(
					tokenAddr,
					contractInfo.address,
					provider
				);
			}
			if (tokenApproveStatus) {
				const tx = await contract.buyNFT(
					collection,
					tokenId,
					productId,
					amount,
					toWei(price, 18),
					tokenAddr,
					seller,
					nftType,
					_royaltyArray,
					_receiverArray,
					_signature
				);
				await tx.wait(2);
				return true;
			}
			return false;
		}
	} catch (error) {
		// console.log(error)
		return false;
	}
}

// get payment curreny information
export function getCurrencyInfoFromAddress(address) {
	let filtered = Tokens.filter(
		(token) => token.address?.toLowerCase() === address?.toLowerCase()
	);
	if (filtered && filtered.length > 0) {
		return filtered[0];
	} else {
		return null;
	}
}
export function getCurrencyInfoFromSymbol(symbol) {
	let filtered = Tokens.filter(
		(token) => token.symbol?.toLowerCase() === symbol?.toLowerCase()
	);
	if (filtered && filtered.length > 0) {
		return filtered[0];
	} else {
		return null;
	}
}


export async function approveNFTToWrapped(type='single', collection, account, provider) {
	try {
		let isApproved = await isNFTApproved(
			type,
			collection,
			CONTRACTS_BY_NETWORK.HeartHeadWrapped.address,
			account,
			provider
		);
		if (isApproved) {
			console.log("isApproved", isApproved);
			return true;
		} else {
			isApproved = await setNFTApproval(
				type,
				collection,
				CONTRACTS_BY_NETWORK.HeartHeadWrapped.address,
				provider
			);
			console.log("isApproved else", isApproved);

			if (isApproved) {
				return true;
			} else {
				return false;
			}
		}
	} catch (e) {
		console.log("approveNFTToWrapped1612",e);
		return false;
	}
}


export async function approveRewardStaked(type='single', collection, account, provider) {
	try {
		let isApproved = await isNFTApproved(
			type,
			collection,
			CONTRACTS_BY_NETWORK.HeartHeadRewardStaking.address,
			account,
			provider
		);
		if (isApproved) {
			console.log("isApproved", isApproved);
			return true;
		} else {
			isApproved = await setNFTApproval(
				type,
				collection,
				CONTRACTS_BY_NETWORK.HeartHeadRewardStaking.address,
				provider
			);
			console.log("isApproved else", isApproved);

			if (isApproved) {
				return true;
			} else {
				return false;
			}
		}
	} catch (e) {
		console.log("approveRewardStaked 1612",e);
		return false;
	}
}