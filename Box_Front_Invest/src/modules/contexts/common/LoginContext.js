import React, { useEffect, useState, useMemo } from 'react'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import Api from 'modules/consts/Api'
import { StringUtils } from 'modules/utils/StringUtils'
import { loader } from 'modules/utils/CommonAxios'
import CommonAxios, { getConfig } from 'modules/utils/CommonAxios'
import { openSessionAlert } from 'pageComponents/common/pop/SessionCheckAlert'
import { CprSe, UserAuth, UsisType } from 'modules/consts/BizConst'

/**
 * 로그인 프로세스 관련 enum -> todo : box별 설정 값을 변동시켜야 할 수 있음
 * @type {{TOKEN_TIMER_STOP: string, AUTH_COOKIE: string, NEXT_PAGE_LINK: string, SI_TOKEN: string, COMPARE_AUTH: string, SPA_LOGOUT: string}}
 */
export const LOGIN_LINK_KEYS = {
  // 다른 탭에서 재로그인 발생시 변경되는 auth 쿠키와의 비교 처리를 하기 위함
  COMPARE_AUTH: 'compareAuth',
  // sso 연동 등을 처리한 이후 root path로 리디랙션 이후 다시 이전 페이지로 이동처리를 시키기 위함
  NEXT_PAGE_LINK: 'InvestBoxNextLinkPage',
  // 로그아웃 함수를 정상 호출 하기 힘든 상황에서 사용
  SPA_LOGOUT: 'InvestBoxSpaLogout',
  // 간편서류 제출 등 로딩이 오래걸리는 상황에서 투자박스의 타이머 정지 및 토큰 자동 처리를 하기위한 키 값
  TOKEN_TIMER_STOP: 'InvestBOxTokenTimerStop',

  AUTH_COOKIE: 'auth',
  SI_TOKEN: 'SI'
}

const LoginContext = React.createContext({
  state: {},
  actions: {}
})

const { Provider } = LoginContext

