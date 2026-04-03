import Loading from 'components/common/Loading'
import BALayout from '_pub/layouts/BALayout'
import ROUTER_NAMES from '_pub/modules/consts/RouterConst'
import { lazy, Suspense } from 'react'
import { Route, Switch } from 'react-router-dom'

const Notice_List_InvestBusiness = lazy(() => import('_pub/pages/pub/Notice_List_InvestBusiness').then((c) => c))
const Notice_Detail_InvestBusiness = lazy(() => import('_pub/pages/pub/Notice_Detail_InvestBusiness').then((c) => c))
const Accept_InvestBusiness = lazy(() => import('_pub/pages/pub/Accept_InvestBusiness').then((c) => c))
const Accept_State_Detail_InvestBusiness = lazy(() =>
  import('_pub/pages/pub/Accept_State_Detail_InvestBusiness').then((c) => c)
)
const Accept_State_List_InvestBusiness = lazy(() =>
  import('_pub/pages/pub/Accept_State_List_InvestBusiness').then((c) => c)
)
const PubRouter = (props) => {
  return (
    <BALayout {...props}>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route
            exact
            path={ROUTER_NAMES.Notice_List_InvestBusiness}
            component={() => <Notice_List_InvestBusiness {...props} />}
          />
          <Route
            exact
            path={ROUTER_NAMES.Notice_Detail_InvestBusiness}
            component={() => <Notice_Detail_InvestBusiness {...props} />}
          />
          <Route
            exact
            path={ROUTER_NAMES.Accept_InvestBusiness}
            component={() => <Accept_InvestBusiness {...props} />}
          />
          <Route
            exact
            path={ROUTER_NAMES.Accept_State_Detail_InvestBusiness}
            component={() => <Accept_State_Detail_InvestBusiness {...props} />}
          />
          <Route
            exact
            path={ROUTER_NAMES.Accept_State_List_InvestBusiness}
            component={() => <Accept_State_List_InvestBusiness {...props} />}
          />
        </Switch>
      </Suspense>
    </BALayout>
  )
}
export default PubRouter
