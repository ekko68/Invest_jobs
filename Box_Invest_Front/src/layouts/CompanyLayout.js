import React from 'react'
import Header from 'components/header/Header'
import Gallery01 from 'components/common/Gallery01'
import BreadCrumbs from 'components/common/BreadCrumbs'
import Footer from 'components/common/Footer'

const CompanyLayout = (props) => {
  // 갤러리 임시데이터
  const galleryData = {
    title: '기업정보',
    subInfo: '기업정보페이지에 대한 설명내용이 들어갑니다.',
    img: '/images/gallery01_img1.png'
  }

  return (
    // <div className="layout">
    //   <Header page={'sub'} />
    //   <div className="page_container">
    //     {/*<Gallery01 data={galleryData} />*/}
    //     {/*<BreadCrumbs {...props} />*/}
    //
    //     {props.children}
    //   </div>
    //   <Footer />
    // </div>
    <div className="layout">{props.children}</div>
  )
}

export default CompanyLayout
