import React, {lazy, Suspense, useContext, useEffect, useLayoutEffect, useRef, useState} from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import InvestLayout from 'layouts/InvestLayout'
import Loading from 'components/common/Loading'
import ROUTER_NAMES from 'modules/consts/RouterConst'
const Invest = lazy(() => import('pages/invest').then((c) => c))
const Detail = lazy(() => import('pages/invest/detail').then((c) => c))

const InvestRouter = (props) => {

    return (
        <InvestLayout {...props}>
            <Suspense fallback={<Loading />}>
                <Switch>
                    <Route exact path={ROUTER_NAMES.INVEST} component={() => <Invest {...props} />} />
                    <Route exact path={ROUTER_NAMES.INVEST_DETAIL} component={() => <Detail {...props} />} />
                    <Redirect path="/" to={ROUTER_NAMES.MAIN} />
                </Switch>
            </Suspense>
        </InvestLayout>
    )
}
export default InvestRouter
