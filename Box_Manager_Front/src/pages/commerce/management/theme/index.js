import { useEffect, useState, useContext, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import Pagination from 'components/Pagination'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { MktContext } from 'modules/common/MktContext'
/////////
import Search from 'pageComponents/commerce/common/Search'
import { searchStatus, searchInput, searchDate } from 'pages/commerce/management/theme/searchValue'
import List from 'pageComponents/commerce/management/theme/List'
import { getThemeListApi, deleteThemeApi } from 'modules/consts/MktApi'
import moment from 'moment'
import PopupDisplayOrder from 'pageComponents/commerce/management/theme/popup/DisplayOrder'

const Theme = () => {
  const mktContext = useContext(MktContext)
  const history = useHistory()
  const isMounted = useRef(true)

  const [paging, setPaging] = useState(null)
  const [isDisplayOrder, setIsDisplayOrder] = useState(false)
  // 탭
  const [search, setSearch] = useState({
    startDate: moment(new Date(moment().subtract(15, 'days')))
      .format('yyyy-MM-DD')
      .toString(),
    endDate: moment().format('yyyy-MM-DD').toString(),
    themeTitle: '',
    themeExpl: '',
    page: 1,
    record: 10
  })

  const [themeListData, setThemeListData] = useState({
    isLoading: true,
    list: []
  })
  //삭제 컴포넌트
  const [delThemeIds, setDelThemeIds] = useState([])

  // ===== 상세화면 이동 : id
  const handleRegi = () => {
    history.push(`${ROUTER_NAMES.COMMERCE_MANAGEMENT_THEME_REGISTRATION}`)
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

  ////HCJ////////////////////////////////////////////////////////////
  // 배너 데이터 세팅
  const getListCallback = (res) => {
    if (res.data.code === '200' && isMounted.current) {
      let data = res.data.data
      setThemeListData({
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

  //검색
  const handleSearch = (params) => {
    setThemeListData({
      isLoading: true,
      list: []
    })

    if (params.themeExpl === undefined) {
      setSearch({
        ...search,
        page: 1,
        ...params,
        themeExpl: ''
      })
    } else if (params.themeTitle === undefined) {
      setSearch({
        ...search,
        page: 1,
        ...params,
        themeTitle: ''
      })
    }
  }

  //검색 값들이 변경될때 목록조회
  useEffect(() => {
    isMounted.current = true
    getThemeList(search)
  }, [search])

  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  //상품목록조회하기
  const getThemeList = (params) => {
    //aipv2
    getThemeListApi(params, getListCallback, handleThemeListErrorCallback)
  }

  //에러콜백
  const handleThemeListErrorCallback = () => {
    setThemeListData({
      isLoading: false,
      list: []
    })
    mktContext.actions.setCommonAlertInfo({
      type: 'error',
      active: true
    })
  }

  //새로고침
  const getInitThemeList = () => {
    setThemeListData({
      isLoading: true,
      list: []
    })
    getThemeList(search)
  }

  const handleDeleteCallback = () => {
    getInitThemeList()
  }
  //삭제
  const handleDelete = () => {
    if (delThemeIds?.length > 0) {
      for (let theme of delThemeIds) {
        if (theme.status === '공개') {
          mktContext.actions.setCommonAlertInfo({
            type: 'alert',
            active: true,
            msg: '공개 테마 기업은 삭제가 불가능합니다.'
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
          deleteThemeApi(
            delThemeIds.map((_item) => _item.ffpcGrpId),
            handleDeleteCallback,
            handleThemeListErrorCallback
          )
          setDelThemeIds([])
        }
      })
    } else {
      mktContext.actions.setCommonAlertInfo({
        type: 'alert',
        active: true,
        msg: '삭제할 테마를 선택해주세요.'
      })
    }
  }

  const onChange = (newList) => {
    setThemeListData({
      isLoading: false,
      list: newList
    })
  }
  const hendleIsDisplayOrder = () => {
    setIsDisplayOrder(true)
  }

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'theme'}>
      {isDisplayOrder && (
        <PopupDisplayOrder
          onClose={(refresh) => {
            setIsDisplayOrder(false)
            if (refresh) {
              getInitThemeList()
            }
          }}
        />
      )}
      <div className="content_inner page_main">
        <div className="page_header">
          <h4 className="page_title">테마기업관리</h4>
        </div>

        {/* <TermSearchForm searchDate={searchDate} setSearchDate={setSearchDate} getList={getList} /> */}
        {/*commerce_theme_wrap start*/}
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
            <div className="page_header_right">
              <div className="btn_group">
                <button
                  className={'btn_refresh'}
                  title={'새로고침'}
                  onClick={() => {
                    getInitThemeList()
                  }}
                >
                  <span className="hide">새로고침</span>
                </button>
              </div>
            </div>
          </div>
          <div className="button_group_right">
            <Button
              className={'full_blue'}
              onClick={(refresh) => {
                hendleIsDisplayOrder()
              }}
            >
              노출순서관리
            </Button>

            <Button className={'full_grey_dark'} onClick={handleDelete}>
              삭제
            </Button>

            <Button className={'full_blue'} onClick={handleRegi}>
              등록
            </Button>
          </div>
          <List
            dataList={themeListData}
            delThemeIds={delThemeIds}
            setDelThemeIds={setDelThemeIds}
            onChange={onChange}
          />
          <div className="pagination_wrap">
            <Pagination pagingData={paging} handlePaging={handlePaging} />
          </div>
        </div>
        {/*commerce_theme_wrap end*/}
      </div>
    </PageLayout>
  )
}

export default Theme
