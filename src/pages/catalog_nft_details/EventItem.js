
import { format } from "date-fns";
import { formatNum, getCurrencyInfoFromAddress, shorter } from "../../utils"


function EventItem(props) {
  const { event } = props;

  return (
    <>
      <tr>
        <td>
          <p>{event.name}</p>
        </td>
        <td>
          <div className='price-wrapper'>
            {
              event.price > 0 &&
              <>
                <img src={getCurrencyInfoFromAddress(event.tokenAdr).logoURI} alt={''} />
                <p>{formatNum(event.price)}</p>
              </>
            }
          </div>
        </td>
        <td>
          <p>{event.amount}</p>
        </td>
        <td>
          <div className='price-wrapper'>
            {
              event.fromUser &&
              <>
                <img src={event?.fromUser?.lowLogo} onClick={() => window.open(`/profile/${event.fromUser.address}`)} alt={''} />
                <p>
                  {event.fromUser.name === 'NoName' ? shorter(event.from) : event.fromUser.name}
                </p>
              </>
            }
          </div>
        </td>
        <td>
          <div className='price-wrapper'>
            {
              event.toUser &&
              <>
                <img src={event.toUser.lowLogo} onClick={() => window.open(`/profile/${event.toUser.address}`)} alt={''} />
                <p>
                  {event.toUser.name === 'NoName' ? shorter(event.to) : event.toUser.name}
                </p>
              </>
            }
          </div>
        </td>
        <td>
          <div className='date-wrapper'>
            <p>{format(event.timestamp * 1000, "yyyy-MM-dd HH:mm")}</p>
          </div>
        </td>
      </tr>
    </>
  );
}

export default EventItem;