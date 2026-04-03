import React, { lazy, Suspense, useContext, useEffect, useLayoutEffect, useState } from 'react'
import { Switch, Route, Redirect, useHistory } from 'react-router-dom'
import Loading from 'components/common/Loading'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import QaLayout from 'layouts/QaLayout'
const Notice = lazy(() => import('pages/customersupport/notice').then((c) => c))
const NoticeView = lazy(() => import('pages/customersupport/noticeView').then((c) => c))
const Qa = lazy(() => import('pages/customersupport/qa').then((c) => c))
const QaView = lazy(() => import('pages/customersupport/qaView').then((c) => c))
const QaWrite = lazy(() => import('pages/customersupport/qaWrite').then((c) => c))

const CustomerSupportRouter = (props) => {

  return (
    <QaLayout {...props}>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route exact path={ROUTER_NAMES.CUSTOMER_SUPPORT_NOTICE} component={() => <Notice {...props} />} />
          <Route exact path={ROUTER_NAMES.CUSTOMER_SUPPORT_NOTICE_VIEW} component={() => <NoticeView {...props} />} />
          <Route exact path={ROUTER_NAMES.CUSTOMER_SUPPORT_QA} component={() => <Qa {...props} />} />
          <Route exact path={ROUTER_NAMES.CUSTOMER_SUPPORT_QA_VIEW} component={() => <QaView {...props} />} />
          <Route exact path={ROUTER_NAMES.CUSTOMER_SUPPORT_QA_WRITE} component={() => <QaWrite {...props} />} />
          <Redirect path="/" to={ROUTER_NAMES.MAIN} />
        </Switch>
      </Suspense>
    </QaLayout>
  )
}
export default CustomerSupportRouter
