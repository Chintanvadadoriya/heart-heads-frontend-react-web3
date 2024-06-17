import React from 'react'

function ProposalMember({data,ukey}) {
  return (
    <>
     <div className='tab-inner-voting-block-inner' key={ukey} >
            <div className='tab-inner-voting-block-inner-top' style={{marginBottom:'0px'}}>
                <div className='tab-inner-voting-block-inner-top-left'>
                    <h3>
                        {data?.account}
                    </h3>
                </div>
                <h3 style={{color:"white", marginBottom:'0px'}}>{data?.totalValue} Votes</h3>
            </div>
         
        </div>
    </>
  )
}

export default ProposalMember