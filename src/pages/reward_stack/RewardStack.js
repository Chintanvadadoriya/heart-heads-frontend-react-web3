import React, { useEffect, useReducer, useState } from 'react'
import './voting.scss';
import VotingImg from '../../assets/images/tab-product-img.png';
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
import { apiEndPoint } from '../../routes/routes';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Pagination } from '@mui/material';
import { HeartHeadRewardStakingContract, HeartHeadWrappedContract, approveRewardStaked } from '../../contract';
import LoaderImg from "../../assets/images/Loading.gif";
import MyRewardStake from '../../components/reward_stake_card/reward_stake_card';
import { convertWerToPLS, formatNum, sleep, toEth } from '../../utils';




// Define action types
const LOADING_START = 'LOADING_START';
const LOADING_FINISH = 'LOADING_FINISH';

// Initial state for buttons loading states
const initialState = {
  stakeAll: false,
  unStakeAll: false,
  unStake: false,
  stake: false,
  claimRewardLoading: false
  // Add more button states if needed
};

const reducer = (state, action) => {
  switch (action.type) {
    case LOADING_START:
      return { ...state, [action.button]: true };
    case LOADING_FINISH:
      return { ...state, [action.button]: false };
    default:
      return state;
  }
};

function RewardStack() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const heartHeadCollection = process.env.REACT_APP_API_ITEM_COLLECTION_ADDRESS
  const { account, library } = useActiveWeb3React()
  const [checkDelegate, setCheckDelegate] = useState('')
  const [rewardStake, setRewardStake] = useState({
    rewardStakeData: [],
    isLoading: false,
    unStakeFilter: '',
    stakeFilter: '',
    allData: 'yes',
    count: 0,
    totalPages: 0,
    unstakeNft: '',
    stakeAll: [],
    unStakeAll: [],
    rarityType: 'All',
    page: 1,
    limit: 12,
    TotalStaked: 0,
    TotalStakedPercen: 0,
    GlobalStakPercen: 0,
    stakersClamed: 0,
    claimablePLS: 0,
    pulseRate: 0

  })


  // delegates function for check user account it own or not.
  async function delegateNFT() {
    try {
      let stakeContractFn = await HeartHeadRewardStakingContract(library);
      let checkAdd = await stakeContractFn.delegates(account)
      console.log('stakeContractFn', stakeContractFn)
      let compareAddress = account.toLocaleLowerCase() === checkAdd.toLocaleLowerCase()
      setCheckDelegate(compareAddress)

    } catch (error) {
      console.log('Error delegatesNFT', error)
    }
  }


  // apply sorting base on unStake and deposite
  async function handleChangeSelectSort(e) {
    let value = e.target.value

    if (value === 'unstake') {
      setRewardStake(prevState => ({ ...prevState, stakeFilter: '', unStakeFilter: 'yes', allData: '', page: 1 }))
    } else if (value === 'stake') {
      setRewardStake(prevState => ({ ...prevState, unStakeFilter: '', stakeFilter: 'yes', allData: '', page: 1 }))
    }
    else {
      setRewardStake(prevState => ({ ...prevState, stakeFilter: '', unStakeFilter: '', page: 1, allData: "yes" }))
    }
  }

  // rarity filter
  async function handleChangeRarity(e) {
    let value = e.target.value
    if (value === 'god_tier') {
      setRewardStake(prevState => ({ ...prevState, page: 1, rarityType: 'God Tier' }))
    } else if (value === 'legendary') {
      setRewardStake(prevState => ({ ...prevState, page: 1, rarityType: 'Legendary' }))
    } else if (value === 'ultra_rare') {
      setRewardStake(prevState => ({ ...prevState, page: 1, rarityType: 'Ultra Rare' }))
    } else if (value === 'rare') {
      setRewardStake(prevState => ({ ...prevState, page: 1, rarityType: 'Rare' }))
    } else if (value === 'common') {
      setRewardStake(prevState => ({ ...prevState, page: 1, rarityType: 'Common' }))
    } else if (value === 'special') {
      setRewardStake(prevState => ({ ...prevState, page: 1, rarityType: 'Special' }))
    } else {
      setRewardStake(prevState => ({ ...prevState, page: 1, rarityType: 'All' }))
    }
  }

  // change page functionality
  async function handlePageChange(event, newPage) {
    setRewardStake(prevState => ({ ...prevState, page: newPage }))
  }

  // fetch rewardStake data
  async function fetchMyRewardStakeData(page) {
    try {
      setRewardStake(prevState => ({ ...prevState, isLoading: true }));
      const response = await axios.get(
        `${process.env.REACT_APP_API}/${apiEndPoint.REWARD_STAKEING}`, {
        params: {
          id: account,
          unstake: rewardStake.unStakeFilter,
          stacke: rewardStake.stakeFilter,
          all: rewardStake.allData,
          page: rewardStake.page || page,
          limit: rewardStake.limit,
          type: rewardStake.rarityType
        }
      }
      );
      console.log('response', response)
      setRewardStake(prevState => ({
        ...prevState,
        rewardStakeData: response.data, // Assuming response.data contains the actual voting data
        count: response?.data?.count,
        totalPages: response?.data?.totalPages,
        isLoading: false,
        unStakeFilter: rewardStake.unStakeFilter, // Retain current unStakeFilter value
        stakeFilter: rewardStake.stakeFilter,
        unstakeNft: response?.data?.unstakeNftCount,
        stakeAll: response?.data?.stakeAllTokenId,
        unStakeAll: response?.data?.unstakeAllTokenId,
        stakersClamed: response?.data?.stakersClamed,
        TotalStaked: response?.data?.TotalStaked,
        TotalStakedPercen: response?.data?.TotalStakedPercen,
        GlobalStakPercen: response?.data?.GlobalStakPercen,
        pulseRate: response?.data?.currenPLSTokenRate,




      }));
    } catch (error) {
      console.error("Error my voting power1612")
      setRewardStake(prevState => ({
        ...prevState, isLoading: false
      }));
    }
  }

  // SelfDalegate function for give a power
  async function handleClaimReward() {
    try {
      dispatch({ type: LOADING_START, button: 'claimRewardLoading' });
      let stakeContractFn = await HeartHeadRewardStakingContract(library);
      let claimReward = await stakeContractFn?.claimRewards()
      console.log('claimReward', claimReward)

      if (claimReward?.hash) {
        await claimReward.wait(1)
        dispatch({ type: LOADING_FINISH, button: 'claimRewardLoading' });
        toast.success(
          'reward claim Success',
          {
            duration: 4000,
            iconTheme: {
              primary: "#007bff",
              secondary: "#cce5ff",
            },
          }
        )
        sleep(10000)
        window.location.reload();
      }

    } catch (error) {
      console.log("Error handleClaimReward", error)
      dispatch({ type: LOADING_FINISH, button: 'claimRewardLoading' });

    }

  }
  // claimable Pls check
  async function handleCheckClaimablePLS() {
    try {
      let stakeContractFn = await HeartHeadRewardStakingContract(library);
      let claimablePLS = await stakeContractFn?.getStakeInfo(account)
      // console.log('claimablePLS', +claimablePLS?._rewards?.toString())
      let reward = +claimablePLS._rewards.toString()
      setRewardStake(pv => ({ ...pv, claimablePLS: reward }))


    } catch (error) {
      console.log("Error handleCheckClaimablePLS", error)
    }

  }

  // handleStakeAll all the nft deposite 

  async function handleStakeAll() {
    if (rewardStake.stakeAll.length === 0) return toast.error(
      "Total Nft is 0",
      {
        duration: 4000,
        iconTheme: {
          primary: "#007bff",
          secondary: "#cce5ff",
        },
      }
    );

    if (rewardStake.stakeAll.length > 30) {
      rewardStake.stakeAll.length = 30
    }


    try {
      dispatch({ type: LOADING_START, button: 'stakeAll' });
      let message = `Stake Transaction is Successfull!`
      let stakeContractFn = await HeartHeadRewardStakingContract(library);

      let checkApproveStatus = await approveRewardStaked('single', heartHeadCollection, account, library)

      // set limit array data 10

      if (checkApproveStatus === true) {
        let depositeAllNft = await stakeContractFn.stake(rewardStake.stakeAll)

        await depositeAllNft.wait(1)
        if (depositeAllNft.hash) {
          fetchMyRewardStakeData()
          toast.success(
            message,
            {
              duration: 4000,
              iconTheme: {
                primary: "#007bff",
                secondary: "#cce5ff",
              },
            }
          )
        }
        dispatch({ type: LOADING_FINISH, button: 'stakeAll' });

        console.log('depositeAllNft', depositeAllNft)
      } else {
        toast.error(
          "Approval Failed!",
          {
            duration: 4000,
            iconTheme: {
              primary: "#007bff", // Custom color for the info icon
              secondary: "#cce5ff", // Custom background color for the info icon
            },
          }
        );
        dispatch({ type: LOADING_FINISH, button: 'stakeAll' });

      }


    } catch (error) {
      console.log("handleStakeAll 1612", error.message)
      dispatch({ type: LOADING_FINISH, button: 'stakeAll' });

    }

  }

  // 
  async function handleUnStakeAll() {
    if (rewardStake.unStakeAll.length === 0) return toast.error(
      "Total Deposited Nft is 0",
      {
        duration: 4000,
        iconTheme: {
          primary: "#007bff",
          secondary: "#cce5ff",
        },
      }
    );
    if (rewardStake.unStakeAll.length > 30) {
      rewardStake.unStakeAll.length = 30
    }

    try {
      dispatch({ type: LOADING_START, button: "unStakeAll" });
      console.log('rewardStake.unStakeAll', rewardStake.unStakeAll)
      let message = `Withdraw Transaction is Successfuly!`
      let stakeContractFn = await HeartHeadRewardStakingContract(library);

      let response = await stakeContractFn.withdraw(rewardStake.unStakeAll)
      await response.wait(1)
      if (response.hash) {
        fetchMyRewardStakeData(1)
        toast.success(
          message,
          {
            duration: 4000,
            iconTheme: {
              primary: "#007bff",
              secondary: "#cce5ff",
            },
          }
        )
        dispatch({ type: LOADING_FINISH, button: 'unStakeAll' });
      }


    } catch (error) {
      console.log("unStakeAll 1612", error.message)
      dispatch({ type: LOADING_FINISH, button: 'unStakeAll' });



    }
  }

  useEffect(() => {
    fetchMyRewardStakeData()
    delegateNFT()
    handleCheckClaimablePLS()
  }, [account, rewardStake.page, rewardStake.unStakeFilter, rewardStake.stakeFilter, rewardStake.rarityType])


  // useEffect(() => {
  //   let data = async () => {
  //     let res = await HeartHeadRewardStakingContract(library)
  //     let check = await HeartHeadWrappedContract(library);
  //     console.log('check', check)
  //     console.log('res HeartHeadRewardStakingContract instance', res)
  //   }
  //   data()
  // }, [library])

  //(convertWerToPLS(Number(rewardStake?.stakersClamed))
