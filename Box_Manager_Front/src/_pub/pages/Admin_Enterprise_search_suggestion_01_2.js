import { useState } from 'react'
import Button from 'components/atomic/Button'
import DatePicker, { registerLocale } from 'react-datepicker'
import Radio from 'components/atomic/Radio'
import ko from 'date-fns/locale/ko'

const Admin_Enterprise_search_suggestion_01_2 = (props) => {
  const { value } = props

  const [date1, setDate1] = useState({
    startDate: null,
    endDate: null
  })

  const [date2, setDate2] = useState({
    startDate: null,
    endDate: null
  })
  // ===== datepicker
  const onChangeDate = (currentDate, type, type2) => {
    // type: 신청기간인지 진행기간인지, type2: 시작일인지 종료일인지
    if (type === 'date1') {
      type2 === 'start'
        ? (setDate1({
            ...date1,
            startDate: currentDate
          }),
          setForm({
            ...form,
            enlsSldyTs: currentDate
          }))
        : (setDate1({
            ...date1,
            endDate: currentDate
          }),
          setForm({
            ...form,
            enlsCldyTs: currentDate
          }))
    } else {
      type2 === 'start'
        ? (setDate2({
            ...date2,
            startDate: currentDate
          }),
          setForm({
            ...form,
            evntStdyTs: currentDate
          }))
        : (setDate2({
            ...date2,
            endDate: currentDate
          }),
          setForm({
            ...form,
            evntFndaTs: currentDate
          }))
    }
  }

  const typeRadioList = [
    { id: 'publicY', value: '공개', name: 'public' },
    { id: 'publicN', value: '비공개', name: 'public' }
  ]

  return (
    <div className="popup_wrap popup_enterprise">
      <div className="layer">&nbsp;</div>
      <div className="popup_container">
        <div className="popup_content scroll">
          <div className="popup_main_header">
            <div className="title">추천 검색어 관리</div>
            <Button className="popup_close_button" aria-label="팝업 닫기" onClick={() => {}} />
          </div>

          <div className={'search_table_wrap'}>
            <table className="table_search">
              <caption>공개, 검색어, 기간 관리 테이블 </caption>
              <colgroup>
                <col width={'15%'} />
                <col width={'*'} />
              </colgroup>
              <tbody>
                <tr>
                  <th>
                    {' '}
                    <span className="require" aria-label="필수 요소" />
                    공개
                  </th>

                  <td>
                    {typeRadioList.map((radio) => (
                      <Radio key={radio.id} radio={radio} name={radio.name} onChange={() => {}} />
                    ))}
                  </td>
                </tr>

                <tr>
                  <th>
                    <span className="require" aria-label="필수 요소" />
                    검색어
                  </th>
                  <td>
                    <input
                      name={''}
                      type="text"
                      className="input"
                      value={value}
                      defaultValue={value}
                      title={'검색어'}
                      placeholder={'검색어를 입력해주세요'}
                    />
                  </td>
                </tr>
                <tr>
                  <th>
                    <span className="require" aria-label="필수 요소" />
                    기간
                  </th>
                  <td>
                    <div className="period_calendar">
                      <DatePicker
                        selected={date1.startDate ? date1.startDate : null}
                        onChange={(currentDate) => onChangeDate(currentDate, 'date1', 'start')}
                        locale={ko}
                        dateFormat={'yyyy-MM-dd'}
                        maxDate={date1.endDate ? date1.endDate : null}
                        title={'기간조회'}
                      />
                      <span className="datepicker_dash">~</span>
                      <DatePicker
                        selected={date1.endDate ? date1.endDate : null}
                        onChange={(currentDate) => onChangeDate(currentDate, 'date1', 'end')}
                        locale={ko}
                        dateFormat={'yyyy-MM-dd'}
                        minDate={date1.startDate ? date1.startDate : null}
                        title={'기간조회'}
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="rounded_btn_group">
            <Button className={'basic'} onClick={() => {}}>
              삭제
            </Button>
            <Button className={'full_blue'} onClick={() => {}}>
              등록
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin_Enterprise_search_suggestion_01_2
