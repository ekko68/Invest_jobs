import PageLayout from 'components/PageLayout'
import Pagination from 'components/Pagination'
import Button from 'components/atomic/Button'
import Select from 'components/atomic/Select'
import { MktContext } from 'modules/common/MktContext'
import {
  deleteSearchApiV2,
  getPopularSearchListApiV2,
  getRecommendSearchListApiV2,
  getSearchListApiV2,
  saveSearchOrder,
  updateToggleApiV2
} from 'modules/consts/MktApi'
import SearchTable from 'pageComponents/commerce/management/search/SearchTable'
import PopularSearchPopup from 'pageComponents/commerce/management/search/popular/PopularSearchPopup'
import PopularSearchTable from 'pageComponents/commerce/management/search/popular/PopularSearchTable'
import RecommendSearchTable from 'pageComponents/commerce/management/search/recommend/RecommendSearchTable'
import RecommentSearchPopup from 'pageComponents/commerce/management/search/recommend/RecommentSearchPopup'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'

const Search = () => {
  const mktContext = useContext(MktContext)
  const isMounted = useRef(true)

  const [isOpenRegist, setIsOpenRegist] = useState(false)
  const [isOpenRegist2, setIsOpenRegist2] = useState(false)
  const [paging, setPaging] = useState(null)
  const [search, setSearch] = useState({
    page: 1,
    record: 10
  })

  const [searchData, setSearchData] = useState({
    isLoading: true,
    list: []
  })

  const [recommendSearchData, setRecommendSearchData] = useState({
    isLoading: true,
    list: []
  })

  const [popularSearchData, setPopularSearchData] = useState({
    isLoading: true,
    list: []
  })

  const filterRef = useRef(null)
  const [filter, setFilter] = useState({
    active: '10',
    list: [
      { id: '10', label: '10' },
      { id: '50', label: '50' }
    ]
  })

  const [delRcmdInfIds, setDelRcmdInfIds] = useState([])
  const [editId, setEditId] = useState(null)

  // 탭
  const tabList = {
    active: mktContext.state.searchType,
    list: [
      { id: 'search', label: '검색' },
      { id: 'recommendSearchTerms', label: '추천검색어' },
      { id: 'popularSearches', label: '인기검색어' }
    ]
  }

  // 필터
  const onFilterActive = (selected) => {
    setSearch({
      ...search,
      page: 1,
      record: selected
    })
    setFilter({
      ...filter,
      active: selected
    })
  }

  useEffect(() => {
    isMounted.current = true
    if (tabList.active === 'search') {
      getSearchList(search)
    } else if (tabList.active === 'recommendSearchTerms') {
      getRecommendSearchList()
    } else if (tabList.active === 'popularSearches') {
      getPopularSearchList()
    }
  }, [search, tabList.active])

  useEffect(() => {
    const saveData = async () => {
      saveSearchOrder(recommendSearchData)
    }
    saveData()
  }, [recommendSearchData])

  useEffect(() => {
    const savePopData = async () => {
      saveSearchOrder(popularSearchData)
    }
    savePopData()
  }, [popularSearchData])

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  // 초기화
  const getInitSearchList = useCallback(() => {
    setSearchData({
      isLoading: true,
      list: []
    })
    setRecommendSearchData({
      isLoading: true,
      list: []
    })
    setPopularSearchData({
      isLoading: true,
      list: []
    })
    setFilter({
      ...filter,
      active: '10'
    })
    setSearch({
      page: 1,
      record: 10
    })
  }, [filter])

  //검색
  const getSearchList = useCallback((params) => {
    getSearchListApiV2(params, handleSearchListCallback(setSearchData), handleSearchListErrorCallback(setSearchData))
  }, [])

  //추천 검색어
  const getRecommendSearchList = useCallback((params) => {
    getRecommendSearchListApiV2(
      params,
      handleSearchListCallback(setRecommendSearchData),
      handleSearchListErrorCallback(setRecommendSearchData)
    )
  }, [])

  //인기 검색어
  const getPopularSearchList = useCallback((params) => {
    getPopularSearchListApiV2(
      params,
      handleSearchListCallback(setPopularSearchData),
      handleSearchListErrorCallback(setPopularSearchData)
    )
  }, [])

  //검색
  const handleSearchListCallback = (setData) => (res) => {
    if (res.data.code === '200' && isMounted.current) {
      const data = res.data.data
      setData({
        isLoading: false,
        list: data?.list
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

  //검색
  const handleSearchListErrorCallback = (setData) => () => {
    setData({
      isLoading: false,
      list: []
    })
    mktContext.actions.setCommonAlertInfo({
      type: 'error',
      active: true
    })
  }

  // ===== 탭
  const handleTab = async (selected) => {
    mktContext.actions.handleSetSearchCurrType(selected)
    setSearch({
      page: 1,
      record: 10
    })
    setPaging(null)
    if (selected === 'search') {
      setSearchData({
        isLoading: true,
        list: []
      })
    } else if (selected === 'recommendSearchTerms') {
      setRecommendSearchData({
        isLoading: true,
        list: []
      })
    } else if (selected === 'popularSearches') {
      setPopularSearchData({
        isLoading: true,
        list: []
      })
    }
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

  //검색어 삭제
  const handleDelete = () => {
    if (delRcmdInfIds?.length > 0) {
      for (let search of delRcmdInfIds) {
        if (search.oppbYn === 'Y') {
          mktContext.actions.setCommonAlertInfo({
            type: 'alert',
            active: true,
            msg: '공개 검색어는 삭제가 불가능 합니다.'
          })
          return false
        }
      }
      mktContext.actions.setCommonAlertInfo({
        type: 'function',
        active: true,
        msg: '삭제 하시겠습니까?',
        btnMsg: '취소',
        btnMsg2: '확인',
        action2: () => {
          deleteSearchApiV2(
            delRcmdInfIds.map((_item) => _item.srwdInfId),
            handleDeleteCallback,
            handleDeleteErrorCallback
          )
          setDelRcmdInfIds([])
        }
      })
    } else {
      mktContext.actions.setCommonAlertInfo({
        type: 'alert',
        active: true,
        msg: '삭제할 검색어를 선택해주세요.'
      })
    }
  }

  //상태값 update
  const handleToggle = (type) => (item) => {
    const recommentCnt = recommendSearchData.list.filter((data) => data.oppbYn === 'Y').length
    const popularCnt = popularSearchData.list.filter((data) => data.oppbYn === 'Y').length
    if (item.oppbYn === 'N') {
      if (type === 'recommend' && recommentCnt >= 5) {
        mktContext.actions.setCommonAlertInfo({
          type: 'alert',
          active: true,
          msg: '추천 검색어는 5개 이상 설정할 수 없습니다.'
        })
        return
      }

      if (type === 'popular' && popularCnt >= 5) {
        mktContext.actions.setCommonAlertInfo({
          type: 'alert',
          active: true,
          msg: '인기 검색어는 5개 이상 설정할 수 없습니다.'
        })
        return
      }
    }
    const updateItem = { ...item, oppbYn: item.oppbYn === 'Y' ? 'N' : 'Y' }
    updateToggleApiV2(updateItem, handleDeleteCallback, handleDeleteErrorCallback)
  }

  //수정, 삭제 후처리
  const handleDeleteCallback = () => {
    getInitSearchList()
  }

  //수정, 삭제 실패시
  const handleDeleteErrorCallback = () => () => {
    mktContext.actions.setCommonAlertInfo({
      type: 'error',
      active: true
    })
  }

  const goEditPage = (id) => {
    setEditId(id)
    setIsOpenRegist(true)
  }

  const goEditPage2 = (id) => {
    setEditId(id)
    setIsOpenRegist2(true)
  }

  const handleClosePopup = () => {
    setIsOpenRegist(false)
    setEditId(null)
    getInitSearchList()
  }

  const handleClosePopup2 = () => {
    setIsOpenRegist2(false)
    setEditId(null)
    getInitSearchList()
  }

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'search'}>
      {isOpenRegist && (
        <RecommentSearchPopup
          initialEditId={editId}
          onClosePopup={handleClosePopup}
          recommendSearchData={recommendSearchData}
        />
      )}
      {isOpenRegist2 && (
        <PopularSearchPopup
          initialEditId={editId}
          onClosePopup={handleClosePopup2}
          popularSearchData={popularSearchData}
        />
      )}
      <div className="content_inner page_main">
        <div className="page_header">
          <h4 className="page_title">검색 관리</h4>
        </div>

        {/*commerce_banner_wrap start*/}
        <div className="commerce_banner_wrap">
          <div className={'maximum_notice'}>
            <p className="require highlight_grey">추천 / 인기 검색어를 설정 합니다.</p>
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
                <button
                  className={'btn_refresh'}
                  title={'새로고침'}
                  onClick={() => {
                    getInitSearchList()
                  }}
                >
                  <span className="hide">새로고침</span>
                </button>
              </div>
            </div>
          </div>
          {tabList.active === 'search' ? (
            <>
              <div className="button_group_right">
                <Select
                  className="selectSmall"
                  optionList={filter}
                  ref={filterRef}
                  handleSelectActive={onFilterActive}
                />
              </div>
              <SearchTable dataList={searchData} paging={paging} />
              <div className="pagination_wrap">
                <Pagination pagingData={paging} handlePaging={handlePaging} />
              </div>
            </>
          ) : tabList.active === 'recommendSearchTerms' ? (
            <>
              <div className="button_group_right">
                <Button className={'full_grey_dark'} onClick={handleDelete}>
                  삭제
                </Button>

                <Button className={'full_blue'} onClick={() => setIsOpenRegist(true)}>
                  등록
                </Button>
              </div>
              <RecommendSearchTable
                dataList={recommendSearchData}
                setDataList={setRecommendSearchData}
                goEditPage={goEditPage}
                delRcmdInfIds={delRcmdInfIds}
                setDelRcmdInfIds={setDelRcmdInfIds}
                handleToggle={handleToggle('recommend')}
              />
            </>
          ) : tabList.active === 'popularSearches' ? (
            <>
              <div className="button_group_right">
                <Button className={'full_grey_dark'} onClick={handleDelete}>
                  삭제
                </Button>

                <Button className={'full_blue'} onClick={() => setIsOpenRegist2(true)}>
                  등록
                </Button>
              </div>
              <PopularSearchTable
                dataList={popularSearchData}
                setDataList={setPopularSearchData}
                goEditPage2={goEditPage2}
                delRcmdInfIds={delRcmdInfIds}
                setDelRcmdInfIds={setDelRcmdInfIds}
                handleToggle={handleToggle('popular')}
              />
            </>
          ) : (
            ''
          )}
        </div>
        {/*commerce_banner_wrap end*/}
      </div>
    </PageLayout>
  )
}

export default Search
