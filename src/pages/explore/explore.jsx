/** @format */

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';

import GraphicsImg from '../../assets/images/graphics-img.png';
import GraphicsImgTwo from '../../assets/images/graphics-img-2.png';

import CategoryImg from '../../assets/images/tab-product-img.png';
import RubyGif from '../../assets/images/ruby-gif.gif';

import CustomTabPanel from '../../components/CustomTabPanel';
// import LoaderImg from "../../assets/images/loader-gif.gif";
// import LoaderImg from '../../assets/images/heads-loader-gif.gif';
import LoaderImg from "../../assets/images/Loading.gif";

import { apiEndPoint } from '../../routes/routes';
import './explore.scss';

import { Box, FormControl, InputLabel, MenuItem, Pagination, Select, Tab, Tabs } from '@mui/material';
import { getRarityClass, getRaritySrc } from '../../utils';
import { getTotalrandomMint } from '../../contract';

const Explore = () => {
  const [value, setValue] = useState(0);
  const categoryNames = ['Background', 'Base', 'Clothes', 'Earrings', 'Hats', 'Necklace', 'Sunglasses'];

  const { account, library } = useActiveWeb3React();

  const [loadingProcess, setloadingProcess] = useState({
    loading: false,
    disable: false,
  });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [countPage, setCountPage] = useState(0);
  const [heartHeadsItems, setHeartHeadsItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [rarityType, setRarityType] = useState('background');
  const [total_mintQut, setTotal_mintQut] = useState(38885)
  const [totalMint, setTotalMint] = useState(null)
  
  async function getMintedNft() {
    let total_Mint = await getTotalrandomMint(library);
    return total_Mint // (100/38885)

  }
  useEffect(() => {
    const fetchData = async () => {
      const mintValue = await getMintedNft();
      setTotalMint(mintValue);
    };

    fetchData();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    };
  }

  // page change functionality
  function handlePageChange(event, newPage) {
    hartHeadsRarity(rarityType, activeCategory, newPage)

  }

  // fetch MyInvemtory data
  async function hartHeadsRarity(type, rarity, page) {
    setRarityType(type)
    setActiveCategory(rarity)

    try {
      setloadingProcess({ loading: true });
      setPage(page || 1);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/${apiEndPoint.HEART_HEADS_ITEMS}`,
        {
          params: {
            type,
            rarity,
            page,
            limit
          }
        }
      );

      if (response?.status === 200) {
        setHeartHeadsItems(response?.data)
        setCountPage(response?.data?.totalPages || 0);
        setloadingProcess({ loading: false });
      } else {
        setHeartHeadsItems(response?.data)
        setloadingProcess({ loading: false });
        setCountPage(response?.data?.totalPages || 0);
      }
    } catch (error) {
      console.error("fetch data heart heads items 1612", error);
      setloadingProcess({ loading: false });

    }
  }

  // render  tab base on tab value
  useEffect(() => {
    const categoryMap = {
      0: 'background',
      1: 'base',
      2: 'clothes',
      3: 'earrings',
      4: 'hat',
      5: 'necklace',
      6: 'sunglasses',
    };
    if (categoryMap.hasOwnProperty(value)) {
      const selectedCategory = categoryMap[value];
      hartHeadsRarity(selectedCategory);
      setActiveCategory('All')
    }
    getMintedNft()
  }, [value]);

  async function handleReset() {
    hartHeadsRarity('background')
    setValue(0)
    setActiveCategory('All')

  }


  return (
    <div>
      <div className='catalog-main'>
        {/* <HeaderCnft /> */}
        <div className='common-block-graphics'>
          <img src={GraphicsImg} alt='' />
        </div>
        <div className='common-block-graphics-two'>
          <img src={GraphicsImgTwo} alt='' />
        </div>
        <div className='catalog-tabs'>
          <div className='container'>
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
                  <Tab label='Background' {...a11yProps(0)} />
                  <Tab label='Base' {...a11yProps(1)} />
                  <Tab label='Clothes' {...a11yProps(2)} />
                  <Tab label='Earrings' {...a11yProps(3)} />
                  <Tab label='Hats' {...a11yProps(4)} />
                  <Tab label='Necklace' {...a11yProps(5)} />
                  <Tab label='Sunglasses' {...a11yProps(6)} />
                </Tabs>
              </Box>
              {
                categoryNames.map((data, index) => {

                  return (

                    <CustomTabPanel value={value} index={index} className='tabs-block-main'>
                      <div className='tabs-block-main-inner'>
                        <div className='tabs-block-main-inner-button-flex'>
                          <div className='tabs-block-main-inner-button'>
                            {[
                              "All",
                              "God Tier",
                              "Legendary",
                              "Ultra Rare",
                              "Rare",
                              "Common",
                              "Special",
                            ].map((category) => (
                              <button
                                key={category}
                                style={{
                                  backgroundColor:
                                    activeCategory ===
                                      category
                                      ? "green"
                                      : "",
                                }}
                                onClick={() =>
                                  hartHeadsRarity(
                                    rarityType,
                                    category

                                  )
                                }
                              >
                                {category}
                              </button>
                            ))}

                            <button
                              onClick={handleReset}
                            >
                              Reset Filter
                            </button>
                          </div>
                        </div>

                        <div className='tab-inner'>
                          {
                            loadingProcess?.loading ?
                              <div
                                className="text_color_gradient_dark"
                                style={{
                                  width: "100%",
                                  height: "20vh",
                                  display: "flex",
                                  justifyContent: "center",
                                  marginTop: "175px",
                                  fontSize: "1.5rem",
                                }}
                              >
                                <img src={LoaderImg} alt="" />
                              </div> :
                              heartHeadsItems?.items?.length === 0 ?
                                <div
                                  className="text_color_gradient_dark"
                                  style={{
                                    width: "100%",
                                    height: "20vh",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    // marginTop: "175px",
                                    fontSize: "1.5rem",
                                  }}
                                >
                                  No items found!
                                </div>
                                :
                                heartHeadsItems?.items?.map((item, index) => {

                                  return (
                                    <div className='tab-inner-main' >
                                      <div className='common-tabs-inner'>
                                        <div className='img-block'>
                                          <img src={item?.image} alt='' />
                                          <div className={`category-block-gif ${getRarityClass(item?.rarity)}`}>
                                            <img src={getRaritySrc(item?.rarity)} alt='' />
                                            <span>{item?.rarity}</span>
                                          </div>
                                        </div>
                                        <div className='details-block-mint'>
                                          <h4>{item?.name}</h4>
                                          <h4>
                                            Quantity : <span>{item?.quantity}</span>
                                          </h4>
                                        </div>
                                        <div className='details-block-mint'>
                                          <h4>
                                            Minted : <span>{item?.minted || 0}</span>
                                          </h4>
                                          <h4>
                                            Chance : <span>{((item?.quantity - item?.minted) / (total_mintQut - totalMint) *100).toFixed(5) } %</span>
                                          </h4>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                })
                          }
                        </div>
                      </div>
                    </CustomTabPanel>
                  )
                })
              }
              {countPage && <Pagination
                count={countPage}
                onChange={(event, newPage) => handlePageChange(event, newPage,)}
                style={{
                  background: 'azure',
                  display: 'flex',
                  justifyContent: 'end',
                  width: 'fit-content'
                }}
                color='primary'
                page={page}
              />}
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
