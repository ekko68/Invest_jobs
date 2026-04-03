import { useEffect, useRef, useState, useContext, useLayoutEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import Select from 'components/atomic/Select'
import Checkbox from 'components/atomic/Checkbox'
import ExCorporateProductTableNew from 'pageComponents/commerce/main/ExCorporateProductTableNew'
import Pagination from 'components/Pagination'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import PopupAlert from 'components/PopupAlert'
import { MktContext } from 'modules/common/MktContext'
import { UserContext } from 'modules/common/UserContext'
import * as mainFn from 'modules/fns/mkt/mainFn'
import DatePicker, { registerLocale } from 'react-datepicker'
import ko from 'date-fns/locale/ko'
import { NoImage02 } from 'modules/consts/Img'

// const [searchDate, setSearchDate] = useState({
//   startDate: new Date(),
//   endDate: new Date()
// })

const Admin_Main_Product_01_1 = (props) => {
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

  const registeredGoodsData = {
    header: [
      {
        first: '번호',
        product: '상품명',
        category: '소분류/세분류',
        price: '판매가',
        state: '상태',
        policy: '판매 정책',
        action: ''
      }
    ],
    data: [
      {
        first: '10',
        product: '상품명상품명상품명상품명상품명상품명상품명',
        category: '남아 수영복',
        price: '45,000 원',
        state: '판매중',
        policy: 'BOX POS 결제',
        action: <Button className="grayLine">판매 중지</Button>
      },
      {
        first: '09',
        product: '상품명상품명상품명상품명상품명상품명상품명',
        category: '튜브',
        price: '45,000 원',
        state: '판매중',
        policy: '견적요청 받기',
        action: <Button className="grayLine">판매 중지 사유</Button>
      },
      {
        first: '08',
        product: '상품명상품명상품명상품명상품명상품명상품명',
        category: '남아 수영복',
        price: '45,000 원',
        state: '판매중',
        policy: 'BOX POS 결제',
        action: <Button className="grayLine">판매 중지</Button>
      },
      {
        first: '07',
        product: '상품명상품명상품명상품명상품명상품명상품명',
        category: '남아 수영복',
        price: '45,000 원',
        state: '판매중',
        policy: 'BOX POS 결제',
        action: <Button className="grayLine">판매 중지</Button>
      }
    ]
  }

  const agencyGoodsData = {
    header: [
      {
        first: '번호',
        product: '상품명',
        category: '소분류/세분류',
        price: '판매가',
        state: '상태',
        policy: '판매 정책',
        action: ''
      }
    ],
    data: [
      {
        first: '11',
        product: '상품명',
        category: '남아 수영복',
        price: '99,000 원',
        state: '판매중',
        policy: 'BOX POS 결제',
        action: <Button className="grayLine">판매 중지 사유</Button>
      },
      {
        first: '10',
        product: '상품명',
        category: '남아 수영복',
        price: '99,000 원',
        state: '판매중',
        policy: 'BOX POS 결제',
        action: <Button className="grayLine">판매 중지 사유</Button>
      },
      {
        first: '09',
        product: '상품명상품명상품명상품명상품명상품명상품명',
        category: '튜브',
        price: '45,000 원',
        state: '판매중',
        policy: '견적요청 받기',
        action: <Button className="grayLine">판매 중지 사유</Button>
      },
      {
        first: '08',
        product: '상품명상품명상품명상품명상품명상품명상품명',
        category: '남아 수영복',
        price: '45,000 원',
        state: '판매중',
        policy: 'BOX POS 결제',
        action: <Button className="grayLine">판매 중지</Button>
      },
      {
        first: '07',
        product: '상품명상품명상품명상품명상품명상품명상품명',
        category: '남아 수영복',
        price: '45,000 원',
        state: '판매중',
        policy: 'BOX POS 결제',
        action: <Button className="grayLine">판매 중지</Button>
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
  // 탭
  const tabList = {
    active: mktContext.state.currType,
    list: [
      { id: 'registeredGoods', label: '등록 상품' },
      { id: 'agencyGoods', label: '에이전시 상품' }
    ]
  }
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

  // ===== 등록 이동 : type (type is registeredGoods, agencyGoods)
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
    mktContext.actions.handleSetBannerCurrType('registeredGoods')
  }

  useLayoutEffect(() => {
    if ('registeredGoods' !== userContext.state.category) {
      userContext.actions.setCategory('registeredGoods')
      handleReset()
    }
  }, [userContext.state.category])

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'main'} currentPage={'bannerList'}>
      {/* {maximumAlert && <PopupAlert msg={alertMsg} handlePopup={handleMaximunAlert} />} */}
      <div className="content_inner page_main">
        <div className="page_header">
          <h4 className="page_title">판매사 상품 관리</h4>
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
            <ul className="tab_header_list">
              {tabList.list.map((tab, idx) => (
                <li
                  className={`tab_header_item ${tabList.active === tab.id ? 'active' : ''}`}
                  key={tab.id}
                  onClick={() => handleTab(tab.id)}
                >
                  <span className="label">{tab.label}</span>
                </li>
              ))}
            </ul>
            <div className="page_header_right">
              <div className="btn_group">
                <button className={'btn_refresh'} title={'새로고침'} onClick={handleReset}>
                  <span className="hide">새로고침</span>
                </button>
              </div>
            </div>
          </div>
          {tabList.active === 'registeredGoods' ? (
            <ExCorporateProductTableNew dataList={registeredGoodsData} handleView={handleView} />
          ) : tabList.active === 'agencyGoods' ? (
            <ExCorporateProductTableNew dataList={agencyGoodsData} handleView={handleView} />
          ) : (
            ''
          )}

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

export default Admin_Main_Product_01_1
