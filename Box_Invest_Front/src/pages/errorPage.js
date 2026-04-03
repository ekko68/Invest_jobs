import React, { useContext, useEffect, useRef, useState } from 'react'
import Header from 'components/header/Header'
import { CommonContext } from 'modules/contexts/common/CommomContext'

const errorPage = () => {
  const commonContext = useContext(CommonContext)
  const isMounted = useRef(false)
  const renderType = useRef('')
  const locationStr = `${window.location}`
  const compareStr = locationStr.toString().split('?')
  const test = 
    <div className="page_container">
    <div className="error_wrap">
      <div className="error_page">
        <p className="error_title">오류가 발생하였습니다.</p>
        <p className="error_text">
          네트워크의 연결을 확인하거나 관리자에게 문의해주세요. <br />
          TEL. 02-000-0000 / e-mail : asd@asd.co.kr
        </p>
      </div>
    </div>
  </div>
  const [showPage, setShowPage] = useState()

  useEffect(() => {
    commonContext.actions.contextMountUserInfoSet()
    if (process.env.REACT_APP_RENDER_TYPE === 'prod') {
      renderType.current = 'https://invest.ibkbox.net/auth/session.do'
    } else {
      renderType.current = 'https://devinvest.ibkbox.net/auth/session.do'
    }
    if(compareStr[0] !== renderType.current) {
      setShowPage(test)
    }else {
      setShowPage(location.href = '/')
    }
    return () => (isMounted.current = false)
  }, [])

  return (
    <div className="layout">
      <Header isSetMountContextUser={false} />
      {showPage}
    </div>
  )
}

export default errorPage
