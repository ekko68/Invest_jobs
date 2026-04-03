import { forwardRef, useImperativeHandle, useState } from 'react'

import {StringUtils} from 'modules/utils/StringUtils'
import {createKey} from "modules/utils/CommonUtils";

const EventList = forwardRef((props, ref) => {
  const { vo } = props
  const [list, setList] = useState([])
  useImperativeHandle(ref, () => ({
    setData
  }))
  const setData = (items) => {
    setList(items)
  }
  const onClickOpenDetailPage = (item) => {
    if (!StringUtils.hasLength(item?.evntBkmrUrl)) return;
    window.open(item['evntBkmrUrl'])
  }
  return (
    <div className="section04">
      <div className="section04_wrap event_size02">
        <p className="section_name">{vo.pageMainData.bplcNm}</p>
        <p className="section_title">진행중인 이벤트</p>
        <div className="card_wrap">{
          list?.map((item, i) => (
              <div className="card" key={createKey()}>
                <div className="card_box">
                  <div className="card_inner">
                    <div className="img">{
                      StringUtils.hasLength(item?.imgUrl)
                          ? <img src={item.imgUrl} />
                          : <img src={require('assets/images/no_img.jpg').default} />
                    }</div>
                    <div className="content">
                      <p className="title">{item['evntTtl']}</p>
                      <p className="sub_title" dangerouslySetInnerHTML={{ __html: StringUtils.toBr(item['evntCon']) }}>
                      </p>
                      <span className="more" onClick={() => onClickOpenDetailPage(item)} style={{ cursor: 'pointer' }}>
                    자세히보기
                  </span>
                    </div>
                  </div>
                </div>
              </div>
          ))
        }</div>
      </div>
    </div>
  )
});

export default EventList;
