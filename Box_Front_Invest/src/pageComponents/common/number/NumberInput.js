import React, { useEffect, useRef } from 'react'
import {FormatUtils} from "modules/utils/StringUtils";
import {isNumber, limitNumberSet} from "modules/utils/NumberUtils";

const NumberInput = (props) => {
  const {
    item,
    numberProperty = 'amount',
    readOnly,
    size,
    maxLength,
    changeNow,
    displayValue,
    placeholder = '',
    title = ''
  } = props

  let inputRef = useRef()

  const NUM_REGEX = {
    NOT_NUMBER: /[^-.0-9]/gi,
    ONLY_NUM: /\D/gm
  }

  const numberCommaFormat = FormatUtils.numberWithCommas;

  /**
   * 입력값 변경시 콤마가 추가된 숫자만 표기하고 item의 해당되는 값에는 숫자값만 입력함.
   * @param e
   */
  const onChange = (e) => {
    const { value, name } = e.target
    let val = value.replace(NUM_REGEX.NOT_NUMBER, '');

    if(val.length > 0 && !(val.indexOf('.') == val.length - 1 || val == '-')) {
      val = isNumber(val) ? limitNumberSet(val) : 0;
      if(isNumber(maxLength) && val.length > maxLength) val = val.substring(0, maxLength);
    }

    e.target.value = val;
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
   * 초기값 입력시 null일때 0으로 입력, 숫자값일때 콤마를 찍어줌.
   * @returns {string}
   */
  const defaultValue = () => {
    if (!item[numberProperty]) {
      return '0'
    }

    const r = numberCommaFormat.format(item[numberProperty]);
    return r
  }

  /**
   * 입력완료시 value가 공백이면 '0'으로 입력, 공백이 아니면 Number형으로 변환하여 0이면 '0'으로 표기함.
   * @param e
   */
  const updateItem = (e) => {
    const { value, name } = e.target;
    if (value === '') {
      e.target.value = '0'
      item[name] = 0
      changeNow && changeNow()
      return
    }

    item[name] = Number(e.target.value);
    e.target.value = numberCommaFormat.format(e.target.value);
    changeNow && changeNow()
  }

  /**
   * 초기값이 변동되어 들어 올때 이벤트 없이 처리함.
   */
  useEffect(() => {
    if (!displayValue) {
      inputRef.value = '0'
      return
    }
    // inputRef.value = String(displayValue).replace(COMMAS_IN_NUMBERS, ',')
    inputRef.value = numberCommaFormat.format(displayValue);
  }, [displayValue])

  const inputUi = readOnly ? (
    <input
      type="text"
      className="input text_right"
      autoComplete="off"
      placeholder={placeholder}
      value={defaultValue()}
      name={numberProperty}
      size={size}
      readOnly
      title={title}
    />
  ) : (
    <input
      ref={(ref) => (inputRef = ref)}
      type="text"
      className="input text_right"
      autoComplete="off"
      placeholder={placeholder}
      defaultValue={defaultValue()}
      name={numberProperty}
      onChange={onChange}
      onBlur={onFocusOut}
      onKeyUp={onKeyUpEnter}
      onFocus={onFocus}
      size={size}
      maxLength={maxLength}
      title={title}
    />
  )

  return <>{inputUi}</>
}

export default NumberInput
