import React, { useLayoutEffect, useState } from 'react'

const AdminContext = React.createContext({})
const { Provider } = AdminContext

//  adminListParam default parameter
const adminListParamData = {
  mngrNm: '', // 이름
  mngrEmlAdr: '', // 이메일
  page: 1,
  searchInput: ''
}

const AdminProvider = ({ children }) => {
  // adminListParam
  const [adminListParam, setAdminListParam] = useState(adminListParamData)

  // ====== adminListParam search && paging param
  // props : set param || null : reset
  const handleSetAdminListParam = (props) => {
    if (props) {
      setAdminListParam({
        ...adminListParam,
        ...props
      })
    } else {
      setAdminListParam(adminListParamData)
    }
  }

  useLayoutEffect(() => {}, [])

  const value = {
    state: { adminListParam },
    actions: { handleSetAdminListParam }
  }
  return <Provider value={value}>{children}</Provider>
}

export { AdminContext, AdminProvider }
