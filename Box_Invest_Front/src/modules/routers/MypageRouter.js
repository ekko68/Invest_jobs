import Loading from 'components/common/Loading'
import MypageLayout from 'layouts/MypageLayout'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { lazy, Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

/* 기업전용 */
const CompanyMypage = lazy(() => import('pages/mypage/company').then((c) => c))

const Info = lazy(() => import('pages/mypage/company/myinfo/info').then((c) => c))
const InfoWrite = lazy(() => import('pages/mypage/company/myinfo/infoWrite').then((c) => c))
const InfoProdWrite = lazy(() => import('pages/mypage/company/myinfo/prodWrite').then((c) => c))
const InfoStampWrite = lazy(() => import('pages/mypage/company/myinfo/stampWrite').then((c) => c))

const CompanyInvestWrite = lazy(() => import('pages/mypage/company/myinfo/investWrite').then((c) => c))
const CompanyTeamWrite = lazy(() => import('pages/mypage/company/myinfo/teamWrite').then((c) => c))
const CompanyVideoWrite = lazy(() => import('pages/mypage/company/myinfo/videoWrite').then((c) => c))
const InvmCnvrsReg = lazy(() => import('pages/mypage/company/myinfo/InvmCnvrsReg').then((c) => c))

const Ir = lazy(() => import('pages/mypage/company/ir/ir').then((c) => c))
const IrBasicInfo = lazy(() => import('pages/mypage/company/ir/basicInfo').then((c) => c))
const IrBasicInfoWrite = lazy(() => import('pages/mypage/company/ir/basicInfoWrite').then((c) => c))
const IrFinance = lazy(() => import('pages/mypage/company/ir/finance').then((c) => c))
const IrFinanceWrite = lazy(() => import('pages/mypage/company/ir/financeWrite').then((c) => c))
const IrHistory = lazy(() => import('pages/mypage/company/ir/history').then((c) => c))
const IrHistoryWrite = lazy(() => import('pages/mypage/company/ir/historyWrite').then((c) => c))
const IrProdTechMarket = lazy(() => import('pages/mypage/company/ir/prodTechMarket').then((c) => c))
const IrProdTechMarketWrite = lazy(() => import('pages/mypage/company/ir/prodTechMarketWrite').then((c) => c))
const IrResultPlans = lazy(() => import('pages/mypage/company/ir/resultPlans').then((c) => c))
const IrResultPlansWrite = lazy(() => import('pages/mypage/company/ir/resultPlansWrite').then((c) => c))
const IrStock = lazy(() => import('pages/mypage/company/ir/stock').then((c) => c))
const IrStockWrite = lazy(() => import('pages/mypage/company/ir/stockWrite').then((c) => c))
const IrWorker = lazy(() => import('pages/mypage/company/ir/worker').then((c) => c))
const IrWorkerWrite = lazy(() => import('pages/mypage/company/ir/workerWrite').then((c) => c))

const Consult = lazy(() => import('pages/mypage/company/consult/consult').then((c) => c))
const ConsultDetail = lazy(() => import('pages/mypage/company/consult/consultDetail').then((c) => c))
const ConsultWrite = lazy(() => import('pages/mypage/company/consult/consultEdit').then((c) => c))

const CompanyRequestReceiveView = lazy(() => import('pages/mypage/company/request/requestReceiveView').then((c) => c))
const CompanyRequestSendView = lazy(() => import('pages/mypage/company/request/requestSendView').then((c) => c))
const CompanyReceiveRequestDetail = lazy(() => import('pages/mypage/company/request/requestDetail').then((c) => c))

const CompanyReceiveNda = lazy(() => import('pages/mypage/company/nda/receiveNda').then((c) => c))
const CompanySendNda = lazy(() => import('pages/mypage/company/nda/sendNda').then((c) => c))
const CompanyNdaWrite = lazy(() => import('pages/mypage/company/nda/ndaWrite').then((c) => c))
const CompanyNdaView = lazy(() => import('pages/mypage/company/nda/ndaView').then((c) => c))

const CompanyMessageReceiveView = lazy(() => import('pages/mypage/company/message/receiveMessage').then((c) => c))
const CompanyMessageSendView = lazy(() => import('pages/mypage/company/message/sendMessage').then((c) => c))

const VnentrLonCmListView = lazy(() => import('pages/mypage/company/vncmloan/VnentrLonCmListView').then((c) => c))
const VnentrLonCmRegView = lazy(() => import('pages/mypage/company/vncmloan/VnentrLonCmRegView').then((c) => c))
const VnentrLonCmDetailView = lazy(() => import('pages/mypage/company/vncmloan/VnentrLonCmDetailView').then((c) => c))

/* 투자사전용 */
const InvestorMypage = lazy(() => import('pages/mypage/investor').then((c) => c))

const InvestorInfo = lazy(() => import('pages/mypage/investor/myinfo/info').then((c) => c))
const InvestorInfoWrite = lazy(() => import('pages/mypage/investor/myinfo/infoWrite').then((c) => c))
const InvestorJudgeWrite = lazy(() => import('pages/mypage/investor/myinfo/judgeWrite').then((c) => c))
const InvestorStampWrite = lazy(() => import('pages/mypage/investor/myinfo/stampWrite').then((c) => c))

const InvestorExclusive = lazy(() => import('pages/mypage/investor/exclusive/exclusive').then((c) => c))
const InvestorExclusiveWrite = lazy(() => import('pages/mypage/investor/exclusive/exclusiveWrite').then((c) => c))

const InvestorReceiveNda = lazy(() => import('pages/mypage/investor/nda/receiveNda').then((c) => c))
const InvestorSendNda = lazy(() => import('pages/mypage/investor/nda/sendNda').then((c) => c))
const InvestorNdaWrite = lazy(() => import('pages/mypage/investor/nda/ndaWrite').then((c) => c))
const InvestorNdaView = lazy(() => import('pages/mypage/investor/nda/ndaView').then((c) => c))

const InvestorRequestReceiveView = lazy(() => import('pages/mypage/investor/request/requestReceiveView').then((c) => c))
const InvestorRequestSendView = lazy(() => import('pages/mypage/investor/request/requestSendView').then((c) => c))
const InvestorRequestDetail = lazy(() => import('pages/mypage/investor/request/requestDetail').then((c) => c))

const InvestorMessageSendView = lazy(() => import('pages/mypage/investor/message/sendMessage').then((c) => c))
const InvestorMessageReceiveView = lazy(() => import('pages/mypage/investor/message/receiveMessage').then((c) => c))

// prettier-ignore
const MypageRouter = (props) => {

  return (
    <MypageLayout {...props}>
      <Suspense fallback={<Loading />}>
        <Switch>
          {/*기업*/}
          <Route path={ROUTER_NAMES.MY_PAGE_COMPANY} exact component={() => <CompanyMypage {...props} />} />

          <Route path={ROUTER_NAMES.MY_PAGE_COMPANY_INFO} exact component={() => <Info {...props} />} />
          <Route path={ROUTER_NAMES.MY_PAGE_COMPANY_INFO_WRITE} exact component={() => <InfoWrite {...props} />} />
          <Route
            path={ROUTER_NAMES.MY_PAGE_COMPANY_INFO_PROD_WRITE}
            exact
            component={() => <InfoProdWrite {...props} />}
          />
          <Route path={ROUTER_NAMES.MY_PAGE_COMPANY_INFO_INVM_CNVRS} component={() => <InvmCnvrsReg {...props} />} />
          <Route
            path={ROUTER_NAMES.MY_PAGE_COMPANY_STAMP_WRITE}
            exact
            component={() => <InfoStampWrite {...props} />}
          />
          <Route
            path={ROUTER_NAMES.MY_PAGE_COMPANY_INVEST_WRITE}
            exact
            component={() => <CompanyInvestWrite {...props} />}
          />
          <Route
            path={ROUTER_NAMES.MY_PAGE_COMPANY_TEAM_WRITE}
            exact
            component={() => <CompanyTeamWrite {...props} />}
          />
          <Route
            path={ROUTER_NAMES.MY_PAGE_COMPANY_VIDEO_WRITE}
            exact
            component={() => <CompanyVideoWrite {...props} />}
          />

          <Route path={ROUTER_NAMES.MY_PAGE_IR} exact component={() => <Ir {...props} />} />
          <Route path={ROUTER_NAMES.MY_PAGE_IR_BASIC_INFO} exact component={() => <IrBasicInfo {...props} />} />
          <Route
            path={ROUTER_NAMES.MY_PAGE_IR_BASIC_INFO_WRITE}
            exact
            component={() => <IrBasicInfoWrite {...props} />}
          />
          <Route path={ROUTER_NAMES.MY_PAGE_IR_FINANCE} exact component={() => <IrFinance {...props} />} />
          <Route path={ROUTER_NAMES.MY_PAGE_IR_FINANCE_WRITE} exact component={() => <IrFinanceWrite {...props} />} />
          <Route path={ROUTER_NAMES.MY_PAGE_IR_HISTORY} exact component={() => <IrHistory {...props} />} />
          <Route path={ROUTER_NAMES.MY_PAGE_IR_HISTORY_WRITE} exact component={() => <IrHistoryWrite {...props} />} />
          <Route
            path={ROUTER_NAMES.MY_PAGE_IR_PROD_TECH_MARKET}
            exact
            component={() => <IrProdTechMarket {...props} />}
          />
          <Route
            path={ROUTER_NAMES.MY_PAGE_IR_PROD_TECH_MARKET_WRITE}
            exact
            component={() => <IrProdTechMarketWrite {...props} />}
          />
          <Route path={ROUTER_NAMES.MY_PAGE_IR_RESULT_PLANS} exact component={() => <IrResultPlans {...props} />} />
          <Route
            path={ROUTER_NAMES.MY_PAGE_IR_RESULT_PLANS_WRITE}
            exact
            component={() => <IrResultPlansWrite {...props} />}
          />
          <Route
            path={ROUTER_NAMES.MY_PAGE_IR_PROD_TECH_MARKET_WRITE}
            exact
            component={() => <IrResultPlansWrite {...props} />}
          />
          <Route path={ROUTER_NAMES.MY_PAGE_IR_STOCK} exact component={() => <IrStock {...props} />} />
          <Route path={ROUTER_NAMES.MY_PAGE_IR_STOCK_WRITE} exact component={() => <IrStockWrite {...props} />} />
          <Route path={ROUTER_NAMES.MY_PAGE_IR_WORKER} exact component={() => <IrWorker {...props} />} />
          <Route path={ROUTER_NAMES.MY_PAGE_IR_WORKER_WRITE} exact component={() => <IrWorkerWrite {...props} />} />

          <Route path={ROUTER_NAMES.MY_PAGE_CONSULT} exact component={() => <Consult {...props} />} />
          <Route path={ROUTER_NAMES.MY_PAGE_CONSULT_DETAIL} exact component={() => <ConsultDetail {...props} />} />
          <Route path={ROUTER_NAMES.MY_PAGE_CONSULT_WRITE} exact component={() => <ConsultWrite {...props} />} />

          <Route
            path={ROUTER_NAMES.MY_PAGE_COMPANY_REQUEST_RECEIVE_VIEW}
            exact
            component={() => <CompanyRequestReceiveView {...props} />}
          />
          <Route
            path={ROUTER_NAMES.MY_PAGE_COMPANY_REQUEST_SEND_VIEW}
            exact
            component={() => <CompanyRequestSendView {...props} />}
          />
          <Route
            path={ROUTER_NAMES.MY_PAGE_COMPANY_REQUEST_DETAIL}
            exact
            component={() => <CompanyReceiveRequestDetail {...props} />}
          />

          <Route
            path={ROUTER_NAMES.MY_PAGE_COMPANY_NDA_RECEIVE}
            exact
            component={() => <CompanyReceiveNda {...props} />}
          />
          <Route path={ROUTER_NAMES.MY_PAGE_COMPANY_NDA_SEND} exact component={() => <CompanySendNda {...props} />} />
          <Route path={ROUTER_NAMES.MY_PAGE_COMPANY_NDA_WRITE} exact component={() => <CompanyNdaWrite {...props} />} />
          <Route path={ROUTER_NAMES.MY_PAGE_COMPANY_NDA_VIEW} exact component={() => <CompanyNdaView {...props} />} />

          <Route
            path={ROUTER_NAMES.MY_PAGE_COMPANY_MESSAGE_RECEIVE_VIEW}
            exact
            component={() => <CompanyMessageReceiveView {...props} />}
          />
          <Route
            path={ROUTER_NAMES.MY_PAGE_COMPANY_MESSAGE_SEND_VIEW}
            exact
            component={() => <CompanyMessageSendView {...props} />}
          />

          <Route
            exact
            path={ROUTER_NAMES.VNENTR_LON_CM_LIST_VIEW}
            component={() => <VnentrLonCmListView {...props} />}
          />
          <Route exact path={ROUTER_NAMES.VNENTR_LON_CM_REG_VIEW} component={() => <VnentrLonCmRegView {...props} />} />
          <Route
            exact
            path={ROUTER_NAMES.VNENTR_LON_CM_DETAIL_VIEW}
            component={() => <VnentrLonCmDetailView {...props} />}
          />

          {/*투자사*/}
          <Route path={ROUTER_NAMES.MY_PAGE_INVESTOR} exact component={() => <InvestorMypage {...props} />} />

          <Route path={ROUTER_NAMES.MY_PAGE_INVESTOR_INFO} exact component={() => <InvestorInfo {...props} />} />
          <Route
            path={ROUTER_NAMES.MY_PAGE_INVESTOR_INFO_WRITE}
            exact
            component={() => <InvestorInfoWrite {...props} />}
          />
          <Route
            path={ROUTER_NAMES.MY_PAGE_INVESTOR_STAMP_WRITE}
            exact
            component={() => <InvestorStampWrite {...props} />}
          />
          <Route
            path={ROUTER_NAMES.MY_PAGE_INVESTOR_JUDGE_WRITE}
            exact
            component={() => <InvestorJudgeWrite {...props} />}
          />

          <Route
            path={ROUTER_NAMES.MY_PAGE_INVESTOR_EXCLUSIVE}
            exact
            component={() => <InvestorExclusive {...props} />}
          />
          <Route
            path={ROUTER_NAMES.MY_PAGE_INVESTOR_EXCLUSIVE_WRITE}
            exact
            component={() => <InvestorExclusiveWrite {...props} />}
          />

          <Route
            path={ROUTER_NAMES.MY_PAGE_INVESTOR_REQUEST_RECEIVE_VIEW}
            exact
            component={() => <InvestorRequestReceiveView {...props} />}
          />
          <Route
            path={ROUTER_NAMES.MY_PAGE_INVESTOR_REQUEST_SEND_VIEW}
            exact
            component={() => <InvestorRequestSendView {...props} />}
          />
          <Route
            path={ROUTER_NAMES.MY_PAGE_INVESTOR_REQUEST_DETAIL}
            exact
            component={() => <InvestorRequestDetail {...props} />}
          />

          <Route
            path={ROUTER_NAMES.MY_PAGE_INVESTOR_NDA_RECEIVE}
            exact
            component={() => <InvestorReceiveNda {...props} />}
          />
          <Route path={ROUTER_NAMES.MY_PAGE_INVESTOR_NDA_SEND} exact component={() => <InvestorSendNda {...props} />} />
          <Route
            path={ROUTER_NAMES.MY_PAGE_INVESTOR_NDA_WRITE}
            exact
            component={() => <InvestorNdaWrite {...props} />}
          />
          <Route path={ROUTER_NAMES.MY_PAGE_INVESTOR_NDA_VIEW} exact component={() => <InvestorNdaView {...props} />} />

          <Route
            path={ROUTER_NAMES.MY_PAGE_INVESTOR_MESSAGE_RECEIVE_VIEW}
            exact
            component={() => <InvestorMessageReceiveView {...props} />}
          />
          <Route
            path={ROUTER_NAMES.MY_PAGE_INVESTOR_MESSAGE_SEND_VIEW}
            exact
            component={() => <InvestorMessageSendView {...props} />}
          />

          <Redirect path="/" to={ROUTER_NAMES.MAIN} />
        </Switch>
      </Suspense>
    </MypageLayout>
  )
}
export default MypageRouter
