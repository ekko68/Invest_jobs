import React, { useEffect } from 'react'
import ROUTER_NAMES from '../modules/consts/RouterConst'

const Logout = () => {
  useEffect(() => {
    sessionStorage.removeItem('token')
    location.replace(ROUTER_NAMES.LOGIN)
  }, [])
  return (
    <>
      <h1>Logout 화면입니다.</h1>
    </>
  )
}
export default Logout
