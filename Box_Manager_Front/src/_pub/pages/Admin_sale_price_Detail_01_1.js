import { useEffect, useRef, useState, useContext, useLayoutEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import Button from 'components/atomic/Button'
import Select from 'components/atomic/Select'
import { MktContext } from 'modules/common/MktContext'
import { UserContext } from 'modules/common/UserContext'
import ExSaleDetailTable from 'pageComponents/commerce/main/ExSaleDetailTable'
import ExProductTableAddNew from 'pageComponents/commerce/main/ExProductTableAddNew'
import Checkbox from 'components/atomic/Checkbox'
import Pagination from 'components/Pagination'
const Admin_sale_price_Detail_01_1 = (props) => {
  const { selectList, selectList2, onSelectActive, onSelectActive2, value } = props
  const mktContext = useContext(MktContext)
  const userContext = useContext(UserContext)

  // ===== reset
  const handleReset = () => {
    mktContext.actions.handleSetBannerCurrType('eventPartIn')
  }
  useLayoutEffect(() => {
    if ('eventPartIn' !== userContext.state.category) {
      userContext.actions.setCategory('eventPartIn')
      handleReset()
    }
  }, [userContext.state.category])
  const mainData = {
    header: [
      {
        first: '상품명',
        type: '소분류 / 세분류',
        price: '판매가',
        state: '상태',
        quantity: '판매 수량',
        total: '총 판매 금액'
      }
    ],
    data: [
      {
        first: '상품명',
        type: '남아 수영복',
        price: '45,000 원',
        state: '판매중',
        quantity: '04',
        total: '000,000,000'
      },
      {
        first: '상품명',
        type: '튜브',
        price: '45,000 원',
        state: '판매중',
        quantity: '08',
        total: '000,000,000'
      },
      {
        first: '상품명',
        type: '남아 수영복',
        price: '45,000 원',
        state: '판매중',
        quantity: '100',
        total: '000,000,000'
      }
    ]
  }

  return (
    <div className="popup_wrap popup_event_situation">
      <div className="layer">&nbsp;</div>
      <div className="popup_container">
        <div className="popup_content scroll">
          <div className="popup_main_header">
            <div className="title">상품 판매 현황</div>
            <Button className="popup_close_button" aria-label="팝업 닫기" onClick={() => {}} />
          </div>

          <ExSaleDetailTable dataList={mainData} />
          <div className="pagination_wrap">
            <Pagination
              pagingData={{ totalPage: 40, startPage: 1, page: 5, prev: true, next: true, endPage: 10 }}
              handlePaging={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin_sale_price_Detail_01_1
