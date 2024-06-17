import React, { useEffect, useReducer, useState } from 'react'
import './voting.scss';
import VotingImg from '../../assets/images/tab-product-img.png';
import { Pagination } from '@mui/material';
import MYVotingPower from '../../components/my_voting_power/MYVotingPower';
import axios from 'axios';
import { apiEndPoint } from '../../routes/routes';
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
import LoaderImg from "../../assets/images/Loading.gif";
import { HeartHeadWrappedContract, approveNFTToWrapped } from '../../contract';
import toast from 'react-hot-toast';
import { sleep } from '../../utils';
import { Link } from 'react-router-dom';
// Define action types
const LOADING_START = 'LOADING_START';
const LOADING_FINISH = 'LOADING_FINISH';

// Initial state for buttons loading states
const initialState = {
  dipositeAll: false,
  withdrawAll: false,
  withdraw: false,
  diposite: false
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


function MyVotingPower() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const heartHeadCollection = process.env.REACT_APP_API_ITEM_COLLECTION_ADDRESS
  const { account, library } = useActiveWeb3React()
  const [checkDelegate, setCheckDelegate] = useState('')
  const [myVotingPower, setMyVotingPower] = useState({
    votingData: [],
    isLoading: false,
    withdrawFilter: '',
    dipositeFilter: '',
    allData:'yes',
    count: 0,
    totalPages: 0,
    withdrawNft: '',
    depositeAll: [],
    withdrawAll: [],
    page: 1,
    limit: 12,

  })


  // delegates function for check user account it own or not.
  async function delegateNFT() {
    try {
      let deleGate = await HeartHeadWrappedContract(library);
      let checkAdd = await deleGate.delegates(account)
      console.log('deleGate', deleGate)
      let compareAddress = account.toLocaleLowerCase() === checkAdd.toLocaleLowerCase()
      setCheckDelegate(compareAddress)

    } catch (error) {
      console.log('Error delegatesNFT', error)
    }
  }


  // apply sorting base on withdraw and deposite
  async function handleChangeSelectSort(e) {
    let value = e.target.value
    console.log(e.target.value === "reset", value)

    if (value === 'withdraw') {
      setMyVotingPower(prevState => ({ ...prevState, dipositeFilter: '', withdrawFilter: 'yes',allData:'', page: 1 }))
    } else if (value === 'deposite') {
      setMyVotingPower(prevState => ({ ...prevState, withdrawFilter: '', dipositeFilter: 'yes',allData:'', page: 1 }))
    } else {
      setMyVotingPower(prevState => ({ ...prevState, dipositeFilter: '',allData:'yes', withdrawFilter: '', page: 1 }))
    }
  }

  // change page functionality
  async function handlePageChange(event, newPage) {
    setMyVotingPower(prevState => ({ ...prevState, page: newPage }))
  }

  // fetch myVotingPower data
  async function fetchMyVotingPowerData() {
    try {
      setMyVotingPower(prevState => ({ ...prevState, isLoading: true }));
      const response = await axios.get(
        `${process.env.REACT_APP_API}/${apiEndPoint.MY_VOTING_POWER}`, {
        params: {
          id: account,
          withdraw: myVotingPower.withdrawFilter,
          deposite: myVotingPower.dipositeFilter,
          all:myVotingPower.allData,
          page: myVotingPower.page,
          limit: myVotingPower.limit
        }
      }
      );
      setMyVotingPower(prevState => ({
        ...prevState,
        votingData: response.data, // Assuming response.data contains the actual voting data
        count: response?.data?.count,
        totalPages: response?.data?.totalPages,
        isLoading: false,
        withdrawFilter: myVotingPower.withdrawFilter, // Retain current withdrawFilter value
        dipositeFilter: myVotingPower.dipositeFilter,
        withdrawNft: response?.data?.WithdrawNftCount,
        depositeAll: response?.data?.depositeAllTokenId,
        withdrawAll: response?.data?.withdrawAllTokenId

      }));
    } catch (error) {
      console.error("Error my voting power1612")
      setMyVotingPower(prevState => ({
        ...prevState, isLoading: false
      }));
    }
  }

  // SelfDalegate function for give a power
  async function handleSelfDalegate() {
    try {
      let deleGate = await HeartHeadWrappedContract(library);
      let getPower = await deleGate.delegate(account)
    } catch (error) {
      console.log("Error SelfDalegate", error)
    }

  }

  // DepositAll all the nft deposite 

  async function handleDepositeAll() {
    if (myVotingPower.depositeAll.length === 0) return toast.error(
      "Total Nft is 0",
      {
        duration: 4000,
        iconTheme: {
          primary: "#007bff",
          secondary: "#cce5ff",
        },
      }
    );

    if (myVotingPower.depositeAll.length > 30) {
      myVotingPower.depositeAll.length = 30
    }
    

    try {
      dispatch({ type: LOADING_START, button: 'dipositeAll' });
      let message = `Deposit Transaction is Successfull!`
      let deleGate = await HeartHeadWrappedContract(library);
      let checkApproveStatus = await approveNFTToWrapped('single', heartHeadCollection, account, library)

      // set limit array data 10

      if (checkApproveStatus === true) {
        let depositeAllNft = await deleGate.depositFor(account, myVotingPower.depositeAll)

        await depositeAllNft.wait(1)
        if (depositeAllNft.hash) {
          fetchMyVotingPowerData()
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
        dispatch({ type: LOADING_FINISH, button: 'dipositeAll' });

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
        dispatch({ type: LOADING_FINISH, button: 'dipositeAll' });

      }


    } catch (error) {
      console.log("handleDepositeAll 1612", error.message)
      dispatch({ type: LOADING_FINISH, button: 'dipositeAll' });

    }

  }

  // 
  async function handleWithdrawAll() {
    if (myVotingPower.withdrawAll.length === 0) return toast.error(
      "Total Deposited Nft is 0",
      {
        duration: 4000,
        iconTheme: {
          primary: "#007bff",
          secondary: "#cce5ff",
        },
      }
    );
    if (myVotingPower.withdrawAll.length > 30) {
      myVotingPower.withdrawAll.length = 30
    }

    try {
      dispatch({ type: LOADING_START, button: "withdrawAll" });
      console.log('myVotingPower.withdrawAll', myVotingPower.withdrawAll)
      let message = `Withdraw Transaction is Successfuly!`
      let deleGate = await HeartHeadWrappedContract(library);

      let response = await deleGate.withdrawTo(account, myVotingPower.withdrawAll)
      await response.wait(1)
      if (response.hash) {
        fetchMyVotingPowerData()
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
        dispatch({ type: LOADING_FINISH, button: 'withdrawAll' });
      }


    } catch (error) {
      console.log("withdrawAll 1612", error.message)
      dispatch({ type: LOADING_FINISH, button: 'withdrawAll' });



    }
  }

  useEffect(() => {
    fetchMyVotingPowerData()
    delegateNFT()
  }, [account, myVotingPower.page, myVotingPower.withdrawFilter, myVotingPower.dipositeFilter])

  return (
    <div className='my-voting-power-main'>
      <div className='container'>
        <div className='voting-block-bg'>
          <div className='back-button'>
            <Link to='/proposal-list'>
              Back
            </Link>
          </div>
          <div className='voting-block-title'>

            <div className='text-dicription-block'>

              <h2>DEPOSIT YOUR HEART HEADS</h2>
              <p>Deposit your NFT to get voting power. You must self delegate once to get voting power.</p>
            </div>
            <div className='button-group-voting'>
              {!checkDelegate && <button className='voting-block-btn btn' onClick={handleSelfDalegate}>Self Delegate</button>}
            </div>
          </div>
          <div className='global-dashboard-block'>
            <div className='global-dashboard-block-text'>
              <p>Global % Deposited</p>
              <h3>{((myVotingPower?.votingData?.GlobalWithdrawNftCount /( myVotingPower?.votingData?.GlobalNftCount + myVotingPower?.votingData?.GlobalWithdrawNftCount)) * 100).toFixed(1)} %</h3>
            </div>
            <div className='global-dashboard-block-text'>
              <p>Total Deposited</p>
              <h3>{myVotingPower?.votingData?.TotalDeposited} ({myVotingPower?.votingData?.TotalDepositedPercen} %)</h3>
            </div>
            <div className='global-dashboard-block-text'>
              <p>My Voting Power</p>
              <h3>{checkDelegate && myVotingPower?.withdrawNft || 0}</h3>
            </div>
          </div>
          <div className='deposite-all-block'>
            <div className='deposite-all-button'>
              <div className='deposite-all-button-flex'>
                <button className='btn button-flex' onClick={handleDepositeAll}>{state.dipositeAll ? "Loading..." : "DEPOSIT 30"}</button>
                <button className='btn button-border' onClick={handleWithdrawAll}>{state.withdrawAll ? "Loading..." : "Withdraw 30"}</button>
              </div>
              <div className='select-drop'>
                <select id="sortSelect" onChange={handleChangeSelectSort}>
                  <option value='all'>All</option>
                  <option value='deposite'>Deposited</option>
                  <option value='withdraw'>Withdraw</option>
                </select>
              </div>
            </div>
            <div className='deposite-withdrawl-block' style={{ flexWrap: 'wrap' }}>

              {

                myVotingPower?.votingData?.items?.length == 0 ?
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
                  myVotingPower.isLoading ?
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
                    myVotingPower?.votingData?.items?.map((data) => {
                      return (
                        <>
                          <MYVotingPower data={data} fetchData={fetchMyVotingPowerData} setMyVotingPower={setMyVotingPower} state={state} dispatch={dispatch} />
                        </>
                      )
                    })
              }
            </div>
            <Pagination
              count={myVotingPower?.totalPages}
              onChange={(event, newPage) => handlePageChange(event, newPage)}
              style={{
                background: 'azure',
                display: 'flex',
                justifyContent: 'end',
                width: 'fit-content'
              }}
              color='primary'
              page={myVotingPower?.page}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyVotingPower