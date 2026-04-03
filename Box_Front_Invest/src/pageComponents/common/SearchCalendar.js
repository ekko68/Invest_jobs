/** @jsxImportSource @emotion/react */
import React, { useEffect, useState, forwardRef, useImperativeHandle, useRef } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { datePickerStyle } from 'assets/style/AtomicStyle'
import ko from 'date-fns/locale/ko'
registerLocale('ko', ko)
const SearchCalendar = forwardRef((props, ref) => {
  const { date, onChangeDate, item, property, format, showMonthYearPicker = false, notFast = false, title='', ...other } = props
  const [startDate, setStartDate] = useState(null)
  let datePickerRef = useRef()
  useImperativeHandle(ref, () => ({
    reset
  }))
  const reset = () => {
    datePickerRef.clear()
  }
  useEffect(() => {
    if (date) {
      const newDate = new Date(date)
      setStartDate(newDate)
    }
  }, [])
  useEffect(() => {
    if (date) {
      const newDate = new Date(date)
      setStartDate(newDate)
    }
  }, [date])
  const onDatePickerChange = (currentDate) => {
    setStartDate(currentDate)
    if (onChangeDate) {
      onChangeDate(currentDate, item, property)
    }
  }
  const getDateFormat = () => {
    if (format) {
      return format
    }
    if (showMonthYearPicker) {
      return 'yyyy-MM'
    }
    return 'yyyy-MM-dd'
  }

  const setNotFast = (date) => {
    const present = new Date();
    return (new Date(date) <= present);
  }

  return (
    <DatePicker
        // popperPlacement='bottom-start'
        // popperModifiers={[
        //   {
        //     name: 'preventOverflow',
        //     options: {
        //       boundary: 'viewport',
        //       escapeWithReference: true,
        //       padding: 10
        //     }
        //   },
        //   {
        //     name: 'flip',
        //     enabled: false
        //   },
        // ]}
      ref={(ref) => (datePickerRef = ref)}
      selected={startDate}
      onChange={(currentDate) => onDatePickerChange(currentDate)}
      filterDate={notFast ? setNotFast : null}
      css={datePickerStyle}
      locale={ko}
      dateFormat={getDateFormat()}
      showMonthYearPicker={showMonthYearPicker}
      title={title}
      {...other}
      renderCustomHeader={({
                             date,
                             prevMonthButtonDisabled,
                             nextMonthButtonDisabled,
                             decreaseMonth,
                             increaseMonth
                           }) => (
          <CustomHeader
              date={date}
              prevMonthButtonDisabled={prevMonthButtonDisabled}
              nextMonthButtonDisabled={nextMonthButtonDisabled}
              decreaseMonth={decreaseMonth}
              increaseMonth={increaseMonth}
          />
      )}
    />
  )
});

const CustomHeader = (data) => {

  const {
    date,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
    decreaseMonth,
    increaseMonth,
  } = data;

  const getHeaderFormatDate = () => {
    const customDate = new Date(date);

    const year = customDate.getFullYear();
    const month = `0${customDate.getMonth() + 1}`.slice(-2);

    return `${year}년 ${month}월`;
  }

  return (
      <div className="datepicker_custom_header">
        <button aria-disabled={prevMonthButtonDisabled} onClick={decreaseMonth} className="prev_btn">
          prev
        </button>
        <div className="datepicker_y_m">
          <p>{getHeaderFormatDate()}</p>
        </div>
        <button aria-disabled={nextMonthButtonDisabled} onClick={increaseMonth} className="next_btn">
          next
        </button>
      </div>
  )
}

export default SearchCalendar;
