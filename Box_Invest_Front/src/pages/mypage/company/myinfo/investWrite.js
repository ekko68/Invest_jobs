/** @jsxImportSource @emotion/react */
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'

import Header from 'components/header/Header'
import Footer from 'components/common/Footer'
import Gallery01 from 'components/common/Gallery01'
import BreadCrumbs from 'components/common/BreadCrumbs'
import Button from 'components/atomic/Button'
import CardLayout from 'components/common/card/CardLayout'
import ToggleCheckBox from 'components/atomic/ToggleCheckBox'

import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import ConfirmPopup from 'pageComponents/common/pop/ConfirmPopup'
import ProfileImage from 'pageComponents/mypage/common/ProfileImage'
import CategoryCheckBoxPopup from 'pageComponents/common/pop/CategoryCheckBoxPopup'

import ResponseUtils from 'modules/utils/ResponseUtils'
import Api from 'modules/consts/Api'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import { AlertLabels, CheckYn, UsisType } from 'modules/consts/BizConst'
import ValidateUtils from 'modules/utils/ValidateUtils'
import CommonAxios from 'modules/utils/CommonAxios'
import { getPostConfig } from 'modules/utils/CommonAxios'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import VoUtils from 'modules/utils/VoUtils'
import { exeFunc, setFunc, setPromiseFunc } from 'modules/utils/ReactUtils'
import { createKey, deepCopyByRecursion } from 'modules/utils/CommonUtils'
import { CodeContext } from 'modules/contexts/common/CodeContext'
import CheckCloseCallBackAlertPopup from 'pageComponents/common/pop/CheckCloseCallBackAlertPopup'
import { StringUtils } from 'modules/utils/StringUtils'

