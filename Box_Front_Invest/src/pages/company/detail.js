/** @jsxImportSource @emotion/react */

import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'

import { companyDetail } from 'assets/style/CompanyStyle'

import Button from 'components/atomic/Button'
import Header from 'components/header/Header'
import Footer from 'components/common/Footer'
import Gallery01 from 'components/common/Gallery01'
import BreadCrumbs from 'components/common/BreadCrumbs'
import CardLayout from 'components/common/card/CardLayout'

import CompanyIntroduce from 'pageComponents/company/CompanyIntroduce'
import ServiceProduct from 'pageComponents/company/ServiceProduct'
import CompanyDetailInfo from 'pageComponents/company/CompanyDetailInfo'
import BusinessInquiry from 'pageComponents/company/BusinessInquiry'
import TeamInfo from 'pageComponents/company/TeamInfo'
import IntroVideo from 'pageComponents/company/IntroVideo'
import RequestPop from 'pageComponents/company/requestpop/RequestPop'
import CheckCloseAlertPopup from 'pageComponents/common/pop/CheckCloseAlertPopup'
import ConfirmPopup from 'pageComponents/common/pop/ConfirmPopup'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import AuditPossibleCheckPopup from 'pageComponents/common/auditrequestpop/AuditPossibleCheckPopup'

import QueryUtils from 'modules/utils/QueryUtils'
import Api from 'modules/consts/Api'
import { exeFunc } from 'modules/utils/ReactUtils'
import ResponseUtils from 'modules/utils/ResponseUtils'
import CommonAxios from 'modules/utils/CommonAxios'
import { getPostConfig } from 'modules/utils/CommonAxios'
import { AlertLabels, CheckYn, RequestStatusCodeLabels, UsisType } from 'modules/consts/BizConst'
import { StringUtils } from 'modules/utils/StringUtils'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import { deepCopyByRecursion } from 'modules/utils/CommonUtils'

