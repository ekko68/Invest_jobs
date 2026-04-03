import React, { lazy, Suspense, useEffect } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import LoginLayout from 'layouts/LoginLayout'
import Loading from 'components/common/Loading'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { loader } from '../utils/CommonAxios'

const Login = lazy(() => import('pages/Login').then((c) => c))
const Logout = lazy(() => import('pages/Logout').then((c) => c))

const LoginRouter = (props) => {
  useEffect(() => {
    loader(false)
  }, [])
  return (
    <LoginLayout>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route exact path={ROUTER_NAMES.LOGIN} component={() => <Login {...props} />} />
          <Route exact path={ROUTER_NAMES.LOGOUT} component={() => <Logout {...props} />} />
          <Redirect path="/" to={ROUTER_NAMES.LOGIN} />
        </Switch>
      </Suspense>
    </LoginLayout>
  )
}
export default LoginRouter
