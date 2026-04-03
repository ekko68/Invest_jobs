import React, { useLayoutEffect, useState } from 'react'

const GlobalBizContext = React.createContext({})
const { Provider } = GlobalBizContext

//  adminListParam default parameter
const globalBizListParamData = {
  searchType: '', // 이름
  searchKeyword: '', // 이메일
  page: 1,
  mngrId: ''
}

const GlobalBizProvider = ({ children }) => {
  // globalBizParam
  const [globalBizParam, setGlobalBizParam] = useState(globalBizListParamData)

  // ====== globalBizListParam search && paging param
  // props : set param || null : reset
  const handleGlobalBizParam = (props) => {
    if (props) {
      setGlobalBizParam({
        ...globalBizParam,
        ...props
      })
    } else {
      setGlobalBizParam(globalBizListParamData)
    }
  }

  const value = {
    state: { globalBizParam },
    actions: { handleGlobalBizParam }
  }
  return <Provider value={value}>{children}</Provider>
}

export { GlobalBizContext, GlobalBizProvider }
