import Loading from 'components/common/Loading'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { loader } from 'modules/utils/CommonAxios'
import React, { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'

const PubRouter = lazy(() => import('modules/routers/PubRouter').then((c) => c))

const LoginRouter = lazy(() => import('modules/routers/LoginRouter').then((c) => c))
const AdminRouter = lazy(() => import('modules/routers/AdminRouter').then((c) => c))
const InvestRouter = lazy(() => import('modules/routers/InvestRouter').then((c) => c))
const CommerceRouter = lazy(() => import('modules/routers/CommerceRouter').then((c) => c))
const GlobalRouter = lazy(() => import('modules/routers/GlobalRouter').then((c) => c))
const BooksRouter = lazy(() => import('modules/routers/BooksRouter').then((c) => c))
const MainRouter = lazy(() => import('modules/routers/MainRouter').then((c) => c))
const DashboardRouter = lazy(() => import('modules/routers/DashboardRouter').then((c) => c))
const NoResult = lazy(() => import('pages/notFound').then((c) => c))
const NotAuthInfo = lazy(() => import('pages/notAuthInfo').then((c) => c))

const Routing = (props) => {
  // useEffect(() => {
  //   if (!sessionStorage.getItem('token')) {
  //     if (location.pathname !== ROUTER_NAMES.LOGIN) location.replace(ROUTER_NAMES.LOGIN)
  //     loader(false)
  //   }
  // }, [])

  useEffect(() => {
    // for the case after build
    if (location.pathname === '/') location.replace(ROUTER_NAMES.LOGIN)
  }, [])

  //실행 타입 log 출력
  console.log(process.env.REACT_APP_RENDER_TYPE, ' / ', process.env.REACT_APP_RENDER_VER)

  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<Loading />}>
          <Switch>
            <Route path={'/pub*'} component={(props) => <PubRouter {...props} />} />

            <Route path={ROUTER_NAMES.LOGIN} component={(props) => <LoginRouter {...props} />} />
            <Route path={ROUTER_NAMES.LOGOUT} component={(props) => <LoginRouter {...props} />} />
            <Route path={`${ROUTER_NAMES.ADMIN}*`} component={(props) => <AdminRouter {...props} />} />
            <Route path={`${ROUTER_NAMES.INVEST}*`} component={(props) => <InvestRouter {...props} />} />
            <Route path={`${ROUTER_NAMES.COMMERCE_MAIN}*`} component={() => <CommerceRouter {...props} />} />
            <Route path={`${ROUTER_NAMES.GLOBAL}*`} component={() => <GlobalRouter {...props} />} />
            <Route path={`${ROUTER_NAMES.BOOKS}*`} component={() => <BooksRouter {...props} />} />
            <Route path={`${ROUTER_NAMES.MAIN}*`} component={() => <MainRouter {...props} />} />
            <Route path={`${ROUTER_NAMES.DASHBOARD}*`} component={() => <DashboardRouter {...props} />} />
            <Route path={ROUTER_NAMES.NOT_FOUND} component={(props) => <NoResult {...props} />} />
            <Route path={ROUTER_NAMES.NOT_AUTH_INFO} component={(props) => <NotAuthInfo {...props} />} />
            <Redirect exact path={'/'} to={ROUTER_NAMES.LOGIN} />
            <Redirect path={'/*'} to={ROUTER_NAMES.NOT_FOUND} />
          </Switch>
        </Suspense>
      </BrowserRouter>
    </>
  )
}
export default Routing
