import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Link } from 'react-router-dom'
import { colors } from 'assets/style/style.config'
import CardLayout from 'components/common/card/CardLayout'
import Badge from 'components/atomic/Badge'
import NoResult from 'components/common/NoResult'
import DateUtils from 'modules/utils/DateUtils'
import {RequestStatusLabels} from 'modules/consts/BizConst'
import {createKey} from "modules/utils/CommonUtils";

const InvestRequestReceiveList = forwardRef((props, ref) => {
  const { cssName, cardLayoutType, title, btnMoreUrl } = props
  const [list, setList] = useState([])
  useImperativeHandle(ref, () => ({
    setData
  }))
  const setData = (temp) => {
    setList(temp)
  }
  const onClickDetail = (item) => {
    const badge = item.badge
    // if (cssName === 'send') {
    //   if (badge === StatusLabels.approval) history.push(ROUTER_NAMES.MY_PAGE_INVESTOR_REQUEST_DETAIL02)
    //   else if (badge === StatusLabels.wait) history.push(ROUTER_NAMES.MY_PAGE_INVESTOR_REQUEST_DETAIL01)
    //   else if (badge === StatusLabels.cancel) history.push(ROUTER_NAMES.MY_PAGE_INVESTOR_REQUEST_DETAIL04)
    // }
  }

  useEffect(() => {}, [])
  const getBadge = () => {
    if (list.length < 1) {
      return (
        <li>
          <NoResult />
        </li>
      )
    } else {
      if (list.length > 0) {
        const rows = []
        for (let i = 0; i < list.length; i++) {
          const listItem = list[i]
          const badge = String(listItem['invmExntRqstStgNm'])
          let className = 'status_complete'
          if (badge === RequestStatusLabels.approval) className = 'status_approval'
          else if (badge === RequestStatusLabels.standBy) className = 'status_standBy'
          else if (badge === RequestStatusLabels.evaluate) className = 'status_evaluate'
          else if (badge === RequestStatusLabels.complete) className = 'status_complete'
          else if (badge === RequestStatusLabels.cancel) className = 'status_cancel'
          const row = (
            <li className="invest_board_item" key={createKey()}>
              <span className="date">{DateUtils.insertYyyyMmDdDash(listItem['invmSttgDt'])}</span>
              <div className="name_wrap">
                <p className="name" style={{ cursor: 'pointer' }} onClick={() => onClickDetail(listItem)}>
                  {listItem['rqstBplcNm']}
                </p>
              </div>
              <p className="info">{'아직없음(기업 유형)'}</p>
              <Badge className={className}>{badge}</Badge>
            </li>
          )
          rows.push(row)
        }
        return rows
      }
    }
  }
  // invmCmpBplcNm: "일루넥스 투자자산"
  // invmExntRqstId: "cce98346-3abd-4bd3-9feb-5deaca35dd7e"
  // invmExntRqstStgCd: "APPROVAL"
  // invmExntRqstStgNm: "승인", 대기, 승인, 심사중, 기간만료, 결과보기
  // invmCmpId: "C0002222"
  // invmSttgDt: "20220414055043"
  // rqstBplcNm: "신영뜨게방"
  // rqstEnprId: "C0040161"
  return (
    <div className={`screening_section ${cssName}`}>
      <CardLayout type={cardLayoutType}>
        <div className="invest_board_wrap">
          <div className="card_header">
            <h3 className="title">
              {/*보낸 투자심사*/}
              {title}
              <Badge theme={colors.blue} type={'rounded'}>
                {list.length || 0}
              </Badge>
            </h3>
            <Link to={btnMoreUrl} className="btn_more">
              <span className="hide">더보기</span>
            </Link>
          </div>
          {/*invest_board_list start*/}
          {/*<ul className="invest_board_list">{getInvestReviewSendList()}</ul>*/}
          <ul className="invest_board_list">{getBadge()}</ul>
          {/*invest_board_list end*/}
        </div>
      </CardLayout>
    </div>
  )
});

export default InvestRequestReceiveList;
