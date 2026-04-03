import Loading from 'components/common/Loading'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import React, {lazy, Suspense, useContext, useEffect} from 'react'
import {Route, Switch, useHistory} from 'react-router-dom'

const AdminList = lazy(() => import('pages/admin/List').then((c) => c))
const AdminWrite = lazy(() => import('pages/admin/Write').then((c) => c))

const AdminRouter = (props) => {
  return (
    <>
      <Suspense fallback={<Loading />} />
      <Switch>
        <Route exact path={[ROUTER_NAMES.ADMIN_LIST, '/admin']} component={AdminList} />
        <Route exact path={`${ROUTER_NAMES.ADMIN_WRITE}/:id?`} component={AdminWrite} />
        {/*<Redirect path={'*'} to={ROUTER_NAMES.NOT_FOUND} />*/}
      </Switch>
    </>
  )
}
export default AdminRouter
