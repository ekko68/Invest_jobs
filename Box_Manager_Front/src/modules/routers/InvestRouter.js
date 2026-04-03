import Loading from 'components/common/Loading'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import React, { lazy, Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material/styles'

// 배너관리
const InvestBannerMainTop = lazy(() => import('pages/invest/banner/MainTop').then((c) => c))
const InvestBannerMainBottom = lazy(() => import('pages/invest/banner/MainBottom').then((c) => c))
const InvestBannerCompanyMainBottom = lazy(() => import('pages/invest/banner/CompanyMainBottom').then((c) => c))
const InvestBannerCompanyMypage = lazy(() => import('pages/invest/banner/CompanyMypage').then((c) => c))
const InvestBannerInvestorMypage = lazy(() => import('pages/invest/banner/InvestorMypage').then((c) => c))
// 공지사항
const InvestNoticeList = lazy(() => import('pages/invest/notice/List').then((c) => c))
const InvestNoticeView = lazy(() => import('pages/invest/notice/View').then((c) => c))
const InvestNoticeWrite = lazy(() => import('pages/invest/notice/Write').then((c) => c))
// 컨설팅
const InvestConsultList = lazy(() => import('pages/invest/consult/List').then((c) => c))
const InvestConsultView = lazy(() => import('pages/invest/consult/View').then((c) => c))
// 문서관리
const InvestDocumentList = lazy(() => import('pages/invest/document/List').then((c) => c))
const InvestDocumentView = lazy(() => import('pages/invest/document/View').then((c) => c))
const InvestDocumentWrite = lazy(() => import('pages/invest/document/Write').then((c) => c))
// Q&A
const InvestQnAList = lazy(() => import('pages/invest/qna/List').then((c) => c))
const InvestQnAView = lazy(() => import('pages/invest/qna/View').then((c) => c))
// 통계
const InvestVisitor = lazy(() => import('pages/invest/static/Visitor').then((c) => c))
const InvestOffer = lazy(() => import('pages/invest/static/InvestOffer').then((c) => c))
const InvestReq = lazy(() => import('pages/invest/static/InvestReq').then((c) => c))
const InvestComp = lazy(() => import('pages/invest/static/InvestComp').then((c) => c))
// 투자사 회원 관리
const InvestUserList = lazy(() => import('pages/invest/investUser/List').then((c) => c))
// 기업 관리
const InvestRecommend = lazy(() => import('pages/invest/company/RecommendList').then((c) => c))
const InvestForeign = lazy(() => import('pages/invest/company/ForeignInvestList').then((c) => c))

//투자희망신청현황
const AuditInfoList = lazy(() => import('pages/invest/auditMngm/AuditInfoList').then((c) => c))
const AuditInfoDetail = lazy(() => import('pages/invest/auditMngm/AuditInfoDetail').then((c) => c))

// VC 관리
const InvmCnvrsListView = lazy(() => import('pages/invest/vcMngm/InvmCnvrsListView').then((c) => c))
const InvmCnvrsEtcInfoView = lazy(() => import('pages/invest/vcMngm/InvmCnvrsEtcInfoView').then((c) => c))
const InvmCnvrsUpStView = lazy(() => import('pages/invest/vcMngm/InvmCnvrsUpStView').then((c) => c))
const InvmCnvrsUpStView2 = lazy(() => import('pages/invest/vcMngm/InvmCnvrsUpStView2').then((c) => c))

// 펀드 관리
const FundPrplInfo = lazy(() => import('pages/invest/fundMngm/FundPrplInfo').then((c) => c))
const FundPrplView = lazy(() => import('pages/invest/fundMngm/FundPrplView').then((c) => c))
// 추천기업 관리
const PrplCm = lazy(() => import('pages/invest/rcmdEnprMngm/PrplCm').then((c) => c))
const PrplCmView = lazy(() => import('pages/invest/rcmdEnprMngm/PrplCmView').then((c) => c))
// IBK 벤처대출
const MgVnentrLonCmListView = lazy(() => import('pages/invest/recomendRcept/MgVnentrLonCmListView').then((c) => c))
const MgVnentrLonCmDetailView = lazy(() => import('pages/invest/recomendRcept/MgVnentrLonCmDetailView').then((c) => c))
const AgremVnentrInvtMgListView = lazy(() =>
  import('pages/invest/recomendRcept/AgremVnentrInvtMgListView').then((c) => c)
)
const AgremVnentrInvtMgDetailView = lazy(() =>
  import('pages/invest/recomendRcept/AgremVnentrInvtMgDetailView').then((c) => c)
)
const VnentrLonSgshPrtRceptView = lazy(() =>
  import('pages/invest/recomendRcept/VnentrLonSgshPrtRceptView').then((c) => c)
)
const VnentrLonSgshPrtRceptDetailView = lazy(() =>
  import('pages/invest/recomendRcept/VnentrLonSgshPrtRceptDetailView').then((c) => c)
)

// 출자사업
const FncnBsnsPbanView = lazy(() =>
  import('pages/invest/fncnBsns/FncnBsnsPbanView').then((c) => c)
)
const FncnBsnsPbanList = lazy(() =>
  import('pages/invest/fncnBsns/FncnBsnsPbanList').then((c) => c)
)
const FncnBsnsRcipList = lazy(() =>
  import('pages/invest/fncnBsns/FncnBsnsRcipList').then((c) => c)
)
const FncnBsnsRcipDetail = lazy(() =>
  import('pages/invest/fncnBsns/FncnBsnsRcipDetail').then((c) => c)
)

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1fcee8',
      dark: '#18B8DE',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#27a6ff'
    },
    tertiary: {
      lighter: '#A1A6AC',
      light: '#273A4C',
      main: '#1E2F3F'
    },
    error: {
      main: '#ff6262'
    },
    warning: {
      main: '#ffc000'
    },
    info: {
      main: '#666666'
    },
    text: {
      primary: '#333333'
    },
    ochre: {
      main: '#E3D026',
      light: '#E9DB5D',
      dark: '#A29415',
      contrastText: '#242105'
    },
    white: {
      main: '#ffffff'
    },
    lightBlueGrey: {
      main: '#F9FAFC',
      light: '#FCFCFD',
      dark: '#E7EBF2'
    },
    grey: {
      main: '#D6DCE4',
      light: '#E2E8EF',
      dark: '#C6CCD5'
    },
    blueGrey: {
      main: '#788391',
      light: '#939CA8',
      dark: '#5B6676'
    }
  },
  typography: {
    fontFamily: ['NanumSquare', 'sans-serif'].join(','),
    body1: {
      fontSize: '0.9375rem',
      lineHeight: '1.25rem'
    }
  }
})

