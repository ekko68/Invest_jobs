import React, { useLayoutEffect, useEffect } from 'react'

/**
 * @deprecated
 */
const MyPageContext = React.createContext({
  state: {},
  actions: {}
})

const { Provider } = MyPageContext

const MyPageProvider = ({ children }) => {
  useLayoutEffect(() => {}, [])

  useEffect(() => {}, [])

  const contextValue = {
    state: {},
    actions: {}
  }

  return <Provider value={contextValue}>{children}</Provider>
}

export { MyPageContext, MyPageProvider }
