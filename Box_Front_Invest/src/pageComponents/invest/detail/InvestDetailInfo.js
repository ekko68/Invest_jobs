import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react'

import { colors } from 'assets/style/style.config'

import Button from 'components/atomic/Button'
import CardLayout from 'components/common/card/CardLayout'

import AuditPossibleCheckPopup from 'pageComponents/common/auditrequestpop/AuditPossibleCheckPopup'
import ConfirmPopup from 'pageComponents/common/pop/ConfirmPopup'
import AuditRequestPopupParent from 'pageComponents/common/auditrequestpop/AuditRequestPopupParent'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'

import { StringUtils } from 'modules/utils/StringUtils'
import ResponseUtils from 'modules/utils/ResponseUtils'
import Api from 'modules/consts/Api'
import { exeFunc } from 'modules/utils/ReactUtils'
import QueryUtils from 'modules/utils/QueryUtils'
import ReactEvent from 'modules/utils/ReactEvent'
import { AlertLabels, BizStatusCode, CheckYn, UsisType } from 'modules/consts/BizConst'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import { isNumber } from 'modules/utils/NumberUtils'

const InvestDetailInfo = forwardRef((props, ref) => {
  const commonContext = useContext(CommonContext)

  const investRequestPossibleCheckPopupRef = useRef()
  const investRequestAgreePopupRef = useRef()
  const confirmRef = useRef()
  const alertPopup = useRef()

  const [info, setInfo] = useState({
    basicData: {
      addr: '',
      bplcNm: '',
      bizrno: '',
      ibkVcYn: '',
      fileId: '',
      guAdrAllNm: '',
      hmpgAdres: '',
      imgUrl: '',
      utlinsttId: '',
      nwAdrAllNm: '',
      postNo: '',
      reprsntEmail: '',
      reprsntTelno: '',
      rprsntvNm: '',
      yearCnt: null,
      invmexntRapLmtnMnct: null
    },
    execChartList: [],
    invmAmt: null,
    invmAmtStr: '',
    invmPrfrCnt: null,
    oppbYn: CheckYn.NO,
    pfrcChartList: []
  })

  const [ongoingYn, setOngoingYn] = useState(null)
  const [requestOutOfPeriodYn, setRequestOutOfPeriodYn] = useState(null)

  const setData = (currentInfo) => {
    setInfo(currentInfo)
  }

  useImperativeHandle(ref, () => ({
    setData,
    checkRequestAvailable
  }))

  const onConfirmApply = () => {
    exeFunc(investRequestAgreePopupRef, 'open')
  }

  const onAlert = (message) => {
    exeFunc(alertPopup, 'open', message)
  }

  const checkRequestAvailable = async () => {
    // 진행중이 아닐 경우 투자 가능 기간인지도 확인
    const res = await ResponseUtils.getSimpleResponse(
      Api.vc.auditCompanyLimit,
      { invmCmpId: QueryUtils.getQuery(props)?.utlinsttId, tcbCheckYn: CheckYn.NO },
      false
    )
    if (res) {
      setOngoingYn(
        res.passYn !== CheckYn.YES && res.failCode === BizStatusCode.ONGOING_AUDIT ? CheckYn.YES : CheckYn.NO
      )
      setRequestOutOfPeriodYn(
        res.passYn !== CheckYn.YES && res.failCode === BizStatusCode.OUT_OF_AUDIT_REQUEST_PERIOD
          ? CheckYn.YES
          : CheckYn.NO
      )
    } else {
      exeFunc(alertPopup, 'open', AlertLabels.askAdmin)
    }
  }

  const checkAuditCompanyLimit = async () => {
    const res = await ResponseUtils.getSimpleResponse(
      Api.vc.auditCompanyLimit,
      { invmCmpId: QueryUtils.getQuery(props)?.utlinsttId },
      false
    )
    if (res) {
      if (res.passYn === CheckYn.YES) exeFunc(confirmRef, 'open', '투자심사를 요청 하시겠습니까?')
      else exeFunc(investRequestPossibleCheckPopupRef, 'open', res.failCode, res.tcbTchnGrd)
    } else {
      exeFunc(alertPopup, 'open', AlertLabels.askAdmin)
    }
  }

  useEffect(() => {
    ReactEvent.addEventListener('alertPop', onAlert)
    return () => {
      ReactEvent.removeEventListener('alertPop')
    }
  }, [])

  return (
    <>
      <CardLayout>
        <div className="company_info">
          <div className="img_wrap">
            {StringUtils.hasLength(info?.basicData?.logoImageUrl) ? (
              <img src={info.basicData.logoImageUrl} alt="company_logo" />
            ) : (
              <img src={'images/tmp/invest_list_card_no_image.png'} alt="" />
            )}
          </div>
          <div className="company_text">
            <p className="sub_name">{info.basicData['invmCmpPtrnNm']}</p>
            <p className="name">{info.basicData['bplcNm']}</p>
            <p className="info">
              {StringUtils.hasLength(info?.basicData?.hmpgAdres)
                ? info.basicData.hmpgAdres
                : '홈페이지 정보가 없습니다.'}
            </p>
          </div>
        </div>
        <div className="execution">
          <div className="number">
            <p className="sub_title">투자 집행 건수</p>
            <p className="title">{isNumber(info?.invmPrfrCnt) ? info.invmPrfrCnt : 0} 건+</p>
          </div>
          <div className="money">
            <p className="sub_title">
              투자 집행 금액 &nbsp;
              {/*<span className="unit">(단위 : 천원)</span>*/}
              <span className="unit">(단위 : 원)</span>
            </p>
            {/*<p className="title">비공개</p>*/}
            <p className="title">
              {
                // info['oppbYn'] === CHECK_YN.YES ? StringUtils.comma(info['invmAmt']) : '비공개'
                info['oppbYn'] === CheckYn.YES ? info.invmAmtStr : '비공개'
              }
            </p>
          </div>
          <p className="alert_text">(비공개 투자건 제외)</p>
        </div>
        {!StringUtils.isAnyBlank(ongoingYn, requestOutOfPeriodYn) &&
          commonContext.state.user.info?.type === UsisType.COMPANY &&
          (requestOutOfPeriodYn === CheckYn.YES ? (
            <>
              <div className="request">
                <h3 className="section_title">투자심사요청하기</h3>
              </div>
              <div className="request_box finish">
                <p className="text">
                  투자 유치 신청을 이미 완료하셨습니다. <br />
                  신청현황에서 진행상황을 확인할 수 있습니다.
                </p>
                <p className="sub_text">
                  {`*최근 투자신청일로부터 ${
                    isNumber(info?.basicData?.invmexntRapLmtnMnct) ? info.basicData.invmexntRapLmtnMnct : 12
                  }개월 이후에 재신청이 가능합니다.`}
                  <br />
                  궁금한 사항은 해당 투자사로 문의하세요.
                </p>
                {StringUtils.hasLength(info?.basicData?.reprsntTelno) && (
                  <div className="phone_box">{info.basicData.reprsntTelno}</div>
                )}
              </div>
            </>
          ) : (
            <div className="request">
              <h3 className="section_title">투자심사요청하기</h3>
              <div className="request_box">
                {ongoingYn === CheckYn.YES ? (
                  '현재 투자심사 진행 중입니다.'
                ) : (
                  <Button
                    style={{ marginTop: '0px' }}
                    theme={colors.blue}
                    onClick={() =>
                      commonContext.actions.callbackAfterSessionRefresh(checkAuditCompanyLimit, true, true)
                    }
                    disabled={CheckYn.NO}
                  >
                    심사요청
                  </Button>
                )}
              </div>
            </div>
          ))}

        {/*request end*/}
        <div className="info_detail">
          <div className="top">
            <p className="ceo">
              <strong>{info.basicData['rprsntvNm']}</strong> 대표
            </p>
            <p className="tel_email_addr">
              <strong>T</strong>
              {info.basicData['reprsntTelno']}
            </p>
            <p className="tel_email_addr">
              <strong>E</strong>
              {info.basicData['reprsntEmail']}
            </p>
            <p className="tel_email_addr">{info.basicData['addr']}</p>
          </div>
          <div className="bottom">
            <p className="basic_bold">기본 정보</p>
            <ul className="info_list">
              <li className="info_item">- 투자자유형 : {info.basicData['invmCmpPtrnNm']}</li>
              <li className="info_item">
                - 조회 수 : {info.basicData['crewRtrv'] === null ? 0 : info.basicData['crewRtrv']}
              </li>
              <li className="info_item">
                - 연차 : {isNumber(info.basicData?.yearCnt) && `${info.basicData.yearCnt} 년차`}
              </li>
              <li className="info_item">
                - 직원 수 : {info.basicData['empCnt'] === null ? 0 : info.basicData['empCnt']}
              </li>
            </ul>
          </div>
        </div>
      </CardLayout>
      <AuditPossibleCheckPopup ref={investRequestPossibleCheckPopupRef} />
      <ConfirmPopup ref={confirmRef} onConfirm={onConfirmApply} />
      <AlertPopup ref={alertPopup} />
      <AuditRequestPopupParent
        {...props}
        ref={investRequestAgreePopupRef}
        onRefresh={() => commonContext.actions.callbackAfterSessionRefresh(checkRequestAvailable, true, true)}
        submitApi={Api.vc.auditRequestSave}
        vcData={{ bplcNm: info?.basicData?.bplcNm, ibkVcYn: info?.basicData?.ibkVcYn }}
      />
    </>
  )
})

export default InvestDetailInfo
