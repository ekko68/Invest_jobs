import React, { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useState, useRef } from 'react'
import MainTotalFundAmountBeforeCompanySwiper from './MainTotalFundAmountBeforeCompanySwiper'
import {StringUtils} from 'modules/utils/StringUtils'

const MainTotalFundAmountBefore = forwardRef((props, ref) => {
  const [list, setList] = useState([])
  useImperativeHandle(ref, () => ({
    setData
  }))

  const setData = (data) => {
    let n = +(data.ibkAuditAmt / 1e8).toFixed(1)
    setList({...data, ibkAuditAmt : n})
  }

  useLayoutEffect(() => {}, [])
  useEffect(async () => {}, [])

  return (
    <div className="section section_totalFund">
      <div className="section_totalFund_inner">
        <div className="fund_header">
          <div className="invest_status_wrap">
            <div className="invest_status_left">
              <h3 className="section_title">투자 유치 신청 현황</h3>
              {/* 0919 추가 수정 */}
              <ul className="invest_status_ibk">
                <li>
                  IBK가 투자한 기업 수
                  <strong className="invest_status_num">
                    {list.ibkAuditCompany}<span className="unit">건</span>
                  </strong>
                </li>
                <li>
                  IBK가 투자한 금액
                  <strong className="invest_status_num">
                    {StringUtils.comma(list.ibkAuditAmt)}<span className="unit">억원</span>
                  </strong>
                </li>
              </ul>
              <ul className="invest_status">
                <li>
                  투자신청
                  <strong className="invest_status_num">{list.totalApplyCnt}</strong>
                </li>
                <li>
                  심사중
                  <strong className="invest_status_num">{list.progressAuditCnt}</strong>
                </li>
                <li>
                  심사완료
                  <strong className="invest_status_num">{list.completeAuditCnt}</strong>
                </li>
              </ul>
              {/* end: 0919 추가 수정 */}
            </div>
            <MainTotalFundAmountBeforeCompanySwiper data={list} />
          </div>
        </div>
      </div>
    </div>
  )
})
export default MainTotalFundAmountBefore
