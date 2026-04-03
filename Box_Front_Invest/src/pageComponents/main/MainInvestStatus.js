/** @jsxImportSource @emotion/react */

import React, { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useState } from 'react'
import { investPanelStyle, panelItemStyle } from 'assets/style/ComponentStyle'

import DateUtils from 'modules/utils/DateUtils'
import { createKey } from 'modules/utils/CommonUtils'

const MainInvestStatus = forwardRef((props, ref) => {
  const [list, setList] = useState([])
  const [investDate, setInvestDate] = useState('')
  const [totalInvestCnt, setTotalInvestCnt] = useState(0)
  const [completeAuditCnt, setCompleteAuditCntv] = useState(0)
  const [progressAuditCnt, setProgressAuditCnt] = useState(0)

  useImperativeHandle(ref, () => ({
    setData
  }))
  const setData = (data) => {
    setInvestDate(data['date'])
    setTotalInvestCnt(data['totalApplyCnt'])
    setCompleteAuditCntv(data['completeAuditCnt'])
    setProgressAuditCnt(data['progressAuditCnt'])
    getSecretCompanyName(data['applyList'])
  }
  const onMouseOverEvt = (event) => {
    const target = event.target
    target.classList.add('active')
  }
  const onMouseOutEvt = (event) => {
    const target = event.target
    target.classList.remove('active')
  }

  // 회사명 '(주)' 제외, 세글자 이후 모두 마스킹 처리
  const getSecretCompanyName = (data) => {
    const arr = []
    for (let i = 0; i < data.length; i++) {
      let result = {
        invmExntPgsgCd: data[i].invmExntPgsgCd,
        invmExntPgsgNm: data[i].invmExntPgsgNm,
        invmExntRqstId: data[i].invmExntRqstId,
        rqstBplcNm: '',
        rqstEnprId: data[i].rqstEnprId
      }
      let originStr = data[i].rqstBplcNm
      let tmpName = data[i].rqstBplcNm.replace(/\(주\)/, '')
      let maskingStr = ''
      let strLength = ''

      strLength = tmpName.length

      if (strLength < 3) {
        if (strLength === 1) {
          maskingStr = tmpName.replace(/(?<=.{0})./gi, '*')
        } else {
          maskingStr = tmpName.replace(/(?<=.{1})./gi, '*')
        }
      } else {
        if (strLength === 3) {
          maskingStr = tmpName.replace(/(?<=.{2})./gi, '*')
        } else {
          maskingStr = tmpName.replace(/(?<=.{3})./gi, '*')
        }
      }

      if (originStr.indexOf('(주)', 3) > 0) {
        maskingStr = maskingStr + '*'
      } else if (originStr.indexOf('(주)') > -1) {
        maskingStr = '(주)' + maskingStr
      }
      result.rqstBplcNm = maskingStr
      arr.push(result)
    }

    setList(arr)
  }

  useLayoutEffect(() => {}, [])
  useEffect(async () => {}, [])

  return (
    <div className="invest" css={investPanelStyle}>
      <div className="panel_head">
        <div className="panel_header_inner">
          <h3 className="title">투자유치 신청 현황</h3>
          <span className="date">{DateUtils.customDateFormat(investDate, 'yyyy.MM.dd')} 현재</span>
        </div>
      </div>
      <div className="panel_status_wrap">
        <ul className="panel_status_list">
          <li className="panel_status_item">
            <p className="label">투자신청</p>
            <span className="value">{totalInvestCnt}</span>
          </li>
          <li className="panel_status_item ing">
            <p className="label">심사중</p>
            <span className="value">{progressAuditCnt}</span>
          </li>
          <li className="panel_status_item comp">
            <p className="label">심사완료</p>
            <span className="value">{completeAuditCnt}</span>
          </li>
        </ul>
      </div>
      <div className="invest_list_wrap scroll_wh">
        <ul className="invest_list">
          {list?.map((listItem, i) => (
            <li className="invest_item" key={createKey()}>
              <div className={'panelItemStyle'} css={panelItemStyle}>
                <p className="name">{listItem['rqstBplcNm']}</p>
                <p className={`status ${listItem.invmExntPgsgCd === 'EXN00002' ? 'ing' : 'comp'}`}>
                  {listItem.invmExntPgsgNm}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
})
export default MainInvestStatus
