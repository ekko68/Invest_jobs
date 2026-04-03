import { useState, useEffect, useContext, useCallback } from 'react'

import Button from 'components/atomic/Button'
import { NoImage02 } from 'modules/consts/Img'
import EstimateProductItem from 'pageComponents/commerce/order/EstimateProductItem'
import EsimationSheetDeliveryCargo from 'pageComponents/commerce/order/EsimationSheetDeliveryCargo'
import EsimationSheetDeliveryFee from 'pageComponents/commerce/order/EsimationSheetDeliveryFee'
import EsimationSheetDeliveryVisit from 'pageComponents/commerce/order/EsimationSheetDeliveryVisit'

const PopupEstimateView = (props) => {
  const { data, handlePopup } = props
  const [pdfList, setPdfList] = useState([])
  const deliveryFeeType = {
    GDS02001: <EsimationSheetDeliveryCargo data={data} />,
    GDS02002: <EsimationSheetDeliveryFee data={data} />,
    GDS02003: <EsimationSheetDeliveryFee data={data} />,
    GDS02004: <EsimationSheetDeliveryVisit data={data} />
  }

  const sheetTextList = {
    title: {
      ESS02001: '',
      ESS02002: '',
      ESS02003: '(취소)',
      ESS02004: '(취소)'
    },
    commonSend: {
      ESS02001: '위와 같이 견적을 발송합니다.',
      ESS02002: '위와 같이 견적을 발송합니다.',
      ESS02003: '위 견적이 취소되었습니다.',
      ESS02004: '위 견적이 취소되었습니다.'
    }
  }

  useEffect(() => {
    setPdfList(data?.items)
  }, [data])

  return (
    <div className="popup_wrap popup_estimate_view estimateItem">
      {/*<div className="popup_wrap popup_bargain_register estimate estimateItem type02 type04">*/}
      <div className="layer">&nbsp;</div>
      <div className="popup_container scroll">
        <div className="popup_header">
          <h3 className="popup_title">견적서{sheetTextList?.title?.[data?.pcsnSttsId]}</h3>
          <button className={'btn_close'} onClick={handlePopup && handlePopup}>
            <span className="hide">팝업 닫기</span>
          </button>
        </div>
        <div className="estimate_content">
          <div className="sub_header">
            <p className="title">견적내역</p>
          </div>
          <div className="estimate_responsive_wrap">
            <div className="table_wrap">
              <div className="table_inner">
                <div className="cell_wrap cell_tr">
                  <div className="cell num">NO</div>
                  <div className="cell name">상품명</div>
                  <div className="cell unitprice">단가(원)</div>
                  <div className="cell quantity">주문수량</div>
                  <div className="cell unit">단위</div>
                  <div className="cell money">금액(원)</div>
                </div>
                {pdfList?.length > 0
                  ? pdfList.map((item, index) => (
                      <EstimateProductItem key={index} type={'sheet'} index={index} isNarrow={false} item={item} />
                    ))
                  : null}
              </div>
            </div>
          </div>
          <div className="sub_header type02 type04">
            <p className="title">배송비 입력</p>
          </div>
          {deliveryFeeType?.[data?.dvryPtrnId]}
          <div className="delivery_result">
            <p className="deli_price">
              배송비 : {data?.dvrynone != null ? parseInt(data.dvrynone).toLocaleString() : 0} 원
            </p>
            <div className="deli_subprice">
              <p className="price01">
                결제 금액 : {data?.pdfSum ? parseInt(data.pdfSum).toLocaleString() : 0}원(견적 총액) +{' '}
                {data?.dvrynone ? parseInt(data.dvrynone).toLocaleString() : 0}(배송비)
              </p>
              <p className="price02">
                총 :{' '}
                {data?.pdfSum && data?.dvrynone != null
                  ? Math.floor(parseInt(data.pdfSum) + parseInt(data.dvrynone)).toLocaleString()
                  : 0}{' '}
                원
              </p>
            </div>
          </div>
          <div className="stamp_wrap">
            <div className="text_wrap">
              <p className="text01">{sheetTextList?.commonSend?.[data?.pcsnSttsId]}</p>
              <p className="text01">{data?.bplcNm}</p>
            </div>
            <div className="stamp_img">
              <div className="img_wrap">
                <img src={data.rgslImgFileUrl ? data.rgslImgFileUrl : NoImage02} alt={data.bplcNm} />
              </div>
            </div>
          </div>
          <div className="button_wrap">
            <Button
              className="linear_blue btn"
              onClick={handlePopup && handlePopup}
              style={{
                width: '100px',
                height: '40px'
              }}
            >
              닫기
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PopupEstimateView
