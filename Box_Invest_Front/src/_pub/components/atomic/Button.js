/** @jsxImportSource @emotion/react */
import { buttonStyle } from 'assets/style/AtomicStyle'
import {CheckYn} from "modules/consts/BizConst";

const Button = (props) => {
  // type : default || linear || dashed
  const {
    className = '',
    type = 'default',
    disabled = CheckYn.NO,
    theme = '#b8babf',
    color = '#fff',
    children,
    ...other
  } = props

  return (
    <button
      {...other}
      css={buttonStyle(type, theme, color)}
      className={`button ${className}`}
      disabled={disabled === CheckYn.YES ? true : false}
    >
      {children}
    </button>
  )
}

export default Button
