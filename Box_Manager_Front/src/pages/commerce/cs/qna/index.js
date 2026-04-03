import Button from 'components/atomic/Button'
import Checkbox from 'components/atomic/Checkbox'
import PageLayout from 'components/PageLayout'
import Pagination from 'components/Pagination'
import ko from 'date-fns/locale/ko'
import { MktContext } from 'modules/common/MktContext'
import { UserContext } from 'modules/common/UserContext'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import * as mainFn from 'modules/fns/mkt/mainFn'
import { useEffect, useState, useContext, useCallback, useRef } from 'react'
import DatePicker from 'react-datepicker'
import { useHistory, useLocation } from 'react-router-dom'
import List from './../../../../pageComponents/commerce/cs/qna/List'
import { searchStatus2, inquiryStatus, searchInput, searchDate } from 'pages/commerce/management/popup/searchValue'
import { getQnaListApiV2 } from 'modules/consts/MktApi'
import Search from 'pageComponents/commerce/common/Search'
import moment from 'moment'

const Qna = () => {
  const mktContext = useContext(MktContext)
  const userContext = useContext(UserContext)
  const history = useHistory()
  const isMounted = useRef(true)
  const [qnaData, setQnaData] = useState({
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

  // ===== 상세화면 이동 : id
  const handleView = (id) => {
    history.push(`${ROUTER_NAMES.COMMERCE_CS_QNA_REGISTRATION}/${id}`)
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

  const handleSearch = useCallback((params) => {
    setQnaData({
      isLoading: true,
      list: []
    })
    setSearch((prevSearch) => ({
      ...prevSearch,
      page: 1,
      ...params
    }))
  }, [])

  // ===== reset
  const handleReset = useCallback(() => {
    setQnaData({
      isLoading: true,
      list: []
    })
    getQnaList(search)
  }, [search])

  const getQnaList = useCallback(
    (params) => {
      let inquTypeId = ''
      let inquSttId = ''
      for (let i = 0; i < Object.keys(params).length; i++) {
        if (Object.keys(params)[i].indexOf('AIS000') > -1) {
          if (Object.values(params)[i] === 'Y') {
            inquTypeId += Object.keys(params)[i] + ','
          }
        }

        if (Object.keys(params)[i].indexOf('AIS010') > -1) {
          if (Object.values(params)[i] === 'Y') {
            inquSttId += Object.keys(params)[i] + ','
          }
        }
      }

      inquTypeId = inquTypeId.slice(0, -1)
      inquSttId = inquSttId.slice(0, -1)

      const newParam = {
        inquTypeId: inquTypeId,
        inquSttId: inquSttId,
        startDate: params.startDate,
        endDate: params.endDate,
        ttl: params.popupTitle,
        page: params.page,
        record: params.record
      }
      getQnaListApiV2(newParam, handleQnaListCallback, handleQnaListErrorCallback)
    },
    [search]
  )

  const handleQnaListCallback = (res) => {
    if (res.data.code === '200' && isMounted.current) {
      const data = res.data.data
      setQnaData({
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

  const handleQnaListErrorCallback = () => {
    setQnaData({
      isLoading: false,
      list: []
    })
    mktContext.actions.setCommonAlertInfo({
      type: 'error',
      active: true
    })
  }

  useEffect(() => {
    isMounted.current = true
    getQnaList(search)
  }, [search])

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'cs'} currentPage={'csQna'}>
      <div className="content_inner page_main">
        <div className="page_header">
          <h4 className="page_title">문의 관리</h4>
        </div>

        {/*commerce_banner_wrap start*/}
        <div className="commerce_banner_wrap">
          <div className={'maximum_notice'}>
            <p className="highlight_grey">판매사 / 에이전시 회원의 문의 사항을 확인하고 답변을 작성할 수 있습니다.</p>
          </div>
          <Search
            check1={searchStatus2}
            check2={inquiryStatus}
            input={searchInput}
            date={searchDate}
            onSearch={(params) => {
              handleSearch(params)
            }}
          />
          <div className="tab_header">
            <div className="page_header_right">
              <div className="btn_group">
                <button
                  className={'btn_refresh'}
                  title={'새로고침'}
                  onClick={() => {
                    handleReset()
                  }}
                >
                  <span className="hide">새로고침</span>
                </button>
              </div>
            </div>
          </div>

          <List dataList={qnaData} handleView={handleView} paging={paging} />
          <div className="pagination_wrap">
            <Pagination pagingData={paging} handlePaging={handlePaging} />
          </div>
        </div>
        {/*commerce_banner_wrap end*/}
      </div>
    </PageLayout>
  )
}

export default Qna
