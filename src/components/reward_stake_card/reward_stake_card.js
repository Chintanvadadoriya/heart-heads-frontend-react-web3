import React, { useState } from 'react'
import { HeartHeadRewardStakingContract, approveRewardStaked } from '../../contract';
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
import toast from "react-hot-toast";
import { capitalizeFirstLetter, formatTimestamp, getRarityClass, getRarityName, getRaritySrc } from '../../utils';
import './reward_stack_card.scss'

function MyRewardStake({ data, fetchData, setRewardStake }) {
  let traitType = null;
  let raritySrc = '';
  let traitValue = '';

  const heartHeadCollection = process.env.REACT_APP_API_ITEM_COLLECTION_ADDRESS
  let checkUnstakeStatus = data.value === 1
  const { account, library } = useActiveWeb3React()
  const [loading, setLoading] = useState(false);

  async function handleStakeUnStake(tokenId, isunStake) {

    try {
      setLoading(true)
      let message = `${isunStake ? "unstake" : "stake"} Transaction is Successfuly!`
      let deleGate = await HeartHeadRewardStakingContract(library);
      let checkApproveStatus = await approveRewardStaked('single', heartHeadCollection, account, library)
      let response
      if (checkApproveStatus === true) {

        if (isunStake) {
          response = await deleGate.withdraw([tokenId])
        } else {
          response = await deleGate.stake([tokenId])
        }
        await response.wait(1)
        if (response.hash) {
          fetchData()
          toast.success(
            message,
            {
              duration: 4000,
              iconTheme: {
                primary: "#007bff", // Custom color for the info icon
                secondary: "#cce5ff", // Custom background color for the info icon
              },
            }
          )
          setLoading(false);
        }

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
        setLoading(false);
      }
    } catch (error) {
      console.log("handleStakeUnStake 1612", error)
      setLoading(false);
    }

  }




  if (data && data.attributes && data.attributes[0] && data.attributes[0].trait_type) {
    traitType = data.attributes[0].trait_type;
  } else if (data && data.itemDeposits && data.itemDeposits.attributes && data.itemDeposits.attributes[0] && data.itemDeposits.attributes[0].trait_type) {
    traitType = data.itemDeposits.attributes[0].trait_type;
  }

  if (data && data.attributes && data.attributes[1]) {
    raritySrc = getRaritySrc(data.attributes[1]);
  } else if (data && data.itemDeposits && data.itemDeposits.attributes && data.itemDeposits.attributes[1]) {
    raritySrc = getRaritySrc(data.itemDeposits.attributes[1]);
  }

  if (data && data.attributes && data.attributes[1] && data.attributes[1].value) {
    traitValue = capitalizeFirstLetter(data.attributes[1].value);
  } else if (data && data.itemDeposits && data.itemDeposits.attributes && data.itemDeposits.attributes[1] && data.itemDeposits.attributes[1].value) {
    traitValue = capitalizeFirstLetter(data.itemDeposits.attributes[1].value);
  }

  return (
    <>

      <div className='deposite-withdrawl-block-inner'>
        <div className='recent-method-slider-inner'>
          <h2>
            {data?.name || data?.itemDeposits?.name}
          </h2>
          <div className='recent-slider-img'>
            <img src={data?.image || data?.itemDeposits?.image} alt='not found' />
            <span>TEST</span>
          </div>
          <div className='category-rarity-block'>
            <div className='category-rarity-block-left'>
              <p>Category</p>
              <h4>
                {traitType}
              </h4>
            </div>
            <div className='category-rarity-block-left '>
              <p>Rarity</p>
              <h4>
                <img src={raritySrc} alt='' />
                <span>{traitValue}</span>
              </h4>
            </div>
          </div>
          <div className='category-rarity-block pt-5'>
            {
              checkUnstakeStatus &&
              <div className='category-rarity-block-left diposit-on-block'>
                <p>Stake on</p>
                <h4 className='days-block'>{formatTimestamp(data?.timestamp)}</h4>
              </div>
            }
          </div>
          <button className='withdraw-btn' disabled={loading} onClick={() => handleStakeUnStake(+data.tokenId, checkUnstakeStatus)} >{checkUnstakeStatus ? `${loading ? "Loading..." : "UnStake"}` : `${loading ? "Loading..." : "Stake"}`}</button>
        </div>

      </div>
    </>
  )
}

export default MyRewardStake