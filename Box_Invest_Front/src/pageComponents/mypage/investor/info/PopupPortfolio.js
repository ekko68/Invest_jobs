import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'

import PopupHeader from 'components/popups/PopupHeader'
import PopupFooter from 'components/popups/PopupFooter'
import Button from 'components/atomic/Button'
import Calendar from 'components/atomic/Calendar'
import ToggleCheckBox from 'components/atomic/ToggleCheckBox'
import Select from 'components/atomic/Select'

import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import ConfirmPopup from 'pageComponents/common/pop/ConfirmPopup'
import CheckCloseCallBackAlertPopup from 'pageComponents/common/pop/CheckCloseCallBackAlertPopup'

import Api from 'modules/consts/Api'
import CommonAxios from 'modules/utils/CommonAxios'
import { exeFunc } from 'modules/utils/ReactUtils'
import { AlertLabels, CheckYn, FileUploadExtOpt, FileUploadSizeOpt } from 'modules/consts/BizConst'
import DateUtils from 'modules/utils/DateUtils'
import FormUtils from 'modules/utils/FormUtils'
import { getPostConfig } from 'modules/utils/CommonAxios'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import { StringUtils } from 'modules/utils/StringUtils'
import { CodeContext } from 'modules/contexts/common/CodeContext'
import { NumInput } from 'pageComponents/common/number/NumInput'

