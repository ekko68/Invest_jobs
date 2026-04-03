import { useEffect, useState, useContext, useLayoutEffect } from 'react'
import { MktContext } from 'modules/common/MktContext'
import { UserContext } from 'modules/common/UserContext'
import { useLocation, useParams, useHistory } from 'react-router-dom'

import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import PopupAlert from 'components/PopupAlert'
import AddProdtable from 'pageComponents/commerce/event/AddProdtable'
import ProdTable from 'pageComponents/commerce/event/ProdTable'
import {
  getEventApplyProdApi,
  getEventProductPartiApi,
  getEventProductApi,
  approveEventApi,
  approveCancelEventApi,
  approveSortUpdate,
  approveEventPartiApi
} from 'modules/consts/MktApi'
import { loader } from 'modules/utils/CommonAxios'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import PopupConfirm from 'components/PopupConfirm'

const Manage = () => {
  const { id, evntTtl, statusCode } = useParams()
  const history = useHistory()
  const location = useLocation()
  let path = location.pathname
  let category = path.split('/')[2]
  const mktContext = useContext(MktContext)
  const userContext = useContext(UserContext)
  // ===== states
  const [prodList, setProdList] = useState([]) // 신청 상품 목록
  const [addProdList, setAddProdList] = useState([]) // 선정된 상품 목록
  const [confirm, setConfirm] = useState({
    status: false, // 팝업상태
    selected: null // 선택한 탭
  })
  const [alert, setAlert] = useState({
    msg: '',
    status: false
  })
  // 검색 조건
  const [searchInput, setSearchInput] = useState('')
  const [selectList, setSelectList] = useState({
    active: 'pdfNm',
    list: [
      { id: 'pdfNm', value: 'pdfNm', label: '상품명' },
      { id: 'bplcNm', value: 'bplcNm', label: '판매사명' }
    ]
  })

  // ===== 탭
  const tabList = {
    active: mktContext.state.eventManageParam.tabActive,
    list: [
      { id: 'applyProd', label: '신청 상품' },
      { id: 'addProd', label: '상품 추가' }
    ]
  }

  const [checkAll, setCheckAll] = useState({ id: 'chk_all', value: '', checked: false })
  const [addPaging, setAddPaging] = useState(null)
  const [paging, setPaging] = useState(null)

  // ===== tab handler
  const handleTab = (selected) => {
    // 체크된 목록이 있는지 확인
    let checkedVal = 0
    prodList?.map((item) => {
      if (item.checked) checkedVal++
    })
    if (checkedVal > 0) {
      // 체크된 목록이 있으면 "저장되지 않음" 컨펌 팝업을 띄움
      setConfirm({
        selected: selected,
        status: true
      })
      return false
    }
    handleTabConfirm(selected) // 탭이동
  }

  const handleTabConfirm = (selected) => {
    mktContext.actions.handleEventManageParam({
      ...mktContext.state.eventManageParam,
      tabActive: selected ? selected : confirm.selected,
      page: 1, // 페이징 초기화
      searchType: '', // 검색 초기화
      searchTtl: '' // 검색어 초기화
    })
    setConfirm({
      status: false,
      selected: null
    })
    // 검색 초기화
    setSearchInput('')
    setSelectList({
      ...selectList,
      active: 'pdfNm'
    })
  }

  // ===== 선정된 상품
  const getApplyProdList = async (params) => {
    setAddProdList(null)
    let res = await getEventApplyProdApi(params)
    if (res?.data?.code === '200') {
      let data = res.data.data
      setAddProdList(data.list)
      setAddPaging({
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

  // ===== 신청상품 & 상품추가 목록
  const getProdList = async (param) => {
    setPaging(null)
    setProdList(null)
    setCheckAll({ ...checkAll, checked: false })
    let res
    let params = {
      page: 1,
      evntInfId: id
    }

    if (param) {
      params = {
        ...params,
        ...param
      }
    }

    if (mktContext.state.eventManageParam.tabActive === 'applyProd') {
      res = await getEventProductPartiApi(params)
    } else {
      res = await getEventProductApi(params)
    }

    if (res?.data?.code === '200') {
      let data = res.data.data
      setProdList(
        data.list.map((item) => {
          return { ...item, checked: false }
        })
      )
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

  // ===== 순서변경
  const handleDrop = (droppedItem) => {
    if (!droppedItem.destination) return
    let updatedList = [...addProdList]
    const [reorderedItem] = updatedList.splice(droppedItem.source.index, 1)
    updatedList.splice(droppedItem.destination.index, 0, reorderedItem)
    setAddProdList(updatedList)
  }

  const handleSort = async () => {
    let paramList = []
    if (!addProdList || addProdList?.length <= 1) return false
    addProdList.map((item, idx) => {
      let obj = {
        evntInfId: item.evntInfId,
        pdfInfoId: item.pdfInfoId,
        expuSqc: idx
      }
      paramList.push(obj)
    })
    let res = await approveSortUpdate(paramList)
    if (res.data.code === '200') {
      setAlert({
        msg: '저장이 완료되었습니다.',
        status: true
      })
    }
  }

  // ===== prodList - checkbox
  const handleCheckbox = (e) => {
    let newList = []
    if (e.target.id === 'chk_all') {
      newList = prodList.map((list) => ({ ...list, checked: e.target.checked }))
      setCheckAll({
        ...checkAll,
        checked: e.target.checked
      })
    } else {
      newList = prodList.map((list) => (list.pdfInfoId === e.target.id ? { ...list, checked: e.target.checked } : list))
      handleCheckAll(newList)
    }
    setProdList(newList)
  }

  const handleProdAllCheck = (value) => {
    setProdList(
      prodList.map((item) => {
        return { ...item, checked: value }
      })
    )
  }

  const handleCheckAll = (list) => {
    let cnt = 0
    for (let i = 0; i < list.length; i++) {
      if (list[i].checked) {
        cnt++
      }
    }
    cnt === list.length
      ? setCheckAll({
          ...checkAll,
          checked: true
        })
      : setCheckAll({
          ...checkAll,
          checked: false
        })
  }

  // ===== approve
  const handleApprove = async () => {
    let approveList = prodList.filter((item) => item.checked)
    let paramList = []
    if (approveList.length <= 0) return false
    loader(true, 'Uploading...')
    approveList.map((item) => {
      let obj = {
        // evntInfId: item.evntInfId,
        evntInfId: id,
        pdfInfoId: item.pdfInfoId
      }
      paramList.push(obj)
    })

    let res
    if (mktContext.state.eventManageParam.tabActive === 'applyProd') {
      res = await approveEventPartiApi(paramList)
    } else {
      res = await approveEventApi(paramList)
    }
    if (res.data.code === '200') {
      await handleReset()
    }
  }

  // ===== approve cancel
  const handleApproveCancel = async (evntInfId, pdfInfoId) => {
    loader(true, 'Uploading...')
    let res = await approveCancelEventApi([
      {
        evntInfId: id,
        pdfInfoId: pdfInfoId
      }
    ])
    if (res.data.code === '200') {
      setAlert({
        msg: '승인이 취소되었습니다.',
        status: true
      })
    }
  }

  // ===== reset
  const handleReset = async () => {
    await getApplyProdList({ evntInfId: id })
    await getProdList()
    setAlert({
      msg: '',
      status: false
    })
  }

  // ===== Search
  const handleSearch = async () => {
    const _searchInput = searchInput.trim()
    let params = {
      searchType: selectList.active,
      searchTtl: _searchInput,
      page: 1
    }
    mktContext.actions.handleEventManageParam(params)
  }

  // ===== paging
  const handlePaging = async (param) => {
    let params = {
      ...mktContext.state.eventManageParam,
      ...param
    }
    mktContext.actions.handleEventManageParam(params)
  }

  useLayoutEffect(() => {
    if ('eventManage' !== userContext.state.category) {
      userContext.actions.setCategory('eventManage')
      handleTabConfirm('applyProd')
    }
  }, [userContext.state.category])

  useEffect(async () => {
    await getProdList(mktContext.state.eventManageParam)
  }, [mktContext.state.eventManageParam])

  useEffect(async () => {
    await getApplyProdList({ evntInfId: id })
  }, [])

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'event'}>
      {confirm.status && (
        <PopupConfirm msg={'승인하지 않고 넘어가시겠습니까?'}>
          <Button className={'full_grey_dark'} onClick={() => handleTabConfirm(null)}>
            확인
          </Button>
          <Button className={'full_blue'} onClick={() => setConfirm({ status: false, selected: null })}>
            취소
          </Button>
        </PopupConfirm>
      )}
      {alert.status && <PopupAlert msg={alert.msg} handlePopup={handleReset} />}
      <div className="content_inner page_event">
        <div className="page_header mb_none">
          <h4 className="page_title">{evntTtl ? evntTtl : ''}</h4>
        </div>

        {/*tab_container start*/}
        <div className="tab_container">
          <div className="event_manage_container">
            <AddProdtable
              addProdList={addProdList}
              handleDrop={handleDrop}
              paging={addPaging}
              handleApproveCancel={handleApproveCancel}
              handleSort={handleSort}
            />
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
              <Button className={'basic'} onClick={() => history.push(ROUTER_NAMES.COMMERCE_EVENT_LIST)}>
                목록
              </Button>
            </div>
            {prodList && (
              <ProdTable
                prodList={prodList}
                tab={tabList.active}
                checkAll={checkAll}
                handleCheckbox={handleCheckbox}
                handleAllCheck={handleProdAllCheck}
                handlePaging={handlePaging}
                paging={paging}
                handleApprove={handleApprove}
                handleSearch={handleSearch}
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                selectList={selectList}
                setSelectList={setSelectList}
                statusCode={statusCode}
              />
            )}
          </div>
        </div>
        {/*tab_container end*/}
      </div>
    </PageLayout>
  )
}

export default Manage
