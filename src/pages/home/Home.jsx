import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import axios from "axios";

import {
    ComposibleNftMint,
    HeartHeadGovernanceContract,
    HeartHeadWrappedContract,
    getComposibleNftMintAmount,
    getTotalrandomMint,
} from "../../contract";
import { apiEndPoint } from "../../routes/routes";

import HomeBanner from "../../assets/images/banner-home.png";
import HomeBannerMobile from "../../assets/images/banner-home-mobile.png";
import HomeBannerInnerTwo from "../../assets/images/home-banner-inner-2.png";

import HomeBannerInner from "../../assets/images/home-banner-inner.png";
import FrameCategory from "../../assets/images/frame-category-2.png";
// import FrameCategory from '../../assets/images/frame-category-3.png';
import FrameCategoryTwo from "../../assets/images/frame-category-3.png";

import GraphicsImgTwoDiff from "../../assets/images/graphics-img-3.png";
import ProgressGraphicsImg from "../../assets/images/points-block-img.png";
import ProgressGraphicsImgTwo from "../../assets/images/points-block-img-2.png";
import NewGraphics from "../../assets/images/ties-graphics.png";
import NewGraphicsTwo from "../../assets/images/ties-graphics-2.png";

import CreateNFTImage from "../../assets/images/nft-image-block-2.png";
import GraphicsImg from "../../assets/images/graphics-img.png";
import GraphicsImgTwo from "../../assets/images/graphics-img-2.png";
import RubyGif from "../../assets/images/ruby-gif.gif";
import OpalGif from "../../assets/images/opal-icon-gif.gif";
import EmeraldIcon from "../../assets/images/emerald-gif.gif";
import CitrineGif from "../../assets/images/citrine-gif.gif";
import DiamondGif from "../../assets/images/diamond-icon.gif";
import { Box, fabClasses } from "@mui/material";
import LinearProgressWithLabel from "../../components/LinearProgressWithLabel";

import heartheadbackground from "../../assets/images/heartheadbackground.mp4";
import {
    capitalizeFirstLetter,
    formatAddress,
    formatNum,
    getRaritySrc,
    getTimeAgo,
    sleep,
} from "../../utils";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";

import "./homestyle.scss";
import MintSuccessModel from "../../components/model/MintSuccessModel";
import { useDispatch, useSelector } from "react-redux";
import {
    recenetState,
    recentMintFetchAction,
} from "../../redux/reducers/recentlyMintSlice";
import ModalListFixPrice from "../../components/model/ModalListFixPrice";
import { Helmet } from "react-helmet";
import { ConnectWallet, darkTheme } from "@thirdweb-dev/react";
import LogoNewTwo from "../../assets/images/logo-new-2.svg";

const settings = {
    dots: true,
    arrows: true,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    // centerMode: false,
    // autoplay: false,
    // autoplaySpeed: 1200,
    // centerPadding: '15%',
    responsive: [
        {
            breakpoint: 1710,
            settings: {
                slidesToShow: 5,
                slidesToScroll: 1,
            },
        },
        {
            breakpoint: 1600,
            settings: {
                slidesToShow: 5,
                slidesToScroll: 1,
            },
        },
        {
            breakpoint: 1500,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 1,
            },
        },
        {
            breakpoint: 1200,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
            },
        },
        {
            breakpoint: 992,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
            },
        },
        {
            breakpoint: 767,
            settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
            },
        },
    ],
};
const pluseChainExplorer =
    process.env.REACT_APP_API_PULSECHAIN_EXPLORER +
    process.env.REACT_APP_API_ITEM_COLLECTION_ADDRESS;
