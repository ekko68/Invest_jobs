import { useState, useContext, useRef, useLayoutEffect, useEffect } from 'react'

import PageLayout from 'components/PageLayout'
import NoResult from 'components/NoResult'
import Pagination from 'components/Pagination'
import SearchForm from 'components/SearchForm'
import Badge from 'components/atomic/Badge'
import Button from 'components/atomic/Button'
import PopupEstimateView from 'pageComponents/commerce/order/PopupEstimateView'
import { useHistory, useLocation } from 'react-router-dom'
import { MktContext } from 'modules/common/MktContext'
import { UserContext } from 'modules/common/UserContext'
import Select from 'components/atomic/Select'
import * as commonFn from 'modules/fns/commonFn'
import { getOrderEstimatePopup, getOrderList } from 'modules/consts/MktApi'
import { getTotalNumberBoard } from 'modules/common'
import BoxUrl from 'modules/consts/BoxUrl'
import moment from 'moment'

const List = () => {
  const location = useLocation()
  let path = location.pathname
  let category = path.split('/')[2]
  const mktContext = useContext(MktContext)
  const userContext = useContext(UserContext)
  const history = useHistory()

  // ========================
  /* state  */
  // ========================
  // 주문관리 데이터
  const [orderList, setOrderList] = useState(null)
  const [paging, setPaging] = useState(null)
  const [paramList, setParamList] = useState({
    page: 1,
    searchType: '', // 검색필터
    searchText: '', // 검색어
    ordnSttsId: '' // 필터
  })
  const [filter, setFilter] = useState({
    active: paramList.ordnSttsId !== '' ? paramList.ordnSttsId : 'all',
    list: [
      { id: 'all', value: 'all', label: '전체' },
      { id: 'ODS00001', value: 'ODS00001', label: '주문' },
      { id: 'ODS00002', value: 'ODS00002', label: '주문취소 승인' },
      { id: 'ODS00003', value: 'ODS00003', label: '배송중' },
      { id: 'ODS00004', value: 'ODS00004', label: '배송완료' },
      { id: 'ODS00005', value: 'ODS00005', label: '반품요청' },
      { id: 'ODS00006', value: 'ODS00006', label: '반품불가' },
      { id: 'ODS00007', value: 'ODS00007', label: '반품완료' },
      { id: 'ODS00008', value: 'ODS00008', label: '주문취소' }
    ]
  })
  const [searchInput, setSearchInput] = useState('')
  const [searchFilter, setSearchFilter] = useState({
    active: paramList.searchType !== '' ? paramList.ordnSttsId : 'orderId',
    list: [
      { id: 'orderId', value: 'orderId', label: '주문번호' },
      { id: 'pucs', value: 'pucs', label: '구매자' },
      { id: 'selr', value: 'selr', label: '판매사' }
    ]
  })

  // ========================
  /* functions  */
  // ========================
  // ===== getList
  const getList = async () => {
    let res = await getOrderList(paramList)
    if (res.data.code === '200') {
      const data = res.data.data
      setOrderList(data.list)
      setPaging({
        endPage: data.endPage,
        next: data.next,
        page: data.page,
        prev: data.prev,
        record: data.record,
        startPage: data.startPage,
        total: data.total,
        totalPage: data.totalPage
      })
    }
  }

  // ===== filter
  const onFilterActive = (selected) => {
    setParamList({
      ...paramList,
      page: 1,
      ordnSttsId: selected === 'all' ? '' : selected
    })
    setFilter({
      ...filter,
      active: selected
    })
  }

  // ===== Search
  const filterRef = useRef(null)
  const onSelectActive = (selected) => {
    setSearchFilter({
      ...searchFilter,
      active: selected
    })
  }
  const handleSearch = () => {
    let params = {
      ...paramList,
      searchType: searchFilter.active === 'all' ? '' : searchFilter.active,
      searchText: searchInput ? searchInput : '',
      page: 1
    }
    setParamList(params)
  }

  // ==== popup : 견적상세
  const [estimatePopup, setEstimatePopup] = useState(false)
  const [estimData, setEstimData] = useState(null)

  const handleEstimatePopup = async (id) => {
    console.log('handleEstimatePopup', id)
    if (!estimatePopup) {
      if (id) {
        const res = await getOrderEstimatePopup({ esttInfoId: id })
        if (res.data.code === '200') {
          setEstimData(res.data.data)
          setEstimatePopup(true)
        } else {
          console.log('Error has been occurred')
        }
      }
    } else {
      setEstimatePopup(false)
      setEstimData(null)
    }
  }

  // ===== paging
  const handlePaging = (param) => {
    console.log(param)
    setParamList({
      ...paramList,
      ...param
    })
  }

  // ===== reset
  const handleReset = () => {
    setParamList({
      page: 1,
      searchType: '', // 검색필터
      searchText: '', // 검색어
      ordnSttsId: '' // 필터
    })
    setSearchInput('')
  }

  // ===== link
  const handleLink = (id) => {
    window.open(`${BoxUrl.getMarketBoxUrl(process.env.REACT_APP_PROFILE)}/product/detail/${id}`, '_blank')
  }

  useLayoutEffect(() => {
    if (category !== userContext.state.category) {
      userContext.actions.setCategory(category)
    }
  }, [userContext.state.category])

  useEffect(async () => {
    await getList()
  }, [paramList])

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'order'}>
      {estimatePopup && estimData && <PopupEstimateView data={estimData} handlePopup={handleEstimatePopup} />}
      <div className="content_inner page_order">
        <div className="page_header">
          <h4 className="page_title">주문관리</h4>
          <div className="btn_group">
            <Select optionList={filter} ref={filterRef} handleSelectActive={onFilterActive} />
            <button className={'btn_refresh'} title={'새로고침'} onClick={handleReset}>
              <span className="hide">새로고침</span>
            </button>
          </div>
        </div>
        {/*section start*/}
        <div className="section order_table_section">
          {!orderList || orderList.length === 0 ? (
            <div className="table_no_result">
              <NoResult msg={'주문 목록이 없습니다.'} />
            </div>
          ) : (
            <div className="table_over_width scroll">
              <div className="table_wrap border_bottom_none table_th_border">
                <table className="table type02">
                  <caption>주문 관리 테이블</caption>
                  <colgroup>
                    <col width={'4%'} />
                    <col width={'10%'} />
                    <col width={'*'} />
                    <col width={'8%'} />
                    <col width={'10%'} />
                    <col width={'10%'} />
                    <col width={'10%'} />
                    <col width={'9%'} />
                    <col width={'9%'} />
                    <col width={'10%'} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>NO</th>
                      <th>주문번호</th>
                      <th>상품명</th>
                      <th>배송유형</th>
                      <th>총 결제금액</th>
                      <th>분류</th>
                      <th>구매자명</th>
                      <th>견적</th>
                      <th>상태</th>
                      <th>구매일시</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderList.map((order, index) => {
                      let length = order.products.length
                      return order.products.map((item, idx) => {
                        return (
                          <tr key={commonFn.createKey()}>
                            {idx === 0 ? (
                              <td rowSpan={length} align={'center'}>
                                {paging && getTotalNumberBoard(paging.total, paging.page, paging.record, index)}
                              </td>
                            ) : (
                              <></>
                            )}
                            <td>{order.cnttNoId}</td>
                            <td>
                              {item.agenState === 'Y' && <Badge className={'full_blue'}>에이전시</Badge>}
                              <Button className={'btn_link'} onClick={() => handleLink(item.pdfInfoId)}>
                                {item.pdfNm}
                              </Button>
                            </td>
                            <td>{item.dvryPtrnNm}</td>
                            <td>{item.ttalAmt ? commonFn.krwFormatter(item.ttalAmt) : 0}원</td>
                            <td>{item.ctgyNm}</td>
                            <td>
                              <p>{order.pucsBplcNm}</p>
                              <p>{order.pucsRprsntvNm}</p>
                            </td>
                            {idx === 0 ? (
                              <td rowSpan={length} align={'center'}>
                                {item.esttInfoId !== null ||
                                (item.esttInfoId !== '' && item.ordnPtrnNm === '견젹상품') ? (
                                  <Button
                                    style={{ color: '#27a6ff', textDecoration: 'underline' }}
                                    onClick={() => handleEstimatePopup(item.esttInfoId)}
                                  >
                                    {item.ordnPtrnNm}
                                  </Button>
                                ) : (
                                  <span>{item.ordnPtrnNm}</span>
                                )}
                              </td>
                            ) : (
                              <></>
                            )}
                            <td>{item.ordnSttsNm}</td>
                            <td>{moment(item.orderRgsnTs).format('YYYY-MM-DD HH:mm')}</td>
                          </tr>
                        )
                      })
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {paging && orderList?.length > 0 && (
            <>
              <div className={'paging_wrap'}>
                <Pagination pagingData={paging} handlePaging={handlePaging} />
              </div>
            </>
          )}
          <SearchForm
            onSelectActive={onSelectActive}
            selectList={searchFilter}
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            handleSearch={handleSearch}
          />
        </div>
        {/*section end*/}
      </div>
    </PageLayout>
  )
}

export default List