const InvestRouter = (props) => {
  // prettier-ignore
  return (
    <>
      <Suspense fallback={<Loading />} />
      <Switch>
        <ThemeProvider theme={theme}>
          <Route
            exact
            path={ROUTER_NAMES.INVEST_BANNER_MAIN_TOP}
            component={(props) => <InvestBannerMainTop {...props} />}
          />
          <Route
            exact
            path={ROUTER_NAMES.INVEST_BANNER_MAIN_BOTTOM}
            component={(props) => <InvestBannerMainBottom {...props} />}
          />
          <Route
            exact
            path={ROUTER_NAMES.INVEST_BANNER_COMPANY_MAIN_BOTTOM}
            component={(props) => <InvestBannerCompanyMainBottom {...props} />}
          />
          <Route
            exact
            path={ROUTER_NAMES.INVEST_BANNER_COMPANY_MYPAGE}
            component={(props) => <InvestBannerCompanyMypage {...props} />}
          />
          <Route
            exact
            path={ROUTER_NAMES.INVEST_BANNER_INVESTOR_MYPAGE}
            component={(props) => <InvestBannerInvestorMypage {...props} />}
          />

          {/*<Route exact path={`${ROUTER_NAMES.INVEST_NOTICE_LIST}/:page?/:search?`} component={(props) => <InvestNoticeList {...props} />} />*/}
          <Route
            exact
            path={`${ROUTER_NAMES.INVEST_NOTICE_LIST}`}
            component={(props) => <InvestNoticeList {...props} />}
          />
          <Route exact path={`${ROUTER_NAMES.INVEST_NOTICE_VIEW}/:id`} component={InvestNoticeView} />
          <Route
            exact
            path={[`${ROUTER_NAMES.INVEST_NOTICE_WRITE}/:id`, ROUTER_NAMES.INVEST_NOTICE_WRITE]}
            component={(props) => <InvestNoticeWrite {...props} />}
          />

          <Route exact path={ROUTER_NAMES.INVEST_CONSULT_LIST} component={InvestConsultList} />
          <Route exact path={`${ROUTER_NAMES.INVEST_CONSULT_VIEW}/:id`} component={InvestConsultView} />

          <Route
            exact
            path={ROUTER_NAMES.INVEST_DOCUMENT_LIST}
            component={(props) => <InvestDocumentList {...props} />}
          />
          <Route exact path={`${ROUTER_NAMES.INVEST_DOCUMENT_VIEW}/:id`} component={InvestDocumentView} />
          <Route
            exact
            path={[`${ROUTER_NAMES.INVEST_DOCUMENT_WRITE}/:id`, ROUTER_NAMES.INVEST_DOCUMENT_WRITE]}
            component={(props) => <InvestDocumentWrite {...props} />}
          />

          <Route exact path={ROUTER_NAMES.INVEST_QNA_LIST} component={(props) => <InvestQnAList {...props} />} />
          <Route
            exact
            path={`${ROUTER_NAMES.INVEST_QNA_VIEW}/:id`}
            component={(props) => <InvestQnAView {...props} />}
          />

          <Route exact path={ROUTER_NAMES.INVEST_STATIC_VISITOR} component={(props) => <InvestVisitor {...props} />} />
          <Route exact path={ROUTER_NAMES.INVEST_STATIC_OFFER} component={(props) => <InvestOffer {...props} />} />
          <Route exact path={ROUTER_NAMES.INVEST_STATIC_REQ} component={(props) => <InvestReq {...props} />} />
          <Route exact path={ROUTER_NAMES.INVEST_STATIC_COMP} component={(props) => <InvestComp {...props} />} />

          <Route exact path={ROUTER_NAMES.INVEST_USER_LIST} component={(props) => <InvestUserList {...props} />} />
          <Route
            exact
            path={ROUTER_NAMES.INVEST_AUDIT_INFO_LIST}
            component={(props) => <AuditInfoList {...props} />}
          />

          <Route
            exact
            path={`${ROUTER_NAMES.INVEST_AUDIT_INFO_DETAIL}/:id`}
            component={(props) => <AuditInfoDetail {...props} />}
          />

          <Route
            exact
            path={ROUTER_NAMES.INVEST_COMPANY_RECOMMEND_LIST}
            component={(props) => <InvestRecommend {...props} />}
          />
          <Route
            exact
            path={ROUTER_NAMES.INVEST_COMPANY_FOREIGN_LIST}
            component={(props) => <InvestForeign {...props} />}
          />

          <Route
            exact
            path={ROUTER_NAMES.INVEST_VCMNGM_INVMCNVRSLISTVIEW}
            component={(props) => <InvmCnvrsListView {...props} />}
          />
          <Route
            exact
            path={ROUTER_NAMES.INVEST_VCMNGM_INVMCNVRSETCINFOVIEW}
            component={(props) => <InvmCnvrsEtcInfoView {...props} />}
          />
          <Route
            exact
            path={`${ROUTER_NAMES.INVEST_VCMNGM_INVMCNVRSUPSTVIEW}/:id`}
            component={(props) => <InvmCnvrsUpStView {...props} />}
          />
          <Route
            exact
            path={`${ROUTER_NAMES.INVEST_VCMNGM_INVMCNVRSUPSTVIEW2}/:id`}
            component={(props) => <InvmCnvrsUpStView2 {...props} />}
          />
          <Route
            exact
            path={ROUTER_NAMES.INVEST_FUNDMNGM_FUNDPRPLINFO}
            component={(props) => <FundPrplInfo {...props} />}
          />
          <Route
            exact
            path={ROUTER_NAMES.INVEST_FUNDMNGM_FUNDPRPLVIEW}
            component={(props) => <FundPrplView {...props} />}
          />

          <Route exact path={ROUTER_NAMES.INVEST_RCMDENPRMNGM_PRPLCM} component={(props) => <PrplCm {...props} />} />
          <Route
            exact
            path={ROUTER_NAMES.INVEST_RCMDENPRMNGM_PRPLCMVIEW}
            component={(props) => <PrplCmView {...props} />}
          />

          <Route
            exact
            path={ROUTER_NAMES.INVEST_RECOMENDRCEPT_AGREMVNENTRINVTMGLISTVIEW}
            component={(props) => <AgremVnentrInvtMgListView {...props} />}
          />
          <Route
            exact
            path={ROUTER_NAMES.INVEST_RECOMENDRCEPT_VNENTRLONSGSHPRTRCEPTVIEW}
            component={(props) => <VnentrLonSgshPrtRceptView {...props} />}
          />
          <Route
            exact
            path={`${ROUTER_NAMES.INVEST_RECOMENDRCEPT_VNENTRLONSGSHPRTRCEPTDETAILVIEW}/:id`}
            component={(props) => <VnentrLonSgshPrtRceptDetailView {...props} />}
          />

          <Route
            exact
            path={ROUTER_NAMES.INVEST_RECOMENDRCEPT_MGVNENTRLONCMLISTVIEW}
            component={(props) => <MgVnentrLonCmListView {...props} />}
          />
          <Route
            exact
            path={ROUTER_NAMES.INVEST_RECOMENDRCEPT_MGVNENTRLONCMDETAILVIEW}
            component={(props) => <MgVnentrLonCmDetailView {...props} />}
          />
        <Route exact path={ROUTER_NAMES.INVEST_RECOMENDRCEPT_AGREMVNENTRINVTMGLISTVIEW} component={(props) => <AgremVnentrInvtMgListView {...props} />} />
        <Route exact path={[`${ROUTER_NAMES.INVEST_RECOMENDRCEPT_AGREMVNENTRINVTMGDETAILVIEW}/:id`, ROUTER_NAMES.INVEST_RECOMENDRCEPT_AGREMVNENTRINVTMGDETAILVIEW]} component={(props) => <AgremVnentrInvtMgDetailView {...props} />} />
        <Route exact path={ROUTER_NAMES.INVEST_RECOMENDRCEPT_VNENTRLONSGSHPRTRCEPTVIEW} component={(props) => <VnentrLonSgshPrtRceptView {...props} />} />
        <Route exact path={`${ROUTER_NAMES.INVEST_RECOMENDRCEPT_VNENTRLONSGSHPRTRCEPTDETAILVIEW}/:id`} component={(props) => <VnentrLonSgshPrtRceptDetailView {...props} />} />
        
        <Route exact path={ROUTER_NAMES.INVEST_RECOMENDRCEPT_MGVNENTRLONCMLISTVIEW} component={(props) => <MgVnentrLonCmListView {...props} />} />
        
        <Route exact path={ROUTER_NAMES.INVEST_FNCN_BSNS_PBAN_LIST} component={(props) => <FncnBsnsPbanList {...props} />} />
        <Route exact path={ROUTER_NAMES.INVEST_FNCN_BSNS_PBAN_VIEW} component={(props) => <FncnBsnsPbanView {...props} />} />
        <Route exact path={ROUTER_NAMES.INVEST_FNCN_BSNS_RCIP_LIST} component={(props) => <FncnBsnsRcipList {...props} />} />
        <Route exact path={ROUTER_NAMES.INVEST_FNCN_BSNS_RCIP_DETAIL} component={(props) => <FncnBsnsRcipDetail {...props} />} />

          {/*<Redirect to={ROUTER_NAMES.NOT_FOUND} />*/}
        </ThemeProvider>
      </Switch>
    </>
  )
}
export default InvestRouter
