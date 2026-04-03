import React from 'react'
import Routing from 'Routing'
import { isIE } from 'react-device-detect'
import Loading from 'components/common/Loading'
import { UserProvider } from 'modules/common/UserContext'
import { InvestProvider } from 'modules/common/InvestContext'
import { MktProvider } from './modules/common/MktContext'
import { GlobalBizProvider } from './modules/common/GlobalBizContext'
import { AdminProvider } from './modules/common/AdminContext'
import { BooksProvider } from './modules/common/BooksContext'
import { MainProvider } from './modules/common/MainContext'

/** 전역으로 사용할 정보 할당 */
const CommonProvider = ({ contexts, children }) => {
  return contexts.reduce((prev, context) => React.createElement(context, { children: prev }), children)
}

function App() {
  return (
    <>
      {isIE ? (
        <div>
          <h1>지원하지 않는 브라우저입니다.</h1>
        </div>
      ) : (
        // todo -> menu list API 활성화시 전역으로 사용할 상수값 추가 예정.
        <CommonProvider contexts={[UserProvider, InvestProvider, MktProvider, GlobalBizProvider, AdminProvider, BooksProvider, MainProvider]}>
          <Loading />
          <Routing />
        </CommonProvider>
      )}
    </>
  )
}

export default App
