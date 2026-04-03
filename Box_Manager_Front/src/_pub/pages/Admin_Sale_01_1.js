import { useEffect, useRef, useState, useContext, useLayoutEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import Select from 'components/atomic/Select'
import ExOrderTableNew from 'pageComponents/commerce/main/ExOrderTableNew'
import ExEstimateTableNew from 'pageComponents/commerce/main/ExEstimateTableNew'
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

const Admin_Sale_01_1 = (props) => {
  const { selectList, onSelectActive, value } = props

  const searchSelect = useRef(null)
  const defaultSelect = {
    active: 'companyName',
    list: [
      { id: 'companyName', value: 'companyName', label: '회사명' },
      { id: 'productName', value: 'productName', label: '상품명' }
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
  const saleAllData = {
    header: [
      {
        first: '주문번호',
        name: '상품명',
        type: '소분류/세분류',
        company: '판매사',
        option: '옵션',
        quantity: '수량',
        price: '판매 금액',
        delivery: '배송',
        state: '상태',
        date: '결제일',
        purchaser: '구매사'
      }
    ],
    data: [
      {
        first: '000000',
        name: '상품명 전체',
        type: '남아수영복',
        company: '회사명',
        option: '옵션01',
        quantity: '00',
        price: '000,000원',
        delivery: '직접배송',
        state: '배송완료',
        date: '2024.08.03',
        purchaser: '회사명/결제자'
      },
      {
        first: '000000',
        name: '상품명전체',
        type: '남아수영복',
        company: '회사명회사명회사명',
        option: '옵션01',
        quantity: '00',
        price: '000,000원',
        delivery: '무료 배송',
        state: '배송완료',
        date: '2024.08.03',
        purchaser: '회사명/결제자'
      },
      {
        first: '000000',
        name: '상품명상품명상품명상품명상품명상품명상품명',
        type: '남아수영복',
        company: '회사명',
        option: '옵션01',
        quantity: '00',
        price: '000,000원',
        delivery: '무료 배송',
        state: '구매 확정',
        date: '2024.08.03',
        purchaser: '회사명/결제자'
      },
      {
        first: '000000',
        name: '상품명상품명상품명상품명상품명상품명상품명',
        type: '남아수영복',
        company: '회사명',
        option: '옵션02',
        quantity: '00',
        price: '000,000원',
        delivery: '무료 배송',
        state: '배송중',
        date: '2024.08.03',
        purchaser: '회사명/결제자'
      }
    ]
  }
  const salePaymentData = {
    header: [
      {
        first: '주문번호',
        name: '상품명',
        type: '소분류/세분류',
        company: '판매사',
        option: '옵션',
        quantity: '수량',
        price: '판매 금액',
        delivery: '배송',
        state: '상태',
        date: '결제일',
        purchaser: '구매사'
      }
    ],
    data: [
      {
        first: '000000',
        name: '상품명결제완료',
        type: '남아수영복',
        company: '회사명',
        option: '옵션01',
        quantity: '00',
        price: '000,000원',
        delivery: '직접배송',
        state: '결제완료',
        date: '2024.08.03',
        purchaser: '회사명/결제자'
      },
      {
        first: '000000',
        name: '상품명결제완료2',
        type: '남아수영복',
        company: '회사명회사명회사명',
        option: '옵션01',
        quantity: '00',
        price: '000,000원',
        delivery: '무료 배송',
        state: '배송완료',
        date: '2024.08.03',
        purchaser: '회사명/결제자'
      },
      {
        first: '000000',
        name: '상품명상품명상품명상품명상품명상품명상품명',
        type: '남아수영복',
        company: '회사명',
        option: '옵션01',
        quantity: '00',
        price: '000,000원',
        delivery: '무료 배송',
        state: '구매 확정',
        date: '2024.08.03',
        purchaser: '회사명/결제자'
      },
      {
        first: '000000',
        name: '상품명상품명상품명상품명상품명상품명상품명',
        type: '남아수영복',
        company: '회사명',
        option: '옵션02',
        quantity: '00',
        price: '000,000원',
        delivery: '무료 배송',
        state: '배송중',
        date: '2024.08.03',
        purchaser: '회사명/결제자'
      }
    ]
  }
  const saleShippingData = {
    header: [
      {
        first: '주문번호',
        name: '상품명',
        type: '소분류/세분류',
        company: '판매사',
        option: '옵션',
        quantity: '수량',
        price: '판매 금액',
        delivery: '배송',
        state: '상태',
        date: '결제일',
        purchaser: '구매사'
      }
    ],
    data: [
      {
        first: '000000',
        name: '상품명배송중',
        type: '남아수영복',
        company: '회사명',
        option: '옵션01',
        quantity: '00',
        price: '000,000원',
        delivery: '직접배송',
        state: '배송완료',
        date: '2024.08.03',
        purchaser: '회사명/결제자'
      },
      {
        first: '000000',
        name: '상품명배송중2',
        type: '남아수영복',
        company: '회사명회사명회사명',
        option: '옵션01',
        quantity: '00',
        price: '000,000원',
        delivery: '무료 배송',
        state: '배송완료',
        date: '2024.08.03',
        purchaser: '회사명/결제자'
      },
      {
        first: '000000',
        name: '상품명상품명상품명상품명상품명상품명상품명',
        type: '남아수영복',
        company: '회사명',
        option: '옵션01',
        quantity: '00',
        price: '000,000원',
        delivery: '무료 배송',
        state: '구매 확정',
        date: '2024.08.03',
        purchaser: '회사명/결제자'
      },
      {
        first: '000000',
        name: '상품명상품명상품명상품명상품명상품명상품명',
        type: '남아수영복',
        company: '회사명',
        option: '옵션02',
        quantity: '00',
        price: '000,000원',
        delivery: '무료 배송',
        state: '배송중',
        date: '2024.08.03',
        purchaser: '회사명/결제자'
      }
    ]
  }
  const saleDeliveryData = {
    header: [
      {
        first: '주문번호',
        name: '상품명',
        type: '소분류/세분류',
        company: '판매사',
        option: '옵션',
        quantity: '수량',
        price: '판매 금액',
        delivery: '배송',
        state: '상태',
        date: '결제일',
        purchaser: '구매사'
      }
    ],
    data: [
      {
        first: '000000',
        name: '상품명배송완료1',
        type: '남아수영복',
        company: '회사명',
        option: '옵션01',
        quantity: '00',
        price: '000,000원',
        delivery: '직접배송',
        state: '배송완료',
        date: '2024.08.03',
        purchaser: '회사명/결제자'
      },
      {
        first: '000000',
        name: '상품명배송완료2',
        type: '남아수영복',
        company: '회사명회사명회사명',
        option: '옵션01',
        quantity: '00',
        price: '000,000원',
        delivery: '무료 배송',
        state: '배송완료',
        date: '2024.08.03',
        purchaser: '회사명/결제자'
      },
      {
        first: '000000',
        name: '상품명상품명상품명상품명상품명상품명상품명',
        type: '남아수영복',
        company: '회사명',
        option: '옵션01',
        quantity: '00',
        price: '000,000원',
        delivery: '무료 배송',
        state: '구매 확정',
        date: '2024.08.03',
        purchaser: '회사명/결제자'
      },
      {
        first: '000000',
        name: '상품명상품명상품명상품명상품명상품명상품명',
        type: '남아수영복',
        company: '회사명',
        option: '옵션02',
        quantity: '00',
        price: '000,000원',
        delivery: '무료 배송',
        state: '배송중',
        date: '2024.08.03',
        purchaser: '회사명/결제자'
      }
    ]
  }
  const salePaymentCancelData = {
    header: [
      {
        first: '주문번호',
        name: '상품명',
        type: '소분류/세분류',
        company: '판매사',
        option: '옵션',
        quantity: '수량',
        price: '판매 금액',
        delivery: '배송',
        state: '상태',
        date: '결제일',
        purchaser: '구매사'
      }
    ],
    data: [
      {
        first: '000000',
        name: '상품명결제취소1',
        type: '남아수영복',
        company: '회사명',
        option: '옵션01',
        quantity: '00',
        price: '000,000원',
        delivery: '직접배송',
        state: '배송완료',
        date: '2024.08.03',
        purchaser: '회사명/결제자'
      },
      {
        first: '000000',
        name: '상품명결제취소2',
        type: '남아수영복',
        company: '회사명회사명회사명',
        option: '옵션01',
        quantity: '00',
        price: '000,000원',
        delivery: '무료 배송',
        state: '배송완료',
        date: '2024.08.03',
        purchaser: '회사명/결제자'
      },
      {
        first: '000000',
        name: '상품명상품명상품명상품명상품명상품명상품명',
        type: '남아수영복',
        company: '회사명',
        option: '옵션01',
        quantity: '00',
        price: '000,000원',
        delivery: '무료 배송',
        state: '구매 확정',
        date: '2024.08.03',
        purchaser: '회사명/결제자'
      },
      {
        first: '000000',
        name: '상품명상품명상품명상품명상품명상품명상품명',
        type: '남아수영복',
        company: '회사명',
        option: '옵션02',
        quantity: '00',
        price: '000,000원',
        delivery: '무료 배송',
        state: '배송중',
        date: '2024.08.03',
        purchaser: '회사명/결제자'
      }
    ]
  }
  const saleReturnData = {
    header: [
      {
        first: '주문번호',
        name: '상품명',
        type: '소분류/세분류',
        company: '판매사',
        option: '옵션',
        quantity: '수량',
        price: '판매 금액',
        delivery: '배송',
        state: '상태',
        date: '결제일',
        purchaser: '구매사'
      }
    ],
    data: [
      {
        first: '000000',
        name: '상품명반품/환불1',
        type: '남아수영복',
        company: '회사명',
        option: '옵션01',
        quantity: '00',
        price: '000,000원',
        delivery: '직접배송',
        state: '배송완료',
        date: '2024.08.03',
        purchaser: '회사명/결제자'
      },
      {
        first: '000000',
        name: '상품명반품/환불2',
        type: '남아수영복',
        company: '회사명회사명회사명',
        option: '옵션01',
        quantity: '00',
        price: '000,000원',
        delivery: '무료 배송',
        state: '배송완료',
        date: '2024.08.03',
        purchaser: '회사명/결제자'
      },
      {
        first: '000000',
        name: '상품명상품명상품명상품명상품명상품명상품명',
        type: '남아수영복',
        company: '회사명',
        option: '옵션01',
        quantity: '00',
        price: '000,000원',
        delivery: '무료 배송',
        state: '구매 확정',
        date: '2024.08.03',
        purchaser: '회사명/결제자'
      },
      {
        first: '000000',
        name: '상품명상품명상품명상품명상품명상품명상품명',
        type: '남아수영복',
        company: '회사명',
        option: '옵션02',
        quantity: '00',
        price: '000,000원',
        delivery: '무료 배송',
        state: '배송중',
        date: '2024.08.03',
        purchaser: '회사명/결제자'
      }
    ]
  }
  const saleEstimateData = {
    header: [
      {
        first: '번호',
        name: '상품명',
        type: '소분류/세분류',
        company: '판매사',
        date: '견적요청일',
        estimate: '견적서',
        purchaser: '구매사'
      }
    ],
    data: [
      {
        first: '08',
        name: '상품명증빙요청1',
        type: '남아수영복',
        company: '회사명',
        date: '2024.08.03',
        estimate: '견적서',
        purchaser: '회사명/결제자'
      },
      {
        first: '07',
        name: '상품명증빙요청2',
        type: '남아수영복',
        company: '회사명',
        date: '2024.08.03',
        estimate: '견적서',
        purchaser: '회사명/결제자'
      },
      {
        first: '06',
        name: '상품명증빙요청3',
        type: '남아수영복',
        company: '회사명',
        date: '2024.08.03',
        estimate: '견적서',
        purchaser: '회사명/결제자'
      },
      {
        first: '05',
        name: '상품명증빙요청4',
        type: '남아수영복',
        company: '회사명',
        date: '2024.08.03',
        estimate: '견적서',
        purchaser: '회사명/결제자'
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
      { id: 'saleAll', label: '판매 전체' },
      { id: 'salePayment', label: '결제 완료' },
      { id: 'saleShipping', label: '배송중' },
      { id: 'saleDelivery', label: '배송완료' },
      { id: 'salePaymentCancel', label: '결제취소' },
      { id: 'saleReturn', label: '반품/환불' },
      { id: 'saleEstimate', label: '증빙 요청' }
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

  // ===== 등록 이동 : type (type is saleAll, salePayment, saleShipping, saleDelivery, salePaymentCancel, saleReturn, saleEstimate)
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
    mktContext.actions.handleSetBannerCurrType('saleAll')
  }

  useLayoutEffect(() => {
    if ('saleAll' !== userContext.state.category) {
      userContext.actions.setCategory('saleAll')
      handleReset()
    }
  }, [userContext.state.category])

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'main'} currentPage={'bannerList'}>
      {/* {maximumAlert && <PopupAlert msg={alertMsg} handlePopup={handleMaximunAlert} />} */}
      <div className="content_inner page_main">
        <div className="page_header">
          <h4 className="page_title">주문 관리</h4>
        </div>

        {/* <TermSearchForm searchDate={searchDate} setSearchDate={setSearchDate} getList={getList} /> */}
        {/*commerce_banner_wrap start*/}
        <div className="commerce_banner_wrap">
          <div className={'maximum_notice'}>
            <p className="highlight_grey">판매사/에이전시의 판매 내역을 확인할 수 있습니다.</p>
          </div>
          <div className={'search_table_wrap'}>
            <table className="table_search">
              <caption>회사명, 날짜별 조회 테이블</caption>
              <colgroup>
                <col width={'15%'} />
                <col width={'*'} />
              </colgroup>
              <tbody>
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
          {tabList.active === 'saleAll' ? (
            <ExOrderTableNew dataList={saleAllData} handleView={handleView} />
          ) : tabList.active === 'salePayment' ? (
            <ExOrderTableNew dataList={salePaymentData} handleView={handleView} />
          ) : tabList.active === 'saleShipping' ? (
            <ExOrderTableNew dataList={saleShippingData} handleView={handleView} />
          ) : tabList.active === 'saleDelivery' ? (
            <ExOrderTableNew dataList={saleDeliveryData} handleView={handleView} />
          ) : tabList.active === 'salePaymentCancel' ? (
            <ExOrderTableNew dataList={salePaymentCancelData} handleView={handleView} />
          ) : tabList.active === 'saleReturn' ? (
            <ExOrderTableNew dataList={saleReturnData} handleView={handleView} />
          ) : tabList.active === 'saleEstimate' ? (
            <ExEstimateTableNew dataList={saleEstimateData} handleView={handleView} />
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

export default Admin_Sale_01_1
