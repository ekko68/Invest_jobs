import { useEffect, useState, useContext, useLayoutEffect, useCallback, useRef } from 'react'
import PageLayout from 'components/PageLayout'
import Pagination from 'components/Pagination'
import { MktContext } from 'modules/common/MktContext'
import { getProdSellerListV2, prodSellerRegCancelV2, prodSellerRegRecoveryV2 } from 'modules/consts/MktApi'
import Search from 'pageComponents/commerce/common/Search'
import { searchStatus, searchInput, searchDate } from './searchValue'
import { UserContext } from 'modules/common/UserContext'
import moment from 'moment/moment'

import ProductList from 'pageComponents/commerce/management/product/List'
import ProductPopup from 'pageComponents/commerce/management/product/Popup'

const Product = (props) => {
  /*========================================================================================
   * 변수 및 state 선언
   *========================================================================================*/
  const mktContext = useContext(MktContext)
  const userContext = useContext(UserContext)
  const isMounted = useRef(true)

  // 페이징
  const [paging, setPaging] = useState(null)

  // 팝업 제어를 위한 state
  const [popup, setPopup] = useState({ active: false, data: {} })

  // 검색조건
  const [search, setSearch] = useState({
    startDate: moment(new Date(moment().subtract(15, 'days')))
      .format('yyyy-MM-DD')
      .toString(),
    endDate: moment().format('yyyy-MM-DD').toString(),
    activeTab: 'mainProduct',
    statusSales: 'Y',
    statusDeprive: 'Y',
    selrUsisName: '',
    pdfNm: '',
    page: 1,
    record: 10
  })

  // 판매사 상품 조회 정보
  const [product, setProduct] = useState({
    isLoading: true,
    list: []
  })

  // 탭
  const tabList = {
    active: mktContext.state.currType,
    list: [
      { id: 'mainProduct', label: '등록 상품' },
      { id: 'agencyProduct', label: '에이전시 상품' }
    ]
  }
  /*========================================================================================
   * 탭, 검색, 페이징, 재검색 (곷통)
   *========================================================================================*/
  useLayoutEffect(() => {
    if ('mainProduct' !== userContext.state.category) {
      userContext.actions.setCategory('mainProduct')
      handleReset()
    }
  }, [userContext.state.category])
  const handleTab = async (selected) => {
    setSearch({
      ...search,
      activeTab: selected
    })
    mktContext.actions.handleSetBannerCurrType(selected)
  }

  // 페이징 핸들러
  const handlePaging = (param) => {
    if (search.page != param.page) {
      setSearch({
        ...search,
        page: param.page
      })
    }
  }

  // 검색조건 핸들러
  const handleSearch = useCallback(
    (params) => {
      setProduct({
        isLoading: true,
        list: []
      })

      if (params.pdfNm === undefined) {
        setSearch({
          ...search,
          page: 1,
          pdfNm: '',
          ...params
        })
      } else if (params.selrUsisName === undefined) {
        setSearch({
          ...search,
          page: 1,
          selrUsisName: '',
          ...params
        })
      }
    },
    [search]
  )

  // 현재 조건 기준 재조회
  const handleReset = () => {
    setSearch({
      ...search,
      activeTab: 'mainProduct'
    })
    mktContext.actions.handleSetBannerCurrType('mainProduct')
  }

  /*========================================================================================
   * 조회 영역
   *========================================================================================*/
  useEffect(() => {
    isMounted.current = true
    getSellerProductList(search)
  }, [search])

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  // 기존 조회 조건으로 재조회
  const getInitSellerProductList = useCallback(() => {
    setProduct({
      isLoading: true,
      list: []
    })
    getSellerProductList(search)
  }, [search])

  // 판매사 상품 조회를 위한 서비스 호출
  const getSellerProductList = (params) => {
    getProdSellerListV2(params, handleSellerProductListCallback, handleSellerProductListErrorCallback)
  }

  // 판매사 상품 조회 success callback
  const handleSellerProductListCallback = (res) => {
    if (res.data.code === '200' && isMounted.current) {
      const data = res.data.data
      setProduct({
        isLoading: false,
        list: data.list
      })
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

  // 판매사 상품 조회 error callback
  const handleSellerProductListErrorCallback = () => {
    setProduct({
      isLoading: false,
      list: []
    })
    mktContext.actions.setCommonAlertInfo({
      type: 'error',
      active: true
    })
  }

  /*========================================================================================
   * 판매 상품 중지 팝업 호출 영역
   *========================================================================================*/
  // 팝업 호출
  const handleProductPopup = (params) => {
    setPopup({
      active: params.active,
      data: params.item
    })
  }

  // 상품 판매중지/취소 서비스 호출
  const handleUpdateStopSell = (params) => {
    if (params.pdfSttsId === 'GDS00005') {
      prodSellerRegRecoveryV2(params, handleUpdateStopSellCallback, handleUpdateStopSellErrorCallback)
    } else {
      prodSellerRegCancelV2(params, handleUpdateStopSellCallback, handleUpdateStopSellErrorCallback)
    }
  }

  // 상품 판매중지/취소 공통 콜백
  const handleUpdateStopSellCallback = (res) => {
    if (res.data.code === '200') {
      const data = res.data.data
      setPopup({
        active: false,
        data: {}
      })
      getInitSellerProductList() // 저장 후 재조회
    }
  }

  // 상품 판매중지/취소 에러 공통 콜백
  const handleUpdateStopSellErrorCallback = () => {
    mktContext.actions.setCommonAlertInfo({
      type: 'error',
      active: true
    })
  }

  // 팝업 닫기
  const handleProductPopupClose = (params) => {
    setPopup({
      active: false,
      data: {}
    })
  }

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'prod'}>
      {popup.active && (
        <ProductPopup
          data={popup}
          handleUpdateStopSell={handleUpdateStopSell}
          handleProductPopupClose={handleProductPopupClose}
        />
      )}

      {/* {maximumAlert && <PopupAlert msg={alertMsg} handlePopup={handleMaximunAlert} />} */}
      <div className="content_inner page_main">
        <div className="page_header">
          <h4 className="page_title">판매사 상품 관리</h4>
        </div>

        {/*commerce_banner_wrap start*/}
        <div className="commerce_banner_wrap">
          <div className={'maximum_notice'}>
            <p className="require highlight_grey">판매사의 판매 권한 자격을 박탈할 수 있습니다.</p>
          </div>

          <Search
            check1={searchStatus}
            input={searchInput}
            date={searchDate}
            onSearch={(params) => {
              handleSearch(params)
            }}
          />

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
          {tabList.active === 'mainProduct' ? (
            <ProductList data={product} paging={paging} handleProductPopup={handleProductPopup} />
          ) : tabList.active === 'agencyProduct' ? (
            <ProductList data={product} paging={paging} handleProductPopup={handleProductPopup} />
          ) : (
            ''
          )}

          <div className="pagination_wrap">
            {paging && <Pagination pagingData={paging} handlePaging={handlePaging} />}
          </div>
        </div>
        {/*commerce_banner_wrap end*/}
      </div>
    </PageLayout>
  )
}

export default Product
