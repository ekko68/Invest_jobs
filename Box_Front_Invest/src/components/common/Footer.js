/** @jsxImportSource @emotion/react */
import { footerStyle } from 'assets/style/ComponentStyle'
import { Link } from 'react-router-dom'

const Footer = (props) => {
  return (
    <div className="footer_wrap" css={footerStyle}>
      <div className="footer default_size">
        <div className="footer_left">
          <h2>
            <img src="/images/logo_ibkbank_black.png" alt="IBK 투자박스 로고 이미지" />
          </h2>
        </div>
        <div className="footer_right">
          <div className="info_wrap">
            <ul className="menu_list">
              <li className="menu_item">
                <Link
                  to={{ pathname: 'https://www.ibkbox.net/CMS309/onload.do?dcffStplId=10005&dcffStplDtlSqn=1' }}
                  target="_blank"
                >
                  BOX 이용약관
                </Link>
              </li>
              <li className="menu_item">
                <Link
                  to={{ pathname: 'https://www.ibkbox.net/CMS309/onload.do?dcffStplId=10027&dcffStplDtlSqn=1' }}
                  target="_blank"
                >
                  개인정보처리방침
                </Link>
              </li>
              <li className="menu_item">
                <Link to={{ pathname: process.env.REACT_APP_GNB_LINK_CERT }} target="_blank">
                  인증센터
                </Link>
              </li>
              <li className="menu_item">고객센터 : 02-729-7633 (평일) 오전 9시30분 ~ 오후 5시</li>
            </ul>
            <p className="copyright">Copyright ⓒ IBK(INDUSTRIAL BANK OF KOREA). All rights reserved.</p>
            <ul className="info_list">
              <li className="info_item">주소: 서울특별시 중구 을지로79</li>
              <li className="info_item">대표명: 김성태</li>
              <li className="info_item">사업자등록번호: 202-81-00978</li>
              <li className="info_item">통신판매번호: 2010-서울중구-1163</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
