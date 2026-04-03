import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'

import Button from 'components/atomic/Button'
import Footer from 'components/common/Footer'
import CardLayout from 'components/common/card/CardLayout'
import BreadCrumbs from 'components/common/BreadCrumbs'
import Gallery01 from 'components/common/Gallery01'
import Header from 'components/header/Header'
import NoResult from 'components/common/NoResult'

import Portfolio from 'pageComponents/mypage/investor/info/Portfolio'
import InvestDetailMemberList from 'pageComponents/mypage/investor/info/InvestDetailMemberList'
import ProfileImage from 'pageComponents/mypage/common/ProfileImage'
import ConvertResponsePopup from 'pageComponents/mypage/common/info/ConvertResponsePopup'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import StampSection from 'pageComponents/mypage/common/info/StampSection'

import ROUTER_NAMES from 'modules/consts/RouterConst'
import VoUtils from 'modules/utils/VoUtils'
import ResponseUtils from 'modules/utils/ResponseUtils'
import Api from 'modules/consts/Api'
import DateUtils from 'modules/utils/DateUtils'
import CommonAxios from 'modules/utils/CommonAxios'
import { exeFunc, setPromiseFunc } from 'modules/utils/ReactUtils'
import { getPostConfig } from 'modules/utils/CommonAxios'
import { AlertLabels, CheckYn, UsisType } from 'modules/consts/BizConst'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import { createKey } from 'modules/utils/CommonUtils'
import { StringUtils } from 'modules/utils/StringUtils'
import { isNumber } from 'modules/utils/NumberUtils'
import InvmOrrpList from 'pageComponents/mypage/investor/info/InvmOrrpList'

