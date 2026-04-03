import { forwardRef, useImperativeHandle, useState } from 'react'

import {StringUtils} from 'modules/utils/StringUtils'
import {createKey} from "modules/utils/CommonUtils";

const FaqList = forwardRef((props, ref) => {
  const [list, setList] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  useImperativeHandle(ref, () => ({
    setData
  }))
  const setData = (items) => {
    if (items.length > 0) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        item['id'] = i
      }
    }
    setList(items)
  }
  const onClickShowDetail = (index) => {
    if (selectedIndex === index) setSelectedIndex(-1)
    else setSelectedIndex(index)
  }
  return (
    <div className="section05">
      <div className="section_inner">
        <div className="section_head">
          <div className="section_title">FAQ</div>
          <p className="section_info">
            {/*로렘입숨 이것은 것이다. 평화스러운 장식하는 만물은 피가 크고 새가 그들의 쓸쓸하랴? 가는 힘차게*/}
          </p>
        </div>
        <div className="faq_board_wrap">
          <div className="accordion_list">{list?.map((item, index) => (
              <div className={`accordion_item ${selectedIndex === item.id ? 'active' : ''}`} key={createKey()}>
                <div className="accordion_title">
                  <div className="title">{item['faqQstn']}</div>
                  <button className="btn_accordion" onClick={() => onClickShowDetail(index)}>
                    <span className="hide">상세보기</span>
                  </button>
                </div>
                <div className="accordion_content">
                  <div className="inner" dangerouslySetInnerHTML={{ __html: StringUtils.toBr(item['faqRply']) }}></div>
                </div>
              </div>
          ))}</div>
        </div>
      </div>
    </div>
  )
});

export default FaqList;
