/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import Header from 'components/header/Header'
import Footer from 'components/common/Footer'

const Layout = (props) => {
  const { children } = props

  return (
    <div className="layout" css={layoutStyle}>
      <Header />
      <div className="page_container">{children}</div>
      <Footer />
    </div>
  )
}

const layoutStyle = css`
  .page_container {
    padding-top: 78px;
  }
`

export default Layout
