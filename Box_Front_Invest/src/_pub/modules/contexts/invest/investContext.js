import React, { useState, useLayoutEffect, useEffect } from 'react'

/**
 * @deprecated
 */
const InvestContext = React.createContext({
  state: {
    list: []
  },
  actions: {
    actList: () => {}
  }
})

const { Provider } = InvestContext


/**
 * @deprecated
 */
const InvestProvider = ({ children }) => {
  const [list, setList] = useState([])

  const actList = () => {
    // from db
    setList([])
  }

  useLayoutEffect(() => {}, [])

  useEffect(() => {}, [])

  const contextValue = {
    state: { list },
    actions: { actList }
  }

  return <Provider value={contextValue}>{children}</Provider>
}

export { InvestContext, InvestProvider }
