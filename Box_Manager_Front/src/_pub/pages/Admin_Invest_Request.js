import { useEffect, useRef, useState, useContext, useLayoutEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import Select from 'components/atomic/Select'
import ExInvestTableNew from 'pageComponents/commerce/main/ExInvestTableNew'
import Pagination from 'components/Pagination'

import PopupAlert from 'components/PopupAlert'
import { MktContext } from 'modules/common/MktContext'
import { UserContext } from 'modules/common/UserContext'
import * as mainFn from 'modules/fns/mkt/mainFn'
import DatePicker, { registerLocale } from 'react-datepicker'
import ko from 'date-fns/locale/ko'

// const [searchDate, setSearchDate] = useState({
//   startDate: new Date(),
//   endDate: new Date()
// })

const Admin_Invest_Request = (props) => {
  const { selectList, selectListResult, selectListSort, onSelectActive, value } = props

  const searchSelect = useRef(null)
  const searchSelectResult = useRef(null)
  const searchSelectSort = useRef(null)
  const defaultSelect = {
    active: 'statusContent',
    list: [
      { id: 'statusContent', value: 'searchContent', label: '전체' },
      { id: 'statusWaiting', value: 'statusWaiting', label: '심사중' }
    ]
  }
  const defaultSelectResult = {
    active: 'resultContent',
    list: [
      { id: 'resultContent', value: 'resultContent', label: '전체' },
      { id: 'resultWaiting', value: 'resultWaiting', label: '결과완료' }
    ]
  }
  const defaultSelectSort = {
    active: 'sortContent',
    list: [
      { id: 'sortContent', value: 'sortContent', label: '신청일순' },
      { id: 'sortWaiting', value: 'sortWaiting', label: '신청일순2' }
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
  const mktContext = useContext(MktContext)
  const userContext = useContext(UserContext)
  const history = useHistory()
  const location = useLocation()
  let path = location.pathname
  let page = path.split('/')[1]

  const [dataList, setDataList] = useState(null)
  const [paging, setPaging] = useState(null)
  // 탭
  const tabList = {
    active: mktContext.state.currType,
    list: [
      { id: 'webMain', label: '웹 메인' },
      { id: 'MobileMain', label: '모바일 메인' }
    ]
  }
  const [maximumAlert, setMaximumAlert] = useState(false)

  // ===== 탭
  const handleTab = async (selected) => {
    mktContext.actions.handleSetBannerCurrType(selected)
  }
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
  // ===== 검색필터 : 전체, 공개, 대기, 종료
  const filterSelect = useRef(null)

  const onFilterActive = async (selected) => {
    mktContext.actions.handleSetBannerParam({
      page: 1,
      statusCode: selected
    })
  }

  // ===== 페이징
  const handlePaging = (param) => {
    let params = {
      ...mktContext.state.bannerParam,
      ...param
    }
    mktContext.actions.handleSetBannerParam(params)
  }

  // ===== reset
  const handleReset = () => {
    mktContext.actions.handleSetBannerCurrType('webMain')
  }

  useLayoutEffect(() => {
    if ('webMain' !== userContext.state.category) {
      userContext.actions.setCategory('webMain')
      handleReset()
    }
  }, [userContext.state.category])

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'main'} currentPage={'bannerList'}>
      <div className="content_inner page_main">
        <div className="page_header">
          <h4 className="page_title">투자희망신청현황</h4>
        </div>
        <div className="commerce_banner_wrap">
          <div className={'maximum_notice'}>
            <p className="highlight_grey">투자유치를 희망하는 사업의 신청 내역입니다.</p>
          </div>
          <div className={'search_table_wrap'}>
            <table className="table_search">
              <caption>투자 희망 신청 검색 테이블</caption>
              <colgroup>
                <col width={'15%'} />
                <col width={'31.2%'} />
                <col width={'15%'} />
                <col width={'*'} />
              </colgroup>
              <tbody>
                <tr>
                  <th>신청일자</th>
                  <td colSpan={3}>
                    {/* disabled 상태일 때
                    1.  period_calendar 에 disabled 추가 
                    2. DatePicker 에 disabled 추가 */}
                    <div className="period_calendar disabled">
                      <DatePicker
                        selected={date1.startDate ? date1.startDate : null}
                        onChange={(currentDate) => onChangeDate(currentDate, 'date1', 'start')}
                        locale={ko}
                        dateFormat={'yyyy-MM-dd'}
                        maxDate={date1.endDate ? date1.endDate : null}
                        title={'기간조회'}
                        disabled={true}
                      />
                      <span>~</span>
                      <DatePicker
                        selected={date1.endDate ? date1.endDate : null}
                        onChange={(currentDate) => onChangeDate(currentDate, 'date1', 'end')}
                        locale={ko}
                        dateFormat={'yyyy-MM-dd'}
                        minDate={date1.startDate ? date1.startDate : null}
                        title={'기간조회'}
                        disabled={true}
                      />
                    </div>
                    <div className="tab_wrap">
                      {/* 선택된 날짜버튼 date 에 active 클래스 추가  */}
                      <button className={`btn_tab active`}>전체</button>
                      <button className={`btn_tab`}>1개월</button>
                      <button className={`btn_tab`}>3개월</button>
                      <button className={`btn_tab`}>6개월</button>
                      <button className={`btn_tab`}>기간선택</button>
                    </div>
                  </td>
                </tr>

                <tr>
                  <th>관리번호</th>
                  <td>
                    <input
                      name={''}
                      type="text"
                      className="input"
                      value={value}
                      defaultValue={value}
                      title={'관리번호 입력'}
                      placeholder={'관리번호 입력'}
                    />
                  </td>
                  <th>기업명</th>
                  <td>
                    <input
                      name={''}
                      type="text"
                      className="input"
                      value={value}
                      defaultValue={value}
                      title={'기업명 입력'}
                      placeholder={'기업명 입력'}
                    />
                  </td>
                </tr>

                <tr>
                  <th>사업자번호</th>
                  <td>
                    <input
                      name={''}
                      type="text"
                      className="input"
                      value={value}
                      defaultValue={value}
                      title={'사업자번호 입력'}
                      placeholder={'사업자번호 입력'}
                    />
                  </td>
                  <th>상태</th>
                  <td>
                    <Select
                      optionList={selectList ? selectList : defaultSelect}
                      handleSelectActive={onSelectActive}
                      ref={searchSelect}
                    />
                  </td>
                </tr>

                <tr>
                  <th>심사결과</th>
                  <td>
                    <Select
                      optionList={selectListResult ? selectListResult : defaultSelectResult}
                      handleSelectActive={onSelectActive}
                      ref={searchSelectResult}
                    />
                  </td>
                  <td colSpan={2}></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="button_bottom_group">
            <Button className={'basic'} onClick={() => {}}>
              초기화
            </Button>
            <Button className={'full_blue_deep'} onClick={() => {}}>
              조회
            </Button>
          </div>
          {/* result_header start*/}
          <div className="result_header">
            <h4 className="result_title">
              심사중 <span className="highlight_red">1</span>건
            </h4>
            <div className="btn_group">
              <div className="counter">
                <span className="highlight_red">1</span>건
              </div>
              <Select
                optionList={selectListSort ? selectListSort : defaultSelectSort}
                handleSelectActive={onSelectActive}
                ref={searchSelectSort}
              />
            </div>
          </div>
          <ExInvestTableNew dataList={dataList} paging={paging} />
          <div className="pagination_wrap">
            {paging && <Pagination pagingData={paging} handlePaging={handlePaging} />}
          </div>
        </div>
        {/*commerce_banner_wrap end*/}
      </div>
    </PageLayout>
  )
}

export default Admin_Invest_Request
