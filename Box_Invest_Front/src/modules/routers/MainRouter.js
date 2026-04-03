import React, { lazy, Suspense, useContext, useEffect, useLayoutEffect, useState } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import MainLayout from 'layouts/MainLayout'
import Loading from 'components/common/Loading'
import ROUTER_NAMES from 'modules/consts/RouterConst'
const Main = lazy(() => import('pages/main').then((c) => c))

const MainRouter = (props) => {

  return (
    <MainLayout>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route exact path={ROUTER_NAMES.MAIN} component={() => <Main {...props} />} />
          <Redirect path="/" to={ROUTER_NAMES.MAIN} />
        </Switch>
      </Suspense>
    </MainLayout>
  )
}

export default MainRouter
