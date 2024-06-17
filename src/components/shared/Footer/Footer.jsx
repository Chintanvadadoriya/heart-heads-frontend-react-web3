import { useContext } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";

import ThemeContext from "../../../context/ThemeContext";
import Logo_White from "../../../assets/images/logo_white.png";
import Logo_Black from "../../../assets/images/logo_black.png";
// import LogoTesseratx from "../../../assets/images/logo-tesseratx.png";
import LogoHexToys from '../../../assets/images/logo-hex-toys.png';
import "./footer.scss";
import { useActiveWeb3React } from "../../../hooks/useActiveWeb3React";

const Footer = () => {
    const { theme } = useContext(ThemeContext);
    const { account } = useActiveWeb3React();

    return (
      <div className='footer-main'>
        <div className='container'>
          <div className='footer-main-inner'>
            <div className='footer-main-logo'>
              <a href=''>
                <img src={LogoHexToys} alt='' />
              </a>
              {/* <p>
                Your new home for innovation and fun—where collecting NFTs becomes an exciting journey into the future
                of digital creativity.
              </p> */}
              <p>The Future Is In Your Hands</p>
            </div>
            <div className='footer-f-menu'>
              <h3>Community</h3>
              <ul>
                <li>
                  <a href='https://twitter.com/Heart_Heads' target='_blank' rel='noreferrer'>
                    <svg width='21' height='20' viewBox='0 0 21 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                      <path
                        d='M19.3025 5.00016C18.6608 5.29183 17.9691 5.4835 17.2525 5.57516C17.9858 5.1335 18.5525 4.4335 18.8191 3.59183C18.1275 4.0085 17.3608 4.30016 16.5525 4.46683C15.8941 3.75016 14.9691 3.3335 13.9191 3.3335C11.9608 3.3335 10.3608 4.9335 10.3608 6.9085C10.3608 7.19183 10.3941 7.46683 10.4525 7.72516C7.48581 7.57516 4.84414 6.15016 3.08581 3.99183C2.77747 4.51683 2.60247 5.1335 2.60247 5.7835C2.60247 7.02516 3.22747 8.12516 4.19414 8.75016C3.60247 8.75016 3.05247 8.5835 2.56914 8.3335V8.3585C2.56914 10.0918 3.80247 11.5418 5.43581 11.8668C4.91141 12.0103 4.36089 12.0303 3.82747 11.9252C4.05381 12.6356 4.49709 13.2572 5.09499 13.7026C5.69289 14.148 6.41535 14.3949 7.16081 14.4085C5.89717 15.4089 4.3308 15.9496 2.71914 15.9418C2.43581 15.9418 2.15247 15.9252 1.86914 15.8918C3.45247 16.9085 5.33581 17.5002 7.35247 17.5002C13.9191 17.5002 17.5275 12.0502 17.5275 7.32516C17.5275 7.16683 17.5275 7.01683 17.5191 6.8585C18.2191 6.3585 18.8191 5.72516 19.3025 5.00016Z'
                        fill='#8D8DA3'
                      />
                    </svg>
                    <span>Twitter</span>
                  </a>
                </li>
                {/* <li>
				  <a href='#'>
					<svg width='17' height='17' viewBox='0 0 17 17' fill='none' xmlns='http://www.w3.org/2000/svg'>
					  <path
						d='M8.58577 0.666504C7.49143 0.666504 6.40779 0.882052 5.39675 1.30084C4.3857 1.71963 3.46704 2.33346 2.69322 3.10728C1.13042 4.67008 0.252441 6.7897 0.252441 8.99984C0.252441 12.6832 2.64411 15.8082 5.95244 16.9165C6.36911 16.9832 6.50244 16.7248 6.50244 16.4998V15.0915C4.19411 15.5915 3.70244 13.9748 3.70244 13.9748C3.31911 13.0082 2.77744 12.7498 2.77744 12.7498C2.01911 12.2332 2.83577 12.2498 2.83577 12.2498C3.66911 12.3082 4.11077 13.1082 4.11077 13.1082C4.83577 14.3748 6.06077 13.9998 6.53577 13.7998C6.61077 13.2582 6.82744 12.8915 7.06077 12.6832C5.21077 12.4748 3.26911 11.7582 3.26911 8.58317C3.26911 7.65817 3.58577 6.9165 4.12744 6.32484C4.04411 6.1165 3.75244 5.24984 4.21077 4.12484C4.21077 4.12484 4.91077 3.89984 6.50244 4.97484C7.16077 4.7915 7.87744 4.69984 8.58577 4.69984C9.29411 4.69984 10.0108 4.7915 10.6691 4.97484C12.2608 3.89984 12.9608 4.12484 12.9608 4.12484C13.4191 5.24984 13.1274 6.1165 13.0441 6.32484C13.5858 6.9165 13.9024 7.65817 13.9024 8.58317C13.9024 11.7665 11.9524 12.4665 10.0941 12.6748C10.3941 12.9332 10.6691 13.4415 10.6691 14.2165V16.4998C10.6691 16.7248 10.8024 16.9915 11.2274 16.9165C14.5358 15.7998 16.9191 12.6832 16.9191 8.99984C16.9191 7.90549 16.7036 6.82185 16.2848 5.81081C15.866 4.79976 15.2522 3.8811 14.4783 3.10728C13.7045 2.33346 12.7858 1.71963 11.7748 1.30084C10.7638 0.882052 9.68012 0.666504 8.58577 0.666504Z'
						fill='#8D8DA3'
					  />
					</svg>
					<span>Github</span>
				  </a>
				</li> */}
                <li>
                  <a href='https://t.me/heartheads' target='_blank' rel='noreferrer'>
                    <svg width='21' height='20' viewBox='0 0 21 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
                      <path
                        d='M10.5858 1.6665C5.98577 1.6665 2.25244 5.39984 2.25244 9.99984C2.25244 14.5998 5.98577 18.3332 10.5858 18.3332C15.1858 18.3332 18.9191 14.5998 18.9191 9.99984C18.9191 5.39984 15.1858 1.6665 10.5858 1.6665ZM14.4524 7.33317C14.3274 8.64984 13.7858 11.8498 13.5108 13.3248C13.3941 13.9498 13.1608 14.1582 12.9441 14.1832C12.4608 14.2248 12.0941 13.8665 11.6274 13.5582C10.8941 13.0748 10.4774 12.7748 9.76911 12.3082C8.94411 11.7665 9.47744 11.4665 9.95244 10.9832C10.0774 10.8582 12.2108 8.9165 12.2524 8.7415C12.2582 8.715 12.2575 8.68748 12.2502 8.66134C12.2429 8.6352 12.2294 8.61123 12.2108 8.5915C12.1608 8.54984 12.0941 8.5665 12.0358 8.57484C11.9608 8.5915 10.7941 9.3665 8.51911 10.8998C8.18577 11.1248 7.88577 11.2415 7.61911 11.2332C7.31911 11.2248 6.75244 11.0665 6.32744 10.9248C5.80244 10.7582 5.39411 10.6665 5.42744 10.3748C5.44411 10.2248 5.65244 10.0748 6.04411 9.9165C8.47744 8.85817 10.0941 8.15817 10.9024 7.82484C13.2191 6.85817 13.6941 6.6915 14.0108 6.6915C14.0774 6.6915 14.2358 6.70817 14.3358 6.7915C14.4191 6.85817 14.4441 6.94984 14.4524 7.0165C14.4441 7.0665 14.4608 7.2165 14.4524 7.33317Z'
                        fill='#8D8DA3'
                      />
                    </svg>
                    <span>Telegram</span>
                  </a>
                </li>
                {/* <li>
				  <a href='#'>
					<span className='highlight-block'>Advertise Here</span>
				  </a>
				</li> */}
              </ul>
            </div>
            <div className='footer-f-menu'>
              <h3>Info & Support</h3>
              <ul>
                <li>
                  <a href='/Faq'>
                    <span>FAQ</span>
                  </a>
                </li>
                <li>
                  <a href='https://t.me/heartheads' target='_blank' rel='noreferrer'>
                    <span>Support</span>
                  </a>
                </li>
                {/* <li>
				  <a href='#'>
					<span>Help</span>
				  </a>
				</li>
				<li>
				  <a href='#'>
					<span>Discussion</span>
				  </a>
				</li> */}
              </ul>
            </div>
          </div>
          {/* <div className="footer-main-bottom">
                    <div className="footer-main-bottom-inner">
                        <a href="#">Privacy Policy</a>
                    </div>
                    <div className="footer-main-bottom-inner">
                        <p>Copyright © Hex Toys 2023</p>
                    </div>
                    <div className="footer-main-bottom-inner">
                        <a href="#">Terms & Conditions</a>
                    </div>
                </div> */}
        </div>
      </div>
    );
};

export default Footer;
