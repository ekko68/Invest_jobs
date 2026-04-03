import { useEffect, useRef, useState, useContext, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import PageLayout from 'components/PageLayout'
import Select from 'components/atomic/Select'
import Button from 'components/atomic/Button'
import NoResult from 'components/NoResult'
import Pagination from 'components/Pagination'
import SearchForm from 'components/SearchForm'
import PopupAlert from 'components/PopupAlert'
import PopupConfirm from 'components/PopupConfirm'
import {
  approveAgencyApi,
  cancelApproveApi,
  cancelRejectApi,
  cancelReserveApi,
  getAgencyListApi,
  rejectAgencyApi
} from 'modules/consts/MktApi'
import { UserContext } from 'modules/common/UserContext'
import { MktContext } from 'modules/common/MktContext'
import AgencyBtnGroup from 'pageComponents/commerce/user/AgencyBtnGroup'
import { loader } from 'modules/utils/CommonAxios'
import { getTotalNumberBoard } from 'modules/common'
import * as userFn from 'modules/fns/mkt/userFn'
import moment from 'moment'

const ListAgency = () => {
  const location = useLocation()
  let path = location.pathname
  let category = path.split('/')[3]
  const userContext = useContext(UserContext)
  const mktContext = useContext(MktContext)
  const [reqListData, setReqListData] = useState(null)
  const [paging, setPaging] = useState(null)
  const [confirm, setConfirm] = useState({
    type: null,
    status: false,
    msg: '',
    params: {}
  })
  const [alert, setAlert] = useState({
    type: null,
    status: false,
    msg: ''
  })
  const [searchInput, setSearchInput] = useState('') // 검색
  const [selectList, setSelectList] = useState({
    active: 'searchCompanyName',
    list: [{ id: 'searchCompanyName', value: 'searchCompanyName', label: '회사명' }]
  })

  // ===== 목록 조회
  const getList = async (param) => {

    setReqListData(null)

    loader(true, 'Uploading...')

    let res = await getAgencyListApi(param)
    if (res.data.code === '200') {
      let data = res.data.data
      setReqListData(data.list)
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

  // ===== 승인
  const handleApprove = async (id, selId) => {
    loader(true, 'Uploading...') // handleAlertPopup 에서 해제
    let params = {
      agenReqId: id,
      selrUsisId: selId
    }
    let res = await approveAgencyApi(params)
    if (res.data.code === '200') {
      userFn.handleAlertPopup('approve', alert, setAlert)
    }
  }

  // ===== 요청 반려
  const handleReject = async () => {
    loader(true, 'Uploading...') // handleAlertPopup 에서 해제
    let res = await rejectAgencyApi(confirm.params)
    if (res.data.code === '200') {
      userFn.handleConfirmPopup(null, confirm, setConfirm, null)
      userFn.handleAlertPopup('reject', alert, setAlert)
    }
  }

  // ===== 권한해제
  const handleAuthCancel = async () => {
    loader(true, 'Uploading...') // handleAlertPopup 에서 해제
    let res = await cancelApproveApi(confirm.params)
    if (res.data.code === '200') {
      userFn.handleConfirmPopup(null, confirm, setConfirm, null)
      userFn.handleAlertPopup('cancelRequest', alert, setAlert)
    }
  }

  // ===== 반려취소
  const handleCancel = async (id, selId) => {
    loader(true, 'Uploading...')
    let params = {
      agenReqId: id,
      selrUsisId: selId
    }
    let res = await cancelRejectApi(params)
    if (res.data.code === '200') {
      loader()
      await getList({ ...mktContext.state.agencyParam })
    }
  }

  // ===== 해제취소
  const handleCancelReserve = async (id, selId) => {
    loader(true, 'Uploading...')
    let params = {
      agenReqId: id,
      selrUsisId: selId
    }
    let res = await cancelReserveApi(params)
    if (res.data.code === '200') {
      loader()
      await getList({ ...mktContext.state.agencyParam })
    }
  }

  // ===== 상태별 버튼 클릭 handler
  const handleOnClickButton = (type, id, selId) => {
    let params = {
      agenReqId: id,
      selrUsisId: selId
    }
    userFn.handleConfirmPopup(type, confirm, setConfirm, params)
  }

  // ===== Alert창 확인 handler
  const handleAlertPopup = async () => {
    loader()
    await getList({ ...mktContext.state.agencyParam })
    userFn.handleAlertPopup(null, alert, setAlert)
  }

  // ===== 상단 검색필터 : 전체, 승인, 반려, 권한해제
  const filterSelect = useRef(null)
  // request/reject/approved/roleoff
  const [filter, setFilter] = useState({
    active: mktContext.state.agencyParam !== '' ? 'all' : mktContext.state.agencyParam,
    list: [
      { id: 'all', value: 'all', label: '전체' },
      { id: 'approved', value: 'approved', label: '승인' },
      { id: 'reject', value: 'reject', label: '반려' },
      { id: 'roleoff', value: 'roleoff', label: '권한해제' }
    ]
  })
  const onFilterActive = (selected) => {
    console.log('filter >> ', selected)
    setFilter({
      ...filter,
      active: selected
    })
    let param = {
      ...mktContext.state.agencyParam,
      statusCode: selected === 'all' ? '' : selected,
      page: 1
    }
    getList(param)
  }

  // ===== 하단 검색
  const onSelectActive = (selected) => {
    setSelectList({
      ...selectList,
      active: selected
    })
  }
  const handleSearch = async () => {
    const _searchInput = searchInput.trim()
    let params = {
      page: 1,
      searchCompanyName: _searchInput
    }
    mktContext.actions.handleAgencyParam(params)
    await getList({...mktContext.state.agencyParam})
  }

  // ===== 페이징
  const handlePaging = async (param) => {
    let params = {
      ...mktContext.state.agencyParam,
      ...param
    }
    mktContext.actions.handleAgencyParam(params)
    await getList({...mktContext.state.agencyParam})
  }

  // ===== reset
  const handleReset = () => {
    mktContext.actions.handleAgencyParam(null)
    setSearchInput('')
  }

  // useEffect(async () => {
  //   setReqListData(null)
  //   if (userContext.state.category !== category) {
  //     await handleReset()
  //     await getList()
  //   } else {
  //     await getList(mktContext.state.agencyParam)
  //   }
  // }, [mktContext.state.agencyParam])

  useLayoutEffect(() => {
    if (category !== userContext.state.category) {
      userContext.actions.setCategory(category)
      handleReset()
    }
  }, [userContext.state.category])

  useEffect(async () => {
    mktContext.actions.handleAgencyParam(null)
    handleReset()
    getList()
  }, []);

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'user'} currentPage={'listAgency'}>
      {confirm.status && (
        <PopupConfirm msg={confirm.msg}>
          <Button className={'full_grey_dark'} onClick={() => userFn.handleConfirmPopup(null, confirm, setConfirm)}>
            취소
          </Button>
          {confirm.type === 'authCancel' && (
            <Button className={'full_blue'} onClick={handleAuthCancel}>
              확인
            </Button>
          )}
          {confirm.type === 'rejectCancel' && (
            <Button className={'full_blue'} onClick={handleCancelReserve}>
              확인
            </Button>
          )}
          {confirm.type === 'reject' && (
            <Button className={'full_blue'} onClick={handleReject}>
              확인
            </Button>
          )}
        </PopupConfirm>
      )}
      {alert.status && <PopupAlert msg={alert.msg} handlePopup={() => handleAlertPopup('confirm')} />}
      <div className="content_inner page_user">
        <div className="page_header">
          <h4 className="page_title">에이전시 등록 요청 관리</h4>
          <div className="btn_group">
            <Select optionList={filter} ref={filterSelect} handleSelectActive={onFilterActive} />
            <button className={'btn_refresh'} title={'새로고침'} onClick={handleReset}>
              <span className="hide">새로고침</span>
            </button>
          </div>
        </div>

        {/*section start*/}
        <div className="section agency_req_section">
          {!reqListData && reqListData?.length === 0 ? (
            <div className="table_no_result">
              <NoResult />
            </div>
          ) : (
            <div className="table_wrap border_bottom_none table_th_border">
              <table className="table type02">
                <caption>에이전시 등록 요청 관리 테이블</caption>
                <colgroup>
                  <col width={'5%'} />
                  <col width={'*'} />
                  <col width={'15%'} />
                  <col width={'15%'} />
                  <col width={'15%'} />
                  <col width={'25%'} />
                </colgroup>
                <thead>
                  <tr>
                    <th>NO</th>
                    <th>승인 요청 회사명</th>
                    <th>대표자명</th>
                    <th>요청자명</th>
                    <th>요청일시</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {reqListData &&
                    reqListData.map((item, idx) => (
                      <tr key={'main_bind_item_' + idx}>
                        <td className={'ta_center'}>
                          {paging && getTotalNumberBoard(paging.total, paging.page, paging.record, idx)}
                        </td>
                        <td className={'ta_center'}>{item.bplcNm ? item.bplcNm : '-'}</td>
                        <td className={'ta_center'}>{item.rprsntvNm ? item.rprsntvNm : '-'}</td>
                        <td className={'ta_center'}>{item.rgsnUserName ? item.rgsnUserName : '-'}</td>
                        <td className={'ta_center'}>
                          {item.rgsnTs ? moment(item.rgsnTs).format('YYYY-MM-DD HH:mm') : '-'}
                        </td>
                        <td className={'ta_center'}>
                          <AgencyBtnGroup
                            status={item.pcsnsttsId}
                            id={item.agenReqId}
                            selId={item.selrUsisId}
                            statusName={item.pcsnsttsNm}
                            handleApprove={handleApprove}
                            handleOnClickButton={handleOnClickButton}
                            handleCancelReserve={handleCancelReserve}
                            handleCancel={handleCancel}
                          />
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
          {selectList && reqListData && (
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

export default ListAgency
