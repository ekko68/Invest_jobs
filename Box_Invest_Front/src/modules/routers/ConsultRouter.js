import React, { lazy, Suspense, useContext, useEffect, useLayoutEffect, useState } from 'react'
import { Switch, Route, Redirect, useHistory } from 'react-router-dom'
import ConsultLayout from 'layouts/ConsultLayout'
import Loading from 'components/common/Loading'
import ROUTER_NAMES from 'modules/consts/RouterConst'
const Consult = lazy(() => import('pages/consult').then((c) => c))

const ConsultRouter = (props) => {

  return (
    <ConsultLayout>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route path={ROUTER_NAMES.CONSULT} component={() => <Consult {...props} />} />
          <Redirect path="/" to={ROUTER_NAMES.MAIN} />
        </Switch>
      </Suspense>
    </ConsultLayout>
  )
}

export default ConsultRouter
