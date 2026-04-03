import { useEffect, useState, useContext, useLayoutEffect } from 'react'
import { useHistory } from 'react-router-dom'
import PageLayout from 'components/PageLayout'
import Pagination from 'components/Pagination'
import SearchForm from 'components/SearchForm'
import NoResult from 'components/NoResult'
import { dateFormat, getTotalNumberBoard } from 'modules/common'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { getQnaList } from 'modules/consts/InvestApi'
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
  const [qnaList, setQnaList] = useState([])
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
      res = await getQnaList(params)
    } else {
      res = await getQnaList()
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
      setQnaList(response.list)
    }
  }

  // ====== 검색
  const handleSetSearchInput = (initial) => {
    // 렌더링시 조건값이 남아있으면 그대로 값 설정
    if (initial) {
      investContext.actions.handleSetSearch({
        searchContent: '', // 제목
        searchUser: '', // 작성자
        page: 1
      })
    } else {
      let searchContent = investContext.state.boardParam.searchContent
      let searchUser = investContext.state.boardParam.searchUser
      searchContent !== ''
        ? (onSelectActive('searchContent'), setSearchInput(searchContent))
        : searchUser !== ''
        ? (onSelectActive('searchUser'), setSearchInput(searchUser))
        : (onSelectActive('searchContent'), setSearchInput(''))
    }
  }
  const handleSearch = () => {
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

  // useEffect(async () => {
  //   if (category[2] !== userContext.state.category) {
  //     // 이전경로와 카테고리가 다른경우 검색 context 초기화
  //     handleReset()
  //   } else {
  //     if (
  //       investContext.state.boardParam.searchContent !== '' ||
  //       investContext.state.boardParam.searchUser !== '' ||
  //       investContext.state.boardParam.page !== 1
  //     ) {
  //       handleSetSearchInput() // 검색 세팅
  //     }
  //     await getList(investContext.state.boardParam)
  //   }
  // }, [investContext.state])

  return (
    <PageLayout currentMenu={'invest'} currentCate={'qna'}>
      <div className="content_inner page_qna">
        <h4 className="page_title ">Q&#38;A</h4>
        {/*section_header start*/}
        <div className="section_header mb_none">
          <p className="section_title">Q&#38;A 리스트</p>
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
            <caption>QNA 테이블</caption>
            <colgroup>
              <col width={'4%'} />
              <col width={'*'} />
              <col width={'10%'} />
              <col width={'8%'} />
              <col width={'25%'} />
              <col width={'8%'} />
            </colgroup>
            <thead>
              <tr>
                <th>NO</th>
                <th>제목</th>
                <th>작성자</th>
                <th>타입</th>
                <th>신청날짜</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {(!qnaList || qnaList.length === 0) && (
                <tr>
                  <td colSpan={6}>
                    <NoResult />
                  </td>
                </tr>
              )}
              {qnaList.map((qna, idx) => (
                <tr key={'qna_board_item_' + idx}>
                  <td className={'ta_center'}>{getTotalNumberBoard(paging.total, paging.page, paging.record, idx)}</td>
                  <td>
                    <p
                      className="text_ellipsis"
                      onClick={() => history.push(`${ROUTER_NAMES.INVEST_QNA_VIEW}/${qna.inqrSbjcId}`)}
                    >
                      {qna.inqrSbjcTtl}
                    </p>
                  </td>
                  {/*<td className={'ta_center'}>{qna.rgsnUserId}</td>*/}
                  <td className={'ta_center'}>{qna.rgsnUserNm}</td>
                  {/*@todo qna 타입 추후 추가 예정*/}
                  <td className={'ta_center'}>{qna.inqrDsncNm ? qna.inqrDsncNm : ''}</td>
                  <td className={'ta_center'}>{dateFormat(qna.rgsnTs)}</td>
                  <td
                    className={`ta_center ${qna.pgstNm === '대기' ? 'status_ready' : ''} ${
                      qna.pgstNm === '취소' ? 'status_cancel' : ''
                    }`}
                  >
                    {qna.pgstNm}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/*table_wrap end*/}
        <div className={'paging_wrap'}>{paging && <Pagination pagingData={paging} handlePaging={handlePaging} />}</div>
        <SearchForm
          selectList={selectList}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          onSelectActive={onSelectActive}
          handleSearch={handleSearch}
        />
      </div>
    </PageLayout>
  )
}

export default List
