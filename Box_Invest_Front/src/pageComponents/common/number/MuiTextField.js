import { InputAdornment, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { forwardRef, useImperativeHandle, useRef } from 'react';

const MuiTextField =  forwardRef(({
  item,
  numberProperty = 'amount',
  readOnly,
  size,
  maxLength,
  displayValue,
  placeholder = '',
  title = '',
  disabled
}, ref) => {

  useImperativeHandle(ref, () => ({}))
  let inputRef = useRef()

  const CssTextField = styled(TextField)({
    '& .MuiInputBase-input': {
      padding: '8.5px 14px'
    }
  })

  const inputUi = readOnly ? (
    <CssTextField
      type="text"
      autoComplete="off"
      placeholder={placeholder}
      value={defaultValue()}
      name={numberProperty}
      size={size}
      readOnly
      title={title}
      InputProps={{
        endAdornment: <InputAdornment position="end">원</InputAdornment>
    }}
    />
  ) : (
    <CssTextField
      ref={(ref) => (inputRef = ref)}
      type="text"
      autoComplete="off"
      placeholder={placeholder}
      defaultValue={item[numberProperty]}
      name={numberProperty}
      onChange={(e)=>item[numberProperty] = e.target.value}
      size={size}
      maxLength={maxLength}
      title={title}
      disabled={disabled}
    />
  )

  return <>{inputUi}</>
})

export default MuiTextField
