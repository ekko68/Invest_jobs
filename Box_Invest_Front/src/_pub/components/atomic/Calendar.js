/** @jsxImportSource @emotion/react */
import React, {useEffect, useState} from 'react'
import DatePicker, {registerLocale} from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {datePickerStyle} from 'assets/style/AtomicStyle'
import ko from 'date-fns/locale/ko'
import Button from "./Button";
import {subDays} from "date-fns";

registerLocale('ko', ko)

const Calendar = (props) => {
    const {date, onChangeDate, item, property, format, showMonthYearPicker = false, notFast = false, title = '', todayLimit = false, calendarChangeType = 'month', ...other} = props
    const [startDate, setStartDate] = useState(null)
    const [type, setType] = useState("month")

    useEffect(() => {
        if (date) {
            const newDate = new Date(date)
            setStartDate(newDate)
        }

        // 달력 타입 설정
        if(calendarChangeType === 'year') setType('year') // 날짜 수정 버튼이 월단위로 표시
        else setType('month') // 기본 값은 월단위 표시
    }, [])

    useEffect(() => {
        if (date) {
            const newDate = new Date(date)
            setStartDate(newDate)
        }
    }, [date])

    const setNotFast = (date) => {
        const present = new Date();
        return (new Date(date) <= present);
    }

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
    return (
        <DatePicker
            title={title}
            selected={startDate}
            onChange={(currentDate) => onDatePickerChange(currentDate)}
            css={datePickerStyle}
            filterDate={notFast ? setNotFast : null}
            maxDate={todayLimit ? new Date() : false}
            locale={ko}
            dateFormat={getDateFormat()}
            showMonthYearPicker={showMonthYearPicker}
            {...other}
            renderCustomHeader={

                type === 'year' ?
                    ({date, prevYearButtonDisabled, nextYearButtonDisabled, decreaseYear, increaseYear }) => (
                        <CustomHeader date={date} type={type} prevYearButtonDisabled={prevYearButtonDisabled} nextYearButtonDisabled={nextYearButtonDisabled} decreaseYear={decreaseYear} increaseYear={increaseYear} />
                    )
                :
                    ({date, prevMonthButtonDisabled, nextMonthButtonDisabled, decreaseMonth, increaseMonth }) => (
                        <CustomHeader date={date} type={type} prevMonthButtonDisabled={prevMonthButtonDisabled} nextMonthButtonDisabled={nextMonthButtonDisabled} decreaseMonth={decreaseMonth} increaseMonth={increaseMonth} />
                    )
            }
        />
    )
}

const CustomHeader = (data) => {

    const {
        date,
        type,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
        decreaseMonth,
        increaseMonth,
        prevYearButtonDisabled,
        nextYearButtonDisabled,
        decreaseYear,
        increaseYear,
    } = data;

    const getHeaderFormatDate = () => {
        const customDate = new Date(date);

        const year = customDate.getFullYear();
        const month = `0${customDate.getMonth() + 1}`.slice(-2);

        return `${year}년 ${month}월`;
    }

    return (
        <div className="datepicker_custom_header">
            {
                type === 'year' ?
                    <>
                        <button aria-disabled={prevYearButtonDisabled} onClick={decreaseYear} className="prev_btn">
                            prev
                        </button>
                        <div className="datepicker_y_m">
                            <p>{getHeaderFormatDate()}</p>
                        </div>
                        <button aria-disabled={nextYearButtonDisabled} onClick={increaseYear} className="next_btn">
                            next
                        </button>
                    </>
                :
                    <>
                        <button aria-disabled={prevMonthButtonDisabled} onClick={decreaseMonth} className="prev_btn">
                            prev
                        </button>
                        <div className="datepicker_y_m">
                            <p>{getHeaderFormatDate()}</p>
                        </div>
                        <button aria-disabled={nextMonthButtonDisabled} onClick={increaseMonth} className="next_btn">
                            next
                        </button>
                    </>
            }
        </div>
    )
}

export default Calendar
