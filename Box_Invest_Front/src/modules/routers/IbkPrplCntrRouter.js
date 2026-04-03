import Loading from 'components/common/Loading'
import BALayout from 'layouts/BALayout'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { lazy, Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'

const BA10101 = lazy(() => import('pages/ibkPrplCntr/BA10101').then((c) => c))
const IBK_PRPL_CNTR = lazy(() => import('pages/ibkPrplCntr/IbkPrplCntr').then((c) => c))
const FUND_PRPL_INFO_LIST_VIEW = lazy(() => import('pages/ibkPrplCntr/fund/FundPrplInfoLIstView').then((c) => c))
const FUND_PRPL_INFO_STEP = lazy(() => import('pages/ibkPrplCntr/fund/FundPrplInfoStep').then((c) => c))
const FUND_PRPL_INFO_STEP2 = lazy(() => import('pages/ibkPrplCntr/fund/FundPrplInfoStep2').then((c) => c))
const FUND_PRPL_INFO_STEP3 = lazy(() => import('pages/ibkPrplCntr/fund/FundPrplInfoStep3').then((c) => c))
const FUND_PRPL_INFO_STEP_VIEW = lazy(() => import('pages/ibkPrplCntr/fund/FundPrplInfoStepView').then((c) => c))
const FUND_PRPL_INFO_STEP_VIEW2 = lazy(() => import('pages/ibkPrplCntr/fund/FundPrplInfoStepView2').then((c) => c))
const FUND_PRPL_INFO_STEP_VIEW3 = lazy(() => import('pages/ibkPrplCntr/fund/FundPrplInfoStepView3').then((c) => c))
const PRPL_CM_LIST_VIEW = lazy(() => import('pages/ibkPrplCntr/PrplCmListView').then((c) => c))
const PRPL_CM_WRITE_VIEW = lazy(() => import('pages/ibkPrplCntr/PrplCmWriteView').then((c) => c))
const PRPL_CM_DETAIL_VIEW = lazy(() => import('pages/ibkPrplCntr/PrplCmDetailView').then((c) => c))
const VNENTR_LON_SGSH_GDNC_VIEW = lazy(() => import('pages/ibkPrplCntr/vncmloan/VnentrLonSgshGdncView').then((c) => c))
const VNENTR_LON_SGSH_REG_VIEW = lazy(() => import('pages/ibkPrplCntr/vncmloan/VnentrLonSgshRegView').then((c) => c))
const VNENTR_LON_SGSH_LIST_VIEW = lazy(() => import('pages/ibkPrplCntr/vncmloan/VnentrLonSgshListView').then((c) => c))
const RCMD_ENPR_LIST_VIEW = lazy(() => import('pages/ibkPrplCntr/RcmdEnprListView').then((c) => c))

const IbkPrplCntrRouter = (props) => {
  return (
    <BALayout {...props}>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route exact path={ROUTER_NAMES.BA10101} component={() => <BA10101 {...props} />} />
          <Route exact path={ROUTER_NAMES.IBK_PRPL_CNTR} component={() => <IBK_PRPL_CNTR {...props} />} />
          <Route
            exact
            path={ROUTER_NAMES.FUND_PRPL_INFO_LIST_VIEW}
            component={() => <FUND_PRPL_INFO_LIST_VIEW {...props} />}
          />
          <Route exact path={ROUTER_NAMES.FUND_PRPL_INFO_STEP} component={() => <FUND_PRPL_INFO_STEP {...props} />} />
          <Route exact path={ROUTER_NAMES.FUND_PRPL_INFO_STEP2} component={() => <FUND_PRPL_INFO_STEP2 {...props} />} />
          <Route exact path={ROUTER_NAMES.FUND_PRPL_INFO_STEP3} component={() => <FUND_PRPL_INFO_STEP3 {...props} />} />
          <Route
            exact
            path={ROUTER_NAMES.FUND_PRPL_INFO_STEP_VIEW}
            component={() => <FUND_PRPL_INFO_STEP_VIEW {...props} />}
          />
          <Route
            exact
            path={ROUTER_NAMES.FUND_PRPL_INFO_STEP_VIEW2}
            component={() => <FUND_PRPL_INFO_STEP_VIEW2 {...props} />}
          />
          <Route
            exact
            path={ROUTER_NAMES.FUND_PRPL_INFO_STEP_VIEW3}
            component={() => <FUND_PRPL_INFO_STEP_VIEW3 {...props} />}
          />
          <Route exact path={ROUTER_NAMES.PRPL_CM_LIST_VIEW} component={() => <PRPL_CM_LIST_VIEW {...props} />} />
          <Route exact path={ROUTER_NAMES.PRPL_CM_WRITE_VIEW} component={() => <PRPL_CM_WRITE_VIEW {...props} />} />
          <Route exact path={ROUTER_NAMES.PRPL_CM_DETAIL_VIEW} component={() => <PRPL_CM_DETAIL_VIEW {...props} />} />
          <Route
            exact
            path={ROUTER_NAMES.VNENTR_LON_SGSH_GDNC_VIEW}
            component={() => <VNENTR_LON_SGSH_GDNC_VIEW {...props} />}
          />
          <Route
            exact
            path={ROUTER_NAMES.VNENTR_LON_SGSH_REG_VIEW}
            component={() => <VNENTR_LON_SGSH_REG_VIEW {...props} />}
          />
          <Route
            exact
            path={ROUTER_NAMES.VNENTR_LON_SGSH_LIST_VIEW}
            component={() => <VNENTR_LON_SGSH_LIST_VIEW {...props} />}
          />
          <Route exact path={ROUTER_NAMES.RCMD_ENPR_LIST_VIEW} component={() => <RCMD_ENPR_LIST_VIEW {...props} />} />
        </Switch>
      </Suspense>
    </BALayout>
  )
}
export default IbkPrplCntrRouter
