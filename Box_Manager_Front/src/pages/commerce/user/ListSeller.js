import { useEffect, useRef, useState, useContext, useLayoutEffect } from 'react'
import PageLayout from 'components/PageLayout'
import Select from 'components/atomic/Select'
import Button from 'components/atomic/Button'
import NoResult from 'components/NoResult'
import Pagination from 'components/Pagination'
import SearchForm from 'components/SearchForm'
import PopupAlert from 'components/PopupAlert'
import PopupConfirm from 'components/PopupConfirm'
import { MktContext } from 'modules/common/MktContext'
import { UserContext } from 'modules/common/UserContext'
import { getSellerListApi, getSellerTypeListApi, sellerRoleOff, sellerRoleOffCancel } from 'modules/consts/MktApi'
import { loader } from 'modules/utils/CommonAxios'
import { useLocation } from 'react-router-dom'
import ListSellertable from 'pageComponents/commerce/user/ListSellertable'

const ListSeller = () => {
  const location = useLocation()
  let path = location.pathname
  let category = path.split('/')[3]
  const mktContext = useContext(MktContext)
  const userContext = useContext(UserContext)

  const [sellerList, setSellerList] = useState(null)
  const [paging, setPaging] = useState(null)
  const filterSelect = useRef(null)
  // seller type
  const [typeList, setTypeList] = useState({
    active: mktContext.state.mmbrsttsId ? mktContext.state.mmbrsttsId : 'filter_all',
    list: [{ id: 'filter_all', value: 'filter_all', label: '전체' }]
  })
  // search
  const [searchInput, setSearchInput] = useState('') // 검색
  const [selectList, setSelectList] = useState({
    active: 'searchCompanyName',
    list: [
        { id: 'searchCompanyName', value: 'searchCompanyName', label: '회사명' },
        { id: 'searchRprsntvName', value: 'searchRprsntvName', label: '대표자명' }
    ]
  })
  // confirm
  const [confirmDeprive, setConfirmDeprive] = useState({
    status: false,
    params: {}
  })
  // alert
  const [alertDeprive, setAlertDeprive] = useState(false)

  // ===== 목록 조회
  const getList = async (param) => {

    setSellerList(null)

    loader(true, 'Uploading...')

    let res = await getSellerListApi(param)
    if (res.data.code === '200') {
      let data = res.data.data
      setSellerList(data.list)
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

    if (typeList.list.length <= 1) await getTypeList() // 최초에만 불러옴
  }

  // ===== 상단 검색필터 : 전체, 에이전시, 준회원, 정회원
  const getTypeList = async () => {
    let res = await getSellerTypeListApi()
    if (res.data.code === '200') {
      let typeData = res.data.data.list
      let tempList = []
      for (let i = 0; i < typeData.length; i++) {
        let obj = { id: typeData[i].mmbrsttsId, value: typeData[i].mmbrsttsId, label: typeData[i].mmbrsttsNm }
        tempList[i] = obj
      }
      setTypeList({
        ...typeList,
        list: [...typeList.list, ...tempList]
      })
    }
    loader()
  }
  const onFilterActive = async (selected, label) => {
    let params = {}
    params = {
      ...mktContext.state.sellerParam,
      mmbrsttsId: selected === 'filter_all' ? '' : selected,
      page: 1
    }
    mktContext.actions.handleSellerParam(params)
    getList(params)
  }

  // ===== 하단 검색
  // 검색 조건
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

    mktContext.actions.handleSellerParam(params)
    getList(params)
  }

  // ===== 자격박탈
  const handleConfirmDeprive = async (id) => {
    if (!confirmDeprive.status) {
      setConfirmDeprive({
        status: true,
        params: {
          selrUsisId: id
        }
      })
      return
    }
    loader(true, 'Uploading...')
    let res = await sellerRoleOff(confirmDeprive.params)
    if (res.data.code === '200') {
      setConfirmDeprive({
        status: false,
        params: {}
      })
      handleAlertDeprive()
    }
  }
  // 자격박탈 alert
  const handleAlertDeprive = async () => {
    if (alertDeprive) {
      loader()
      await getList(mktContext.state.sellerParam)
    }
    setAlertDeprive(!alertDeprive)
  }

  // ===== 자격박탈 해제 취소
  const handleConfirmDepriveCancel = async (id) => {
    let params = {
      selrUsisId: id
    }
    loader(true, 'Uploading...')
    let res = await sellerRoleOffCancel(params)
    if (res.data.code === '200') {
      loader()
      await getList(mktContext.state.sellerParam)
    }
  }

  // ===== 페이징
  const handlePaging = async (param) => {
    let params = {
      ...mktContext.state.sellerParam,
      ...param
    }
    mktContext.actions.handleSellerParam(params)
    getList(params)
  }

  // ===== reset
  const handleReset = () => {
    mktContext.actions.handleSellerParam(null)
    setSearchInput('')
    setTypeList({
      ...typeList,
      active: 'filter_all'
    })
  }

  /*useEffect(async () => {
    setSellerList(null)

    if (userContext.state.category !== category) {
      await handleReset()
      await getList()
    } else {
      await getList(mktContext.state.sellerParam)
    }
    if (typeList.list.length <= 1) await getTypeList() // 최초에만 불러옴
  }, [mktContext.state.sellerParam])*/

  useLayoutEffect(() => {
    if (category !== userContext.state.category) {
      userContext.actions.setCategory(category)
    }
  }, [userContext.state.category])

  useEffect(async () => {
    mktContext.actions.handleSellerParam(null)
    handleReset()
    getList()
  }, []);

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'user'} currentPage={'listSeller'}>
      {confirmDeprive.status && (
        <PopupConfirm
          className={'popup_confirm_deprive'}
          msg={'판매 자격을 박탈하시겠습니까?\n판매 자격을 박탈할 경우,\n해당 판매사는 더 이상 판매를 할 수 없습니다.'}
        >
          <Button className={'full_grey_dark'} onClick={() => setConfirmDeprive({ status: false, params: {} })}>
            취소
          </Button>
          <Button className={'full_blue'} onClick={handleConfirmDeprive}>
            박탈
          </Button>
        </PopupConfirm>
      )}
      {alertDeprive && <PopupAlert msg={'해당 계정의 판매 자격이 박탈되었습니다.'} handlePopup={handleAlertDeprive} />}
      <div className="content_inner page_user">
        <div className="page_header">
          <h4 className="page_title">판매사 관리</h4>
          <div className="btn_group">
            {typeList && <Select optionList={typeList} ref={filterSelect} handleSelectActive={onFilterActive} />}
            <button className={'btn_refresh'} title={'새로고침'} onClick={handleReset}>
              <span className="hide">새로고침</span>
            </button>
          </div>
        </div>
        {/*section start*/}
        <div className="section seller_list_section">
          {!sellerList && sellerList?.length === 0 ? (
            <div className="table_no_result">
              <NoResult />
            </div>
          ) : (
            <div className="table_wrap border_bottom_none table_th_border">
              <ListSellertable
                data={sellerList}
                paging={paging}
                handleConfirmDeprive={handleConfirmDeprive}
                handleConfirmDepriveCancel={handleConfirmDepriveCancel}
              />
            </div>
          )}
          <div className={'paging_wrap'}>
            {paging && sellerList && <Pagination pagingData={paging} handlePaging={handlePaging} />}
          </div>
          {selectList && sellerList &&
            <SearchForm
              selectList={selectList}
              searchInput={searchInput}
              setSearchInput={setSearchInput}
              onSelectActive={onSelectActive}
              handleSearch={handleSearch}
            />
          }
        </div>
        {/*section end*/}
      </div>
    </PageLayout>
  )
}

export default ListSeller
