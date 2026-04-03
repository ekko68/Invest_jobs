import React, { useEffect, useState } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { datePickerStyle } from 'assets/style/AtomicStyle'
import ko from 'date-fns/locale/ko'

registerLocale('ko', ko)

const CalendarWithRange = (props) => {
    const { startDate, endDate, onChangeDate, item, property, format, rangeType = null, ...other } = props
    const [start, setStart] = useState(null)
    const [end, setEnd] = useState(null);

    useEffect(() => {
        if (startDate) {
            const start = new Date(startDate)
            setStart(start)
        } else {
            setStart(new Date());
        }
        if (endDate) {
            const end = new Date(endDate)
            setEnd(end);
        } else {
            setEnd(new Date());
        }
    }, [])

    useEffect(() => {
        if (startDate) {
            const start = new Date(startDate)
            setStart(start)
        }
    }, [startDate])

    useEffect(() => {
        if(endDate) {
            const end = new Date(endDate);
            setEnd(end);
        }
    }, [endDate])

    const onDatePickerChange = (currentDate) => {
        if(rangeType === CalendarRange.START) {
            setStart(currentDate);
        }
        else if(rangeType === CalendarRange.END) {
            setEnd(currentDate);
        }
        if (onChangeDate) {
            onChangeDate(currentDate, item, property);
        }
    }

    const getDateFormat = () => {
        if (format) {
            return format;
        }
        return 'yyyy-MM-dd';
    }

    const rangeCalendarRender = () => {
        if(rangeType === null) {
            return <></>
        }
        else if(rangeType === CalendarRange.START) {
            return (
                <DatePicker
                    selected={start}
                    selectsStart
                    startDate={start}
                    endDate={end}
                    maxDate={end}
                    onChange={(currentDate) => onDatePickerChange(currentDate)}
                    css={datePickerStyle}
                    locale={ko}
                    dateFormat={getDateFormat()}
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
        }
        else if(rangeType === CalendarRange.END) {
            return (
                <DatePicker
                    selected={end}
                    selectsEnd
                    startDate={start}
                    endDate={end}
                    minDate={start}
                    onChange={(currentDate) => onDatePickerChange(currentDate)}
                    // css={datePickerStyle}
                    locale={ko}
                    dateFormat={getDateFormat()}
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
        }
        else {
            return <></>
        }
    }

    return rangeCalendarRender();
}

const CalendarRange = {
    START: 'START',
    END: 'END'
}

export {CalendarRange}

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

export default CalendarWithRange
