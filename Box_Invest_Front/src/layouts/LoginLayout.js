import React from 'react'

const LoginLayout = (props) => {
  return (
      <div className="layout bg_none">
        <main>{props.children}</main>
      </div>
  )
}

export default LoginLayout
