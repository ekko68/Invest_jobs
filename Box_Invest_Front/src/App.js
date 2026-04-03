import Routing from 'Routing'
import React, { useEffect, useLayoutEffect } from 'react'
import { isIE } from 'react-device-detect'

import { CompanyProvider } from 'modules/contexts/company/companyContext'

import Loading from 'components/common/Loading'
import { CodeContextProvider } from 'modules/contexts/common/CodeContext'
import { CommonContextProvider } from 'modules/contexts/common/CommomContext'
import { ThemeComProvider } from 'modules/contexts/common/themeContext'
import { LocalizeProvider } from 'modules/contexts/common/LocalizeContext'
import SessionCheckAlert from 'pageComponents/common/pop/SessionCheckAlert'
import { LoginContextProvider } from './modules/contexts/common/LoginContext'

//Provider list
const CommonProvider = ({ contexts, children }) =>
  contexts.reduce(
    (prev, context) =>
      React.createElement(context, {
        children: prev
      }),
    children
  )

const App = () => {
  useLayoutEffect(() => {
    window.addEventListener('keydown', onKeyDownEvent)
  }, [])
  useEffect(async () => {}, [])
  const onKeyDownEvent = (event) => {
    if (event.keyCode === 123) {
      // event.stopImmediatePropagation()
      // event.preventDefault()
      // return
    }
  }
  return (
    <>
      {isIE ? (
        <div>
          <h1>지원하지 않는 브라우저입니다.</h1>
        </div>
      ) : (
        <CommonProvider
          contexts={[
            CompanyProvider,
            ThemeComProvider,
            LocalizeProvider,
            // InvestProvider,
            // ConsultProvider,
            // MyPageVcContextProvider,
            // MyPageCompanyContextProvider,

            // 아래는 배열 순서 중요
            // common ctx에서 login ctx를 호출해서 combind하므로 반드시 common ctx가 먼저 생성되어야한다.
            CommonContextProvider,
            LoginContextProvider,
            CodeContextProvider
          ]}
        >
          <Loading />
          <SessionCheckAlert />
          <Routing />
        </CommonProvider>
      )}
    </>
  )
}

export default App
