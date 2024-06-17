import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import './previous-winners.scss';
import CompetitionImg from '../../assets/images/tab-product-img.png';
import axios from 'axios';
import { apiEndPoint } from '../../routes/routes';
import { Pagination } from '@mui/material';
import { formatAddress, formatNum } from '../../utils';
import moment from 'moment';
import LoaderImg from "../../assets/images/Loading.gif";


function PreviousWinners() {
  const [loading, setLoading] = useState(false);
  const [showPreviousWin, setShowPreviousWin] = useState({
    count: 0,
    record: [],
    totalPage: 0
  })
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(5)


  async function handlePageChange(event, newpage) {
    setPage(newpage);
  }

  async function getPreviousWinnersList() {
    try {
      setLoading(true)
      const response = await axios.get(`${process.env.REACT_APP_API}/${apiEndPoint.CONTEST_LIST}`, {
        params: {
          showpreviouswin: 'showpreviouswin',
          page: page,
          limit
        }
      });
      const { data } = response
      setShowPreviousWin((previousState) => ({
        ...previousState,
        count: data?.count,
        record: data?.record,
        totalPage: data?.totalPage,
      }))
      setLoading(false)

    } catch (error) {
      console.log('getPreviousWinnersList error', error)
      setLoading(false)

    }
  }

  useEffect(() => {
    getPreviousWinnersList()
  }, [page])

  return (
    <div className='my-voting-power-main'>
      <div className='container'>
        <div className='voting-block-bg'>
           <div className='back-button'>
            <Link to='/competitions'>
              Back
            </Link>
          </div>
          <div className='table-winner-list'>
            <h2>previous Competition Winners</h2>
            <div className='table-winner-list-inner'>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    {/* <th>Prize</th> */}
                    <th>Address</th>
                    <th>Entries</th>
                    <th>Heart Heads</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    showPreviousWin?.record?.length !== 0 ?
                      loading ?
                        <div
                          className='text_color_gradient_dark'
                          style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            fontSize: '1.5rem',
                            position: 'relative',
                            left: '105%',
                            padding: '3%'
                          }}>
                          <img src={LoaderImg} alt='' />
                        </div>
                        :
                        showPreviousWin?.record?.map((data, index) => {
                          return (
                            <>
                              <tr key={index}>
                                <td>{moment.unix(data?.startdate).format('DD/MM/YY')}</td>
                                {/* <td>{data?.winningprice}</td> */}
                                {/* <td>
                              <div className='name-profile-img'>
                                <img src={data?.prize_image} alt='' />
                                <h4>John Doe</h4>
                              </div>
                            </td> */}
                                <td>{formatAddress(data?.account)}</td>
                                <td>{formatNum(data?.entries)}</td>
                                <td>{formatNum(data?.totalMinted)}</td>
                              </tr>

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
                          fontSize: '1.5rem',
                          position: 'relative',
                          left: '50%',
                          padding: '3%'
                        }}>
                        No Previous Winners data found!
                      </div>
                  }

                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <Pagination
        count={showPreviousWin?.totalPage}
        onChange={(event, newPage) => handlePageChange(event, newPage)}
        style={{
          background: 'azure',
          display: 'flex',
          justifyContent: 'end',
          width: 'fit-content'
        }}
        color='primary'
        page={page}
      />
    </div>
  );
}

export default PreviousWinners;