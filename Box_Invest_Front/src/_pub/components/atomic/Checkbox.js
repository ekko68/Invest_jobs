/** @jsxImportSource @emotion/react */

import { checkboxReverseStyle } from 'assets/style/AtomicStyle'
import { checkboxStyle } from 'assets/style/AtomicStyle'

const Checkbox = (props) => {
  /*
    type : [default || reverse]
    shape : ["" || "shape01"]
    */
  const { type = 'default', shape = '', checkbox, onChange, title='', ...other } = props

  if (type === 'reverse') {
    return (
      <div className={'checkbox_reverse_wrap'} css={checkboxReverseStyle(shape)}>
        <input type="checkbox" id={checkbox.id} title={title} onChange={(e) => onChange(e)} {...other} />
        <label htmlFor={checkbox.id}>{checkbox.value}</label>
        <label htmlFor={checkbox.id}>&nbsp;</label>
      </div>
    )
  } else {
    return (
      <div className={'checkbox_wrap'} css={checkboxStyle(shape)}>
        <input type="checkbox" id={checkbox.id} title={title} onChange={(e) => onChange(e)} {...other} />
        <label htmlFor={checkbox.id}>&nbsp;</label>
        <label htmlFor={checkbox.id}>{checkbox.value}</label>
      </div>
    )
  }
}

export default Checkbox
