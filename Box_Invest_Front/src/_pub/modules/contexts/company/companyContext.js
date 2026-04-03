import React, { useState } from 'react'

/**
 * @todo 사용처 수정
 */
const CompanyContext = React.createContext({
  state: { invmExntRqstId: '' },
  actions: {}
})

const { Provider } = CompanyContext

const CompanyProvider = ({ children }) => {
  const [invmExntRqstId, setInvmExntRqstId] = useState('')
  const setSuggestId = (id) => {
    setInvmExntRqstId(id)
  }
  const contextValue = {
    state: { invmExntRqstId },
    actions: { setSuggestId }
  }
  return <Provider value={contextValue}>{children}</Provider>
}

export { CompanyContext, CompanyProvider }