const LoginContextProvider = ({ children }) => {
  // 토큰 갱신 확인 toggle
  const [tokenRefreshToggle, setTokenRefreshToggle] = useState(false)
  // user info state
  const [user, setUser] = useState({
    isLoaded: false,
    isPageMountCheck: false,
    info: null
  })
  const userAuth = useMemo(() => {
    return {
      corporation: user.info?.cprSe === CprSe.CORPORATION, // 법인 사용자
      ceo: user.info?.userAuth === UserAuth.CEO, // 총괄관리자 권한 확인
      investor: user.info?.type === UsisType.INVESTOR, // 투자사 계정
      hopingInvestor: user.info?.type === UsisType.COMPANY // 투자사 희망 계정
    }
  }, [user])
  const userAuthKey = {
    법인사용자: 'corporation',
    총괄관리자: 'ceo',
    투자사: 'investor',
    투자사희망: 'hopingInvestor'
  }

  /** todo 박스에 따라 설정 변경이 필요한 부분 =============================================== */

  const LOGIN_API_CONST = {
    LOGIN: Api.login.login
  }

  // 투자박스 로그인 확인이 필수가 아닌 페이지
  const PASS_LOGIN_CHECK = [ROUTER_NAMES.MAIN, ROUTER_NAMES.EVENT]
  // 투자박스 기업 계정만 접속 가능한 페이지
  const ONLY_COMPANY_ROUTER = [ROUTER_NAMES.MY_PAGE_COMPANY]
  // 투자박스 투자사 계정만 접속 가능한 페이지
  const ONLY_INVESTOR_ROUTER = [ROUTER_NAMES.MY_PAGE_INVESTOR]

  // 로그인 세션 alert 관련 메시지
  const SESSION_ALERT_MSG = {
    SESSION_CHANGE: '세션변동이 감지되었습니다.<br/><br/>메인화면으로 이동합니다.',
    NOT_LOGIN: '로그인 후 이용해주세요.',

    ONLY_CORPORATION: '법인사업자회원용 서비스입니다.<br/><br/>사업자등록 후 이용해주세요.',
    NOT_AUTHORIZED: '권한이 없습니다.<br/><br/>총괄관리자만 이용할 수 있습니다.',

    ERROR_PATH: '잘못된 경로입니다.'
  }

  /**
   * 로그인 정보 확인 관련 alert 호출 함수
   * @param message
   * @param callback
   */
  const openAlert = (message = '', callback = null) => {
    openSessionAlert(true, message, callback)
  }

  /**
   * 페이지 마운트 시점 box별 로그인 정보 유효성 확인
   * @param currentPath
   * @returns {boolean}
   */
  const validatePageMountContextUserData = (currentPath) => {
    // 0. 토큰 여부 확인
    if (!window.tokenCheck()) {
      openAlert(SESSION_ALERT_MSG.NOT_LOGIN, () => (location.href = '/'))
      return false
    }

    // 1. 법인 사용자 확인 (투자박스 전용)
    if (user.info?.cprSe !== CprSe.CORPORATION) {
      openAlert(
        SESSION_ALERT_MSG.ONLY_CORPORATION,
        () => (window.location.href = process.env.REACT_APP_MAIN_BOX_URL + '/main/M0000001242.do')
      )
      return false
    }
    // 2. 총괄관리자 권한 확인 (투자박스 전용)
    if (user.info?.userAuth !== UserAuth.CEO) {
      openAlert(SESSION_ALERT_MSG.NOT_AUTHORIZED, () => (window.location.href = ROUTER_NAMES.MAIN))
      return false
    }
    // 3. 투자사 계정일 경우 투자희망기업 전용 페이지에 접근하는 것인지 확인 (투자박스 전용)
    if (user.info?.type === UsisType.INVESTOR && pathStartArrIncludeCheck(currentPath, ONLY_COMPANY_ROUTER)) {
      openAlert(SESSION_ALERT_MSG.ERROR_PATH, () => (window.location.href = ROUTER_NAMES.MAIN))
      return false
    }
    // 4. 투자희망기업 계정일 경우 투자사 전용 페이지에 접근하는 것인지 확인 (투자박스 전용)
    if (user.info?.type === UsisType.COMPANY && pathStartArrIncludeCheck(currentPath, ONLY_INVESTOR_ROUTER)) {
      openAlert(SESSION_ALERT_MSG.ERROR_PATH, () => (window.location.href = ROUTER_NAMES.MAIN))
      return false
    }

    return true
  }

  /**
   * 로그인 세션 정보 변동 확인 <br/>
   * (조회한 유저정보와 기존 context user 정보 비교 대조)
   * @param refreshUserInfo
   * @returns {boolean}
   */
  const userChangeCheck = (refreshUserInfo) => {
    // refreshToken에서 auth 체크를 하더라도
    // 동일 사용자에 연동 기업 정보만 바뀐 경우는 현재 auth가 동일하게 올 수 있으므로 검사가 필요함

    // 로그인된 아이디가 없는 경우 false 반환
    if (!StringUtils.hasLength(refreshUserInfo.id)) return false

    return (
      user.info?.id === refreshUserInfo.id && // 사용자 아이디가 동일한지
      // caution : 아래 두개의 항목은 박스마다 확인 범위가 다를 수 있음
      user.info?.type === refreshUserInfo.type && // 이용기관 타입이 동일한지 (투자박스 : 투자사, 투자희망기업 -> 투자사 전환 등으로 변동이 일어날 수 있음)
      user.info?.groupId === refreshUserInfo.groupId // 이용기관 아이디가 동일한지
    )
  }

  /** =============================================== 박스에 따라 설정 변경이 필요한 부분 */

  /** session check ================================================================================= */

  /**
   * url path가 지정한 path array에 포함되어 있는지 확인
   * @param path
   * @param pathArr
   * @returns {boolean}
   */
  const pathStartArrIncludeCheck = (path = '', pathArr = []) => {
    if (!StringUtils.hasLength(path) || !(pathArr?.length > 0)) return false
    if (!path.startsWith('/')) path = '/' + path

    let result = false
    for (let checkPath of pathArr) {
      if (StringUtils.hasLength(checkPath)) {
        if (!checkPath.startsWith('/')) checkPath = '/' + checkPath

        if (path.startsWith(checkPath)) result = true
        if (result) break
      }
    }

    return result
  }

  /**
   * loading 페이지 실행, callback 확인 및 종료
   * pageMountPathCheck 에서 사용
   * @param callback 실행시켜야할 callback func
   * @param apiResCntRef callback 내부 동시 실행되는 api가 있는 경우 각 api 호출 완료를 확인하기 위한 count정보 (useRef 객체를 통해 전달받음)
   * @returns {Promise<void>}
   */
  const callbackLoading = async (callback = null, apiResCntRef = null) => {
    loader(true) // loading page start
    if (callback !== null) await callback() // calllback이 있는 경우 실행

    if (apiResCntRef !== null) {
      // api 종료 카운팅 정보가 있는 경우 interval로 종료시점을 확인 한 뒤 loading 종료
      const interval = setInterval(() => {
        if (apiResCntRef.current == 0) {
          clearInterval(interval)
          loader(false)
          setUser({ ...user, isPageMountCheck: true }) // 페이지 로그인 유효성 확인 완료
        }
      }, 100)
    } else {
      // apiResCntRef 정보가 없는 경우 loading page 종료
      loader(false)
      setUser({ ...user, isPageMountCheck: true }) // 페이지 로그인 유효성 확인 완료
    }
  }

  /**
   * 리액트 페이지 mount 시 로그인 정보 확인 함수
   * @param history useHistory 객체, 현재 페이지 정보 확인을 위한 필수값
   * @param callback 페이지 로그인 확인 이후 실행시켜야할 callback func
   * @param apiResCntRef callback 내부 동시 실행되는 api가 있는 경우 각 api 호출 완료를 확인하기 위한 count정보 (useRef 객체를 통해 전달받음)
   * @returns {Promise<boolean>}
   */
  const pageMountPathCheck = async (history, callback = null, apiResCntRef = null) => {
    // useHistory 객체에서 현재 페이지 path정보 조회
    if (!StringUtils.hasLength(history?.location?.pathname)) return false
    const path = history.location.pathname

    // 로그인 유효성 확인이 필수가 아닌 페이지인지 확인 (메인화면, 투자사전용 화면 등)
    if (pathStartArrIncludeCheck(path, PASS_LOGIN_CHECK)) {
      // loading 및 callback 실행
      await callbackLoading(callback, apiResCntRef)

      return true
    } else {
      // 박스별 기본 로그인 정보 유효성 검증
      if (!validatePageMountContextUserData(path)) return false

      // loading 및 callback 실행
      await callbackLoading(callback, apiResCntRef)

      return true
    }
  }

  /**
   * 로그인 확인 후 callback 실행
   * @param callback
   * @param isLoadingAround loading page on/off가 필요 여부
   * @returns {Promise<void>}
   */
  const callbackAfterOnlyLoginCheck = async (callback = null, isLoadingAround = false) => {
    // 토큰 정보가 없는 경우 -> callback 을 실행시키지 않고 alert를 띄운 뒤 리다이렉트 처리를 한다
    if (!window.tokenCheck()) {
      // 토큰 정보는 없으나 auth cookie 정보가 있는 경우 -> sso link function 호출
      if (StringUtils.hasLength(getCookieValue(LOGIN_LINK_KEYS.AUTH_COOKIE))) {
        openAlert(SESSION_ALERT_MSG.SESSION_CHANGE, () => {
          console.log('call sso link!')
          window.commonSSOLink()
        })
      }
      // 토큰 정보 및 cookie 정보 둘 다 없는 경우 -> 메인화면 리다이렉트
      // 2024.04.09 메인 리다이렉트 대신 로그인 창 띄우기 김도완 과장님 요청
      else {
        // openAlert(SESSION_ALERT_MSG.NOT_LOGIN, () => (location.href = '/'))
        openAlert(SESSION_ALERT_MSG.NOT_LOGIN, () => window.commonLogin())
      }
      return
    }

    // loading page 실행 및 callback 실행
    if (isLoadingAround) loader(true)

    if (callback) await callback()

    if (isLoadingAround) loader(false)
  }

  /**
   * 로그인 유효성 확인 및 토큰 갱신 후 callback 실행
   * @todo : box에 따른 수정 필요
   * @param callback
   * @param userCheck 로그인 유저 정보 변경 확인 여부
   * @param isLoadingAround loading page on/off가 필요 여부
   * @returns {Promise<void>}
   */
  const callbackAfterSessionRefresh = async (callback = null, userCheck = true, isLoadingAround = false) => {
    if (isLoadingAround) loader(true)

    // 유저 확인을 여부가 true이고 token 정보가 없는 경우
    // loading page off 및 callback을 실행시키지 않고 리다이렉트 처리
    if (userCheck && !window.tokenCheck()) {
      if (isLoadingAround) loader(false)

      if (StringUtils.hasLength(getCookieValue(LOGIN_LINK_KEYS.AUTH_COOKIE))) {
        openAlert(SESSION_ALERT_MSG.SESSION_CHANGE, () => {
          console.log('call sso link!')
          window.commonSSOLink()
        })
      } else {
        openAlert(SESSION_ALERT_MSG.NOT_LOGIN, () => (location.href = '/'))
      }

      return
    }

    // token refresh 함수 실행 (access token 만료가 되지 않으면 실제로 갱신은 하지 않음)
    // 현재 함수에서 loading page가 on 상태인 경우 해당 함수 실행 중에 loading page 설정을 무시하게 함
    // await refreshToken(!isLoadingAround);
    await refreshToken()

    // 사용자 정보 확인을 하는 경우 token을 가지고 유저정보를 한 번 더 불러와서 세션 변동이 있는지 확인을 함
    // todo : 해당 부분을 처리하는 부분에 대해서는 box마다 변동이 있을 수 있음 (사용자 정보를 다시 호출하여 context user state와 비교할지에 대한 부분 등)
    if (userCheck) {
      const userRes = await CommonAxios(getConfig(LOGIN_API_CONST.LOGIN), !isLoadingAround)

      if (userRes.data?.code !== '200') {
        if (isLoadingAround) loader(false)
        logout(true)
        return
      }

      // 로그인 세션 정보 변동 검사
      if (user.info !== null && !userChangeCheck(userRes.data.data)) {
        if (isLoadingAround) loader(false)
        openAlert(SESSION_ALERT_MSG.SESSION_CHANGE, () => (window.location.href = ROUTER_NAMES.MAIN))
        return
      }
    }

    // 위의 로그인 정보 유효성 검사가 완료된 경우 callback 실행
    if (callback !== null) await callback()
    // loading page off
    if (isLoadingAround) loader(false)
  }

  /** ================================================================================= session check */

  /** login, token ================================================================================== */

  /**
   * storage token에 따른 context 사용자 정보 설정
   * @param isLoading
   * @returns {Promise<void>}
   */
  const setTokenUserInfo = async (isLoading = false) => {
    // 토큰 정보가 없는 경우
    if (!window.tokenCheck()) {
      // load 여부는 true, page mount 유효성 확인 false (pageMountPathCheck 함수에서 확인), 사용자 정보 null
      setUser({ isLoaded: true, isPageMountCheck: false, info: null })
      return
    }

    // 사용자 정보 조회 및 설정 (기존 사용자 정보와의 유효성 검사 포함)
    const res = await CommonAxios(getConfig(LOGIN_API_CONST.LOGIN), isLoading)
    if (res.data?.code == '200') {
      // 세션 변동 검사
      if (user.info !== null && !userChangeCheck(res.data.data)) {
        openAlert(SESSION_ALERT_MSG.SESSION_CHANGE, () => (window.location.href = ROUTER_NAMES.MAIN))
        return
      }

      setUser({ isLoaded: true, isPageMountCheck: false, info: res.data.data })
    }

    // 사용자 정보 조회가 실패할 경우 로그아웃 처리
    else logout(true)
  }

  /**
   * 토큰 갱신 (access token이 만료된 경우에만 refresh token으로 토큰 갱신처리함)
   * @param isLoading
   * @returns {Promise<void>}
   */
  const refreshToken = async (isLoading = false) => {
    // 토큰 정보가 없는 경우 end
    if (!window.tokenCheck()) return

    // auth값 변동이 발생한 경우 세션 변동 팝업
    // refreshToken에서 auth 체크를 하더라도,
    // 현재 mnb에서 기업전환등을 할 경우 auth가 변경되지는 않으므로 user정보 확인은 필요하다
    if (getCookieValue(LOGIN_LINK_KEYS.AUTH_COOKIE) !== sessionStorage.getItem(LOGIN_LINK_KEYS.COMPARE_AUTH)) {
      openAlert(SESSION_ALERT_MSG.SESSION_CHANGE, () => {
        sessionStorage.clear()
        window.commonSSOLink()
      })
      return
    }

    // 토큰 만료 시간 조회
    const sessionData = window.parseJwt(sessionStorage.getItem(LOGIN_LINK_KEYS.SI_TOKEN))

    // 약 1분 20초 정도 만료시간이 주어짐
    // 20초 정도의 여유시간을 두고 만료가 처리 판단 -> 만료가 되지 않은 경우 갱신하지 않음
    if (sessionData.expire - 20 > window.getCurTimestamp()) {
      // window.updateSession(sessionData);
      // console.log('session refresh!!');
      // setTokenRefreshToggle(!tokenRefreshToggle);
      console.log('token is not expired')
    }

    // access token이 만료된 경우 토큰 갱신처리
    else {
      window.sessionRefresh()
      console.log('token and session refresh!!')
      setTokenRefreshToggle(!tokenRefreshToggle)
    }
  }

  /**
   * 로그아웃
   */
  const logout = () => {
    setUser({ isLoaded: false, isPageMountCheck: false, info: null })
    window.commonLogout()
  }

  /**
   * 페이지 마운트 시점 사용자 정보 조회 및 context 설정
   * @param history
   * @returns {Promise<void>}
   */
  const contextMountUserInfoSet = async (history = null) => {
    loader(true)

    // 토큰이 없는데 auth가 있는지 먼저 확인처리
    if (StringUtils.hasLength(getCookieValue(LOGIN_LINK_KEYS.AUTH_COOKIE)) && !window.tokenCheck()) {
      // useHistory 객체가 있는 경우 sso link 이후 다시 리디랙션할 경로를 쿠키로 설정
      if (history !== null) {
        window.setCookie(LOGIN_LINK_KEYS.NEXT_PAGE_LINK, history.location.pathname + history.location.search, 1)
      }

      console.log('call sso link!')
      window.commonSSOLink()
      loader(false)
      return
    }

    // await refreshToken(false);
    await refreshToken()

    // page에서 데이터가 로드되는 것은 유저정보 확인 후 이뤄지기 때문에,
    // 유저정보가 있더라도 한번 state 갱신은 해준다.
    if (!user.isLoaded && user.info == null) await setTokenUserInfo(false)
    else if (!window.tokenCheck()) setUser({ isLoaded: true, isPageMountCheck: false, info: null })
    else {
      console.log('user info is already load')
      setUser({ isLoaded: true, isPageMountCheck: false, info: user.info })
    }

    loader(false)
  }

  /** ================================================================================== login, token */

  /** login context useEffect hook */

  useEffect(() => {
    console.log('login context mount')

    // 설정에서는 해당 값을 true로 했지만 일단 해당 key가 있으면 로그아웃처리
    if (StringUtils.hasLength(sessionStorage.getItem(LOGIN_LINK_KEYS.SPA_LOGOUT))) {
      logout()
    }

    // tokenTimerStop : 간편 서류 제출 등 오래걸리는 로직에서 자동 토큰 갱신을 처리하기 위한 값
    // 간편서류 제출 등 윈도우 창을 열었다가 새로고침을 해버렸을 경우 storage에 남으므로 새로고침시 context mount 시점에 초기화 처리해준다.
    if (StringUtils.hasLength(sessionStorage.getItem(LOGIN_LINK_KEYS.TOKEN_TIMER_STOP))) {
      sessionStorage.removeItem(LOGIN_LINK_KEYS.TOKEN_TIMER_STOP)
    }

    // 새로고침 혹은 리디랙션 등으로 (sso link도 포함) 페이지가 리로드되어 context useEffect가 동작시
    // -> auth가 존재하고 storage에 기존에 저장된 비교값이 없는 경우에만 설정
    // -> 갱신 시점은 sso 연동 정상 처리 후 mnb에서 스토리지 clear 및 si 저장 후 리디랙션이 발생할 때
    if (
      window.tokenStringCheck(getCookieValue(LOGIN_LINK_KEYS.AUTH_COOKIE)) &&
      !StringUtils.hasLength(sessionStorage.getItem(LOGIN_LINK_KEYS.COMPARE_AUTH))
    ) {
      console.log('compare data set')
      sessionStorage.setItem(LOGIN_LINK_KEYS.COMPARE_AUTH, getCookieValue(LOGIN_LINK_KEYS.AUTH_COOKIE))
    }

    // sso 연동 등으로 루트 path로 리디랙션이 되었을 때 지정된 쿠키 값이 있으면 context 시점에서 캐치하여 다시 리디랙션 처리를 하기 위함
    if (StringUtils.hasLength(window.getCookieValue(LOGIN_LINK_KEYS.NEXT_PAGE_LINK))) {
      let location = window.getCookieValue(LOGIN_LINK_KEYS.NEXT_PAGE_LINK)
      window.deleteCookie(LOGIN_LINK_KEYS.NEXT_PAGE_LINK)

      // 쿠키 조작으로 외부 url로 빠지는 현상을 없애기 위해 루트 path로 시작하지 않는 경우 main으로 보낸다.
      if (!location.startsWith('/')) location = '/'

      window.location.href = location
    }

    return () => {
      setUser({ isLoaded: false, isPageMountCheck: false, info: null })
    }
  }, [])

  const contextValue = {
    state: {
      user,
      tokenRefreshToggle,
      userAuth,
      userAuthKey
    },
    actions: {
      contextMountUserInfoSet,

      pageMountPathCheck,
      userChangeCheck,

      callbackAfterOnlyLoginCheck,
      callbackAfterSessionRefresh,

      refreshToken,
      logout
    }
  }

  return <Provider value={contextValue}>{children}</Provider>
}

export { LoginContext, LoginContextProvider }