const InvestorInfo = (props) => {
  const history = useHistory()
  const commonContext = useContext(CommonContext)

  const galleryData = {
    title: '마이페이지',
    img: '/images/gallery02_img1.png'
  }

  const portfolioRef = useRef()
  const investDetailMemberListRef = useRef()
  const stampRef = useRef()
  const alertPopupRef = useRef()
  const convertInfo = useRef({})
  const convertResponseConfirmPopupRef = useRef()

  const [vo, setVo] = useState({
    basicData: {
      addr: '',
      bplcNm: '',
      bsunDwarCd: '',
      bsunDwarNm: '',
      cnrnFildList: [],
      crewRtrv: '',
      empCnt: null,
      enprInrdCon: '',
      fileId: '',
      guAdrAllNm: '',
      hmpgAdres: '',
      invmCmpPtrnCd: '',
      invmCmpPtrnNm: '',
      logoImageUrl: '',
      nwAdrAllNm: '',
      postNo: '',
      reprsntEmail: '',
      reprsntTelno: '',
      rprsntvNm: '',
      utlinsttId: '',
      yearCnt: null,
      reprsntFxnum: '',
      fondDe: '',
      invmexntRapLmtnMnct: null
    },
    investAmount: { utlinsttId: '', invmAmtCd: '', invmAmtNm: '' },
    investFieldList: [],
    investStepList: [],
    utilTechList: [],
    investRegionList: []
  })

  const onClickModifyInfo = () => {
    history.push(ROUTER_NAMES.MY_PAGE_INVESTOR_INFO_WRITE)
  }

  const confirmCheckConvertResult = async () => {
    await commonContext.actions.callbackAfterSessionRefresh(
      async () => {
        const res = await CommonAxios(getPostConfig(Api.my.vc.convertCheckResult, { ...convertInfo.current }))

        if (!(res && res.status === 200 && res.data.hasOwnProperty('code') && res.data.code === '200')) {
          exeFunc(alertPopupRef, 'open', AlertLabels.askAdmin)
        }
      },
      true,
      true
    )
  }

  const loadBasicInfo = async () => {
    const resBasicInfo = await ResponseUtils.getSimpleResponse(Api.my.vc.basicInfoDetail, null, false)
    return resBasicInfo
  }

  const isMounted = useRef(false)
  const mountApiCntRef = useRef(0)

  useEffect(() => {
    if (commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
      isMounted.current = true

      commonContext.actions.pageMountPathCheck(
        history,
        async () => {
          mountApiCntRef.current = 4

          await loadBasicInfo()
            .then((res) => {
              mountApiCntRef.current--

              VoUtils.setVoNullToEmpty(res.basicData, ['empCnt', 'yearCnt'])
              VoUtils.setVoNullToEmpty(res.investAmount)
              VoUtils.setListVoNullToEmpty(res.investFieldList, ['ivflSqn'])
              VoUtils.setListVoNullToEmpty(res.investStepList)
              VoUtils.setListVoNullToEmpty(res.utilTechList, ['utlzTchnSqn'])
              VoUtils.setListVoNullToEmpty(res.investRegionList)
              setVo(res)

              if (res && res.hasOwnProperty('convertInfo') && res.convertInfo !== null) {
                if (res.convertInfo['alrtCnfaYn'] === CheckYn.NO) {
                  const msg = '투자사 전환 요청이 승인되어 <br /> 투자사 회원으로 전환되었습니다.'
                  convertInfo.current = res.convertInfo
                  exeFunc(convertResponseConfirmPopupRef, 'open', msg, res.convertInfo['rgsnTs'])
                }
              }
            })
            .catch((err) => {
              console.error(err)
              mountApiCntRef.current--
            })

          setPromiseFunc(portfolioRef, 'setData')
            .then((_) => mountApiCntRef.current--)
            .catch((err) => {
              console.error(err)
              mountApiCntRef.current--
            })
          setPromiseFunc(investDetailMemberListRef, 'setData')
            .then((_) => mountApiCntRef.current--)
            .catch((err) => {
              console.error(err)
              mountApiCntRef.current--
            })
          setPromiseFunc(stampRef, 'setData')
            .then((_) => mountApiCntRef.current--)
            .catch((err) => {
              console.error(err)
              mountApiCntRef.current--
            })
        },
        mountApiCntRef
      )
    }
  }, [commonContext.state.user])

  useEffect(() => {
    return () => (isMounted.current = false)
  }, [])

  return (
    <>
      <Header />
      <div className="page_container">
        <div className="wrap mypage_wrap info_wrap investor bg02">
          <div className="gallery_logo_wrap">
            <Gallery01 data={galleryData} />
            <ProfileImage />
          </div>
          <BreadCrumbs {...props} />
          <div className="container default_size02">
            <div className="section section01">
              <div className="section_header">
                <h3 className="section_title"> 내 정보</h3>
                <Button className={'blue'} onClick={onClickModifyInfo}>
                  수정하기
                </Button>
              </div>
              <CardLayout>
                {/*basic_wrap start*/}
                <div className="basic_wrap info_section">
                  <div className="card_header">
                    <h3 className="ico_title title">기본정보</h3>
                  </div>
                  <div className="info_table">
                    <table className="table type03">
                      <caption>기본정보 테이블</caption>
                      <colgroup>
                        <col width={'12%'} />
                        <col width={'38%'} />
                        <col width={'12%'} />
                        <col width={'38%'} />
                      </colgroup>
                      <tbody>
                        <tr>
                          <th>투자사명</th>
                          <td>{vo.basicData.bplcNm}</td>
                          <th>대표번호</th>
                          <td>{vo.basicData.reprsntTelno}</td>
                        </tr>
                        <tr>
                          <th>대표</th>
                          <td>{vo.basicData.rprsntvNm}</td>
                          <th>팩스번호</th>
                          <td>{vo.basicData.rprsntvNm}</td>
                        </tr>
                        <tr>
                          <th>설립일</th>
                          <td>{DateUtils.insertYyyyMmDdDash(vo.basicData.fondDe)}</td>
                          <th>이메일</th>
                          <td>{vo.basicData.reprsntEmail}</td>
                        </tr>
                        <tr>
                          <th>투자유형</th>
                          <td>{vo.basicData.invmCmpPtrnNm}</td>
                          <th>직원수</th>
                          <td>{isNumber(vo.basicData?.empCnt) && `${vo.basicData.empCnt} 명`}</td>
                        </tr>
                        <tr>
                          <th>주소</th>
                          <td>
                            {StringUtils.hasLength(vo.basicData?.postNo) && `(${vo.basicData.postNo}) `}
                            {vo.basicData.addr}
                          </td>
                          <th>홈페이지</th>
                          <td>{vo.basicData.hmpgAdres}</td>
                        </tr>
                        <tr>
                          <th>관심분야</th>
                          <td colSpan={3}>
                            <ul className="tag_box_list">
                              {vo?.basicData?.cnrnFildList?.map((item, i) => (
                                <li className="tag_box_item" key={createKey()}>
                                  {item['cnrnFildNm']}
                                </li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="prod_info_wrap investor category">
                  <div className="card_header">
                    <h3 className="ico_title title">투자정보</h3>
                  </div>
                  <div className="prod_content">
                    <div className="prod_inner hope">
                      <div className="info_table ">
                        <table className="table type03">
                          <caption>투자정보 테이블</caption>
                          <colgroup>
                            <col width={'12%'} />
                            <col width={'38%'} />
                            <col width={'12%'} />
                            <col width={'38%'} />
                          </colgroup>
                          <tbody>
                            <tr>
                              <th>관심 비즈니스 분야</th>
                              <td>
                                <ul className="tag_box_list">
                                  {vo?.investFieldList?.map((item, i) => (
                                    <li className="tag_box_item" key={createKey()}>
                                      {item['invmFildNm']}
                                    </li>
                                  ))}
                                </ul>
                              </td>
                              <th>관심기술</th>
                              <td>
                                <ul className="tag_box_list">
                                  {vo?.utilTechList?.map((item, i) => (
                                    <li className="tag_box_item" key={createKey()}>
                                      {item['utlzTchnNm']}
                                    </li>
                                  ))}
                                </ul>
                              </td>
                            </tr>
                            <tr>
                              <th>주요 투자 단계</th>
                              <td>
                                <ul className="tag_box_list">
                                  {vo?.investStepList?.map((item, i) => (
                                    <li className="tag_box_item" key={createKey()}>
                                      {item['invmStgNm']}
                                    </li>
                                  ))}
                                </ul>
                              </td>
                              <th>투자 금액 범위</th>
                              <td style={{ verticalAlign: 'middle' }}>
                                <ul className="tag_box_list">
                                  <li>{vo.investAmount.invmAmtNm}</li>
                                </ul>
                              </td>
                            </tr>
                            <tr>
                              <th>주요 투자 지역</th>
                              <td>
                                <ul className="tag_box_list">
                                  {vo?.investRegionList?.map((item, i) => (
                                    <li className="tag_box_item" key={createKey()}>
                                      {item['invmAreaCdNm']}
                                    </li>
                                  ))}
                                </ul>
                              </td>
                              <th>투자 재신청 제한기간</th>
                              <td style={{ verticalAlign: 'middle' }}>
                                {isNumber(vo?.basicData?.invmexntRapLmtnMnct) && (
                                  <ul className="tag_box_list">
                                    <li>{`${vo?.basicData?.invmexntRapLmtnMnct} 개월`}</li>
                                  </ul>
                                )}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="introduce_wrap info_section">
                  <div className="card_header">
                    <h3 className="ico_title title">소개</h3>
                  </div>
                  {StringUtils.hasLength(vo.basicData.enprInrdCon) ? (
                    <p className="introduce_text">{vo.basicData.enprInrdCon}</p>
                  ) : (
                    <NoResult msg={'등록된 소개내용이 없습니다.'} style={{ marginTop: '40px', marginBottom: '40px' }} />
                  )}
                </div>
              </CardLayout>
            </div>
            <Portfolio ref={portfolioRef} />
            <InvestDetailMemberList ref={investDetailMemberListRef} />
            <div className="section section04">
              <StampSection
                ref={stampRef}
                {...props}
                writeRouteUrl={ROUTER_NAMES.MY_PAGE_INVESTOR_STAMP_WRITE}
                searchApiUrl={Api.my.vc.seal}
              />
            </div>
            <div className="section section05">
              <InvmOrrpList />
            </div>
          </div>
          <Footer />
        </div>
      </div>
      <ConvertResponsePopup ref={convertResponseConfirmPopupRef} onConfirm={confirmCheckConvertResult} />
      <AlertPopup ref={alertPopupRef} />
    </>
  )
}

export default InvestorInfo
