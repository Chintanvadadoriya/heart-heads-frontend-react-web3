import { useEffect, useState } from 'react'
import './voting.scss';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import { useParams } from 'react-router-dom';
import { apiEndPoint } from '../../routes/routes';
import axios from 'axios';
import { Link } from "react-router-dom";
import ProposalRecentlyList from '../../components/proposal/ProposalRecentlyList';
import LoaderImg from "../../assets/images/Loading.gif";
import { HeartHeadGovernanceContract } from '../../contract';
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';
import toast from 'react-hot-toast';
import { useHistory, useLocation } from 'react-router-dom';

function Voting() {
  const { library,account } = useActiveWeb3React();
  const history = useHistory()
  const { state } = useLocation();
  let { id } = useParams();
  const currentBlock = state && state.state.currentBlock;

  const [proposalData, setProposalData] = useState({
    isLoading: false,
    data: [],
    recently_created: [],
    voteCast: ""
  })
  const [loading, setLoading] = useState(false)
  const [checkVoted,setCheckVoted]=useState(true)
  proposalData.recently_created.length = 3  // set array length 3 

  const handleRedirect = () => {
    history.push(`/voting-history/${id}`);
  };

  const handleDiscussionClick = () => {
    if (proposalData?.data[0]?.discussionUrl) {
      const discussionUrl = proposalData?.data[0]?.discussionUrl;
      window.open(discussionUrl, '_blank');
    } else {
      toast.error(
        "Discussion Not Availble!",
        {
          duration: 4000,
          iconTheme: {
            primary: "#007bff",
            secondary: "#cce5ff",
          },
        }
      )
    }

    
  };

  async function handleSubmitVoteCast(event) {
    let voteCast = Number(event.target.value)
    setProposalData((previousState) => (
      {
        ...previousState,
        voteCast: voteCast
      }
    ))
  }

  const fetchProposalDetail = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/${apiEndPoint.PROPOSAL_DATA}`, {
        params: {
          id: id,
        }
      }
      );

      setProposalData(prevState => ({
        ...prevState,
        data: response?.data?.items,
        recently_created: response?.data?.recently_created_proposal,
        isLoading: false
      }));

    } catch (err) {
      console.log("err in fetchProposal datais1612", err);
      setProposalData(prevState => ({
        ...prevState, isLoading: false
      }));
    } finally {
      setProposalData(prevState => ({
        ...prevState, isLoading: false
      }));
    }
  };

  async function handleClickCastVotes() {
    try {
      setLoading(true)
      let response = await HeartHeadGovernanceContract(library);
      let creatVoteCast = await response.castVote(id, proposalData.voteCast)
      await creatVoteCast.wait(1)

      toast.success(
        "Vote submited successfuly!",
        {
          duration: 4000,
          iconTheme: {
            primary: "#007bff",
            secondary: "#cce5ff",
          },
        }
      )
      setLoading(false)
      history.push('/proposal-list')

    } catch (error) {
      console.log('error crareCast1612', error)
      setLoading(false)

    } finally {
      setLoading(false)
    }
  }

  // check user already have voted or no 

  async function checkUserVotedOrNot(){
    try{
      if(!account) return null
      let response = await HeartHeadGovernanceContract(library);
      let checkuserVoted = await response.hasVoted(id,account)
      setCheckVoted(checkuserVoted)
    }catch(err){
      console.log('err checkUserVotedOrNot 1612 ', err)
    }
  }



  useEffect(() => {
    fetchProposalDetail()
    checkUserVotedOrNot()
  }, [id])
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
            <h2>Voting</h2>
            <div className='button-group-voting'>
              <Link to='/my-voting-power'>
                <button className='voting-block-btn btn'>My Voting Power</button>
              </Link>
              {/* <button className='voting-block-btn btn'>Cast Votes</button> */}
            </div>
          </div>
          {
            proposalData.isLoading ?
              <div
                className='text_color_gradient_dark'
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  fontSize: '1.5rem'
                }}>
                <img src={LoaderImg} alt='' />
              </div>
              :
              <>
                {
                  proposalData?.recently_created.length !== 0 ?
                    <>
                      <div className='three-block-progress'>
                        {
                          proposalData?.recently_created.map((data) => {
                            return (
                              <>
                                <ProposalRecentlyList data={data} />
                              </>
                            )
                          })
                        }
                      </div>

                    </>
                    :
                    <div
                      className='text_color_gradient_dark'
                      style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '1.5rem'
                      }}>
                      No recently created items found!
                    </div>
                }
                <div className='two-block-progress'>
                  {
                    proposalData?.data?.map((data) => {
                      return (
                        <>
                          <div className='two-block-progress-inner'>
                            <div className='two-block-progress-inner-flex'>
                              <div className='three-block-progress-inner'>
                                <div className='three-block-progress-inner-block'>
                                  <div className='three-block-top-title'>
                                    {/* <span>Submit a Proposal</span> */}
                                    {/* <a href=''>Next Poll</a> */}
                                  </div>
                                  <h3>{data?.title}</h3>
                                  <p>
                                    {data?.description}
                                  </p>
                                  {/* <a href=''>Read More</a> */}
                                  <h3>Vote Breakdown</h3>
                                  <div className='progress-block'>
                                    <div className='progress-block-inner'>
                                      <div className='progress-block-title'>
                                        <p>Yes</p>
                                        <p>{data?.yesCount} Votes ({data?.yesCountPercentage || 0} %)</p>
                                      </div>
                                      <Box sx={{ width: '100%' }}>
                                        <LinearProgress variant='determinate' value={data?.yesCountPercentage || 0} />
                                      </Box>
                                    </div>
                                    <div className='progress-block-inner'>
                                      <div className='progress-block-title'>
                                        <p>Abstain</p>
                                        <p>{data?.abstainCount} votes ({data?.abstainCountPercentage || 0} %)</p>
                                      </div>
                                      <Box sx={{ width: '100%' }}>
                                        <LinearProgress variant='determinate' value={data?.abstainCountPercentage || 0} />
                                      </Box>
                                    </div>
                                    <div className='progress-block-inner'>
                                      <div className='progress-block-title'>
                                        <p>No</p>
                                        <p>{data?.noCount} votes ({data?.noCountPercentage || 0} %)</p>
                                      </div>
                                      <Box sx={{ width: '100%' }}>
                                        <LinearProgress variant='determinate' value={data?.noCountPercentage || 0} />
                                      </Box>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )
                    })
                  }
                  <div className='two-block-progress-button'>
                    <div className='two-block-progress-button-group'>

                      <button className='btn discussion-btn' onClick={handleDiscussionClick}>
                        <span>Discussion</span>
                        <svg width='17' height='14' viewBox='0 0 17 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
                          <path
                            d='M10.3004 13.1987L15.8423 7.65754C16.2055 7.29437 16.2055 6.70549 15.8423 6.34232L10.3004 0.80113'
                            stroke='white'
                            stroke-width='1.39492'
                            stroke-linecap='round'
                          />
                          <path d='M15.5 7L1.5 7' stroke='white' stroke-width='1.39492' stroke-linecap='round' />
                        </svg>
                      </button>
                      <button className='btn discussion-btn' onClick={handleRedirect}>
                        <span>Votes History</span>
                        <svg width='17' height='14' viewBox='0 0 17 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
                          <path
                            d='M10.3004 13.1987L15.8423 7.65754C16.2055 7.29437 16.2055 6.70549 15.8423 6.34232L10.3004 0.80113'
                            stroke='white'
                            stroke-width='1.39492'
                            stroke-linecap='round'
                          />
                          <path d='M15.5 7L1.5 7' stroke='white' stroke-width='1.39492' stroke-linecap='round' />
                        </svg>
                      </button>
                    </div>
                    <div className='two-block-progress-button-group-flex'>
                      <div className='cast-vote-block'>
                        <h3>Cast a Vote</h3>
                        <div className='radio-group-block'>
                          <div className='form__radio-group'>
                            <input
                              id='yes'
                              type='radio'
                              className='form__radio-input'
                              name='size'
                              value={1}
                              checked={proposalData.voteCast === +1}
                              onChange={handleSubmitVoteCast}
                            />
                            <label for='yes' class='form__radio-label'>
                              <span>Yes</span>
                            </label>
                          </div>


                          <div className='form__radio-group'>
                            <input id='no' type='radio' className='form__radio-input' name='size'
                              value={0}
                              checked={proposalData.voteCast === +0}
                              onChange={handleSubmitVoteCast}
                            />
                            <label for='no' class='form__radio-label'>
                              <span>No</span>
                            </label>
                          </div>

                          <div className='form__radio-group'>
                            <input id='abstain' type='radio' className='form__radio-input' name='size'
                              value={2}
                              checked={proposalData.voteCast === +2}
                              onChange={handleSubmitVoteCast}

                            />
                            <label for='abstain' class='form__radio-label'>
                              <span>Abstain</span>
                            </label>
                          </div>


                        </div>
                        {!checkVoted && <div className='last-button-group'>
                          {
                            proposalData?.data?.map((data) => {
                              return (
                                <>
                                  {data.voteEnd > currentBlock && <button className='btn btn-common-forum' onClick={handleClickCastVotes} >{`${loading ? "Loading..." : "Cast Votes"}`}</button>}
                                </>
                              )
                            })
                          }
                        </div>}
                      </div>
                    </div>
                  </div>
                </div>
              </>
          }
        </div>
      </div>
    </div>
  );
}

export default Voting;