//   let plsCurrency = convertWerToPLS(rewardStake?.stakersClamed)
//   let plsRat=rewardStake?.pulseRate
// console.log('plsCurrency plsRat', plsCurrency,plsRat)
//   let LifetimeStacking=plsCurrency*plsRat
//     console.log("first",LifetimeStacking.toFixed(17))
  return (
    <div className='my-voting-power-main'>
      <div className='container'>
        <div className='voting-block-bg'>
          <div className='voting-block-title'>
            <div className='text-dicription-block'>
              <h2>Stake your Heart Heads</h2>
              <p>
                To Earn PLS Rewards
              </p>
            </div>
            <div className='button-group-voting'>
              <button className='voting-block-btn btn' onClick={handleClaimReward}> {state.claimRewardLoading ? "Loading..." : "Claim Reward"}</button>
            </div>
          </div>
          <div className='global-dashboard-block'>
            <div className='global-dashboard-block-text'>
              <p>Global % Staked</p>
              <h3>{rewardStake?.GlobalStakPercen}%</h3>
            </div>
            <div className='global-dashboard-block-text'>
              <p>Items Staked</p>
              <h3>{rewardStake?.TotalStaked} ({rewardStake?.TotalStakedPercen}%)</h3>
            </div>
            <div className='global-dashboard-block-text'>
              <p>Lifetime Staking Rewards</p>
              <h3>{`${formatNum(rewardStake?.stakersClamed || 0)}`}</h3>
              {/* <h3>{formatNum(+(convertWerToPLS(Number(rewardStake?.stakersClamed || 0)) * +rewardStake?.pulseRate))}</h3> */}
            </div>
            <div className='global-dashboard-block-text'>
              <p>Claimable PLS</p>
              <h3>{`${formatNum(rewardStake?.claimablePLS || 0)}`}</h3>
              {/* <h3>{formatNum(toEth(((rewardStake?.claimablePLS || 0), 18)))}</h3> */}
              {/* <h3>{formatNum((rewardStake?.claimablePLS || 0), 18)}</h3> */}


            </div>
          </div>

          <div className='deposite-all-block'>
            <div className='deposite-all-button'>
              <div className='deposite-all-button-flex'>
                <button className='btn button-flex' onClick={handleStakeAll}>{state.stakeAll ? "Loading..." : "STAKE 30"}</button>
                <button className='btn button-border' onClick={handleUnStakeAll}>{state.unStakeAll ? "Loading..." : "UNSTAKE 30"}</button>
              </div>

              <div style={{ display: 'flex' }}>
                <div className='select-drop' style={{ marginRight: '10px' }}>
                  <select id="sortSelect" onChange={handleChangeRarity}>
                    <option value="all">All</option>
                    <option value="god_tier">God Tier</option>
                    <option value="legendary">Legendary</option>
                    <option value="ultra_rare">Ultra Rare</option>
                    <option value="rare">Rare</option>
                    <option value="common">Common</option>
                    <option value="special">Special</option>
                  </select>
                </div>

                <div className='select-drop'>
                  <select id="sortSelect" onChange={handleChangeSelectSort}>
                    <option value='all'>All</option>
                    <option value='unstake'>UnStake</option>
                    <option value='stake'>Stake</option>
                  </select>
                </div>
              </div>
            </div>
            <div className='deposite-withdrawl-block' style={{ flexWrap: 'wrap' }}>

              {

                rewardStake?.rewardStakeData?.items?.length == 0 ?
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
                  :
                  rewardStake.isLoading ?
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
                    </div> :
                    rewardStake?.rewardStakeData?.items?.map((data) => {
                      return (
                        <>
                          <MyRewardStake data={data} fetchData={fetchMyRewardStakeData} setRewardStake={setRewardStake} state={state} dispatch={dispatch} />
                        </>
                      )
                    })
              }
            </div>
            <Pagination
              count={rewardStake?.totalPages}
              onChange={(event, newPage) => handlePageChange(event, newPage)}
              style={{
                background: 'azure',
                display: 'flex',
                justifyContent: 'end',
                width: 'fit-content'
              }}
              color='primary'
              page={rewardStake?.page}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RewardStack;