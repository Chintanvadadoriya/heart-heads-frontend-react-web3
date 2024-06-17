import React, { useEffect, useState } from 'react'
import VotingImg from '../../assets/images/tab-product-img.png';
import { getTimeAgo } from '../../utils';
import { useHistory } from 'react-router-dom'
import LogoNewTwo from "../../assets/images/favicon192.png";
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';

function Proposal({ data }) {
    const [currentBlock, setCurrrentBlock] = useState(0)
    const history = useHistory();
    const { account, library } = useActiveWeb3React()



    const handleRedirect = (data) => {
        history.push(`/voting/${data?.proposalId}`, { state: { currentBlock: currentBlock } });
    };

    async function getCurrentBlockNumber() {
        let blockNum = await library?.provider?.getBlockNumber()
        setCurrrentBlock(blockNum)
    }

    useEffect(() => {
        getCurrentBlockNumber()
    }, [account, library])
    return (

        <div className='tab-inner-voting-block-inner' onClick={() => handleRedirect(data)}>
            <div className='tab-inner-voting-block-inner-top'>
                <div className='tab-inner-voting-block-inner-top-left'>
                    <img src={data?.image || LogoNewTwo} alt='no' />
                    <h3>
                        {/* HEARTHEADS DAO */}
                        Head-Heads DAO Proposal by  <span> {data?.proposer} </span>
                    </h3>
                </div>
                {
                    data?.voteEnd > currentBlock ?
                        <button className='tab-button active-btn btn'>Active</button>
                        :
                        <button className='tab-button btn'>Closed</button>
                }
            </div>
            <div className='bottom-voting-block'>
                <h2>{data?.title}</h2>
                <p>
                    {data?.description}
                </p>
                <div className='voting-block-tex'>
                    <h3>{data?.totalVote} Votes</h3>
                    <h3>{getTimeAgo(data?.createdTimestamp)}</h3>
                </div>
            </div>
        </div>

    )
}

export default Proposal