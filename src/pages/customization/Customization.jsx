import { useEffect, useState } from "react";
import axios from "axios";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";
import { apiEndPoint } from "../../routes/routes";
import "./customization.scss";
import Equipeed from "../../components/customize/Equipeed";
import Preview from "../../components/customize/Preview";
import Composable from "../../components/customize/Composable";

import GraphicsImg from "../../assets/images/graphics-img.png";
import GraphicsImgTwo from "../../assets/images/graphics-img-2.png";
import CatalogInventory from "../../components/Catalog_Inventory_Compose/CatalogInventory";

const Customization = () => {
	const { account } = useActiveWeb3React();

	const [composableName, setComposableName] = useState([]);
	const [loading, setLoading] = useState(false);

	const fetchComposableName = async () => {
		try {
			setLoading(true);
			const { data } = await axios.get(
				`${process.env.REACT_APP_API}/${apiEndPoint.GETUSERCOMPOSABLE_NAME}`,
				{
					params: {
						id: account,
					},
				}
			);
			setComposableName(data?.items);
		} catch (err) {
			console.log("err", err);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (!account) return;
		fetchComposableName();
	}, [account]);
	return (
		<div>
			<div className="customazation-main">
				{/* <HeaderCnft /> */}
				<div className="common-block-graphics">
					<img src={GraphicsImg} alt="" />
				</div>
				<div className="common-block-graphics-two">
					<img src={GraphicsImgTwo} alt="" />
				</div>
				<div className="customazation-inner">
					<Equipeed />
					<Preview />
					<div className="customazation-inner-block">
						<h2>Compose</h2>
						<div className="customazation-inner-block-acco">
							{composableName?.map(({ trait_type, _id }) => (
								<Composable trait_type={trait_type} key={_id} />
							))}
						</div>
					</div>
				</div>
				<CatalogInventory/>
			</div>
		</div>
	);
};

export default Customization;
