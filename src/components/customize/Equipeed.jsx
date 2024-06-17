import { useDispatch, useSelector } from "react-redux";
import {
	EQUIPPTYPE,
	composeState,
	equippedAction,
} from "../../redux/reducers/composeSlice";
import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Typography,
} from "@mui/material";
import Slider from "react-slick";
import { capitalizeFirstLetter, getRarityName } from "../../utils";

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

const Equipeed = () => {
	const { equipped } = useSelector(composeState);
	const dispatch = useDispatch();

	const removeItem = (key) => {
		dispatch(
			equippedAction({
				key: key,
				value: null,
				reset: false,
				type: EQUIPPTYPE.REMOVE,
			})
		);
	};
	return (
		<div className="customazation-inner-block">
			<h2>Equipped</h2>
			<div className="customazation-inner-block-acco">
				{Object.keys(equipped)?.map((ele, index) => (
					<Accordion key={index}>
						<AccordionSummary
							aria-controls="panel12-content"
							id="panel2a-header"
						>
							<Typography>
								{capitalizeFirstLetter(ele)}
							</Typography>
						</AccordionSummary>
						<AccordionDetails>
							<div className="acco-details-block">
								<Slider {...settings}>
									<div onClick={() => removeItem(ele)}>
										<div className="acco-details-block-inner">
											<div className="acco-details-block-inner-color bg-yellow">
												<img
													src={equipped[ele]?.image}
												/>
												<button className="custom_btn fillBtn">
													{getRarityName(
														equipped[ele]
															?.attributes[1]
													)}
												</button>
											</div>
										</div>
									</div>
								</Slider>
							</div>
						</AccordionDetails>
					</Accordion>
				))}
			</div>
		</div>
	);
};

export default Equipeed;
