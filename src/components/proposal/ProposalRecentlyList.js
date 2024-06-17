import React from 'react'
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';


function ProposalRecentlyList(props) {
    const {data}=props
    return (
        <div className='three-block-progress-inner'>
            <div className='three-block-progress-inner-block'>
                {/* <div className='three-block-top-title'>
                    <span>New</span>
                    <a href=''>View Discussion</a>
                </div> */}
                <h3>{data?.title}</h3>
                <div className='progress-block'>
                    <div className='progress-block-inner'>
                        <div className='progress-block-title'>
                            <p>Yes</p>
                            <p>{data?.yesCount} votes ({data?.yesCountPercentage || 0} %)</p>
                        </div>
                        <Box sx={{ width: '100%' }}>
                            <LinearProgress variant='determinate' value={data?.yesCountPercentage || 0} />
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
    )
}

export default ProposalRecentlyList