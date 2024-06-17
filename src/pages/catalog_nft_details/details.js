
import './details.scss'
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { shorter, formatNum, getCurrencyInfoFromAddress } from "../../utils";


import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import ThemeContext from '../../context/ThemeContext';
import unknownImg from "../../assets/images/unknown.jpg";
import reloadBtn from "../../assets/images/icons/reload-btn.svg";
import shareLink from "../../assets/images/icons/share-link.svg";
import externalLink from "../../assets/images/icons/external-link.svg";
import menuIcn from "../../assets/images/icons/menu-icn.svg";
import Button from '../../components/Widgets/CustomButton';
import loadingImage from '../../assets/images/hextoysloading.gif';

import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
import { NetworkParams } from '../../constant';
import ModalDelist from '../../components/model/modal-delist';
import ModalBuy from '../../components/model/ModalBuy';
import { apiEndPoint } from '../../routes/routes';
import { useLocation } from 'react-router-dom';
import { Pagination } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import LoaderImg from "../../assets/images/Loading.gif";
import { Link } from 'react-router-dom/cjs/react-router-dom.min';

function Details(props) {
  let { collection, name } = useParams();
  const { state, initData } = useLocation();
  let nftType = state?.detailData
  let init = initData?.item?.marketList?.includes('pair') // init use identify nft is sale type or not if user not selected any filtered !


  const { theme } = useContext(ThemeContext)

  const { account } = useActiveWeb3React();
  const [itemsData, setItemsData] = useState([]);
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(12)
  const [noItems, setNoItems] = useState(false);



  const [showSendNFTModal, setShowSendNFTModal] = useState(false);
  const [showBuyNowModal, setShowBuyNowModal] = useState(false);
  const [showUnlistMarketPlace, setShowUnlistMarketPlace] = useState(false);
  const [showPutMarketPlace, setShowPutMarketPlace] = useState(false);
  const [showClaimModal, setShowClaimModal] = useState(false);


  // properties for owners list
  const [holding, setHolding] = useState(0);
  const [available, setAvailable] = useState(0);
  const [pairItem, setPairItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  let item = itemsData[0]

  let market_list = nftType?.traitType && init ? init && nftType?.currency === '' ? 'yes' : '' : nftType?.is_marketList !== '' ? nftType?.is_marketList : init && nftType?.currency === '' ? 'yes' : ''
  let not_market_list = nftType?.is_not_marketList !== '' ? nftType?.is_not_marketList : init ? '' : 'yes'

  async function fetchItem() {
    try {
      if (isLoading) return;
      setIsLoading(true);
      const res = await axios.get(
        `${process.env.REACT_APP_API}/${apiEndPoint.CATALOG_NFT_DETAILS}`, {
        params: {
          trait_name: name,
          is_marketList: market_list,
          is_not_marketList: not_market_list,
          currency: nftType?.currency,
          limit: limit,
          page: page
        }
      }
      );
      setIsLoading(false);

      if (res.status === 200) {
        if (res.data.items.length === 0) setNoItems(true)
        const newData = res.data.items;
        setItemsData(prevData => [...prevData, ...newData]);
        setPage(page + 1);

      }
    } catch (e) {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchItem();
  }, [account, name])

  function buyItem(pair) {
    setPairItem(pair);
    setShowBuyNowModal(true);
  }
  function delistPairItem(pair) {
    setPairItem(pair);
    setShowUnlistMarketPlace(true);
  }


  const [tabId, setTabId] = useState(0);
  const [isLoadingMainNft, setIsLoadingMainNft] = useState(true);



  const filteredAttributes = item?.attributes.filter(attribute => {
    return attribute?.trait_type !== 'composed'; // Keep all attributes except 'composed'
  });



  return (
    <>



      <div className="detail">
        {/* <div className='back-button'>
          <Link to='/catalog'>
            Back
          </Link>
        </div> */}
        <div className="container">
          <div className='bull-info'>
            <div className="img_container">
              <div className="img_div">
                <img src={(item?.isThumbSynced ? item.highLogo : item?.image) || unknownImg} alt='' onLoad={() => setIsLoadingMainNft(false)} style={{ opacity: isLoadingMainNft ? 0 : 1, background: 'white' }} />
                {isLoadingMainNft && <img src={loadingImage} alt="" className="img_cover" />}
              </div>
            </div>
            <div >

              <div className={`tab_list boder_color_${theme}`}>
                <div className={`tab text_color_4_${theme} ${tabId === 0 ? `active_tab_${theme}` : ''}`} onClick={() => setTabId(1)}>Properties</div>
              </div>

              {/* Properties */}

              {tabId === 0 &&
                <div className="tab_conent">
                  <div className={`row_div`}>
                    <h3 className={`sub_title padding text_color_1_${theme}`}>Properties</h3>
                    <div className={`info-property border_color_${theme}`}>
                      {filteredAttributes?.map((attribute, index) => (
                        <div className="item-property" key={index}>
                          <div className={`property-type text_color_4_${theme}`}>{attribute?.trait_type}</div>
                          <div className={`property-value text_color_1_${theme}`}>{attribute?.value}</div>
                        </div>
                      ))
                      }
                    </div>
                  </div>

                </div>
              }

            </div>
          </div>

          <div className='activity-section'>
            <div className='header'>
              {
                item?.type === 'single' &&
                <div className='header-subtitle'>
                  <span className={`owner-name text_color_1_${theme}`}>
                    <img src={item?.image} alt={''} style={{ background: "white" }} />
                    <div className='owner-info '>
                      <p className={`text_color_4_${theme}`}>Heart-Heads</p>
                    </div>

                  </span>
                </div>
              }
              <div className="title">
                <h2 className={`text_color_gradient`}>{item?.name}</h2>
              </div>

              <div className='header-links' style={{ display: 'none' }}>
                <ul>
                  <li><a href='/' className='primary-bg'>
                    <img src={reloadBtn} height="24" width="24" alt={''} />
                  </a></li>
                  <li><a href='/'>
                    <img src={externalLink} height="24" width="24" alt={''} />
                  </a></li>
                  <li><a href='/'>
                    <img src={shareLink} height="24" width="24" alt={''} />
                  </a></li>
                  <li><a href='/'>
                    <img src={menuIcn} height="24" width="24" alt={''} />
                  </a></li>
                </ul>
              </div>
              <div className={`line border_color_${theme}`}></div>
            </div>



            {/* view minimum listing info */}
            <div className='product-info'>
              <InfiniteScroll
                dataLength={itemsData?.length}
                next={fetchItem}
                hasMore={!noItems}
                loader={<h4 className='text_color_gradient_dark' style={{
                  display: 'flex', justifyContent: "center", fontSize: '19px',
                  paddingTop: '30px'
                }}>Loading...</h4>}
                scrollThreshold={0.5}
              >
                {
                  itemsData?.map((data, index) => {
                    let check_sale_status = data?.marketList?.includes('pair');
                    const currentAddress = data?.holders[0]?.address;

                    return (
                      <>
                        <div className={`productinfo-des bg_${theme}`} key={index} style={{ marginBottom: "10px" }}
                        >
                          <div className='col_div'>
                            {
                              check_sale_status &&
                              <>
                                <h6 className={`text_color_4_${theme}`}>Current Price</h6>
                                <h5 className={`text_color_4_${theme}`}>
                                  <span className={`text_color_1_${theme}`}>{formatNum(data?.pairItems?.price)} {getCurrencyInfoFromAddress(data?.pairItems?.tokenAdr)?.symbol}</span>
                                </h5>
                              </>
                            }
                            <span className='nft_detalis_card'>
                              Owner :- <p className="text_color_gradient_dark" >{shorter(data?.holders[0]?.address)}</p>
                            </span>
                            <span className='nft_detalis_card'>
                              Token Id :- <p className="text_color_gradient_dark" >{data?.tokenId}</p>
                            </span>
                          </div>
                          <div className='col_div'>

                            {check_sale_status ? (
                              account?.toLowerCase() === currentAddress ? (
                                <button class='custom_btn fillBtn' onClick={() => delistPairItem(data?.pairItems)}>
                                  Delist
                                </button>
                              ) : (
                                <button class='custom_btn fillBtn' onClick={() => buyItem(item?.pairItems)}>
                                  Buy Now
                                </button>
                              )
                            ) : (
                              <button class='custom_btn fillBtn' disabled>
                                Not for Sale
                              </button>
                            )}
                          </div>
                        </div>
                      </>
                    )
                  })
                }
              </InfiniteScroll>

            </div>



          </div>
        </div>



      </div>


      {
        item && pairItem && account &&
        <ModalBuy
          item={item}
          pairItem={pairItem}
          setPairItem={setPairItem}
          showBuyNowModal={showBuyNowModal}
          setShowBuyNowModal={setShowBuyNowModal}
        />
      }
      {
        item && pairItem && account &&
        <ModalDelist
          item={item}
          pairItem={pairItem}
          setPairItem={setPairItem}
          showUnlistMarketPlace={showUnlistMarketPlace}
          setShowUnlistMarketPlace={setShowUnlistMarketPlace}
        />
      }



    </>
  );
}

export default Details;