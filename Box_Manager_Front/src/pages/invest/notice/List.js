import { useEffect, useState, useContext, useLayoutEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import Checkbox from 'components/atomic/Checkbox'
import Pagination from 'components/Pagination'
import SearchForm from 'components/SearchForm'
import NoResult from 'components/NoResult'
import PopupConfirm from 'components/PopupConfirm'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { handleConfirmDelete } from 'modules/fns/invest/noticeFn'
import { deleteNoticeDetail, getNoticeList } from 'modules/consts/InvestApi'
import { dateFormat, getTotalNumberBoard } from 'modules/common'
import { loader } from 'modules/utils/CommonAxios'
import { InvestContext } from 'modules/common/InvestContext'
import { UserContext } from 'modules/common/UserContext'

const List = () => {
  const location = useLocation()
  let path = location.pathname
  let category = path.split('/')
  const userContext = useContext(UserContext)
  const { userInfo } = userContext.state
  const investContext = useContext(InvestContext)
  const history = useHistory()
  // notice data
  const [noticeCheckAll, setNoticeCheckAll] = useState({ id: 'notice_chk_all', value: '', status: false })
  const [noticeList, setNoticeList] = useState([])
  const [paging, setPaging] = useState({})
  const [confirmDelete, setConfirmDelete] = useState(false)
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
      res = await getNoticeList(params)
    } else {
      res = await getNoticeList()
    }
    if (res.data.code === '200') {
      setPaging({
        endPage: res.data.data.endPage,
        next: res.data.data.next,
        page: res.data.data.page,
        prev: res.data.data.prev,
        record: res.data.data.record,
        startPage: res.data.data.startPage,
        total: res.data.data.total,
        totalPage: res.data.data.totalPage
      })
      handleSetCheckbox(res.data.data.list) //  데이터 목록 + 선택 체크박스 추가
    }
  }
  // 목록 불러온 후 체크박스 설정
  const handleSetCheckbox = (data) => {
    let tempList = data.map((d) => (d['checkbox'] = { ...d, checkbox: { id: d.pbnsId, value: '', status: false } }))
    setNoticeList(tempList)
  }

  // ===== 체크박스
  // 삭제할 공지사항 목록 선택
  const handleCheckbox = (e, id) => {
    let newList = []
    if (id === 'notice_chk_all') {
      newList = noticeList.map(
        (list) =>
          e.target.id === 'notice_chk_all' && { ...list, checkbox: { ...list.checkbox, status: e.target.checked } }
      )
      setNoticeCheckAll({
        ...noticeCheckAll,
        status: e.target.checked
      })
    } else {
      if (e.target.id === false) {
        setNoticeCheckAll({
          ...noticeCheckAll,
          status: false
        })
      }
      newList = noticeList.map((list) =>
        list.checkbox.id === e.target.id ? { ...list, checkbox: { ...list.checkbox, status: e.target.checked } } : list
      )
    }
    handleCheckAll(newList)
    setNoticeList(newList)
  }
  // 목록에서 체크박스가 전체 체크되었는지 확인
  const handleCheckAll = (list) => {
    let cnt = 0
    for (let i = 0; i < list.length; i++) {
      if (list[i].checkbox.status) {
        cnt++
      }
    }
    cnt === list.length
      ? setNoticeCheckAll({
          ...noticeCheckAll,
          status: true
        })
      : setNoticeCheckAll({
          ...noticeCheckAll,
          status: false
        })
  }

  // 전체 체크박스 해제
  const handleCheckboxReset = () => {
    setNoticeCheckAll({ ...noticeCheckAll, status: false })
    let resetList = noticeList.map((notice) => ({ ...notice, checkbox: { ...notice.checkbox, status: false } }))
    setNoticeList(resetList)
  }

  // ====== 삭제
  const handleNoticeDelete = async (type) => {
    const params = handleDelete(type, setConfirmDelete, handleCheckboxReset, noticeList)
    if (params) {
      const data = {
        list: params,
        adminUser: userContext.actions.getIvtAdminUser()
      }
      loader(true, 'Uploading...')
      const res = await deleteNoticeDetail(data)
      if (res.data.code === '200') {
        setConfirmDelete(false)
        setNoticeCheckAll({
          ...noticeCheckAll,
          status: false
        })
        loader()
        await getList()
      } else {
        alert('시스템오류입니다. 관리자에게 문의하세요')
      }
    }
  }

  const handleDelete = (type, setConfirmDelete, handleCheckboxReset, noticeList) => {
    if (type === 'cancel') {
      if (handleCheckboxReset) {
        handleCheckboxReset()
        setConfirmDelete(false)
      }
    } else {
      let deleteList = noticeList.filter((obj) => obj.checkbox.status === true)
      let deleteIdList = []
      for (let i = 0; i < deleteList.length; i++) {
        deleteIdList.push(deleteList[i].pbnsId)
      }
      return deleteIdList
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

  return (
    <PageLayout currentMenu={'invest'} currentCate={'notice'}>
      {confirmDelete && (
        <PopupConfirm msg={'선택하신 항목들을 \n정말 삭제하시겠습니까?'}>
          <>
            <Button className={'full_grey_dark'} onClick={() => handleNoticeDelete('cancel')}>
              취소
            </Button>
            <Button className={'full_blue'} onClick={() => handleNoticeDelete('confirm')}>
              확인
            </Button>
          </>
        </PopupConfirm>
      )}
      {/*삭제 컨펌 팝업 end */}
      <div className="content_inner page_notice">
        <h4 className="page_title">공지사항</h4>
        {/*section_header start*/}
        <div className="section_header">
          <p className="section_title">공지사항</p>
          <div className="button_group">
            <p className="total">총 {paging ? paging?.total : 0}건</p>
            {userInfo?.supMngrYn === 'Y' && (
              <Button
                className={'full_blue'}
                onClick={() => handleConfirmDelete(confirmDelete, setConfirmDelete, setNoticeCheckAll, noticeList)}
              >
                삭제
              </Button>
            )}
            <Button className={'full_blue'} onClick={() => history.push(`${ROUTER_NAMES.INVEST_NOTICE_WRITE}`)}>
              등록
            </Button>
            <button className={'btn_refresh'} title={'새로고침'} onClick={handleReset}>
              <span className="hide">새로고침</span>
            </button>
          </div>
        </div>
        {/*section_header end*/}
        {/*table_wrap start*/}
        <div className="table_wrap">
          <table className="table">
            <caption>공지사항 테이블</caption>
            <colgroup>
              {userInfo?.supMngrYn === 'Y' && <col width={'4%'} />}
              <col width={'5%'} />
              <col width={'*'} />
              <col width={'10%'} />
              <col width={'25%'} />
            </colgroup>
            <thead>
              <tr>
                {userInfo?.supMngrYn === 'Y' && (
                  <th>
                    <Checkbox
                      key={noticeCheckAll.id}
                      checkbox={noticeCheckAll}
                      onChange={(e) => handleCheckbox(e, noticeCheckAll.id)}
                      checked={noticeCheckAll.status}
                    />
                  </th>
                )}
                <th>NO</th>
                <th>제목</th>
                <th>작성자</th>
                <th>작성일</th>
              </tr>
            </thead>

            <tbody>
              {(!noticeList || noticeList.length === 0) && (
                <tr>
                  <td colSpan={5}>
                    <NoResult />
                  </td>
                </tr>
              )}
              {noticeList.map((notice, idx) => (
                <tr
                  key={'notice_item_' + idx}
                  onClick={(e) =>
                    e.target.nodeName !== 'LABEL' &&
                    e.target.nodeName !== 'INPUT' &&
                    history.push(`${ROUTER_NAMES.INVEST_NOTICE_VIEW}/${notice.pbnsId}`)
                  }
                >
                  {userInfo?.supMngrYn === 'Y' && (
                    <td>
                      <Checkbox
                        key={notice.checkbox.id}
                        checkbox={notice.checkbox}
                        onChange={(e) => handleCheckbox(e, notice.checkbox.id)}
                        checked={notice.checkbox.status}
                      />
                    </td>
                  )}

                  <td className={'ta_center'}>{getTotalNumberBoard(paging.total, paging.page, paging.record, idx)}</td>
                  <td>
                    <p className="notice_title text_ellipsis">{notice.pbnsTtl}</p>
                  </td>
                  <td className={'ta_center'}>{notice.rgsnUserId ? notice.rgsnUserId : '-'}</td>
                  <td className={'ta_center'}>{dateFormat(notice.rgsnTs)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/*table_wrap end*/}
        <div className={'paging_wrap'}>
          {paging && <Pagination searchInput={searchInput} pagingData={paging} handlePaging={handlePaging} />}
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
    </PageLayout>
  )
}

export default List
