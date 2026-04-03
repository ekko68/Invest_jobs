import { useEffect, useRef, useState, useContext, useLayoutEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import Select from 'components/atomic/Select'
import Checkbox from 'components/atomic/Checkbox'
import ExCorporateTableNew from 'pageComponents/commerce/main/ExCorporateTableNew'
import Pagination from 'components/Pagination'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import PopupAlert from 'components/PopupAlert'
import { MktContext } from 'modules/common/MktContext'
import { UserContext } from 'modules/common/UserContext'
import * as mainFn from 'modules/fns/mkt/mainFn'
import DatePicker, { registerLocale } from 'react-datepicker'
import ko from 'date-fns/locale/ko'

const Admin_Corporate_Management_01_1 = (props) => {
  const { selectList, onSelectActive, value } = props

  const searchSelect = useRef(null)
  const defaultSelect = {
    active: 'companyName',
    list: [
      { id: 'companyName', value: 'companyName', label: '회사명' },
      { id: 'bossName', value: 'bossName', label: '대표자명' }
    ]
  }
  const typeCheckboxList = [
    { id: 'check_all', value: '전체', status: true },
    { id: 'check_sale', value: '판매', status: true },
    { id: 'check_sale_no', value: '판매 박탈', status: true }
  ]
  const [date1, setDate1] = useState({
    startDate: null,
    endDate: null
  })

  const [date2, setDate2] = useState({
    startDate: null,
    endDate: null
  })
  const mainData = {
    header: [
      {
        first: '번호',
        company: '회사명',
        boss: '대표자명',
        memberType: '회원 타입',
        saleType: '판매 타입',
        product: '판매 상품',
        state: '상태',
        action: ''
      }
    ],
    data: [
      {
        first: '10',
        company: '판매사 회사명',
        boss: '홍길동',
        memberType: '정회원',
        saleType: '판매자/에이전시',
        product: '05',
        state: '판매 자격 박탈',
        action: <Button className="grayLine">판매 자격 박탈</Button>
      },
      {
        first: '09',
        company: '판매사 회사명',
        boss: '홍길동',
        memberType: '정회원',
        saleType: '판매자',
        product: '05',
        state: '판매',
        action: <Button className="grayLine">박탈 사유</Button>
      },
      {
        first: '08',
        company: '판매사 회사명',
        boss: '홍길동',
        memberType: '정회원',
        saleType: '판매자',
        product: '05',
        state: '판매 자격 박탈',
        action: <Button className="grayLine">판매 자격 박탈</Button>
      },
      {
        first: '07',
        company: '판매사 회사명',
        boss: '홍길동',
        memberType: '정회원',
        saleType: '판매자',
        product: '05',
        state: '상태',
        action: <Button className="grayLine">판매 자격 박탈</Button>
      }
    ]
  }
  const mktContext = useContext(MktContext)
  const userContext = useContext(UserContext)
  const history = useHistory()
  const location = useLocation()
  let path = location.pathname
  let page = path.split('/')[1]

  const [paging, setPaging] = useState(null)

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

  // ===== 상세화면 이동 : id
  const handleView = (id) => {
    history.push(`${ROUTER_NAMES.COMMERCE_MAIN_BANNER_VIEW}/${id}`)
  }

  // ===== 등록 이동 : type (type is webMain, MobileMain)
  const [alertMsg, setAlertMsg] = useState('')
  const handleWrite = async (type) => {
    setAlertMsg(null)
    let maximumValidate = await mainFn.handleMaximumCheck(type, handleMaximunAlert)
    setAlertMsg(`게시중인 배너는 최대 ${mainFn.maximumCnt[type]}개까지\n설정 가능합니다.`)
    if (maximumValidate) {
      history.push(`${ROUTER_NAMES.COMMERCE_MAIN_BANNER_WRITE}/${type}`)
    }
  }

  // ===== maximunAlert
  const handleMaximunAlert = () => {
    setMaximumAlert(!maximumAlert)
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
      {/* {maximumAlert && <PopupAlert msg={alertMsg} handlePopup={handleMaximunAlert} />} */}
      <div className="content_inner page_main">
        <div className="page_header">
          <h4 className="page_title">판매사 관리</h4>
        </div>

        {/* <TermSearchForm searchDate={searchDate} setSearchDate={setSearchDate} getList={getList} /> */}
        {/*commerce_banner_wrap start*/}
        <div className="commerce_banner_wrap">
          <div className={'maximum_notice'}>
            <p className="require highlight_grey">판매사의 판매 권한 자격을 박탈할 수 있습니다.</p>
          </div>
          <div className={'search_table_wrap'}>
            <table className="table_search">
              <caption>상태, 회사명 날짜별 조회 테이블</caption>
              <colgroup>
                <col width={'15%'} />
                <col width={'*'} />
              </colgroup>
              <tbody>
                <tr>
                  <th>상태</th>
                  <td>
                    {typeCheckboxList.map((check) => (
                      <Checkbox
                        key={check.id}
                        checkbox={{ id: check.id, value: check.value }}
                        status={check.status}
                        onChange={() => {}}
                      />
                    ))}
                  </td>
                </tr>
                <tr>
                  <th>
                    <Select
                      optionList={selectList ? selectList : defaultSelect}
                      handleSelectActive={onSelectActive}
                      ref={searchSelect}
                    />
                  </th>
                  <td>
                    <input
                      name={''}
                      type="text"
                      className="input"
                      value={value}
                      defaultValue={value}
                      title={'검색어'}
                      placeholder={''}
                    />
                  </td>
                </tr>
                <tr>
                  <th>날짜 선택</th>
                  <td>
                    <div className="tab_wrap">
                      {/* 선택된 날짜버튼 date 에 active 클래스 추가  */}
                      <button className={`btn_tab active`}>15일</button>
                      <button className={`btn_tab`}>1개월</button>
                      <button className={`btn_tab`}>2개월</button>
                      <button className={`btn_tab`}>3개월</button>
                    </div>
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
          <div className="button_bottom_group">
            <Button className={'basic'} onClick={() => {}}>
              초기화
            </Button>
            <Button className={'full_blue_deep'} onClick={() => {}}>
              검색
            </Button>
          </div>
          {/*tab_header start*/}
          <div className="tab_header">
            <div className="page_header_right">
              <div className="btn_group">
                <button className={'btn_refresh'} title={'새로고침'} onClick={handleReset}>
                  <span className="hide">새로고침</span>
                </button>
              </div>
            </div>
          </div>

          <ExCorporateTableNew dataList={mainData} handleView={handleView} />
          <div className="pagination_wrap">
            <Pagination
              pagingData={{ totalPage: 40, startPage: 1, page: 5, prev: true, next: true, endPage: 10 }}
              handlePaging={handlePaging}
            />
          </div>
        </div>
        {/*commerce_banner_wrap end*/}
      </div>
    </PageLayout>
  )
}

export default Admin_Corporate_Management_01_1
