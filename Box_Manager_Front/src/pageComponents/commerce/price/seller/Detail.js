import { useEffect, useRef, useState, useContext, useCallback } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import Button from 'components/atomic/Button'
import { MktContext } from 'modules/common/MktContext'
import { UserContext } from 'modules/common/UserContext'
import DetailList from 'pageComponents/commerce/price/seller/DetailList'
import Pagination from 'components/Pagination'
import { getPriceSelrDetailList } from 'modules/consts/MktApi'
const Detail = (props) => {
  const { detailArg, setDetailArg } = props
  const mktContext = useContext(MktContext)
  const userContext = useContext(UserContext)
  const [list, setList] = useState({
    isLoading: true,
    list: []
  })

  const [paramList, setParamList] = useState({
    page: 1,
    selrUsisId: '' // 검색필터
  })

  const [paging, setPaging] = useState(null)

  const handlePaging = (param) => {
    if (paramList.page != param.page) {
      setParamList({
        ...paramList,
        page: param.page
      })
    }
  }

  //조회
  const getDetailList = () => {
    const newArg = {
      page: paramList.page,
      selrUsisId: detailArg.id
    }
    getPriceSelrDetailList(newArg, DetailListCallback, handleListErrorCallback)
  }
  //조회 후 콜백
  const DetailListCallback = (res) => {
    if (res.data.code === '200') {
      let data = res.data.data
      setList({
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

  //에러콜백
  const handleListErrorCallback = () => {
    setList({
      isLoading: false,
      list: []
    })
    mktContext.actions.setCommonAlertInfo({
      type: 'error',
      active: true
    })
  }

  useEffect(() => {
    if (detailArg.flag) {
      getDetailList()
    }
  }, [detailArg.flag])

  useCallback(() => {
    getDetailList()
  }, [paramList])

  return (
    <div className="popup_wrap popup_event_situation">
      <div className="layer">&nbsp;</div>
      <div className="popup_container">
        <div className="popup_content scroll">
          <div className="popup_main_header">
            <div className="title">상품 판매 현황</div>
            <Button
              className="popup_close_button"
              aria-label="팝업 닫기"
              onClick={() => {
                setDetailArg({
                  ...detailArg,
                  flag: false
                })
              }}
            />
          </div>

          <DetailList dataList={list} paging={paging} />
          <div className="pagination_wrap">
            <Pagination pagingData={paging} handlePaging={handlePaging} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Detail
