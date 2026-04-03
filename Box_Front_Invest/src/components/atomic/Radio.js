/** @jsxImportSource @emotion/react */
import { radioStyle } from 'assets/style/AtomicStyle'

const Radio = (props) => {
  const { radio, onChange, title = '', ...other } = props
  return (
    <div className="radio_wrap" css={radioStyle}>
      <input type="radio" id={radio.id} onChange={(e) => onChange(e)} {...other} title={title} />
      <label htmlFor={radio.id}>&nbsp;</label>
      <label htmlFor={radio.id}>{radio.value}</label>
    </div>
  )
}

export default Radio
