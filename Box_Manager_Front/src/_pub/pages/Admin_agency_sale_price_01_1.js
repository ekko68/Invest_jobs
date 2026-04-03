import { useEffect, useRef, useState, useContext, useLayoutEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import Select from 'components/atomic/Select'

import ExAgencyTableNew from 'pageComponents/commerce/main/ExAgencyTableNew'
import Pagination from 'components/Pagination'
import ROUTER_NAMES from 'modules/consts/RouterConst'

import PopupAlert from 'components/PopupAlert'
import { MktContext } from 'modules/common/MktContext'
import { UserContext } from 'modules/common/UserContext'
import * as mainFn from 'modules/fns/mkt/mainFn'

import { NoImage02 } from 'modules/consts/Img'

// const [searchDate, setSearchDate] = useState({
//   startDate: new Date(),
//   endDate: new Date()
// })

const Admin_agency_sale_price_01_1 = (props) => {
  const { selectList, selectList2, onSelectActive, value, idx } = props

  const searchSelect = useRef(null)
  const searchSelect2 = useRef(null)
  const defaultSelect = {
    active: 'companyName',
    list: [
      { id: 'companyName', value: 'companyName', label: '회사명' },
      { id: 'productName', value: 'productName', label: '상품명' }
    ]
  }
  const defaultSelect2 = {
    active: 'all',
    list: [
      { id: 'all', value: 'all', label: '전체' },
      { id: 'priceHigh', value: 'priceHigh', label: '높은 금액순' },
      { id: 'priceRow', value: 'priceRow', label: '낮은 금액순' }
    ]
  }

  const saleData = {
    header: [
      {
        first: '번호',
        companyName: '회사명',
        leader: '대표자명',
        member: '회원 타입',
        sale: '판매 타입',
        approved: '승인업체',
        state: '상태',
        product: '판매 상품',
        total: '총 판매 금액(원)'
      }
    ],
    data: [
      {
        first: '07',
        companyName: '판매사 회사명',
        leader: '이름',
        member: '정회원',
        sale: '에이전시',
        approved: '03',
        state: '판매',
        product: '05',
        total: '000,000,000'
      },
      {
        first: '06',
        companyName: '판매사 회사명',
        leader: '이름',
        member: '정회원',
        sale: '판매자 / 에이전시',
        approved: '02',
        state: '판매',
        product: '08',
        total: '000,000,000'
      },
      {
        first: '05',
        companyName: '판매사 회사명',
        leader: '이름',
        member: '정회원',
        sale: '판매자 / 에이전시',
        approved: '01',
        state: '판매',
        product: '08',
        total: '000,000,000'
      },
      {
        first: '04',
        companyName: '판매사 회사명',
        leader: '이름',
        member: '정회원',
        sale: '판매자',
        approved: '08',
        state: '판매자격박탈',
        product: '08',
        total: '000,000,000'
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

  // ===== 상세화면 이동 : id
  const handleView = (id) => {
    history.push(`${ROUTER_NAMES.COMMERCE_MAIN_BANNER_VIEW}/${id}`)
  }

  // ===== 등록 이동 : type (type is eventListTab, eventStatusTab)
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
    mktContext.actions.handleSetBannerCurrType('eventListTab')
  }

  useLayoutEffect(() => {
    if ('eventListTab' !== userContext.state.category) {
      userContext.actions.setCategory('eventListTab')
      handleReset()
    }
  }, [userContext.state.category])

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'main'} currentPage={'bannerList'}>
      {/* {maximumAlert && <PopupAlert msg={alertMsg} handlePopup={handleMaximunAlert} />} */}
      <div className="content_inner page_main">
        <div className="page_header">
          <h4 className="page_title">에이전시 판매 금액</h4>
        </div>

        {/* <TermSearchForm searchDate={searchDate} setSearchDate={setSearchDate} getList={getList} /> */}
        {/*commerce_banner_wrap start*/}
        <div className="commerce_banner_wrap">
          <div className={'maximum_notice'}>
            <p className="highlight_grey">에이전시의 판매 금액을 확인할 수 있습니다</p>
          </div>
          <div className={'search_table_wrap'}>
            <table className="table_search">
              <caption>상태, 제목 날짜별 조회 테이블</caption>
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
                      title={'타이틀'}
                      placeholder={'타이틀을 입력해주세요'}
                    />
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
                <Select
                  optionList={selectList2 ? selectList2 : defaultSelect2}
                  handleSelectActive={onSelectActive}
                  ref={searchSelect2}
                />
                <button className={'btn_refresh'} title={'새로고침'} onClick={handleReset}>
                  <span className="hide">새로고침</span>
                </button>
              </div>
            </div>
          </div>

          <ExAgencyTableNew dataList={saleData} handleView={handleView} />
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

export default Admin_agency_sale_price_01_1
