import { useEffect, useRef, useState, useContext, useLayoutEffect, useCallback } from 'react'
import Button from 'components/atomic/Button'
import Select from 'components/atomic/Select'
import { MktContext } from 'modules/common/MktContext'
import { UserContext } from 'modules/common/UserContext'
import AddNewProduct from 'pageComponents/commerce/management/event/popup/AddNewProductList'
import Pagination from 'components/Pagination'
import {
  getEventProductListApiV2,
  UpdateAllStatusApi,
  updateSelectedStatusApi,
  getEventProductApiV2,
  approveEventApiV2
} from 'modules/consts/MktApi'
import EventDetailList from './EventDetailList'

const EventPopup = (props) => {
  const { selectList, evntInfId, setPopupProduct, onSelectActive, value, evntStatus, getEventList, search } = props
  const mktContext = useContext(MktContext)
  const userContext = useContext(UserContext)
  const sortSelect = useRef('')

  const [popupsearch, setPopupSearch] = useState({
    evntInfId: evntInfId,
    page: 1,
    record: 10
  })
  const [joinPaging, setJoinPaging] = useState(null)
  const [companyPaging, setCompanyPaging] = useState(null)

  const [defaultSelect, setDefaultSelect] = useState({
    active: 'pdfNm',
    list: [
      { id: 'pdfNm', value: 'pdfNm', label: '상품명' },
      { id: 'pdfKwr', value: 'pdfKwr', label: '상품 키워드' }
    ]
  })

  const [productData, setProductData] = useState({
    isLoading: true,
    list: []
  })

  const [companyProductData, setCompanyProductData] = useState({
    isLoading: true,
    list: []
  })

  const [addProductInfIds, setAddProductInfIds] = useState([])

  const [searchText, setSearchText] = useState('')
  const [selectedValue, setSelectedValue] = useState(defaultSelect.active)
  const [selectAllController, setSelectAllController] = useState()

  const close = () => {
    mktContext.actions.handleSetPopupBannerCurrType('eventPartIn')
    setPopupProduct({
      active: false,
      evntInfId: ''
    })
    setPopupSearch({
      ...popupsearch,
      evntInfId: evntInfId,
      page: 1,
      record: 10,
      searchType: '',
      searchText: ''
    })
    getEventList(search)
  }
  //이벤트 참여 상품 탭 데이터 조회 API
  const getProductList = useCallback((params) => {
    getEventProductListApiV2(params, handleEventListCallback, handleEventListErrorCallback)
  }, [])

  const initPopup = () => {
    setPopupSearch({
      ...popupsearch,
      evntInfId: evntInfId,
      page: 1,
      record: 10,
      searchType: '',
      searchText: ''
    })
    setAddProductInfIds([])
    setSelectAllController(false)
  }
  const handleEventListCallback = (res) => {
    if (res.data.code === '200') {
      const data = res.data.data
      setProductData({
        isLoading: false,
        list: data.list
      })
      setJoinPaging({
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
  const handleEventListErrorCallback = () => {
    setProductData({
      isLoading: false,
      list: []
    })

    mktContext.actions.setCommonAlertInfo({
      type: 'error',
      active: true
    })
  }

  //상품 추가 탭 데이터 조회 API
  const getCompanyProductData = useCallback((params) => {
    getEventProductApiV2(params, handleProductListCallback, handleCompanyProductDataErrorCallback)
  }, [])

  const handleProductListCallback = (res) => {
    if (res.data.code === '200') {
      const data = res.data.data
      setCompanyProductData({
        isLoading: false,
        list: data.list
      })
      setCompanyPaging({
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

  const handleCompanyProductDataErrorCallback = () => {
    setCompanyProductData({
      isLoading: false,
      list: []
    })

    mktContext.actions.setCommonAlertInfo({
      type: 'error',
      active: true
    })
  }

  // 선택 상품 선정 상태 변경  API
  const getStatusParams = (selectedstatusParams) => {
    updateSelectedStatus(selectedstatusParams)
  }

  const updateSelectedStatus = useCallback((params) => {
    updateSelectedStatusApi(params, handleSelectedUpdateCallback, handleSelectedUpdateErrorCallback)
  }, [])

  //수정, 삭제 후처리
  const handleSelectedUpdateCallback = () => {
    getProductList(popupsearch)
  }

  //수정, 삭제 실패시
  const handleSelectedUpdateErrorCallback = () => () => {
    mktContext.actions.setCommonAlertInfo({
      type: 'error',
      active: true
    })
  }

  // 탭
  const tabList = {
    active: mktContext.state.popupCurrType,
    list: [
      { id: 'eventPartIn', label: '이벤트 참여 상품' },
      { id: 'eventAdd', label: '참여 상품 추가' }
    ]
  }

  const tabchange = useCallback(() => {
    setPopupSearch({ ...popupsearch, page: 1 })
    setAddProductInfIds([])
  }, [tabList.active])

  const handleTab = async (selected) => {
    mktContext.actions.handleSetPopupBannerCurrType(selected)
    tabchange()
  }

  // ===== reset
  const handleReset = () => {
    mktContext.actions.handleSetPopupBannerCurrType('eventPartIn')
  }

  // 전체 선정 상태 (전부 숭인/전부 거절) 파라미터 생성
  const handleAllReject = () => {
    const params = { evntInfId: evntInfId, pcsnsttsId: 'ETS01003' }
    updateAllStatus(params)
  }
  const handleAllAdmission = () => {
    const params = { evntInfId: evntInfId, pcsnsttsId: 'ETS01002' }
    updateAllStatus(params)
  }

  // 전체 선정 상태 (전부 숭인/전부 거절) API
  const updateAllStatus = useCallback((params) => {
    UpdateAllStatusApi(params, handleUpdateCallback, handleUpdateErrorCallback)
  }, [])

  //수정, 삭제 후처리
  const handleUpdateCallback = () => {
    getProductList(popupsearch)
  }

  //수정, 삭제 실패시
  const handleUpdateErrorCallback = () => () => {
    mktContext.actions.setCommonAlertInfo({
      type: 'error',
      active: true
    })
  }
  useLayoutEffect(() => {
    if (userContext.state.category !== 'eventPartIn') {
      userContext.actions.setCategory('eventPartIn')
      handleReset()
    }
  }, [])

  const handleJoinPaging = (param) => {
    if (popupsearch.page != param.page) {
      setPopupSearch({
        ...popupsearch,
        page: param.page
      })
    }
  }

  const handleCompanyPaging = (param) => {
    if (popupsearch.page != param.page) {
      setPopupSearch({
        ...popupsearch,
        page: param.page
      })
    }
  }

  //상품 추가  API
  const handleAddProduct = () => {
    if (addProductInfIds?.length > 0) {
      for (let product of addProductInfIds) {
        if (productData.list.some((_item) => _item.pdfInfoId === product.pdfInfoId)) {
          mktContext.actions.setCommonAlertInfo({
            type: 'alert',
            active: true,
            msg: '선택한 상품과 동일한 상품이 추가되어있습니다.'
          })
          return false
        }
      }
      const params = {
        pdfInfoIds: addProductInfIds.map((_item) => _item.pdfInfoId),
        evntInfId: evntInfId
      }
      approveEventApiV2(params, handleinsertCallback, handleUpdateErrorCallback)
    } else {
      mktContext.actions.setCommonAlertInfo({
        type: 'alert',
        active: true,
        msg: '추가할 상품을 선택해주세요.'
      })
    }
  }
  const handleinsertCallback = () => {
    mktContext.actions.setCommonAlertInfo({
      type: 'alert',
      active: true,
      msg: '선택한 상품이 추가되었습니다.'
    })
    getCompanyProductData(popupsearch)
    getProductList(popupsearch)
    // setAddProductInfIds([]) 선택 추가 성공시 체크 상태 초기화
  }

  const handleSearch = (e) => {
    setSearchText(e.target.value)
  }

  const searchClick = () => {
    setPopupSearch({
      ...popupsearch,
      page: 1,
      searchType: selectedValue,
      searchTtl: searchText
    })
  }
  useEffect(() => {
    if (tabList.active == 'eventPartIn') {
      getProductList(popupsearch)
    } else if (tabList.active == 'eventAdd') getCompanyProductData(popupsearch)
  }, [popupsearch, tabList.active])
  return (
    <div className="popup_wrap popup_event_situation">
      <div className="layer">&nbsp;</div>
      <div className="popup_container">
        <div className="popup_content scroll">
          <div className="popup_main_header">
            <div className="title">이벤트 참여 상품</div>
            <Button
              className="popup_close_button"
              aria-label="팝업 닫기"
              onClick={() => {
                close()
              }}
            />
          </div>
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
          </div>
          {tabList.active === 'eventPartIn' ? (
            <div className="tabContents" id="tab_eventPartIn">
              {/* start: 이벤트 참여 상품  */}
              <div className="sortingArea">
                <div className="button_group_right">
                  <Button
                    className={'full_grey_dark'}
                    onClick={() => handleAllReject()}
                    disabled={evntStatus === '종료' ? true : productData.list.length <= 0 ? true : false}
                  >
                    전체 거절
                  </Button>

                  <Button
                    className={'full_blue'}
                    onClick={() => handleAllAdmission()}
                    disabled={evntStatus === '종료' ? true : productData.list.length <= 0 ? true : false}
                  >
                    전체 승인
                  </Button>
                </div>
              </div>
              <EventDetailList
                data={productData}
                getStatusParams={(selectedstatusParams) => {
                  getStatusParams(selectedstatusParams)
                }}
                evntStatus={evntStatus}
              />
              <div className="pagination_wrap">
                <Pagination pagingData={joinPaging} handlePaging={handleJoinPaging} />
              </div>
              {/* end: 이벤트 참여 상품  */}
            </div>
          ) : (
            <div className="tabContents" id="tab_eventAdd">
              {/* start: 참여 상품 추가  */}
              <div className="sortingArea">
                <Select
                  optionList={defaultSelect}
                  ref={sortSelect}
                  handleSelectActive={(label) => {
                    setSelectedValue(label)
                    setDefaultSelect({ ...defaultSelect, active: label })
                  }}
                />
                <input
                  name={''}
                  type="text"
                  className="input"
                  value={value}
                  defaultValue={value}
                  title={'상품명'}
                  placeholder={selectedValue == 'pdfNm' ? '상품명을 입력해주세요' : '키워드를 입력해주세요'}
                  onChange={(e) => handleSearch(e)}
                />
                <Button className={'full_blue_deep search_btn'} onClick={() => searchClick()}>
                  검색
                </Button>
                <div className="button_group_right">
                  <Button
                    className={'full_grey_dark'}
                    onClick={() => handleAddProduct()}
                    disabled={evntStatus === '종료' ? true : false}
                  >
                    선택 추가
                  </Button>

                  <Button className={'full_blue'} onClick={() => initPopup()}>
                    초기화
                  </Button>
                </div>
              </div>
              <AddNewProduct
                data={companyProductData}
                addProductInfIds={addProductInfIds}
                setAddProductInfIds={setAddProductInfIds}
                selectAllController={selectAllController}
                setSelectAllController={setSelectAllController}
              />
              <div className="pagination_wrap">
                <Pagination pagingData={companyPaging} handlePaging={handleCompanyPaging} />
              </div>
              {/* end: 참여 상품 추가  */}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EventPopup
