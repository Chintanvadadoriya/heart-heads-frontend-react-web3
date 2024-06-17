import { useParams } from "react-router-dom";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
	EQUIPPTYPE,
	composeNftAction,
	composeState,
	equippedAction,
} from "../../redux/reducers/composeSlice";
import { useEffect, useState } from "react";
import axios from "axios";
import { apiEndPoint } from "../../routes/routes";
import LoaderImg from "../../assets/images/loader-gif.gif";
import { useHistory } from "react-router-dom";

const Preview = () => {
	let { _id } = useParams();
	const { library } = useActiveWeb3React();
	const {
		equipped,
		file,
		preview,
		loading: contntractLoading,
		imageLoading
	} = useSelector(composeState);

	const dispatch = useDispatch();

	const [item, setItem] = useState();
	const [loading, setLoading] = useState(false);
	// const [canvas, setCanvas] = useState(false);

	// const canvasRef = useRef(null);
	const history = useHistory();
	const fetchItem = async () => {
		try {
			setLoading(true);
			const { data } = await axios.get(
				`${process.env.REACT_APP_API}/${apiEndPoint.GETITEM_BY_ID}`,
				{
					params: {
						_id: _id,
					},
				}
			);
			setItem(data?.item);
			console.log('data99', data)

			dispatch(
				equippedAction({
					reset: true,
					key: data?.item?.attributes[0].trait_type,
					value: {
						...data?.item,
						default: true,
					},
					type: EQUIPPTYPE.ADD,
				})
			);
		} catch (err) {
			console.log("err", err);
		} finally {
			setLoading(false);
		}
	};


	useEffect(() => {
		if (!_id) return;
		fetchItem();
	}, [_id]);

	const discard = () => {
		dispatch(
			equippedAction({
				key: null,
				value: null,
				reset: false,
				type: EQUIPPTYPE.DISCARD,
			})
		);
	};

	const compose = async () => {
		if(!item) {
			history.push('/inventory')
			return toast.error('item not found')
		}
		toast.error(
			"The heart-head you compose during v1 is for fun only and not for resale, you will retain all your items. In v2 you will be airdropped your items which are fully equippable and leave your inventory. v2 composed heart-heads can be traded and items equipped or unequipped!",
			{
				duration: 4000,
				icon: "ℹ️", // Custom info icon
				iconTheme: {
					primary: "#007bff", // Custom color for the info icon
					secondary: "#cce5ff", // Custom background color for the info icon
				},
			}
		);
		

		const result = await dispatch(
			composeNftAction({
				provider: library,
			})
		);
		if (result.type === "compose/composeNftAction/fulfilled") {
			//TODO: handle after nft mint
			toast.success('compose is successed!')
			history.push('/inventory')
		}else{
			toast.error('Rejected')
		}
	};

	console.log('item1612', item)
	console.log('preview', preview)

	return (
		<>
			<div className="customazation-inner-block">
				<div className="customazation-inner-block-middle">
					{imageLoading ? (
						<img className="loader" src={LoaderImg} alt="" />
					) : (
						<img src={preview || ""} alt="" />
					)}
					{/* <p>
						Rarity: <span>10%</span>
					</p> */}
				</div>
				<div className="btn-product">
					<button
						disabled={contntractLoading}
						onClick={compose}
						className="custom_btn fillBtn"
					>
						{contntractLoading ? "Loading.." : "Compose"}
					</button>
					<button onClick={discard} className="custom_btn fillBtn">
						Discard
					</button>
				</div>
				<div
					style={{
						color: "#fff",
						marginTop: "10px",
						textAlign: "center",
						fontWeight: "bold",
					}}
				>
					{/* <p>
						once these items are minted they can no longer be
						unequipped{" "}
					</p> */}
				</div>
			</div>
		</>
	);
};

export default Preview;
