import { useHistory,useLocation } from "react-router-dom";
import { Box, Button, Modal } from "@mui/material";
import Lottie from "react-lottie";
import Slider from "react-slick";

import animationData from "../../lotties/party-confetti-2.json";
import {
	capitalizeFirstLetter,
	getRarityClass,
	getRarityName,
	getRaritySrc,
} from "../../utils";
import { useSelector } from "react-redux";
import { recenetState } from "../../redux/reducers/recentlyMintSlice";
import { TwitterShareButton, XIcon } from "react-share";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4,
};


// const items=[
// 	{
// 		"_id": {
// 		  "$oid": "6588f9d92294aa22eabb2304"
// 		},
// 		"likeCount": 0,
// 		"likes": [],
// 		"marketList": [],
// 		"isSynced": true,
// 		"isThumbSynced": false,
// 		"isAnimSynced": false,
// 		"visibility": true,
// 		"isETH": false,
// 		"usdPrice": 0,
// 		"id": "0xd55db7cb58543518e6762567cb7ce0ce37469ddc-2",
// 		"timestamp": 1703251929,
// 		"blockNumber": 18152295,
// 		"itemCollection": "0xd55db7cb58543518e6762567cb7ce0ce37469ddc",
// 		"tokenId": "2",
// 		"type": "single",
// 		"uri": "https://ipfs.io/ipfs/QmaPCPYnVLvGaSrepJQEaeeJeCobJitReRNxCLwXe4aG1M/1.json",
// 		"name": "Modern",
// 		"description": "Heart-Head Base",
// 		"image": "https://ipfs.io/ipfs/QmQVnLBF24qsT8HEUxDwy3ARqg2Vr3hVmiu3dJUcEtntZv",
// 		"animation_url": "https://ipfs.io/ipfs/QmQVnLBF24qsT8HEUxDwy3ARqg2Vr3hVmiu3dJUcEtntZv",
// 		"asset_type": "image",
// 		"attributes": [
// 		  {
// 			"_id": {
// 			  "$oid": "6589066f2294aa22eabb6cb5"
// 			},
// 			"trait_type": "base",
// 			"value": "Modern"
// 		  },
// 		  {
// 			"_id": {
// 			  "$oid": "6589066f2294aa22eabb6cb6"
// 			},
// 			"trait_type": "rarity",
// 			"value": "Common"
// 		  },
// 		  {
// 			"_id": {
// 			  "$oid": "6589066f2294aa22eabb6cb7"
// 			},
// 			"trait_type": "composed",
// 			"value": "false"
// 		  }
// 		],
// 		"holders": [
// 		  {
// 			"_id": {
// 			  "$oid": "6588fb1b2294aa22eabb4823"
// 			},
// 			"address": "0xb4b6ab108db5297ee2dfa000d1b36ee21d1bb471",
// 			"balance": 2
// 		  }
// 		],
// 		"__v": 0,
// 		"isdelist": false
// 	  }
// ]

const MintSuccessModel = ({ open, handleClose, item, handleSell }) => {
	const history = useHistory();
    const location = useLocation();
	const { items, loading } = useSelector(recenetState);

	const defaultOptions = {
		loop: false,
		autoplay: true,
		animationData: animationData,
		rendererSettings: {
			preserveAspectRatio: "xMidYMid slice",
		},
	};
	const settings = {
		dots: true,
		arrows: true,
		infinite: false,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
	};


	return (
		<Modal
			open={open}
			onClose={handleClose}
			className="modal-congulation"
			aria-labelledby="child-modal-title"
			aria-describedby="child-modal-description"
		>
			<div className="modal-congulation-inner">
				<div className="modal-congulation-inner-banner">
					<Lottie
						options={defaultOptions}
						height={400}
						width={400}
						className="lottie-modal-animation"
					/>
				</div>
				<Box sx={{ ...style }} className="box-modal">
					<h2 id="child-modal-title" className="title-text">
						Congratulations
					</h2>
					<div className="box-modal-inner">
						<Slider {...settings}>
							{items?.map((item) => {
								const classAdd =
									item
										?.attributes[1];
								// const name =
								// 	item
								// 		?.attributes[0];
								return (<div key={item?._id}>
									<div className="modal-product-block">
										<div className="modal-product-block-inner">
											<div className="common-tabs-inner">
												<div className="img-block">
													<img
														src={item?.image}
														alt=""
													/>
													<div
														className={`category-block-gif ${getRarityClass(
															classAdd
														)}`}
													>
														<img
															src={getRaritySrc(
																classAdd
															)}
															alt=""
														/>
														<span>
															{getRarityName(
																classAdd
															)}
														</span>
													</div>
												</div>
												<div className="content-block-category">
													<h4>{item?.name}</h4>
													<div className="content-block-category-inner flex-diff">
														<p>Category:</p>
														<span>
															{capitalizeFirstLetter(
																item
																	?.attributes[0]
																	?.trait_type
															)}
														</span>
													</div>
												</div>
												<Button
													class="border-button"
													onClick={() =>
														history.push(
															`/customization/${item?._id}`
														)
													}
												>
													<p className="button-text">
														<span>Equip</span>
													</p>
												</Button>
												<Button
													onClick={() =>
														handleSell(item)
													}
													class="border-button"
												>
													<p className="button-text">
														<span>Sell</span>
													</p>
												</Button>
												<Button class="border-button">
													<TwitterShareButton
														title={`I Just minted this ${item.attributes[1].value} ${item.name} on heart-heads.com \n`}
														hashtags={[`HEX`,`PulseChain`,`HeartHeads`]}
														onClick={handleClose}
														style={{width:"100%",height:"100%"}}
													    url={`page URL:${process.env.REACT_APP_BASE_URL}${location.pathname} \n`}
														>
														<p className="button-text">
															<span  >Share</span>
														</p>
													</TwitterShareButton>
												</Button>
											</div>
										</div>
									</div>
								</div>)
							})}
						</Slider>
						<div className="close-modal">
							<Button onClick={handleClose}>
								<svg
									width="15"
									height="14"
									viewBox="0 0 15 14"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M13.7887 11.9617C13.9649 12.1379 14.0638 12.3767 14.0638 12.6258C14.0638 12.8749 13.9649 13.1137 13.7887 13.2899C13.6126 13.466 13.3737 13.5649 13.1247 13.5649C12.8756 13.5649 12.6367 13.466 12.4606 13.2899L7.50045 8.32814L2.53874 13.2883C2.36262 13.4644 2.12374 13.5634 1.87467 13.5634C1.6256 13.5634 1.38673 13.4644 1.21061 13.2883C1.03449 13.1122 0.935547 12.8733 0.935547 12.6242C0.935547 12.3752 1.03449 12.1363 1.21061 11.9602L6.17233 7.00002L1.21217 2.0383C1.03605 1.86218 0.937109 1.62331 0.937109 1.37423C0.937109 1.12516 1.03605 0.886291 1.21217 0.710171C1.38829 0.534051 1.62716 0.435107 1.87624 0.435107C2.12531 0.435107 2.36418 0.534051 2.5403 0.710171L7.50045 5.67189L12.4622 0.70939C12.6383 0.533269 12.8772 0.434326 13.1262 0.434326C13.3753 0.434326 13.6142 0.533269 13.7903 0.70939C13.9664 0.88551 14.0654 1.12438 14.0654 1.37345C14.0654 1.62252 13.9664 1.86139 13.7903 2.03751L8.82858 7.00002L13.7887 11.9617Z"
										fill="white"
									/>
								</svg>
							</Button>
						</div>
					</div>
				</Box>
			</div>
		</Modal>
	);
};

export default MintSuccessModel;
