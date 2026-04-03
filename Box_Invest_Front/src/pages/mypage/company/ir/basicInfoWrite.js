/** @jsxImportSource @emotion/react */
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'

import Header from 'components/header/Header'
import Footer from 'components/common/Footer'
import Gallery01 from 'components/common/Gallery01'
import BreadCrumbs from 'components/common/BreadCrumbs'
import Tab from 'components/common/Tab'
import Button from 'components/atomic/Button'
import CardLayout from 'components/common/card/CardLayout'
import Select from 'components/atomic/Select'
import { NextBtn } from 'components/atomic/IconButton'

import AmountInputForm from 'pageComponents/company/ir/AmountInputForm'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import NumberInput from 'pageComponents/common/number/NumberInput'
import ConfirmPopup from 'pageComponents/common/pop/ConfirmPopup'
import CheckCloseAlertPopup from 'pageComponents/common/pop/CheckCloseAlertPopup'
import MoveTabConfirmPopup from 'pageComponents/common/pop/MoveTabConfirmPopup'
import ProfileImage from 'pageComponents/mypage/common/ProfileImage'
import MaxLengthCount from 'pageComponents/common/number/MaxLengthCount'

import ROUTER_NAMES from 'modules/consts/RouterConst'
import { exeFunc, setFunc } from 'modules/utils/ReactUtils'
import FormUtils from 'modules/utils/FormUtils'
import VoUtils from 'modules/utils/VoUtils'
import ResponseUtils from 'modules/utils/ResponseUtils'
import Api from 'modules/consts/Api'
import { StringUtils } from 'modules/utils/StringUtils'
import CommonAxios from 'modules/utils/CommonAxios'
import { getPostConfig } from 'modules/utils/CommonAxios'
import DateUtils from 'modules/utils/DateUtils'
import CommonConst from 'modules/consts/CommonConst'
import { AlertLabels, SelCmmId } from 'modules/consts/BizConst'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import { CodeContext } from 'modules/contexts/common/CodeContext'

