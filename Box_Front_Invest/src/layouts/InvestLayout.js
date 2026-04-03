import React, { useEffect } from 'react'
import Header from 'components/header/Header'
import Gallery01 from 'components/common/Gallery01'
import BreadCrumbs from 'components/common/BreadCrumbs'
import Footer from 'components/common/Footer'

const InvestLayout = (props) => {
  useEffect(() => {
    // window.scrollTo(window.scrollX, 0)
  }, [])
  return (
    <div className="layout">
        {props.children}
    </div>
  )
}

export default InvestLayout
