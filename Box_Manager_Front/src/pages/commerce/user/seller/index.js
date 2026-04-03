import { useEffect, useRef, useState, useContext, useLayoutEffect, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import PageLayout from 'components/PageLayout'
import Pagination from 'components/Pagination'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { getSellerListApiV2, sellerRoleOffV2, sellerRoleOffCancelV2 } from 'modules/consts/MktApi'

import { MktContext } from 'modules/common/MktContext'
import moment from 'moment'

import Search from 'pageComponents/commerce/common/Search'
import { searchStatus, searchInput, searchDate } from './searchValue'
import SellerList from 'pageComponents/commerce/user/seller/List'
import RegistPop from 'pageComponents/commerce/user/seller/RegistPop'
const Seller = (props) => {
  const mktContext = useContext(MktContext)
  const history = useHistory()
  const isMounted = useRef(true)
  const [sellerData, setSellerData] = useState({
    isLoading: true,
    list: []
  })

  const [paging, setPaging] = useState(null)
  const [search, setSearch] = useState({
    startDate: moment(new Date(moment().subtract(15, 'days')))
      .format('yyyy-MM-DD')
      .toString(),
    endDate: moment().format('yyyy-MM-DD').toString(),
    bplcNm: '',
    rprsntvNm: '',
    page: 1,
    record: 10
  })

  // 상세정보
  const [detail, setDetail] = useState({
    selrUsisId: '', // 판매자이용기관ID
    mmbrsttsId: '', // 회원상태코드
    mmbrsttsCon: '' // 회원상태사유
  })

  // 상세정보
  const [submitData, setSubmitData] = useState({
    selrUsisId: '', // 판매자이용기관ID
    mmbrsttsCon: '' // 회원상태사유
  })

  // 판매자박탈 . 판매자팍탈사유 팝업 제어를 위한 state 선언
  const [regist, setRegist] = useState({ active: false })

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

  useEffect(() => {
    isMounted.current = true
    getSellerList(search)
  }, [search])

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  const handleSearch = useCallback(
    (params) => {
      setSellerData({
        isLoading: true,
        list: []
      })

      if (params.bplcNm === undefined) {
        setSearch({
          ...search,
          page: 1,
          bplcNm: '',
          ...params
        })
      } else if (params.rprsntvNm === undefined) {
        setSearch({
          ...search,
          page: 1,
          rprsntvNm: '',
          ...params
        })
      }
    },
    [search]
  )

  const getInitSellerList = useCallback(() => {
    setSellerData({
      isLoading: true,
      list: []
    })
    getSellerList(search)
  }, [search])

  const getSellerList = (params) => {
    getSellerListApiV2(params, handleSellerListCallback, handleSellerListErrorCallback)
  }

  const handleSellerListCallback = (res) => {
    if (res.data.code === '200' && isMounted.current) {
      const data = res.data.data
      setSellerData({
        isLoading: false,
        list: data.list
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

  const handleSellerListErrorCallback = () => {
    setSellerData({
      isLoading: false,
      list: []
    })
    mktContext.actions.setCommonAlertInfo({
      type: 'error',
      active: true
    })
  }

  // 판매자권한팍탈 글쓰기 팝업 제어를 위한 함수
  const handleSellerPopup = (params) => {
    if (params.active) {
      // 회원상세정보세팅
      setDetail({
        selrUsisId: params.item.selrUsisId, // 판매자이용기관ID
        mmbrsttsId: params.item.mmbrsttsId // 회원상태코드
      })

      setSubmitData({
        selrUsisId: params.item.selrUsisId, // 판매자이용기관ID
        mmbrsttsCon: params.item.mmbrsttsCon // 회원상태사유
      })

      setRegist({ active: true }) // 판매자격박탈팝업 호출
    } else {
      setRegist({ active: params.active }) // 판매자격박탈팝업 호출체크
    }
  }

  // 판매사자격박탈을 위한 handler
  const handleConfirmDeprive = (params) => {
    confirmDeprive(submitData)
  }

  const confirmDeprive = useCallback(
    (param) => {
      sellerRoleOffV2(param, handleConfirmDepriveCallback, handleConfirmDepriveErrorCallback)
    },
    [search]
  )

  const handleConfirmDepriveCallback = (res) => {
    if (res.data.code === '200') {
      const data = res.data.data
      setDetail({
        selrUsisId: '', // 판매자이용기관ID
        mmbrsttsId: '', // 회원상태코드
        mmbrsttsCon: '' // 회원상태사유
      })
      setSubmitData({
        selrUsisId: '', // 판매자이용기관ID
        mmbrsttsCon: '' // 회원상태사유
      })
      setRegist({ active: false }) // 판매자격박탈팝업 호출
      getInitSellerList() // 저장 후 재조회
    }
  }

  const handleConfirmDepriveErrorCallback = () => {
    mktContext.actions.setCommonAlertInfo({
      type: 'error',
      active: true
    })
  }

  // 판매사자격박탈 해제를 위한 handler
  const handleConfirmDepriveCancel = (params) => {
    confirmDepriveCancel({ selrUsisId: submitData.selrUsisId })
  }

  const confirmDepriveCancel = useCallback(
    (param) => {
      sellerRoleOffCancelV2(param, handleConfirmDepriveCancelCallback, handleConfirmDepriveCancelErrorCallback)
    },
    [search]
  )

  const handleConfirmDepriveCancelCallback = (res) => {
    if (res.data.code === '200') {
      const data = res.data.data
      setDetail({
        selrUsisId: '', // 판매자이용기관ID
        mmbrsttsId: '', // 회원상태코드
        mmbrsttsCon: '' // 회원상태사유
      })
      setSubmitData({
        selrUsisId: '', // 판매자이용기관ID
        mmbrsttsCon: '' // 회원상태사유
      })
      setRegist({ active: false }) // 판매자격박탈팝업 호출
      getInitSellerList() // 저장 후 재조회
    }
  }

  const handleConfirmDepriveCancelErrorCallback = () => {
    mktContext.actions.setCommonAlertInfo({
      type: 'error',
      active: true
    })
  }

  const handleSubmitData = (e) => {
    setSubmitData({ ...submitData, mmbrsttsCon: e.currentTarget.value })
  }

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'user'} currentPage={'listSeller'}>
      {regist.active && (
        <RegistPop
          detail={detail}
          submitData={submitData}
          handleSubmitData={handleSubmitData}
          handleSellerPopup={handleSellerPopup} // 팝업 show,hide handler
          handleConfirmDeprive={handleConfirmDeprive} // 판매자격박탈 handler
          handleConfirmDepriveCancel={handleConfirmDepriveCancel} // 판매자격복구 handler
        />
      )}
      {/* {maximumAlert && <PopupAlert msg={alertMsg} handlePopup={handleMaximunAlert} />} */}
      <div className="content_inner page_main">
        <div className="page_header">
          <h4 className="page_title">판매사 관리</h4>
        </div>

        {/* <TermSearchForm searchDate={searchDate} setSearchDate={setSearchDate} getList={getList} /> */}
        {/*commerce_banner_wrap start*/}
        <div className="commerce_banner_wrap">
          <div className={'maximum_notice'}>
            <p className="require highlight_grey">판매사의 판매 권한 자격을 박탈할 수 있습니다.</p>
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
                    getInitSellerList()
                  }}
                >
                  <span className="hide">새로고침</span>
                </button>
              </div>
            </div>
          </div>

          <SellerList data={sellerData} paging={paging} handleView={handleView} handleSellerPopup={handleSellerPopup} />

          <div className="pagination_wrap">
            {paging && <Pagination pagingData={paging} handlePaging={handlePaging} />}
          </div>
        </div>
        {/*commerce_banner_wrap end*/}
      </div>
    </PageLayout>
  )
}

export default Seller
