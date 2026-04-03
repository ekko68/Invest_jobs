/** @jsxImportSource @emotion/react */
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'

import Header from 'components/header/Header'
import Footer from 'components/common/Footer'
import Gallery01 from 'components/common/Gallery01'
import BreadCrumbs from 'components/common/BreadCrumbs'
import Button from 'components/atomic/Button'
import CardLayout from 'components/common/card/CardLayout'
import Select from 'components/atomic/Select'

import ROUTER_NAMES from 'modules/consts/RouterConst'
import { exeFunc, getFunc, setFunc } from 'modules/utils/ReactUtils'

import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import MaxLengthCount from 'pageComponents/common/number/MaxLengthCount'
import ConfirmPopup from 'pageComponents/common/pop/ConfirmPopup'
import TagForm from 'pageComponents/common/TagForm'
import CheckCloseAlertPopup from 'pageComponents/common/pop/CheckCloseAlertPopup'
import ProfileImage from 'pageComponents/mypage/common/ProfileImage'
import CategoryCheckBoxPopup from 'pageComponents/common/pop/CategoryCheckBoxPopup'

import ResponseUtils from 'modules/utils/ResponseUtils'
import Api from 'modules/consts/Api'
import DateUtils from 'modules/utils/DateUtils'
import NumberInput from 'pageComponents/common/number/NumberInput'
import VoUtils from 'modules/utils/VoUtils'
import { AlertLabels, UsisType } from 'modules/consts/BizConst'
import CommonAxios from 'modules/utils/CommonAxios'
import { getPostConfig } from 'modules/utils/CommonAxios'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import { createKey, deepCopyByRecursion } from 'modules/utils/CommonUtils'
import { CodeContext } from 'modules/contexts/common/CodeContext'
import CheckCloseCallBackAlertPopup from 'pageComponents/common/pop/CheckCloseCallBackAlertPopup'
import { StringUtils } from 'modules/utils/StringUtils'
import { isNumber } from 'modules/utils/NumberUtils'

