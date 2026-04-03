import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'

import Header from 'components/header/Header'
import Footer from 'components/common/Footer'
import Gallery01 from 'components/common/Gallery01'
import BreadCrumbs from 'components/common/BreadCrumbs'
import Button from 'components/atomic/Button'
import CardLayout from 'components/common/card/CardLayout'

import ProfileImage from 'pageComponents/mypage/common/ProfileImage'
import RequestDetailProgress from 'pageComponents/mypage/common/request/RequestDetailProgress'
import {
  RequestBody,
  RequestCancelBody,
  RequestCancelButton,
  RequestCompleteBody,
  RequestSuggestBody
} from 'pageComponents/mypage/company/request/CompanyRequestComponent'
import RequestMessageList from 'pageComponents/mypage/common/message/RequestMessageList'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import RequestDetailUsisBox from 'pageComponents/mypage/common/request/RequestDetailUsisBox'
import AuditRequestPopupParent from 'pageComponents/common/auditrequestpop/AuditRequestPopupParent'

import ROUTER_NAMES from 'modules/consts/RouterConst'
import QueryUtils from 'modules/utils/QueryUtils'
import { exeFunc, setFunc, setPromiseFunc } from 'modules/utils/ReactUtils'
import Api from 'modules/consts/Api'
import ResponseUtils from 'modules/utils/ResponseUtils'
import { CheckYn, RequestStatusCodeLabels } from 'modules/consts/BizConst'
import { StringUtils } from 'modules/utils/StringUtils'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import BoxUrl from 'modules/consts/BoxUrl'
import CommonAxios, { getConfig } from 'modules/utils/CommonAxios'
import { openSessionAlert } from 'pageComponents/common/pop/SessionCheckAlert'

