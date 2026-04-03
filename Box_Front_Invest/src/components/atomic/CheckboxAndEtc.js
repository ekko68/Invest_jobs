/** @jsxImportSource @emotion/react */

import { TextField } from '@mui/material'
import { checkboxReverseStyle, checkboxStyle } from 'assets/style/AtomicStyle'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

const CheckboxAndEtc = forwardRef((props, ref) => {
  /*
    type : [default || reverse]
    shape : ["" || "shape01"]
    */
  const { type = 'default', shape = '', checkbox, onChange, title='', checked, ...other } = props

  useImperativeHandle(ref, () => ({}))
  useEffect(() => {
  }, [])

  const [value,setValue] = useState("");

  const handleChange = (e) => {
    setValue(e.target.value)
  };
  
  const onFocusOut = (e) => {
    let {name,value} = e.target;
    if (name == "other" && value != "") {
      checkbox.other = e.target.value
    }
  };

  if (type === 'reverse') {
    return (
      <div className={'checkbox_reverse_wrap'} css={checkboxReverseStyle(shape)}>
        <input type="checkbox" id={checkbox.id} title={title} checked={checked} onChange={(e) => onChange(e)} {...other} />
        <label htmlFor={checkbox.id}>{checkbox.value}</label>
        <label htmlFor={checkbox.id}>&nbsp;</label>
      </div>
    )
  } else {
    return (
      <div className={'checkbox_wrap'} css={checkboxStyle(shape)}>
        <input type="checkbox" id={checkbox.id} name={checkbox.value === '기타' ? 'other' : ''} title={title} checked={checked} onChange={(e) => onChange(e)} {...other} />
        <label htmlFor={checkbox.id}>&nbsp;</label>
        {
            (checked  && checkbox.value === '기타') 
          ? <TextField size='small' name='other' value={(value === "") ? checkbox.other : value} onBlur={onFocusOut} onChange={(e) => handleChange(e)}/> 
          : <label htmlFor={checkbox.id}>{checkbox.value}</label> 
        }
      </div>
    )
  }
})

export default CheckboxAndEtc
