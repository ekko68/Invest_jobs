import { TextField, Typography, Stack, useTheme } from '@mui/material'
import { useEffect, useRef, useState } from 'react'

const TextAreaInput = (props) => {
  const theme = useTheme()

  const {
    item,
    numberProperty = 'name',
    readOnly,
    size,
    values,
    maxLength,
    disabled,
    changeNow,
    // displayValue,
    placeholder = '',
    title = '',
    rows
  } = props
  const [val, setVal] = useState(values)

  let inputRef = useRef()
  /**
   * 입력값 변경시 콤마가 추가된 숫자만 표기하고 item의 해당되는 값에는 숫자값만 입력함.
   * @param e
   */
  const onChange = (e) => {
    const { value } = e.target
    const reg = /[^-.A-Z a-z ㄱ-ㅎ 가-힣 ㅡ_ㅢ 0-9 ()/@]/gi
    setVal(e.target.value.replace(reg, ''))

    // updateItem(e)
  }

  /**
   * Focus out 이벤트시 item의 해당 값을 업데이트함.
   * @param e
   */
  const onFocusOut = (e) => {
    updateItem(e)
  }

  /**
   * Focus in 이벤트시 value값이 0이면 0문자를 선택해서 다음 입력되는 숫자에 방해되지 않도록함.
   * @param e
   */
  const onFocus = (e) => {
    if (e.target.value !== '0') return
    e.target.select()
  }

  /**
   * 키입력이 Enter이면 item의 해당 값을 업데이트함.
   * @param e
   */
  const onKeyUpEnter = (e) => {
    if (e.key !== 'Enter') return
    updateItem(e)
  }

  /**
   * 입력완료시 value가 공백이면 '0'으로 입력, 공백이 아니면 Number형으로 변환하여 0이면 '0'으로 표기함.
   * @param e
   */
  const updateItem = (e) => {
    const { value, name } = e.target
    item[name] = value

    changeNow && changeNow(item[name], numberProperty)
  }

  /**
   * 초기값이 변동되어 들어 올때 이벤트 없이 처리함.
   */
  useEffect(() => {
    if (!item[numberProperty]) {
      inputRef.value = ''
      return
    }

    setVal(values)
    // inputRef.value = String(displayValue).replace(COMMAS_IN_NUMBERS, ',')
  }, [values])

  const inputUi = readOnly ? (
    <Stack sx={{ width: '100%' }} spacing={1}>
      <Typography sx={{ textAlign: 'right', color: theme.palette.text.sub }}>{val.length}/1000</Typography>
      <TextField
        readOnly
        type="text"
        size={size}
        title={title}
        value={values}
        autoComplete="off"
        placeholder={placeholder}
        name={numberProperty}
        multiline
        rows={rows}
        sx={{ width: '100%' }}
        //   InputProps={{
        //     endAdornment: <InputAdornment position="end">원</InputAdornment>
        // }}
      />
    </Stack>
  ) : (
    <Stack sx={{ width: '100%' }} spacing={1}>
      <Typography sx={{ textAlign: 'right', color: theme.palette.text.sub }}>{val.length}/1000</Typography>
      <TextField
        ref={(ref) => (inputRef = ref)}
        type="text"
        size={size}
        required={true}
        autoComplete="off"
        sx={{ width: '100%' }}
        value={val}
        disabled={disabled}
        placeholder={placeholder}
        name={numberProperty}
        rows={rows}
        onBlur={onFocusOut}
        onKeyUp={onKeyUpEnter}
        onFocus={onFocus}
        onChange={onChange}
        multiline
        inputProps={{ maxLength: maxLength }}
      />
    </Stack>
  )

  return <>{inputUi}</>
}

export default TextAreaInput
