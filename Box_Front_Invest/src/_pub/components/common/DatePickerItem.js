import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { BtContentGrid } from 'components/bt/BtContentGrid'
import dayjs from 'dayjs'
import { useCallback } from 'react'

const DatePickerItem = (props) => {
  const {
    item,
    numberProperty = 'name',
    readOnly,
    values,
    format,
    changeNow,
    // displayValue,
    disabled,
    placeholder = '',
    title = '',
    requiredChk
  } = props

  /**
   * 입력완료시 value가 공백이면 '0'으로 입력, 공백이 아니면 Number형으로 변환하여 0이면 '0'으로 표기함.
   * @param e
   */
  const updateItem = useCallback(
    (newVal) => {
      let val = dayjs(newVal).format('YYYY-MM-DD')
      item[numberProperty] = val
    },
    [item]
  )

  const inputUi = readOnly ? (
    <BtContentGrid gridXs={6} title={title}>
      <DatePicker
        value={values}
        format={format}
        name={numberProperty}
        slotProps={{ textField: { size: 'small' } }}
        sx={{ width: '100%' }}
      />
    </BtContentGrid>
  ) : (
    <BtContentGrid gridXs={6} title={title} required={requiredChk}>
      <DatePicker
        value={values}
        sx={{ width: '100%' }}
        format={format}
        name={numberProperty}
        onFocus={(newVal) => updateItem(newVal)}
        onChange={(newVal) => updateItem(newVal)}
        onBlur={(newVal) => updateItem(newVal)}
        onKeyUp={(newVal) => updateItem(newVal)}
        disabled={disabled}
        // ref={(ref) => (inputRef = ref)}
        slotProps={{ textField: { size: 'small' } }}
      />
    </BtContentGrid>
  )
  return <>{inputUi}</>
}

export default DatePickerItem
