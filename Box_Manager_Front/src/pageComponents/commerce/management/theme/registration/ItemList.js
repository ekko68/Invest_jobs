import React from 'react'
import Checkbox from 'components/atomic/Checkbox'

// @description
// 개발시에는 Ex--- 제외한 파일명으로 새로 생성후 작업부탁드려요
// Ex--- 파일명은 퍼블확인용

const ItemList = (props) => {
  console.log(`props=${JSON.stringify(props)}`)
  const { items } = props
  return (
    <ul className="enterpriseItem_list">
      {items.length > 0 ? (
        items.map((item, idx) => {
          console.log(`props=${JSON.stringify(item[idx])}`)
          return (
            <li key={item.utlinsttId}>
              <div className="enterpriseItem">
                <div className="enterpriseItem_name">
                  <div className="enterpriseItem_name_text">{item.bplcNm}</div>
                  <div
                    className={`enterpriseItem_certify ico ${item.certNm == '인증' ? '' : 'hide'}`}
                    title="인증기관"
                  />
                  <div className="enterpriseItem_client ico" title="거래처" />
                  <div className="enterpriseItem_ceo ico" title="최고 경영자" />
                  <div className="enterpriseItem_future ico" title="미래 경영자" />
                  <div className="enterpriseItem_female ico" title="여성 경영자" />
                  <div className="enterpriseItem_fame ico" title="명예의 전당" />
                </div>
                <div className="enterpriseItem_detail">
                  <div className="enterpriseItem_old">{`설립 ${item.yearCnt}년차`}</div>
                  <div className="enterpriseItem_scale">중소기업 2013</div>
                  <div className="enterpriseItem_type">{`수출입 ${item.imxprtSctnText}`}</div>
                </div>

                <Checkbox
                  key={'check_id' + idx}
                  checkbox={{ id: 'check_id' + idx, value: '' }}
                  status={false}
                  onChange={() => {}}
                />

                <div className="enterpriseItem_more">기업 홍보관 바로가기</div>
              </div>
            </li>
          )
        })
      ) : (
        <div className="no_data">데이터가 없습니다.</div>
      )}
    </ul>
  )
}

export default ItemList
