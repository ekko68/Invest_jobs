import React, { lazy, Suspense, useLayoutEffect } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Loading from 'components/common/Loading'
import EventLayout from 'layouts/EventLayout'
import ROUTER_NAMES from 'modules/consts/RouterConst'

const Event = lazy(() => import('pages/event').then((c) => c))

const EventRouter = (props) => {
  useLayoutEffect(() => {}, [])
  return (
    <EventLayout>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route path={ROUTER_NAMES.EVENT} component={() => <Event {...props} />} />
          <Redirect path="/" to={ROUTER_NAMES.MAIN} />
        </Switch>
      </Suspense>
    </EventLayout>
  )
}

export default EventRouter
