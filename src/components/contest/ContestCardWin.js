import React from 'react'
import CompetitionImg from '../../assets/images/tab-product-img.png';
import { formatAddress, formatNum } from '../../utils';
import LoaderImg from "../../assets/images/Loading.gif";

function ContestCardWin({ showPreviousWin, loading }) {
    const { count, record,totalPage } = showPreviousWin
    return (
        <div className='winner-list-block-inner'>
            {

                record.length !==0 ?

                    loading ?
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
                        record.map((data, index) => {
                            return (

                                <div className='block-winner-block' key={index}>
                                    <div className='block-winner-block-inner'>
                                        <div className='block-winner-img'>
                                            {/* <img src={data?.prize_image} alt='' /> */}
                                            <div className='text-winner'>
                                                {/* <p>John.PLS</p> */}
                                                <h4>{formatAddress(data?.account)}</h4>
                                            </div>
                                        </div>
                                        <div className='enteries-item-block'>
                                            <div className='enteries-item-block-inner border-right'>
                                                <p>Entries</p>
                                                <h4>{formatNum(data?.entries)}</h4>
                                            </div>
                                            <div className='enteries-item-block-inner '>
                                                <p>Items</p>
                                                <h4>{formatNum(data?.totalMinted)}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
                        No Winners data found!
                    </div>
            }
        </div>
    )
}

export default ContestCardWin