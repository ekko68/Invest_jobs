/**
 * 마이페이지 투자사용
 */
import React, { useLayoutEffect, useEffect } from 'react'

/**
 * @deprecated
 */
const MyPageCompanyContext = React.createContext({
  state: {},
  actions: {}
})

const { Provider } = MyPageCompanyContext


/**
 * @deprecated
 */
const MyPageCompanyContextProvider = ({ children }) => {
  useLayoutEffect(() => {}, [])

  useEffect(() => {}, [])

  const contextValue = {
    state: {},
    actions: {}
  }

  return <Provider value={contextValue}>{children}</Provider>
}

export { MyPageCompanyContext, MyPageCompanyContextProvider }
