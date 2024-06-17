import React from 'react'
import CompetitionImg from '../../assets/images/tab-product-img.png';
import { Pagination } from '@mui/material';
import { formatAddress, formatNum } from '../../utils';
import LoaderImg from "../../assets/images/Loading.gif";

function ContestWinnerTable({ leaderboard, handlePageChange, page, limit, loading }) {
    const { record, instructions, startdate, winningprice, TotalItemEntries, totalPage } = leaderboard
    return (
        <div className='table-winner-list'>
            <h2>leaderboard</h2>
            <div className='table-winner-list-inner'>
                <table>
                    <thead>
                        <tr>
                            <th>Rank</th>
                            {/* <th>Name</th> */}
                            <th>Address</th>
                            <th>Entries</th>
                        </tr>
                    </thead>
                    {
                        record ?
                            loading ?
                                <div
                                    className='text_color_gradient_dark'
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        position: 'relative',
                                        left: '100%',
                                        padding: '3%'
                                    }}>
                                    <img src={LoaderImg} alt='' />
                                </div>
                                :
                                record?.map((data, index) => {
                                    return (
                                        <>
                                            <tbody>
                                                <tr key={index}>
                                                    <td>{(page - 1) * limit + 1 + index}</td>
                                                    {/* <td>
                                                <div className='name-profile-img'>
                                                    <img src={CompetitionImg} alt='' />
                                                    <h4>John Doe</h4>
                                                </div>
                                            </td> */}
                                                    <td>{formatAddress(data?.address)}</td>
                                                    <td>{formatNum(data?.count)}</td>
                                                </tr>
                                            </tbody>
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
                                    left: '80%',
                                    padding: '3%'
                                }}>
                                No Winners found!
                            </div>
                    }
                </table>
            </div>
            <Pagination
                count={totalPage}
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
    )
}

export default ContestWinnerTable