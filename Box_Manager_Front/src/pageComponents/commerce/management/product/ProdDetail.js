import React, { Fragment } from 'react'
import 'assets/style/component/purchaseItem.scss'

const ProdDetail = (props) => {
  const { data } = props
  const isCommaFormat = (num) => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  return (
    <div className="purchase_item_row">
      <div className="purchase_item_row_detail">
        <div className="purchase_item_row_imgWrap">
          <img src={data.imgUrl} alt={data.pdfNm} />
        </div>
        <div className="purchase_item_row_desc">
          <div className="purchase_item_row_agency">{data.selrUsisName}</div>
          <div className="purchase_item_row_name">{data.pdfNm}</div>
          <div className="purchase_item_price_wrap">
            {data.prcDscsYn === 'N' ? ( // 가격협의 여부
              <div className="purchase_item_price">
                {isCommaFormat(data.pdfPrc)}
                <span className="unit">{data.comPrcutName}</span>
              </div>
            ) : (
              <Fragment>
                <div className="purchase_item_price">
                  {isCommaFormat(Number(data.pdfPr) - Number(data.salePrc))}
                  <span className="unit">{data.comPrcutName}</span>
                </div>

                <div className="purchase_item_price_origin">
                  <del className="purchase_item_price_origin_num">{isCommaFormat(data.pdfPrc)}</del>
                  <span className="unit">{data.comPrcutName}</span>
                </div>
              </Fragment>
            )}

            <div className="purchase_item_quantity">
              {data.prcDscsYn === 'N' ? '[최소 1개 이상]' : `[최소 ${isCommaFormat(data.ordnMnmmQty)}개 이상]`}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProdDetail
