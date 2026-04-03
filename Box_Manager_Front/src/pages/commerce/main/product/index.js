import { useEffect, useRef, useState, useContext, useCallback } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import Pagination from 'components/Pagination'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { MktContext } from 'modules/common/MktContext'
import { UserContext } from 'modules/common/UserContext'
import * as mainFn from 'modules/fns/mkt/mainFn'
/////////
import Search from 'pageComponents/commerce/common/Search'
import { searchStatus, searchInput, searchDate } from 'pages/commerce/main/product/searchValue'
import List from 'pageComponents/commerce/main/product/List'
import OrderWebpop from 'pageComponents/commerce/main/product/OrderWebpop'
import OrderMobpop from 'pageComponents/commerce/main/product/OrderMobpop'
import {
  getBannerListApiV2,
  deleteBannerApiV2,
  getBannerOrderPopListApiV2,
  saveBannerOrderApi
} from 'modules/consts/MktApi'
import moment from 'moment'
import { termFormatter } from 'modules/common'

const Product = (props) => {
  const mktContext = useContext(MktContext)
  const userContext = useContext(UserContext)
  const history = useHistory()
  const location = useLocation()
  let path = location.pathname
  let page = path.split('/')[1]
  const isMounted = useRef(true)
  const historyWebYn = props.location.state

  const [paging, setPaging] = useState(null)
  // 탭
  const tabList = {
    active: mktContext.state.currType,
    list: [
      { id: 'webMain', label: '웹 메인' },
      { id: 'MobileMain', label: '모바일 메인' }
    ]
  }

  const maintype = 'mainBanner'
  const [search, setSearch] = useState({
    startDate: moment(new Date(moment().subtract(15, 'days')))
      .format('yyyy-MM-DD')
      .toString(),
    endDate: moment().format('yyyy-MM-DD').toString(),
    bannerTitle: '',
    bannerExpl: '',
    page: 1,
    record: 10,
    webYn: historyWebYn != undefined ? historyWebYn.webYn : 'webMain'
  })

  const [bannerListData, setBannerListData] = useState({
    isLoading: true,
    list: []
  })
  const [maximumAlert, setMaximumAlert] = useState(false)
  //삭제 컴포넌트
  const [delBannerIds, setDelBannerIds] = useState([])

  ////////////////
  // ===== 탭
  const handleTab = (selected) => {
    mktContext.actions.handleSetBannerCurrType(selected)
    setBannerListData({
      isLoading: true,
      list: []
    })
    setSearch({
      ...search,
      page: 1,
      webYn: selected
    })
  }

  ///노출순서관리관련///
  //노출순서관리 상태값
  const [orderWPop, setOrderWPop] = useState(false)
  const [orderMPop, setOrderMPop] = useState(false)
  const [orderBaseList, setOrderBaseList] = useState([])
  const [orderPopSelectList, setOrderPopSelectList] = useState({})
  const [itmSelect, setItmSelect] = useState([
    { id: '', order: 0 },
    { id: '', order: 0 },
    { id: '', order: 0 },
    { id: '', order: 0 },
    { id: '', order: 0 },
    { id: '', order: 0 },
    { id: '', order: 0 },
    { id: '', order: 0 },
    { id: '', order: 0 },
    { id: '', order: 0 }
  ])
  const SwiperMain = [
    {
      imgUrl: require('assets/images/temp/main_swiper1@2x.png').default,
      con: '{"ttlTxt1":"기본이미지 입니다.", "ttlTxt2":"배너를 등록해주세요"}',
      ymd: '',
      ttl: '기본제목입니다.'
    },
    {
      imgUrl: require('assets/images/temp/main_swiper1@2x.png').default,
      con: '{"ttlTxt1":"기본이미지 입니다.", "ttlTxt2":"배너를 등록해주세요"}',
      ymd: '',
      ttl: '기본제목입니다.'
    },
    {
      imgUrl: require('assets/images/temp/main_swiper1@2x.png').default,
      con: '{"ttlTxt1":"기본이미지 입니다.", "ttlTxt2":"배너를 등록해주세요"}',
      ymd: '',
      ttl: '기본제목입니다.'
    }
  ]
  ///함수
  const handleOrderPop = () => {
    getBannerOrderPopListApiV2(maintype, search, getorderPopCallback, handleBannerListErrorCallback)
  }
  const closeOrderPop = () => {
    setOrderPopSelectList([])
    setOrderBaseList([])
    mktContext.state.currType === 'webMain' ? setOrderWPop(false) : setOrderMPop(false)
    getBannerList(search)
    //모바일분기필요
  }
  //순서노출관리 데이터 가져오기 및 편집
  const getorderPopCallback = (res) => {
    if (isMounted.current) {
      if (res.data.code === '200') {
        const _data = res.data.data
        const orginList = _data.list
        const defaultSelect = [{ id: '', value: '', label: '메인 콘텐츠를 선택하세요.' }]
        const openBanner = orginList.filter((item) => item.status == '공개')
        if (openBanner.length > 0) {
          if (orginList.length > 0) {
            //화면에 표시될 리스트
            const editList = orginList?.map((item) => ({
              id: item.banInfId,
              value: item.banInfId,
              label: `${item.ttl}(${termFormatter(item.stdy)}~${termFormatter(item.fnda)})`,
              order: item.infoSqn,
              imgUrl: item.imgUrl,
              ymd: `${termFormatter(item.stdy)}~${termFormatter(item.fnda)}`,
              ttl: item.ttl,
              con: item.con,
              disabled: item.infoSqn == 0 ? false : true,
              webYn: mktContext.state.currType
            }))
            const newItems = [
              { id: '', order: 0 },
              { id: '', order: 0 },
              { id: '', order: 0 },
              { id: '', order: 0 },
              { id: '', order: 0 },
              { id: '', order: 0 },
              { id: '', order: 0 },
              { id: '', order: 0 },
              { id: '', order: 0 },
              { id: '', order: 0 }
            ]

            for (let obj of orginList) {
              if (obj.infoSqn != 0) {
                newItems[obj.infoSqn - 1].id = obj.banInfId
                newItems[obj.infoSqn - 1].order = obj.infoSqn
              }
            }
            //기존순번정보
            setItmSelect(newItems)
            //미리보기 기본정보
            let setDefaultPreview = editList.filter((_item, index) => _item.order != 0)
            setDefaultPreview = setDefaultPreview.length > 0 ? setDefaultPreview : SwiperMain
            setOrderBaseList(setDefaultPreview)
            defaultSelect.push(editList)
            setOrderPopSelectList(defaultSelect.flat())
            mktContext.state.currType === 'webMain' ? setOrderWPop(true) : setOrderMPop(true)
          }
        } else {
          mktContext.actions.setCommonAlertInfo({
            type: 'alert',
            active: true,
            msg: '공개 중인 배너가 없습니다.'
          })
        }

        //모바일분기필요
      }
    }
  }

  //
  const saveBannerOrder = (params) => {
    const newParams = params?.map((item) => ({
      banInfId: item.id,
      infoSqn: item.order,
      webYn: mktContext.state.currType
    }))
    //aipv2
    saveBannerOrderApi(maintype, newParams, orderSaveCallback, handleBannerListErrorCallback)
  }

  const orderSaveCallback = (res) => {
    if (isMounted.current) {
      if (res.data.code === '200') {
        closeOrderPop()
      }
    }
  }
  //////////노출순서관리관련//////////

  // ===== 상세화면 이동 : id
  const handleRegistrationView = (id) => {
    // 등록화면
    history.push(`${ROUTER_NAMES.COMMERCE_MAIN_PRODUCT_REGISTRATION}`)
  }

  // ===== 등록 이동 : type (type is webMain, MobileMain)
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
    if (search.page != param.page) {
      setSearch({
        ...search,
        page: param.page
      })
    }
  }
  //최초실행시 웹메인카테고리 선택
  useEffect(() => {
    mktContext.actions.handleSetBannerCurrType(historyWebYn != undefined ? historyWebYn.webYn : 'webMain')
    return () => {
      isMounted.current = false
    }
  }, [])

  ////HCJ////////////////////////////////////////////////////////////
  // 배너 데이터 세팅
  const getListCallback = (res) => {
    if (isMounted.current) {
      if (res.data.code === '200') {
        let data = res.data.data
        setBannerListData({
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

  //검색
  const handleSearch = (params) => {
    setBannerListData({
      isLoading: true,
      list: []
    })

    if (params.bannerExpl === undefined) {
      setSearch({
        ...search,
        page: 1,
        ...params,
        bannerExpl: '',
        webYn: mktContext.state.currType
      })
    } else if (params.bannerTitle === undefined) {
      setSearch({
        ...search,
        page: 1,
        ...params,
        bannerTitle: '',
        webYn: mktContext.state.currType
      })
    }
  }

  //검색 값들이 변경될때 목록조회
  useEffect(() => {
    isMounted.current = true
    getBannerList(search)
  }, [search])

  //상품목록조회하기
  const getBannerList = (params) => {
    //aipv2
    getBannerListApiV2(maintype, params, getListCallback, handleBannerListErrorCallback)
  }

  //에러콜백
  const handleBannerListErrorCallback = () => {
    setBannerListData({
      isLoading: false,
      list: []
    })
    mktContext.actions.setCommonAlertInfo({
      type: 'error',
      active: true
    })
  }

  //새로고침
  const getInitBannerList = () => {
    mktContext.actions.handleSetBannerCurrType(mktContext.state.currType)
    setBannerListData({
      isLoading: true,
      list: []
    })
    getBannerList(search)
  }

  const handleDeleteCallback = () => {
    getInitBannerList()
  }
  //삭제
  const handleDelete = () => {
    if (delBannerIds?.length > 0) {
      for (let banner of delBannerIds) {
        if (banner.status === '공개') {
          mktContext.actions.setCommonAlertInfo({
            type: 'alert',
            active: true,
            msg: '공개 배너는 삭제가 불가능 합니다.'
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
          deleteBannerApiV2(
            maintype,
            delBannerIds.map((_item) => _item.banInfId),
            handleDeleteCallback,
            handleBannerListErrorCallback
          )
          setDelBannerIds([])
        }
      })
    } else {
      mktContext.actions.setCommonAlertInfo({
        type: 'alert',
        active: true,
        msg: '삭제할 배너를 선택해주세요.'
      })
    }
  }

  const onChange = (newList) => {
    setBannerListData({
      isLoading: false,
      list: newList
    })
  }

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'main'} currentPage={'prodList'}>
      {/* {maximumAlert && <PopupAlert msg={alertMsg} handlePopup={handleMaximunAlert} />} */}
      <div className="content_inner page_main">
        <div className="page_header">
          <h4 className="page_title">상품 메인</h4>
        </div>

        {/* <TermSearchForm searchDate={searchDate} setSearchDate={setSearchDate} getList={getList} /> */}
        {/*commerce_banner_wrap start*/}
        <div className="commerce_banner_wrap">
          <div className={'maximum_notice'}>
            <p className="require highlight_grey">
              게시중인 배너는 최대 <span className="max">5</span>개 까지 설정 가능합니다.
            </p>
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
                    getInitBannerList()
                  }}
                >
                  <span className="hide">새로고침</span>
                </button>
              </div>
            </div>
          </div>
          <div className="button_group_right">
            <Button className={'full_blue'} onClick={handleOrderPop}>
              노출순서관리
            </Button>
            <Button className={'full_grey_dark'} onClick={handleDelete}>
              삭제
            </Button>

            <Button className={'full_blue'} onClick={handleRegistrationView}>
              등록
            </Button>
          </div>
          {tabList.active === 'webMain' ? (
            <List
              dataList={bannerListData}
              delBannerIds={delBannerIds}
              setDelBannerIds={setDelBannerIds}
              onChange={onChange}
            />
          ) : tabList.active === 'MobileMain' ? (
            <List
              dataList={bannerListData}
              delBannerIds={delBannerIds}
              setDelBannerIds={setDelBannerIds}
              onChange={onChange}
            />
          ) : (
            ''
          )}
          <div className="pagination_wrap">
            <Pagination pagingData={paging} handlePaging={handlePaging} />
          </div>
        </div>
        {orderWPop && (
          <OrderWebpop
            saveBannerOrder={(e) => {
              saveBannerOrder(e)
            }}
            onClosed={closeOrderPop}
            selectList={orderPopSelectList}
            orderBaseList={orderBaseList}
            defList={SwiperMain}
            itmSelect={itmSelect}
            maintype={maintype}
          ></OrderWebpop>
        )}
        {orderMPop && (
          <OrderMobpop
            saveBannerOrder={(e) => {
              saveBannerOrder(e)
            }}
            onClosed={closeOrderPop}
            selectList={orderPopSelectList}
            orderBaseList={orderBaseList}
            defList={SwiperMain}
            itmSelect={itmSelect}
            maintype={maintype}
          ></OrderMobpop>
        )}
        {/*commerce_banner_wrap end*/}
      </div>
    </PageLayout>
  )
}

export default Product
