import { useHistory, useLocation } from 'react-router-dom'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { getTotalNumberBoard } from 'modules/common'
import { useState, useEffect, useContext, useLayoutEffect } from 'react'
import { MktContext } from 'modules/common/MktContext'
import { UserContext } from 'modules/common/UserContext'
import PageLayout from 'components/PageLayout'
import NoResult from 'components/NoResult'
import Button from 'components/atomic/Button'
import Pagination from 'components/Pagination'
import SearchForm from 'components/SearchForm'
import { getProdSellerList } from 'modules/consts/MktApi'
import { loader } from 'modules/utils/CommonAxios'
import BoxUrl from "modules/consts/BoxUrl";

const List = () => {
  const location = useLocation()
  let path = location.pathname
  let category = path.split('/')[2]
  const mktContext = useContext(MktContext)
  const userContext = useContext(UserContext)
  const history = useHistory()

  const [prodList, setProdList] = useState(null)
  const [paging, setPaging] = useState(null)
  // search
  const [searchInput, setSearchInput] = useState('') // 검색
  const [selectList, setSelectList] = useState({
    active: 'searchCompanyName',
    list: [
        { id: 'searchCompanyName', value: 'searchCompanyName', label: '회사명' },
        { id: 'searchRprsntvName', value: 'searchRprsntvName', label: '대표자명' }
    ]
  })

  // ===== 목록 조회
  const getList = async (param) => {
    loader(true, 'Uploading...')
    let res = await getProdSellerList(param)
    if (res.data.code === '200') {
      let data = res.data.data
      setProdList(data.list)
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
      loader()
    }
  }

  // ===== 하단 검색
  // 검색 조건
  const handleSetSearchInput = (initial) => {
    // 렌더링시 조건값이 남아있으면 그대로 값 설정
    if (initial) {
      mktContext.actions.handleProdParam(null)
    } else {
      mktContext.state.prodParam.searchCompanyName !== ''
        ? (onSelectActive('searchCompanyName'), setSearchInput(mktContext.state.prodParam.searchCompanyName))
        : (onSelectActive('searchRprsntvName'), setSearchInput(mktContext.state.prodParam.searchRprsntvName))
    }
  }

  const onSelectActive = (selected, label) => {
    setSelectList({
      ...selectList,
      active: selected
    })
  }
  const handleSearch = () => {

    // 검색 클릭시 페이지 초기화, 조건중 나머지값 초기화
    const _searchInput = searchInput?.trim()

    let params = {page: 1}

    if(selectList.active === 'searchCompanyName') {
      params = {
        page: 1,
        searchCompanyName: _searchInput,
        searchRprsntvName: ""
      }
    }

    if(selectList.active === 'searchRprsntvName') {
      params = {
        page: 1,
        searchCompanyName: "",
        searchRprsntvName: _searchInput
      }
    }
    mktContext.actions.handleProdParam(params)
  }

  // ===== 페이지 이동
  const linktoView = (id) => {
    history.push(`${ROUTER_NAMES.COMMERCE_PROD_VIEW}/${id}`)
  }

  // ===== 페이징
  const handlePaging = async (param) => {
    console.log(param)
    let params = {
      ...mktContext.state.prodParam,
      ...param
    }
    mktContext.actions.handleProdParam(params)
  }

  // ===== reset
  const handleReset = async () => {
    mktContext.actions.handleProdParam(null)
    handleSetSearchInput(true)
    await getList()
  }

  useEffect(async () => {
    setProdList(null)
    if (userContext.state.category !== category) {
      await handleReset()
    } else {
      handleSetSearchInput()
      await getList(mktContext.state.prodParam)
    }
  }, [mktContext.state.prodParam])

  useLayoutEffect(() => {
    if (category !== userContext.state.category) {
      userContext.actions.setCategory(category)
    }
  }, [userContext.state.category])

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'prod'}>
      <div className="content_inner page_prod">
        <div className="page_header">
          <h4 className="page_title">판매사 상품 관리</h4>
          <button className={'btn_refresh'} title={'새로고침'} onClick={handleReset}>
            <span className="hide">새로고침</span>
          </button>
        </div>
        {/*section start*/}
        <div className="section seller_list_section">
          {!prodList || prodList.length === 0 ? (
            <div className="table_no_result">
              <NoResult />
            </div>
          ) : (
            <div className="table_wrap border_bottom_none table_th_border">
              <table className="table type02">
                <caption>메인 배너 관리 테이블</caption>
                <colgroup>
                  <col width={'5%'} />
                  <col width={'*'} />
                  <col width={'10%'} />
                  <col width={'12%'} />
                  <col width={'12%'} />
                  <col width={'14%'} />
                  <col width={'14%'} />
                </colgroup>
                <thead>
                  <tr>
                    <th>NO</th>
                    <th>회사명</th>
                    <th>대표자명</th>
                    <th>회원타입</th>
                    <th>등록 상품 수</th>
                    <th>에이전시 상품 수</th>
                    <th>바로가기</th>
                  </tr>
                </thead>
                <tbody>
                  {prodList?.map((item, idx) => (
                    <tr key={'main_bind_item_' + idx}>
                      <td className={'ta_center'}>
                        {paging && getTotalNumberBoard(paging.total, paging.page, paging.record, idx)}
                      </td>
                      <td className={'ta_center'}>{item.bplcNm}</td>
                      <td className={'ta_center'}>{item.rprsntvNm}</td>
                      <td className={'ta_center'}>{item.mmbrtypeNm}</td>
                      <td className={'ta_center'}>{item.prdtCnt ? item.prdtCnt : 0}</td>
                      <td className={'ta_center'}>{item.agtPrdtCnt ? item.agtPrdtCnt : 0}</td>
                      <td className={'ta_center'}>
                        <div className="btn_group">
                          <Button
                            className={'basic'}
                            onClick={() =>
                              window.open(
                                // `${process.env.REACT_APP_MKT_API_URL}/sellerstore/${item.selrUsisId}`,
                                `${BoxUrl.getMarketBoxUrl(process.env.REACT_APP_PROFILE)}/sellerstore/${item.selrUsisId}`,
                                '_blank'
                              )
                            }
                          >
                            판매사상점 이동
                          </Button>
                          <Button className={'basic'} onClick={() => linktoView(item.selrUsisId)}>
                            상품 목록 보기
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className={'paging_wrap'}>
            {paging && <Pagination pagingData={paging} handlePaging={handlePaging} />}
          </div>
          {selectList && (
            <SearchForm
              selectList={selectList}
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              onSelectActive={onSelectActive}
              handleSearch={handleSearch}
            />
          )}
        </div>
        {/*section end*/}
      </div>
    </PageLayout>
  )
}

export default List
