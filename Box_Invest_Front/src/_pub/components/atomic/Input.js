/** @jsxImportSource @emotion/react */
import { inputStyle } from 'assets/style/AtomicStyle'

const Input = (props) => {
  const { className, type, onChange, readOnly = false, title='', ...other } = props
  return (
    <input
      className={`input ${className ? className : ''}`}
      title={title}
      type={type}
      onChange={(e) => onChange(e)}
      {...other}
      css={inputStyle}
      readOnly={readOnly}
    />
  )
}

export default Input
