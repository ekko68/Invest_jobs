import React, { lazy } from 'react'
import { Switch, Route } from 'react-router-dom'
import ROUTER_NAMES from 'modules/consts/RouterConst'

// 해외진출 상담
const GlobalConsultList = lazy(() => import('pages/global/consult/List').then((c) => c))
const GlobalConsultDetail = lazy(() => import('pages/global/consult/View').then((c) => c))
const GlobalStatisticsListDaily = lazy(() => import('pages/global/statistics/ListDaily').then((c) => c))
const GlobalStatisticsListMonthly = lazy(() => import('pages/global/statistics/ListMonthly').then((c) => c))
const GlobalStatisticsListYearly = lazy(() => import('pages/global/statistics/ListYearly').then((c) => c))

// prettier-ignore
const GlobalRouter = (props) => {
  return (
    <>
      <Switch>
        <Route exact path={ROUTER_NAMES.GLOBAL_CONSULT_LIST} component={(props) => <GlobalConsultList {...props} />} />
        <Route exact path={`${ROUTER_NAMES.GLOBAL_CONSULT_VIEW}/:id`} component={(props) => <GlobalConsultDetail {...props} />} />
        <Route exact path={ROUTER_NAMES.GLOBAL_STATISTICS_LIST_YEARLY} component={(props) => <GlobalStatisticsListYearly {...props} />} />
        <Route exact path={ROUTER_NAMES.GLOBAL_STATISTICS_LIST_MONTHLY} component={(props) => <GlobalStatisticsListMonthly {...props} />} />
        <Route exact path={ROUTER_NAMES.GLOBAL_STATISTICS_LIST_DAILY} component={(props) => <GlobalStatisticsListDaily {...props} />} />
      </Switch>
    </>
  )
}
export default GlobalRouter
