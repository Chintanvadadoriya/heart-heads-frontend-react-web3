/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";

import { apiEndPoint } from "../../routes/routes";
import { useActiveWeb3React } from "../../hooks/useActiveWeb3React";

import GraphicsImg from "../../assets/images/graphics-img.png";
import GraphicsImgTwo from "../../assets/images/graphics-img-2.png";

import PLSImg from "../../assets/images/lps-icon.svg";
import LoaderImg from "../../assets/images/Loading.gif";
// import LoaderImg from '../../assets/images/logo-heart-heads.gif';
import animationDatas from "../../lotties/Loading.json";
import animationData from "../../lotties/party-confetti";
import Checkbox from '@mui/material/Checkbox';

import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Tab,
  Tabs,
} from "@mui/material";
import {
  a11yProps,
  capitalizeFirstLetter,
  formatNum,
  getRarityClass,
  getRarityName,
  getRaritySrc,
} from "../../utils";
import CustomTabPanel from "../CustomTabPanel";

import "./CatalogInventory.scss";
import ModalListFixPrice from "../model/ModalListFixPrice";
import ModalBuy from "../model/ModalBuy";
import { getCurrencyInfoFromAddress } from "../../contract";
import ModalDelist from "../model/modal-delist";
import ModalTransfer from "../model/modal-transfer";
import { Tokens } from "../../constant";
import { Link } from "react-router-dom";

