import { useEffect, useRef, useState, useContext, useLayoutEffect } from 'react'
import { useHistory } from 'react-router-dom'
import PageLayout from 'components/PageLayout'
import Button from 'components/atomic/Button'
import Select from 'components/atomic/Select'
import BannerTable from 'pageComponents/commerce/main/BannerTable'
import Pagination from 'components/Pagination'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { getPopupListApi } from 'modules/consts/MktApi'
import { MktContext } from 'modules/common/MktContext'
import { UserContext } from 'modules/common/UserContext'

const PopupList = () => {
  const mktContext = useContext(MktContext)
  const userContext = useContext(UserContext)
  const history = useHistory()
  const [popupData, setPopupData] = useState([])
  const [paging, setPaging] = useState(null)

  // ===== 목록 조회
  const getList = async (param) => {
    let res = await getPopupListApi(param)
    if (res.data.code === '200') {
      let data = res.data.data
      setPopupData(data)
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

  // ===== 검색필터 : 전체, 공개, 대기, 종료
  const filterSelect = useRef(null)
  const filterSelList = {
    active: mktContext.state.popupParam.statusCode,
    list: [
      { id: 'filter_all', value: 'filter_all', label: '전체' },
      { id: 'display', value: 'filter_public', label: '공개' },
      { id: 'stanby', value: 'filter_wait', label: '대기' },
      { id: 'close', value: 'filter_end', label: '종료' },
      { id: 'off', value: 'filter_private', label: '비공개' }
    ]
  }
  const onFilterActive = async (selected) => {
    mktContext.actions.handleSetPopupParam({
      page: 1,
      statusCode: selected
    })
  }

  // ===== 상세화면 이동
  const handleView = (id) => {
    history.push(`${ROUTER_NAMES.COMMERCE_MAIN_POPUP_VIEW}/${id}`)
  }

  // ===== 등록 이동
  const handleWrite = () => {
    mktContext.actions.handleSetPopupParam({
      statusCode: 'filter_all', // 상태
      page: 1
    })
    history.push(`${ROUTER_NAMES.COMMERCE_MAIN_POPUP_WRITE}`)
  }

  // ===== 페이징
  const handlePaging = (param) => {
    let params = {
      ...mktContext.state.popupParam,
      ...param
    }
    mktContext.actions.handleSetPopupParam(params)
  }

  // ===== reset
  const handleReset = () => {
    console.log('popup reset')
    mktContext.actions.handleSetPopupParam(null)
  }

  useLayoutEffect(() => {
    if ('popup' !== userContext.state.category) {
      userContext.actions.setCategory('popup')
      handleReset()
    }
  }, [userContext.state.category])

  useEffect(async () => {
    await getList(mktContext.state.popupParam)
  }, [mktContext.state.popupParam])

  return (
    <PageLayout currentMenu={'commerce'} currentCate={'main'} currentPage={'popupList'}>
      <div className="content_inner page_main">
        <div className="page_header">
          <h4 className="page_title">팝업관리</h4>
          <div className="btn_group">
            <Select optionList={filterSelList} ref={filterSelect} handleSelectActive={onFilterActive} />
            <Button className={'full_blue w80'} onClick={handleWrite}>
              팝업 등록
            </Button>
            <button className={'btn_refresh'} title={'새로고침'} onClick={handleReset}>
              <span className="hide">새로고침</span>
            </button>
          </div>
        </div>

        {/*commerce_banner_wrap start*/}
        <div className="commerce_banner_wrap">
          {popupData?.list && (
            <BannerTable paging={paging} dataList={popupData.list} handleView={handleView} type={'popup'} />
          )}
          <div className="pagination_wrap">
            {paging && <Pagination pagingData={paging} handlePaging={handlePaging} />}
          </div>
        </div>
        {/*commerce_banner_wrap end*/}
      </div>
    </PageLayout>
  )
}

export default PopupList
