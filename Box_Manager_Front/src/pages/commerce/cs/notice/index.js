import Button from 'components/atomic/Button'
import PageLayout from 'components/PageLayout'
import Pagination from 'components/Pagination'
import { MktContext } from 'modules/common/MktContext'
import { UserContext } from 'modules/common/UserContext'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { useContext, useEffect, useState, useCallback, useRef } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import List from './../../../../pageComponents/commerce/cs/notice/List'
import { getNoticeListApiV2 } from 'modules/consts/MktApi'

const Notice = (props) => {
  const mktContext = useContext(MktContext)
  const userContext = useContext(UserContext)
  const history = useHistory()
  const location = useLocation()
  const isMounted = useRef(true)
  const [paging, setPaging] = useState(null)
  let path = location.pathname
  const [search, setSearch] = useState({
    page: 1,
    record: 10
  })

  const [noticeData, setNoticeData] = useState({
    isLoading: true,
    list: []
  })

  // ===== 페이징
  const handlePaging = (param) => {
    if (search.page != param.page) {
      setSearch({
        ...search,
        page: param.page
      })
    }
  }

  // ===== 상세화면 이동 : id
  const handleView = (id) => {
    history.push(`${ROUTER_NAMES.COMMERCE_CS_NOTICE_REGISTRATION}/${id}`)
  }

  // 등록
  const handleRegi = () => {
    history.push(`${ROUTER_NAMES.COMMERCE_CS_NOTICE_REGISTRATION}`)
  }

  // ===== reset
  const handleReset = useCallback(() => {
    setNoticeData({
      isLoading: true,
      list: []
    })
    setSearch({
      page: 1,
      record: 10
    })

    getNoticeList(search)
  }, [search])

  const getNoticeList = useCallback((params) => {
    getNoticeListApiV2(params, handleNoticeListCallback, handleNoticeListErrorCallback)
  }, [])

  const handleNoticeListCallback = (res) => {
    if (res.data.code === '200' && isMounted.current) {
      const data = res.data.data
      setNoticeData({
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

  const handleNoticeListErrorCallback = () => {
    setNoticeData({
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
    getNoticeList(search)
  }, [search])

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'cs'} currentPage={'commerceNotice'}>
      <div className="content_inner page_main">
        <div className="page_header">
          <h4 className="page_title">공지사항</h4>
        </div>

        {/*commerce_banner_wrap start*/}
        <div className="commerce_banner_wrap">
          <div className={'maximum_notice'}>
            <p className="highlight_grey">홍보관 BOX 서비스 안내 &gt; 공지사항을 관리 할 수 있습니다.</p>
          </div>

          {/*tab_header start*/}
          <div className="tab_header">
            <div className="page_header_right">
              <div className="btn_group">
                <button className={'btn_refresh'} title={'새로고침'} onClick={handleReset}>
                  <span className="hide">새로고침</span>
                </button>
              </div>
            </div>
          </div>
          <div className="button_group_right">
            <Button className={'full_blue'} onClick={handleRegi}>
              등록
            </Button>
          </div>
          <List dataList={noticeData} handleView={handleView} paging={paging} />
          <div className="pagination_wrap">
            <Pagination pagingData={paging} handlePaging={handlePaging} />
          </div>
        </div>
        {/*commerce_banner_wrap end*/}
      </div>
    </PageLayout>
  )
}

export default Notice
