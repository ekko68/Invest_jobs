import { useEffect, useRef, useState, useContext, useCallback } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import PageLayout from 'components/PageLayout'
import Select from 'components/atomic/Select'

import SellerList from 'pageComponents/commerce/price/seller/List'
import SellerDetail from 'pageComponents/commerce/price/seller/Detail'
import Pagination from 'components/Pagination'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { MktContext } from 'modules/common/MktContext'
import { UserContext } from 'modules/common/UserContext'

import { getPriceSelrList } from 'modules/consts/MktApi'
import Search from 'pageComponents/commerce/common/Search'
import { searchInput } from './searchValue'

// const [searchDate, setSearchDate] = useState({
//   startDate: new Date(),
//   endDate: new Date()
// })

const seller = (props) => {
  const { selectList, selectList2, value, idx } = props

  const searchSelect = useRef(null)
  const searchSelect2 = useRef(null)
  const isMounted = useRef(true)

  const mktContext = useContext(MktContext)
  const userContext = useContext(UserContext)
  const history = useHistory()
  const location = useLocation()
  let path = location.pathname
  let page = path.split('/')[1]

  const [maximumAlert, setMaximumAlert] = useState(false)

  // ===== 상세화면 이동 : id
  const handleView = (id) => {
    history.push(`${ROUTER_NAMES.COMMERCE_MAIN_BANNER_VIEW}/${id}`)
  }

  // ===== 등록 이동 : type (type is eventListTab, eventStatusTab)
  const [alertMsg, setAlertMsg] = useState('')

  // ===== maximunAlert
  const handleMaximunAlert = () => {
    setMaximumAlert(!maximumAlert)
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // ========================
  /* state  */
  // ========================
  const [paramList, setParamList] = useState({
    page: 1,
    searchType: '', // 검색필터
    searchText: '', // 검색어
    priceSort: 'all' // sort
  })
  // 검색조건
  const [search, setSearch] = useState({
    bplcNm: '',
    prodNm: '',
    priceSort: 'all', // sort
    page: 1,
    record: 5
  })
  const [list, setList] = useState({
    isLoading: true,
    list: []
  })
  const [paging, setPaging] = useState(null)
  const [searchFilter, setSearchFilter] = useState({
    active: paramList.searchType !== '' ? paramList.searchType : 'bplcNm',
    list: [
      { id: 'bplcNm', value: 'bplcNm', label: '회사명' },
      { id: 'prodNm', value: 'prodNm', label: '상품명' }
    ]
  })
  const [filter, setFilter] = useState({
    active: search.priceSort !== '' ? search.priceSort : 'all',
    list: [
      { id: 'all', value: 'all', label: '전체' },
      { id: 'desc', value: 'desc', label: '높은 금액 순' },
      { id: 'asc', value: 'asc', label: '낮은 금액 순' }
    ]
  })

  const [detailArg, setDetailArg] = useState({
    falg: false,
    id: ''
  })

  // ===== filter: 높은 금액 순, 낮은 금액 순
  const onFilterActive = (selected) => {
    setFilter({
      ...filter,
      active: selected
    })
    setSearch({
      ...search,
      priceSort: selected,
      page: 1
    })
  }

  // ===== search
  const onSelectActive = (selected) => {
    setSearchFilter({
      ...searchFilter,
      active: selected
    })
  }

  // 검색조건 핸들러
  const handleSearch = useCallback(
    (params) => {
      setList({
        isLoading: true,
        list: []
      })

      if (params.bplcNm === undefined) {
        setSearch({
          ...search,
          page: 1,
          bplcNm: '',
          ...params
        })
      } else if (params.prodNm === undefined) {
        setSearch({
          ...search,
          page: 1,
          prodNm: '',
          ...params
        })
      }
    },
    [search]
  )

  const handleReset = () => {
    setSearch({
      ...search
    })
  }

  const getList = () => {
    getPriceSelrList(search, getPriceSelrListCallback, ErrorCallback)
  }

  const getPriceSelrListCallback = (res) => {
    if (res.data.code === '200' && isMounted.current) {
      const data = res.data.data
      setList({ isLoading: false, list: data.list })
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

  //에러콜백
  const ErrorCallback = () => {
    setList({
      isLoading: false,
      list: []
    })
    mktContext.actions.setCommonAlertInfo({
      type: 'error',
      active: true
    })
  }

  // ===== 페이징
  const handlePaging = (param) => {
    if (search.page != param.page) {
      setSearch({
        ...search,
        page: param.page
      })
    }
  }

  useEffect(() => {
    isMounted.current = true

    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    isMounted.current = true
    getList()
  }, [search])

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'price'} currentPage={'seller'}>
      {/* {maximumAlert && <PopupAlert msg={alertMsg} handlePopup={handleMaximunAlert} />} */}
      <div className="content_inner page_main">
        <div className="page_header">
          <h4 className="page_title">판매사 판매 금액</h4>
        </div>

        {/* <TermSearchForm searchDate={searchDate} setSearchDate={setSearchDate} getList={getList} /> */}
        {/*commerce_banner_wrap start*/}
        <div className="commerce_banner_wrap">
          <div className={'maximum_notice'}>
            <p className="highlight_grey">판매사의 판매 금액을 확인할 수 있습니다.</p>
          </div>
          <Search
            input={searchInput}
            onSearch={(params) => {
              handleSearch(params)
            }}
          />
          {/*tab_header start*/}
          <div className="tab_header">
            <div className="page_header_right">
              <div className="btn_group">
                <Select optionList={filter} ref={searchSelect2} handleSelectActive={onFilterActive} />
                <button className={'btn_refresh'} title={'새로고침'} onClick={handleReset}>
                  <span className="hide">새로고침</span>
                </button>
              </div>
            </div>
          </div>

          <SellerList dataList={list} paging={paging} handleView={handleView} setDetailArg={setDetailArg} />
          <div className="pagination_wrap">
            <Pagination pagingData={paging} handlePaging={handlePaging} />
          </div>
          <div className={detailArg.flag ? '' : 'hide'}>
            <SellerDetail detailArg={detailArg} setDetailArg={setDetailArg} />
          </div>
        </div>
        {/*commerce_banner_wrap end*/}
      </div>
    </PageLayout>
  )
}

export default seller