const PopupPortfolio = forwardRef((props, ref) => {
  const commonContext = useContext(CommonContext)
  const codeContext = useContext(CodeContext)

  const alertPopupRef = useRef()
  const autoCloseCallbackAlertPopupRef = useRef()
  const confirmSavePopupRef = useRef()
  const confirmDeletePopupRef = useRef()
  const confirmCancelPopupRef = useRef()

  const [isOpen, setIsOpen] = useState(false)
  const [vo, setVo] = useState({
    utlinsttId: '',
    prtfId: '',
    fileId: '',
    invmEnprNm: '',
    invmFildCd: '',
    invmFildNm: '',
    utlzTchnCd: '',
    utlzTchnNm: '',
    oppbYn: CheckYn.NO,
    invmStgCd: '',
    invmStgNm: '',
    invmAmt: 0,
    invmPrfrDt: ''
  })
  const [investBizList, setInvestBizList] = useState([{ id: '', value: '' }])
  const [utilTechList, setUtilTechList] = useState([{ id: '', value: '' }])
  const [investStepList, setInvestStepList] = useState([{ id: '', value: '' }])
  const [toggleChk, setToggleChk] = useState({ id: 'toggleChk01', value: '비활성화', status: false })

  useImperativeHandle(ref, () => ({
    // setData,
    open,
    close
  }))

  const open = (item) => {
    if (item) {
      const toggle = item.oppbYn && item.oppbYn === CheckYn.YES ? true : false
      setVo({ ...item })
      setToggleChk({ id: 'toggleChk01', value: toggle ? '활성화' : '비활성화', status: toggle })
    }
    setIsOpen(true)
    document.body.classList.add('popupScrollLock')
  }

  const close = () => {
    setVo({
      utlinsttId: '',
      prtfId: '',
      fileId: '',
      imgUrl: '',
      invmEnprNm: '',
      invmFildCd: '',
      invmFildNm: '',
      utlzTchnCd: '',
      utlzTchnNm: '',
      oppbYn: CheckYn.NO,
      invmStgCd: '',
      invmStgNm: '',
      invmAmt: 0,
      invmPrfrDt: ''
    })
    setToggleChk({ id: 'toggleChk01', value: '비활성화', status: false })
    setIsOpen(false)
    document.body.classList.remove('popupScrollLock')
  }

  const handleToggleChk = (e) => {
    setToggleChk({
      ...toggleChk,
      value: e.target.checked ? '활성화' : '비활성화',
      status: !toggleChk.status
    })
    setVo({
      ...vo,
      oppbYn: e.target.checked ? CheckYn.YES : CheckYn.NO
    })
  }

  const onClickSave = () => {
    if (String(vo.invmEnprNm).trim() === '') {
      exeFunc(alertPopupRef, 'open', '기업명을 입력해주세요.')
      return
    }
    if (String(vo.invmFildCd).trim() === '') {
      exeFunc(alertPopupRef, 'open', '비즈니스 분야를 선택해 주세요.')
      return
    }
    if (String(vo.utlzTchnCd).trim() === '') {
      exeFunc(alertPopupRef, 'open', '관심기술을 선택해 주세요.')
      return
    }
    if (String(vo.invmPrfrDt).trim() === '') {
      exeFunc(alertPopupRef, 'open', '투자일자를 입력해주세요.')
      return
    }
    if (vo.oppbYn === CheckYn.YES) {
      if (String(vo.invmStgCd).trim() === '') {
        exeFunc(alertPopupRef, 'open', '투자단계를 입력해주세요.')
        return
      }
    }
    exeFunc(confirmSavePopupRef, 'open', AlertLabels.saveIt)
  }

  const save = async () => {
    const saveRes = await CommonAxios(getPostConfig(Api.my.vc.portfolioSave, vo), false)
    if (saveRes && saveRes.status === 200) {
      exeFunc(autoCloseCallbackAlertPopupRef, 'open', AlertLabels.saved)
    } else {
      exeFunc(alertPopupRef, 'open', AlertLabels.askAdmin)
    }
  }

  const autoCloseCallBack = () => {
    close()
    if (props.onRefresh) {
      props.onRefresh()
    }
  }

  const isMountedRef = useRef(false)

  useEffect(() => {
    if (codeContext.state.isLoaded && !isMountedRef.current) {
      isMountedRef.current = true

      const resInvestBizList = codeContext.actions.getCategoryList()
      const resUtilTechList = codeContext.actions.getTechList()
      const resInvestStepList = codeContext.actions.getInvestStepList()

      if (resInvestBizList) {
        setInvestBizList([{ id: '', value: '' }, ...resInvestBizList])
      }
      if (resUtilTechList) {
        setUtilTechList([{ id: '', value: '' }, ...resUtilTechList])
      }
      if (resInvestStepList) {
        const item = resInvestStepList.splice(5, 1)
        resInvestStepList.splice(6, 0, item[0])
        setInvestStepList([{ id: '', value: '' }, ...resInvestStepList])
      }
    }
  }, [codeContext.state.isLoaded])

  return (
    <>
      {isOpen && (
        <>
          <div className="popup_wrap popup_portfolio_update">
            <div className="popup_layout">&nbsp;</div>
            <div className="popup_container scroll ">
              <PopupHeader title={'포트폴리오 등록/수정'} handlePopup={close} className="popup_header" />
              <div className="popup_content mypage_wrap info_wrap portfolio_info_wrap">
                <div className="portfolio_content">
                  <table className="table type02">
                    <caption>포트폴리오 등록/수정</caption>
                    <colgroup>
                      <col width={'*'} />
                      <col width={'20%'} />
                      <col width={'15%'} />
                      <col width={'15%'} />
                      <col width={'15%'} />
                      <col width={'15%'} />
                      <col width={'10%'} />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>기업명</th>
                        <th>비즈니스 분야</th>
                        <th>관심기술</th>
                        <th>투자단계</th>
                        <th>투자금액</th>
                        <th>투자년월</th>
                        <th>공개여부</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div className="ci_logo_wrap">
                            <div className="update_wrap">
                              <input
                                type="file"
                                title="기업로고파일"
                                name="file"
                                multiple={false}
                                id="portfolioImageInput"
                                accept={FileUploadExtOpt.IMAGE.str}
                                style={{ display: 'none' }}
                              />
                              {/*이미지 등록 후 */}
                              <button
                                className="btn_logo_delete"
                                onClick={() => {
                                  setVo({
                                    ...vo,
                                    fileId: '',
                                    imgUrl: ''
                                  })
                                }}
                              >
                                <span className="hide">로고이미지삭제</span>
                              </button>
                              <div className="logo">
                                <img
                                  src={
                                    StringUtils.hasLength(vo.imgUrl)
                                      ? vo.imgUrl
                                      : 'images/tmp/invest_list_card_no_image.png'
                                  }
                                  alt=""
                                  onClick={() =>
                                    commonContext.actions.onClickUploadFile(
                                      document.querySelector('#portfolioImageInput'),
                                      (res) =>
                                        setVo({
                                          ...vo,
                                          fileId: res['fileId'],
                                          imgUrl: res['imgUrl']
                                        }),
                                      alertPopupRef,
                                      { limitSizeOpt: FileUploadSizeOpt.DEFAULT, acceptExtOpt: FileUploadExtOpt.IMAGE }
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div className="portfolio_input">
                              <input
                                type="text"
                                title="기업명"
                                className="input"
                                id={'invmEnprNm'}
                                placeholder="기업명"
                                defaultValue={vo.invmEnprNm}
                                onChange={(event) => {
                                  setVo({
                                    ...vo,
                                    invmEnprNm: event.target.value
                                  })
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="portfolio_select">
                            <Select
                              optList={investBizList}
                              title="투자분야"
                              selected={vo.invmFildCd}
                              onChange={(e) => {
                                setVo({
                                  ...vo,
                                  invmFildCd: e.target.value
                                })
                              }}
                            />
                          </div>
                        </td>
                        <td>
                          <div className="portfolio_select">
                            <Select
                              optList={utilTechList}
                              title="관심기술"
                              selected={vo.utlzTchnCd}
                              onChange={(e) => {
                                setVo({
                                  ...vo,
                                  utlzTchnCd: e.target.value
                                })
                              }}
                            />
                          </div>
                        </td>
                        <td>
                          {vo.oppbYn && vo.oppbYn === CheckYn.YES ? (
                            <div className="portfolio_select">
                              <Select
                                optList={investStepList}
                                title="투자단계"
                                selected={vo.invmStgCd}
                                onChange={(e) => {
                                  setVo({
                                    ...vo,
                                    invmStgCd: e.target.value
                                  })
                                }}
                              />
                            </div>
                          ) : (
                            <p>비공개</p>
                          )}
                        </td>
                        <td>
                          {vo.oppbYn && vo.oppbYn === CheckYn.YES ? (
                            <div className="portfolio_input">
                              <NumInput
                                type="text"
                                className="input text_right"
                                autoComplete="off"
                                title={'투자금액'}
                                name={'invmAmt'}
                                defaultValue={vo.invmAmt}
                                defaultData={0}
                                setState={(value) => setVo({ ...vo, invmAmt: value })}
                              />
                            </div>
                          ) : (
                            <p>비공개</p>
                          )}
                        </td>
                        <td>
                          {/*<Calendar valueType={'dash'}/>*/}
                          <Calendar
                            item={vo}
                            title="투자집행날짜"
                            property={'invmPrfrDt'}
                            date={DateUtils.insertYyyyMmDdDash(vo.invmPrfrDt)}
                            onChangeDate={(currentDate, item, property) =>
                              FormUtils.setVoDateExceptDash(item, property, currentDate)
                            }
                          />
                        </td>
                        <td>
                          <div className={'toggle_checkbox theme_blue'}>
                            <input
                              type="checkbox"
                              title={'공개여부'}
                              id={'toggleChk01'}
                              onChange={(e) => handleToggleChk(e)}
                              checked={toggleChk.status}
                            />
                            <label htmlFor={'toggleChk01'}>&nbsp;</label>
                            <label htmlFor={'toggleChk01'}>{'비활성화'}</label>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <PopupFooter>
                <div className="btn_group portfolio_btn">
                  <Button className={'blue'} onClick={onClickSave}>
                    저장
                  </Button>

                  <Button
                    className={'grey'}
                    onClick={() => {
                      exeFunc(confirmCancelPopupRef, 'open', AlertLabels.notSaveMove)
                    }}
                  >
                    취소
                  </Button>
                </div>
              </PopupFooter>
            </div>
          </div>
          <AlertPopup ref={alertPopupRef} />
          <CheckCloseCallBackAlertPopup ref={autoCloseCallbackAlertPopupRef} callBack={autoCloseCallBack} />
          <ConfirmPopup
            ref={confirmSavePopupRef}
            onConfirm={() => commonContext.actions.callbackAfterSessionRefresh(save, true, true)}
          />
          <ConfirmPopup ref={confirmCancelPopupRef} onConfirm={close} />`
        </>
      )}
    </>
  )
})

export default PopupPortfolio
