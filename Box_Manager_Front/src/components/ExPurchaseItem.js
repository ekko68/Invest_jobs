import React from 'react'
import 'assets/style/component/purchaseItem.scss'

// @description
// 개발시에는 Ex--- 제외한 파일명으로 새로 생성후 작업부탁드려요
// Ex--- 파일명은 퍼블확인용

const ExPurchaseItem = (props) => {
  return (
    <div className="purchase_item_row">
      <div className="purchase_item_row_detail">
        <div className="purchase_item_row_imgWrap">
          <img src={require('assets/images/tmp/enterprise_main_swiper_pc@2x.png').default} alt="" />
        </div>
        <div className="purchase_item_row_desc">
          <div className="purchase_item_row_agency">펜톤</div>
          <div className="purchase_item_row_name">C타입 미니 보조배터리</div>
          <div className="purchase_item_price_wrap">
            <div className="purchase_item_price">
              19,500<span className="unit">원</span>
            </div>
            <div className="purchase_item_price_origin">
              <del className="purchase_item_price_origin_num">36,000</del>
              <span className="unit">원</span>
            </div>
            <div className="purchase_item_quantity">[최소 1,000개 이상]</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExPurchaseItem
