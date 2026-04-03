import { useContext, useEffect, useState, useLayoutEffect } from 'react'

import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import Checkbox from 'components/atomic/Checkbox'
import Pagination from 'components/Pagination'
import SearchForm from 'components/SearchForm'
import NoResult from 'components/NoResult'
import PopupConfirm from 'components/PopupConfirm'
import { useHistory } from 'react-router-dom'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { deleteDocDetail, getDocList } from 'modules/consts/InvestApi'
import { dateFormat, getTotalNumberBoard } from 'modules/common'
import { handleConfirmDelete } from 'modules/fns/invest/noticeFn'
import { loader } from 'modules/utils/CommonAxios'
import { InvestContext } from 'modules/common/InvestContext'
import { useLocation } from 'react-router-dom'
import { UserContext } from 'modules/common/UserContext'

const List = () => {
  const location = useLocation()
  let path = location.pathname
  let category = path.split('/')
  const history = useHistory()
  const investContext = useContext(InvestContext)
  const userContext = useContext(UserContext)
  const { userInfo } = userContext.state

  // document data
  const [documentCheckAll, setDocumentCheckAll] = useState({ id: 'document_chk_all', value: '', status: false })
  const [documentList, setDocumentList] = useState([])
  const [paging, setPaging] = useState({})
  const [confirmDelete, setConfirmDelete] = useState(false) // 삭제 컴펌
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
      res = await getDocList(params)
    } else {
      res = await getDocList()
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
      handleSetCheckbox(response.list)
    }
  }
  // 목록 불러온 후 체크박스 설정
  const handleSetCheckbox = (data) => {
    let tempList = data.map((d) => (d['checkbox'] = { ...d, checkbox: { id: d.dcmnId, value: '', status: false } }))
    setDocumentList(tempList)
  }

  // ===== 체크박스
  // 삭제할 목록 선택
  const handleCheckbox = (e, id) => {
    let newList = []
    if (id === 'document_chk_all') {
      newList = documentList.map(
        (list) =>
          e.target.id === 'document_chk_all' && { ...list, checkbox: { ...list.checkbox, status: e.target.checked } }
      )
      setDocumentCheckAll({
        ...documentCheckAll,
        status: e.target.checked
      })
    } else {
      if (e.target.id === false) {
        setDocumentCheckAll({
          ...documentCheckAll,
          status: false
        })
      }
      newList = documentList.map((list) =>
        list.checkbox.id === e.target.id ? { ...list, checkbox: { ...list.checkbox, status: e.target.checked } } : list
      )
    }
    handleCheckAll(newList)
    setDocumentList(newList)
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
      ? setDocumentCheckAll({
          ...documentCheckAll,
          status: true
        })
      : setDocumentCheckAll({
          ...documentCheckAll,
          status: false
        })
  }
  // 전체 체크박스 해제
  const handleCheckboxReset = () => {
    setDocumentCheckAll({ ...documentCheckAll, status: false })
    let resetList = documentList.map((data) => ({ ...data, checkbox: { ...data.checkbox, status: false } }))
    setDocumentList(resetList)
  }

  // ====== 삭제
  const handleDocDelete = async (type) => {
    const params = handleDelete(type, setConfirmDelete, handleCheckboxReset, documentList)
    if (params) {
      const data = {
        list: params,
        adminUser: userContext.actions.getIvtAdminUser()
      }
      loader(true, 'Uploading...')
      const res = await deleteDocDetail(data)
      if (res.data.code === '200') {
        setConfirmDelete(false)
        setDocumentCheckAll({
          ...documentCheckAll,
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
        // deleteIdList.push({ dcmnId: deleteList[i].dcmnId })
        deleteIdList.push(deleteList[i].dcmnId)
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
    <PageLayout currentMenu={'invest'} currentCate={'document'}>
      {confirmDelete && (
        <PopupConfirm msg={'선택하신 항목들을 \n정말 삭제하시겠습니까?'}>
          <>
            <Button className={'full_grey_dark'} onClick={() => handleDocDelete('cancel')}>
              취소
            </Button>
            <Button className={'full_blue'} onClick={() => handleDocDelete('confirm')}>
              확인
            </Button>
          </>
        </PopupConfirm>
      )}
      <div className="content_inner page_document">
        <h4 className="page_title">문서 관리</h4>
        {/*section_header start*/}
        <div className="section_header mb_none">
          <p className="section_title">문서 리스트</p>
          <div className="button_group">
            <p className="total">총 {paging ? paging.total : 0}건</p>
            {userInfo?.supMngrYn === 'Y' && (
              <Button
                className={'full_blue'}
                onClick={() => handleConfirmDelete(confirmDelete, setConfirmDelete, setDocumentCheckAll, documentList)}
              >
                삭제
              </Button>
            )}

            <Button className={'full_blue'} onClick={() => history.push(`${ROUTER_NAMES.INVEST_DOCUMENT_WRITE}`)}>
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
              <col width={'15%'} />
            </colgroup>
            <thead>
              <tr>
                {userInfo?.supMngrYn === 'Y' && (
                  <th>
                    <Checkbox
                      key={documentCheckAll.id}
                      checkbox={documentCheckAll}
                      onChange={(e) => handleCheckbox(e, documentCheckAll.id)}
                      checked={documentCheckAll.status}
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
              {(!documentList || documentList.length === 0) && (
                <tr>
                  <td colSpan={5}>
                    <NoResult />
                  </td>
                </tr>
              )}
              {documentList.map((document, idx) => (
                <tr
                  key={'document_item_' + idx}
                  onClick={(e) =>
                    e.target.nodeName !== 'LABEL' &&
                    e.target.nodeName !== 'INPUT' &&
                    history.push(`${ROUTER_NAMES.INVEST_DOCUMENT_VIEW}/${document.dcmnId}`)
                  }
                >
                  {userInfo?.supMngrYn === 'Y' && (
                    <td>
                      <Checkbox
                        key={document.checkbox.id}
                        checkbox={document.checkbox}
                        onChange={(e) => handleCheckbox(e, document.checkbox.id)}
                        checked={document.checkbox.status}
                      />
                    </td>
                  )}
                  <td className={'ta_center'}>{getTotalNumberBoard(paging.total, paging.page, paging.record, idx)}</td>
                  <td>
                    <p className="document_title text_ellipsis">{document.dcmnNm}</p>
                  </td>
                  <td className={'ta_center'}>{document.rgsnUserId ? document.rgsnUserId : '-'}</td>
                  <td className={'ta_center'}>{document.rgsnTs ? dateFormat(document.rgsnTs) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/*table_wrap end*/}
        <div className={'paging_wrap'}>
          {paging && <Pagination searchInput={searchInput} pagingData={paging} handlePaging={handlePaging} />}
        </div>
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
