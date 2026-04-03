import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'

import Header from 'components/header/Header'
import Gallery01 from 'components/common/Gallery01'
import ProfileImage from 'pageComponents/mypage/common/ProfileImage'
import BreadCrumbs from 'components/common/BreadCrumbs'
import Button from 'components/atomic/Button'
import CardLayout from 'components/common/card/CardLayout'
import Footer from 'components/common/Footer'

import RequestDetailProgress from 'pageComponents/mypage/common/request/RequestDetailProgress'
import RequestReference from 'pageComponents/mypage/investor/request/RequestReference'
import IrPreviewPopup from 'pageComponents/common/irpreviewpop/IrPreviewPopup'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import RequestMessageList from 'pageComponents/mypage/common/message/RequestMessageList'
import {
  RequestCancelBody,
  RequestCompleteBody,
  RequestEvaluateButton,
  RequestEvaluatingBody,
  RequestSuggestBody,
  RequestBody
} from 'pageComponents/mypage/investor/request/InvestRequestComponent'
import RequestDetailUsisBox from 'pageComponents/mypage/common/request/RequestDetailUsisBox'

import ROUTER_NAMES from 'modules/consts/RouterConst'
import QueryUtils from 'modules/utils/QueryUtils'
import { setPromiseFunc } from 'modules/utils/ReactUtils'
import Api from 'modules/consts/Api'
import ResponseUtils from 'modules/utils/ResponseUtils'
import { CheckYn, RequestStatusCodeLabels } from 'modules/consts/BizConst'
import { StringUtils } from 'modules/utils/StringUtils'
import IrPreviewApi from 'modules/consts/IrPreviewApi'
import { CommonContext } from 'modules/contexts/common/CommomContext'