const Detail = (props) => {
  const requestPopRef = useRef()

  const galleryData = {
    title: '기업정보',
    subInfo: '', // 혁신적인 스타트업을 찾아보세요.
    img: '/images/gallery03_img1.png'
  }

  const [vo, setVo] = useState({
    basicData: {
      addr: '',
      adres: '',
      bizrno: '',
      bplcNm: '',
      bsunDwarCd: '',
      bsunDwarNm: '',
      btnm: '',
      bzstNm: '',
      cnrnFildList: [],
      crewRtrv: '',
      empCnt: null,
      enfmClsfCd: '',
      enfmClsfNm: '',
      enprDsncClsfCd: '',
      enprDsncClsfNm: '',
      enprInrdCon: '',
      fondDe: '',
      guAdrAllNm: '',
      hmpgAdres: '',
      ipList: [],
      jurirno: '',
      logoImageUrl: '',
      lstnYn: '',
      msrnAmslAmt: null,
      msrnAmslYear: '',
      nwAdrAllNm: '',
      postNo: '',
      reprsntEmail: '',
      reprsntFxnum: '',
      reprsntTelno: '',
      rprsntvNm: '',
      salamt: null,
      utlinsttId: '',
      loginUsisLikeYn: '',
      prefCnt: null
      // oppbYn: '',
      // invmAmtCd: '',
      // invmAmtNm: '',
      // invmStgCd: '',
      // invmStgNm: '',
    },
    investData: {
      investHope: {
        oppbYn: '',
        osivHopeyn: '',

        invmStgCd: '',
        invmStgNm: '',
        invmAmtCd: '',
        invmAmtNm: ''
      },
      investFieldList: [],
      utilTechList: []
    },
    mediaList: [],
    memberCnt: 0,
    memberList: [],

    // 기능 추가 : 커머스 판매자 스토어 목록이 있는 경우 연동 정보 제공
    productListGroup: {
      commerceListYn: '',
      productList: [],
      commerceProductList: []
    }
  })

  const [ongoingYn, setOngoingYn] = useState(CheckYn.YES)

  const alertPopupRef = useRef()
  const auditPossibleCheckPopup = useRef()

  const history = useHistory()
  const commonContext = useContext(CommonContext)

  const loadDetail = async () => {
    const query = QueryUtils.getQuery(props)
    if (query.hasOwnProperty('utlinsttId')) {
      const url = Api.company.infoDetail + '/' + query.utlinsttId
      const res = ResponseUtils.getSimpleResponse(url)
      return res
    }
  }

  const checkAuditCompanyLimit = async () => {
    let result = null

    await commonContext.actions.callbackAfterSessionRefresh(
      async () => {
        result = await CommonAxios(
          getPostConfig(Api.company.auditLimit, { id: QueryUtils.getQuery(props)?.utlinsttId })
        )
      },
      true,
      true
    )

    if (result?.data?.code == '200') {
      const resData = result.data.data

      if (resData.passYn === CheckYn.YES) exeFunc(requestPopRef, 'open')
      else exeFunc(auditPossibleCheckPopup, 'open', resData.failCode, resData.tcbTchnGrd)
    } else {
      exeFunc(alertPopupRef, 'open', AlertLabels.askAdmin)
    }
  }

  const onClickUpdateLikeToggle = async () => {
    const targetUsisId = QueryUtils.getQuery(props)?.utlinsttId
    if (StringUtils.hasLength(targetUsisId))
      await commonContext.actions.callbackAfterSessionRefresh(
        async () => {
          const res = await CommonAxios(getPostConfig(Api.company.likeToggleSave, { id: targetUsisId }))
          if (res?.data?.code == '200') {
            const rsltLike = res.data.data.isPrefer

            const _vo = deepCopyByRecursion(vo)
            _vo.basicData.loginUsisLikeYn = rsltLike === CheckYn.YES ? CheckYn.YES : CheckYn.NO
            _vo.basicData.prefCnt = rsltLike === CheckYn.YES ? _vo.basicData.prefCnt + 1 : _vo.basicData.prefCnt - 1
            setVo(_vo)
          } else {
            exeFunc(alertPopupRef, 'open', AlertLabels.askAdmin)
          }
        },
        true,
        true
      )
  }

  const isMountRef = useRef(false)
  const mountApiCntRef = useRef(0)

  useEffect(() => {
    if (commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMountRef.current) {
      isMountRef.current = true

      const query = QueryUtils.getQuery(props)
      if (query.hasOwnProperty('utlinsttId')) {
        commonContext.actions.pageMountPathCheck(
          history,
          async () => {
            window.scrollTo(window.scrollX, 0)
            mountApiCntRef.current = 2

            if (commonContext.state.user.info?.type === UsisType.INVESTOR) {
              ResponseUtils.getSimpleResponse(Api.company.auditOnGoing + '?rqstEnprId=' + query.utlinsttId)
                .then((res) => {
                  mountApiCntRef.current--
                  if (res) setOngoingYn(res['ongoingYn'])
                })
                .catch((err) => {
                  console.error(err)
                  mountApiCntRef.current--
                })
            } else {
              mountApiCntRef.current--
            }

            loadDetail()
              .then((res) => {
                mountApiCntRef.current--
                if (res) setVo(res)
              })
              .catch((err) => {
                console.error(err)
                mountApiCntRef.current--
              })
          },
          mountApiCntRef
        )
      }
    }
  }, [commonContext.state.user])

  useEffect(() => {
    return () => (isMountRef.current = false)
  }, [])

  return (
    <>
      <Header page={'sub'} {...props} bgType={true} />
      <div className="page_container">
        <div className="wrap company_wrap company_detail_wrap bg02" css={companyDetail}>
          <div className="gallery_logo_wrap">
            <Gallery01 data={galleryData} />
            {StringUtils.hasLength(commonContext.state.user.info?.userAuth) &&
              commonContext.state.user.info?.type === UsisType.INVESTOR &&
              ongoingYn === CheckYn.NO && (
                <Button className={'btn_request dark_blue '} onClick={checkAuditCompanyLimit}>
                  투자심사 제안
                </Button>
              )}
          </div>
          <BreadCrumbs {...props} />
          <div className="container default_size02">
            {/*section01 start*/}
            <div className="section_row section01 ">
              <div className="left_section">
                {/*기업소개 card01 start*/}
                <div className="card_section card01">
                  <CardLayout>
                    {/*좋아요 클릭하면 like_wrap + active*/}

                    {commonContext.state.user?.info?.type === UsisType.INVESTOR && (
                      <div
                        className={`like_wrap${vo.basicData?.loginUsisLikeYn === CheckYn.YES ? ' active' : ''}`}
                        onClick={onClickUpdateLikeToggle}
                      >
                        <div className="number">{vo.basicData?.prefCnt}</div>
                      </div>
                    )}

                    <CompanyIntroduce vo={vo} />
                  </CardLayout>
                </div>
                {/*기업소개 card01 end*/}
                {/*서비스 / 제품 card02 start*/}
                <div className="card_section card02">
                  <CardLayout>
                    <ServiceProduct productGroup={vo.productListGroup} {...props} />
                  </CardLayout>
                </div>
                {/*서비스 / 제품 card02 end*/}
              </div>

              <div className="right_section">
                {/*기업상세 card03 start*/}
                <div className="card_section card03">
                  <CardLayout>
                    <CompanyDetailInfo vo={vo} />
                  </CardLayout>
                </div>
                {/*기업상세 card03 end*/}
              </div>
            </div>

            <div className="section_row section02">
              <div className="left_section">
                <div className="card_section card04">
                  <CardLayout>
                    <BusinessInquiry {...props} alertPopupRef={alertPopupRef} />
                  </CardLayout>
                </div>
                <div
                  className="card_section card05"
                  style={!(vo?.memberList?.length > 0) ? { maxHeight: '280px' } : {}}
                >
                  <CardLayout>
                    <TeamInfo vo={vo} />
                  </CardLayout>
                </div>
              </div>
              <div className="right_section">
                <div className="card_section card06">
                  <CardLayout>
                    <IntroVideo vo={vo} />
                  </CardLayout>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
      <RequestPop ref={requestPopRef} alertPopup={alertPopupRef} vo={vo} {...props} />
      <AlertPopup ref={alertPopupRef} />
      <AuditPossibleCheckPopup ref={auditPossibleCheckPopup} auditStatus={RequestStatusCodeLabels.SUGGEST} />
    </>
  )
}
export default Detail