const CatalogInventory = (props) => {
  const { tabValue } = props

  let composed = true; // This bool is customized for all nft specific address list
  const { account } = useActiveWeb3React();
  const history = useHistory();
  const [value, setValue] = useState(+tabValue || 0);
  const [loadingProcess, setloadingProcess] = useState({
    loading: false,
    disable: false,
  });
  const [myInventoryItems, setmyInventoryItems] = useState([]);
  const [datainventory, setdatadatainventory] = useState([]);
  const [myCatalog, setMyCatalog] = useState([]);
  const [catalog, setcatalog] = useState([]);

  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [categoryType, setcategoryType] = useState("All");

  const [showPutMarketPlace, setShowPutMarketPlace] = useState(false);
  const [holding, setHolding] = useState(0);
  // const [available, setAvailable] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [item, setItem] = useState(null);

  const [showBuyNowModal, setShowBuyNowModal] = useState(false);
  const [pairItem, setPairItem] = useState(null);
  const [countPage, setCountPage] = useState(0);
  const [countRecord, setCountRecord] = useState({
    noteSell: 0,
    sell: 0
  });
  const [rarityFilter, setRarityFilter] = useState(false);
  const [rarityFilterName, setrarityFilterName] = useState('');
  const [currentTraitType, setcurrentTraitType] = useState('')
  const [selectedFilterPrice, SetselectedFilterPrice] = useState('');
  const [priceRanges, setPriceRanges] = useState();
  const [priceFilter, setPriceFilter] = useState(false);

  const [checkSellstatus, setCheckSellstatus] = useState({
    onSell: false,
    onNotSell: false
  });
  const [showUnlistMarketPlace, setShowUnlistMarketPlace] = useState(false);
  const [showSendNFTModal, setShowSendNFTModal] = useState(false);
  const [checkedList, setCheckedList] = useState([]);
  const [currencySymbol,setCurrencySymbol]=useState()
  const [currencySymbolactive,setCurrencySymbolActive]=useState('')
  const [nftDetails,setNftDetails]=useState({
    is_marketList:'',
    is_not_marketList:'',
    currency:'',
    traitType:'',
    category:''
  })

  const SORT_ORDER_HIGH_TO_LOW = 'highToLow';


  // handleResponseCatalog function 
  const handleResponseCatalog = (responseData) => {
    setcatalog(responseData?.data);
    setCountPage(responseData?.data?.totalPages || 0);
    setCountRecord((prevState) => ({
      ...prevState,
      noteSell: responseData?.data?.not_sell_count || 0,
      sell: responseData?.data?.sell_count || 0,
    }));
    setloadingProcess({ loading: false });
  };

  // // Function to get the sort order based on the selected filter catalog v1
  // const getSortOrder = (selectedFilterPrice) => {
  //   return selectedFilterPrice === SORT_ORDER_HIGH_TO_LOW ? 'desc' : 'asc';
  // };

   // Function to get the sort order based on the selected filter catalog v2
   const getSortOrder = (selectedFilterPrice) => {
    return selectedFilterPrice === SORT_ORDER_HIGH_TO_LOW ? 'desc' : 'asc';
  };

  // change tab value
  function handleChange(event, newValue) {
    setValue(newValue);
  }


  // page change function
  function handlePageChange(event, newPage, category = categoryType,currency) {
    switch (value) {
      case 0:
        fetchinventory(composed, newPage);
        console.log("no data right now");
        break;
      case 1:
        if(checkSellstatus.onSell && rarityFilter){
          MyInventoryRarityFilter(category, newPage, rarityFilterName,true)
        }
        else if(checkSellstatus.onNotSell && rarityFilter){
          MyInventoryRarityFilter(category, newPage, rarityFilterName,"",true)
        }
        else if(rarityFilter) {
          MyInventoryRarityFilter(category, newPage, rarityFilterName) 
        }
        else if(checkSellstatus.onSell){
         fetchinventory(category, newPage, "",true)
        }
       else if(checkSellstatus.onNotSell){
         fetchinventory(category, newPage, "","",true)
        }
        else if(checkedList.length != 0){
         fetchinventory(category, newPage, checkedList);
        }
        else{
           fetchinventory(category, newPage)
        }
          
        break;
      case 2:
        if (rarityFilter) {
          if (checkSellstatus.onNotSell) {
            catalogBayNowNftList(category,newPage,"","","","","","yes",rarityFilterName);
          }
           else if (checkSellstatus.onSell) {
            const sortOrder = getSortOrder(selectedFilterPrice);
            rarityFilterName ? catalogBayNowNftList(category,newPage,'price',sortOrder,"","","","",rarityFilterName) :
              catalogBayNowNftList(category,newPage,'','',"allminteditems","","","",rarityFilterName);
          } else if (selectedFilterPrice) {
             // catalog v1 code 
            // const sortOrder = getSortOrder(selectedFilterPrice);
            // catalogBayNowNftList(category,newPage,"price",sortOrder,"","","","",rarityFilterName,'yes');
            const sort = getSortOrder(selectedFilterPrice);
            catalogBayNowNftList(category,newPage,"",'',"","","","",rarityFilterName,'',sort);
          } else {
            catalogBayNowNftList(category,newPage,"","","allminteditems","","","",rarityFilterName)
          }
        } else {
          if (checkSellstatus.onNotSell) {
             catalogBayNowNftList(category,newPage,"","","","","",'yes')
          } else if(currencySymbol){
            catalogBayNowNftList(category,newPage,"","","","",currency)

          }
          else if(priceFilter && checkSellstatus.onSell){
            // catalog v1 code

            // const sortOrder = getSortOrder(selectedFilterPrice);
            // catalogBayNowNftList(categoryType, newPage, 'price', sortOrder,'','','','',currentTraitType,'yes');

            const sort = getSortOrder(selectedFilterPrice);
            catalogBayNowNftList(categoryType, newPage, '', '','','','','',currentTraitType,'',sort);


          }
           else if (checkSellstatus.onSell) {
            catalogBayNowNftList(category,newPage,"",'',"","","","");

          } else if (checkedList) {
            catalogBayNowNftList(category, newPage, "_", "_", 'allminteditems', checkedList)
          }
         
          else {
            catalogBayNowNftList(category, newPage, '_', '_', 'allminteditems');
          }
        }

        break;
      default:
        break;
    }
  }

  // check trait type function All",God Tier,Legendary,Rare,Common,All
  function fetchInventoryByCategory(category, newpage) {
    setcategoryType(category);
    switch (value) {
      case 0:
        fetchinventory(composed, newpage);
        console.log("fetch Inventory By Category");
        break;
      case 1:
        setActiveCategory(category);
        if(checkSellstatus.onSell && rarityFilter){
          MyInventoryRarityFilter(category, newpage, rarityFilterName,true)
        }
        else if(checkSellstatus.onNotSell && rarityFilter){
          MyInventoryRarityFilter(category, newpage, rarityFilterName,"",true)
        }
        else if (rarityFilter) {
          MyInventoryRarityFilter(category, newpage, rarityFilterName)
        }else if(checkSellstatus.onSell && category){
          fetchinventory(category, newpage, "",true)
        }
        else if(checkSellstatus.onNotSell && category){
          fetchinventory(category, newpage, "","",true)
        }
        else if(checkedList.length !==0) {
          fetchinventory(category, newpage, checkedList)
        }else{
          fetchinventory(category, newpage)
        }
        break;
      case 2:
        // Set active category
        setActiveCategory(category);

        // Determine the catalog action based on different conditions
        if (checkSellstatus.onNotSell) {
          rarityFilterName?catalogBayNowNftList(category,newpage,"","","","","",'yes',rarityFilterName):
          catalogBayNowNftList(category,newpage,"","","","","",'yes');
        }
        else if(currencySymbol){
          catalogBayNowNftList(category, newpage,'','','','',currencySymbol)
        } 
        else if (priceFilter && checkSellstatus.onSell) {
          //  catalog v1 code
          // const sortOrder = getSortOrder(selectedFilterPrice);
          // catalogBayNowNftList(category,newpage,'price', sortOrder,"","","","",rarityFilterName,'yes')

          const sort = getSortOrder(selectedFilterPrice);
          catalogBayNowNftList(category,newpage,'', '',"","","","",rarityFilterName,'',sort)
        }
        else if (checkSellstatus.onSell) {
          rarityFilterName ? catalogBayNowNftList(category,newpage,"","","","","","",rarityFilterName) :
            catalogBayNowNftList(category, newpage);
        } else if (rarityFilter) {
          catalogBayNowNftList(category,newpage,"","","allminteditems","","","",rarityFilterName)
        } 
         else {
          checkedList?catalogBayNowNftList(category, newpage, '_', '_', 'allminteditems',checkedList):catalogBayNowNftList(category, newpage, '_', '_', 'allminteditems');
        }
        break;
      default:
        break;
    }
  }

  // fetch MyInvemtory data
  async function fetchinventory(type, page,name,onsale,notsale) {
    try {
      setloadingProcess({ loading: true });
      setPage(page || 1);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/${apiEndPoint.MYINVENTORY_ITEMS_HH}`,{
          params:{
            id:account,
            type:type,
            page:page,
            limit:limit,
            name:name,
            onsale,
            notsale
          }
        }
      );

      if (response?.status === 200) {
        setmyInventoryItems(response?.data);
        setdatadatainventory(response?.data?.items);
        setCountPage(response?.data?.totalPages || 0);
        setCountRecord((prevState) => ({
          ...prevState,
          noteSell: response?.data?.notsale || 0,
          sell: response?.data?.onsale || 0,
        }));
        setloadingProcess({ loading: false });
      }
    } catch (error) {
      console.error("fetch data MYINVENTORY_ITEMS_HH 1612", error);
      setmyInventoryItems([]);
      setdatadatainventory([]);
      setloadingProcess({ loading: false });
    }
  }

  // fetch catalog data
  async function catalogBayNowNftList(type, page, sortField, sortOrder, allminteditems,name,currency,not_on_sale,trait_type,price_filter,sort) {

    try {
      setloadingProcess({ loading: true });

      setPage(page || 1);

      const response = await axios.get(`${process.env.REACT_APP_API}/${apiEndPoint.CATALOG_STACKED_NFT}`, {
        params: {
          type: type,
          page: page,
          limit: limit,
          sortField,
          sortOrder,
          allminteditems,
          name,
          currency,
          not_on_sale:not_on_sale,
          trait_type:trait_type,
          price_filter:price_filter,
          sort:sort
        },
      });

      if (response?.status === 200) {
        setMyCatalog(response?.data)
        handleResponseCatalog(response)
      }

    } catch (error) {
      console.error("fetch data CATALOG_BUY_NOW_NFT_HH 1612", error);
      setcatalog([]);
      setloadingProcess({ loading: false });
    }
  }

  // set tab base on value,compose,my inventory,catalog
  function fetchDataBasedOnValue() {
    switch (value) {
      case 0:
        fetchinventory(composed, 1);
        break;
      case 1:
        if (account) {
          fetchinventory("All", 1);
        }
        break;
      case 2:
        catalogBayNowNftList("All", 1, '_', '_', 'allminteditems');
        break;

      default:
        break;
    }
  }

  // get item function function 
  async function getItemDetails(itemCollection, tokenId) {
    try {
      setIsLoading(true);
      let res = await axios.get(
        `${process.env.REACT_APP_API}/item_detail/${itemCollection}/${tokenId}`
      );
      setIsLoading(false);
      if (res.data.status) {
        setItem(res.data.item);
      }
      return res.data.item
    } catch (e) {
      setIsLoading(false);
      setItem(null);
    }
  }

  // seal nft function
  async function handleSellNft(data) {
    let { itemCollection, tokenId } = data;
    try {
      await getItemDetails(itemCollection, tokenId);
    } catch (error) {
      console.error('1612 seal nft', error)
      console.log("1612 seal nft", error)
    }
    finally {
      setShowPutMarketPlace(true);
    }
  }

  // buy nft function
  async function BayNftCatalog(pair) {
    let { pairItems, tokenId, itemCollection } = pair;
    setPairItem(pairItems);

    try {
      if (isLoading) return;
      await getItemDetails(itemCollection, tokenId);
    } catch (error) {
      console.error('1612 buy nft', error)
      console.log("1612 buy nft", error)
    }
    finally {
      setShowBuyNowModal(true);
    }
  }
  // delistPairItem function
  async function delistPairItem(pair) {
    let { pairItems, tokenId, itemCollection } = pair;
    setPairItem(pairItems);
    try {
      if (isLoading) return;
      await getItemDetails(itemCollection, tokenId);
    } catch (error) {
      console.error('1612 delistPairItem', error)
      console.log("1612 delistPairItem", error)
    } finally {
      setShowUnlistMarketPlace(true);

    }
  }
  // send nft function
  async function handleSendNFT(data) {
    let { itemCollection, tokenId } = data;
    try {
      let item_data = await getItemDetails(itemCollection, tokenId);
      if (account && item_data) {
        let holdingAmount = 0;
        let owned = item_data.holders.filter(holder => holder.address === account.toLowerCase());
        for (let index = 0; index < owned.length; index++) {
          let holder = owned[index];
          holdingAmount = holdingAmount + holder.balance;
        }
        console.log('1612', holdingAmount)
        setHolding(holdingAmount);
      }
    } catch (error) {
      console.error('1612 send nft', error)
      console.log("1612 send nft", error)
    }
    finally {
      setShowSendNFTModal(true)
    }

  }

  useEffect(() => {
    if (account && value === 1) {
      fetchinventory("All");
    }
    if (value === 0) {
      fetchinventory("composed");
    }
    if (value === 2) {
      catalogBayNowNftList("All", 1, '_', '_', 'allminteditems');
    }
    fetchDataBasedOnValue();
  }, [account, value, tabValue]);

  // my inventory filter with trait type  background,base,hat,sunglasses,clothes,Nacklace,earrings
  async function MyInventoryRarityFilter(category, page, trait_type,onsale,notsale) {
    setcurrentTraitType(trait_type)
    try {
      setrarityFilterName(trait_type)
      setloadingProcess({ loading: true });
      setPage(page || 1);
      const response = await axios.get(
        `${process.env.REACT_APP_API}/${apiEndPoint.MYINVENTORY_ITEMS_RARITY_FILTER}`, {
        params: {
          id: account,
          type: category,
          trait_type: trait_type,
          page: page,
          limit: limit,
          onsale,
          notsale
        }
      }
      );

      if (response?.status === 200) {
        setdatadatainventory(response?.data?.items);
        setCountPage(response?.data?.totalPages || 0);
        setRarityFilter(true)
        setloadingProcess({ loading: false });
      }
    } catch (error) {
      console.error("fetch data MYINVENTORY_ITEMS_RARITY_FILTER 1612", error);
      setdatadatainventory([]);
      setloadingProcess({ loading: false });
    }
  }

  async function InventoryRarityFilter(categoryType, page, rarity){
    if(checkSellstatus.onSell){
    MyInventoryRarityFilter(categoryType, page, rarity,true)
    }else if(checkSellstatus.onNotSell){
    MyInventoryRarityFilter(categoryType, page, rarity,"",true)
    }else{
    MyInventoryRarityFilter(categoryType, page, rarity)
    }
  }

  // // price range filter high to low and low to high  version v1
  // function handleChangeSelectPriceRage(e) {
  //   setPriceFilter(true)
  //   let priceRage = e.target.value
  //   let sortField = 'price'
  //   let sortOrder = priceRage === "highToLow" ? 'desc' : 'asc'
  //   setPriceRanges(e.target.value)
  //   SetselectedFilterPrice(priceRage)
  //   if (priceRage === 'recentlyListed') {
  //     handleResetCatalogFilter()
  //   } else if (priceRage && rarityFilter) {
  //     catalogBayNowNftList(categoryType, page, sortField, sortOrder,'','','','',currentTraitType,'yes');

  //   } else if (currentTraitType) {
  //     catalogBayNowNftList(categoryType, page, sortField, sortOrder,'','','','',currentTraitType,'yes');
  //   } else {
  //     // catalogBayNowNftList(categoryType, 1, sortField, sortOrder)
  //     catalogBayNowNftList(categoryType, page, sortField, sortOrder,'','','','',currentTraitType,'yes');
  //     setCheckSellstatus({ onNotSell: false, onSell: true })
  //   }

  // }

  // item stacked price range filter high to low and low to high  version v2
  function handleChangeSelectPriceRage(e) {
    setPriceFilter(true)
    let priceRage = e.target.value
      let sort = priceRage === "highToLow" ? 'desc' : 'asc'
    setPriceRanges(e.target.value)
    SetselectedFilterPrice(priceRage)
    if (priceRage === 'recentlyListed') {
      handleResetCatalogFilter()
    } else if (priceRage && rarityFilter) {
      catalogBayNowNftList(categoryType, 1, '', '','','','','',currentTraitType,'',sort);

    } else if (currentTraitType) {
      catalogBayNowNftList(categoryType, 1, '', '','','','','',currentTraitType,'',sort);
    } else {
      // catalogBayNowNftList(categoryType, 1, sortField, sortOrder)
      catalogBayNowNftList(categoryType, 1, '', '','','','','',currentTraitType,'',sort);
      setCheckSellstatus({ onNotSell: false, onSell: true })
    }

  }

  // Reset all filter for my inventory tab
  function handleResetMyinventory() {
    fetchinventory("All", 1)
    resetCommonFilter()
    setCheckedList([])
    setCheckSellstatus({ onNotSell: false, onSell: false })


  }

  // common Filter
  function resetCommonFilter(){
    SetselectedFilterPrice('')
    setcurrentTraitType('')
    setRarityFilter(false)
    setActiveCategory('All')
    setrarityFilterName('')
    setcategoryType("All")
    setCurrencySymbol()
    setCurrencySymbolActive('')
    setPriceFilter(false)

  }
  

  // Reset all filter for catlog tab
  function handleResetCatalogFilter() {
    catalogBayNowNftList("All", 1, '_', '_', 'allminteditems');
    setCheckSellstatus({ onNotSell: false, onSell: false })
    resetCommonFilter()
    setCheckedList([])
    setActiveCategory('All')

  }

  // function for filter catalog rarity and not on seal rarity ,
  async function catalogPageRarity(type, page, trait_type, sortField, sortOrder) {
  
    if (checkSellstatus.onNotSell) {
      catalogBayNowNftList(type, page, "", "", '',"","","yes",trait_type)
    }
    else if (checkSellstatus.onSell) {
      catalogBayNowNftList(type, page, "", "", '',"","","",trait_type)
    } else {
      catalogBayNowNftList(type, page, "", "", 'allminteditems',"","","",trait_type)
    }
  }
  // notOnSell
  async function notOnSellCatalog() {
    setNftDetails((pv)=>({is_marketList:'',is_not_marketList:'yes',currency:'',traitType:'',category:''})) // set flage for show detail page
    setCheckSellstatus({ onNotSell: true, onSell: false })
    catalogBayNowNftList('All', 1,"","","","","",'yes')
    SetselectedFilterPrice('recentlyListed')
    setActiveCategory('All')
    setcategoryType("All")
    setcurrentTraitType('')
    setCurrencySymbolActive('')


  }
  async function OnSellCatalog() {
    setNftDetails((pv)=>({is_marketList:'yes',is_not_marketList:'',currency:'',traitType:'',category:''})) // set flage for show detail page
    setCheckSellstatus({ onNotSell: false, onSell: true })
    catalogBayNowNftList('All', 1,)
    SetselectedFilterPrice('recentlyListed')
    setActiveCategory('All')
    setcategoryType("All")
    setcurrentTraitType('')
  }

  async function OnSellInventory() {
    fetchinventory('All', 1,"",true)
    setCheckSellstatus({ onNotSell: false, onSell: true })
    setcurrentTraitType('')
    setActiveCategory('All')



  }
  async function NotSellInventory() {
    fetchinventory('All', 1,"","",true)
    setCheckSellstatus({ onNotSell: true, onSell: false })
    setcurrentTraitType('')
    setActiveCategory('All')
  }

  // Change CheckBox
  const handleChangeCheckBox = (value) => {
    setNftDetails((pv)=>({is_marketList:'',is_not_marketList:'',currency:'',traitType:'yes',category:''}))
    // Check if the checkbox value is already in the list
    if (checkedList.includes(value)) {
      setCheckedList(checkedList.filter(item => item !== value));
    } else {
      setCheckedList([...checkedList, value]);
    }
    resetCommonFilter()
    setCheckSellstatus({ onNotSell: false, onSell: false })

  };

  // call api if change check box value
  const fetchTraitDataCatalog = async () => {
    try {
      catalogBayNowNftList("All", 1, "_", "_", 'allminteditems', checkedList)
    } catch (error) {
      console.error('Error fetch Trait Data:', error);
    }
  };

  const fetchTraitDataInventory = async () => {
    try {
      fetchinventory("All", 1, checkedList)
    } catch (error) {
      console.error('Error fetch Trait Data:', error);
    }
  };
  
  // Call the API initially or whenever checkedList changes
  useEffect(() => {
  if( value ===2)  fetchTraitDataCatalog();
  if(value ===1)  fetchTraitDataInventory()
  }, [checkedList]);

  const handleCurrencyChange=(currency,address)=>{
    setNftDetails((pv)=>({is_marketList:'',is_not_marketList:'',currency:address.toLowerCase(),traitType:'',category:''})) // set flage for show detail page
    setCurrencySymbol(currency);
    setCurrencySymbolActive(currency)
    setcurrentTraitType('')
    catalogBayNowNftList("All", 1, '', '', '','',currency)
  }
  const handleChangeCatalogRarity=(ele)=>{
    setNftDetails((pv)=>({is_marketList:'',is_not_marketList:'',currency:'',traitType:'',category:'yes'}))

    setrarityFilterName(ele)
    setcurrentTraitType(ele)
    setRarityFilter(true) // set trait value set like background,base,
    setCurrencySymbolActive('')
    catalogPageRarity(categoryType, 1, ele)

  }

  const handleShowDetails = (name) => {
    history.push({
      pathname:`/detail/${name?.trait_name}`,
      state: { detailData: nftDetails },
      initData:name
    });
  };

  return (
    <>
      <div className='catalog-main'>
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
                  <Tab label='Composed' {...a11yProps(0)}>
                    <span className='shape-trinagle'></span>
                  </Tab>
                  <Tab label='Inventory' {...a11yProps(1)} />
                  <Tab label='Catalog' {...a11yProps(2)} />
                </Tabs>
              </Box>
              <CustomTabPanel value={value} index={0} className='tabs-block-main'>
                <div className='tab-inner'>
                  {!loadingProcess.loading ? (
                    !loadingProcess.loading && !datainventory?.length ? (
                      <div
                        className='text_color_gradient_dark'
                        style={{
                          width: '100%',
                          height: '20vh',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          // marginTop: "175px",
                          fontSize: '1.5rem'
                        }}>
                        No items found!
                      </div>
                    ) : (
                      datainventory?.map((data) => {
                        return (
                          <div className='tab-inner-main'>
                            <div className='common-tabs-inner'>
                              <div className='img-block'>
                                <img src={data?.image} alt='' />
                                {/* <p>
																	Rarity:{" "}
																	<span>
																		10%
																	</span>
																</p> */}
                              </div>
                              {/* <button class="custom_btn fillBtn">
																Customize
															</button> */}
                              {/* <br /> */}
                              <br />
                              <div className='mobile-btn'>
                                {/* <button class='custom_btn fillBtn border-button' onClick={() => handleSellNft(data)} >
																	Sell
																</button> */}
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )
                  ) : (
                    <div
                      className='text_color_gradient_dark'
                      style={{
                        width: '100%',
                        height: '20vh',
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '175px',
                        fontSize: '1.5rem'
                      }}>
                      <img src={LoaderImg} alt='' />
                    </div>
                  )}
                </div>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1} className='tabs-block-main'>
                <div className='tabs-block-main-inner'>
                  <div className='tabs-block-main-inner-button-flex'>
                    <div className='tabs-block-main-inner-button'>
                      {['All', 'God Tier', 'Legendary', 'Ultra Rare', 'Rare', 'Common', 'Special'].map((category) => (
                        <button
                          key={category}
                          style={{
                            backgroundColor: activeCategory === category ? 'green' : ''
                          }}
                          onClick={() => fetchInventoryByCategory(category, 1)}>
                          {category}
                        </button>
                      ))}

                      <button onClick={handleResetMyinventory}>Reset Filter</button>
                    </div>
                   
                  </div>
                  <div className='tabs-block-main-back'>
                    <div className='tabs-block-main-back-left'>
                      <div className='tabs-block-main-back-left-inner'>
                        <a
                          style={{
                            backgroundColor: checkSellstatus.onSell ? '#234f85' : ''
                          }}
                          onClick={OnSellInventory}>
                          <p>On Sale</p>
                          <span>{countRecord.sell}</span>
                        </a>
                      </div>
                      <div className='tabs-block-main-back-left-inner'>
                        <a
                          style={{
                            backgroundColor: checkSellstatus.onNotSell ? '#234f85' : ''
                          }}
                          onClick={NotSellInventory}>
                          <p>Not On Sale</p>
                          <span>{countRecord.noteSell}</span>
                        </a>
                      </div>
                      <div className='tabs-block-main-back-left-inner acco-tab-inner'>
                        <Accordion>
                          <AccordionSummary aria-controls='panel1-content' id='panel1-header'>
                            Categories
                          </AccordionSummary>
                        <AccordionDetails>
                          {myInventoryItems?.totalTraitCount?.map((ele, index) => (
                            <>
                              {ele?.name && (
                                <a
                                  style={{
                                    backgroundColor: currentTraitType === ele?.name ? '#234f85' : ''
                                  }}
                                  onClick={() => InventoryRarityFilter(categoryType, 1, ele?.name)}>
                                  <p>{capitalizeFirstLetter(ele?.name)}</p>
                                  <span>{ele?.count || 0}</span>
                                </a>
                              )}
                            </>
                          ))}
                        </AccordionDetails>
                        </Accordion>

                      </div>
                      <div className='tabs-block-main-back-left-inner acco-tab-inner'>
                        <Accordion>
                          <AccordionSummary aria-controls='panel1-content' id='panel1-header'>
                            Traits
                          </AccordionSummary>
                          {myInventoryItems?.collectionInfo?.map((data, index) => {
                            const { name, count } = data;
                            const removeTraitData = ['composed', 'rarity'];

                            if (removeTraitData.includes(data.name)) {
                              delete data.name;
                              delete data.count;
                              delete data.traitsValues;
                            }

                            return (
                              <>
                                {data?.hasOwnProperty('name') && (
                                  <AccordionDetails key={index}>
                                    <Accordion className='inner-activity-block'>
                                      <AccordionSummary aria-controls='panel1-content' id='panel1-header'>
                                        <span>{capitalizeFirstLetter(name)}</span>
                                        <span>{count}</span>
                                      </AccordionSummary>
                                      {data?.traitsValues?.map((val, index) => {
                                        let { count, value } = val;
                                        return (
                                          <>
                                            <AccordionDetails key={index}>
                                              <div className='inner-activity-block-check'>
                                                <div className='inner-activity-block-check-inner'>
                                                  <div className='text-count-number-check'>
                                                    <Checkbox
                                                      key={index}
                                                      value={value}
                                                      checked={checkedList.includes(value)}
                                                      onChange={() => handleChangeCheckBox(value)}
                                                    />
                                                    <span className='category-block'>{value}</span>
                                                  </div>
                                                  <div className='text-count-number'>
                                                    <p>{count}</p>
                                                  </div>
                                                </div>
                                              </div>
                                            </AccordionDetails>
                                          </>
                                        );
                                      })}
                                    </Accordion>
                                  </AccordionDetails>
                                )}
                              </>
                            );
                          })}
                        </Accordion>
                      </div>
                    </div>
                    <div className='tab-inner'>
                      {!loadingProcess.loading ? (
                        !loadingProcess.loading && !datainventory?.length ? (
                          <div
                            className='text_color_gradient_dark'
                            style={{
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              // marginTop: "250px",
                              fontSize: '1.5rem'
                            }}>
                            No items found!
                          </div>
                        ) : (
                          datainventory?.map((data) => {
                            let check_sale_status = data.marketList.includes('pair');

                            let currency = getCurrencyInfoFromAddress(data?.tokenAdr);
                            const classAdd = data?.attributes[1];
                            const name = data?.attributes[0];
                            return (
                              <>
                                <div className='tab-inner-main'>
                                  {
                                    <div className='common-tabs-inner'>
                                      <div className='img-block'>
                                        <img src={data.image} alt='' />
                                        <div className={`category-block-gif ${getRarityClass(classAdd)}`}>
                                          <img src={getRaritySrc(classAdd)} alt='' />
                                          <span>{getRarityName(classAdd)}</span>
                                        </div>
                                        {check_sale_status && <h3 className='one-sale-tag'>On Sale</h3>}
                                      </div>
                                      <div className='content-block-category'>
                                        <h4>{name?.value}</h4>
                                        <div className='content-block-category-inner'>
                                          <span>Last Sold Price:</span>
                                          <span>
                                            {formatNum(data?.price) !== 'NaNB' ? formatNum(data?.price) : ' '}

                                            {currency?.symbol}
                                          </span>
                                        </div>
                                      </div>
                                      <div className='mobile-btn'>
                                        <button
                                          onClick={() => history.push(`/customization/${data?._id}`)}
                                          className='custom_btn fillBtn'>
                                          Equip
                                        </button>

                                        {check_sale_status ? (
                                          <button
                                            class='custom_btn fillBtn border-button'
                                            onClick={() => delistPairItem(data)}>
                                            Delist
                                          </button>
                                        ) : (
                                          <button
                                            class='custom_btn fillBtn border-button'
                                            onClick={() => handleSellNft(data)}>
                                            Sell
                                          </button>
                                        )}
                                        <button
                                          class='custom_btn fillBtn border-button'
                                          onClick={() => handleSendNFT(data)}>
                                          Send
                                        </button>
                                      </div>
                                    </div>
                                  }
                                </div>
                              </>
                            );
                          })
                        )
                      ) : (
                        <div
                          className='text_color_gradient_dark'
                          style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            marginTop: '250px',
                            fontSize: '1.5rem'
                          }}>
                          <img src={LoaderImg} alt='' />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CustomTabPanel>
              <CustomTabPanel value={value} index={2} className='tabs-block-main'>
                <div className='tabs-block-main-inner'>
                  <div className='tabs-block-main-inner-button-flex'>
                    <div className='tabs-block-main-inner-button'>
                      {['All', 'God Tier', 'Legendary', 'Ultra Rare', 'Rare', 'Common', 'Special'].map((category) => (
                        <button
                          key={category}
                          style={{
                            backgroundColor: activeCategory === category ? 'green' : ''
                          }}
                          onClick={() => fetchInventoryByCategory(category, 1)}>
                          {category}
                        </button>
                      ))}
                      <button onClick={handleResetCatalogFilter}>Reset Filter</button>
                    </div>
                    <div className='select-dropdown'>
                      <FormControl fullWidth>
                        <InputLabel id='demo-simple-select-label'>Filters</InputLabel>
                        <Select
                          labelId='demo-simple-select-label'
                          id='demo-simple-select'
                          label='Recently Created'
                          onChange={handleChangeSelectPriceRage}
                          value={selectedFilterPrice || 'recentlyListed'}>
                          <MenuItem value='recentlyListed'>Recently Listed</MenuItem>
                          <MenuItem value='highToLow'>High to Low</MenuItem>
                          <MenuItem value='lowToHigh'>Low to High</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                  <div className='tabs-block-main-back'>
                    <div className='tabs-block-main-back-left'>
                      <div className='tabs-block-main-back-left-inner'>
                        <a
                          style={{
                            backgroundColor: checkSellstatus.onSell ? '#234f85' : ''
                          }}
                          onClick={OnSellCatalog}>
                          <p>On Sale</p>
                          <span>{countRecord.sell}</span>
                        </a>
                      </div>
                      <div className='tabs-block-main-back-left-inner'>
                        <a
                          style={{
                            backgroundColor: checkSellstatus.onNotSell ? '#234f85' : ''
                          }}
                          onClick={notOnSellCatalog}>
                          <p>Not On Sale</p>
                          <span>{countRecord.noteSell}</span>
                        </a>
                      </div>
                      <div className='tabs-block-main-back-left-inner acco-tab-inner'>
                        <Accordion>
                          <AccordionSummary aria-controls='panel1-content' id='panel1-header'>
                            Currency
                          </AccordionSummary>
                          <AccordionDetails>
                          {Tokens?.map((ele, index) => {
                                return (
                                    <>
                                        {ele?.symbol && (
                                            <a
                                                key={index} // Add a unique key to each mapped element
                                                style={{
                                                    backgroundColor:currencySymbolactive=== ele?.symbol ? '#234f85' : ''
                                                    

                                                }}
                                                onClick={() => handleCurrencyChange(ele?.symbol,ele?.address)}
                                            >
                                                <img style={{width:"30px"}} src={ele?.logoURI} alt="No Symbol"/>
                                                <p>{capitalizeFirstLetter(ele?.symbol)}</p>
                                            </a>
                                        )}
                                    </>
                                );
                            })}

                          </AccordionDetails>
                        </Accordion>
                      </div>
                      <div className='tabs-block-main-back-left-inner acco-tab-inner'>
                        <Accordion>
                          <AccordionSummary aria-controls='panel1-content' id='panel1-header'>
                            Categories
                          </AccordionSummary>
                          <AccordionDetails>
                            {myCatalog?.totalTraitCount?.map((ele, index) => (
                              <>
                                {ele?.name && (
                                  <a
                                    style={{
                                      backgroundColor: currentTraitType === ele?.name ? '#234f85' : ''
                                    }}
                                    onClick={() => handleChangeCatalogRarity(ele?.name)}>
                                    <p>{capitalizeFirstLetter(ele?.name)}</p>
                                    <span>{ele?.count || 0}</span>
                                  </a>
                                )}
                              </>
                            ))}
                          </AccordionDetails>
                        </Accordion>
                      </div>
                      <div className='tabs-block-main-back-left-inner acco-tab-inner'>
                        <Accordion>
                          <AccordionSummary aria-controls='panel1-content' id='panel1-header'>
                            Traits
                          </AccordionSummary>
                          {myCatalog?.collectionInfo?.traitsTypes?.map((data, index) => {
                            const { name, count } = data;
                            const removeTraitData = ['composed', 'rarity'];

                            if (removeTraitData.includes(data.name)) {
                              delete data.name;
                              delete data.count;
                              delete data.traitsValues;
                            }

                            return (
                              <>
                                {data?.hasOwnProperty('name') && (
                                  <AccordionDetails key={index}>
                                    <Accordion className='inner-activity-block'>
                                      <AccordionSummary aria-controls='panel1-content' id='panel1-header'>
                                        <span>{capitalizeFirstLetter(name)}</span>
                                        <span>{count}</span>
                                      </AccordionSummary>
                                      {data?.traitsValues?.map((val, index) => {
                                        let { count, value } = val;
                                        return (
                                          <>
                                            <AccordionDetails key={index}>
                                              <div className='inner-activity-block-check'>
                                                <div className='inner-activity-block-check-inner'>
                                                  <div className='text-count-number-check'>
                                                    <Checkbox
                                                      key={index}
                                                      value={value}
                                                      checked={checkedList.includes(value)}
                                                      onChange={() => handleChangeCheckBox(value)}
                                                    />
                                                    <span className='category-block'>{value}</span>
                                                  </div>
                                                  <div className='text-count-number'>
                                                    <p>{count}</p>
                                                  </div>
                                                </div>
                                              </div>
                                            </AccordionDetails>
                                          </>
                                        );
                                      })}
                                    </Accordion>
                                  </AccordionDetails>
                                )}
                              </>
                            );
                          })}
                        </Accordion>
                      </div>
                    </div>
                    <div className='tab-inner'>
                      {!loadingProcess.loading ? (
                        !loadingProcess.loading && !catalog?.items?.length ? (
                          <div
                            className='text_color_gradient_dark'
                            style={{
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              fontSize: '1.5rem'
                            }}>
                            No items found!
                          </div>
                        ) : (
                          catalog?.items?.map((data) => {
                            const {count,item,trait_name,maxPrice,minPrice,minUsdPrice,tokenAdr}=data
                            const classAddStacked = item && item.attributes && item.attributes[1] 
                            let check_sale_status = data && item.marketList && item.marketList.includes('pair');
                            let currency = getCurrencyInfoFromAddress(tokenAdr);

                            return (
                                <div className='tab-inner-main'>
                               
                                <>
                                   {
                                   count === 1 ?
                                  
                                    <div className='common-tabs-inner' onClick={()=>handleShowDetails(data)} >
                                       <span style={{
                                        position: 'relative',
                                        color: 'white',
                                        left: '190px',
                                        top: '42px',
                                        borderRadius: '89px',
                                        padding: '2px 9px',
                                        background: 'black',
                                        zIndex:1
                                      }}>{count}</span>
                                    <div className='img-block'>
                                      <img src={item?.image} alt='' />
                                      {item?.attributes[1]?.value != '' && (
                                        <div className={`category-block-gif ${getRarityClass(classAddStacked)}`}>
                                          <img src={getRaritySrc(classAddStacked)} alt='' />
                                          <span>{getRarityName(classAddStacked)}</span>
                                        </div>
                                      )}
                                    </div>
                                    <div className='content-block-category'>
                                      <h4>{trait_name || item?.name}</h4>
                                    </div>
                                  {check_sale_status && <div className="price__info">
                                  
                                     <p>Price:<span style={{display:'flex',gap:'6px'}}>
                                     <img src={currency?.logoURI} alt='' width='20px' height='20px'/>
                                      {formatNum(minPrice || maxPrice)}
                                      </span></p>
                                    
                                    </div>}

                                   </div>
                                
                                  :
                                  <>
                                  <div className="two-img-block-inner"></div>
                                  <div className='common-tabs-inner two-img-block' onClick={()=>handleShowDetails(data)}>
                                      <span style={{
                                        position: 'relative',
                                        color: 'white',
                                        left: '190px',
                                        top: '42px',
                                        borderRadius: '89px',
                                        padding: '2px 9px',
                                        background: 'black',
                                        zIndex:1
                                      }}>{count}</span>
                                    <div className='img-block'>
                                      <img src={item.image} alt='' />
                                      {item?.attributes[1]?.value != '' && (
                                        <div className={`category-block-gif ${getRarityClass(classAddStacked)}`}>
                                          <img src={getRaritySrc(classAddStacked)} alt='' />
                                          <span>{getRarityName(classAddStacked)}</span>
                                        </div>
                                      )}
                                    </div>
                                    <div className='content-block-category'>
                                      <h4>{trait_name || item?.name}</h4>
                                    </div>
                                   {check_sale_status &&
                                    <div className="price__info">
                                     {/* <p>Lowest Price:<span>{formatNum(minPrice)}</span></p> */}
                                     {/* <p>Highest Price:<span>{formatNum(maxPrice)}</span></p> */}
                                     <p>Price:<span style={{display:'flex',gap:'6px'}}>
                                     <img src={currency?.logoURI} alt='' width='20px' height='20px'/>
                                      {formatNum(minPrice)}
                                      </span></p>
                                    </div>
                                    }
                                  </div>
                                  
                                  </>
                                
                                  }
                                </>
                               
                             
                                </div>
                            );
                          })
                        )
                      ) : (
                        <div
                          className='text_color_gradient_dark'
                          style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            // marginTop: '250px',
                            fontSize: '1.5rem'
                          }}>
                          <img src={LoaderImg} alt='' />
                        </div>
                      )}
                    </div>
                  </div>
                  {/* <div className='showing-result-block'>
							<p>Showing:</p>
							<button>10</button>
							<button>50</button>
							<button>100</button>
						  </div> */}
                </div>
              </CustomTabPanel>

              {countPage && (
                <Pagination
                  count={countPage}
                  onChange={(event, newPage) => handlePageChange(event, newPage, categoryType,currencySymbol)}
                  style={{
                    background: 'azure',
                    display: 'flex',
                    justifyContent: 'end',
                    width: 'fit-content'
                  }}
                  color='primary'
                  page={page}
                />
              )}
            </Box>
          </div>
        </div>
      </div>
      <ModalListFixPrice
        item={item}
        holding={holding}
        // available={available}
        showPutMarketPlace={showPutMarketPlace}
        setShowPutMarketPlace={setShowPutMarketPlace}
      />

      {item && pairItem && account && (
        <ModalBuy
          item={item}
          pairItem={pairItem}
          setPairItem={setPairItem}
          showBuyNowModal={showBuyNowModal}
          setShowBuyNowModal={setShowBuyNowModal}
        />
      )}
      {item && pairItem && account && (
        <ModalDelist
          item={item}
          pairItem={pairItem}
          setPairItem={setPairItem}
          showUnlistMarketPlace={showUnlistMarketPlace}
          setShowUnlistMarketPlace={setShowUnlistMarketPlace}
        />
      )}

      {item && holding > 0 && account && (
        <ModalTransfer
          item={item}
          holding={holding}
          showSendNFTModal={showSendNFTModal}
          setShowSendNFTModal={setShowSendNFTModal}
        />
      )}
    </>
  );
};

export default CatalogInventory;
