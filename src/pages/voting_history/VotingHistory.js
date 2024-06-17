import React, { useEffect, useState } from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import VotingImg from '../../assets/images/tab-product-img.png';
import { Link } from "react-router-dom";
import { apiEndPoint } from '../../routes/routes';
import axios from 'axios';
import { Pagination } from '@mui/material';
import LoaderImg from "../../assets/images/Loading.gif";
import { useParams } from 'react-router-dom';
import './voting_history.scss'

function VotingHistory() {
  let { id } = useParams();

  const [voteHistory, setVoteHistory] = useState({
    isLoding: false,
    data: [],
    page: 1,
    totalPages: 1
  });

  async function handlePageChange(event, newpage) {
    setVoteHistory((previousState) => ({
      ...previousState,
      page: newpage
    }))
  }

  async function GetVotingHistory() {
    try {
      setVoteHistory((previousState) => ({
        ...previousState,
        isLoding: true
      }))
      const response = await axios.get(
        `${process.env.REACT_APP_API}/${apiEndPoint.VOTING_HISTORY}`, {
        params: {
          page: voteHistory.page,
          id: id
        }
      }
      );
      if (response.status === 200) {
        setVoteHistory((previousState) => ({
          ...previousState,
          data: response?.data?.items,
          totalPages: response?.data?.totalPages,
          isLoding: false
        }))
      }
      console.log('response', response)

    } catch (error) {
      console.log("error voting history 1612", error)
      setVoteHistory((previousState) => ({
        ...previousState,
        isLoding: false
      }))
    }
    finally {
      setVoteHistory((previousState) => ({
        ...previousState,
        isLoding: false
      }))
    }
  }

  useEffect(() => {
    GetVotingHistory()
  }, [voteHistory.page])

  return (
    <div className='my-voting-power-main'>
      <div className='container'>
        <div className='voting-block-bg'>
          <div className='back-button'>
            <Link to={`/voting/${id}`}>
              Back
            </Link>
          </div>
          <div className='voting-block-title'>
            <div className='text-dicription-block'>
              <h2>Votes History</h2>
            </div>
          </div>

          <div className='voting-tabs-block'>
            <div className='voting-tabs-block-inner-bg overflow-scroll-auto'>
              {/* <table className='wrapper'>
                <thead>
                  <tr>
                    <th>Address</th>
                    <th>Yes</th>
                    <th>No</th>
                    <th>Abstain</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    voteHistory?.data?.map((data,index) => {
                      return (
                        <>
                          <tr key={index}>
                            <td>{data?.voter}</td>
                            <td>{data?.support ===1 ? data?.power:0}</td>
                            <td>{data?.support === 0 ? data?.power:0}</td>
                            <td>{data?.support ===2 ?data?.power:0}</td>
                          </tr>
                        </>
                      )
                    })
                  }
                </tbody>
              </table> */}

              

                <div class="table">
                  <div class="table-header">
                    <div class="header__item">Address</div>
                    <div class="header__item">Yes</div>
                    <div class="header__item">No</div>
                    <div class="header__item">Abstain</div>
                  </div>
                  <div class="table-content">
                    {
                      voteHistory?.isLoding ?

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

                        voteHistory?.data?.map((data, index) => {
                          return (
                            <>

                              <div class="table-row">
                                <div class="table-data">{data?.voter}</div>
                                <div class="table-data">{data?.support === 1 ? data?.power : 0}</div>
                                <div class="table-data">{data?.support === 0 ? data?.power : 0}</div>
                                <div class="table-data">{data?.support === 2 ? data?.power : 0}</div>
                              </div>
                            </>
                          )
                        })
                    }
                  </div>
                </div>
              

            </div>
            <Pagination
              count={voteHistory?.totalPages}
              onChange={(event, newPage) => handlePageChange(event, newPage)}
              style={{
                background: 'azure',
                display: 'flex',
                justifyContent: 'end',
                width: 'fit-content'
              }}
              color='primary'
              page={voteHistory?.page}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default VotingHistory;