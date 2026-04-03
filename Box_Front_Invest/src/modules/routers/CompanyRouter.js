import React, { lazy, Suspense, useContext, useEffect, useLayoutEffect, useState } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import CompanyLayout from 'layouts/CompanyLayout'
import Loading from 'components/common/Loading'
import ROUTER_NAMES from 'modules/consts/RouterConst'
const Company = lazy(() => import('pages/company').then((c) => c))
const Detail = lazy(() => import('pages/company/detail').then((c) => c))
// const Request = lazy(() => import('pages/company/Request').then((c) => c))
const CompanyRouter = (props) => {

  return (
    <CompanyLayout {...props}>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route exact path={ROUTER_NAMES.COMPANY} component={() => <Company {...props} />} />
          <Route exact path={ROUTER_NAMES.COMPANY_DETAIL} component={() => <Detail {...props} />} />
          {/*<Route exact path={ROUTER_NAMES.COMPANY_REQUEST} component={() => <Request {...props} />} />*/}
          <Redirect path="/" to={ROUTER_NAMES.MAIN} />
        </Switch>
      </Suspense>
    </CompanyLayout>
  )
}
export default CompanyRouter
