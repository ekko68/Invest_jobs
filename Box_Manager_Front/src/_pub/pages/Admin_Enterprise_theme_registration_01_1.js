import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import PopupConfirm from 'components/PopupConfirm'
import { useState } from 'react'
import { fileDownloadMkt } from 'modules/utils/CommonUtils'
import Radio from 'components/atomic/Radio'
import TextInput from 'components/atomic/TextInput'
import ExEnterpriseItemList from 'components/ExEnterpriseItemList'
import DatePicker, { registerLocale } from 'react-datepicker'
import ko from 'date-fns/locale/ko'

const Admin_Enterprise_theme_registration_01_1 = (props) => {
  const { items = [] } = props

  const typeRadioList = [
    { id: 'publicY', value: '공개', name: 'public' },
    { id: 'publicN', value: '비공개', name: 'public' }
  ]

  // ===== 파일 다운로드
  const handleFileDownload = async (file) => {
    await fileDownloadMkt(file)
  }
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
  return (
    <PageLayout currentMenu={'commerce'} currentCate={'main'} currentPage={'bannerList'}>
      <div className="content_inner page_main">
        <div className="page_header">
          <h4 className="page_title">테마기업관리</h4>
        </div>
        {/*table_wrap start*/}
        <div className="table_wrap">
          <table className="table form_table bg_none border_none">
            <caption>공개여부, 테마명, 설명, 기간선택, 기업검색 및 삭제 입력 테이블</caption>
            <colgroup>
              <col width={'13%'} />
              <col width={'*'} />
            </colgroup>
            <tbody>
              <tr className="tr_radio">
                <th className={'ta_left bg_light_grey'}>
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
                <th className={'ta_left th_length'}>
                  <span className="require" aria-label="필수 요소" />
                  테마명
                </th>
                <td>
                  <TextInput title="테마명" placeholder="테마명을 입력하세요." value={''} onChange={() => {}} />
                </td>
              </tr>
              <tr>
                <th className={'ta_left th_length'}>
                  <span className="require" aria-label="필수 요소" />
                  설명
                </th>
                <td>
                  <TextInput
                    title="테마설명"
                    placeholder="테마에 대한 설명을 입력하세요."
                    value={''}
                    onChange={() => {}}
                  />
                </td>
              </tr>

              <tr>
                <th className={'ta_left'}>
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
              <tr>
                <th className={'ta_left th_length'}>
                  <span className="require" aria-label="필수 요소" />
                  기업
                </th>
                <td>
                  <div className="enterprise_box">
                    <div className="enterprise_box_button_group">
                      <Button className={'full_grey_dark'} onClick={() => {}}>
                        삭제
                      </Button>

                      <Button className={'full_blue'} onClick={() => {}}>
                        기업 검색
                      </Button>
                    </div>
                    {/* case1 테이터 없는 경우 */}
                    {/* <div className="no_data">테이터가 없습니다.</div> */}
                    {/* case2 테이터 있는 경우 */}
                    <ExEnterpriseItemList items={[0, 1, 2, 3, 4, 5]} />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/*table_wrap end*/}
        <div className="rounded_btn_group">
          <Button className={'basic'} onClick={() => {}}>
            취소
          </Button>
          <Button className={'full_blue'} onClick={() => {}}>
            등록
          </Button>
        </div>
      </div>
    </PageLayout>
  )
}

export default Admin_Enterprise_theme_registration_01_1
