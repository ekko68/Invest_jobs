import { useEffect, useRef, useState, useContext, useLayoutEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'

import EventList from 'pageComponents/commerce/management/event/List'
import StatusList from 'pageComponents/commerce/management/event/StatusList'
import Pagination from 'components/Pagination'
import ROUTER_NAMES from 'modules/consts/RouterConst'

import { getEventListApiV2 } from 'modules/consts/MktApi'
import { MktContext } from 'modules/common/MktContext'
import { UserContext } from 'modules/common/UserContext'
import * as mainFn from 'modules/fns/mkt/mainFn'
import Search from 'pageComponents/commerce/common/Search'
import { searchStatus, searchInput, searchDate } from './searchValue'
import moment from 'moment'
import EventPopup from 'pageComponents/commerce/management/event/popup/JoinProduct'
// const [searchDate, setSearchDate] = useState({
//   startDate: new Date(),
//   endDate: new Date()
// })

const ManagementEventList = (props) => {
  const { selectList, onSelectActive, value } = props
  const [popupHendler, setPopupHendler] = useState({ active: false })
  const [popupData, setPopupData] = useState()
  const [eventData, setEventData] = useState({
    isLoading: true,
    list: []
  })

  const mktContext = useContext(MktContext)
  const userContext = useContext(UserContext)
  const history = useHistory()

  const [search, setSearch] = useState({
    startDate: moment(new Date(moment().subtract(15, 'days')))
      .format('yyyy-MM-DD')
      .toString(),
    endDate: moment().format('yyyy-MM-DD').toString(),
    page: 1,
    record: 10
  })

  useEffect(() => {
    getEventList(search)
  }, [search])

  const getInitEventList = useCallback(() => {
    setEventData({
      isLoading: true,
      list: []
    })
    setSearch({
      startDate: moment(new Date(moment().subtract(15, 'days')))
        .format('yyyy-MM-DD')
        .toString(),
      endDate: moment().format('yyyy-MM-DD').toString(),
      page: 1,
      record: 10
    })
    getEventList(search)
  }, [search])

  const getEventList = useCallback((params) => {
    getEventListApiV2(params, handleEventListCallback, handleEventListErrorCallback)
  }, [])

  const handleEventListCallback = (res) => {
    if (res.data.code === '200') {
      const data = res.data.data
      setEventData({
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

  const handleEventListErrorCallback = () => {
    setEventData({
      isLoading: false,
      list: []
    })
    mktContext.actions.setCommonAlertInfo({
      type: 'error',
      active: true
    })
  }

  const handleSearch = useCallback(
    (params) => {
      setEventData({
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
  const [paging, setPaging] = useState(null)
  // 탭

  const tabList = {
    active: mktContext.state.currType,
    list: [
      { id: 'eventListTab', label: '이벤트 목록' },
      { id: 'eventStatusTab', label: '이벤트 현황' }
    ]
  }
  // ===== 탭
  const handleTab = async (selected) => {
    mktContext.actions.handleSetBannerCurrType(selected)
  }

  // ===== 상세화면 이동 : id
  const handleView = (id) => {
    history.push(`${ROUTER_NAMES.COMMERCE_MAIN_BANNER_VIEW}/${id}`)
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

  // ===== reset
  const handleReset = () => {
    mktContext.actions.handleSetBannerCurrType('eventListTab')
  }

  useLayoutEffect(() => {
    if ('eventListTab' !== userContext.state.category) {
      userContext.actions.setCategory('eventListTab')
      handleReset()
    }
  }, [])

  const handleRegistrationView = (id) => {
    // 등록화면
    history.push(`${ROUTER_NAMES.COMMERCE_MANAGEMENT_EVENT_REGISTRATION}`)
  }

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'event'}>
      {/* {maximumAlert && <PopupAlert msg={alertMsg} handlePopup={handleMaximunAlert} />} */}
      <div className="content_inner page_main">
        <div className="page_header">
          <h4 className="page_title">이벤트 관리</h4>
        </div>

        {/* <TermSearchForm searchDate={searchDate} setSearchDate={setSearchDate} getList={getList} /> */}
        {/*commerce_banner_wrap start*/}
        <div className="commerce_banner_wrap">
          <div className={'maximum_notice'}>
            <p className="highlight_grey">이벤트를 생성할 수 있습니다.</p>
          </div>
          <div className={'search_table_wrap'}>
            <Search
              check1={searchStatus}
              input={searchInput}
              date={searchDate}
              onSearch={(params) => {
                handleSearch(params)
              }}
            />
          </div>
          {/*tab_header start*/}
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
            <div className="page_header_right">
              <div className="btn_group">
                <button
                  className={'btn_refresh'}
                  title={'새로고침'}
                  onClick={() => {
                    getInitEventList
                  }}
                >
                  <span className="hide">새로고침</span>
                </button>
              </div>
            </div>
          </div>
          <div className="button_group_right">
            {/* <Button className={'full_grey_dark'} onClick={() => {}}>
              삭제
            </Button> */}

            <Button className={'full_blue'} onClick={handleRegistrationView}>
              등록
            </Button>
          </div>
          {tabList.active === 'eventListTab' ? (
            <EventList eventData={eventData} handleView={handleView} />
          ) : tabList.active === 'eventStatusTab' ? (
            <StatusList
              eventData={eventData}
              handleView={handleView}
              setPopupData={setPopupData}
              setPopupHendler={setPopupHendler}
              getEventList={getEventList}
              search={search}
            />
          ) : (
            ''
          )}
          <div className="pagination_wrap">
            {paging && <Pagination pagingData={paging} handlePaging={handlePaging} />}
          </div>
        </div>
        {/*commerce_banner_wrap end*/}
      </div>
      {popupHendler.active && <EventPopup evntInfId={popupData} />}
    </PageLayout>
  )
}

export default ManagementEventList
