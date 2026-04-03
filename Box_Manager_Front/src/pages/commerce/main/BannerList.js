import { useEffect, useRef, useState, useContext, useLayoutEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import Select from 'components/atomic/Select'
import BannerTable from 'pageComponents/commerce/main/BannerTable'
import Pagination from 'components/Pagination'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { getBannerListApi } from 'modules/consts/MktApi'
import PopupAlert from 'components/PopupAlert'
import { MktContext } from 'modules/common/MktContext'
import { UserContext } from 'modules/common/UserContext'
import * as mainFn from 'modules/fns/mkt/mainFn'

const BannerList = (props) => {
  const mktContext = useContext(MktContext)
  const userContext = useContext(UserContext)
  const history = useHistory()
  const location = useLocation()
  let path = location.pathname
  let page = path.split('/')[1]

  const [dataList, setDataList] = useState(null)
  const [paging, setPaging] = useState(null)
  // 탭
  const tabList = {
    active: mktContext.state.currType,
    list: [
      { id: 'mainBanner', label: '메인배너' },
      { id: 'subBanner', label: '서브배너' },
      { id: 'prodBanner', label: '상품배너' },
      { id: 'eventBanner', label: '이벤트배너' }
    ]
  }
  const [maximumAlert, setMaximumAlert] = useState(false)

  // ===== 탭
  const handleTab = async (selected) => {
    mktContext.actions.handleSetBannerCurrType(selected)
  }

  // ===== 검색필터 : 전체, 공개, 대기, 종료
  const filterSelect = useRef(null)
  const filterSelList = {
    active: mktContext.state.bannerParam.statusCode,
    list: [
      { id: 'filter_all', value: 'filter_all', label: '전체' },
      { id: 'display', value: 'filter_public', label: '공개' },
      { id: 'stanby', value: 'filter_wait', label: '대기' },
      { id: 'close', value: 'filter_end', label: '종료' },
      { id: 'off', value: 'filter_private', label: '비공개' }
    ]
  }
  const onFilterActive = async (selected) => {
    mktContext.actions.handleSetBannerParam({
      page: 1,
      statusCode: selected
    })
  }

  // 배너 데이터 세팅
  const getList = async (type, params) => {
    setDataList(null)
    let res = await getBannerListApi(type, params)
    if (res.data.code === '200') {
      let data = res.data.data
      setDataList(data.list)
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

  // ===== 상세화면 이동 : id
  const handleView = (id) => {
    history.push(`${ROUTER_NAMES.COMMERCE_MAIN_BANNER_VIEW}/${id}`)
  }

  // ===== 등록 이동 : type (type is mainBanner, subBanner, prodBanner, eventBanner)
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
    mktContext.actions.handleSetBannerCurrType('mainBanner')
  }

  useLayoutEffect(() => {
    if ('mainBanner' !== userContext.state.category) {
      userContext.actions.setCategory('mainBanner')
      handleReset()
    }
  }, [userContext.state.category])

  useEffect(async () => {
    await getList(mktContext.state.currType, mktContext.state.bannerParam)
  }, [mktContext.state.currType, mktContext.state.bannerParam])

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'main'} currentPage={'bannerList'}>
      {maximumAlert && <PopupAlert msg={alertMsg} handlePopup={handleMaximunAlert} />}
      <div className="content_inner page_main">
        <div className="page_header">
          <h4 className="page_title">배너관리</h4>
          <div className="btn_group">
            <Button className={'full_blue w146'} onClick={() => handleWrite('mainBanner')}>
              메인 배너 등록
            </Button>
            <Button className={'full_blue w146'} onClick={() => handleWrite('subBanner')}>
              서브 배너 등록
            </Button>
            <Button className={'full_blue w146'} onClick={() => handleWrite('prodBanner')}>
              상품 배너 등록
            </Button>
            <Button className={'full_blue w146'} onClick={() => handleWrite('eventBanner')}>
              이벤트 배너 등록
            </Button>
          </div>
        </div>

        {/*commerce_banner_wrap start*/}
        <div className="commerce_banner_wrap">
          <div className={'maximum_notice'}>
            <p className="require highlight_red">
              게시중인 배너는 최대 <span className="max">{mainFn.maximumCnt[`${tabList.active}`]}</span>개 까지 설정
              가능합니다.
            </p>
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
              <Select optionList={filterSelList} ref={filterSelect} handleSelectActive={onFilterActive} />
              <div className="btn_group">
                <button className={'btn_refresh'} title={'새로고침'} onClick={handleReset}>
                  <span className="hide">새로고침</span>
                </button>
              </div>
            </div>
          </div>
          {dataList && <BannerTable dataList={dataList} handleView={handleView} paging={paging} />}
          <div className="pagination_wrap">
            {paging && <Pagination pagingData={paging} handlePaging={handlePaging} />}
          </div>
        </div>
        {/*commerce_banner_wrap end*/}
      </div>
    </PageLayout>
  )
}

export default BannerList
