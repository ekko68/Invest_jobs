import React, { useState, useLayoutEffect, useEffect } from 'react'

/**
 * @deprecated
 */
const ConsultContext = React.createContext({
  state: {
    list: []
  },
  actions: {
    actList: () => {}
  }
})

const { Provider } = ConsultContext


/**
 * @deprecated
 */
const ConsultProvider = ({ children }) => {
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

export { ConsultContext, ConsultProvider }
