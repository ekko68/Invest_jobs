import React, { forwardRef, useContext, useImperativeHandle, useRef, useState } from 'react'

import CardLayout from 'components/common/card/CardLayout'
import Button from 'components/atomic/Button'
import NoResult from 'components/common/NoResult'

import Paging from 'pageComponents/common/Paging'
import DetailPopup from 'pageComponents/mypage/common/message/DetailPopup'
import SendFormPopup from 'pageComponents/mypage/common/message/SendFormPopup'

import { createKey, deepCopyByRecursion } from 'modules/utils/CommonUtils'
import ResponseUtils from 'modules/utils/ResponseUtils'
import { exeFunc, setFunc } from 'modules/utils/ReactUtils'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import { StringUtils } from 'modules/utils/StringUtils'
import { CheckYn } from 'modules/consts/BizConst'
import { getConfig, getPostConfig } from 'modules/utils/CommonAxios'
import CommonAxios from 'modules/utils/CommonAxios'
import Api from 'modules/consts/Api'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import RecomendEmmPopup from 'pageComponents/common/auditrequestpop/RecomendEmmPopup'

// 메시지 컴포넌트 재정리
// 우선 페이지 분할 및 라우팅, forwardRef 사용은 기존 투자박스 형식과 맞춰놓음
const RequestMessageList = forwardRef((props, ref) => {
  const {
    readOnly = true,
    apiProps = {
      loadListApi: '',
      detailApi: '',
      sendApi: '',
      replyApi: ''
    },
    pagePropsParam = {
      invmExntRqstId: '',
      rqstEnprRprsntvNm: '',
      reprsntTelno: '',
      mainBizcnd: '',
      record: 5,
      pageSize: 5
    }
  } = props

  const commonContext = useContext(CommonContext)

  const detailPopupRef = useRef()
  const replyFormPopupRef = useRef()
  const writeFormPopupRef = useRef()

  const pagingRef = useRef()
  const pageRef = useRef(1)
  const totalPageRef = useRef(1)
  const ibkVcYnRef = useRef('')

  const [list, setList] = useState([])
  const [recomendBank, setRecomendBank] = useState('')
  const [recomendStaff, setRecomendStaff] = useState('')
  const [tcbTchnGrdObj, setTcbTchnGrdObj] = useState({
    tcbTchnGrd: '',
    incfCd1: '',
    incfCd2: '',
    incfCd3: ''
  })

  const [requestComInfo, setRequestComInfo] = useState({
    rqstEnprRprsntvNm: '',
    incfCd1: '',
    incfCd2: ''
  })
  const alertPopupRef = useRef(null)
  const recomandPopupRef = useRef()

  const onChangePage = async (pageNumber) => {
    await commonContext.actions.callbackAfterSessionRefresh(
      async () => {
        pageRef.current = pageNumber
        await loadMessageList()
      },
      true,
      true
    )
  }

  useImperativeHandle(ref, () => ({
    setData
  }))

  const setData = async () => {
    await loadMessageList()
    await loadAuditDetail()
    await isTelFormat()
  }

  const loadMessageList = async () => {
    if (StringUtils.isAnyBlank(apiProps.loadListApi, pagePropsParam.invmExntRqstId)) return

    const params = {
      page: pageRef.current,
      record: pagePropsParam.record,
      pageSize: pagePropsParam.pageSize,
      invmExntRqstId: pagePropsParam.invmExntRqstId
    }

    const res = await ResponseUtils.getSimpleResponse(apiProps.loadListApi, params, false)
    if (res) {
      setFunc(pagingRef, 'setPaging', res)
      pageRef.current = res.page
      totalPageRef.current = res.totalPage
      setList(deepCopyByRecursion(res.list))
    }
  }
  // /* 휴대폰 formating function */
  const isTelFormat = () => {
    let formatRes = props.pagePropsParam.reprsntTelno
    let result = ''
    if (formatRes !== undefined) {
      if (formatRes.length === 9) {
        //00-000-0000
        result = formatRes.replace(/^(\d{0,2})(\d{0,3})(\d{0,4})$/g, '$1-$2-$3')
      } else if (formatRes.length === 10) {
        //00-0000-0000
        result = formatRes.replace(/^(\d{0,2})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
      } else if (formatRes.length === 11) {
        //000-0000-0000
        result = formatRes.replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
      }
    }
    setRequestComInfo({
      ...requestComInfo,
      rqstEnprRprsntvNm: props.pagePropsParam.rqstEnprRprsntvNm,
      reprsntTelno: result,
      mainBizcnd: props.pagePropsParam.mainBizcnd
    })
  }

  // 추천 영업점,직원,기업접수정보 조회
  const loadAuditDetail = async () => {
    const url = Api.my.company.auditDetail + '/' + props.pagePropsParam.invmExntRqstId
    const config = getConfig(url, null)
    const auditDetailObject = await CommonAxios(config, false)
    const tcbData = {
      tcbTchnGrd: auditDetailObject.data.data.tcbTchnGrd,
      incfCd1: auditDetailObject.data.data.incfCd1,
      incfCd2: auditDetailObject.data.data.incfCd2,
      incfCd3: auditDetailObject.data.data.incfCd3
    }
    setTcbTchnGrdObj(tcbData)
    // Y : IBK 중소기업 또는 IBK가 선정한 협약체결 투자사일 경우 / N : 일반 투자사
    ibkVcYnRef.current = auditDetailObject.data.data.ibkVcYn
    // 추천 직원 셋팅

    if (auditDetailObject.data.data.emm !== null) {
      setRecomendStaff(auditDetailObject.data.data.emm + '(' + auditDetailObject.data.data.emn + ')')
    }

    // 위 조회 결과는 영업점 코드만 나오므로 영업점명을 조회하기위해 아래 api로 조회
    const params = getPostConfig(Api.common.ibkBrncList, { searchContent: auditDetailObject.data.data.brcd })
    const recomendBankNmSearch = await CommonAxios(params, false)

    if (recomendBankNmSearch.data.data !== null) {
      // 추천 영업점 셋팅
      if (recomendBankNmSearch.data.data.list.length > 0) {
        setRecomendBank(
          recomendBankNmSearch.data.data.list[0].krnBrm + '(' + recomendBankNmSearch.data.data.list[0].brcd + ')'
        )
      }
    }
  }

  return (
    <div className="card_section card03 message_wrap">
      <CardLayout>
        <div className="section_header">
          <div className="tab_wrap">
            <button className="btn_tab">
              <span className="text">메시지</span>
            </button>
          </div>
          <div className="button_wrap">
            {readOnly ? (
              <></>
            ) : (
              <Button
                onClick={() => exeFunc(writeFormPopupRef, 'open', '', '', pagePropsParam.invmExntRqstId)}
                className="blue"
              >
                쓰기
              </Button>
            )}
          </div>
        </div>
        <div className="table_wrap">
          <table className="table">
            <caption>투자심사 상세 메시지 테이블</caption>
            <colgroup>
              <col width={'5%'} />
              <col width={'40%'} />
              <col width={'17%'} />
              <col width={'10%'} />
              <col width={'20%'} />
              <col width={'8%'} />
            </colgroup>
            <thead>
              <tr>
                <th>NO</th>
                <th>내용</th>
                <th>소속</th>
                <th>보낸사람</th>
                <th>날짜</th>
                <th>첨부</th>
              </tr>
            </thead>
            <tbody>
              {list?.length > 0 ? (
                list.map((item, index) => (
                  <tr
                    style={{ cursor: 'pointer' }}
                    key={createKey()}
                    onClick={() => exeFunc(detailPopupRef, 'open', item)}
                  >
                    <td>{item.rnum}</td>
                    <td>{item.msgTtl}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    <NoResult msg={'등록된 메시지 정보가 없습니다.'} />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="pagination_wrap">
          <Paging ref={pagingRef} onChangePage={onChangePage} onPrev={onChangePage} onNext={onChangePage} />
        </div>
        {ibkVcYnRef.current === CheckYn.YES ? (
          <>
            <div className="section_header">
              <div className="tab_wrap">
                <button className="btn_tab">
                  <span className="text">추천직원 및 영업점</span>
                </button>
              </div>
              <div className="button_wrap">
                <Button
                  onClick={() => exeFunc(recomandPopupRef, 'open', '', '', pagePropsParam.invmExntRqstId)}
                  className="blue"
                >
                  수정
                </Button>
              </div>
            </div>
            <div className="table_wrap">
              <table className="table">
                <caption>투자심사 상세 추천영업점 및 직원 테이블</caption>
                <colgroup>
                  <col width={'30%'} />
                  <col width={'30%'} />
                </colgroup>
                <thead>
                  <tr>
                    <th>추천영업점</th>
                    <th>추천직원</th>
                  </tr>
                </thead>
                <tbody>
                  {recomendBank !== '' && recomendStaff !== '' ? (
                    <tr>
                      <td>{recomendBank}</td>
                      <td>{recomendStaff}</td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan={6}>
                        <NoResult msg={'추천 영업점 및 직원정보가 없습니다.'} />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <br />
            <div className="section_header">
              <div className="tab_wrap">
                <button className="btn_tab">
                  <span className="text">TCB등급 및 기술분류코드</span>
                </button>
              </div>
            </div>
            <div className="table_wrap">
              <table className="table">
                <caption>투자심사 상세 TCB등급 및 기술분류코드 테이블</caption>
                <colgroup>
                  <col width={'20%'} />
                  <col width={'30%'} />
                  <col width={'30%'} />
                  <col width={'30%'} />
                </colgroup>
                <thead>
                  <tr>
                    <th>TCB 기술 등급</th>
                    <th>기술 분류 코드1</th>
                    <th>기술 분류 코드2</th>
                    <th>기술 분류 코드3</th>
                  </tr>
                </thead>
                <tbody>
                  {tcbTchnGrdObj.tcbTchnGrd !== null ? (
                    <tr>
                      <td>{tcbTchnGrdObj.tcbTchnGrd}</td>
                      <td>{tcbTchnGrdObj.incfCd1 === null ? '-' : tcbTchnGrdObj.incfCd1}</td>
                      <td>{tcbTchnGrdObj.incfCd2 === null ? '-' : tcbTchnGrdObj.incfCd2}</td>
                      <td>{tcbTchnGrdObj.incfCd3 === null ? '-' : tcbTchnGrdObj.incfCd3}</td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan={6}>
                        <NoResult msg={'TCB등급 정보가 없습니다.'} />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <br />
            <div className="section_header">
              <div className="tab_wrap">
                <button className="btn_tab">
                  <span className="text">접수 정보</span>
                </button>
              </div>
            </div>
            <div className="table_wrap">
              <table className="table">
                <caption>접수 테이블</caption>
                <colgroup>
                  <col width={'20%'} />
                  <col width={'30%'} />
                  <col width={'30%'} />
                </colgroup>
                <thead>
                  <tr>
                    <th>연락처</th>
                    <th>성함</th>
                    <th>산업분류 코드</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{requestComInfo.reprsntTelno}</td>
                    <td>{requestComInfo.rqstEnprRprsntvNm}</td>
                    <td>{requestComInfo.mainBizcnd}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <></>
        )}
      </CardLayout>
      <AlertPopup ref={alertPopupRef} />
      <DetailPopup
        ref={detailPopupRef}
        readOnly={readOnly}
        loadApi={apiProps.detailApi}
        openReplyPopup={(parentId, parentTtl) => {
          exeFunc(detailPopupRef, 'close')
          exeFunc(replyFormPopupRef, 'open', parentId, parentTtl, pagePropsParam.invmExntRqstId)
        }}
      />
      <SendFormPopup
        ref={writeFormPopupRef}
        invmExntRqstId={pagePropsParam.invmExntRqstId}
        sendApi={apiProps.sendApi}
        refreshList={() => onChangePage(1)}
      />
      <SendFormPopup
        ref={replyFormPopupRef}
        invmExntRqstId={pagePropsParam.invmExntRqstId}
        sendApi={apiProps.replyApi}
        refreshList={() => onChangePage(1)}
      />
      <RecomendEmmPopup ref={recomandPopupRef} invmExntRqstId={pagePropsParam.invmExntRqstId} />
    </div>
  )
})

export default RequestMessageList
