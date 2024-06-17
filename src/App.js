import React, { useContext, useEffect } from "react";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { styled } from "@mui/material";

import "./App.css";
import "antd/dist/antd.css";
import Header from "./components/shared/Header/Header";
import Footer from "./components/shared/Footer/Footer";
import ThemeContext from "./context/ThemeContext";
import clsx from "clsx";
import Catalog from "./pages/catalog_inventory_compose/Catalog";
import Home from "./pages/home/Home";
import Customization from "./pages/customization/Customization";
import Faq from "./pages/faq/faq";
import Explore from './pages/explore/explore';
import Inventory from "./pages/catalog_inventory_compose/Inventory";
import Compose from "./pages/catalog_inventory_compose/Compose";
import { Helmet } from "react-helmet";
import AOS from 'aos';
import 'aos/dist/aos.css';
import MyVotingPower from './pages/my_voting_power/myVotingPower';
import RewardStack from './pages/reward_stack/RewardStack';
import Voting from './pages/voting/Voting';
import ProposalList from "./pages/Proposal_list/Proposal";
import Competitions from './pages/Competitions/competitions';
import PreviousWinners from './pages/Previous-winners/previous-winners';
import ProposalCreate from "./pages/Proposal_create/ProposalCreate";
import VotingHistory from "./pages/voting_history/VotingHistory";
import Details from "./pages/catalog_nft_details/details";

export const TopBannerContainer = styled("div")`
	height: fit-content;
	min-height: 61px;
	width: 100%;
	border-bottom: 1px solid
		${(props) => (props.isDark ? "#383943" : "#e2e2e2")};
	background: ${(props) =>
		props.isDark ? "rgba(25, 28, 31, 0.8509803922)" : "white"};
	padding: 0px 10%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	@media screen and (max-width: 900px) {
		padding: 0px 5%;
	}
	@media screen and (max-width: 852px) {
		padding: 0px 20px;
	}
	@media screen and (max-width: 577px) {
		padding: 0px 10px;
	}
	max-width: 100%;
`;

function App() {
	const { theme } = useContext(ThemeContext);

	// useEagerConnect();
	window.onscroll = () => {
		let progressbar_pc = document.getElementById("progressbar_pc");
		let totalHeight = document.body.scrollHeight - window.innerHeight;
		let progressHeight = (window.pageYOffset / totalHeight) * 100;
		progressbar_pc.style.height = progressHeight + "%";

		let progressbar_mob = document.getElementById("progressbar_mob");
		// let totalWidth = document.body.scrollHeight - window.innerHeight;
		// let progressWidth = (window.pageXOffset / totalHeight) * 100;
		progressbar_mob.style.width = progressHeight + "%";

		return () => (window.onscroll = null);
	};
  
  useEffect(() => {
    AOS.init();
  }, [])

	return (
    <div className={clsx('App', `bg_${theme}`)}>
      <div id='progressbar_pc'></div>
      <div id='progressbar_mob'></div>

      <Helmet>
        <title>HEART HEADS - Composable NFT's</title>
        <meta
          content="HEART HEADS - Composable NFT's ,Mint items and create your unique heart head on PulseChain!"
          name='title'
        />
        <meta content="HEART HEADS -  Composable NFT's" name='description' />

        <meta
          content="HEART HEADS - Composable NFT's ,Mint items and create your unique heart head on PulseChain!"
          property='og:title'
        />
        <meta content="HEART HEADS -  Composable NFT's" property='og:description' />
        <meta content='https://heart-heads.com/' property='og:url' />
        <meta name='keywords' content='HEART HEADS, Mint items and create your unique heart head on PulseChain!' />
      </Helmet>
      <Toaster
        position='top-center'
        toastOptions={{
          success: { duration: 3000 },
          error: { duration: 3000 }
        }}
      />
      <Router>
        <Header />
        <Switch>
          <Route path='/' exact render={(props) => <Home {...props} />} />
          <Route path='/inventory' exact render={(props) => <Inventory {...props} />} />
          <Route path='/catalog' exact render={(props) => <Catalog {...props} />} />
          <Route path='/compose' exact render={(props) => <Compose {...props} />} />
          <Route path='/customization/:_id' exact render={(props) => <Customization {...props} />} />
          <Route path='/Faq' exact render={(props) => <Faq {...props} />} />
          <Route path='/explore' exact render={(props) => <Explore {...props} />} />
          <Route path='/my-voting-power' exact render={(props) => <MyVotingPower {...props} />} />
          <Route path='/voting/:id' exact render={(props) => <Voting {...props} />} />
          <Route path='/Staking' exact render={(props) => <RewardStack {...props} />} />
          <Route path='/proposal-list' exact render={(props) => <ProposalList {...props} />} />
          <Route path='/competitions' exact render={(props) => <Competitions {...props} />} />
          <Route path='/previous-winners' exact render={(props) => <PreviousWinners {...props} />} />
          <Route path='/proposal-create' exact render={(props) => <ProposalCreate {...props} />} />
          <Route path='/voting-history/:id' exact render={(props) => <VotingHistory {...props} />} />
          <Route path='/detail/:name' exact render={(props) => <Details {...props} />} />
        </Switch>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
