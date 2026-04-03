/**
 * 마이페이지 투자사용
 */
import React, { useLayoutEffect, useEffect } from 'react'

/**
 * @deprecated
 */
const MyPageVcContext = React.createContext({
  state: {},
  actions: {}
})

const { Provider } = MyPageVcContext


/**
 * @deprecated
 */
const MyPageVcContextProvider = ({ children }) => {
  useLayoutEffect(() => {}, [])

  useEffect(() => {}, [])

  const contextValue = {
    state: {},
    actions: {}
  }

  return <Provider value={contextValue}>{children}</Provider>
}

export { MyPageVcContext, MyPageVcContextProvider }
