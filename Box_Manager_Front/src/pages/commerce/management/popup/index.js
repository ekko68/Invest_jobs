import { useEffect, useState, useContext, useCallback, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import Pagination from 'components/Pagination'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { getPopupListApiV2, deletePopupApiV2 } from 'modules/consts/MktApi'

import { MktContext } from 'modules/common/MktContext'
import moment from 'moment'

import Search from 'pageComponents/commerce/common/Search'
import { searchStatus, searchInput, searchDate } from './searchValue'
import PopupList from 'pageComponents/commerce/management/popup/List'

const Popup = () => {
  const mktContext = useContext(MktContext)
  const history = useHistory()
  const [popupData, setPopupData] = useState({
    isLoading: true,
    list: []
  })
  const [paging, setPaging] = useState(null)
  const [search, setSearch] = useState({
    startDate: moment(new Date(moment().subtract(15, 'days')))
      .format('yyyy-MM-DD')
      .toString(),
    endDate: moment().format('yyyy-MM-DD').toString(),
    page: 1,
    record: 10
  })
  const [delPopInfIds, setDelPopInfIds] = useState([])
  const isMounted = useRef(true)

  // ===== 상세화면 이동 : id
  const handleView = (id) => {
    history.push(`${ROUTER_NAMES.COMMERCE_MAIN_BANNER_VIEW}/${id}`)
  }

  const handleRegistrationView = (id) => {
    // 등록화면
    history.push(`${ROUTER_NAMES.COMMERCE_MANAGEMENT_POPUP_REGISTRATION}`)
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

  useEffect(() => {
    isMounted.current = true
    getPopupList(search)
  }, [search])

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  const handleSearch = useCallback(
    (params) => {
      setPopupData({
        isLoading: true,
        list: []
      })
      setSearch({
        ...search,
        page: 1,
        ...params
      })
    },
    [search]
  )

  const getInitPopupList = useCallback(() => {
    setPopupData({
      isLoading: true,
      list: []
    })
    getPopupList(search)
  }, [search])

  const getPopupList = useCallback((params) => {
    getPopupListApiV2(params, handlePopupListCallback, handlePopupListErrorCallback)
  }, [])

  const handlePopupListCallback = (res) => {
    if (isMounted.current) {
      if (res.data.code === '200') {
        const data = res.data.data
        setPopupData({
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
  }

  const handlePopupListErrorCallback = () => {
    setPopupData({
      isLoading: false,
      list: []
    })
    mktContext.actions.setCommonAlertInfo({
      type: 'error',
      active: true
    })
  }

  const handleDelete = () => {
    if (delPopInfIds?.length > 0) {
      for (let popup of delPopInfIds) {
        if (popup.status === '공개') {
          mktContext.actions.setCommonAlertInfo({
            type: 'alert',
            active: true,
            msg: '공개 팝업은 삭제가 불가능 합니다.'
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
          deletePopupApiV2(
            delPopInfIds.map((_item) => _item.popupInfId),
            handleDeleteCallback,
            handlePopupListErrorCallback
          )
          setDelPopInfIds([])
        }
      })
    } else {
      mktContext.actions.setCommonAlertInfo({
        type: 'alert',
        active: true,
        msg: '삭제할 팝업을 선택해주세요.'
      })
    }
  }

  const handleDeleteCallback = () => {
    getInitPopupList()
  }

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'popup'}>
      {/* {maximumAlert && <PopupAlert msg={alertMsg} handlePopup={handleMaximunAlert} />} */}
      <div className="content_inner page_main">
        <div className="page_header">
          <h4 className="page_title">팝업 관리</h4>
        </div>

        {/* <TermSearchForm searchDate={searchDate} setSearchDate={setSearchDate} getList={getList} /> */}
        {/*commerce_banner_wrap start*/}
        <div className="commerce_banner_wrap">
          <div className={'maximum_notice'}>
            <p className="require highlight_grey">홍보관 BOX 상품 메인 화면에 안내창을 팝업 할 수 있습니다.</p>
          </div>

          <Search
            check1={searchStatus}
            input={searchInput}
            date={searchDate}
            onSearch={(params) => {
              handleSearch(params)
            }}
          />

          {/*tab_header start*/}
          <div className="tab_header">
            <div className="page_header_right">
              <div className="btn_group">
                <button
                  className={'btn_refresh'}
                  title={'새로고침'}
                  onClick={() => {
                    getInitPopupList()
                  }}
                >
                  <span className="hide">새로고침</span>
                </button>
              </div>
            </div>
          </div>
          <div className="button_group_right">
            <Button className={'full_grey_dark'} onClick={handleDelete}>
              삭제
            </Button>

            <Button className={'full_blue'} onClick={handleRegistrationView}>
              등록
            </Button>
          </div>
          <PopupList
            data={popupData}
            handleView={handleView}
            delPopInfIds={delPopInfIds}
            setDelPopInfIds={setDelPopInfIds}
          />
          <div className="pagination_wrap">
            {paging && <Pagination pagingData={paging} handlePaging={handlePaging} />}
          </div>
        </div>
        {/*commerce_banner_wrap end*/}
      </div>
    </PageLayout>
  )
}

export default Popup
