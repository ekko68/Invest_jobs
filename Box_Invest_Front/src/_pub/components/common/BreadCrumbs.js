/** @jsxImportSource @emotion/react */
import { selectionBoxStyle, breadCrumbsStyle } from 'assets/style/ComponentStyle'
import { useContext, useRef } from 'react'
import { Link, useHistory } from 'react-router-dom'
import ROUTER_NAMES from '_pub/modules/consts/RouterConst'
import { Page1DepthLabels, Page2DepthLabels } from '_pub/modules/consts/BizConst'
import { createKey } from '_pub/modules/utils/CommonUtils'
import { CommonContext } from '_pub/modules/contexts/common/CommomContext'

const BreadCrumbs = (props) => {
  const menuRef = useRef(null)
  const history = useHistory()

  const commonContext = useContext(CommonContext)

  const currentPath = props.location?.pathname || history.location.pathname
  const canAccessVentureLoan = sessionStorage.getItem('canAccessVentureLoan')

  /**
   * 하위 메뉴에서 클릭시 ComboBox 닫힘.
   */
  const on2DepthComboBoxMenuClose = () => {
    const listWrap = menuRef.current
    if (listWrap.classList.contains('active')) {
      listWrap.classList.remove('active')
    }
  }

  /**
   * 선택된 하위 메뉴를 선택표시함.
   * @param e
   */
  const handleOpenList = (e) => {
    let listWrap = e.target.nextElementSibling
    let status = listWrap.classList.contains('active')
    if (status) {
      listWrap.classList.remove('active')
    } else {
      listWrap.classList.add('active')
    }
  }

  // page1DepthItems 등록한다.
  const pageSelected1DepthItems = {
    [ROUTER_NAMES.COMPANY]: { label: Page1DepthLabels.Company, url: ROUTER_NAMES.COMPANY }, // 기업정보
    [ROUTER_NAMES.INVEST]: { label: Page1DepthLabels.Invest, url: ROUTER_NAMES.INVEST }, // 투자기관
    [ROUTER_NAMES.CONSULT]: { label: Page1DepthLabels.Consult, url: ROUTER_NAMES.CONSULT }, // 컨설팅
    [ROUTER_NAMES.IBK_PRPL_CNTR]: { label: Page1DepthLabels.IbkPrplCntr, url: ROUTER_NAMES.IBK_PRPL_CNTR }, // IBK 제안센터
    [ROUTER_NAMES.MY_PAGE_COMPANY]: { label: Page1DepthLabels.MyPage, url: ROUTER_NAMES.MY_PAGE_COMPANY }, // 마이페이지(기업용)
    [ROUTER_NAMES.MY_PAGE_INVESTOR]: { label: Page1DepthLabels.MyPage, url: ROUTER_NAMES.MY_PAGE_INVESTOR }, // 마이페이지(투자자용)
    [ROUTER_NAMES.CUSTOMER_SUPPORT]: {
      label: Page1DepthLabels.CustomerSupport,
      url: ROUTER_NAMES.CUSTOMER_SUPPORT_NOTICE
    }, // '고객지원'
    [ROUTER_NAMES.COMPANY]: { label: Page1DepthLabels.Company, url: ROUTER_NAMES.COMPANY }, // 기업정보
    [ROUTER_NAMES.PRPL_CNTR]: { label: Page1DepthLabels.IbkPrplCntr, url: ROUTER_NAMES.IBK_PRPL_CNTR }, // IBK 제안센터
    [ROUTER_NAMES.PUB]: { label: Page1DepthLabels.Pub, url: ROUTER_NAMES.Notice_List_InvestBusiness } // 퍼블 테스트페이지
  }
  // pageSelected2DepthItems 등록한다.
  // prettier-ignore
  const pageSelected2DepthItems = {
    // [ROUTER_NAMES.COMPANY]: { label: Page1DepthLabels.Company, url: ROUTER_NAMES.COMPANY }, // 기업정보
    // [ROUTER_NAMES.INVEST]: { label: Page1DepthLabels.Invest, url: ROUTER_NAMES.INVEST }, // 투자기관
    [ROUTER_NAMES.CONSULT]: { label: Page1DepthLabels.Consult, url: ROUTER_NAMES.CONSULT }, // 컨설팅
    [ROUTER_NAMES.CUSTOMER_SUPPORT_NOTICE]: {
      label: Page2DepthLabels.Notice,
      url: ROUTER_NAMES.CUSTOMER_SUPPORT_NOTICE
    }, // 공지사항
    [ROUTER_NAMES.CUSTOMER_SUPPORT_NOTICE_VIEW]: {
      label: Page2DepthLabels.Notice,
      url: ROUTER_NAMES.CUSTOMER_SUPPORT_NOTICE_VIEW
    }, // 공지사항 상세
    [ROUTER_NAMES.CUSTOMER_SUPPORT_QA]: { label: Page2DepthLabels.Qa, url: ROUTER_NAMES.CUSTOMER_SUPPORT_QA }, // Q&A
    [ROUTER_NAMES.CUSTOMER_SUPPORT_QA_VIEW]: { label: Page2DepthLabels.Qa, url: ROUTER_NAMES.CUSTOMER_SUPPORT_QA_VIEW }, // Q&A 상세
    [ROUTER_NAMES.CUSTOMER_SUPPORT_QA_WRITE]: {
      label: Page2DepthLabels.Qa,
      url: ROUTER_NAMES.CUSTOMER_SUPPORT_QA_WRITE
    }, // Q&A 쓰기
    [ROUTER_NAMES.MY_PAGE_COMPANY]: { label: Page1DepthLabels.MyPage, url: ROUTER_NAMES.MY_PAGE_COMPANY }, // 마이페이지(기업용)
    [ROUTER_NAMES.MY_PAGE_INVESTOR]: { label: Page1DepthLabels.MyPage, url: ROUTER_NAMES.MY_PAGE_INVESTOR }, // 마이페이지(투자자용)
    [ROUTER_NAMES.COMPANY_DETAIL]: { label: Page2DepthLabels.CompanyDetail, url: ROUTER_NAMES.COMPANY_DETAIL }, // 기업 상세보기
    [ROUTER_NAMES.INVEST_DETAIL]: { label: Page2DepthLabels.InvestDetail, url: ROUTER_NAMES.INVEST_DETAIL }, // 투자자 상세보기

    /** 기업 마이페이지 */
    [ROUTER_NAMES.MY_PAGE_COMPANY]: { label: Page2DepthLabels.MyPage, url: ROUTER_NAMES.MY_PAGE_COMPANY }, // 마이페이지 > 대시보드(기업용)
    [ROUTER_NAMES.MY_PAGE_COMPANY_INFO]: { label: Page2DepthLabels.MyPageInfo, url: ROUTER_NAMES.MY_PAGE_COMPANY_INFO }, // 마이페이지 > 내 정보(기업용)
    [ROUTER_NAMES.MY_PAGE_COMPANY_INFO_WRITE]: {
      label: Page2DepthLabels.MyPageInfo,
      url: ROUTER_NAMES.MY_PAGE_COMPANY_INFO
    }, // 마이페이지 > 내 정보(기업용)
    [ROUTER_NAMES.MY_PAGE_COMPANY_INFO_PROD_WRITE]: {
      label: Page2DepthLabels.MyPageInfo,
      url: ROUTER_NAMES.MY_PAGE_COMPANY_INFO
    }, // 마이페이지 > 내 정보(기업용)
    [ROUTER_NAMES.MY_PAGE_COMPANY_INFO_INVM_CNVRS]: {
      label: Page2DepthLabels.MyPageInfo,
      url: ROUTER_NAMES.MY_PAGE_COMPANY_INFO
    }, // 마이페이지 > 기업 > 투자사전환요청
    [ROUTER_NAMES.MY_PAGE_COMPANY_INVEST_WRITE]: {
      label: Page2DepthLabels.MyPageInfo,
      url: ROUTER_NAMES.MY_PAGE_COMPANY_INFO
    }, // 마이페이지 > 내 정보(기업용)
    [ROUTER_NAMES.MY_PAGE_COMPANY_TEAM_WRITE]: {
      label: Page2DepthLabels.MyPageInfo,
      url: ROUTER_NAMES.MY_PAGE_COMPANY_INFO
    }, // 마이페이지 > 내 정보(기업용)
    [ROUTER_NAMES.MY_PAGE_COMPANY_VIDEO_WRITE]: {
      label: Page2DepthLabels.MyPageInfo,
      url: ROUTER_NAMES.MY_PAGE_COMPANY_INFO
    }, // 마이페이지 > 내 정보(기업용)
    [ROUTER_NAMES.MY_PAGE_COMPANY_STAMP_WRITE]: {
      label: Page2DepthLabels.MyPageInfo,
      url: ROUTER_NAMES.MY_PAGE_COMPANY_INFO
    }, // 마이페이지 > 내 정보(기업용)

    [ROUTER_NAMES.MY_PAGE_COMPANY_REQUEST_RECEIVE_VIEW]: {
      label: Page2DepthLabels.MyPageRequest,
      url: ROUTER_NAMES.MY_PAGE_COMPANY_REQUEST_RECEIVE_VIEW
    }, // 투자 심사 받은 요청
    [ROUTER_NAMES.MY_PAGE_COMPANY_REQUEST_SEND_VIEW]: {
      label: Page2DepthLabels.MyPageRequest,
      url: ROUTER_NAMES.MY_PAGE_COMPANY_REQUEST_SEND_VIEW
    }, // 투자 심사 보낸 요청

    [ROUTER_NAMES.MY_PAGE_COMPANY_REQUEST_DETAIL]: {
      label: Page2DepthLabels.MyPageRequest,
      url: ROUTER_NAMES.MY_PAGE_COMPANY_REQUEST_RECEIVE_VIEW
    }, // 투자 심사 요청

    [ROUTER_NAMES.MY_PAGE_IR]: { label: Page2DepthLabels.MyPageIr, url: ROUTER_NAMES.MY_PAGE_IR }, // IR 작성
    [ROUTER_NAMES.MY_PAGE_IR_BASIC_INFO]: { label: Page2DepthLabels.MyPageIr, url: ROUTER_NAMES.MY_PAGE_IR }, // IR 작성
    [ROUTER_NAMES.MY_PAGE_IR_FINANCE]: { label: Page2DepthLabels.MyPageIr, url: ROUTER_NAMES.MY_PAGE_IR }, // IR 작성
    [ROUTER_NAMES.MY_PAGE_IR_HISTORY]: { label: Page2DepthLabels.MyPageIr, url: ROUTER_NAMES.MY_PAGE_IR }, // IR 작성
    [ROUTER_NAMES.MY_PAGE_IR_PROD_TECH_MARKET]: { label: Page2DepthLabels.MyPageIr, url: ROUTER_NAMES.MY_PAGE_IR }, // IR 작성
    [ROUTER_NAMES.MY_PAGE_IR_RESULT_PLANS]: { label: Page2DepthLabels.MyPageIr, url: ROUTER_NAMES.MY_PAGE_IR }, // IR 작성
    [ROUTER_NAMES.MY_PAGE_IR_STOCK]: { label: Page2DepthLabels.MyPageIr, url: ROUTER_NAMES.MY_PAGE_IR }, // IR 작성
    [ROUTER_NAMES.MY_PAGE_IR_WORKER]: { label: Page2DepthLabels.MyPageIr, url: ROUTER_NAMES.MY_PAGE_IR }, // IR 작성
    [ROUTER_NAMES.MY_PAGE_IR_BASIC_INFO_WRITE]: { label: Page2DepthLabels.MyPageIr, url: ROUTER_NAMES.MY_PAGE_IR }, // IR 작성
    [ROUTER_NAMES.MY_PAGE_IR_FINANCE_WRITE]: { label: Page2DepthLabels.MyPageIr, url: ROUTER_NAMES.MY_PAGE_IR }, // IR 작성
    [ROUTER_NAMES.MY_PAGE_IR_HISTORY_WRITE]: { label: Page2DepthLabels.MyPageIr, url: ROUTER_NAMES.MY_PAGE_IR }, // IR 작성
    [ROUTER_NAMES.MY_PAGE_IR_PROD_TECH_MARKET_WRITE]: {
      label: Page2DepthLabels.MyPageIr,
      url: ROUTER_NAMES.MY_PAGE_IR
    }, // IR 작성
    [ROUTER_NAMES.MY_PAGE_IR_RESULT_PLANS_WRITE]: { label: Page2DepthLabels.MyPageIr, url: ROUTER_NAMES.MY_PAGE_IR }, // IR 작성
    [ROUTER_NAMES.MY_PAGE_IR_STOCK_WRITE]: { label: Page2DepthLabels.MyPageIr, url: ROUTER_NAMES.MY_PAGE_IR }, // IR 작성
    [ROUTER_NAMES.MY_PAGE_IR_WORKER_WRITE]: { label: Page2DepthLabels.MyPageIr, url: ROUTER_NAMES.MY_PAGE_IR }, // IR 작성
    [ROUTER_NAMES.MY_PAGE_CONSULT]: { label: Page2DepthLabels.MyPageConsult, url: ROUTER_NAMES.MY_PAGE_CONSULT }, // 컨설팅
    [ROUTER_NAMES.MY_PAGE_CONSULT_DETAIL]: { label: Page2DepthLabels.MyPageConsult, url: ROUTER_NAMES.MY_PAGE_CONSULT }, // 컨설팅 상세
    [ROUTER_NAMES.MY_PAGE_CONSULT_WRITE]: { label: Page2DepthLabels.MyPageConsult, url: ROUTER_NAMES.MY_PAGE_CONSULT }, // 컨설팅 작성

    [ROUTER_NAMES.MY_PAGE_COMPANY_NDA_RECEIVE]: {
      label: Page2DepthLabels.MyPageNda,
      url: ROUTER_NAMES.MY_PAGE_COMPANY_NDA_RECEIVE
    }, // NDA(기업용)
    [ROUTER_NAMES.MY_PAGE_COMPANY_NDA_SEND]: {
      label: Page2DepthLabels.MyPageNda,
      url: ROUTER_NAMES.MY_PAGE_COMPANY_NDA_SEND
    }, // NDA(기업용)
    [ROUTER_NAMES.MY_PAGE_COMPANY_NDA_WRITE]: {
      label: Page2DepthLabels.MyPageNda,
      url: ROUTER_NAMES.MY_PAGE_COMPANY_NDA_RECEIVE
    }, // NDA 작성 (기업용)
    [ROUTER_NAMES.MY_PAGE_COMPANY_NDA_VIEW]: {
      label: Page2DepthLabels.MyPageNda,
      url: ROUTER_NAMES.MY_PAGE_COMPANY_NDA_RECEIVE
    }, // NDA 작성 (기업용)

    [ROUTER_NAMES.VNENTR_LON_CM_LIST_VIEW]: {
      label: Page2DepthLabels.MyPageVnenrLon,
      url: ROUTER_NAMES.VNENTR_LON_CM_LIST_VIEW
    },
    [ROUTER_NAMES.VNENTR_LON_CM_REG_VIEW]: {
      label: Page2DepthLabels.MyPageVnenrLon,
      url: ROUTER_NAMES.VNENTR_LON_CM_LIST_VIEW
    },
    [ROUTER_NAMES.VNENTR_LON_CM_DETAIL_VIEW]: {
      label: Page2DepthLabels.MyPageVnenrLon,
      url: ROUTER_NAMES.VNENTR_LON_CM_LIST_VIEW
    },

    /** 투자사 마이페이지 */

    // [ROUTER_NAMES.MY_PAGE_INVESTOR]: { label: Page2DepthLabels.MyPage, url: ROUTER_NAMES.MY_PAGE_INVESTOR }, // 마이페이지 > 대시보드(투자자용)
    [ROUTER_NAMES.MY_PAGE_INVESTOR]: { label: Page2DepthLabels.MyPage, url: ROUTER_NAMES.MY_PAGE_INVESTOR }, // 마이페이지 > 대시보드(투자사용)

    [ROUTER_NAMES.MY_PAGE_INVESTOR_INFO]: {
      label: Page2DepthLabels.MyPageInfo,
      url: ROUTER_NAMES.MY_PAGE_INVESTOR_INFO
    }, // 마이페이지 > 내정보(투자사용)
    [ROUTER_NAMES.MY_PAGE_INVESTOR_INFO_WRITE]: {
      label: Page2DepthLabels.MyPageInfo,
      url: ROUTER_NAMES.MY_PAGE_INVESTOR_INFO
    }, // 마이페이지 > 내정보(투자사용)
    [ROUTER_NAMES.MY_PAGE_INVESTOR_JUDGE_WRITE]: {
      label: Page2DepthLabels.MyPageInfo,
      url: ROUTER_NAMES.MY_PAGE_INVESTOR_INFO
    }, // 마이페이지 > 내정보(투자사용)
    [ROUTER_NAMES.MY_PAGE_INVESTOR_STAMP_WRITE]: {
      label: Page2DepthLabels.MyPageInfo,
      url: ROUTER_NAMES.MY_PAGE_INVESTOR_INFO
    }, // 마이페이지 > 내정보(투자사용)

    [ROUTER_NAMES.MY_PAGE_INVESTOR_REQUEST_RECEIVE_VIEW]: {
      label: Page2DepthLabels.MyPageRequest,
      url: ROUTER_NAMES.MY_PAGE_INVESTOR_REQUEST_RECEIVE_VIEW
    }, // 마이페이지 > 투자 검토 받은 요청(투자사용)
    [ROUTER_NAMES.MY_PAGE_INVESTOR_REQUEST_SEND_VIEW]: {
      label: Page2DepthLabels.MyPageRequest,
      url: ROUTER_NAMES.MY_PAGE_INVESTOR_REQUEST_SEND_VIEW
    }, // 마이페이지 > 투자 검토 보낸 요청(투자사용)

    [ROUTER_NAMES.MY_PAGE_INVESTOR_REQUEST_DETAIL]: {
      label: Page2DepthLabels.MyPageRequest,
      url: ROUTER_NAMES.MY_PAGE_INVESTOR_REQUEST_RECEIVE_VIEW
    }, // 마이페이지 > 투자 검토 요청(투자사용)

    [ROUTER_NAMES.MY_PAGE_INVESTOR_NDA_RECEIVE]: {
      label: Page2DepthLabels.MyPageNda,
      url: ROUTER_NAMES.MY_PAGE_INVESTOR_NDA_RECEIVE
    }, // NDA(투자사용)
    [ROUTER_NAMES.MY_PAGE_INVESTOR_NDA_SEND]: {
      label: Page2DepthLabels.MyPageNda,
      url: ROUTER_NAMES.MY_PAGE_INVESTOR_NDA_SEND
    }, // NDA(투자사용)
    [ROUTER_NAMES.MY_PAGE_INVESTOR_NDA_WRITE]: {
      label: Page2DepthLabels.MyPageNda,
      url: ROUTER_NAMES.MY_PAGE_INVESTOR_NDA_RECEIVE
    }, // NDA 작성 (투자사용)
    [ROUTER_NAMES.MY_PAGE_INVESTOR_NDA_VIEW]: {
      label: Page2DepthLabels.MyPageNda,
      url: ROUTER_NAMES.MY_PAGE_INVESTOR_NDA_RECEIVE
    }, // NDA 작성 (투자사용)

    [ROUTER_NAMES.MY_PAGE_INVESTOR_MESSAGE_RECEIVE_VIEW]: {
      label: Page2DepthLabels.MyPageMessage,
      url: ROUTER_NAMES.MY_PAGE_INVESTOR_MESSAGE_RECEIVE_VIEW
    }, // 쪽지(투자사용)  받음 메시지
    [ROUTER_NAMES.MY_PAGE_INVESTOR_MESSAGE_SEND_VIEW]: {
      label: Page2DepthLabels.MyPageMessage,
      url: ROUTER_NAMES.MY_PAGE_INVESTOR_MESSAGE_SEND_VIEW
    }, // 쪽지(투자사용) 보낸 메시지
    [ROUTER_NAMES.MY_PAGE_INVESTOR_EXCLUSIVE]: {
      label: Page2DepthLabels.MyPageExclusive,
      url: ROUTER_NAMES.MY_PAGE_INVESTOR_EXCLUSIVE
    }, // 쪽지(투자사용)
    [ROUTER_NAMES.MY_PAGE_INVESTOR_EXCLUSIVE_WRITE]: {
      label: Page2DepthLabels.MyPageExclusive,
      url: ROUTER_NAMES.MY_PAGE_INVESTOR_EXCLUSIVE
    }, // 쪽지(투자사용)

    [ROUTER_NAMES.MY_PAGE_COMPANY_MESSAGE_RECEIVE_VIEW]: {
      label: Page2DepthLabels.MyPageMessage,
      url: ROUTER_NAMES.MY_PAGE_COMPANY_MESSAGE_RECEIVE_VIEW
    }, // 마이페이지 > 기업 > 받은 메시지
    [ROUTER_NAMES.MY_PAGE_COMPANY_MESSAGE_SEND_VIEW]: {
      label: Page2DepthLabels.MyPageMessage,
      url: ROUTER_NAMES.MY_PAGE_COMPANY_MESSAGE_SEND_VIEW
    }, // 마이페이지 > 기업 > 보낸 메시지

    /** IBK 제안센터 */

    [ROUTER_NAMES.FUND_PRPL_INFO_LIST_VIEW]: {
      label: Page2DepthLabels.FundPrpl,
      url: ROUTER_NAMES.FUND_PRPL_INFO_LIST_VIEW
    },
    [ROUTER_NAMES.FUND_PRPL_INFO_STEP]: {
      label: Page2DepthLabels.FundPrpl,
      url: ROUTER_NAMES.FUND_PRPL_INFO_LIST_VIEW
    },
    [ROUTER_NAMES.FUND_PRPL_INFO_STEP2]: {
      label: Page2DepthLabels.FundPrpl,
      url: ROUTER_NAMES.FUND_PRPL_INFO_LIST_VIEW
    },
    [ROUTER_NAMES.FUND_PRPL_INFO_STEP3]: {
      label: Page2DepthLabels.FundPrpl,
      url: ROUTER_NAMES.FUND_PRPL_INFO_LIST_VIEW
    },
    [ROUTER_NAMES.FUND_PRPL_INFO_STEP_VIEW]: {
      label: Page2DepthLabels.FundPrpl,
      url: ROUTER_NAMES.FUND_PRPL_INFO_LIST_VIEW
    },
    [ROUTER_NAMES.FUND_PRPL_INFO_STEP_VIEW2]: {
      label: Page2DepthLabels.FundPrpl,
      url: ROUTER_NAMES.FUND_PRPL_INFO_LIST_VIEW
    },
    [ROUTER_NAMES.FUND_PRPL_INFO_STEP_VIEW3]: {
      label: Page2DepthLabels.FundPrpl,
      url: ROUTER_NAMES.FUND_PRPL_INFO_LIST_VIEW
    },
    [ROUTER_NAMES.PRPL_CM_LIST_VIEW]: {
      label: Page2DepthLabels.PrplCm,
      url: ROUTER_NAMES.PRPL_CM_LIST_VIEW
    },
    [ROUTER_NAMES.PRPL_CM_WRITE_VIEW]: {
      label: Page2DepthLabels.PrplCm,
      url: ROUTER_NAMES.PRPL_CM_LIST_VIEW
    },
    [ROUTER_NAMES.PRPL_CM_DETAIL_VIEW]: {
      label: Page2DepthLabels.PrplCm,
      url: ROUTER_NAMES.PRPL_CM_LIST_VIEW
    },
    [ROUTER_NAMES.RCMD_ENPR_LIST_VIEW]: {
      label: Page2DepthLabels.RcmdEnprList,
      url: ROUTER_NAMES.RCMD_ENPR_LIST_VIEW
    },
    [ROUTER_NAMES.VNENTR_LON_SGSH_GDNC_VIEW]: {
      label: Page2DepthLabels.IbkVnentlonSgsh,
      url: ROUTER_NAMES.VNENTR_LON_SGSH_LIST_VIEW
    },
    [ROUTER_NAMES.VNENTR_LON_SGSH_REG_VIEW]: {
      label: Page2DepthLabels.IbkVnentlonSgsh,
      url: ROUTER_NAMES.VNENTR_LON_SGSH_LIST_VIEW
    },
    [ROUTER_NAMES.VNENTR_LON_SGSH_LIST_VIEW]: {
      label: Page2DepthLabels.IbkVnentlonSgsh,
      url: ROUTER_NAMES.VNENTR_LON_SGSH_LIST_VIEW
    }
  }
  // pageSelected1DepthChildrenItems 등록한다.
  const pageSelected1DepthChildrenItems = {
    [ROUTER_NAMES.COMPANY]: [],
    [ROUTER_NAMES.INVEST]: [],
    [ROUTER_NAMES.CONSULT]: [],
    [ROUTER_NAMES.CUSTOMER_SUPPORT]: [
      { label: Page2DepthLabels.Notice, url: ROUTER_NAMES.CUSTOMER_SUPPORT_NOTICE }, // 공지사항
      { label: Page2DepthLabels.Qa, url: ROUTER_NAMES.CUSTOMER_SUPPORT_QA } // Q&A
    ],
    [ROUTER_NAMES.MY_PAGE_COMPANY]: [
      { label: Page2DepthLabels.MyPage, url: ROUTER_NAMES.MY_PAGE_COMPANY }, // 대시보드
      { label: Page2DepthLabels.MyPageInfo, url: ROUTER_NAMES.MY_PAGE_COMPANY_INFO }, // 내 정보
      { label: Page2DepthLabels.MyPageRequest, url: ROUTER_NAMES.MY_PAGE_COMPANY_REQUEST_RECEIVE_VIEW }, // 투자 심사 요청
      { label: Page2DepthLabels.MyPageIr, url: ROUTER_NAMES.MY_PAGE_IR }, // IR 작성
      { label: Page2DepthLabels.MyPageConsult, url: ROUTER_NAMES.MY_PAGE_CONSULT }, // 컨설팅
      { label: Page2DepthLabels.MyPageNda, url: ROUTER_NAMES.MY_PAGE_COMPANY_NDA_RECEIVE }, // NDA
      { label: Page2DepthLabels.MyPageMessage, url: ROUTER_NAMES.MY_PAGE_COMPANY_MESSAGE_RECEIVE_VIEW }, // 쪽지
      // { label: Page2DepthLabels.MyPageInvmCnvrsReg, url: ROUTER_NAMES.MY_PAGE_COMPANY_INFO_INVM_CNVRS }, //투자사 전환 정보 등록
      // { label: Page2DepthLabels.Logout, url: ROUTER_NAMES.LOGOUT } // 로그아웃
      {
        label: Page2DepthLabels.MyPageVnenrLon,
        url: ROUTER_NAMES.VNENTR_LON_CM_LIST_VIEW,
        hidden: !canAccessVentureLoan
      }, // '벤처대출'
      { label: Page2DepthLabels.Logout, url: '' } // 로그아웃
    ],
    [ROUTER_NAMES.MY_PAGE_INVESTOR]: [
      { label: Page2DepthLabels.MyPage, url: ROUTER_NAMES.MY_PAGE_INVESTOR }, // 대시보드
      { label: Page2DepthLabels.MyPageInfo, url: ROUTER_NAMES.MY_PAGE_INVESTOR_INFO }, // 내 정보
      { label: Page2DepthLabels.MyPageRequest, url: ROUTER_NAMES.MY_PAGE_INVESTOR_REQUEST_RECEIVE_VIEW }, // 투자 심사 요청
      { label: Page2DepthLabels.MyPageExclusive, url: ROUTER_NAMES.MY_PAGE_INVESTOR_EXCLUSIVE }, // 투자사 전용
      { label: Page2DepthLabels.MyPageNda, url: ROUTER_NAMES.MY_PAGE_INVESTOR_NDA_RECEIVE }, // NDA
      { label: Page2DepthLabels.MyPageMessage, url: ROUTER_NAMES.MY_PAGE_INVESTOR_MESSAGE_RECEIVE_VIEW }, // 쪽지
      // { label: Page2DepthLabels.Logout, url: ROUTER_NAMES.LOGOUT } // 로그아웃
      { label: Page2DepthLabels.Logout, url: '' } // 로그아웃
    ],
    [ROUTER_NAMES.PRPL_CNTR]: [
      {
        label: Page2DepthLabels.FundPrpl,
        url: ROUTER_NAMES.FUND_PRPL_INFO_LIST_VIEW
      },
      {
        label: Page2DepthLabels.PrplCm,
        url: ROUTER_NAMES.PRPL_CM_LIST_VIEW
      },
      {
        label: Page2DepthLabels.IbkVnentlonSgsh,
        url: ROUTER_NAMES.VNENTR_LON_SGSH_LIST_VIEW
      },
      {
        label: Page2DepthLabels.RcmdEnprList,
        url: ROUTER_NAMES.RCMD_ENPR_LIST_VIEW
      }
    ]
  }

  // 1depthMenuUI를 만들어 반환한다.
  // 2depthMenuUI를 만들어 반환한다.
  // prettier-ignore
  const get1Depth2DepthUI = (
    pathname,
    pageSelected1DepthItems,
    pageSelected2DepthItems,
    pageSelected1DepthChildrenItems
  ) => {
    // '/1depth/2depth/3depth' -> ['/1depth', '/2depth', '/3depth']
    const currentPagePaths = pathname.match(/(\/[a-zA-Z0-9]+)/g)
    // '/1depth' === '/mypage' -> '/1depth/2depth'
    const menuName1Depth = currentPagePaths[0] === ROUTER_NAMES.MY_PAGE
        ? currentPagePaths.slice(0, 2).join('')
        : currentPagePaths[0]

    const page1DepthItem = pageSelected1DepthItems[menuName1Depth]
    const page2DepthItem = pageSelected2DepthItems[pathname]
    const page1DepthChildrenItems = pageSelected1DepthChildrenItems[menuName1Depth]

    return (
      <>
        {/*1Depth Menu*/}
        <div className={`selection_box type01`} css={selectionBoxStyle}>
          {
            page1DepthItem.url === page2DepthItem?.url
                  ? <button className="selected">{page1DepthItem.label}</button>
                  : <button className="selected" onClick={() => history.push(page1DepthItem.url)}>{page1DepthItem.label}</button>
          }
          {/*<div className="selection_list_wrap" ref={menuRef}>*/}
          {/*  <div className="selection_list">{getMenu(menuItem)}</div>*/}
          {/*</div>*/}
        </div>
        {/*2Depth Menu && SelectBox*/}
        {page2DepthItem && (
          <div className={`selection_box type02`} css={selectionBoxStyle}>
            <button className="selected" onClick={handleOpenList}>
              {page2DepthItem?.label}
            </button>

            <div className="selection_list_wrap" ref={menuRef}>
              <div className="selection_list" style={{zIndex: 100}}>
                {page1DepthChildrenItems &&
                  page1DepthChildrenItems.filter(btn => !btn.hidden).map((btn) => (
                    <button
                      className={`selection_item ${btn.label === Page2DepthLabels.Logout && 'logout'}`}
                      key={createKey()}
                      style={{ display: 'flex', width: '100%' }}
                      onClick={() => {
                        if(btn.label === Page2DepthLabels.Logout) commonContext.actions.logout();
                        else history.push(btn.url);
                      }}
                      onMouseUp={on2DepthComboBoxMenuClose}
                    >
                      {btn.label}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        )}
      </>
    )
  }

  const menu1Depth2DepthUI = get1Depth2DepthUI(
    currentPath,
    pageSelected1DepthItems,
    pageSelected2DepthItems,
    pageSelected1DepthChildrenItems
  )

  return (
    <div className="breadcrumbs_wrap" css={breadCrumbsStyle}>
      <div className="breadcrumbs_inner default_size02">
        <div className="home_wrap">
          <Link to={'/main'} className="home">
            <img src="/images/ico_home.png" alt="메인화면" />
          </Link>
        </div>
        {menu1Depth2DepthUI}
      </div>
    </div>
  )
}

export default BreadCrumbs
