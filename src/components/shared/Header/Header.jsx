import { Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { useActiveWeb3React } from "../../../hooks/useActiveWeb3React";
import LogoNewTwo from "../../../assets/images/logo-new-2.svg";
// import LogoNewTwo from '../../../assets/images/logo-heart-heads.svg';
import "./header.scss";
import { ConnectWallet, darkTheme, lightTheme } from "@thirdweb-dev/react";
import { formatAddress } from "../../../utils";
import { useHistory } from "react-router-dom";
import { PulsechainTestnetV4, Pulsechain, Mumbai } from "@thirdweb-dev/chains";
import { chainTypeId } from "../../../constant";
import GiftBox from "../../../assets/images/gift-box.svg";

const Header = () => {
  const history = useHistory();
  const currentPath = history.location.pathname;

  const [switchingNetwork, setSwitchingNetwork] = useState(false);

  const { account, deactivate, chainId, switchNetwork } = useActiveWeb3React();
  const [hideNavManu, sethideNavManu] = useState(false);

  const handleToggelClass = () => {
    sethideNavManu(!hideNavManu);
  };

  const handleSwitchNetwork = async (newChainId) => {
    console.log("newChainId", newChainId)
    if (switchingNetwork) {
      console.log('Network switch already in progress. Please wait.');
      return;
    }

    try {
      setSwitchingNetwork(true);
      await switchNetwork(newChainId);
      console.log('Network switched successfully.');
    } catch (error) {
      console.error('Error switching network:', error);
    } finally {
      setSwitchingNetwork(false);
    }
  };

  let result;

  switch (chainId) {
    case PulsechainTestnetV4.chainId:
      result = chainTypeId.testPulseChain;
      break;
    case Pulsechain.chainId:
      result = chainTypeId.pulseChain;
      break;
    // Add more cases as needed
    default:
      result = chainTypeId.pulseChain;
  }
  return (
    <div className='header-main'>
      <div className='header-main-left'>
        <div className='h-logo'>
          <Link to='/'>
            <a>
              <img src={LogoNewTwo} alt='' />
            </a>
          </Link>
        </div>
        <div className='toggle-menu-bar' onClick={handleToggelClass}>
          <Link to={currentPath}>
            <svg width='18' height='12' viewBox='0 0 18 12' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M0.666504 0.996159C0.666504 0.537825 1.03817 0.166992 1.49567 0.166992H8.17067C8.39058 0.166992 8.60148 0.25435 8.75698 0.409849C8.91248 0.565348 8.99984 0.77625 8.99984 0.996159C8.99984 1.21607 8.91248 1.42697 8.75698 1.58247C8.60148 1.73797 8.39058 1.82533 8.17067 1.82533H1.49567C1.27576 1.82533 1.06486 1.73797 0.909361 1.58247C0.753862 1.42697 0.666504 1.21607 0.666504 0.996159ZM0.666504 6.00033C0.666504 5.54199 1.03817 5.17116 1.49567 5.17116H16.504C16.7239 5.17116 16.9348 5.25852 17.0903 5.41402C17.2458 5.56951 17.3332 5.78042 17.3332 6.00033C17.3332 6.22023 17.2458 6.43114 17.0903 6.58663C16.9348 6.74213 16.7239 6.82949 16.504 6.82949H1.49567C1.27576 6.82949 1.06486 6.74213 0.909361 6.58663C0.753862 6.43114 0.666504 6.22023 0.666504 6.00033ZM1.49567 10.1753C1.27576 10.1753 1.06486 10.2627 0.909361 10.4182C0.753862 10.5737 0.666504 10.7846 0.666504 11.0045C0.666504 11.2244 0.753862 11.4353 0.909361 11.5908C1.06486 11.7463 1.27576 11.8337 1.49567 11.8337H11.504C11.7239 11.8337 11.9348 11.7463 12.0903 11.5908C12.2458 11.4353 12.3332 11.2244 12.3332 11.0045C12.3332 10.7846 12.2458 10.5737 12.0903 10.4182C11.9348 10.2627 11.7239 10.1753 11.504 10.1753H1.49567Z'
                fill='white'
              />
            </svg>
          </Link>
        </div>
        <ul className={hideNavManu ? 'hide_nav_menu' : ''}>
          <li className='close-icon'>
            <Link to={currentPath} onClick={handleToggelClass}>
              <svg width='32' height='32' viewBox='0 0 32 32' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M17.8668 15.9999L26.2668 7.59992C26.8002 7.06658 26.8002 6.26659 26.2668 5.73325C25.7335 5.19992 24.9335 5.19992 24.4002 5.73325L16.0002 14.1333L7.60016 5.73325C7.06683 5.19992 6.26683 5.19992 5.7335 5.73325C5.20016 6.26659 5.20016 7.06658 5.7335 7.59992L14.1335 15.9999L5.7335 24.3999C5.46683 24.6666 5.3335 24.9333 5.3335 25.3333C5.3335 26.1333 5.86683 26.6666 6.66683 26.6666C7.06683 26.6666 7.3335 26.5333 7.60016 26.2666L16.0002 17.8666L24.4002 26.2666C24.6668 26.5333 24.9335 26.6666 25.3335 26.6666C25.7335 26.6666 26.0002 26.5333 26.2668 26.2666C26.8002 25.7333 26.8002 24.9333 26.2668 24.3999L17.8668 15.9999Z'
                  fill='white'
                />
              </svg>
            </Link>
          </li>
          <li onClick={handleToggelClass}>
            <Link to='/explore'>
              <a>Explore</a>
            </Link>
          </li>
          <li onClick={handleToggelClass}>
            <Link to='/'>
              <a>Mint</a>
            </Link>
          </li>
          <li onClick={handleToggelClass}>
            <Link to='/inventory'>
              <a>Inventory</a>
            </Link>
          </li>
          <li onClick={handleToggelClass}>
            <Link to='/catalog'>
              <a>Catalog</a>
            </Link>
          </li>
          <li onClick={handleToggelClass}>
            <Link to='/proposal-list'>
              <a>Voting</a>
            </Link>
          </li>
          <li onClick={handleToggelClass}>
            <Link to='/Staking'>
              <a>Staking</a>
            </Link>
          </li>
          {/* <li onClick={handleToggelClass}>
            <Link to='/competitions'>
              <a>Competition</a>
            </Link>
          </li> */}
          <li onClick={handleToggelClass}>
            <Link to='/Faq'>
              <a>FAQ</a>
            </Link>
          </li> 
        </ul>
        <div className='compose-btn'>
          <button>
            <svg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
              <path
                d='M17.9664 2.08009C17.9093 2.01737 17.8401 1.96688 17.763 1.93166C17.6858 1.89644 17.6024 1.87723 17.5176 1.87518C17.4328 1.87314 17.3485 1.8883 17.2697 1.91976C17.191 1.95122 17.1194 1.99832 17.0594 2.05821L16.5762 2.53907C16.5176 2.59767 16.4847 2.67713 16.4847 2.75997C16.4847 2.84282 16.5176 2.92227 16.5762 2.98087L17.0191 3.42306C17.0482 3.45223 17.0827 3.47538 17.1207 3.49118C17.1587 3.50697 17.1995 3.5151 17.2406 3.5151C17.2818 3.5151 17.3225 3.50697 17.3606 3.49118C17.3986 3.47538 17.4331 3.45223 17.4621 3.42306L17.9332 2.95431C18.1715 2.71642 18.1938 2.32892 17.9664 2.08009ZM15.5992 3.51564L8.54766 10.5547C8.5049 10.5973 8.47383 10.6501 8.45742 10.7082L8.13125 11.6797C8.12344 11.7061 8.12289 11.734 8.12965 11.7607C8.13642 11.7873 8.15025 11.8117 8.16969 11.8311C8.18913 11.8505 8.21346 11.8644 8.24011 11.8711C8.26676 11.8779 8.29474 11.8774 8.3211 11.8695L9.2918 11.5434C9.34987 11.527 9.40273 11.4959 9.44531 11.4531L16.4844 4.40079C16.5495 4.33497 16.586 4.24612 16.586 4.15353C16.586 4.06094 16.5495 3.97208 16.4844 3.90626L16.0957 3.51564C16.0298 3.44992 15.9405 3.41302 15.8475 3.41302C15.7544 3.41302 15.6651 3.44992 15.5992 3.51564Z'
                fill='url(#paint0_linear_3778_170)'
              />
              <path
                d='M15.0914 7.56484L10.3301 12.3355C10.1461 12.52 9.91988 12.6569 9.67109 12.7344L8.65937 13.073C8.41927 13.1409 8.16543 13.1434 7.924 13.0805C7.68258 13.0175 7.46231 12.8913 7.28589 12.7149C7.10947 12.5385 6.98328 12.3182 6.92033 12.0768C6.85737 11.8354 6.85993 11.5815 6.92773 11.3414L7.26641 10.3297C7.34365 10.081 7.48026 9.85481 7.66445 9.6707L12.4352 4.90859C12.4789 4.86491 12.5087 4.80924 12.5208 4.74863C12.5329 4.68801 12.5267 4.62517 12.5031 4.56806C12.4795 4.51094 12.4394 4.46211 12.3881 4.42775C12.3367 4.39339 12.2763 4.37503 12.2145 4.375H4.0625C3.48234 4.375 2.92594 4.60547 2.5157 5.0157C2.10547 5.42594 1.875 5.98234 1.875 6.5625V15.9375C1.875 16.5177 2.10547 17.0741 2.5157 17.4843C2.92594 17.8945 3.48234 18.125 4.0625 18.125H13.4375C14.0177 18.125 14.5741 17.8945 14.9843 17.4843C15.3945 17.0741 15.625 16.5177 15.625 15.9375V7.78555C15.625 7.72374 15.6066 7.66333 15.5723 7.61195C15.5379 7.56057 15.4891 7.52054 15.4319 7.49692C15.3748 7.47329 15.312 7.46714 15.2514 7.47923C15.1908 7.49132 15.1351 7.52111 15.0914 7.56484Z'
                fill='url(#paint1_linear_3778_170)'
              />
              <defs>
                <linearGradient
                  id='paint0_linear_3778_170'
                  x1='8.12495'
                  y1='6.87542'
                  x2='18.125'
                  y2='6.87542'
                  gradientUnits='userSpaceOnUse'>
                  <stop stop-color='#F326B4' />
                  <stop offset='1' stop-color='#FE511B' />
                </linearGradient>
                <linearGradient
                  id='paint1_linear_3778_170'
                  x1='1.875'
                  y1='11.25'
                  x2='15.625'
                  y2='11.25'
                  gradientUnits='userSpaceOnUse'>
                  <stop stop-color='#F326B4' />
                  <stop offset='1' stop-color='#FE511B' />
                </linearGradient>
              </defs>
            </svg>
            <Link to='/compose'>
              <span>Compose</span>
            </Link>
          </button>
        </div>
        
          <div onClick={handleToggelClass} style={{marginLeft:'20px'}}>
          <Link to='/competitions'>
            <a>
              <img src={GiftBox} style={{width:'30px',height:"30px"}} alt='' />
            </a>
          </Link>
          </div>
      
      </div>
      <div className='header-main-right'>
        {!account ? (
          <button className='btn-block-mobile'>
            <span className='icon-right'>
              <svg width='26' height='26' viewBox='0 0 26 26' fill='none' xmlns='http://www.w3.org/2000/svg'>
                <g clip-path='url(#clip0_3778_178)'>
                  <path
                    d='M3.625 0.5V3.625H0.5V5.70833H3.625V8.83333H5.70833V5.70833H8.83333V3.625H5.70833V0.5H3.625ZM9.875 3.625V6.75H6.75V9.875H3.625V20.2917C3.625 20.8442 3.84449 21.3741 4.23519 21.7648C4.62589 22.1555 5.1558 22.375 5.70833 22.375H20.2917C21.4479 22.375 22.375 21.4479 22.375 20.2917V19.25H13C12.4475 19.25 11.9176 19.0305 11.5269 18.6398C11.1362 18.2491 10.9167 17.7192 10.9167 17.1667V8.83333C10.9167 8.2808 11.1362 7.75089 11.5269 7.36019C11.9176 6.96949 12.4475 6.75 13 6.75H22.375V5.70833C22.375 5.1558 22.1555 4.62589 21.7648 4.23519C21.3741 3.84449 20.8442 3.625 20.2917 3.625H9.875ZM13 8.83333V17.1667H23.4167V8.83333H13ZM17.1667 11.4375C18.0312 11.4375 18.7292 12.1354 18.7292 13C18.7292 13.8646 18.0312 14.5625 17.1667 14.5625C16.3021 14.5625 15.6042 13.8646 15.6042 13C15.6042 12.1354 16.3021 11.4375 17.1667 11.4375Z'
                    fill='white'
                  />
                </g>
                <defs>
                  <clipPath id='clip0_3778_178'>
                    <rect width='25' height='25' fill='white' transform='translate(0.5 0.5)' />
                  </clipPath>
                </defs>
              </svg>
            </span>
            <ConnectWallet
              theme={darkTheme({
                colors: {
                  accentText: '#fff',
                  accentButtonBg: '#fff'
                }
              })}
              btnTitle={'Connect Wallet'}
              switchToActiveChain={true}
              modalSize={'wide'}
              welcomeScreen={{
                img: {
                  src: `${LogoNewTwo}`,
                  width: 300,
                  height: 300
                },
                title: 'Composable NFT Collection On PulseChain',
                subtitle: ' '
              }}
              modalTitleIconUrl={''}
            />
          </button>
        ) : (
          chainId === result ?
            <button onClick={deactivate}>
              <span className='icon-right'>
                <svg width='26' height='26' viewBox='0 0 26 26' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <g clip-path='url(#clip0_3778_178)'>
                    <path
                      d='M3.625 0.5V3.625H0.5V5.70833H3.625V8.83333H5.70833V5.70833H8.83333V3.625H5.70833V0.5H3.625ZM9.875 3.625V6.75H6.75V9.875H3.625V20.2917C3.625 20.8442 3.84449 21.3741 4.23519 21.7648C4.62589 22.1555 5.1558 22.375 5.70833 22.375H20.2917C21.4479 22.375 22.375 21.4479 22.375 20.2917V19.25H13C12.4475 19.25 11.9176 19.0305 11.5269 18.6398C11.1362 18.2491 10.9167 17.7192 10.9167 17.1667V8.83333C10.9167 8.2808 11.1362 7.75089 11.5269 7.36019C11.9176 6.96949 12.4475 6.75 13 6.75H22.375V5.70833C22.375 5.1558 22.1555 4.62589 21.7648 4.23519C21.3741 3.84449 20.8442 3.625 20.2917 3.625H9.875ZM13 8.83333V17.1667H23.4167V8.83333H13ZM17.1667 11.4375C18.0312 11.4375 18.7292 12.1354 18.7292 13C18.7292 13.8646 18.0312 14.5625 17.1667 14.5625C16.3021 14.5625 15.6042 13.8646 15.6042 13C15.6042 12.1354 16.3021 11.4375 17.1667 11.4375Z'
                      fill='white'
                    />
                  </g>
                  <defs>
                    <clipPath id='clip0_3778_178'>
                      <rect width='25' height='25' fill='white' transform='translate(0.5 0.5)' />
                    </clipPath>
                  </defs>
                </svg>
              </span>
              <span>{account && formatAddress(account)}</span>
            </button> :
            <button onClick={() => handleSwitchNetwork(result)}>
              <span className='icon-right'>
                <svg width='26' height='26' viewBox='0 0 26 26' fill='none' xmlns='http://www.w3.org/2000/svg'>
                  <g clip-path='url(#clip0_3778_178)'>
                    <path
                      d='M3.625 0.5V3.625H0.5V5.70833H3.625V8.83333H5.70833V5.70833H8.83333V3.625H5.70833V0.5H3.625ZM9.875 3.625V6.75H6.75V9.875H3.625V20.2917C3.625 20.8442 3.84449 21.3741 4.23519 21.7648C4.62589 22.1555 5.1558 22.375 5.70833 22.375H20.2917C21.4479 22.375 22.375 21.4479 22.375 20.2917V19.25H13C12.4475 19.25 11.9176 19.0305 11.5269 18.6398C11.1362 18.2491 10.9167 17.7192 10.9167 17.1667V8.83333C10.9167 8.2808 11.1362 7.75089 11.5269 7.36019C11.9176 6.96949 12.4475 6.75 13 6.75H22.375V5.70833C22.375 5.1558 22.1555 4.62589 21.7648 4.23519C21.3741 3.84449 20.8442 3.625 20.2917 3.625H9.875ZM13 8.83333V17.1667H23.4167V8.83333H13ZM17.1667 11.4375C18.0312 11.4375 18.7292 12.1354 18.7292 13C18.7292 13.8646 18.0312 14.5625 17.1667 14.5625C16.3021 14.5625 15.6042 13.8646 15.6042 13C15.6042 12.1354 16.3021 11.4375 17.1667 11.4375Z'
                      fill='white'
                    />
                  </g>
                  <defs>
                    <clipPath id='clip0_3778_178'>
                      <rect width='25' height='25' fill='white' transform='translate(0.5 0.5)' />
                    </clipPath>
                  </defs>
                </svg>
              </span>
              <span>Switch Network</span>
            </button>
        )}
      </div>
    </div>
  );
};

export default Header;
