import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom";
import './competitions.scss';
import CompetitionImg from '../../assets/images/tab-product-img.png';
import PriceImg from '../../assets/images/bg-com.png';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import { C } from '@styled-icons/fa-solid';
import { apiEndPoint } from '../../routes/routes';
import axios from 'axios';
import ContestWinnerTable from '../../components/contest/ContestWinnerTable';
import ContestCardWin from '../../components/contest/ContestCardWin';
import Countdown from 'react-countdown';
import { capitalizeFirstLetter, remainingTimePercentage } from '../../utils';
import LoaderImg from "../../assets/images/Loading.gif";



const Completionist = ({ endMessage }) => <p style={{
  textAlign: 'center',
  fontSize: '20px',
  color: 'white'
}}>{endMessage}</p>;

const Renderer = ({
  days,
  hours,
  minutes,
  seconds,
  completed,
  handleComplate,
  endMessage,

}) => {
  if (completed) {
    typeof handleComplate === "function" && handleComplate();

    return <Completionist endMessage={endMessage} />;
  } else {

    return (
      <h2>
        {<span>{days}d</span>}
        <span className="dots-block">:</span>
        <span>{hours}h</span>
        <span className="dots-block">:</span>
        <span>{minutes}m</span>
        <span className="dots-block">:</span>
        <span>{seconds}s</span>
      </h2>
    )
  }
};


const RemainingTimeToEnterHeartHead = ({
  date,
  handleComplate,
  endMessage = "Contest ended!",
  useFor = "Home"
}) => {
  return (
    <Countdown
      date={date}
      renderer={(props) => (
        <Renderer
          handleComplate={handleComplate}
          endMessage={endMessage}
          useFor={useFor}
          {...props}
        />
      )}
    />
  );
};