const IrBasicWrite = (props) => {
  const galleryData = {
    title: '마이페이지',
    img: '/images/gallery02_img1.png'
  }

  const history = useHistory()
  const commonContext = useContext(CommonContext)
  const codeContext = useContext(CodeContext)

  const [progress, setProgress] = useState(0)
  const [vo, setVo] = useState({
    acpr: '',
    adr: '',
    bnnm: '',
    btnm: '',
    bzn: '',
    cgn: '',
    cnpl: '',
    col: '',
    cpfnAmt: 0,
    empCnt: 0,
    enprDsncCd: '',
    etvlAmt: '',
    hmpgUrlAdr: '',
    investList: [],
    invmMnyUsus: '',
    invmRtrvPlanCon: '',
    pvprAmt: 0,
    rprnm: '',
    supportList: [],
    ttisStcnt: 0,
    utlinsttId: '',
    zpcd: ''
  })

  const [companyTypeSelect, setCompanyTypeSelect] = useState({
    selected: '',
    selList: []
  })

  const [tabList, setTabList] = useState({
    active: ROUTER_NAMES.MY_PAGE_IR_BASIC_INFO_WRITE,
    list: CommonConst.IR_TAB_WRITE_LIST
  })

  const alertPopRef = useRef()
  const confirmPopRef = useRef()
  const moveTabConfirmRef = useRef()
  const moveTabEmptyConfirmRef = useRef()
  const checkCloseAlertPopupRef = useRef()

  const invmMnyUsusMaxRef = useRef()
  const invmRtrvPlanConMaxRef = useRef()

  const onChangeInput = (event) => {
    FormUtils.setVoInput(vo, event.target.id, event.target.value, [
      'empCnt',
      'cpfnAmt',
      'pvprAmt',
      'ttisStcnt',
      'etvlAmt',
      'acpr',
      'cnpl',
      'col'
    ])

    if (event.target.id === 'invmMnyUsus') {
      setFunc(invmMnyUsusMaxRef, 'setData', event.target.value.length)
    } else if (event.target.id === 'invmRtrvPlanCon') {
      setFunc(invmRtrvPlanConMaxRef, 'setData', event.target.value.length)
    } else if (event.target.id === 'acpr') {
      event.target.value = event.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
      setVo({ ...vo, acpr: event.target.value })
    } else if (event.target.id === 'cnpl') {
      const regex = /^[0-9]*$/
      const num = event.target.value.replace(/-/g, '', '')
      if (regex.test(num) && event.target.value.length < 14 && num.length < 12) {
        let formatRes = isTelFormat(num)
        event.target.value = formatRes
        setVo({ ...vo, cnpl: event.target.value.replace('-', '') })
      }
    }else if (event.target.id === 'col') {
      event.target.value = event.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1')
      setVo({ ...vo, col: event.target.value })
    }else {
      setVo({ ...vo, [event.target.id]: event.target.value })
    }
  }
  // /* 휴대폰 formating function */
  const isTelFormat = (tel) => {
    if (tel.length === 3) {
      return tel.replace(/(\d{3})/, '$1-')
    } else if (tel.length === 7) {
      return tel.replace(/(\d{3})(\d{4})/, '$1-$2')
    } else if (tel.length === 11) {
      //000-0000-0000
      return tel.replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
    }
    return tel
  }
  // const onChangeDate = (currentDate, item, property) => {
  //   FormUtils.setVoDateExceptDash(item, property, currentDate)
  // }
  const onChangeCompanyType = (e) => {
    const value = e.target.value
    setCompanyTypeSelect({
      ...companyTypeSelect,
      selected: value
    })
    vo.enprDsncCd = value
  }

  /** Validation */

  const validateCompare = async () => {
    let r = true
    const resBasicInfo = await loadBasicInfo()
    VoUtils.setVoNullToEmpty(
      resBasicInfo,
      ['empCnt', 'cpfnAmt', 'pvprAmt', 'ttisStcnt'],
      ['utlinsttId', 'investList', 'supportList']
    )
    if (JSON.stringify(resBasicInfo) !== JSON.stringify(vo)) {
      r = false
    }
    return r
  }

  /** Move */

  const onClickMove = async (url) => {
    await commonContext.actions.callbackAfterSessionRefresh(
      async () => {
        if ((await onBeforeTabMove(url)) === false) {
          return
        }
        history.replace(url)
      },
      true,
      true
    )
  }

  const onBeforeTabMove = async (url) => {
    if (progress === 0) {
      exeFunc(moveTabConfirmRef, 'open', AlertLabels.notSaveMove, url)
      return false
    } else if (progress > 0) {
      if ((await validateCompare()) === false) {
        exeFunc(moveTabConfirmRef, 'open', AlertLabels.askEditSaveBeforeCancel, url)
        return false
      }
    }
    // else if (progress > 0) {
    //     exeFunc(moveTabConfirmRef, 'open', AlertLabels.askEditSaveBeforeCancel, url);
    //     return false
    // }
    return true
  }

  /** Tab Move */

  const handleTabList = async (url) => {
    await onClickMove(url)
  }

  const onClickNext = async () => {
    await onClickMove(ROUTER_NAMES.MY_PAGE_IR_HISTORY_WRITE)
  }

  /** Cancel Button */

  const onClickCancel = async () => {
    if (progress === 0) {
      await onClickMove(ROUTER_NAMES.MY_PAGE_IR)
    } else if (progress > 0) {
      await onClickMove(ROUTER_NAMES.MY_PAGE_IR_BASIC_INFO)
    }
  }

  /** Save Button */

  const onClickSave = () => {
    exeFunc(confirmPopRef, 'open', AlertLabels.saveIt)
  }

  /** pop ref onConfirm */

  const onConfirmMoveTabEmpty = async (url) => {
    location.replace(url)
  }
  const onCancelMoveTab = (url) => {
    location.replace(url)
  }
  const onConfirmMoveTab = async (url) => {
    await commonContext.actions.callbackAfterSessionRefresh(
      async () => {
        if ((await saveBeforeTabMove()) === false) {
          return
        }
        setTimeout(() => {
          location.replace(url)
        }, 500)
      },
      true,
      true
    )
  }
  const onConfirmSave = async () => {
    await commonContext.actions.callbackAfterSessionRefresh(save, true, true)
  }

  const saveBeforeTabMove = async () => {
    let isSaveComplete = true
    const saveRes = await CommonAxios(getPostConfig(Api.my.company.irBasicSave, vo))
    if (saveRes && saveRes.status === 200) {
      if (saveRes.data.hasOwnProperty('code') && saveRes.data.code !== '200') {
        isSaveComplete = false
      }
    } else {
      isSaveComplete = false
    }
    if (isSaveComplete) {
      exeFunc(checkCloseAlertPopupRef, 'open', AlertLabels.saved)
    } else {
      exeFunc(alertPopRef, 'open', AlertLabels.notSaved)
    }
    return isSaveComplete
  }

  const save = async () => {
    let isSaveComplete = true
    const params = { ...vo, col: String(vo.col).trim() }
    const saveRes = await CommonAxios(getPostConfig(Api.my.company.irBasicSave, params))
    if (saveRes && saveRes.status === 200) {
      if (saveRes.data.hasOwnProperty('code') && saveRes.data.code !== '200') {
        isSaveComplete = false
      }
    } else {
      isSaveComplete = false
    }
    if (isSaveComplete) {
      exeFunc(checkCloseAlertPopupRef, 'open', AlertLabels.saved)
      await loadDataSet()
    } else {
      exeFunc(alertPopRef, 'open', AlertLabels.notSaved)
    }
  }

  const loadDataSet = async () => {
    const resProgress = await loadProgress()
    setProgress(resProgress.progress)

    const resBasicInfo = await loadBasicInfo()
    VoUtils.setVoNullToEmpty(
      resBasicInfo,
      ['cpfnAmt', 'empCnt', 'pvprAmt', 'ttisStcnt'],
      ['utlinsttId', 'investList', 'supportList']
    )

    const companyTypeList = codeContext.actions.getCompanyTypeList()
    if (companyTypeList.length > 0) {
      const companyTypeEmptyItem = {
        comCdId: '',
        comCdNm: '',
        id: SelCmmId.ALL,
        value: '전체'
      }
      companyTypeList.unshift(companyTypeEmptyItem)
    }
    setCompanyTypeSelect({
      selList: companyTypeList,
      selected: resBasicInfo['enprDsncCd']
    })

    resBasicInfo.cnpl =
      resBasicInfo.cnpl.substr(0, 3) + '-' + resBasicInfo.cnpl.substr(3, 4) + '-' + resBasicInfo.cnpl.substr(7, 11)

    setVo(resBasicInfo)
  }

  const loadProgress = async () => {
    const resProgress = await ResponseUtils.getSimpleResponse(Api.my.company.irProgress, null, false)
    return resProgress
  }

  const loadBasicInfo = async () => {
    const basicInfoObjectProperties = [
      'acpr',
      'adr',
      'bnnm',
      'btnm',
      'bzn',
      'cgn',
      'cnpl',
      'col',
      'cpfnAmt',
      'empCnt',
      'enprDsncCd',
      'etvlAmt',
      'hmpgUrlAdr',
      'invmMnyUsus',
      'invmRtrvPlanCon',
      'pvprAmt',
      'rprnm',
      'ttisStcnt',
      'utlinsttId',
      'zpcd'
    ]
    const basicInfoListProperties = ['investList', 'supportList']
    const resBasicInfo = await ResponseUtils.getMultiObjectMultiList(
      Api.my.company.irBasicInfoDetail,
      null,
      basicInfoObjectProperties,
      basicInfoListProperties,
      false
    )
    return resBasicInfo
  }

  const isMounted = useRef(false)

  useEffect(() => {
    if (
      commonContext.state.user.isLoaded &&
      codeContext.state.isLoaded &&
      !commonContext.state.user.isPageMountCheck &&
      !isMounted.current
    ) {
      const body = document.querySelector('body')
      body.classList.remove('popupScrollLock')
      isMounted.current = true
      commonContext.actions.pageMountPathCheck(history, loadDataSet)
    }
  }, [commonContext.state.user, codeContext.state.isLoaded])

  useEffect(() => {
    return () => (isMounted.current = false)
  }, [])

  return (
    <>
      <Header />
      <div className="page_container">
        <div className="wrap mypage_wrap ir_wrap bg02">
          <div className="gallery_logo_wrap">
            <Gallery01 data={galleryData} />
            <ProfileImage />
          </div>

          <BreadCrumbs {...props} />

          <div className="container default_size02">
            {/*section start*/}
            <div className="section section01">
              <div className="section_header writing_wrap">
                <h3 className="section_title">
                  IR 작성<strong className="progress highlight_blue">&#40;{progress}%&#41;</strong>
                </h3>
                <p className="main_writing_title">* 표시항목은 주요 작성사항입니다.</p>
              </div>
              <div className="tab_header">
                <Tab handleTabActive={handleTabList} data={tabList} />
                <div className="btn_group">
                  <Button onClick={onClickCancel}>취소</Button>
                  <Button className={'blue'} onClick={onClickSave}>
                    저장
                  </Button>
                </div>
              </div>
              {/*ir_section_wrap start*/}
              <div className="ir_section_wrap ">
                <div className="ir_basic write">
                  <CardLayout>
                    <h3 className="page_title">
                      {/*2020년 <strong>&#40;주&#41;일루넥스</strong> IR 정보*/}
                      <strong>{commonContext.state.user.info?.name}</strong> IR 정보
                    </h3>
                    {/*section01 start*/}
                    <div className="section section01">
                      <h3 className="ico_title">기본정보</h3>
                      <table className="table type02">
                        <caption>기본정보 테이블</caption>
                        <colgroup>
                          <col width="12%" />
                          <col width="38%" />
                          <col width="12%" />
                          <col width="38%" />
                        </colgroup>
                        <tbody>
                          <tr>
                            <th>기업명</th>
                            <td>
                              <div className="input_wrap">
                                <input
                                  type="text"
                                  title="기업명"
                                  id={'bnnm'}
                                  defaultValue={vo.bnnm}
                                  className={'input'}
                                  placeholder={''}
                                  disabled={true}
                                />
                              </div>
                            </td>
                            <th>기업구분</th>
                            <td>
                              <div className="input_wrap">
                                <Select
                                  title="기업구분"
                                  optList={companyTypeSelect.selList}
                                  selected={companyTypeSelect.selected}
                                  onChange={onChangeCompanyType}
                                />
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <th>사업자등록번호</th>
                            <td>
                              <div className="input_wrap">
                                <input
                                  type="text"
                                  id={'bzn'}
                                  title="사업자등록번호"
                                  defaultValue={StringUtils.bizNum(vo.bzn)}
                                  className={'input'}
                                  placeholder={''}
                                  // onChange={(event) => FormUtils.setVoBizNum(vo, 'bzn', event.target)}
                                  disabled={true}
                                />
                              </div>
                            </td>
                            <th>설립일자</th>
                            <td>
                              <div className="input_wrap datepicker_wrap">
                                <input
                                  type="text"
                                  id={'col'}
                                  title="설립일자"
                                  defaultValue={DateUtils.insertYyyyMmDdDash(vo.col)}
                                  className={'input'}
                                  placeholder={''}
                                  onChange={(event) => onChangeInput(event)}
                                  // disabled={true}
                                  maxLength={8}
                                />
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <th>대표</th>
                            <td>
                              <div className="input_wrap">
                                <input
                                  type="text"
                                  id={'rprnm'}
                                  title="대표자명"
                                  defaultValue={vo.rprnm}
                                  className={'input'}
                                  placeholder={''}
                                  onChange={(event) => onChangeInput(event)}
                                  // disabled={true}
                                />
                              </div>
                            </td>
                            <th>직원 수</th>
                            <td>
                              <div className="input_wrap">
                                <NumberInput
                                  item={vo}
                                  title="직원수"
                                  numberProperty={'empCnt'}
                                  displayValue={vo.empCnt}
                                  maxLength={9}
                                  placeholder={''}
                                />
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <th>업태&#47;업종</th>
                            <td>
                              <div className="input_wrap">
                                <input
                                  type="text"
                                  id={'btnm'}
                                  title="업태/업종"
                                  defaultValue={vo.btnm}
                                  className={'input'}
                                  placeholder={''}
                                  onChange={(event) => onChangeInput(event)}
                                />
                              </div>
                            </td>
                            <th>법인등록번호</th>
                            <td>
                              <div className="input_wrap">
                                <input
                                  type="text"
                                  id={'cgn'}
                                  title="법인등록번호"
                                  defaultValue={StringUtils.corporateNum(vo.cgn)}
                                  className={'input'}
                                  placeholder={''}
                                  // onChange={(event) => FormUtils.setVoCorporateNum(vo, 'cgn', event.target)}
                                  disabled={true}
                                />
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <th>연락처</th>
                            <td>
                              <div className="input_wrap">
                                <input
                                  type="text"
                                  id={'cnpl'}
                                  title="연락처"
                                  defaultValue={vo.cnpl}
                                  className={'input'}
                                  placeholder={''}
                                  onChange={(event) => onChangeInput(event)}
                                  // disabled={true}
                                  maxLength={13}
                                />
                              </div>
                            </td>
                            <th>홈페이지</th>
                            <td>
                              <div className="input_wrap">
                                <input
                                  type="text"
                                  id={'hmpgUrlAdr'}
                                  title="홈페이지"
                                  defaultValue={vo.hmpgUrlAdr}
                                  className={'input'}
                                  placeholder={''}
                                  onChange={(event) => onChangeInput(event)}
                                  // disabled={true}
                                />
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <th>주소</th>
                            <td>
                              <div className="input_wrap">
                                <input
                                  type="text"
                                  id={'adr'}
                                  title="주소"
                                  defaultValue={vo.adr}
                                  className={'input'}
                                  placeholder={''}
                                  onChange={(event) => onChangeInput(event)}
                                  // disabled={true}
                                />
                              </div>
                            </td>
                            <th>&nbsp;</th>
                            <td>&nbsp;</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    {/*section01 end*/}
                    {/*section02 start*/}
                    <div className="section section02">
                      <h3 className="ico_title">주식&#47;자본&#47;투자유치</h3>
                      <table className="table type02">
                        <caption>주식&#47;자본&#47;투자유치 테이블</caption>
                        <colgroup>
                          <col width="12%" />
                          <col width="38%" />
                          <col width="12%" />
                          <col width="38%" />
                        </colgroup>
                        <tbody>
                          <tr>
                            <th>
                              <span className="essen_ico2">*</span>자본금&#40;원&#41;
                            </th>
                            <td>
                              <div className="input_wrap">
                                <NumberInput
                                  item={vo}
                                  title="자본금(원)"
                                  numberProperty={'cpfnAmt'}
                                  displayValue={vo.cpfnAmt}
                                />
                              </div>
                            </td>
                            <th>액면가&#40;원&#41;</th>
                            <td>
                              <div className="input_wrap">
                                <NumberInput
                                  item={vo}
                                  title="액면가(원)"
                                  numberProperty={'pvprAmt'}
                                  displayValue={vo.pvprAmt}
                                />
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <th>총발행주식 수</th>
                            <td>
                              <div className="input_wrap">
                                <NumberInput
                                  item={vo}
                                  title="총발행주식수"
                                  numberProperty={'ttisStcnt'}
                                  displayValue={vo.ttisStcnt}
                                />
                              </div>
                            </td>
                            <th>결산기</th>
                            <td>
                              <div className="input_wrap">
                                <input
                                  type="text"
                                  id={'acpr'}
                                  title="결산기"
                                  defaultValue={vo.acpr}
                                  className={'input'}
                                  placeholder={'결산기는 숫자로 입력해주세요.'}
                                  onChange={(event) => onChangeInput(event)}
                                  maxLength={10}
                                />
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <th>기업가치&#40;원&#41;</th>
                            <td>
                              <div className="input_wrap">
                                <NumberInput
                                  item={vo}
                                  title="기업가치(원)"
                                  numberProperty={'etvlAmt'}
                                  displayValue={vo.etvlAmt}
                                />
                              </div>
                            </td>
                            <th>&nbsp;</th>
                            <td>&nbsp;</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    {/*section02 end*/}
                    {/*section03 start*/}
                    <div className="section section03" style={{ marginBottom: '0px' }}>
                      {/*info_area start*/}
                      <div className="info_area">
                        <div className="info_header">
                          <h4 className="info_title">
                            <span className="essen_ico2">*</span>투자금 사용용도
                          </h4>
                        </div>
                        <div className="info_content">
                          <div className="info_textarea_box">
                            <textarea
                              id={'invmMnyUsus'}
                              title="투자금사용용도"
                              defaultValue={vo.invmMnyUsus}
                              maxLength={500}
                              placeholder=""
                              onChange={(event) => onChangeInput(event)}
                            />
                          </div>
                        </div>
                        <MaxLengthCount
                          ref={invmMnyUsusMaxRef}
                          max={500}
                          defaultCount={String(vo.invmMnyUsus).length}
                        />
                        {/*<MaxCount count={0} max={500} />*/}
                      </div>
                      {/*info_area end*/}
                      {/*info_area start*/}
                      <div className="info_area">
                        <div className="info_header">
                          <h4 className="info_title">
                            <span className="essen_ico2">*</span>EXIT 계획
                          </h4>
                        </div>
                        <div className="info_content">
                          <div className="info_textarea_box">
                            <textarea
                              id={'invmRtrvPlanCon'}
                              title="EXIT계획"
                              defaultValue={vo.invmRtrvPlanCon}
                              maxLength={500}
                              placeholder=""
                              onChange={(event) => onChangeInput(event)}
                            />
                          </div>
                        </div>
                        <MaxLengthCount
                          ref={invmRtrvPlanConMaxRef}
                          max={500}
                          defaultCount={String(vo.invmRtrvPlanCon).length}
                        />
                        {/*<MaxCount count={0} max={500} />*/}
                      </div>
                      <AmountInputForm
                        title={'기존투자유치'}
                        enprTtl={'투자기관'}
                        keyProp={'IrInvestVO'}
                        idProp={'utlinsttId'}
                        pkIdProp={'enprIrrsInfoId'}
                        dateProp={'invmEnmtYm'}
                        nameProp={'invmEnmtEtnm'}
                        seqProp={'invmEnmtSqn'}
                        amountProp={'invmEnmtAmt'}
                        showMonthYearPicker={true}
                        list={vo.investList}
                      />
                      <AmountInputForm
                        title={'지원금(기보/신보/정부)'}
                        enprTtl={'지원기관'}
                        keyProp={'IrInvestVO'}
                        idProp={'utlinsttId'}
                        pkIdProp={'enprIrrsInfoId'}
                        dateProp={'sprnMnyEnmtDt'}
                        nameProp={'sprnInttNm'}
                        seqProp={'sprnMnySqn'}
                        amountProp={'sprnAmt'}
                        showMonthYearPicker={true}
                        list={vo.supportList}
                      />
                    </div>
                    {/*section03 end*/}
                  </CardLayout>
                  <div className="prev_next_wrap">
                    {/*<PrevBtn />*/}
                    <div>&nbsp;</div>
                    <NextBtn onClick={onClickNext} />
                  </div>
                </div>
              </div>
              {/*ir_section_wrap end*/}
            </div>
            {/*section end*/}
          </div>
          <Footer />
        </div>
      </div>
      <AlertPopup ref={alertPopRef} />
      <CheckCloseAlertPopup ref={checkCloseAlertPopupRef} />
      <ConfirmPopup ref={confirmPopRef} onConfirm={onConfirmSave} />
      <MoveTabConfirmPopup
        ref={moveTabConfirmRef}
        // onConfirm={onConfirmMoveTab}
        onConfirm={onConfirmSave}
        onCancel={onCancelMoveTab}
      />
      <MoveTabConfirmPopup ref={moveTabEmptyConfirmRef} onConfirm={onConfirmMoveTabEmpty} />
    </>
  )
}
export default IrBasicWrite
