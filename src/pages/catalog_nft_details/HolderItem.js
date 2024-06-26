import { NetworkParams } from "../../constant";
import {shorter } from "../../utils"

function HolderItem (props) {
  const {holder} = props;
  return (
    <>
      <tr>
        <td>
          <div className='price-wrapper'
            onClick={() => window.open(`/profile/${holder.user.address}`)}>
            <img src={holder.user.lowLogo} alt={''} />
            <p>{holder.user.name}</p>
          </div>
        </td>
        <td>
          <p
            onClick={() => window.open(`${NetworkParams.blockExplorerUrls[0]}/address/${holder.user.address}`)}>
            {shorter(holder.user.address)}
          </p>
        </td>
        <td>
          <p>{holder.balance}</p>
        </td>
      </tr>
    </>
  );
}

export default HolderItem;