const RequestDetail = (props) => {
  /** field */
  const history = useHistory()
  const commonContext = useContext(CommonContext)

  const galleryData = {
    title: '마이페이지',
    img: '/images/gallery02_img1.png'
  }

  const messageListRef = useRef()
  const alertPopRef = useRef()
  const receiveRequestPopRef = useRef()
  const confirmPopupRef = useRef()

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

    invmCmpBizrno: '',
    rqstBplcBizrno: '',
    ibkVcYn: '',
    invmexntRapLmtnMnct: '',
    // niceDoc: {
    //   scpgRqstNo: '',
    //   papersPresentnDt: '',
    //   docList: []
    // }

    infotechDoc: [{}]
  })

  const onClickList = () => {
    let url = ROUTER_NAMES.MY_PAGE_COMPANY_REQUEST_RECEIVE_VIEW
    const query = QueryUtils.getQuery(props)
    if (query.hasOwnProperty('type')) {
      if (query['type'] === 'send') {
        url = ROUTER_NAMES.MY_PAGE_COMPANY_REQUEST_SEND_VIEW
      }
    }
    history.push(url)
  }

  const getLogoImage = (imgUrl) => {
    if (StringUtils.hasLength(imgUrl)) return <img src={imgUrl} alt="이용기관 로고" />
    else return <img src={require('assets/images/no_img.jpg').default} alt="이미지없음" />
  }

  const gotoCmpLink = (usisId, cmpFlg) => {
    // 기업인 경우
    if (cmpFlg)
      window.open(BoxUrl.REACT_APP_URL[String(process.env.REACT_APP_PROFILE)] + '/company/detail?utlinsttId=' + usisId)
    // 투자사인경우
    else
      window.open(BoxUrl.REACT_APP_URL[String(process.env.REACT_APP_PROFILE)] + '/invest/detail?utlinsttId=' + usisId)
  }

  const onRefreshEvent = () => {
    const query = QueryUtils.getQuery(props)
    if (query) {
      if (query.hasOwnProperty('invmExntRqstId')) {
        let type = 'receive'
        if (query.hasOwnProperty('type')) {
          type = query['type']
        }
        let url = ROUTER_NAMES.MY_PAGE_COMPANY_REQUEST_DETAIL + '?invmExntRqstId=' + query['invmExntRqstId']
        url += '&type=' + type
        history.push(url)
      }
    }
  }

  const loadAuditDetail = async () => {
    const query = QueryUtils.getQuery(props)
    const url = Api.my.company.auditDetail + '/' + query['invmExntRqstId']
    const config = getConfig(url, null)
    const auditDetailObject = await CommonAxios(config, false)

    return auditDetailObject
  }

  const loadAuditProgressList = () => {
    const query = QueryUtils.getQuery(props)
    const url = Api.my.company.auditProgress + '/' + query['invmExntRqstId']
    const list = ResponseUtils.getList(url, null, 'list', false)
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

              await loadAuditDetail()
                .then((res) => {
                  mountApiCntRef.current--
                  if (res.data.code === 'MNB0003') {
                    openSessionAlert(true, '투자심사 정보가 유효하지 않습니다. 다시 확인해주세요.', () =>
                      history.push(ROUTER_NAMES.MAIN)
                    )
                  } else {
                    setVo(res.data.data)
                  }
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
              setPromiseFunc(messageListRef, 'setData')
                .then((_) => mountApiCntRef.current--)
                .catch((err) => {
                  console.error(err)
                  mountApiCntRef.current--
                })
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
      invmExntRqstId: QueryUtils.getQuery(props)?.invmExntRqstId,
      record: 5,
      pageSize: 5
    }
  }

  /** render */
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
              {/*content_wrap start*/}
              <div className="content_wrap">
                <div className="left_content">
                  {progressList?.length > 0 && <RequestDetailUsisBox progressList={progressList} requestVo={vo} />}

                  {/*제안*/}
                  {vo.invmExntPgsgCd === RequestStatusCodeLabels.SUGGEST && (
                    <Button className={'blue'} onClick={() => exeFunc(receiveRequestPopRef, 'open')}>
                      수락
                    </Button>
                  )}

                  {/*요청*/}
                  {(vo.invmExntPgsgCd === RequestStatusCodeLabels.REQUEST ||
                    vo.invmExntPgsgCd === RequestStatusCodeLabels.EVALUATE) && (
                    <RequestCancelButton
                      {...props}
                      progressList={progressList}
                      alertPopRef={alertPopRef}
                      invmexntRapLmtnMnct={vo.invmexntRapLmtnMnct}
                    />
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
                    <>
                      <RequestSuggestBody vo={vo} getLogoImage={getLogoImage} />
                      <AuditRequestPopupParent
                        {...props}
                        ref={receiveRequestPopRef}
                        submitApi={Api.my.company.auditRequestSave}
                        onRefresh={onRefreshEvent}
                        vcData={{ bplcNm: vo?.invmCmpBplcNm, ibkVcYn: vo?.ibkVcYn }}
                      />
                    </>
                  )}

                  {/*요청*/}
                  {(vo.invmExntPgsgCd === RequestStatusCodeLabels.REQUEST ||
                    vo.invmExntPgsgCd === RequestStatusCodeLabels.EVALUATE) && (
                    <RequestBody vo={vo} getLogoImage={getLogoImage} alertPopRef={alertPopRef} />
                  )}

                  {/*심사완료*/}
                  {vo.invmExntPgsgCd === RequestStatusCodeLabels.COMPLETE && (
                    <RequestCompleteBody vo={vo} getLogoImage={getLogoImage} alertPopRef={alertPopRef} />
                  )}

                  {/*취소*/}
                  {(vo.invmExntPgsgCd === RequestStatusCodeLabels.EXPIRED ||
                    vo.invmExntPgsgCd === RequestStatusCodeLabels.CANCEL) && (
                    <RequestCancelBody progressList={progressList} />
                  )}

                  {progressList?.length > 0 && <RequestMessageList ref={messageListRef} {...props} {...msgListProps} />}
                </div>
              </div>
            </div>
          </div>
          <Footer />
          <AlertPopup ref={alertPopRef} />
        </div>
      </div>
    </>
  )
}

export default RequestDetail
