import { TextField, InputAdornment } from '@mui/material'
import { BtContentGrid } from 'components/bt/BtContentGrid'
import { useEffect, useRef, useLayoutEffect, useState } from 'react'

const TextFieldInput = (props) => {
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
    title = ''
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
    if (numberProperty === 'rcmdEnprBzn') {
      handleBusiNum(e.target.value.replace(reg, ''))
    } else if (
      numberProperty === 'rsprCnplTpn' ||
      numberProperty === 'chrgAudofirRsprCnplTpn' ||
      numberProperty === 'contactAudofirRsprCnplTpn'
    ) {
      handlePhoneNum(e.target.value.replace(reg, ''))
    } else {
      setVal(e.target.value.replace(reg, ''))
    }

    // updateItem(e)
  }

  /**
   * 사업자 번호 하이픈 입력
   * @param {*} e
   */
  const handleBusiNum = (val) => {
    const regex = /^[0-9]*$/
    const num = val.replace(/-/g, '', '')
    if (regex.test(num) && val.length < 13 && num.length < 11) {
      setVal(isBusiFormat(num))
    }
  }
  const isBusiFormat = (busiNum) => {
    return busiNum.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3')
  }

  /**
   * 전화번호 하이픈 입력
   * @param {*} e
   * @param {*} item
   * @returns
   */
  const handlePhoneNum = (val) => {
    const regex = /^[0-9]*$/
    const num = val.replace(/-/g, '', '')
    if (regex.test(num) && val.length < 14 && num.length < 12) {
      let formatRes = isTelFormat(num)

      setVal(formatRes)
    }
  }

  // /* 휴대폰 formating function */
  const isTelFormat = (tel) => {
    if (tel.length === 3) {
      return tel.replace(/(\d{3})/, '$1-')
    } else if (tel.length === 7) {
      return tel.replace(/(\d{3})(\d{4})/, '$1-$2')
    } else if (tel.length === 11) {
      //000-0000-0000
      return tel.replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
    }
    return tel
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
    <TextField
      readOnly
      type="text"
      size={size}
      title={title}
      value={values}
      autoComplete="off"
      placeholder={placeholder}
      name={numberProperty}
      sx={{ width: '100%' }}
      InputProps={
        (numberProperty === 'manageHnfInfoTotCo' && {
          endAdornment: <InputAdornment position="end">명</InputAdornment>
        }) ||
        (numberProperty === 'manageHnfInfoHnf' && {
          endAdornment: <InputAdornment position="end">명</InputAdornment>
        }) ||
        (numberProperty === 'opratnHnfInfoTotCo' && {
          endAdornment: <InputAdornment position="end">명</InputAdornment>
        }) || 
        ((numberProperty === 'cntnncPdyy' || numberProperty === 'invtPdyy') && {
          endAdornment: <InputAdornment position="end">년</InputAdornment>
        })
      }
    />
  ) : (
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
      onBlur={onFocusOut}
      onKeyUp={onKeyUpEnter}
      onFocus={onFocus}
      onChange={onChange}
      inputProps={{ maxLength: maxLength }}
      InputProps={
        (numberProperty === 'manageHnfInfoTotCo' && {
          endAdornment: <InputAdornment position="end">명</InputAdornment>
        }) ||
        (numberProperty === 'manageHnfInfoHnf' && {
          endAdornment: <InputAdornment position="end">명</InputAdornment>
        }) ||
        (numberProperty === 'opratnHnfInfoTotCo' && {
          endAdornment: <InputAdornment position="end">명</InputAdornment>
        }) || 
        ((numberProperty === 'cntnncPdyy' || numberProperty === 'invtPdyy') && {
          endAdornment: <InputAdornment position="end">년</InputAdornment>
        })
      }
    />
  )

  return <>{inputUi}</>
}

export default TextFieldInput
