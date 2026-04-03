import { useRef, useEffect, useContext, useLayoutEffect, useState } from 'react'

import PageLayout from 'components/PageLayout'
import Select from 'components/atomic/Select'
import NoResult from 'components/NoResult'
import Pagination from 'components/Pagination'
import SearchForm from 'components/SearchForm'
import { UserContext } from 'modules/common/UserContext'
import { useLocation } from 'react-router-dom'
import { getPriceSelrList } from 'modules/consts/MktApi'
import * as commonFn from 'modules/fns/commonFn'
import { getTotalNumberBoard } from 'modules/common'

const Seller = () => {
  const location = useLocation()
  let path = location.pathname
  let category = path.split('/')[3]
  const userContext = useContext(UserContext)
  const filterRef = useRef(null)

  // ========================
  /* state  */
  // ========================
  const [list, setList] = useState(null)
  const [paging, setPaging] = useState(null)
  const [paramList, setParamList] = useState({
    page: 1,
    searchType: '', // 검색필터
    searchText: '', // 검색어
    priceSort: '' // sort
  })
  const [filter, setFilter] = useState({
    active: paramList.priceSort !== '' ? paramList.priceSort : 'desc',
    list: [
      { id: 'desc', value: 'desc', label: '높은 금액 순' },
      { id: 'asc', value: 'asc', label: '낮은 금액 순' }
    ]
  })
  const [searchFilter, setSearchFilter] = useState({
    active: paramList.searchType !== '' ? paramList.searchType : 'bplcNm',
    list: [
      { id: 'bplcNm', value: 'bplcNm', label: '판매사명' },
      { id: 'rprsntvNm', value: 'rprsntvNm', label: '대표자명' }
    ]
  })
  const [searchInput, setSearchInput] = useState('')

  // ========================
  /* functions  */
  // ========================
  // ===== getList
  const getList = async () => {
    let res = await getPriceSelrList(paramList)
    if (res.data.code === '200') {
      const data = res.data.data
      setList(data.list)
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

  // ===== filter: 높은 금액 순, 낮은 금액 순
  const onFilterActive = (selected) => {
    setFilter({
      ...filter,
      active: selected
    })
    setParamList({
      ...paramList,
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
  const handleSearch = () => {
    let params = {
      ...paramList,
      searchType: searchFilter.active,
      searchText: searchInput ? searchInput : '',
      page: 1
    }
    setParamList(params)
  }

  // ===== reset
  const handleReset = () => {
    setParamList({
      page: 1,
      searchType: '', // 검색필터
      searchText: '', // 검색어
      priceSort: '' // sort
    })
    setSearchInput('')
  }

  // ===== paging
  const handlePaging = (param) => {
    setParamList({
      ...paramList,
      ...param
    })
  }

  useLayoutEffect(() => {
    if (category !== userContext.state.category) {
      userContext.actions.setCategory(category)
    }
  }, [userContext.state.category])

  useEffect(async () => {
    paramList && (await getList())
  }, [paramList])

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'price'} currentPage={'seller'}>
      <div className="content_inner page_price">
        <div className="page_header">
          <h4 className="page_title">판매사 별 총 판매 금액</h4>
          <div className="btn_group">
            <Select optionList={filter} ref={filterRef} handleSelectActive={onFilterActive} />
            <button className={'btn_refresh'} title={'새로고침'} onClick={handleReset}>
              <span className="hide">새로고침</span>
            </button>
          </div>
        </div>
        <div className="section price_seller_section">
          {!list || list.length === 0 ? (
            <div className="table_no_result">
              <NoResult />
            </div>
          ) : (
            <div className="table_wrap border_bottom_none table_th_border">
              <table className="table type02">
                <caption>판매사 별 총 판매 금액 테이블</caption>
                <colgroup>
                  <col width={'5%'} />
                  <col width={'*'} />
                  <col width={'16%'} />
                  <col width={'16%'} />
                  <col width={'16%'} />
                </colgroup>
                <thead>
                  <tr>
                    <th>NO</th>
                    <th>판매사명</th>
                    <th>대표자명</th>
                    <th>등록된 상품의 수</th>
                    <th>총 판매 금액(원)</th>
                  </tr>
                </thead>
                <tbody>
                  {list?.map((item, idx) => (
                    <tr key={commonFn.createKey()}>
                      <td className={'ta_center'}>
                        {paging && getTotalNumberBoard(paging.total, paging.page, paging.record, idx)}
                      </td>
                      <td className={'ta_center'}>{item.bplcNm}</td>
                      <td className={'ta_center'}>{item.rprsntvNm}</td>
                      <td className={'ta_center'}>
                        {item.totalPdfCnt ? commonFn.krwFormatter(item.totalPdfCnt) : 0}개
                      </td>
                      <td className={'ta_right'}>{item.totalPrc ? commonFn.krwFormatter(item.totalPrc) : 0}원</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className={'paging_wrap'}>
            {paging && <Pagination pagingData={paging} handlePaging={handlePaging} />}
          </div>
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

export default Seller
