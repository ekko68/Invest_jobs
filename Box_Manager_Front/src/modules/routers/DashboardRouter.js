import Loading from 'components/common/Loading'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import React, {lazy, Suspense, useContext, useEffect} from 'react'
import {Route, Switch, useHistory} from 'react-router-dom'

const MainDashboard = lazy(() => import('pages/main/Dashboard').then((c) => c))
const BooksDashboard = lazy(() => import('pages/books/Dashboard').then((c) => c))

const DashboardRouter = (props) => {
  return (
    <>
      <Switch>
        <Route exact path={ROUTER_NAMES.DASHBOARD_MAIN} component={MainDashboard} />
        <Route exact path={ROUTER_NAMES.DASHBOARD_BOOKS} component={BooksDashboard} />
        {/*<Redirect path={'*'} to={ROUTER_NAMES.NOT_FOUND} />*/}
      </Switch>
    </>
  )
}
export default DashboardRouter
