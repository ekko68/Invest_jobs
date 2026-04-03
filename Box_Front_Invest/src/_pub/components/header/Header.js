import React, { useState, useEffect, useContext, useRef } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { headerStyle } from 'assets/style/ComponentStyle'
import Badge from 'components/atomic/Badge'
import TokenTimerPopup from 'components/header/TokenTimerPopup'
import HeaderScrollAlarmPopup from 'pageComponents/common/pop/HeaderScrollAlarmPopup'
import { openSessionAlert } from 'pageComponents/common/pop/SessionCheckAlert'
import { CheckYn, Page1DepthLabels, UsisType } from 'modules/consts/BizConst'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { StringUtils } from 'modules/utils/StringUtils'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import { createKey } from 'modules/utils/CommonUtils'
import { LOGIN_LINK_KEYS, LoginContext, refreshToken } from 'modules/contexts/common/LoginContext'

const Header = (props) => {
  const history = useHistory()
  const { pathname } = history.location

  const commonContext = useContext(CommonContext)
  const loginContext = useContext(LoginContext)

  const { page = 'sub', isSetMountContextUser = true } = props

  const [alarmOpen, setAlarmOpen] = useState(false)
  const menuList = [
    { label: Page1DepthLabels.Company, url: ROUTER_NAMES.COMPANY },
    { label: Page1DepthLabels.Invest, url: ROUTER_NAMES.INVEST },
    {
      label: Page1DepthLabels.Consult,
      url: ROUTER_NAMES.CONSULT,
      forbidden: loginContext.state.userAuthKey['투자사']
    },
    {
      label: Page1DepthLabels.IbkPrplCntr,
      url: ROUTER_NAMES.IBK_PRPL_CNTR,
      auth: loginContext.state.userAuthKey['투자사']
    }, // 간접투자 신규 추가: IBK 제안센터
    { label: Page1DepthLabels.CustomerSupport, url: ROUTER_NAMES.CUSTOMER_SUPPORT_NOTICE }
  ]

  // '/1depth/2depth/3depth' -> ['/1depth', '/2depth', '/3depth'] -> '/1depth'
  const page1DepthName = props.location?.pathname.match(/(\/[a-zA-Z0-9]+)/g)[0]

  const onClickGoToMain = (event) => {
    const loadingStatus = document.querySelector('#loadingstate').style.display
    if (loadingStatus === 'block') {
      event.preventDefault()
      return
    }
    history.push(ROUTER_NAMES.MAIN)
  }
  const onClickLogin = () => {
    // esg login open
    // window.esgLogin();
    // common login
    window.commonLogin()
  }

  /** ivt header (not tnb) scroll ============================================== */

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // 스크롤에 따른 메인 헤더 불투명화처리
  const [scrollY, setScrollY] = useState(0)
  const [headerActive, setHeaderActive] = useState(false)

  function handleScroll() {
    setScrollY(window.scrollY)
  }

  useEffect(() => {
    if (scrollY > 70) setScrollY(window.scrollY), setHeaderActive(true)
    else setScrollY(window.scrollY), setHeaderActive(false)
  }, [scrollY])

  /** ============================================== ivt header (not tnb) scroll */

  /** token session count ===================================================== */

  const tokenTime = useRef(0)
  const tokenTimer = useRef(null)

  const initTokenTimerPopupSwitch = { isOpen: false, startSec: null }
  const [tokenTimerPopupSwitch, setTokenTimerPopupSwitch] = useState({ ...initTokenTimerPopupSwitch })
  const [secAlarmOpen, setSecAlarmOpen] = useState(false)

  const calcHeaderTokenTime = () => {
    // 버그 등에 의해 session storage token이 삭제되었을 경우,
    // parseJwt function에서 중간에 에러가 발생할 수 있으므로 filter처리 추가함
    // session storage에서 다시 가져오는 시점에 비동기 처리로 값이 삭제될 것을 감안하여 따로 변수를 빼서 측정
    const si = sessionStorage.getItem(LOGIN_LINK_KEYS.SI_TOKEN)
    if (!StringUtils.hasLength(si)) return 0

    return (
      Number(window.parseJwt(si)?.refreshExpire) - // 리프레시 토큰 만료
      Number(window.getCurTimestamp()) - // 현재 브라우저 시간
      30
    ) // 에러 발생 방지를 위한 여유시간
  }

  useEffect(() => {
    if (tokenTimer !== null) clearInterval(tokenTimer.current)

    // if(StringUtils.hasLength(sessionStorage.getItem('token'))) {
    if (window.tokenCheck()) {
      console.log('start count!!')

      // 토큰 타임 계산 초기화
      tokenTime.current = calcHeaderTokenTime()

      tokenTimer.current = setInterval(() => {
        if (tokenTime.current % 10 === 0) {
          console.log('timer check : ' + tokenTime.current)
        }
        // 브라우저 정책에 따라 setInterval 이벤트 우선순위가 바뀔 수 있고
        // setInterval delay에 오차가 발생할 수 있으므로 interval 마다 타이머 계산을 다시 하는 것으로 함
        if (!StringUtils.hasLength(sessionStorage.getItem(LOGIN_LINK_KEYS.TOKEN_TIMER_STOP)))
          tokenTime.current = calcHeaderTokenTime()

        if (0 < tokenTime.current && tokenTime.current <= 60) {
          setTokenTimerPopupSwitch({
            ...tokenTimerPopupSwitch,
            startSec: tokenTime.current,
            isOpen: true
          })
        }
        if (tokenTime.current <= 0) {
          setTokenTimerPopupSwitch({ ...initTokenTimerPopupSwitch })

          // auth까지 삭제할 경우 -> 새로고침시에도 로그아웃 됨, 대신 확인버튼을 누르지 않았는데 다른 탭에서 로그아웃 될 수 있음
          // auth는 로그인 만료 확인을 눌렀을 경우만 삭제할 경우 -> 새로고침시 실제 sso 세션이 살아있을 경우 팝업메시지와 다르게 로그아웃이 안됨, 대신 확인 버튼을 누르지 않았을 경우 다른 탭에서 로그아웃이 되지 않음

          // 1안)
          // deleteCookie("idSave");
          // deleteCookie(LOGIN_LINK_KEYS.AUTH_COOKIE);
          // deleteCookie("cookieExpires");
          // sessionStorage.clear();

          // 2안)
          sessionStorage.setItem(LOGIN_LINK_KEYS.SPA_LOGOUT, 'true')

          // 세션 만료 알럿
          // ssolink, logout 등의 상황에서
          // storage clear가 이뤄진 이후 timer 내의 로직이 움직여 팝업이 뜨는 경우를 방지
          if (window.tokenCheck()) {
            openSessionAlert(true, '로그인 세션이 만료되었습니다.', () => commonContext.actions.logout(true))
          }

          clearInterval(tokenTimer.current)

          // commonContext.actions.logout(true);
          // window.location.href = ROUTER_NAMES.LOGOUT + '?sessionout';
        }
      }, 1000)
    }

    return () => {
      clearInterval(tokenTimer.current)
    }

    // 투자의 경우 Header 컴포넌트가 각 페이지 컴포넌트에 잡혀있으므로 pathname 추가가 되지 않아도 됨
    // Layout 등 페이지보다 상위 컴포넌트에 Header에 잡혀있는 경우에는 의존성 추가가 필요
    // }, [commonContext.state.tokenRefreshToggle, pathname]);
  }, [commonContext.state.tokenRefreshToggle])

  useEffect(() => {
    if (isSetMountContextUser) commonContext.actions.contextMountUserInfoSet(history)

    // 투자의 경우 Header 컴포넌트가 각 페이지 컴포넌트에 잡혀있으므로 pathname 추가가 되지 않아도 됨
    // Layout 등 페이지보다 상위 컴포넌트에 Header에 잡혀있는 경우에는 의존성 추가가 필요
    // }, [pathname]);
  }, [history.location])

  /** ===================================================== token session count */

  return (
    <>
      {tokenTimerPopupSwitch.isOpen && (
        <TokenTimerPopup
          startSec={tokenTimerPopupSwitch.startSec}
          calcTokenTimeFunc={calcHeaderTokenTime}
          onClickClose={() => setTokenTimerPopupSwitch({ ...initTokenTimerPopupSwitch })}
        />
      )}

      <div className="tnb_header">
        <ul className="tnb_left">
          <li className="tnb_item">
            <Link
              to={'#'}
              onClick={(e) => {
                e.preventDefault()
                window.open(process.env.REACT_APP_GNB_LINK_MNB, '_self')
              }}
            >
              메인BOX
            </Link>
          </li>
          <li className="tnb_item">
            <Link
              to={'#'}
              onClick={(e) => {
                e.preventDefault()
                window.open(process.env.REACT_APP_GNB_LINK_LNB, '_self')
              }}
            >
              대출
            </Link>
          </li>
          <li className="tnb_item">
            <Link
              to={'#'}
              onClick={(e) => {
                e.preventDefault()
                window.open(process.env.REACT_APP_GNB_LINK_PFB, '_self')
              }}
            >
              정책자금
            </Link>
          </li>
          <li className="tnb_item">
            <Link
              to={'#'}
              onClick={(e) => {
                e.preventDefault()
                window.open(process.env.REACT_APP_GNB_LINK_SPB, '_self')
              }}
            >
              판로개척
            </Link>
          </li>
          <li className="tnb_item">
            <Link
              to={'#'}
              onClick={(e) => {
                e.preventDefault()
                window.open(process.env.REACT_APP_GNB_LINK_INOTE, '_self')
              }}
            >
              전자어음할인
            </Link>
          </li>
          <li className="tnb_item">
            <Link
              to={'#'}
              onClick={(e) => {
                e.preventDefault()
                window.open(process.env.REACT_APP_GNB_LINK_POS, '_self')
              }}
            >
              BOX POS
            </Link>
          </li>
          <li className="tnb_item">
            <Link
              to={'#'}
              onClick={(e) => {
                e.preventDefault()
                window.open(process.env.REACT_APP_GNB_LINK_IVT, '_self')
              }}
            >
              혁신투자
            </Link>
          </li>
          <li className="tnb_item">
            <Link
              to={'#'}
              onClick={(e) => {
                e.preventDefault()
                window.open(process.env.REACT_APP_GNB_LINK_MACHINE, '_self')
              }}
            >
              기계거래
            </Link>
          </li>
        </ul>
        <ul className="tnb_right">
          <li className="tnb_item">
            <Link
              to={'#'}
              onClick={(e) => {
                e.preventDefault()
                window.open(process.env.REACT_APP_GNB_LINK_SUPPORT, '_self')
              }}
            >
              고객센터
            </Link>
          </li>
          <li className="tnb_item">
            <Link
              to={'#'}
              onClick={(e) => {
                e.preventDefault()
                window.open(process.env.REACT_APP_GNB_LINK_CERT, '_self')
              }}
            >
              인증센터
            </Link>
          </li>
          <li className="tnb_item">
            <Link
              to={'#'}
              onClick={(e) => {
                e.preventDefault()
                window.open(process.env.REACT_APP_GNB_LINK_BANK, '_self')
              }}
            >
              기업뱅킹 바로가기
            </Link>
          </li>
          {/*로그인하면 알림, 로그아웃까지 추가*/}
          {commonContext.state.user?.info != null && (
            <>
              <li className="tnb_item">
                <Link
                  to={'#'}
                  className={commonContext.state.alarmNotice.unreadYn === CheckYn.YES ? 'new' : ''}
                  onClick={(e) => {
                    e.preventDefault()
                    setSecAlarmOpen(!secAlarmOpen)
                  }}
                >
                  {commonContext.state.alarmNotice.unreadYn === CheckYn.YES && <img src="/images/ico_new.png" alt="" />}
                  알림
                </Link>
                {secAlarmOpen && <HeaderScrollAlarmPopup setAlarmOpen={setSecAlarmOpen} />}
              </li>
              <li className="tnb_item">
                <Link
                  to={'#'}
                  onClick={(e) => {
                    e.preventDefault()
                    commonContext.actions.logout()
                  }}
                >
                  로그아웃
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      <div
        className={`header_wrap 
                ${page === 'main' ? 'main_header' : 'sub_header type02'} 
                ${headerActive ? 'active' : ''}`}
        css={headerStyle(page)}
      >
        <div
          className={`header_inner ${page === 'main' ? 'default_size' : 'default_size02'}`}
          style={{ minWidth: 'auto' }}
        >
          <div className="header_left">
            {page === 'main' ? (
              <h1 className="logo">
                <div style={{ cursor: 'pointer' }} onClick={(event) => onClickGoToMain(event)}>
                  <img src="/images/logo_ibk.png" alt="IBK 혁신투자" />
                  <span className="logoNm">혁신투자</span>
                </div>
              </h1>
            ) : (
              <h1 className="logo">
                <div style={{ cursor: 'pointer' }} onClick={(event) => onClickGoToMain(event)}>
                  <img src="/images/logo_ibk.png" alt="IBK 혁신투자" />
                  <span className="logoNm">혁신투자</span>
                </div>
              </h1>
            )}
          </div>
          <div className="header_right">
            <ul className="nav_list">
              {menuList?.map((menu) => {
                if (menu.auth && loginContext.state.userAuth[menu.auth] == false) {
                  return
                }
                if (menu.forbidden && loginContext.state.userAuth[menu.forbidden] == true) {
                  return
                }
                return (
                  <li
                    className={`nav_item ${menu.url?.match(/(\/[a-zA-Z0-9]+)/g)[0] === page1DepthName ? 'active' : ''}`}
                    key={`${createKey()}`}
                  >
                    <Link
                      to="#"
                      onClick={async (e) => {
                        e.preventDefault()
                        await commonContext.actions.callbackAfterOnlyLoginCheck(() => history.push(menu.url), true)
                      }}
                    >
                      {menu.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
            <ul className="usermenu_list">
              {
                // !StringUtils.hasLength(sessionStorage.getItem('token'))
                commonContext.state.user?.info == null ? (
                  // ? <li className="usermenu_item">
                  <li className="usermenu_item login_wrap">
                    <button className="login" title={'로그인'} onClick={onClickLogin}>
                      로그인
                    </button>
                  </li>
                ) : (
                  <>
                    <li className="usermenu_item">
                      <button className="alarm" onClick={() => setAlarmOpen(!alarmOpen)}>
                        <span className="hide">알람</span>
                        {commonContext.state.alarmNotice.unreadYn === CheckYn.YES && (
                          <Badge className={'red new_alert'}></Badge>
                        )}
                      </button>
                      {alarmOpen && <HeaderScrollAlarmPopup setAlarmOpen={setAlarmOpen} />}
                    </li>
                    {StringUtils.hasLength(commonContext.state.user.info?.groupId) && (
                      <li className="usermenu_item">
                        <button
                          className="msg"
                          onClick={() => {
                            if (commonContext.state.user.info?.type === UsisType.COMPANY)
                              history.push(ROUTER_NAMES.MY_PAGE_COMPANY_MESSAGE_RECEIVE_VIEW)
                            else if (commonContext.state.user.info?.type === UsisType.INVESTOR)
                              history.push(ROUTER_NAMES.MY_PAGE_INVESTOR_MESSAGE_RECEIVE_VIEW)
                          }}
                        >
                          <span className="hide">쪽지</span>
                        </button>
                      </li>
                    )}
                    {/*<Link to={ROUTER_NAMES.LOGOUT}>*/}
                    <Link
                      to={'#'}
                      onClick={(e) => {
                        e.preventDefault()
                        commonContext.actions.logout()
                      }}
                    >
                      <li className="usermenu_item">
                        <button className="logout" title={'로그아웃'}>
                          <span className="hide">로그아웃</span>
                        </button>
                      </li>
                    </Link>
                  </>
                )
              }
            </ul>
            {commonContext.state.user.info == null || !commonContext.state.user.isLoaded ? (
              <></>
            ) : (
              // : !(commonContext.state.user.info?.type === UsisType.COMPANY || commonContext.state.user.info?.type === UsisType.INVESTOR)
              // ? <></>
              <Link
                to={'#'}
                onClick={(e) => {
                  e.preventDefault()
                  if (
                    !(
                      commonContext.state.user.info?.type === UsisType.COMPANY ||
                      commonContext.state.user.info?.type === UsisType.INVESTOR
                    )
                  ) {
                    openSessionAlert(
                      true,
                      '법인사업자회원용 서비스입니다.<br/><br/>사업자등록 후 이용해주세요.',
                      () => (window.location.href = process.env.REACT_APP_MAIN_BOX_URL + '/main/M0000001242.do')
                    )
                    return
                  }

                  const routingPath =
                    commonContext.state.user.info.type === UsisType.COMPANY
                      ? ROUTER_NAMES.MY_PAGE_COMPANY
                      : ROUTER_NAMES.MY_PAGE_INVESTOR
                  history.push(routingPath)
                }}
              >
                <div className="userInfo">
                  <span className="user_name">
                    {StringUtils.hasLength(commonContext.state.user.info?.name)
                      ? commonContext.state.user.info.name
                      : commonContext.state.user.info.userNm}
                  </span>
                  {StringUtils.hasLength(commonContext.state.user.info?.userProfileImgUrl) ? (
                    <span className="user_icon_img">
                      <img src={commonContext.state.user.info.userProfileImgUrl} alt="ico_user" />
                    </span>
                  ) : (
                    <span className="user_img">
                      <img src="/images/ico_user.png" alt="ico_user" />
                    </span>
                  )}
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