function Competitions() {
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  const [contestList, setContestList] = useState([])

  const [leaderboard, setLeaderBoard] = useState({
    instructions: '',
    startdate: 0,
    enddate: 0,
    winningprice: '',
    number_of_winners: 0,
    TotalItemEntries: 0,
    count: 0,
    record: [],
    totalPage: 0,
  })
  const [showPreviousWin, setShowPreviousWin] = useState({
    count: 0,
    record: [],
    totalPage: 0
  })
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(5)

  // page change
  async function handlePageChange(event, newpage) {
    setPage(newpage);
  }

  async function getContestList() {
    try {
      setLoading(true)
      const response = await axios.get(`${process.env.REACT_APP_API}/${apiEndPoint.CONTEST_LIST}`);
      setContestList(response?.data?.record[0]) // show cuurect contest 
      setLoading(false)

    } catch (error) {
      console.log('getContestList error', error)
      setLoading(false)

    }
  }

  async function getContestListLeaderBoard() {
    try {
      setLoading(true)
      if (!contestList?._id) return
      const response = await axios.get(`${process.env.REACT_APP_API}/${apiEndPoint.CONTEST_WINNERS_LIST}/${contestList?._id}`,
        {
          params: {
            page: page,
            limit
          }
        }
      );
      const { data } = response
      setLeaderBoard(priviousState => ({
        ...priviousState,
        instructions: data?.instructions,
        TotalItemEntries: data?.TotalItemEntries,
        count: data?.count,
        enddate: data?.enddate,
        startdate: data?.startdate,
        winningprice: data?.winningprice,
        number_of_winners: data?.number_of_winners,
        record: data?.record,
        totalPage: data?.totalPage
      }))
      setLoading(false)

    } catch (error) {
      setLoading(false)
      console.log('getContestListLeaderBoard error', error)
    }
  }

  async function getPreviousWinnersList() {

    try {
      setLoading(true)
      const response = await axios.get(`${process.env.REACT_APP_API}/${apiEndPoint.CONTEST_LIST}`, {
        params: {
          showpreviouswin: 'showpreviouswin',
          page: 1,
          limit: 3 // show first 3 record 
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
      setLoading(false)
      console.log('getPreviousWinnersList error', error)
    }
  }

  useEffect(() => {
    getContestList()
    getPreviousWinnersList()
  }, [page])

  useEffect(() => {
    getContestListLeaderBoard()
  }, [contestList, page])


  useEffect(() => {
    if (contestList?.enddate && contestList?.startdate) {
      let percentageTime = remainingTimePercentage(contestList.enddate, contestList.startdate)
      setProgress(percentageTime);
    } else {
      console.log('contestList.enddate is undefined or invalid', contestList?.enddate)
    }
  }, [contestList?.enddate, contestList?.startdate]);

  if(loading){
    return (
      <div
      className='text_color_gradient_dark'
      style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          fontSize: '1.5rem',
          padding:'8%'
      }}>
      <img src={LoaderImg} alt='' />
  </div>
    )
  }

  if (contestList?.length === 0) return <div className='text_color_gradient_dark'
    style={{
      fontSize: '50px',
      textAlign: 'center',
      padding: '8.5% 0'
    }}
  >The contest is not available!  </div>

  return (
    <div className='my-voting-power-main'>
      <div className='container'>
        <div className='voting-block-bg'>
          <div className='price-intro-block'>
            <div className='price-intro-block-left'>
              <h2>Prize</h2>
              <div className='price-intro-block-left-inner no-bg-block'>
                {/* <img src='../../assets/images/bg-com.png' alt='img'></img> */}
                <img src={contestList?.prize_image || PriceImg} alt='' />
                <h3>{contestList?.winningprice}</h3>
              </div>
            </div>
            <div className='price-intro-block-right'>
              <h2>Instructions</h2>
              <div className='price-intro-block-right-inner'>
                <h5>{capitalizeFirstLetter(contestList?.instructions || 'heart-heads')}</h5>
              </div>
            </div>
          </div>
          <div className='competition-block'>
            <h2>Competition</h2>
            <div className='competition-block-inner'>
              <div className='competition-block-inner-left'>
                <div className='competition-block-inner-left-inner'>
                  <img src={contestList?.prize_image} alt='' />
                  <h4>Contestants</h4>
                  <h3>{leaderboard?.count}</h3>
                  {/* <div className='three-dots'>
                    <Link href=''>
                      <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                          d='M9.99968 16.6667C9.54134 16.6667 9.14912 16.5036 8.82301 16.1775C8.4969 15.8514 8.33356 15.4589 8.33301 15C8.33245 14.5411 8.49579 14.1489 8.82301 13.8233C9.15023 13.4978 9.54245 13.3344 9.99968 13.3333C10.4569 13.3322 10.8494 13.4955 11.1772 13.8233C11.505 14.1511 11.668 14.5433 11.6663 15C11.6647 15.4567 11.5016 15.8492 11.1772 16.1775C10.8527 16.5058 10.4602 16.6689 9.99968 16.6667ZM9.99968 11.6667C9.54134 11.6667 9.14912 11.5036 8.82301 11.1775C8.4969 10.8514 8.33356 10.4589 8.33301 9.99999C8.33245 9.5411 8.49579 9.14887 8.82301 8.82332C9.15023 8.49776 9.54245 8.33443 9.99968 8.33332C10.4569 8.33221 10.8494 8.49554 11.1772 8.82332C11.505 9.1511 11.668 9.54332 11.6663 9.99999C11.6647 10.4567 11.5016 10.8492 11.1772 11.1775C10.8527 11.5058 10.4602 11.6689 9.99968 11.6667ZM9.99968 6.66665C9.54134 6.66665 9.14912 6.5036 8.82301 6.17749C8.4969 5.85137 8.33356 5.45887 8.33301 4.99999C8.33245 4.5411 8.49579 4.14887 8.82301 3.82332C9.15023 3.49776 9.54245 3.33443 9.99968 3.33332C10.4569 3.33221 10.8494 3.49554 11.1772 3.82332C11.505 4.1511 11.668 4.54332 11.6663 4.99999C11.6647 5.45665 11.5016 5.84915 11.1772 6.17749C10.8527 6.50582 10.4602 6.66887 9.99968 6.66665Z'
                          fill='white'
                        />
                      </svg>
                    </Link>
                  </div> */}
                </div>
              </div>
              <div className='competition-block-inner-left'>
                <div className='competition-block-inner-left-inner'>
                  <img src={contestList?.prize_image} alt='' />
                  <h4>Entries</h4>
                  <h3>{leaderboard?.TotalItemEntries}</h3>
                  {/* <div className='three-dots'>
                    <Link href=''>
                      <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                          d='M9.99968 16.6667C9.54134 16.6667 9.14912 16.5036 8.82301 16.1775C8.4969 15.8514 8.33356 15.4589 8.33301 15C8.33245 14.5411 8.49579 14.1489 8.82301 13.8233C9.15023 13.4978 9.54245 13.3344 9.99968 13.3333C10.4569 13.3322 10.8494 13.4955 11.1772 13.8233C11.505 14.1511 11.668 14.5433 11.6663 15C11.6647 15.4567 11.5016 15.8492 11.1772 16.1775C10.8527 16.5058 10.4602 16.6689 9.99968 16.6667ZM9.99968 11.6667C9.54134 11.6667 9.14912 11.5036 8.82301 11.1775C8.4969 10.8514 8.33356 10.4589 8.33301 9.99999C8.33245 9.5411 8.49579 9.14887 8.82301 8.82332C9.15023 8.49776 9.54245 8.33443 9.99968 8.33332C10.4569 8.33221 10.8494 8.49554 11.1772 8.82332C11.505 9.1511 11.668 9.54332 11.6663 9.99999C11.6647 10.4567 11.5016 10.8492 11.1772 11.1775C10.8527 11.5058 10.4602 11.6689 9.99968 11.6667ZM9.99968 6.66665C9.54134 6.66665 9.14912 6.5036 8.82301 6.17749C8.4969 5.85137 8.33356 5.45887 8.33301 4.99999C8.33245 4.5411 8.49579 4.14887 8.82301 3.82332C9.15023 3.49776 9.54245 3.33443 9.99968 3.33332C10.4569 3.33221 10.8494 3.49554 11.1772 3.82332C11.505 4.1511 11.668 4.54332 11.6663 4.99999C11.6647 5.45665 11.5016 5.84915 11.1772 6.17749C10.8527 6.50582 10.4602 6.66887 9.99968 6.66665Z'
                          fill='white'
                        />
                      </svg>
                    </Link>
                  </div> */}
                </div>
              </div>
              <div className='competition-block-inner-right'>
                <div className='competition-block-inner-right-inner'>
                  <h4>Remaining time to enter</h4>
                  <div className='timer-block-progress'>
                    {contestList?.enddate && (
                      <RemainingTimeToEnterHeartHead
                        date={contestList?.enddate * 1000}
                        handleComplete={() => console.log('Contest ended!')}
                      />
                    )}
                    {progress < 100 && (
                      <div className='progress-bar-block'>
                        <Box sx={{ width: '100%' }}>
                          <LinearProgress variant='determinate' value={progress} />
                        </Box>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='winner-list-block'>
            <div className='winner-list-block-title-block'>
              <h2>Winners</h2>
              <Link to='/previous-winners'>Previous Competitions</Link>
            </div>
            <ContestCardWin showPreviousWin={showPreviousWin} loading={loading} />
          </div>
          <ContestWinnerTable leaderboard={leaderboard} handlePageChange={handlePageChange} page={page} limit={limit} loading={loading} />
        </div>
      </div>
    </div>
  );
}

export default Competitions;