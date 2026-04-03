import { useEffect, useRef, useState, useContext, useLayoutEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import Select from 'components/atomic/Select'
import Checkbox from 'components/atomic/Checkbox'
import ExSearchTableNew from 'pageComponents/commerce/main/ExSearchTableNew'
import ExRecommendSearchTableNew from 'pageComponents/commerce/main/ExRecommendSearchTableNew'
import Pagination from 'components/Pagination'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import PopupAlert from 'components/PopupAlert'
import { MktContext } from 'modules/common/MktContext'
import { UserContext } from 'modules/common/UserContext'
import * as mainFn from 'modules/fns/mkt/mainFn'
import Toggle from 'components/Toggle'

const Admin_Enterprise_search_01_1 = (props) => {
  const { selectList, onSelectActive, value, idx } = props

  const searchSelect = useRef(null)
  const defaultSelect = {
    active: 'searchViewPage1',
    list: [
      { id: 'searchViewPage1', value: 'searchViewPage1', label: '20' },
      { id: 'searchViewPage2', value: 'searchViewPage2', label: '50' }
    ]
  }

  const SearchData = {
    header: [
      {
        first: '순위',
        title: '검색어',
        views: '조회수'
      }
    ],
    data: [
      {
        first: '00',
        title:
          '검색어검색어검색어검색어검색어검색어검색어검색어검색어검색어검색어검색어검색어검색어검색어검색어검색어검색어검색어',
        views: '100'
      },
      {
        first: '01',
        title: '검색어검색어',
        views: '00'
      },
      {
        first: '02',
        title: '검색어검색어검색어검색어검색어검색어검색어검색어검색어검색어검색어검색어검색어검색어',
        views: '200'
      },
      {
        first: '03',
        title: '검색어검색어',
        views: '200'
      },
      {
        first: '04',
        title: '검색어검색어',
        views: '200'
      },
      {
        first: '05',
        title: '검색어검색어',
        views: '200'
      },
      {
        first: '06',
        title: '검색어검색어',
        views: '200'
      },
      {
        first: '07',
        title: '검색어검색어',
        views: '200'
      },
      {
        first: '08',
        title: '검색어검색어',
        views: '200'
      },
      {
        first: '09',
        title: '검색어검색어',
        views: '200'
      },
      {
        first: '10',
        title: '검색어검색어',
        views: '200'
      }
    ]
  }

  const RecommendSearchData = {
    header: [
      {
        first: (
          <Checkbox
            className="no_label"
            checkbox={{ id: 'cell_checkAll', value: '', status: true }}
            onChange={() => {}}
          />
        ),
        title: '검색어',
        date: '기간',
        views: '조회수',
        status: '상태',
        order: '순서'
      }
    ],
    data: [
      {
        first: (
          <Checkbox
            className="no_label"
            checkbox={{ id: 'cell_check01', value: '', status: true }}
            onChange={() => {}}
          />
        ),
        title: '검색어검색어검색어검색어검색어검색어',
        date: '2023.05.31 ~ 2023.05.31',
        views: '00',
        status: (
          <Toggle
            className="theme_blue2"
            data={{
              id: `toggle_01`,
              value: '',
              status: true
            }}
            onChange={() => {}}
          />
        ),
        order: <button type="button" className="drag_button" aria-label="드래그해서 이동" />
      },
      {
        first: (
          <Checkbox
            className="no_label"
            checkbox={{ id: 'cell_check01', value: '', status: true }}
            onChange={() => {}}
          />
        ),
        title: '검색어검색어검색어검색어검색어검색어',
        date: '2023.05.31 ~ 2023.05.31',
        views: '00',
        status: (
          <Toggle
            className="theme_blue2"
            data={{
              id: `toggle_02`,
              value: '',
              status: true
            }}
            onChange={() => {}}
          />
        ),
        order: <button type="button" className="drag_button" aria-label="드래그해서 이동" />
      },
      {
        first: (
          <Checkbox
            className="no_label"
            checkbox={{ id: 'cell_check01', value: '', status: true }}
            onChange={() => {}}
          />
        ),
        title: '검색어검색어검색어검색어검색어검색어',
        date: '2023.05.31 ~ 2023.05.31',
        views: '00',
        status: (
          <Toggle
            className="theme_blue2"
            data={{
              id: `toggle_03`,
              value: '',
              status: false
            }}
            onChange={() => {}}
          />
        ),
        order: <button type="button" className="drag_button" aria-label="드래그해서 이동" />
      }
    ]
  }
  const PopularSearchesData = {
    header: [
      {
        first: (
          <Checkbox
            className="no_label"
            checkbox={{ id: 'cell_checkAll', value: '', status: true }}
            onChange={() => {}}
          />
        ),
        title: '검색어',
        date: '기간',
        views: '조회수',
        status: '상태',
        order: '순서'
      }
    ],
    data: [
      {
        first: (
          <Checkbox
            className="no_label"
            checkbox={{ id: 'cell_check01', value: '', status: true }}
            onChange={() => {}}
          />
        ),
        title: '검색어검색어검색어검색어검색어검색어',
        date: '2023.05.31 ~ 2023.05.31',
        views: '00',
        status: (
          <Toggle
            className="theme_blue2"
            data={{
              id: `toggle_01`,
              value: '',
              status: true
            }}
            onChange={() => {}}
          />
        ),
        order: <button type="button" className="drag_button" aria-label="드래그해서 이동" />
      },
      {
        first: (
          <Checkbox
            className="no_label"
            checkbox={{ id: 'cell_check01', value: '', status: true }}
            onChange={() => {}}
          />
        ),
        title: '검색어검색어검색어검색어검색어검색어',
        date: '2023.05.31 ~ 2023.05.31',
        views: '00',
        status: (
          <Toggle
            className="theme_blue2"
            data={{
              id: `toggle_02`,
              value: '',
              status: true
            }}
            onChange={() => {}}
          />
        ),
        order: <button type="button" className="drag_button" aria-label="드래그해서 이동" />
      },
      {
        first: (
          <Checkbox
            className="no_label"
            checkbox={{ id: 'cell_check01', value: '', status: true }}
            onChange={() => {}}
          />
        ),
        title: '검색어검색어검색어검색어검색어검색어',
        date: '2023.05.31 ~ 2023.05.31',
        views: '00',
        status: (
          <Toggle
            className="theme_blue2"
            data={{
              id: `toggle_03`,
              value: '',
              status: false
            }}
            onChange={() => {}}
          />
        ),
        order: <button type="button" className="drag_button" aria-label="드래그해서 이동" />
      }
    ]
  }
  const mktContext = useContext(MktContext)
  const userContext = useContext(UserContext)
  const history = useHistory()
  const location = useLocation()
  let path = location.pathname
  let page = path.split('/')[1]

  const [paging, setPaging] = useState(null)
  // 탭
  const tabList = {
    active: mktContext.state.currType,
    list: [
      { id: 'search', label: '검색' },
      { id: 'recommendSearchTerms', label: '추천검색어' },
      { id: 'popularSearches', label: '인기검색어' }
    ]
  }
  const [maximumAlert, setMaximumAlert] = useState(false)

  // ===== 탭
  const handleTab = async (selected) => {
    mktContext.actions.handleSetBannerCurrType(selected)
  }

  // ===== 검색필터 : 전체, 공개, 대기, 종료
  const filterSelect = useRef(null)

  const onFilterActive = async (selected) => {
    mktContext.actions.handleSetBannerParam({
      page: 1,
      statusCode: selected
    })
  }

  // ===== 상세화면 이동 : id
  const handleView = (id) => {
    history.push(`${ROUTER_NAMES.COMMERCE_MAIN_BANNER_VIEW}/${id}`)
  }

  // ===== 등록 이동 : type (type is search, recommendSearchTerms, popularSearches)
  const [alertMsg, setAlertMsg] = useState('')
  const handleWrite = async (type) => {
    setAlertMsg(null)
    let maximumValidate = await mainFn.handleMaximumCheck(type, handleMaximunAlert)
    setAlertMsg(`게시중인 배너는 최대 ${mainFn.maximumCnt[type]}개까지\n설정 가능합니다.`)
    if (maximumValidate) {
      history.push(`${ROUTER_NAMES.COMMERCE_MAIN_BANNER_WRITE}/${type}`)
    }
  }

  // ===== maximunAlert
  const handleMaximunAlert = () => {
    setMaximumAlert(!maximumAlert)
  }

  // ===== 페이징
  const handlePaging = (param) => {
    let params = {
      ...mktContext.state.bannerParam,
      ...param
    }
    mktContext.actions.handleSetBannerParam(params)
  }

  // ===== reset
  const handleReset = () => {
    mktContext.actions.handleSetBannerCurrType('search')
  }

  useLayoutEffect(() => {
    if ('search' !== userContext.state.category) {
      userContext.actions.setCategory('search')
      handleReset()
    }
  }, [userContext.state.category])

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'main'} currentPage={'bannerList'}>
      {/* {maximumAlert && <PopupAlert msg={alertMsg} handlePopup={handleMaximunAlert} />} */}
      <div className="content_inner page_main">
        <div className="page_header">
          <h4 className="page_title">검색 관리</h4>
        </div>

        {/* <TermSearchForm searchDate={searchDate} setSearchDate={setSearchDate} getList={getList} /> */}
        {/*commerce_banner_wrap start*/}
        <div className="commerce_banner_wrap">
          <div className={'maximum_notice'}>
            <p className="require highlight_grey">추천 / 인기 검색어를 설정 합니다.</p>
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
                <button className={'btn_refresh'} title={'새로고침'} onClick={handleReset}>
                  <span className="hide">새로고침</span>
                </button>
              </div>
            </div>
          </div>
          {/* <ExSearchTableNew dataList={SearchData} handleView={handleView} />
          <ExRecommendSearchTableNew dataList={RecommendSearchData} handleView={handleView} /> */}
          {/* <ExSearchTableNew dataList={mainData} handleView={handleView} /> */}
          {tabList.active === 'search' ? (
            <>
              <div className="button_group_right">
                <Select
                  className="selectSmall"
                  optionList={selectList ? selectList : defaultSelect}
                  handleSelectActive={onSelectActive}
                  ref={searchSelect}
                />
              </div>
              <ExSearchTableNew dataList={SearchData} handleView={handleView} />
            </>
          ) : tabList.active === 'recommendSearchTerms' ? (
            <>
              <div className="button_group_right">
                <Button className={'full_grey_dark'} onClick={() => {}}>
                  삭제
                </Button>

                <Button className={'full_blue'} onClick={() => {}}>
                  등록
                </Button>
              </div>
              <ExRecommendSearchTableNew dataList={RecommendSearchData} handleView={handleView} />
            </>
          ) : tabList.active === 'popularSearches' ? (
            <>
              <div className="button_group_right">
                <Button className={'full_grey_dark'} onClick={() => {}}>
                  삭제
                </Button>

                <Button className={'full_blue'} onClick={() => {}}>
                  등록
                </Button>
              </div>
              <ExRecommendSearchTableNew dataList={PopularSearchesData} handleView={handleView} />
            </>
          ) : (
            ''
          )}
          <div className="pagination_wrap">
            <Pagination
              pagingData={{ totalPage: 40, startPage: 1, page: 5, prev: true, next: true, endPage: 10 }}
              handlePaging={handlePaging}
            />
          </div>
        </div>
        {/*commerce_banner_wrap end*/}
      </div>
    </PageLayout>
  )
}

export default Admin_Enterprise_search_01_1
