import { useEffect, useState } from "react";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { useDispatch, useSelector } from "react-redux";
import {
	EQUIPPTYPE,
	composeState,
	equippedAction,
} from "../../redux/reducers/composeSlice";
import { apiEndPoint } from "../../routes/routes";
import axios from "axios";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Typography,
} from "@mui/material";
import { capitalizeFirstLetter } from "../../utils";
import Slider from "react-slick";

const settings = {
	dots: false,
	arrows: true,
	infinite: false,
	speed: 500,
	slidesToShow: 5,
	slidesToScroll: 5,
	responsive: [
		{
			breakpoint: 1850,
			settings: {
				slidesToShow: 4,
				slidesToScroll: 4
			}
		},
		{
			breakpoint: 1700,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 3
			}
		},
		{
			breakpoint: 1500,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 3
			}
		},
		{
			breakpoint: 1199,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 1
			}
		},
		{
			breakpoint: 991,
			settings: {
				slidesToShow: 5,
				slidesToScroll: 5
			}
		},
		{
			breakpoint: 767,
			settings: {
				slidesToShow: 3,
				slidesToScroll: 3
			}
		},
		{
			breakpoint: 400,
			settings: {
				slidesToShow: 2,
				slidesToScroll: 2
			}
		}
	]
};

const Composable = ({ trait_type }) => {
	const { account } = useActiveWeb3React();
	const { equipped } = useSelector(composeState);

	const dispatch = useDispatch();

	const [composable, setComposable] = useState([]);
	const [loading, setLoading] = useState(false);

	const addInEquip = (value) => {
		dispatch(
			equippedAction({
				key: trait_type,
				value,
				reset: false,
				type: EQUIPPTYPE.ADD,
			})
		);
	};

	const fetchComposable = async () => {
		try {
			setLoading(true);
			const { data } = await axios.get(
				`${process.env.REACT_APP_API}/${apiEndPoint.GETCOMPOSABLEBY_NAME}`,
				{
					params: {
						id: account,
						type: trait_type?.toLowerCase(),
					},
				}
			);
			setComposable(data?.items);
		} catch (err) {
			console.log("err", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!account || !trait_type) return;
		console.log("hear");
		fetchComposable();
	}, [account, trait_type]);

	console.log('composable', composable)
	return (
		<Accordion>
			<AccordionSummary
				aria-controls="panel1a-content"
				id="panel1a-header"
			>
				<Typography>{capitalizeFirstLetter(trait_type)}</Typography>
			</AccordionSummary>
			<AccordionDetails>
				<div className="acco-details-block">
					<Slider {...settings}>
						{composable?.map((ele) => (
							<div key={ele?.doc?._id} onClick={() => addInEquip(ele?.doc)}>
								<div className="acco-details-block-inner">
									<div className="acco-details-block-inner-color bg-yellow flex-auto-hover">
										{ele?.count >1?
											<>
											<div className="acco-details-block-inner-color-second">
											<div className="acco-details-block-inner-color-img">
											<img src={ele?.doc?.image} />
											<div className="acco-details-block-inner-color-img-second">
											<img src={ele?.doc?.image} />
											</div>
											</div>

											<p style={{ color: "white" }} className="count-text">{ele?.count}</p>
											<button className="custom_btn fillBtn">
												{equipped[trait_type]?.doc?._id ===
													ele?.doc?._id
													? "+ Equipped"
													: "+ Equip"}
											</button>
											</div>
											</>:
											<>
											<img src={ele?.doc?.image} />
											<p style={{ color: "white" }} className="count-text">{ele?.count}</p>
											<button className="custom_btn fillBtn">
												{equipped[trait_type]?.doc?._id ===
													ele?.doc?._id
													? "+ Equipped"
													: "+ Equip"}
											</button>:
											</>

										}
									</div>
								</div>
							</div>
						))}
					</Slider>
				</div>
			</AccordionDetails>
		</Accordion>
	);
};

export default Composable;
