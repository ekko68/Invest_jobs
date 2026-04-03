import { useState } from 'react'
import Button from 'components/atomic/Button'
import DatePicker, { registerLocale } from 'react-datepicker'
import ko from 'date-fns/locale/ko'
registerLocale('ko', ko)

const TermSearchForm = (props) => {
  const { searchDate, setSearchDate, getList, format = 'yyyy-MM-dd', calendar = 'day' } = props

  let termListDaily = [
    { id: 'today', label: '오늘' },
    { id: 'week', label: '1주일' },
    { id: 'days15', label: '15일' },
    { id: 'month', label: '1개월' }
  ];

  let termListMonthly = [
    { id: 'today', label: '이번달' },
    { id: 'week', label: '1개월' },
    { id: 'days15', label: '3개월' },
    { id: 'month', label: '6개월' }
  ];

  let termListYearly = [
    { id: 'today', label: '올해' },
    { id: 'week', label: '1년' },
    { id: 'days15', label: '3년' },
    { id: 'month', label: '5년' }
  ];

  const [termList, setTermList] = useState({
    active: calendar && calendar === 'day' ? 'month'
          : calendar && calendar === 'month' ? 'today'
          : calendar && calendar === 'year' ? 'today'
          : 'week',
    list: calendar && calendar === 'day' ? termListDaily
        : calendar && calendar === 'month' ? termListMonthly
        : calendar && calendar === 'year' ? termListYearly
        : termListDaily
  })

  const getLastDayOfMonth = (dateString) => {
    // dateString을 Date 객체로 변환
    const date = new Date(`${dateString}-01`);

    // 다음 달의 첫 날로 이동한 후 하루 전 날짜를 구함
    date.setMonth(date.getMonth() + 1);
    date.setDate(0);

    // 마지막 일자를 반환
    return date.getDate();
  };

  const handleTab = async (id) => {

    setTermList({
      ...termList,
      active: id
    })

    let start, end

    let today = new Date()

    // 년월(YYYY-MM)일 때, 버튼 엑션 함수
    if(calendar === 'month') {

      let subtractMonths = 0; // 뺄 달 수를 저장할 변수

      // state 값에 따라 뺄 달 수를 결정합니다.
      switch (id) {
        case 'today':
          subtractMonths = 0;
          break;
        case 'week':
          subtractMonths = 1;
          break;
        case 'days15':
          subtractMonths = 3;
          break;
        case 'month':
          subtractMonths = 6;
          break;
        default:
          subtractMonths = 0;
          return;
      }

      // 오늘 날짜 셋팅
      // 결과값을 YYYY-MM 형식으로 셋팅.
      const endYear = today.getFullYear();
      const endMonth = today.getMonth() + 1;
      const formattedEnd = `${endYear}-${endMonth.toString().padStart(2, '0')}`;
      end = new Date(formattedEnd + "-01");

      // 뺄 달 수를 적용하여 날짜를 계산
      today.setMonth(today.getMonth() - subtractMonths);
      // 결과값을 YYYY-MM 형식으로 셋팅.
      const startYear = today.getFullYear();
      const startMonth = today.getMonth() + 1;
      const formattedStart = `${startYear}-${startMonth.toString().padStart(2, '0')}`;
      const lastDay = getLastDayOfMonth(formattedStart)
      start = new Date(formattedStart + "-01");

      if (start && end) {
        setSearchDate({
          startDate: start,
          endDate: end
        })
      }

      await getList({
        searchFromDate: start,
        searchToDate: end
      })
    }

    // 년달력일 때, 버튼 엑션 함수
    else if(calendar === 'year') {
      const currentYear = today.getFullYear();

      end = new Date(currentYear + "-01-01");

      switch (id) {
        case 'today':
          start = currentYear;
          break;
        case 'week':
          start = currentYear - 1;
          break;
        case 'days15':
          start = currentYear - 3;
          break;
        case 'month':
          start = currentYear - 5;
          break;
        default:
          start = currentYear;
          break;
      }

      start = new Date(start + "-12-31")

      if (start && end) {
        setSearchDate({
          startDate: start,
          endDate: end
        })
      }

      await getList({
        searchFromDate: start,
        searchToDate: end
      })
    }

    // 년월일(디폴트)일 때, 버튼 엑션 함수
    else {
      if (id === 'today') {
        start = today
        end = today
      }

      else if (id === 'week') {
        // 오늘을 기준으로 d-7 (예: 06-08 ~ 06-02)
        let date = new Date()
        let d = date.getDate()
        end = new Date(date.setDate(d))
        start = new Date(date.setDate(end.getDate() - 6))
      }

      else if (id === 'days15') {
        // 오늘을 기준으로 d-15 (예: 06-08 ~ 05-26)
        let date = new Date()
        let d = date.getDate()
        end = new Date(date.setDate(d))
        start = new Date(date.setDate(end.getDate() - 14))
      }

      else if (id === 'month') {
        // 오늘을 기준으로 진달 d-1 (예: 06-08 ~ 05-09)
        let date = new Date()
        let d = date.getDate()
        let thisMonth = new Date(date.getFullYear(), date.getMonth() - 1, d + 1)
        end = new Date(date.setDate(d))
        start = new Date(thisMonth)
      }

      if (start && end) {
        setSearchDate({
          startDate: start,
          endDate: end
        })
      }

      await getList({
        searchFromDate: start,
        searchToDate: end
      })
    }
  }

  // datepicker handler
  const onDatePickerChange = (currentDate, type) => {
    if (type === 'start') {
      setSearchDate({
        ...searchDate,
        startDate: currentDate
      })
    } else {
      setSearchDate({
        ...searchDate,
        endDate: currentDate
      })
    }
  }

  // 검색
  const handleSearchDate = () => {
    getList()
  }

  // calendar 값이 'month'인 경우에만 showMonthYearPicker 옵션 추가
  const datePickerProps = calendar === 'month' ? { showMonthYearPicker: true } : calendar === 'year' ? {showYearDropdown : true, showYearPicker : true} : {};

  if (searchDate.startDate && searchDate.endDate) {
    return (
      <div className="term_search_form">
        <div className="date_input_wrap">
          <p className="label">기간</p>
          <div className="date_inputs">
            <DatePicker
              selected={searchDate.startDate}
              onChange={(currentDate) => onDatePickerChange(currentDate, 'start')}
              locale={ko}
              maxDate={searchDate.endDate}
              dateFormat={format}
              title={'기간조회'}
              {...datePickerProps}
            />
            <span>~</span>
            <DatePicker
              selected={searchDate.endDate}
              onChange={(currentDate) => onDatePickerChange(currentDate, 'end')}
              locale={ko}
              minDate={searchDate.startDate}
              dateFormat={format}
              title={'기간조회'}
              {...datePickerProps}
            />
          </div>
          <Button className={'btn_search full_blue'} onClick={handleSearchDate}>
            확인
          </Button>
        </div>
        <div className="tab_wrap">
          {termList.list.map((item, idx) => (
            <button
              className={`btn_tab ${termList.active === item.id ? 'active' : ''}`}
              key={'visitor_term_list_' + idx}
              onClick={() => handleTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    )
  } else {
    return <div>&nbsp;</div>
  }
}

export default TermSearchForm