const RequestDetail = (props) => {
  const history = useHistory()
  const commonContext = useContext(CommonContext)

  const galleryData = {
    title: '마이페이지',
    img: '/images/gallery02_img1.png'
  }

  const messageListRef = useRef()
  const previewRef = useRef()
  const alertPopRef = useRef()

  const [progressList, setProgressList] = useState([])
  const [vo, setVo] = useState({
    addtDocFileId: '',
    addtDocFileNm: '',
    anncDatFileId: '',
    anncDatFileNm: '',
    enprDsncClsfCd: '',
    enprDsncClsfNm: '',
    enprLogoImageUrl: '',
    exntMsgCon: '',
    inqAblNdd: 0,
    invmCmpId: '',
    invmCmpPtrnCd: '',
    invmCmpPtrnNm: '',
    invmCmpBplcNm: '',
    invmExntPgsgCd: '',
    invmExntPgsgNm: '',
    invmExntRqstId: '',
    invmLogoImageUrl: '',
    pbrlPictUrl: '',
    prplMsgCon: '',
    rqstBplcNm: '',
    rqstEnprId: '',
    rqstEnprIrInqYn: CheckYn.NO,
    rqstMsgCon: '',
    invmRqstDt: '',

    exntRsltCd: '',
    exntRsltNm: '',
    invmPrfrScdlAmt: null,
    exntRsltRmrk: '',
    reprsntTelno: '',

    infotechDoc: [{}],

    rqstEnprRprsntvNm: '',
    mainBizcnd: ''
    // niceDoc: {
    //   scpgRqstNo: '',
    //   papersPresentnDt: '',
    //   docList: []
    // }
  })

  const onClickList = () => {
    let url = ROUTER_NAMES.MY_PAGE_INVESTOR_REQUEST_RECEIVE_VIEW
    let query = QueryUtils.getQuery(props)
    if (query.hasOwnProperty('type')) {
      if (query['type'] === 'send') url = ROUTER_NAMES.MY_PAGE_INVESTOR_REQUEST_SEND_VIEW
    }
    history.push(url)
  }

  const getLogoImage = (imgUrl) => {
    if (StringUtils.hasLength(imgUrl)) return <img src={imgUrl} alt="이용기관 로고" />
    else return <img src={require('assets/images/no_img.jpg').default} alt="이미지없음" />
  }

  const loadAuditDetail = async () => {
    const query = QueryUtils.getQuery(props)
    const url = Api.my.vc.auditDetail + '/' + query['invmExntRqstId']
    const auditDetailObject = ResponseUtils.getSimpleResponse(url)
    return auditDetailObject
  }

  const loadAuditProgressList = () => {
    const query = QueryUtils.getQuery(props)
    const url = Api.my.vc.auditProgress + '/' + query['invmExntRqstId']
    const list = ResponseUtils.getList(url)
    return list
  }

  const isMounted = useRef(false)
  const mountApiCntRef = useRef(0)

  useEffect(() => {
    if (commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
      isMounted.current = true

      commonContext.actions.pageMountPathCheck(
        history,
        async () => {
          const query = QueryUtils.getQuery(props)
          if (query) {
            if (query.hasOwnProperty('invmExntRqstId')) {
              mountApiCntRef.current = 3

              // 로드 순서상 await 처리
              await loadAuditDetail()
                .then((res) => {
                  mountApiCntRef.current--
                  setVo(res)
                })
                .catch((err) => {
                  console.error(err)
                  mountApiCntRef.current--
                })
              await loadAuditProgressList()
                .then((res) => {
                  mountApiCntRef.current--
                  setProgressList(res)
                })
                .catch((err) => {
                  console.error(err)
                  mountApiCntRef.current--
                })

              setPromiseFunc(messageListRef, 'setData').then((_) => mountApiCntRef.current--)
            }
          }
        },
        mountApiCntRef
      )
    }
  }, [commonContext.state.user])

  useEffect(() => {
    return () => (isMounted.current = false)
  }, [])

  const msgListProps = {
    readOnly: !(
      vo.invmExntPgsgCd == RequestStatusCodeLabels.SUGGEST ||
      vo.invmExntPgsgCd == RequestStatusCodeLabels.REQUEST ||
      vo.invmExntPgsgCd == RequestStatusCodeLabels.EVALUATE
    ),
    apiProps: {
      loadListApi: Api.my.vc.auditMessageList,
      detailApi: Api.my.vc.auditMessageDetail,
      sendApi: Api.my.vc.auditMessageSend,
      replyApi: Api.my.vc.auditMessageReply
    },
    pagePropsParam: {
      invmExntRqstId: vo.invmExntRqstId,
      rqstEnprRprsntvNm: vo.rqstEnprRprsntvNm,
      mainBizcnd: vo.mainBizcnd,
      reprsntTelno: vo.reprsntTelno,
      record: 5,
      pageSize: 5
    }
  }

  return (
    <>
      <Header />

      <div className="page_container">
        <div className="wrap mypage_wrap requestdetail_wrap mypage_common bg02">
          <div className="gallery_logo_wrap">
            <Gallery01 data={galleryData} />
            <ProfileImage />
          </div>
          <BreadCrumbs {...props} />
          <div className="container default_size02">
            <div className="section section01">
              <div className="section_header">
                <h3 className="section_title">투자심사요청</h3>
                <Button className={'linear blue'} onClick={onClickList}>
                  리스트
                </Button>
              </div>
              <div className="content_wrap">
                <div className="left_content">
                  {progressList?.length > 0 && <RequestDetailUsisBox progressList={progressList} requestVo={vo} />}

                  {vo.invmExntPgsgCd === RequestStatusCodeLabels.SUGGEST && (
                    <>
                      <Button className={'blue'} disabled={CheckYn.YES}>
                        심사하기
                      </Button>
                      <p className="warning_msg">‘기업 승인 후’ 심사하기가 가능합니다.</p>
                    </>
                  )}
                  {vo.invmExntPgsgCd === RequestStatusCodeLabels.REQUEST && (
                    <RequestEvaluateButton {...props} alertPopRef={alertPopRef} />
                  )}
                </div>
                <div className="right_content">
                  {/*진행도*/}
                  {progressList?.length > 0 && (
                    <div className="card_section card01">
                      <CardLayout>
                        <p className="content_title">투자심사 Progress</p>
                        <ul className="progress_list">
                          <RequestDetailProgress progressList={progressList} statusCode={vo.invmExntPgsgCd} />
                        </ul>
                      </CardLayout>
                    </div>
                  )}

                  {/*제안*/}
                  {vo.invmExntPgsgCd === RequestStatusCodeLabels.SUGGEST && (
                    <RequestSuggestBody vo={vo} getLogoImage={getLogoImage} />
                  )}
                  {/*요청*/}
                  {vo.invmExntPgsgCd === RequestStatusCodeLabels.REQUEST && (
                    <RequestBody vo={vo} getLogoImage={getLogoImage} />
                  )}
                  {/*심사중*/}
                  {vo.invmExntPgsgCd === RequestStatusCodeLabels.EVALUATE && (
                    <RequestEvaluatingBody {...props} vo={vo} alertPopRef={alertPopRef} />
                  )}
                  {/*심사완료*/}
                  {vo.invmExntPgsgCd === RequestStatusCodeLabels.COMPLETE && (
                    <RequestCompleteBody vo={vo} getLogoImage={getLogoImage} />
                  )}
                  {/*취소*/}
                  {(vo.invmExntPgsgCd === RequestStatusCodeLabels.EXPIRED ||
                    vo.invmExntPgsgCd === RequestStatusCodeLabels.CANCEL) && (
                    <RequestCancelBody progressList={progressList} />
                  )}
                  {(vo.invmExntPgsgCd === RequestStatusCodeLabels.REQUEST ||
                    vo.invmExntPgsgCd === RequestStatusCodeLabels.EVALUATE ||
                    vo.invmExntPgsgCd === RequestStatusCodeLabels.COMPLETE) && (
                    <>
                      <RequestReference vo={vo} alertPopRef={alertPopRef} previewRef={previewRef} />
                      <IrPreviewPopup
                        ref={previewRef}
                        irTitle={`${vo.rqstBplcNm} IR 자료`}
                        api={IrPreviewApi.myVcAudit(vo.invmExntRqstId)}
                      />
                    </>
                  )}
                  {progressList?.length > 0 && <RequestMessageList ref={messageListRef} {...props} {...msgListProps} />}
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
      <AlertPopup ref={alertPopRef} />
    </>
  )
}

export default RequestDetail
