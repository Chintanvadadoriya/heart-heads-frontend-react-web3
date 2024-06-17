import { useContext, useState } from "react";
import Querystring from "query-string";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import ThemeContext from "../../context/ThemeContext";
import { Tokens } from "../../constant";
import toast from "react-hot-toast";
import { approveNFTOnMarket, getCurrencyInfoFromAddress } from "../../contract";
import Modal from "react-modal";

import axios from "axios";
import * as Element from "./style";
import { CircularProgress } from "@mui/material";
import { sleep } from "../../utils";
import Button from "../Widgets/CustomButton";

const ModalListFixPrice = (props) => {
	const { account, library } = useActiveWeb3React();
	const {
		item,
		// available,
		showPutMarketPlace,
		setShowPutMarketPlace,
		handleCancle,
	} = props;
	const { theme } = useContext(ThemeContext);

	const [listingStatus, setListingStatus] = useState(false);
	const [creatingAuctionStatus, setCreatingAuctionStatus] = useState(false);

	const [putType, setPutType] = useState("fixed");
	const [putPrice, setPutPrice] = useState(0);
	const [quantity, setQuantity] = useState("1");
	const [currencyInfo, setCurrencyInfo] = useState(Tokens[0]);

	async function putFixed() {
		// quantity
		if (putPrice <= 0) {
			toast.error("Please input price correctly!");
			return;
		}
		if (
			quantity < 1
			// || quantity > available
		) {
			toast.error("Please input quantity correctly!");
			return;
		}
		setListingStatus(true);

		// check out nft approved status;
		const approve_toast_id = toast.loading("Checking approval...");
		const approvedStatus = await approveNFTOnMarket(
			item.type,
			item.itemCollection,
			account,
			library
		);
		toast.dismiss(approve_toast_id);
		if (!approvedStatus) {
			toast.error("Approval failed!");
			setListingStatus(false);
			return;
		}

		// generate signature
		const sign_toast_id = toast.loading("Signing...");
		const signature = await library.signMessage(
			`I want to create pair with this information: ${item.itemCollection}:${item.tokenId}:${currencyInfo.address}:${quantity}:${putPrice}:${account}`
		);
		toast.dismiss(sign_toast_id);
		if (!signature) {
			toast.error("Signing failed!");
			setListingStatus(false);
			return;
		}

		// call create_pair backend api
		const api_toast_id = toast.loading("NFT Listing...");
		const { data } = await axios.post(
			`${process.env.REACT_APP_API}/market/create_pair`,
			Querystring.stringify({
				itemCollection: item.itemCollection,
				tokenId: item.tokenId,
				tokenAdr: currencyInfo.address,
				amount: quantity,
				price: putPrice,
				owner: account,
				signature: signature,
			})
		);

		toast.dismiss(api_toast_id);
		if (data.status) {
			// success
			setListingStatus(false);
			setShowPutMarketPlace(false);
			toast.success("List Success!");
			await sleep(2000);
			window.location.reload();
		} else {
			setListingStatus(false);
			toast.error(data.message);
		}
	}

	return (
		<>
			{item && account && (
				// available > 0
				<Modal
					isOpen={showPutMarketPlace}
					onRequestClose={() => setShowPutMarketPlace(false)}
					ariaHideApp={false}
					style={{
						overlay: {
							position: "fixed",
							display: "flex",
							justifyContent: "center",
							top: "0",
							left: "0",
							width: "100%",
							height: "100%",
							backgroundColor: "rgba(0,0,0, .8)",
							overflowY: "auto",
							zIndex: 99,
						},
						content: {
							top: "50%",
							left: "50%",
							right: "auto",
							bottom: "auto",
							marginRight: "-50%",
							transform: "translate(-50%, -50%)",
							width: "95%",
							maxWidth: "500px",
							maxHeight: "600px",
							borderRadius: "20px",
							backgroundColor:
								theme === "dark" ? "#060714" : "#fff",
							borderColor: theme === "dark" ? "#060714" : "#fff",
							zIndex: 9999,
						},
					}}
				>
					<Element.ModalBody>
						<Element.ModalHeader>
							<Element.ModalCloseIcon
								className={`text_color_1_${theme}`}
								size={32}
								onClick={() => setShowPutMarketPlace(false)}
							/>
						</Element.ModalHeader>
						<Element.ModalTitle className={`text_color_1_${theme}`}>
							Put on Marketplace
						</Element.ModalTitle>
						{item?.type === "single" && (
							<Element.PutTypes>
								<Element.PutType
									className={
										putType === "fixed" ? "active" : ""
									}
								>
									<div className={`content bg_${theme}`}>
										<Element.FixedIcon
											size={32}
											className={`text_color_1_${theme}`}
										/>
										<Element.TypeLabel
											className={`text_color_4_${theme}`}
										>
											Fixed price
										</Element.TypeLabel>
									</div>
								</Element.PutType>
							</Element.PutTypes>
						)}

						<Element.Field>
							<Element.Label className={`text_color_1_${theme}`}>
								Price
							</Element.Label>
							<Element.InputContainer
								className={`border_${theme}`}
							>
								<Element.Input
									type={"number"}
									placeholder={"Enter Price"}
									value={putPrice}
									onChange={(event) =>
										setPutPrice(event.target.value)
									}
								/>
								<Element.CurrencySelect
									className={`text_color_1_${theme}`}
									name={"currencies"}
									defaultValue={currencyInfo.address}
									onChange={(event) =>
										setCurrencyInfo(
											getCurrencyInfoFromAddress(
												event.target.value
											)
										)
									}
								>
									{Tokens.map((currencyItem, index) => (
										<Element.OrderByOption
											className={`border_${theme}`}
											key={index}
											value={currencyItem.address}
										>
											{currencyItem.symbol}
										</Element.OrderByOption>
									))}
								</Element.CurrencySelect>
							</Element.InputContainer>
							{item.type === "multi" && (
								<>
									{/* <Element.Label>
										Enter quantity{" "}
										<span>({available} available)</span>
									</Element.Label> */}
									<Element.Input
										value={quantity}
										type={"number"}
										className={`border_${theme}`}
										onChange={(e) => {
											setQuantity(
												Math.floor(e.target.value)
											);
										}}
										placeholder={"Enter quantity"}
									/>
								</>
							)}
						</Element.Field>

						<Element.ModalActions>
							<Button
								label="Cancel"
								greyColor
								roundFull
								w_full
								onClick={() => setShowPutMarketPlace(false)}
							/>
							<Button
								label={
									listingStatus || creatingAuctionStatus ? (
										<CircularProgress
											style={{
												width: "16px",
												height: "16px",
												color: "white",
											}}
										/>
									) : (
										"Confirm"
									)
								}
								fillBtn
								roundFull
								w_full
								onClick={() => putFixed()}
								disabled={
									listingStatus || creatingAuctionStatus
								}
							/>
						</Element.ModalActions>
					</Element.ModalBody>
				</Modal>
			)}
		</>
	);
};

export default ModalListFixPrice;
