import { useEffect, useRef, useState, useContext, useLayoutEffect } from 'react'
import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import Toggle from 'components/Toggle'
import PopupConfirm from 'components/PopupConfirm'
import Select from 'components/atomic/Select'
import { FileDownloadOutlined, DoDisturbOnOutlined } from '@mui/icons-material'
import DatePicker, { registerLocale } from 'react-datepicker'
import ko from 'date-fns/locale/ko'
import TextInput from 'components/atomic/TextInput'
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'

const Admin_Accept_InvestBusiness = (props) => {
  const { selectListSort, onSelectActive } = props

  const searchSelectSort = useRef(null)
  const defaultSelectSort = {
    active: 'search00',
    list: [
      { id: 'search00', value: 'search00', label: '선택' },
      { id: 'searchCode', value: 'searchCode', label: '공고코드' },
      { id: 'searchMan', value: 'searchMan', label: '등록자' },
      { id: 'searchDate', value: 'searchDate', label: '등록일' }
    ]
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
    <PageLayout currentMenu={'invest'} currentCate={'investUser'} currentPage={'bannerList'}>
      <div className="content_inner page_invest_user page_invest_view">
        <div className="page_header">
          <h4 className="page_title">출자사업 공고 등록</h4>
        </div>
        {/*table_wrap start*/}
        <div className="table_wrap">
          <table className="table form_table bg_none border_none">
            <caption>
              구분, 제목, 출자사업명, 공고일자, 대표 연락처, 내용, 파일첨부, 상태 정보를 나타내는 테이블
            </caption>
            <colgroup>
              <col width={'18%'} />
              <col width={'32%'} />
              <col width={'18%'} />
              <col width={'32%'} />
            </colgroup>
            <tbody>
              <tr>
                <th className={'ta_left'}>
                  <span className="require" aria-label="필수 요소" />
                  구분
                </th>
                <td colSpan={3}>
                  <Select
                    className="select_sort"
                    optionList={selectListSort ? selectListSort : defaultSelectSort}
                    handleSelectActive={onSelectActive}
                    ref={searchSelectSort}
                  />
                </td>
              </tr>
              <tr>
                <th className={'ta_left'}>
                  <span className="require" aria-label="필수 요소" />
                  제목
                </th>
                <td colSpan={3}>
                  <TextInput title="제목" placeholder="제목을 입력하세요." value={''} onChange={() => {}} />
                </td>
              </tr>
              <tr>
                <th className={'ta_left'}>
                  <span className="require" aria-label="필수 요소" />
                  출자사업명
                </th>
                <td colSpan={3}>
                  <TextInput title="출자사업명" placeholder="출자사업명을 입력하세요." value={''} onChange={() => {}} />
                </td>
              </tr>
              <tr>
                <th className={'ta_left'}>
                  <span className="require" aria-label="필수 요소" />
                  공고일자
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
                  </div>
                </td>
                <th className={'ta_left'}>
                  <span className="require" aria-label="필수 요소" />
                  제안서 접수마감일
                </th>
                <td>
                  <div className="period_calendar">
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
                <th className={'ta_left'}>
                  <span className="require" aria-label="필수 요소" />
                  대표 연락처
                </th>
                <td colSpan={3}>
                  <TextInput title="연락처" placeholder="연락처을 입력하세요." value={''} onChange={() => {}} />
                </td>
              </tr>
              <tr>
                <th className={'ta_left'}>
                  <span className="require" aria-label="필수 요소" />
                  지원분야
                </th>
                <td colSpan={3}>
                  <div className="inner_table_wrap">
                    <table className="inner_table">
                      <colgroup>
                        <col width="10%" />
                        <col width="" />
                        <col width="30%" />
                        <col width="20%" />
                      </colgroup>
                      <tbody>
                        <tr>
                          <th scope="col">구분</th>
                          <th scope="col">지원분야</th>
                          <th scope="col">IBK출자금액(억원)</th>
                          <th scope="col">선정운용사수</th>
                        </tr>
                        <tr>
                          <td className="center">1</td>
                          <td>
                            <div className="td_inner">
                              <TextInput title="지원분야" value={''} onChange={() => {}} />
                              <Button className="outline_blue">찾기</Button>
                            </div>
                          </td>
                          <td>
                            <TextInput title="지원분야" value={''} onChange={() => {}} />
                          </td>
                          <td>
                            <TextInput title="지원분야" value={''} onChange={() => {}} />
                          </td>
                        </tr>
                        <tr>
                          <td className="center">2</td>
                          <td>
                            <div className="td_inner">
                              <TextInput title="지원분야" value={''} onChange={() => {}} />
                              <Button className="outline_blue">찾기</Button>
                            </div>
                          </td>
                          <td>
                            <TextInput title="지원분야" value={''} onChange={() => {}} />
                          </td>
                          <td>
                            <TextInput title="지원분야" value={''} onChange={() => {}} />
                          </td>
                        </tr>
                        <tr>
                          <td className="td_add_row" colSpan={4}>
                            <button type="button" className="button_add_row">
                              행 추가 +
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>

              <tr>
                <th className={'ta_left'}>
                  <span className="require" aria-label="필수 요소" />
                  내용
                </th>
                <td colSpan={3}>
                  <textarea className="textarea textarea_h200" maxLength={''} id="" title="내용" />
                </td>
              </tr>

              <tr>
                <th className={'ta_left'}>파일첨부</th>
                <td colSpan={3}>
                  <div className="attach_area">
                    <PlaylistAddIcon color="secondary" />
                    파일을 드래그해서 올려 놓거나, 파일추가를 통해 파일을 등록하세요.
                  </div>
                  {/* s: 업로드 후 */}
                  <ul className="fileAttach_list">
                    <li className="fileAttach_item">
                      <button type="button" className="fileAttach_download">
                        위탁운용사_선정계획_공고.pdf
                      </button>
                      <Button className={'fileAttach_delete_button'} aria-label="삭제" onClick={() => {}}>
                        <DoDisturbOnOutlined />
                      </Button>
                    </li>
                    <li className="fileAttach_item">
                      <button type="button" className="fileAttach_download">
                        선정요건.pdf
                      </button>
                      <Button className={'fileAttach_delete_button'} aria-label="삭제" onClick={() => {}}>
                        <DoDisturbOnOutlined />
                      </Button>
                    </li>
                  </ul>
                  {/* e:: 업로드 후 */}
                  <div className="attach_area_guide">
                    <Button className={'grayLine2'} onClick={() => {}}>
                      파일첨부
                    </Button>
                    <div className="attach_area_guide_text">
                      <span className="star">*</span> pptx, doc, docx, hwp, pdf 100MB 이내
                    </div>
                  </div>
                </td>
              </tr>

              <tr>
                <th className={'ta_left'}>상태</th>
                <td>
                  <Toggle
                    className="pale_blue"
                    data={{
                      id: `invest_toggle_10`,
                      value: '',
                      status: true
                    }}
                    onChange={() => {}}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        {/*table_wrap end*/}
        <div className="rounded_btn_group">
          <Button className={'basic'} onClick={() => {}}>
            목록
          </Button>
          <Button className={'full_blue'} onClick={() => {}}>
            저장
          </Button>
        </div>
      </div>
    </PageLayout>
  )
}

export default Admin_Accept_InvestBusiness
