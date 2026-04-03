import { useEffect, useState, useContext, useLayoutEffect } from 'react'
import { useHistory } from 'react-router-dom'

import PageLayout from 'components/PageLayout'
import Pagination from 'components/Pagination'
import SearchForm from 'components/SearchForm'
import NoResult from 'components/NoResult'
import { dateFormat, getTotalNumberBoard } from 'modules/common'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { getConsultList } from 'modules/consts/InvestApi'
import { InvestContext } from 'modules/common/InvestContext'
import { UserContext } from 'modules/common/UserContext'
import { useLocation } from 'react-router-dom'

const List = () => {
  const location = useLocation()
  let path = location.pathname
  let category = path.split('/')

  const userContext = useContext(UserContext)
  const investContext = useContext(InvestContext)
  const history = useHistory()
  const [consultList, setConsultList] = useState([])
  const [paging, setPaging] = useState({})
  const [searchInput, setSearchInput] = useState('') // 검색
  const [selectList, setSelectList] = useState({
    active: 'searchContent',
    list: [
      { id: 'searchContent', value: 'searchContent', label: '제목+내용' },
      { id: 'searchUser', value: 'searchUser', label: '작성자' }
    ]
  })

  // ===== 목록조회
  const getList = async (params) => {
    let res
    if (params) {
      res = await getConsultList(params)
    } else {
      res = await getConsultList()
    }
    if (res.data.code === '200') {
      const response = res.data.data
      setPaging({
        endPage: response.endPage,
        next: response.next,
        page: response.page,
        prev: response.prev,
        record: response.record,
        startPage: response.startPage,
        total: response.total,
        totalPage: response.totalPage
      })
      setConsultList(response.list)
    }
  }

  // ====== 검색
  const handleSetSearchInput = (initial) => {
    if (initial) {
      investContext.actions.handleSetSearch({
        searchContent: '', // 제목
        searchUser: '', // 작성자
        page: 1
      })
    } else {
      // 렌더링시 조건값이 남아있으면 그대로 값 설정
      let searchContent = investContext.state.boardParam.searchContent
      let searchUser = investContext.state.boardParam.searchUser
      searchContent !== ''
        ? (onSelectActive('searchContent'), setSearchInput(searchContent))
        : searchUser !== ''
        ? (onSelectActive('searchUser'), setSearchInput(searchUser))
        : (onSelectActive('searchContent'), setSearchInput(''))
    }
  }

  const handleSearch = async () => {
    // 검색 클릭시 페이지 초기화, 조건중 나머지값 초기화
    let params = {}
    const _searchInput = searchInput.trim()
    selectList.active === 'searchContent'
      ? (params = {
          page: 1,
          searchContent: _searchInput,
          searchUser: ''
        })
      : (params = {
          page: 1,
          searchContent: '',
          searchUser: _searchInput
        })
    investContext.actions.handleSetSearch(params)
  }

  // 검색 조건
  const onSelectActive = (selected) => {
    setSelectList({
      ...selectList,
      active: selected
    })
  }

  // ===== 페이징
  const handlePaging = (param) => {
    let params = {
      ...investContext.state.boardParam,
      ...param
    }
    investContext.actions.handleSetSearch(params)
  }

  // ===== 초기화
  const handleReset = () => {
    investContext.actions.initialize()
    handleSetSearchInput(true) // 검색 세팅
    setSearchInput('')
  }

  useLayoutEffect(() => {
    if (category[2] !== userContext.state.category) {
      userContext.actions.setCategory(category[2])
      handleReset()
    }
  }, [userContext.state.category])

  useEffect(async () => {
    if (category[2] === userContext.state.category) {
      if (
        investContext.state.boardParam.searchContent !== '' ||
        investContext.state.boardParam.searchUser !== '' ||
        investContext.state.boardParam.page !== 1
      ) {
        handleSetSearchInput() // 검색 세팅
      }
    }
    await getList(investContext.state.boardParam)
  }, [investContext.state.boardParam])

  return (
    <PageLayout currentMenu={'invest'} currentCate={'consult'}>
      <div className="content_inner page_consult list">
        <h4 className="page_title ">컨설팅</h4>
        {/*section_header start*/}
        <div className="section_header mb_none">
          <p className="section_title">컨설팅 리스트</p>
          <div className="btn_group">
            <button className={'btn_refresh'} title={'새로고침'} onClick={handleReset}>
              <span className="hide">새로고침</span>
            </button>
          </div>
        </div>
        {/*section_header end*/}
        {/*table_wrap start*/}
        <div className="table_wrap">
          <table className="table">
            <caption>컨설팅 테이블</caption>
            <colgroup>
              <col width={'4%'} />
              <col width={'*'} />
              <col width={'20%'} />
              <col width={'8%'} />
              <col width={'8%'} />
              <col width={'20%'} />
              <col width={'8%'} />
            </colgroup>
            <thead>
              <tr>
                <th>NO</th>
                <th>제목</th>
                <th>회사명</th>
                <th>작성자</th>
                <th>타입</th>
                <th>신청날짜</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {!consultList || consultList.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <NoResult />
                  </td>
                </tr>
              ) : (
                consultList.map((consult, idx) => (
                  <tr
                    key={'consult_board_item_' + idx}
                    onClick={() => history.push(`${ROUTER_NAMES.INVEST_CONSULT_VIEW}/${consult.cnsgReqsId}`)}
                  >
                    <td className={'ta_center'}>
                      {getTotalNumberBoard(paging.total, paging.page, paging.record, idx)}
                    </td>
                    <td>
                      <p className="text_ellipsis">{consult.cnsgReqsTtl}</p>
                    </td>
                    <td className={'ta_center'}>{consult.reqsInttNm}</td>
                    <td className={'ta_center'}>{consult.rgsnUserNm ? consult.rgsnUserNm : '-'}</td>
                    <td className={'ta_center'}>{consult.cnsgPtrnNm}</td>
                    <td className={'ta_center'}>{dateFormat(consult.rgsnTs)}</td>
                    <td className={
                      `ta_center ${consult.cnsgSttsNm === '대기' ? 'status_ready' : ''} ${consult.cnsgSttsNm === '취소' ? 'status_cancel' : ''}`
                    }
                    >
                      {consult.cnsgSttsNm}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/*table_wrap end*/}
        <div className={'paging_wrap'}>{paging && <Pagination pagingData={paging} handlePaging={handlePaging} />}</div>
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
    </PageLayout>
  )
}

export default List
