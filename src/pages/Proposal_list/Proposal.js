import React, { useEffect, useState } from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import VotingImg from '../../assets/images/tab-product-img.png';
import { Link } from "react-router-dom";
import Proposal from '../../components/proposal/Proposal';
import { apiEndPoint } from '../../routes/routes';
import axios from 'axios';
import { Pagination } from '@mui/material';
import LoaderImg from "../../assets/images/Loading.gif";
import CustomTabPanel from '../../components/CustomTabPanel';
import ProposalMember from '../../components/proposal/ProposalMember';
import './proposal_list.scss';
import { HeartHeadGovernanceContract, HeartHeadWrappedContract } from '../../contract';
import { useActiveWeb3React } from '../../hooks/useActiveWeb3React';

function ProposalList() {
  const { library, account } = useActiveWeb3React();
  const [value, setValue] = useState(0);
  const [proposalData, setProposalData] = useState({
    isLoading: false,
    data: [],
    is_proposal: "yes",
    is_active: "",
    is_close: "",
    is_member: "",
    selectedOption: 'All',
    totalPages: 0,
    totalMembers: 0,
    page: 1
  })
  const [checkWhitelisted, setCheckWhiteListed] = useState(false)
  const [getProposalThreshold, setProposalThreshold] = useState('')
  const [getUserVote, setUserVote] = useState('')




  const handleChange = (event, newValue) => {
    setValue(newValue);

    switch (newValue) {
      case 0:
        setProposalData(prevState => ({
          ...prevState,
          is_active: "",
          is_close: "",
          is_member: '',
          is_proposal: "yes",
          page: 1,
        }));
        break;
      case 1:
        setProposalData(prevState => ({
          ...prevState,
          is_proposal: "",
          is_active: "",
          is_close: "",
          is_member: 'yes',
          page: 1,
        }));
        break;
      default:

        break;
    }


  };


  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`
    };
  }

  // page change
  async function handlePageChange(event, newpage) {
    setProposalData(prevState => ({
      ...prevState,
      page: newpage,
    }));
  }

  // Selected oprion for active / close
  async function handleChangeSelactedOption(event) {
    const selected = event.target.value
    switch (selected) {
      case 'active':
        setProposalData((previousState) => ({
          ...previousState,
          is_proposal: '',
          is_active: "yes",
          selectedOption: selected,
          page: 1
        }));
        break;

      case 'close':
        setProposalData((previousState) => ({
          ...previousState,
          is_proposal: '',
          is_active: '',
          is_close: 'yes',
          selectedOption: selected,
          page: 1
        }));
        break;

      case 'all':
        setProposalData((previousState) => ({
          ...previousState,
          is_proposal: 'yes',
          is_active: '',
          is_close: '',
          selectedOption: selected,
          page: 1
        }));
        break;

      default:
        // Default case, do nothing or handle error
        break;
    }

  }

  // fetch proposal data
  async function fetchProposalData() {
    try {
      setProposalData(prevState => ({ ...prevState, isLoading: true }));
      const response = await axios.get(
        `${process.env.REACT_APP_API}/${apiEndPoint.PROPOSA_LIST}`, {
        params: {
          is_proposal: proposalData.is_proposal,
          is_active: proposalData.is_active,
          is_close: proposalData.is_close,
          is_member: proposalData?.is_member,
          page: proposalData?.page

        }
      }
      );
      setProposalData(prevState => ({
        ...prevState,
        data: response?.data?.items,
        count: response?.data?.count,
        totalMembers: response?.data?.totalMembers,
        totalPages: response?.data?.totalPages,
        page: proposalData?.page
      }));

      setProposalData(prevState => ({
        ...prevState, isLoading: false
      }));
    } catch (error) {
      console.error("Error proposal 1612")
      setProposalData(prevState => ({
        ...prevState, isLoading: false
      }));
    }
  }

  // check user address is whilte listed or not and proposal Threshold  for howmuch require vote for create preposal

  async function checkUserAddressIsWhiteListed() {
    try {
      if (!account) return null
      let response = await HeartHeadGovernanceContract(library);
      let response_getvote = await HeartHeadWrappedContract(library);
      let checkuserWhiteListed = await response.whitelisted(account)
      let checkProposalThreshold = await response.proposalThreshold()
      let getUservote = await response_getvote.getVotes(account)
      setCheckWhiteListed(checkuserWhiteListed)
      setProposalThreshold(checkProposalThreshold?.toString()) // convert to bigNum to num .toString() 
      setUserVote(getUservote?.toString())
    } catch (err) {
      console.log('checkUserAddressIsWhiteListed 1612', err)
    }
  }

  useEffect(() => {
    fetchProposalData()
  }, [proposalData?.page, proposalData?.is_active, proposalData?.is_close, value])



  useEffect(() => {
    checkUserAddressIsWhiteListed()
  }, [account])

  // console.log('creteProposal', checkWhitelisted , getUserVote , getProposalThreshold)
  // checkWhitelisted 

  return (
    <div className='my-voting-power-main'>
      <div className='container'>
        <div className='voting-block-bg'>
          <div className='voting-block-title'>
            <div className='text-dicription-block'>
              <h2>HEARTHEADS DAO</h2>
              <p className='block-p-mt'>
                {proposalData?.totalMembers || 0} Members <span>Joined</span>
              </p>
            </div>
            <div style={{ display: 'flex' }}>
              <div className='button-group-voting'>
                {checkWhitelisted && getUserVote >= getProposalThreshold && <Link
                  to={{
                    pathname: '/proposal-create',
                    state: {
                      member: proposalData?.totalMembers
                    }
                  }}
                >
                  <button className='voting-block-btn btn'>+ New Proposal</button>
                </Link>}
              </div>
              <div className='button-group-voting'>
                <Link
                  to={{
                    pathname: '/my-voting-power',
                    state: {
                      member: proposalData?.totalMembers
                    }
                  }}
                >
                  <button className='voting-block-btn btn'>My Voting Power</button>
                </Link>
              </div>

            </div>
          </div>

          <div className='voting-tabs-block'>
            <div className='top-voting-block'>
              <Box>
                <div className='mui-tabs-select'>
                  <Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
                    <Tab label={`Proposal`} {...a11yProps(0)} />
                    {/* <Tab label='Treasury' />
                    <Tab label='About' /> */}
                    <Tab label='Member' {...a11yProps(1)} />
                  </Tabs>
                  {
                    !proposalData?.is_member &&
                    <select value={proposalData.selectedOption} onChange={handleChangeSelactedOption}>
                      <option value='all'>All</option>
                      <option value='active'>Active</option>
                      <option value='close'>Close</option>
                    </select>
                  }
                </div>
              </Box>

              <CustomTabPanel value={value} index={0} >
                <div >
                  <div className='tab-inner-voting-block'>
                    {
                      proposalData?.isLoading ?
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
                            proposalData?.data?.length !== 0 ?
                              proposalData?.data?.map((data) => {
                                return (
                                  <>
                                    <Proposal data={data} />
                                  </>
                                )
                              })
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
                                No Proposal data found!
                              </div>

                          }

                        </>

                    }
                  </div>
                </div>
              </CustomTabPanel>


              <CustomTabPanel value={value} index={1}>
                <div >
                  <div className='voting_history'>
                    <span>User</span>
                    <span>Votes</span>
                  </div>
                  <div className='tab-inner-voting-block'>
                    {
                      proposalData?.isLoading ?
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
                            proposalData?.data?.length !== 0 ?
                              proposalData?.data?.map((data, index) => {
                                return (
                                  <>
                                    <ProposalMember data={data} ukey={index} />

                                  </>
                                )
                              })
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
                                No Proposal data found!
                              </div>

                          }

                        </>

                    }
                  </div>
                </div>
              </CustomTabPanel>

              {proposalData?.totalPages && <Pagination
                count={proposalData?.totalPages}
                onChange={(event, newPage) => handlePageChange(event, newPage)}
                style={{
                  background: 'azure',
                  display: 'flex',
                  justifyContent: 'end',
                  width: 'fit-content'
                }}
                color='primary'
                page={proposalData?.page}
              />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProposalList