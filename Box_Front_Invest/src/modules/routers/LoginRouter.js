import React, { lazy, Suspense } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import LoginLayout from 'layouts/LoginLayout'
import Loading from 'components/common/Loading'
import ROUTER_NAMES from 'modules/consts/RouterConst'

// const Login = lazy(() => import('pages/login').then((c) => c))
const Logout = lazy(() => import('pages/logout').then((c) => c))

const LoginRouter = (props) => {
  const { match } = props
  return (
    <LoginLayout>
      <Suspense fallback={<Loading />}>
        <Switch>
          {/*<Route exact path={ROUTER_NAMES.LOGIN} component={() => <Login {...props} />} />*/}
          {/*<Route exact path={ROUTER_NAMES.LOGOUT} component={() => <Logout {...props} />} />*/}
          <Redirect path="/" to={ROUTER_NAMES.MAIN} />
        </Switch>
      </Suspense>
    </LoginLayout>
  )
}

export default LoginRouter