const InfoWrite = (props) => {
  const history = useHistory()
  const commonContext = useContext(CommonContext)
  const codeContext = useContext(CodeContext)

  const galleryData = {
    title: '마이페이지',
    img: '/images/gallery02_img1.png'
  }

  const ivstInterestBizPopupRef = useRef()
  const techPopRef = useRef()
  const investStepPopRef = useRef()
  const investRegionPopRef = useRef()

  const alertPopRef = useRef()
  const maxLengthCountRef = useRef()
  const confirmPopRef = useRef()
  const interestRef = useRef()
  const checkCloseAlertPopupRef = useRef()

  const [vo, setVo] = useState({
    basicData: {
      addr: '',
      bplcNm: '',
      bsunDwarCd: '',
      bsunDwarNm: '',
      cnrnFildList: [],
      crewRtrv: '',
      empCnt: 0,
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
      yearCnt: 0,
      reprsntFxnum: '',
      fondDe: '',
      invmexntRapLmtnMnct: 12
    },
    investAmount: { utlinsttId: '', invmAmtCd: '', invmAmtNm: '' },
    investFieldList: [],
    investStepList: [],
    utilTechList: [],
    investRegionList: [],
    convertInfo: {}
  })
  const [investAmountList, setInvestAmountList] = useState({
    selected: '',
    selList: []
  })
  const [reapplyRefuseList, setReapplyRefuseList] = useState({
    selected: '12',
    selList: [
      { id: '1', value: '-- 1개월 --' },
      { id: '2', value: '-- 2개월 --' },
      { id: '3', value: '-- 3개월 --' },
      { id: '4', value: '-- 4개월 --' },
      { id: '5', value: '-- 5개월 --' },
      { id: '6', value: '-- 6개월 --' },
      { id: '7', value: '-- 7개월 --' },
      { id: '8', value: '-- 8개월 --' },
      { id: '9', value: '-- 9개월 --' },
      { id: '10', value: '-- 10개월 --' },
      { id: '11', value: '-- 11개월 --' },
      { id: '12', value: '-- 12개월 --' }
    ]
  })

  const [vcTypeList, setVcTypeList] = useState([])

  const onAlert = (message) => {
    setFunc(alertPopRef, 'open', message)
  }

  const categoryCheckBoxCompleteFunc = (items, voListFieldNm = '') => {
    const _vo = deepCopyByRecursion(vo)
    _vo[voListFieldNm] = items
    setVo(_vo)
  }

  /** Cancel Button */

  const onClickCancel = async () => {
    history.replace(ROUTER_NAMES.MY_PAGE_INVESTOR_INFO)
  }

  /** Save Button */

  const onClickSave = async () => {
    await commonContext.actions.callbackAfterSessionRefresh(
      async () => {
        exeFunc(confirmPopRef, 'open', '저장 하시겠습니까?')
      },
      true,
      true
    )
  }

  /** pop ref confirm */

  const onConfirmSave = async () => {
    await commonContext.actions.callbackAfterSessionRefresh(save, true, true)
    // await save()
  }

  const save = async () => {
    const _cnrnFildList = getFunc(interestRef, 'getData')
    const _investAmount = investAmountList.selList.find((e) => e.comCdId === investAmountList.selected)

    const saveVo = {
      ...vo,
      basicData: {
        ...vo.basicData,
        invmexntRapLmtnMnct: Number(reapplyRefuseList.selected),
        cnrnFildList: _cnrnFildList?.map((item) => {
          const _item = deepCopyByRecursion(item)
          delete _item.rowNumber
          return _item
        })
      },
      investAmount: {
        ...vo.investAmount,
        invmAmtCd: StringUtils.hasLength(_investAmount?.comCdId) ? _investAmount.comCdId : '',
        invmAmtNm: StringUtils.hasLength(_investAmount?.comCdNm) ? _investAmount.comCdNm : ''
      },
      investStepList: vo.investStepList?.map((item) => {
        const _item = deepCopyByRecursion(item)
        _item.invmStgCd = _item.id
        return _item
      }),
      investRegionList: vo.investRegionList?.map((item) => {
        const _item = deepCopyByRecursion(item)
        _item.invmAreaCdId = _item.id
        return _item
      })
    }

    let isSaveComplete = true
    const saveRes = await CommonAxios(getPostConfig(Api.my.vc.basicInfoSave, saveVo))
    if (saveRes && saveRes.status === 200) {
      if (saveRes.data.hasOwnProperty('code') && saveRes.data.code !== '200') {
        isSaveComplete = false
      }
    } else {
      isSaveComplete = false
    }
    if (isSaveComplete) {
      exeFunc(checkCloseAlertPopupRef, 'open', AlertLabels.saved) // '저장되었습니다.'
      // await loadBasicData()
    } else {
      exeFunc(alertPopRef, 'open', AlertLabels.notSaved) // '저장되지 않았습니다. 관리자에게 문의하세요'
    }
    return isSaveComplete
  }

  /** List Render Component */

  const TagItem = ({ item, listName, index }) => {
    return (
      <li className="tag_box_item">
        {item['value']}
        <button className="ico_delete" onClick={() => onClickRemoveTagListItem(item, listName)}>
          <span className="hide">삭제</span>
        </button>
      </li>
    )
  }

  const onClickRemoveTagListItem = (item, listName) => {
    const tempList = [...vo[String(listName)]]
    const tempVo = { ...vo }
    tempVo[String(listName)] = tempList.filter((e) => e.id !== item.id)
    setVo(tempVo)
  }

  const loadBasicInfo = async () => {
    const resBasicInfo = await ResponseUtils.getSimpleResponse(Api.my.vc.basicInfoDetail)
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
      isMounted.current = true
      commonContext.actions.pageMountPathCheck(history, async () => {
        const vcTypeListData = codeContext.actions.getVcTypeList()
        if (vcTypeListData.length > 0) {
          const emptyIem = {
            comCdId: '',
            comCdNm: '',
            id: '',
            value: ''
          }
          vcTypeListData.unshift(emptyIem)
        }
        setVcTypeList(vcTypeListData)

        const resBasicInfo = await loadBasicInfo()
        VoUtils.setVoNullToEmpty(resBasicInfo.basicData, ['empCnt', 'yearCnt'])
        VoUtils.setVoNullToEmpty(resBasicInfo.investAmount)
        VoUtils.setListVoNullToEmpty(resBasicInfo.investFieldList, ['ivflSqn'])
        VoUtils.setListVoNullToEmpty(resBasicInfo.investStepList)
        VoUtils.setListVoNullToEmpty(resBasicInfo.utilTechList, ['utlzTchnSqn'])
        if (resBasicInfo.investFieldList.length > 0) {
          for (let i = 0; i < resBasicInfo.investFieldList.length; i++) {
            const item = resBasicInfo.investFieldList[i]
            item['id'] = item['invmFildCd']
            item['value'] = item['invmFildNm']
          }
        }
        if (resBasicInfo.investStepList.length > 0) {
          for (let i = 0; i < resBasicInfo.investStepList.length; i++) {
            const item = resBasicInfo.investStepList[i]
            item['id'] = item['invmStgCd']
            item['value'] = item['invmStgNm']
          }
        }
        if (resBasicInfo.utilTechList.length > 0) {
          for (let i = 0; i < resBasicInfo.utilTechList.length; i++) {
            const item = resBasicInfo.utilTechList[i]
            item['id'] = item['utlzTchnCd']
            item['value'] = item['utlzTchnNm']
          }
        }
        if (resBasicInfo.investRegionList.length > 0) {
          for (let i = 0; i < resBasicInfo.investRegionList.length; i++) {
            const item = resBasicInfo.investRegionList[i]
            item['id'] = item['invmAreaCdId']
            item['value'] = item['invmAreaCdNm']
          }
        }
        if (isNumber(resBasicInfo.basicData?.invmexntRapLmtnMnct)) {
          const _reapplyRefuseList = deepCopyByRecursion(reapplyRefuseList)
          _reapplyRefuseList.selected = String(resBasicInfo.basicData.invmexntRapLmtnMnct)
          setReapplyRefuseList(_reapplyRefuseList)
        }

        setVo(resBasicInfo)

        const investAmountListSelect = codeContext.actions.getInvestAmountList()
        if (investAmountListSelect.length > 0) {
          const emptyIem = {
            comCdId: '',
            comCdNm: '',
            id: '',
            value: '선택'
          }
          investAmountListSelect.unshift(emptyIem)
        }
        setInvestAmountList({
          selList: investAmountListSelect,
          selected: resBasicInfo.investAmount.invmAmtCd
        })

        if (resBasicInfo.basicData.cnrnFildList.length > 0) {
          for (let i = 0; i < resBasicInfo.basicData.cnrnFildList.length; i++) {
            const item = resBasicInfo.basicData.cnrnFildList[i]
            item['rowNumber'] = i
          }
        }
        setFunc(interestRef, 'setData', resBasicInfo.basicData.cnrnFildList)
      })
    }
  }, [commonContext.state.user, codeContext.state.isLoaded])

  useEffect(() => {
    return () => (isMounted.current = false)
  }, [])

  return (
    <>
      <Header />
      <div className="page_container">
        <div className="wrap mypage_wrap info_wrap write investor bg02">
          <div className="gallery_logo_wrap">
            <Gallery01 data={galleryData} />
            <ProfileImage />
          </div>
          <BreadCrumbs {...props} />
          <div className="container default_size02">
            {/*section01 start*/}
            <div className="section section01">
              <div className="section_header">
                <h3 className="section_title"> 내 정보</h3>
                <div className="btn_group">
                  <Button onClick={onClickCancel}>취소</Button>
                  <Button className={'blue'} onClick={onClickSave}>
                    저장
                  </Button>
                </div>
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
                          <td>
                            <div className="input_wrap">
                              <input
                                type="text"
                                title="투자사명"
                                className={'input'}
                                disabled={true}
                                defaultValue={vo.basicData.bplcNm}
                              />
                            </div>
                          </td>
                          <th>대표번호</th>
                          <td>
                            <div className="input_wrap">
                              <input
                                type="text"
                                title="대표번호"
                                className={'input'}
                                disabled={true}
                                defaultValue={vo.basicData.reprsntTelno}
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
                                title="대표"
                                className={'input'}
                                disabled={true}
                                defaultValue={vo.basicData.rprsntvNm}
                              />
                            </div>
                          </td>
                          <th>팩스번호</th>
                          <td>
                            <div className="input_wrap">
                              <input
                                type="text"
                                title="팩스번호"
                                className={'input'}
                                disabled={true}
                                defaultValue={vo.basicData.rprsntvNm}
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <th>설립일</th>
                          <td>
                            <div className="input_wrap">
                              <input
                                type="text"
                                title="설립일"
                                className={'input'}
                                disabled={true}
                                defaultValue={DateUtils.insertYyyyMmDdDash(vo.basicData.fondDe)}
                              />
                            </div>
                          </td>
                          <th>이메일</th>
                          <td>
                            <div className="input_wrap">
                              <input
                                type="text"
                                title="이메일"
                                className={'input'}
                                disabled={true}
                                defaultValue={vo.basicData.reprsntEmail}
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <th>투자유형</th>
                          <td>
                            <div className="input_wrap">
                              {/*<input type="text" className={'input'} defaultValue={vo.basicData.invmCmpPtrnNm} />*/}
                              <Select
                                optList={vcTypeList}
                                title="투자유형"
                                selected={vo.basicData.invmCmpPtrnCd}
                                onChange={(e) => {
                                  const _vo = deepCopyByRecursion(vo)
                                  _vo.basicData.invmCmpPtrnCd = e.target.value
                                  setVo(_vo)
                                }}
                              />
                            </div>
                          </td>
                          <th>직원수</th>
                          <td>
                            <div className="input_wrap">
                              {/*<input type="number" className={'input'} defaultValue={vo.basicData.empCnt}/>*/}
                              <NumberInput
                                item={vo.basicData}
                                title="직원수"
                                numberProperty={'empCnt'}
                                displayValue={vo.basicData.empCnt}
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
                                title="주소"
                                className={'input'}
                                disabled={true}
                                defaultValue={
                                  (vo.basicData.postNo === null ||
                                  vo.basicData.postNo === undefined ||
                                  String(vo.basicData.postNo).trim() === ''
                                    ? ''
                                    : '(' + vo.basicData.postNo + ') ') + vo.basicData.addr
                                }
                              />
                            </div>
                          </td>
                          <th>홈페이지</th>
                          <td>
                            <div className="input_wrap">
                              <input
                                type="text"
                                title="홈페이지"
                                className={'input'}
                                disabled={true}
                                defaultValue={vo.basicData.hmpgAdres}
                              />
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <th>관심분야</th>
                          <td colSpan={3}>
                            <TagForm
                              ref={interestRef}
                              title="관심분야"
                              property={'cnrnFildNm'}
                              placeholder={'관심분야'}
                              maxCount={5}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                {/*basic_wrap end*/}
                <div className="invest_info_wrap investor category">
                  <div className="card_header">
                    <h3 className="ico_title title">투자정보</h3>
                  </div>
                  <div className="prod_content">
                    <div className="prod_inner hope">
                      <div className="info_table ">
                        <table className="table type03">
                          <caption>투자희망 분야 및 기술 수정 테이블</caption>
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
                                <ul className="tag_box_list edit">
                                  {vo?.investFieldList?.map((item, idx) => (
                                    <TagItem item={item} index={idx} listName={'investFieldList'} key={createKey()} />
                                  ))}
                                  {vo?.investFieldList?.length < 5 && (
                                    <li className="tag_box_item add_tag">
                                      <Button
                                        className={'dashed blue linear'}
                                        onClick={() =>
                                          setFunc(ivstInterestBizPopupRef, 'setDataOpen', vo.investFieldList)
                                        }
                                      >
                                        <span className="ico_add_right">추가</span>
                                      </Button>
                                    </li>
                                  )}
                                </ul>
                              </td>
                              <th>관심기술</th>
                              <td>
                                <ul className="tag_box_list edit">
                                  {vo?.utilTechList?.map((item, idx) => (
                                    <TagItem item={item} index={idx} listName={'utilTechList'} key={createKey()} />
                                  ))}
                                  {vo?.utilTechList?.length < 5 && (
                                    <li className="tag_box_item add_tag">
                                      <Button
                                        className={'dashed blue linear'}
                                        onClick={() => setFunc(techPopRef, 'setDataOpen', vo.utilTechList)}
                                      >
                                        <span className="ico_add_right">추가</span>
                                      </Button>
                                    </li>
                                  )}
                                </ul>
                              </td>
                            </tr>
                            <tr>
                              <th>주요 투자 단계</th>
                              <td>
                                <ul className="tag_box_list edit">
                                  {vo?.investStepList?.map((item, idx) => (
                                    <TagItem item={item} index={idx} listName={'investStepList'} key={createKey()} />
                                  ))}
                                  {vo?.investStepList?.length < 5 && (
                                    <li className="tag_box_item add_tag">
                                      <Button
                                        className={'dashed blue linear'}
                                        onClick={() => setFunc(investStepPopRef, 'setDataOpen', vo.investStepList)}
                                      >
                                        <span className="ico_add_right">추가</span>
                                      </Button>
                                    </li>
                                  )}
                                </ul>
                              </td>
                              <th>투자 금액 범위</th>
                              <td>
                                <Select
                                  optList={investAmountList.selList}
                                  title="투자금액범위"
                                  selected={investAmountList.selected}
                                  onChange={(event) => {
                                    const _investAmountList = deepCopyByRecursion(investAmountList)
                                    _investAmountList.selected = event.target.value
                                    setInvestAmountList(_investAmountList)
                                  }}
                                />
                              </td>
                            </tr>
                            <tr>
                              <th>주요 투자 지역</th>
                              <td>
                                <ul className="tag_box_list edit">
                                  {vo?.investRegionList?.map((item, idx) => (
                                    <TagItem item={item} index={idx} listName={'investRegionList'} key={createKey()} />
                                  ))}
                                  {vo?.investRegionList?.length < 5 && (
                                    <li className="tag_box_item add_tag">
                                      <Button
                                        className={'dashed blue linear'}
                                        onClick={() => setFunc(investRegionPopRef, 'setDataOpen', vo.investRegionList)}
                                      >
                                        <span className="ico_add_right">추가</span>
                                      </Button>
                                    </li>
                                  )}
                                </ul>
                              </td>
                              <th>투자 재신청 허용기간</th>
                              <td>
                                <Select
                                  optList={reapplyRefuseList.selList}
                                  title="투자금액범위"
                                  selected={reapplyRefuseList.selected}
                                  onChange={(event) => {
                                    const _reapplyRefuseList = deepCopyByRecursion(reapplyRefuseList)
                                    _reapplyRefuseList.selected = event.target.value
                                    setReapplyRefuseList(_reapplyRefuseList)
                                  }}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                {/*introduce_wrap start*/}
                <div className="introduce_wrap info_section">
                  <div className="card_header">
                    <h3 className="ico_title title">소개</h3>
                  </div>
                  <div className="introduce_text">
                    <textarea
                      id={'enprInrdCon'}
                      title="소개내용"
                      className={'textarea'}
                      maxLength={500}
                      defaultValue={vo.basicData.enprInrdCon}
                      onChange={(event) => {
                        event.target.value = StringUtils.cutStrByLimit(event.target.value, 500)
                        const _vo = deepCopyByRecursion(vo)
                        _vo.basicData.enprInrdCon = event.target.value
                        setVo(_vo)
                      }}
                    />
                    <div className="max_count_wrap">
                      <MaxLengthCount
                        ref={maxLengthCountRef}
                        max={500}
                        defaultCount={String(vo.basicData.enprInrdCon).length}
                      />
                    </div>
                  </div>
                </div>
                {/*introduce_wrap end*/}
              </CardLayout>
            </div>
            {/*section01 end*/}
          </div>
          <Footer />
        </div>
      </div>

      <CategoryCheckBoxPopup
        ref={ivstInterestBizPopupRef}
        onAlert={onAlert}
        onComplete={(items) => categoryCheckBoxCompleteFunc(items, 'investFieldList')}
        title={'관심 비즈니스 분야'}
        getCodeContextFunc={codeContext.actions.getCategoryList}
      />

      <CategoryCheckBoxPopup
        ref={techPopRef}
        onAlert={onAlert}
        onComplete={(items) => categoryCheckBoxCompleteFunc(items, 'utilTechList')}
        title={'관심기술'}
        getCodeContextFunc={codeContext.actions.getTechList}
      />

      <CategoryCheckBoxPopup
        ref={investStepPopRef}
        onAlert={onAlert}
        onComplete={(items) => categoryCheckBoxCompleteFunc(items, 'investStepList')}
        title={'주요 투자 단계'}
        getCodeContextFunc={codeContext.actions.getInvestStepList}
      />

      <CategoryCheckBoxPopup
        ref={investRegionPopRef}
        onAlert={onAlert}
        onComplete={(items) => categoryCheckBoxCompleteFunc(items, 'investRegionList')}
        title={'주요 투자 지역'}
        getCodeContextFunc={codeContext.actions.getRegionList}
      />

      <AlertPopup ref={alertPopRef} />
      <ConfirmPopup ref={confirmPopRef} onConfirm={onConfirmSave} />
      <CheckCloseCallBackAlertPopup
        ref={checkCloseAlertPopupRef}
        callBack={() => history.push(ROUTER_NAMES.MY_PAGE_INVESTOR_INFO)}
      />
    </>
  )
}
export default InfoWrite
