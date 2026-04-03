import React, { useState, useEffect, useContext, useLayoutEffect } from 'react'
import Button from 'components/atomic/Button'
import Checkbox from 'components/atomic/Checkbox'
import NoResult from 'components/NoResult'
import PageLayout from 'components/PageLayout'
import Pagination from 'components/Pagination'
import PopupAlert from 'components/PopupAlert'
import SearchForm from 'components/SearchForm'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import PopupConfirm from 'components/PopupConfirm'
import { Link, useHistory, useLocation } from 'react-router-dom'
import { UserContext } from 'modules/common/UserContext'
import {deleteUserInfo, getUserInfo, getUserListApi, setUserAthrMenu} from 'modules/consts/AdminApi'
import { loader } from 'modules/utils/CommonAxios'
import { AdminContext } from 'modules/common/AdminContext'
import moment from 'moment'
import { getTotalNumberBoard } from '../../modules/common'

const List = () => {
  const userContext = useContext(UserContext)
  const adminContext = useContext(AdminContext)
  const history = useHistory()
  const location = useLocation()
  let path = location.pathname
  let category = path.split('/')[1]

  // ===== states
  const [checkAll, setCheckAll] = useState({ id: 'user_chk_all', value: '', status: false })
  const [list, setList] = useState(null)
  const [paging, setPaging] = useState()
  const [searchInput, setSearchInput] = useState(adminContext.state.adminListParam.searchInput)
  const [select, setSelect] = useState({
    active: adminContext.state.adminListParam.mngrEmlAdr !== '' ? 'mngrEmlAdr' : 'mngrNm',
    list: [
      { id: 'mngrNm', value: 'mngrNm', label: '이름' },
      { id: 'mngrEmlAdr', value: 'mngrEmlAdr', label: '이메일' }
    ]
  })
  // ===== getList
  const getList = async (params) => {
    loader()
    const res = await getUserListApi(params)
    if (res.data.code === '200') {
      let data = res.data.data
      handleSetCheckBox(data.list)
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
    } else {
      console.log('조회 실패')
    }
  }

  const handleSetCheckBox = (list) => {
    const tempList = list.map((item) => ({ ...item, checkbox: { id: item.mngrId, value: '', status: false } }))
    setList(tempList)
  }

  // ===== checkbox
  const handleCheckbox = (e, id) => {
    let newList = []
    if (id === 'user_chk_all') {
      newList = list.map(
        (list) =>
          e.target.id === 'user_chk_all' && { ...list, checkbox: { ...list.checkbox, status: e.target.checked } }
      )
      setCheckAll({
        ...checkAll,
        status: e.target.checked
      })
    } else {
      if (e.target.id === false) {
        setCheckAll({
          ...checkAll,
          status: false
        })
      }
      newList = list.map((list) =>
        list.checkbox.id === e.target.id ? { ...list, checkbox: { ...list.checkbox, status: e.target.checked } } : list
      )
    }
    handleCheckAll(newList)
    setList(newList)
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
      ? setCheckAll({
          ...checkAll,
          status: true
        })
      : setCheckAll({
          ...checkAll,
          status: false
        })
  }

  // 삭제 confirm
  const [alertNoSelected, setAlertNoSelected] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const handleConfirmDelete = () => {
    if (list.every((item) => !item.checkbox.status)) {
      // todo 삭제할 계정을 선택하세요.
      setAlertNoSelected(!alertNoSelected)
      return
    }
    setConfirmDelete(!confirmDelete)
  }

  const handleRemove = async(e) => {
    // todo 선택된 유저 삭제 api(selectList) 호출
    const selectList = list.filter((item) => item.checkbox.status)
    // console.log('선택된 유저 삭제 api 호출', selectList)

    const resMenu = await deleteUserInfo(selectList)
    if (resMenu.data.code === '200') {
      setConfirmDelete(!confirmDelete)
      setCheckAll({
        ...checkAll,
        status: false
      })
      // test
      const noSelectList = list.filter((item) => !item.checkbox.status)
      setList(noSelectList)
    } else {
      setMsgAlert({state: true, message: '사용자 삭제 중 오류가 발생하였습니다.'})
    }
  }

  // ===== search
  const onSelectActive = (selected) => {
    setSelect({
      ...select,
      active: selected
    })
  }

  const handleSearch = () => {
    let params = {}
    if (select.active === 'mngrNm') {
      params = {
        mngrNm: searchInput
      }
    } else {
      params = {
        mngrEmlAdr: searchInput
      }
    }
    adminContext.actions.handleSetAdminListParam({
      ...params,
      searchInput: searchInput,
      page: 1
    })
  }

  // ==== reset
  const handleReset = () => {
    adminContext.actions.handleSetAdminListParam(null)
    setSelect({
      ...select,
      active: 'mngrNm'
    })
    setSearchInput('')
  }

  // ===== handlePaging
  const handlePaging = async (param) => {
    let params = {
      ...adminContext.state.adminListParam,
      ...param
    }
    adminContext.actions.handleSetAdminListParam(params)
  }

  useLayoutEffect(() => {
    if (userContext.state.category !== category) {
      userContext.actions.setCategory(category)
      handleReset()
    }
  }, [])

  useEffect(async () => {
    await getList(adminContext.state.adminListParam)
  }, [adminContext.state.adminListParam])

  return (
    <PageLayout currentMenu={'admin'} currentCate={'account'}>
      {alertNoSelected && (
        <PopupAlert msg={'삭제할 계정을 선택하세요.'} handlePopup={(e) => setAlertNoSelected(!alertNoSelected)} />
      )}
      {confirmDelete && (
        <PopupConfirm msg={'선택하신 계정들을 \n정말 삭제하시겠습니까?'}>
          <Button className={'full_grey'} onClick={(e) => setConfirmDelete(!confirmDelete)}>
            취소
          </Button>
          <Button className={'full_blue'} onClick={handleRemove}>
            확인
          </Button>
        </PopupConfirm>
      )}
      <div className="content_inner page_authority">
        <h4 className="page_title">관리자계정 관리</h4>
        {/*section_header start*/}
        <div className="section_header mb_none">
          <p className="section_title">관리자 리스트</p>
          <div className="button_group">
            <p className="total">
              전체: <span className="highlight_blue">{paging ? paging.total : 0}</span>건
            </p>
            <Button className={'full_blue'} onClick={handleConfirmDelete}>
              삭제
            </Button>
            <Link to={ROUTER_NAMES.ADMIN_WRITE}>
              <Button className={'full_blue'}>등록</Button>
            </Link>
            <button className={'btn_refresh'} title={'새로고침'} onClick={handleReset}>
              <span className="hide">새로고침</span>
            </button>
          </div>
        </div>
        {/*section_header end*/}
        {/*table_wrap start*/}
        <div className="table_wrap auth_user_table">
          <table className="table">
            <caption>관리자 리스트 테이블</caption>
            <colgroup>
              <col width={'4%'} />
              <col width={'5%'} />
              <col width={'15%'} />
              <col width={'15%'} />
              <col width={'20%'} />
              <col width={'*'} />
              <col width={'30%'} />
            </colgroup>
            <thead>
              <tr>
                <th>
                  <Checkbox
                    key={checkAll.id}
                    checkbox={checkAll}
                    onChange={(e) => handleCheckbox(e, checkAll.id)}
                    checked={checkAll.status}
                  />
                </th>
                <th>NO</th>
                <th>최고관리자여부</th>
                <th>아이디</th>
                <th>이름</th>
                <th>이메일</th>
                <th>등록일</th>
              </tr>
            </thead>

            <tbody>
              {(!list || list.length === 0) && (
                <tr>
                  <td colSpan={7}>
                    <NoResult />
                  </td>
                </tr>
              )}
              {list?.map((item, idx) => (
                <tr
                  key={'item_item_' + idx}
                  onClick={(e) =>
                    e.target.nodeName !== 'LABEL' &&
                    e.target.nodeName !== 'INPUT' &&
                    history.push(`${ROUTER_NAMES.ADMIN_WRITE}/${item.mngrId}`)
                  }
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <Checkbox
                      key={item.checkbox.id}
                      checkbox={item.checkbox}
                      onChange={(e) => handleCheckbox(e, item.checkbox.id)}
                      checked={item.checkbox.status}
                    />
                  </td>
                  <td className={'ta_center'}>
                    {paging && getTotalNumberBoard(paging.total, paging.page, paging.record, idx)}
                  </td>
                  <td className={'ta_center'}>
                    <p className={'ta_center'}>{item.supMngrYn}</p>
                  </td>
                  <td className={'ta_center'}>
                    <p className={'ta_center'}>{item.mngrId}</p>
                  </td>
                  <td className={'ta_center'}>
                    <p className={'user_name'}>{item.mngrNm}</p>
                  </td>
                  <td className={'ta_center'}>{item.mngrEmlAdr}</td>
                  <td className={'ta_center'}>{moment(item.rgsnTs).format('YYYY-MM-DD')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/*table_wrap end*/}
        {paging && list?.length > 0 && (
          <>
            <div className={'paging_wrap'}>
              <Pagination pagingData={paging} handlePaging={handlePaging} />
            </div>
          </>
        )}
        <SearchForm
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          onSelectActive={onSelectActive}
          selectList={select}
          handleSearch={handleSearch}
        />
      </div>
    </PageLayout>
  )
}

export default List