const Home = () => {
    const { account, library } = useActiveWeb3React();
    const { items, loading } = useSelector(recenetState);
    const dispatch = useDispatch();
    const [progress, setProgress] = useState(0);
    const [mintCountCnf, setMintCountCnf] = useState(1);
    const [loadingProcess, setloadingProcess] = useState({
        loading: false,
        disable: false,
    });
    const [recentlymint, setrecentlymint] = useState([]);
    const [recentNft, setRecentNft] = useState();
    const [openModel, setOpenModel] = useState(false);
    const [showPutMarketPlace, setShowPutMarketPlace] = useState(false);
    const [selectedItem, setSelectedItem] = useState();

    const [amount, setAmount] = useState();

    function handleClose() {
        setOpenModel(false);
    }

    function handleSelectItem(data) {
        setOpenModel(false);
        setSelectedItem(data);
    }

    function handleSellModel(value) {
        setShowPutMarketPlace(value);
    }

    function handleCancle() {
        setOpenModel(true);
    }

    useEffect(() => {
        if (!selectedItem) return;
        setShowPutMarketPlace(true);
    }, [selectedItem]);

    async function MintComposibleNft() {
        try {
            if (+amount <= 0) return;
            setloadingProcess({ loading: true, disable: true });
            let result = await ComposibleNftMint(mintCountCnf, amount, library);

            if (result === true) {
                await sleep(6000);
                await dispatch(
                    recentMintFetchAction({
                        account,
                        mintqut: mintCountCnf,
                    })
                );
                toast.success("Mint Successed!");
                setOpenModel(true);
                setloadingProcess({ loading: false, disable: false });
                getRecentlyMint(true);
            } else {
                console.error("resultErrorMintComposibleNft", result);
                // toast.error("Insufficient Funds!");
                setloadingProcess({ loading: false, disable: false });
            }
        } catch (error) {
            console.error("111 mintcomposibleNft", error);
            toast.error("Something went wrong!");
            setloadingProcess({ loading: false, disable: false });
        }
    }
    async function getRecentlyMint(mintflag = false) {
        try {
            setloadingProcess({ loading: true });
            const res = await axios.get(
                `${process.env.REACT_APP_API}/${apiEndPoint.RECENTLY_MINTED_ITEM_HH}`
            );

            if (res.data.status === true) {
                setrecentlymint(res?.data?.items);
                if (mintflag) {
                    setRecentNft(res?.data?.items[0]);
                }
            }

            setloadingProcess({ loading: false });
            
        } catch (err) {
            console.error(
                "Error fetching data from RECENTLY_MINTED_ITEM_HH:",
                err
            );
            setloadingProcess({ loading: false });
        }
    }

    async function getMintedNft() {
        let total_Mint = await getTotalrandomMint(library);
        let mintedPercent = total_Mint * 0.002571686; // (100/38885)
        setProgress(mintedPercent);
    }


//     async function delegateNFT() {
//       let deleGate = await HeartHeadWrappedContract(library);
//       console.log('delegate', deleGate)
//   }

//   async function castVoteNft() {
//     let castVote = await HeartHeadGovernanceContract(library);
//     console.log('castVote', castVote)
// }

//   useEffect(()=>{
//     delegateNFT()
//     castVoteNft()
//   },[])

    const handleChangeQty = (data) => {
        switch (data) {
            case "inc":
                if (mintCountCnf < 100) {
                    setMintCountCnf((prevCount) => prevCount + 1);
                }
                break;
            case "dec":
                if (mintCountCnf > 1) {
                    setMintCountCnf((prevCount) => prevCount - 1);
                }
                break;
            default:
                // Handle other cases if needed
                break;
        }
    };
    

    useEffect(() => {
        getComposibleNftMintAmount(null)
            .then((data) => {
                setAmount(data);
            })
            .catch((err) => {
                console.error("mintamount set", err);
            });
        getMintedNft();
        getRecentlyMint();
    }, []);
    return (
      <div className='home-main'>
        <Helmet>
          <title>HEART HEADS - Composable NFT's</title>
          <meta
            content="HEART HEADS - Composable NFT's ,Mint items and create your unique heart head on PulseChain!"
            name='title'
          />
          <meta content="HEART HEADS - Composable NFT's" name='description' />

          <meta
            content="HEART HEADS - Composable NFT's ,Mint items and create your unique heart head on PulseChain!"
            property='og:title'
          />
          <meta content="HEART HEADS - Composable NFT's" property='og:description' />
          <meta content='https://heart-heads.com/' property='og:url' />
          <meta name='keywords' content='HEART HEADS, Mint items and create your unique heart head on PulseChain!' />
        </Helmet>
        <MintSuccessModel open={openModel} handleClose={handleClose} handleSell={handleSelectItem} />
        <ModalListFixPrice
          item={selectedItem}
          // available={available}
          showPutMarketPlace={showPutMarketPlace}
          setShowPutMarketPlace={handleSellModel}
          handleCancle={handleCancle}
        />
        {/* <HeaderCnft /> */}
        <div className='top-section'>
          <div className='top-section-inner'>
            <div className='top-section-inner-banner'>
              <div className='top-section-inner-banner-ovarlay'></div>
              {/* <img src={HomeBanner} alt="" className="main-img" /> */}
              <video
                src={heartheadbackground}
                autoPlay
                muted
                loop
                playsInline
                controls={false}
                allowFullScreen={false}
              />
              <div className='home-banner-inner'>
                <div className='container'>
                  <img
                    data-aos='fade-up'
                    data-aos-anchor-placement='center-bottom'
                    data-aos-duration='2800'
                    src={HomeBannerInnerTwo}
                    alt=''
                    className='main-img'
                  />
                  <img
                    data-aos='fade-up'
                    data-aos-anchor-placement='center-bottom'
                    data-aos-duration='2800'
                    src={HomeBannerMobile}
                    alt=''
                    className='mobile-main-img'
                  />
                  <div className='btn-home-group'>
                    <div
                      className='btn-home-plus'
                      data-aos='fade-up'
                      data-aos-anchor-placement='center-bottom'
                      data-aos-duration='3100'>
                      <button onClick={() => handleChangeQty('inc')}>
                        <svg width='12' height='13' viewBox='0 0 12 13' fill='none' xmlns='http://www.w3.org/2000/svg'>
                          <path
                            d='M5.16666 7.33332H0.166656V5.66666H5.16666V0.666656H6.83332V5.66666H11.8333V7.33332H6.83332V12.3333H5.16666V7.33332Z'
                            fill='white'
                          />
                        </svg>
                      </button>
                      <p>{mintCountCnf}</p>
                      <button onClick={() => handleChangeQty('dec')}>
                        <svg width='12' height='3' viewBox='0 0 12 3' fill='none' xmlns='http://www.w3.org/2000/svg'>
                          <path d='M11.8333 2.33168H0.166656V0.665009H11.8333V2.33168Z' fill='white' />
                        </svg>
                      </button>
                      {/* <div className="input-number">
                                            <input
                                                type="number"
                                                placeholder="Enter Mint Qty"
                                                value={mintCountCnf}
                                                onChange={handleChangeQty}
                                            />
                                        </div> */}
                    </div>
                    {account ? (
                      <button
                        className='custom_btn fillBtn'
                        onClick={MintComposibleNft}
                        disabled={loadingProcess.disable}>
                        {loadingProcess.loading ? 'Loading...' : `Mint (${formatNum(mintCountCnf * amount)}) PLS`}
                      </button>
                    ) : (
                      <ConnectWallet
                        theme={darkTheme({
                          colors: {
                            accentText: '#fff',
                            accentButtonBg: '#fff'
                          }
                        })}
                        className='custom_btn fillBtn'
                        btnTitle={'Connect Wallet'}
                        switchToActiveChain={true}
                        modalSize={'wide'}
                        welcomeScreen={{
                          img: {
                            src: `${LogoNewTwo}`,
                            width: 300,
                            height: 300
                          },
                          title: 'Composable NFT Collection On PulseChain',
                          subtitle: ' '
                        }}
                        modalTitleIconUrl={''}
                      />
                    )}
                  </div>
                  <div className='progressbar-block-inner'>
                    <div className='tier-block'>
                      <div className='tier-block-inner'>
                        <span className='tier-block-line-left'></span>
                        <p>TIER 1</p>
                        <span className='tier-block-line-right'></span>
                      </div>
                      <div className='tier-block-inner'>
                        <span className='tier-block-line-left'></span>
                        <p>TIER 2</p>
                        <span className='tier-block-line-right'></span>
                      </div>
                      <div className='tier-block-inner'>
                        <span className='tier-block-line-left'></span>
                        <p>TIER 3</p>
                        <span className='tier-block-line-right'></span>
                      </div>
                    </div>
                    <Box sx={{ width: '100%' }}>
                      <LinearProgressWithLabel value={progress} />
                    </Box>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='recent-method-block'>
          <div className='recent-method-block-inner'>
            <div className='recent-method-block-title'>
              <h2 data-aos='fade-right' data-aos-duration='1000'>
                Recently Minted
              </h2>
              <a data-aos='fade-left' data-aos-duration='1000' href=''>
                <span onClick={() => window.open(process.env.REACT_APP_API_RECENTLY_MINTED_EXPLORER, '_blank')}>
                  Explore
                </span>
                <svg width='26' height='15' viewBox='0 0 26 15' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <path
                    fill-rule='evenodd'
                    clip-rule='evenodd'
                    d='M23.1154 8.29416L18.107 13.3019C17.8346 13.5742 17.8346 14.0158 18.1069 14.2882C18.3793 14.5606 18.8209 14.5606 19.0933 14.2883L24.6352 8.7471C25.2709 8.11154 25.2708 7.081 24.6352 6.44545L19.0933 0.90426C18.8209 0.631904 18.3793 0.631934 18.1069 0.904327C17.8346 1.17672 17.8346 1.61833 18.107 1.89068L23.1162 6.89925L1.55172 6.89925C1.16652 6.89925 0.85426 7.21151 0.85426 7.59671C0.85426 7.9819 1.16652 8.29417 1.55172 8.29417L23.1154 8.29416Z'
                    fill='url(#paint0_linear_377_6288)'
                  />
                  <defs>
                    <linearGradient
                      id='paint0_linear_377_6288'
                      x1='25.1119'
                      y1='7.59627'
                      x2='0.85426'
                      y2='7.59627'
                      gradientUnits='userSpaceOnUse'>
                      <stop stop-color='#80FFCC' />
                      <stop offset='1' stop-color='#F326B4' />
                    </linearGradient>
                  </defs>
                </svg>
              </a>
            </div>
            <div className='recent-method-slider'>
              <Slider {...settings}>
                {recentlymint.map((data, index) => {
                  const address = data?.holders[0]?.address;
                  const ipfsUrl = process.env.REACT_APP_API_PULSECHAIN_EXPLORER + address;

                  const customizeItemRarity = data?.attributes[2]?.value == 'true';
                  return (
                    <div key={index}>
                      <div className='recent-method-slider-inner' onClick={() => window.open(ipfsUrl, '_blank')}>
                        <h2>
                          {capitalizeFirstLetter(customizeItemRarity ? 'Heart Head' : data?.attributes[0]?.value)}
                        </h2>
                        <div className='recent-slider-img'>
                          <img src={data.image} alt='' />
                        </div>
                        <div className='category-rarity-block'>
                          <div className='category-rarity-block-left'>
                            <p>Category</p>
                            <h4>
                              {customizeItemRarity
                                ? 'Composed'
                                : capitalizeFirstLetter(data?.attributes[0]?.trait_type)}
                            </h4>
                          </div>
                          <div className='category-rarity-block-left'>
                            <p>Rarity</p>
                            <h4>
                              <img src={getRaritySrc(data?.attributes[1])} alt='' />
                              <span>{capitalizeFirstLetter(data?.attributes[1]?.value)}</span>
                            </h4>
                          </div>
                        </div>
                        <div className='category-rarity-block pt-5'>
                          <div className='category-rarity-block-left'>
                            <p>Time</p>
                            <h4 className='days-block'>{getTimeAgo(data?.mintTimestamp)}</h4>
                          </div>
                          <div className='category-rarity-block-left'>
                            <p>Minted By</p>
                            <p className='highlight-text'>{formatAddress(data?.holders[0]?.address)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </Slider>
            </div>
          </div>
        </div>
        <div className='composable-text-block'>
          <div className='container'>
            <div className='composable-text-block-inner'>
              <div className='composable-nft-left'>
                <h2 data-aos='fade-right' data-aos-duration='1000'>
                  <span>Composable</span> NFTs With <span>Equippables</span>
                </h2>
                <p data-aos='fade-up' data-aos-duration='1200'>
                  create your very own Heart-Head NFTs with equippable items. Mint items and dynamically customize your
                  NFTs from your inventory. Additionally, you can explore the catalog to buy and sell items.
                </p>
                <div className='button-nft-block' data-aos='fade-up' data-aos-duration='1400'>
                  <Link to='/catalog'>
                    <button className='custom_btn fillBtn'>Catalog</button>
                  </Link>
                  {/*<a href="#">
										<span>ERC-6220 Docs</span>
										<svg
											width="18"
											height="13"
											viewBox="0 0 18 13"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M11.5 12.8679V7.86792H0.35L0.3125 5.35542H11.5V0.36792L17.75 6.61792L11.5 12.8679Z"
												fill="white"
											/>
										</svg>
									</a>*/}
                </div>
              </div>
              <div className='composable-nft-right' data-aos='fade-left' data-aos-duration='1200'>
                <img src={CreateNFTImage} alt='' />
              </div>
            </div>
          </div>
        </div>
        <div className='points-block-main'>
          <div className='points-block-graphics'>
            <img src={ProgressGraphicsImg} alt='' />
          </div>
          <div className='points-block-graphics-two'>
            <img src={ProgressGraphicsImgTwo} alt='' />
          </div>
          <div className='container'>
            <div className='points-block-inner'>
              <div className='points-block-inner-radius' data-aos='zoom-in' data-aos-duration='1000'>
                <div className='points-block-inner-radius-inner'>
                  <div className='points-block-icon'>
                    <svg width='27' height='23' viewBox='0 0 27 23' fill='none' xmlns='http://www.w3.org/2000/svg'>
                      <path
                        fill-rule='evenodd'
                        clip-rule='evenodd'
                        d='M24.375 6.69787C24.3063 6.69287 24.23 6.69287 24.15 6.69287H20.9938C18.4088 6.69287 16.1975 8.72787 16.1975 11.3804C16.1975 14.0329 18.41 16.0679 20.9938 16.0679H24.15C24.23 16.0679 24.3062 16.0679 24.3775 16.0629C24.9088 16.0308 25.4103 15.8067 25.7886 15.4324C26.1669 15.058 26.3962 14.5588 26.4338 14.0279C26.4388 13.9529 26.4388 13.8716 26.4388 13.7966V8.96412C26.4388 8.88912 26.4388 8.80787 26.4338 8.73287C26.3962 8.20195 26.1669 7.70279 25.7886 7.32839C25.4103 6.954 24.9088 6.7299 24.3775 6.69787H24.375ZM20.715 12.6304C21.38 12.6304 21.9188 12.0704 21.9188 11.3804C21.9188 10.6904 21.38 10.1304 20.715 10.1304C20.0488 10.1304 19.51 10.6904 19.51 11.3804C19.51 12.0704 20.0488 12.6304 20.715 12.6304Z'
                        fill='white'
                      />
                      <path
                        fill-rule='evenodd'
                        clip-rule='evenodd'
                        d='M24.1475 17.9429C24.1907 17.9411 24.2337 17.9496 24.2731 17.9676C24.3124 17.9856 24.3469 18.0127 24.3738 18.0465C24.4007 18.0804 24.4193 18.1201 24.4279 18.1625C24.4366 18.2048 24.4352 18.2487 24.4237 18.2904C24.1737 19.1804 23.775 19.9404 23.1362 20.5779C22.2 21.5154 21.0138 21.9291 19.5487 22.1266C18.1238 22.3179 16.305 22.3179 14.0075 22.3179H11.3675C9.07 22.3179 7.25 22.3179 5.82625 22.1266C4.36125 21.9291 3.175 21.5141 2.23875 20.5791C1.30375 19.6429 0.88875 18.4566 0.69125 16.9916C0.5 15.5666 0.5 13.7479 0.5 11.4504V11.3104C0.5 9.01287 0.5 7.19287 0.69125 5.76787C0.88875 4.30287 1.30375 3.11662 2.23875 2.18037C3.175 1.24537 4.36125 0.830371 5.82625 0.632871C7.25125 0.442871 9.07 0.442871 11.3675 0.442871H14.0075C16.305 0.442871 18.125 0.442871 19.5487 0.634121C21.0138 0.831621 22.2 1.24662 23.1362 2.18162C23.775 2.82162 24.1737 3.58037 24.4237 4.47037C24.4352 4.51208 24.4366 4.5559 24.4279 4.59827C24.4193 4.64064 24.4007 4.68037 24.3738 4.71422C24.3469 4.74808 24.3124 4.77511 24.2731 4.79312C24.2337 4.81113 24.1907 4.81961 24.1475 4.81787H20.9925C17.4462 4.81787 14.3212 7.61787 14.3212 11.3804C14.3212 15.1429 17.4462 17.9429 20.9925 17.9429H24.1475ZM5.1875 5.44287C4.93886 5.44287 4.7004 5.54164 4.52459 5.71746C4.34877 5.89327 4.25 6.13173 4.25 6.38037C4.25 6.62901 4.34877 6.86747 4.52459 7.04328C4.7004 7.2191 4.93886 7.31787 5.1875 7.31787H10.1875C10.4361 7.31787 10.6746 7.2191 10.8504 7.04328C11.0262 6.86747 11.125 6.62901 11.125 6.38037C11.125 6.13173 11.0262 5.89327 10.8504 5.71746C10.6746 5.54164 10.4361 5.44287 10.1875 5.44287H5.1875Z'
                        fill='white'
                      />
                    </svg>
                  </div>
                  <h3>Mint</h3>
                  <p>Connect your wallet and mint an item from the catalog!</p>
                </div>
              </div>
              <div className='points-block-inner-radius' data-aos='zoom-in' data-aos-duration='1100'>
                <div className='points-block-inner-radius-inner'>
                  <div className='points-block-icon'>
                    <svg width='24' height='23' viewBox='0 0 24 23' fill='none' xmlns='http://www.w3.org/2000/svg'>
                      <path
                        d='M2 12.9429H9.5C10.1875 12.9429 10.75 12.3804 10.75 11.6929V1.69287C10.75 1.00537 10.1875 0.442871 9.5 0.442871H2C1.3125 0.442871 0.75 1.00537 0.75 1.69287V11.6929C0.75 12.3804 1.3125 12.9429 2 12.9429ZM2 22.9429H9.5C10.1875 22.9429 10.75 22.3804 10.75 21.6929V16.6929C10.75 16.0054 10.1875 15.4429 9.5 15.4429H2C1.3125 15.4429 0.75 16.0054 0.75 16.6929V21.6929C0.75 22.3804 1.3125 22.9429 2 22.9429ZM14.5 22.9429H22C22.6875 22.9429 23.25 22.3804 23.25 21.6929V11.6929C23.25 11.0054 22.6875 10.4429 22 10.4429H14.5C13.8125 10.4429 13.25 11.0054 13.25 11.6929V21.6929C13.25 22.3804 13.8125 22.9429 14.5 22.9429ZM13.25 1.69287V6.69287C13.25 7.38037 13.8125 7.94287 14.5 7.94287H22C22.6875 7.94287 23.25 7.38037 23.25 6.69287V1.69287C23.25 1.00537 22.6875 0.442871 22 0.442871H14.5C13.8125 0.442871 13.25 1.00537 13.25 1.69287Z'
                        fill='white'
                      />
                    </svg>
                  </div>
                  <h3>Compose</h3>
                  <p>Craft your unique Heart Head NFT by equipping your items together.</p>
                </div>
              </div>
              <div className='points-block-inner-radius' data-aos='zoom-in' data-aos-duration='1200'>
                <div className='points-block-inner-radius-inner'>
                  <div className='points-block-icon'>
                    <svg width='28' height='23' viewBox='0 0 28 23' fill='none' xmlns='http://www.w3.org/2000/svg'>
                      <path
                        d='M23.375 0.442871H4.625C3.63077 0.443957 2.67757 0.839394 1.97455 1.54242C1.27152 2.24545 0.876086 3.19864 0.875 4.19287V19.1929C0.876086 20.1871 1.27152 21.1403 1.97455 21.8433C2.67757 22.5463 3.63077 22.9418 4.625 22.9429H23.375C24.3692 22.9418 25.3224 22.5463 26.0255 21.8433C26.7285 21.1403 27.1239 20.1871 27.125 19.1929V4.19287C27.1239 3.19864 26.7285 2.24545 26.0255 1.54242C25.3224 0.839394 24.3692 0.443957 23.375 0.442871ZM18.6875 4.19287C19.2438 4.19287 19.7875 4.35782 20.25 4.66686C20.7126 4.9759 21.073 5.41516 21.2859 5.92907C21.4988 6.44299 21.5545 7.00849 21.446 7.55406C21.3374 8.09963 21.0696 8.60077 20.6762 8.99411C20.2829 9.38744 19.7818 9.65531 19.2362 9.76383C18.6906 9.87235 18.1251 9.81665 17.6112 9.60378C17.0973 9.39091 16.658 9.03043 16.349 8.56791C16.0399 8.1054 15.875 7.56163 15.875 7.00537C15.8758 6.25969 16.1723 5.54477 16.6996 5.01749C17.2269 4.49021 17.9418 4.19365 18.6875 4.19287ZM4.625 21.0679C4.12772 21.0679 3.65081 20.8703 3.29917 20.5187C2.94754 20.1671 2.75 19.6902 2.75 19.1929V15.2302L8.30703 10.2907C8.84319 9.81521 9.54047 9.562 10.2568 9.58269C10.9732 9.60337 11.6547 9.89639 12.1625 10.4021L15.9682 14.1995L9.0998 21.0679H4.625ZM25.25 19.1929C25.25 19.6902 25.0525 20.1671 24.7008 20.5187C24.3492 20.8703 23.8723 21.0679 23.375 21.0679H11.7518L18.8662 13.9534C19.3699 13.5251 20.0091 13.2891 20.6704 13.2873C21.3316 13.2856 21.972 13.5183 22.4779 13.944L25.25 16.2538V19.1929Z'
                        fill='white'
                      />
                    </svg>
                  </div>
                  <h3>Catalog</h3>
                  <p>Explore the catalog to uncover every item and its respective rarity.</p>
                </div>
              </div>
              <div className='points-block-inner-radius' data-aos='zoom-in' data-aos-duration='1300'>
                <div className='points-block-inner-radius-inner'>
                  <div className='points-block-icon'>
                    <svg width='30' height='31' viewBox='0 0 30 31' fill='none' xmlns='http://www.w3.org/2000/svg'>
                      <path
                        d='M23.0001 21.6929V19.6928H24.9999V13.6928H21.4776C20.3916 10.7438 18.7932 8.39507 16.8888 7.02677L18 3.69287H8.0001L9.1113 7.02677C5.5194 9.60587 3 15.6491 3 22.6928C3 25.4546 7.4775 27.6929 12.9999 27.6929H27V21.6929H23.0001ZM23.0001 15.6929V17.693H12.9999V15.6929H23.0001ZM21 19.6928V21.6929H11.0001V19.6928H21ZM12.9999 25.6928C8.037 25.6928 5.0001 23.7503 5.0001 22.6928C5.0001 15.4994 7.869 9.30317 11.5332 7.96817L10.7754 5.69297H15.2256L14.4669 7.96817C16.4247 8.68127 18.1503 10.7924 19.338 13.6928H11.0001V17.693H9V23.693H12.9999V25.6928ZM24.9999 25.6928H15V23.693H24.9999V25.6928Z'
                        fill='white'
                      />
                    </svg>
                  </div>
                  <h3>Trade</h3>
                  <p>Utilize the marketplace to both sell your items and purchase those you desire.</p>
                </div>
              </div>
              <div className='points-block-inner-radius' data-aos='zoom-in' data-aos-duration='1400'>
                <div className='points-block-inner-radius-inner'>
                  <div className='points-block-icon'>
                    <svg width='30' height='31' viewBox='0 0 30 31' fill='none' xmlns='http://www.w3.org/2000/svg'>
                      <path
                        d='M23.1037 21.6517C21.3952 22.0619 19.6116 22.0421 17.9126 21.5938C16.2136 21.1456 14.6523 20.283 13.3685 19.0833C12.0847 17.8836 11.1185 16.3843 10.5564 14.7195C9.99425 13.0548 9.85376 11.2766 10.1475 9.54419C10.1028 9.58733 10.0557 9.62782 10.0062 9.66544C9.65624 9.93169 9.21874 10.0304 8.34374 10.2279L7.54999 10.4079C4.47499 11.1042 2.93749 11.4517 2.57124 12.6279C2.20624 13.8029 3.25374 15.0292 5.34999 17.4804L5.89249 18.1142C6.48749 18.8104 6.78624 19.1592 6.91999 19.5892C7.05374 20.0204 7.00874 20.4854 6.91874 21.4142L6.83624 22.2604C6.51999 25.5317 6.36124 27.1667 7.31874 27.8929C8.27624 28.6204 9.71624 27.9579 12.5937 26.6317L13.34 26.2892C14.1575 25.9117 14.5662 25.7242 15 25.7242C15.4337 25.7242 15.8425 25.9117 16.6612 26.2892L17.405 26.6317C20.2837 27.9567 21.7237 28.6192 22.68 27.8942C23.6387 27.1667 23.48 25.5317 23.1637 22.2604L23.1037 21.6517Z'
                        fill='white'
                      />
                      <path
                        opacity='0.5'
                        d='M11.4412 7.45287L11.0312 8.18787C10.5812 8.99537 10.3562 9.39912 10.0062 9.66537C10.0562 9.62787 10.1025 9.58787 10.1475 9.54412C9.85368 11.2766 9.99417 13.055 10.5564 14.7199C11.1186 16.3847 12.0849 17.8842 13.3689 19.0839C14.6528 20.2837 16.2143 21.1462 17.9135 21.5943C19.6126 22.0424 21.3964 22.0621 23.105 21.6516L23.08 21.4141C22.9912 20.4854 22.9462 20.0204 23.08 19.5891C23.2137 19.1591 23.5112 18.8104 24.1075 18.1141L24.65 17.4804C26.7462 15.0304 27.7937 13.8041 27.4275 12.6279C27.0625 11.4516 25.525 11.1029 22.45 10.4079L21.655 10.2279C20.7812 10.0304 20.3437 9.93162 19.9925 9.66537C19.6425 9.39912 19.4175 8.99537 18.9675 8.18787L18.5587 7.45287C16.975 4.61287 16.1837 3.19287 15 3.19287C13.8162 3.19287 13.025 4.61287 11.4412 7.45287Z'
                        fill='white'
                      />
                    </svg>
                  </div>
                  <h3>Showcase</h3>
                  <p>Share your newly created Heart Head NFT on your social media profiles to showcase it!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='limitless-block diff-graphics-block'>
          <div className='limitless-block-graphics'>
            <img src={GraphicsImgTwoDiff} alt='' />
          </div>
          <div className='limitless-block-graphics-two'>
            <img src={GraphicsImg} alt='' />
          </div>
          <div className='container'>
            <div className='limitless-block-inner'>
              <div className='limitless-block-title'>
                <h2 data-aos='fade-up' data-aos-duration='1000'>
                  Endless Variations
                </h2>
                <p data-aos='fade-up' data-aos-duration='1100'>
                  Create Your Own Unique Heart-Head{' '}
                </p>
                <button
                  data-aos='fade-up'
                  data-aos-duration='1300'
                  className='custom_btn fillBtn'
                  onClick={() => window.open(pluseChainExplorer, '_blank')}>
                  Explore
                </button>
              </div>
              <div className='category-block'>
                <div className='category-block-left'>
                  <h2 data-aos='fade-right' data-aos-duration='1000'>
                    Categories
                  </h2>
                  {/*<p>Mint from the following</p>*/}
                  <div className='category-block-left-inner'>
                    <p data-aos='zoom-in' data-aos-duration='1100'>
                      <span className='sub-text'>#</span>
                      <span>Background</span>
                    </p>
                    <p data-aos='zoom-in' data-aos-duration='1200'>
                      <span className='sub-text'>#</span>
                      <span>Base</span>
                    </p>
                    <p data-aos='zoom-in' data-aos-duration='1300'>
                      <span className='sub-text'>#</span>
                      <span>Clothes</span>
                    </p>
                    <p data-aos='zoom-in' data-aos-duration='1400'>
                      <span className='sub-text'>#</span>
                      <span>Hats</span>
                    </p>
                    <p data-aos='zoom-in' data-aos-duration='1500'>
                      <span className='sub-text'>#</span>
                      <span>Sunglasses</span>
                    </p>
                    <p data-aos='zoom-in' data-aos-duration='1600'>
                      <span className='sub-text'>#</span>
                      <span>Necklace</span>
                    </p>
                    <p data-aos='zoom-in' data-aos-duration='1700'>
                      <span className='sub-text'>#</span>
                      <span>Earrings</span>
                    </p>
                  </div>
                </div>
                <div className='category-block-right' data-aos='fade-left' data-aos-duration='1000'>
                  <img src={FrameCategory} alt='' />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='minting-tiers-block'>
          <div className='minting-tiers-block-gr'>
            <img src={NewGraphics} alt='' />
          </div>
          <div className='minting-tiers-block-gr-two'>
            <img src={NewGraphicsTwo} alt='' />
          </div>
          <div className='container'>
            <div className='minting-tiers-block-title'>
              <h2 data-aos='fade-up' data-aos-duration='1000'>
                Minting Tiers
              </h2>
            </div>
            <div className='tier-block-main'>
              <div className='tier-block-main-inner' data-aos='zoom-in' data-aos-duration='1100'>
                <div className='tier-block-main-inner-bg'>
                  <span className='bg-blue'>Tier 1</span>
                  <h3>0-32%</h3>
                  <h3>150K PLS</h3>
                </div>
              </div>
              <div className='tier-block-main-inner' data-aos='zoom-in' data-aos-duration='1200'>
                <div className='tier-block-main-inner-bg'>
                  <span className='bg-pink'>Tier 2</span>
                  <h3>33-66%</h3>
                  <h3>250K PLS</h3>
                </div>
                <div className='tier-inner-block'>
                  <h4>Voting</h4>
                </div>
              </div>
              <div className='tier-block-main-inner' data-aos='zoom-in' data-aos-duration='1300'>
                <div className='tier-block-main-inner-bg'>
                  <span>Tier 3</span>
                  <h3>67-100%</h3>
                  <h3>350K PLS</h3>
                </div>
                <div className='tier-inner-block'>
                  {/* <h4>4</h4> */}
                  <h4>PLS rewards</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='progressbar-block-main'>
          <div className='progressbar-block-graphics'>
            <img src={NewGraphics} alt='' />
          </div>
          <div className='progressbar-block-graphics-two'>
            <img src={NewGraphicsTwo} alt='' />
          </div>
          <div className='container'>
            <div className='progressbar-block-main-inner'>
              <div className='progressbar-block-title'>
                <h2 data-aos='fade-up' data-aos-duration='1000'>
                  Equippables Rarities
                </h2>
              </div>
              <div className='progressbar-block-data'>
                <div
                  className='progressbar-block-data-inner'
                  data-aos='fade-up'
                  data-aos-anchor-placement='center-bottom'
                  data-aos-duration='1100'>
                  <img src={RubyGif} alt='' />
                  <Box sx={{ width: '100%' }}>
                    <LinearProgressWithLabel value={7} />
                    <p>God Tier</p>
                  </Box>
                </div>
                <div
                  className='progressbar-block-data-inner'
                  data-aos='fade-up'
                  data-aos-anchor-placement='center-bottom'
                  data-aos-duration='1200'>
                  <img src={OpalGif} alt='' />
                  <Box sx={{ width: '100%' }}>
                    <LinearProgressWithLabel value={20} />
                    <p>Legendary</p>
                  </Box>
                </div>
                <div
                  className='progressbar-block-data-inner'
                  data-aos='fade-up'
                  data-aos-anchor-placement='center-bottom'
                  data-aos-duration='1300'>
                  <img src={EmeraldIcon} alt='' />
                  <Box sx={{ width: '100%' }}>
                    <LinearProgressWithLabel value={35} />
                    <p>Ultra Rare</p>
                  </Box>
                </div>
                <div
                  className='progressbar-block-data-inner'
                  data-aos='fade-up'
                  data-aos-anchor-placement='center-bottom'
                  data-aos-duration='1400'>
                  <img src={CitrineGif} alt='' />
                  <Box sx={{ width: '100%' }}>
                    <LinearProgressWithLabel value={65} />
                    <p>Rare</p>
                  </Box>
                </div>
                <div
                  className='progressbar-block-data-inner'
                  data-aos='fade-up'
                  data-aos-anchor-placement='center-bottom'
                  data-aos-duration='1500'>
                  <img src={DiamondGif} alt='' />
                  <Box sx={{ width: '100%' }}>
                    <LinearProgressWithLabel value={90} />
                    <p>Common</p>
                  </Box>
                </div>
              </div>

              <div className='progressbar-btn' data-aos='fade-up' data-aos-duration='1600'>
                <Link
                  to={{
                    pathname: '/Faq',
                    state: {
                      fromExploreButton: true,
                      activeFaqIndex: 10
                    }
                  }}>
                  <button className='custom_btn fillBtn'>Explore</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className='limitless-block'>
          <div className='limitless-block-graphics'>
            <img src={GraphicsImg} alt='' />
          </div>
          <div className='limitless-block-graphics-two'>
            <img src={GraphicsImgTwo} alt='' />
          </div>
          <div className='container'>
            <div className='limitless-block-inner'>
              <div className='limitless-block-title limitless-block-title-diff'>
                <h2 data-aos='fade-up' data-aos-duration='1000'>
                  Nestable, Upgradable, Futureproof + <span>Rewarding</span>
                </h2>
                <p data-aos='fade-up' data-aos-duration='1100'>
                  Heart-Head Nestable NFTs can potentially integrate with <span>ERC-6220, ERC-5773 & ERC-6059</span>,
                  transcending the traditional concept of 'static JPEGs.' These NFTs now possess the remarkable ability
                  to encapsulate other NFTs and exhibit a wide range of dynamic capabilities.
                </p>
                {/* <p>
					Designed to work side by side with ERC-5779 and ERC-6059, NFTs aren’t limited to just “static JPEGs”
					anymore. NFT’s can now own other NFT’s{' '}
				  </p> */}
                {/* <button className='custom_btn fillBtn'>See Docs</button> */}
              </div>
              <div className='category-block'>
                <div className='category-block-right' data-aos='fade-right' data-aos-duration='1000'>
                  <img src={FrameCategoryTwo} alt='' />
                </div>
                <div className='category-block-left'>
                  <h2 data-aos='fade-left' data-aos-duration='1100'>
                    NFT’s 2.0
                  </h2>
                  <p data-aos='fade-left' data-aos-duration='1200'>
                    owning a heart head could open the door to many future possibilities - No Promises!
                  </p>
                  <div className='category-block-left-inner'>
                    <p data-aos='zoom-in' data-aos-duration='1300'>
                      <span className='sub-text'>#</span>
                      <span>Upgradable</span>
                    </p>
                    <p data-aos='zoom-in' data-aos-duration='1400'>
                      <span className='sub-text'>#</span>
                      <span>Rewards</span>
                    </p>
                    <p data-aos='zoom-in' data-aos-duration='1500'>
                      <span className='sub-text'>#</span>
                      <span>Multi-Asset</span>
                    </p>
                    <p data-aos='zoom-in' data-aos-duration='1600'>
                      <span className='sub-text'>#</span>
                      <span>Token-gated Members Access </span>
                    </p>
                    <p data-aos='zoom-in' data-aos-duration='1700'>
                      <span className='sub-text'>#</span>
                      <span>Achievements</span>
                    </p>
                    <p data-aos='zoom-in' data-aos-duration='1800'>
                      <span className='sub-text'>#</span>
                      <span>pvP gaming</span>
                    </p>
                    <p data-aos='zoom-in' data-aos-duration='1900'>
                      <span className='sub-text'>#</span>
                      <span>DAO Membership</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};

export default Home;