const InvestWrite = (props) => {
  const history = useHistory()
  const commonContext = useContext(CommonContext)
  const codeContext = useContext(CodeContext)

  const galleryData = {
    title: '마이페이지',
    img: '/images/gallery02_img1.png'
  }

  let alertPopRef = useRef()
  let confirmPopRef = useRef()
  let checkCloseAlertPopupRef = useRef()
  const [reload, setReload] = useState(false)
  const interestBizPopupRef = useRef()
  const techPopRef = useRef()

  const [vo, setVo] = useState({
    investHope: {
      invmAmtCd: '',
      invmAmtNm: '',
      invmStgCd: '',
      invmStgNm: '',
      oppbYn: CheckYn.NO,
      osivHopeyn: CheckYn.NO,
      utlinsttId: ''
    },
    investFieldList: [],
    utilTechList: []
  })
  const [investStepList, setInvestStepList] = useState([])
  const [investAmountList, setInvestAmountList] = useState([])
  const [oppbYnChk, setOppbYnChk] = useState({ id: 'none_public', value: '비공개', status: false })
  const [osivHopeynChk, setOsivHopeynChk] = useState({ id: 'osiv_hope', value: '비희망', status: false })

  const handleToggleChk = (e) => {
    // const chk = e.target.checked
    // setOppbYnChk({
    //     ...oppbYnChk,
    //     value: chk ? '공개' : '비공개',
    //     status: chk ? true : false
    // })
    // vo.investHope['oppbYn'] = chk ? CHECK_YN.YES : CHECK_YN.NO

    setOppbYnChk({
      ...oppbYnChk,
      value: e.target.checked ? '공개' : '비공개',
      status: e.target.checked ? true : false
    })
    const _vo = deepCopyByRecursion(vo)
    _vo.investHope.oppbYn = e.target.checked ? CheckYn.YES : CheckYn.NO
    setVo(_vo)
  }

  const handleToggleOsivHope = (e) => {
    setOsivHopeynChk({
      ...osivHopeynChk,
      value: e.target.checked ? '희망' : '비희망',
      status: e.target.checked ? true : false
    })
    const _vo = deepCopyByRecursion(vo)
    _vo.investHope.osivHopeyn = e.target.checked ? CheckYn.YES : CheckYn.NO
    setVo(_vo)
  }

  const onChangeOption = (event) => {
    vo.investHope.invmStgNm = event.target.value
    setInvmStgCd()
    setReload(!reload)
  }
  const onChangeOptionIvnmAmtCd = (event) => {
    vo.investHope.invmAmtNm = event.target.value
    setInvmAmtCd()
    setReload(!reload)
  }
  const setInvmStgCd = () => {
    for (let i = 0; i < investStepList.length; i++) {
      const item = investStepList[i]
      if (item.comCdNm === vo.investHope.invmStgNm) {
        vo.investHope.invmStgCd = item.comCdId
        break
      }
    }
  }
  const setInvmAmtCd = () => {
    for (let i = 0; i < investAmountList.length; i++) {
      const item = investAmountList[i]
      if (item.comCdNm === vo.investHope.invmAmtNm) {
        vo.investHope.invmAmtCd = item.comCdId
        break
      }
    }
  }

  const removeInvestFieldListVo = () => {
    const list = []
    for (let i = 0; i < vo.investFieldList.length; i++) {
      const item = vo.investFieldList[i]
      const temp = { ...item }
      delete temp.fileId
      delete temp.id
      delete temp.imgUrl
      delete temp.invmFildCdnm
      delete temp.status
      delete temp.value
      list.push(temp)
    }
    return list
  }
  const removeUtilTechListVo = () => {
    const list = []
    for (let i = 0; i < vo.utilTechList.length; i++) {
      const item = vo.utilTechList[i]
      const temp = { ...item }
      delete temp.id
      delete temp.status
      delete temp.utlzTchnCdnm
      delete temp.value
      list.push(temp)
    }
    return list
  }

  const onAlert = (message) => {
    exeFunc(alertPopRef, 'open', message)
  }
  /**
   * 내정보
   * 관심 비지니스 분야
   */
  const onClickOpenInterestBizPop = () => {
    setFunc(interestBizPopupRef, 'setDataOpen', vo.investFieldList)
  }
  const onCompleteInterestBizSelect = (items) => {
    vo.investFieldList = items
    setReload(!reload)
  }
  /**
   * 투자정보
   * 활용 기술
   */
  const onClickOpenTechPop = () => {
    setFunc(techPopRef, 'setDataOpen', vo.utilTechList)
  }
  const onCompleteTechSelect = (items) => {
    vo.utilTechList = items
    setReload(!reload)
  }

  /** Validation */
  const validateIsEmpty = (showAlert = true) => {
    if (vo.investHope['oppbYn'] === CheckYn.NO) return false
    let r = ValidateUtils.isVoEmpty(vo.investHope, ['invmAmtCd', 'invmStgCd', 'oppbYn'])
    if (r) {
      if (showAlert) {
        exeFunc(alertPopRef, 'open', '공개(노출유무) 일 경우 희망단계와 투자금을 선택하여야 합니다.')
      }
    } else {
      r = false
    }
    return r
  }

  /** Move */

  /** Cancel Button */

  const onClickCancel = async () => {
    history.replace(ROUTER_NAMES.MY_PAGE_COMPANY_INFO)
  }

  /** Save Button */

  const onClickSave = async () => {
    if (validateIsEmpty()) {
      return
    }
    exeFunc(confirmPopRef, 'open', AlertLabels.saveIt)
  }

  /** pop ref confirm */

  const onConfirmSave = async () => {
    await commonContext.actions.callbackAfterSessionRefresh(save, true, true)
    // await save()
  }

  const save = async () => {
    const saveVo = deepCopyByRecursion(vo)
    // todo : 현재 컬럼 제약조건 오류로 invmStgCd 필드에 not null 걸려 임시값 처리
    // 컬럼 제약조건 수정 후 제거할 것!!
    if (!StringUtils.hasLength(saveVo.investHope.invmStgCd)) saveVo.investHope.invmStgCd = ' '

    if (saveVo.investFieldList.length > 0) {
      saveVo.investFieldList = removeInvestFieldListVo()
    }
    if (saveVo.utilTechList.length > 0) {
      saveVo.utilTechList = removeUtilTechListVo()
    }

    console.log(saveVo)

    let isSaveComplete = true
    const saveRes = await CommonAxios(getPostConfig(Api.my.company.investHopeSave, saveVo), false)

    if (saveRes) {
      if (saveRes.status !== 200) {
        isSaveComplete = false
      }
    } else {
      isSaveComplete = false
    }
    if (isSaveComplete) {
      exeFunc(checkCloseAlertPopupRef, 'open', AlertLabels.saved) // '저장되었습니다.'
    } else {
      exeFunc(alertPopRef, 'open', AlertLabels.notSaved)
    }
  }

  /**
   * 관심 비즈니스 분야, 관심기술 리스트 랜더
   */

  const TagItem = ({ item, listName }) => {
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

  const loadInvestInfo = async () => {
    const investInfo = ResponseUtils.getSimpleResponse(Api.my.company.investHopeDetail, null, false)
    return investInfo
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
        const investStepListSelect = codeContext.actions.getInvestStepList()
        if (investStepListSelect.length > 0) {
          const emptyItem = {
            comCdId: '',
            comCdNm: '',
            id: '',
            value: ''
          }
          investStepListSelect.unshift(emptyItem)
        }
        setInvestStepList(investStepListSelect)

        const investAmountListSelect = codeContext.actions.getInvestAmountList()
        if (investAmountListSelect.length > 0) {
          const emptyItem = {
            comCdId: '',
            comCdNm: '',
            id: '',
            value: ''
          }
          investAmountListSelect.unshift(emptyItem)
        }
        setInvestAmountList(investAmountListSelect)

        const investInfo = await loadInvestInfo()
        if (investInfo.investHope.oppbYn === null) {
          investInfo.investHope.oppbYn = CheckYn.NO
        }
        if (investInfo.investHope.osivHopeyn === null) {
          investInfo.investHope.osivHopeyn = CheckYn.NO
        }
        VoUtils.setVoNullToEmpty(investInfo.investHope)
        if (investInfo.investFieldList.length > 0) {
          for (let i = 0; i < investInfo.investFieldList.length; i++) {
            const item = investInfo.investFieldList[i]
            item['id'] = item['invmFildCd']
            item['value'] = item['invmFildNm']
          }
        }
        if (investInfo.utilTechList.length > 0) {
          for (let i = 0; i < investInfo.utilTechList.length; i++) {
            const item = investInfo.utilTechList[i]
            item['id'] = item['utlzTchnCd']
            item['value'] = item['utlzTchnNm']
          }
        }
        setVo(investInfo)
        setOppbYnChk({
          ...oppbYnChk,
          value: investInfo.investHope['oppbYn'] === CheckYn.YES ? '공개' : '비공개',
          status: investInfo.investHope['oppbYn'] === CheckYn.YES ? true : false
        })

        setOsivHopeynChk({
          ...osivHopeynChk,
          value: investInfo.investHope?.osivHopeyn === CheckYn.YES ? '희망' : '비희망',
          status: investInfo.investHope?.osivHopeyn === CheckYn.YES ? true : false
        })
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
        <div className="wrap mypage_wrap info_wrap write company bg02">
          <div className="gallery_logo_wrap">
            <Gallery01 data={galleryData} />
            <ProfileImage />
          </div>
          <BreadCrumbs {...props} />
          <div className="container default_size02">
            {/*section02 start*/}
            <div className="section section03">
              <div className="section_header">
                <h3 className="section_title">투자희망</h3>
                <div className="btn_group">
                  <Button onClick={onClickCancel}>취소</Button>
                  <Button className={'blue'} onClick={onClickSave}>
                    저장
                  </Button>
                </div>
              </div>
              <CardLayout>
                <div className="invest_info_wrap">
                  <div className="card_header">
                    <h3 className="ico_title title">단계 및 금액</h3>
                  </div>
                  <div className="prod_content">
                    <div className="prod_inner hope">
                      <div className="info_table ">
                        <table className="table type03">
                          <caption>투자희망 수정 테이블</caption>
                          <colgroup>
                            <col width={'12%'} />
                            <col width={'38%'} />
                            <col width={'12%'} />
                            <col width={'38%'} />
                          </colgroup>
                          <tbody>
                            <tr>
                              <th>노출유무</th>
                              <td colSpan={3}>
                                <ToggleCheckBox
                                  className="theme_blue"
                                  title="노출유무"
                                  data={oppbYnChk}
                                  onChange={handleToggleChk}
                                />
                              </td>
                            </tr>
                            <tr>
                              <th>희망단계</th>
                              <td>
                                <select
                                  className="select"
                                  title="희망단계"
                                  value={vo.investHope['invmStgNm']}
                                  onChange={(event) => onChangeOption(event)}
                                >
                                  {investStepList?.map((item, i) => (
                                    <option value={item['comCdNm']} key={createKey()} id={item['comCdId']}>
                                      {item['comCdNm']}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <th>투자금(원)</th>
                              <td>
                                <p className="input_wrap">
                                  <select
                                    className="select"
                                    title="투자금"
                                    value={vo.investHope['invmAmtNm']}
                                    onChange={(event) => onChangeOptionIvnmAmtCd(event)}
                                  >
                                    {investAmountList?.map((item, i) => (
                                      <option value={item['comCdNm']} key={createKey()} id={item['comCdId']}>
                                        {item['comCdNm']}
                                      </option>
                                    ))}
                                  </select>
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="invest_info_wrap category">
                  <div className="card_header">
                    <h3 className="ico_title title">분야 및 기술</h3>
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
                              <th>비즈니스 분야</th>
                              <td>
                                <ul className="tag_box_list edit">
                                  {vo?.investFieldList?.map((item, i) => (
                                    <TagItem item={item} listName={'investFieldList'} idx={i} key={createKey()} />
                                  ))}
                                  <li className="tag_box_item add_tag">
                                    {vo.investFieldList !== null && vo.investFieldList.length < 5 && (
                                      <Button className={'dashed blue linear'} onClick={onClickOpenInterestBizPop}>
                                        <span className="ico_add_right">추가</span>
                                      </Button>
                                    )}
                                  </li>
                                </ul>
                              </td>
                              <th>관심기술</th>
                              <td>
                                <ul className="tag_box_list edit">
                                  {vo?.utilTechList?.map((item, i) => (
                                    <TagItem item={item} listName={'utilTechList'} idx={i} key={createKey()} />
                                  ))}
                                  <li className="tag_box_item add_tag">
                                    {vo.utilTechList !== null && vo.utilTechList.length < 5 && (
                                      <Button className={'dashed blue linear'} onClick={onClickOpenTechPop}>
                                        <span className="ico_add_right">추가</span>
                                      </Button>
                                    )}
                                  </li>
                                </ul>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="invest_info_wrap category">
                  <div className="card_header">
                    <h3 className="ico_title title">해외 투자</h3>
                  </div>
                  <div className="prod_content">
                    <div className="prod_inner hope">
                      <div className="info_table ">
                        <table className="table type03">
                          <caption>해외투자 희망 수정 테이블</caption>
                          <colgroup>
                            <col width={'12%'} />
                            <col width={'38%'} />
                            <col width={'12%'} />
                            <col width={'38%'} />
                          </colgroup>
                          <tbody>
                            <tr>
                              <th>해외투자 희망여부</th>
                              <td colSpan={3}>
                                <ToggleCheckBox
                                  className="theme_blue"
                                  title="노출유무"
                                  data={osivHopeynChk}
                                  onChange={handleToggleOsivHope}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </CardLayout>
            </div>
            {/*section02 end*/}
          </div>
          <Footer />
        </div>
      </div>

      <CategoryCheckBoxPopup
        ref={interestBizPopupRef}
        onAlert={onAlert}
        onComplete={onCompleteInterestBizSelect}
        title={'비즈니스 분야'}
        getCodeContextFunc={codeContext.actions.getCategoryList}
      />

      <CategoryCheckBoxPopup
        ref={techPopRef}
        onAlert={onAlert}
        onComplete={onCompleteTechSelect}
        title={'관심기술'}
        getCodeContextFunc={codeContext.actions.getTechList}
      />

      <AlertPopup ref={alertPopRef} />
      <CheckCloseCallBackAlertPopup
        ref={checkCloseAlertPopupRef}
        callBack={() => history.push(ROUTER_NAMES.MY_PAGE_COMPANY_INFO)}
      />
      <ConfirmPopup ref={confirmPopRef} onConfirm={onConfirmSave} />
    </>
  )
}
export default InvestWrite
