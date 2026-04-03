import React, { useContext, lazy, Suspense, useEffect, useState, useLayoutEffect } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import Loading from 'components/common/Loading'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import errorPage from "./pages/errorPage";

//라우터목록
const LoginRouter = lazy(() => import('modules/routers/LoginRouter').then((c) => c))
const MainRouter = lazy(() => import('modules/routers/MainRouter').then((c) => c))
const CompanyRouter = lazy(() => import('modules/routers/CompanyRouter').then((c) => c))
const InvestRouter = lazy(() => import('modules/routers/InvestRouter').then((c) => c))
const ConsultRouter = lazy(() => import('modules/routers/ConsultRouter').then((c) => c))
const MyPageRouter = lazy(() => import('modules/routers/MypageRouter').then((c) => c))
const EventRouter = lazy(() => import('modules/routers/EventRouter').then((c) => c))
const CustomerSupportRouter = lazy(() => import('modules/routers/CustomerSupportRouter').then((c) => c))
const IbkPrplCntrRouter = lazy(() => import('modules/routers/IbkPrplCntrRouter').then((c) => c))


// const EsgRouting = (path) => {
//   return location.href = `//${window.location.host}/esgLogin.html${path.location.search}&apiurl=${process.env.REACT_APP_API_URL}`;
// }

const CommonLoginRouting = (path) => {
  return location.href = `//${window.location.host}/commonLogin.html${path.location.search}&apiurl=${process.env.REACT_APP_API_URL}`;
}

const Routing = (props) => {

  //실행 타입 log 출력
  console.log(process.env.REACT_APP_RENDER_TYPE, " / ", process.env.REACT_APP_RENDER_VER);

  useLayoutEffect(() => {}, [])
  useEffect(async () => {}, [])
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route path={`${ROUTER_NAMES.LOGIN}`} component={(props) => <LoginRouter {...props} />} />
          {/*<Route path={`${ROUTER_NAMES.LOGOUT}`} component={(props) => <LoginRouter {...props} />} />*/}
          <Route path={`${ROUTER_NAMES.MAIN}`} component={(props) => <MainRouter {...props} />} />
          <Route path={`${ROUTER_NAMES.INVEST}*`} component={(props) => <InvestRouter {...props} />} />
          <Route path={`${ROUTER_NAMES.COMPANY}*`} component={(props) => <CompanyRouter {...props} />} />
          <Route path={`${ROUTER_NAMES.CONSULT}`} component={(props) => <ConsultRouter {...props} />} />
          <Route path={`${ROUTER_NAMES.MY_PAGE}*`} component={(props) => <MyPageRouter {...props} />} />
          <Route path={`${ROUTER_NAMES.EVENT}`} component={(props) => <EventRouter {...props} />} />
          <Route path={`${ROUTER_NAMES.CUSTOMER_SUPPORT}`} component={(props) => <CustomerSupportRouter {...props} />}/>
          <Route path={`${ROUTER_NAMES.PRPL_CNTR}`} component={(props) => <IbkPrplCntrRouter {...props} />}/>
          {/*<EsgRouting path={`/common/login`} />*/}
          <CommonLoginRouting path={'/common/login'}/>

          {/* not found 페이지 설정시 하단 라우팅으로 세팅 변경 확인 */}
          <Redirect exact path="/" to={ROUTER_NAMES.MAIN} />
          <Route component={errorPage} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  )
}

export default Routing
