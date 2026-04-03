import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react'

import PopupHeader from 'components/popups/PopupHeader'
import PopupFooter from 'components/popups/PopupFooter'
import Button from 'components/atomic/Button'
import Loading from 'components/common/Loading'

import ConfirmPopup from 'pageComponents/common/pop/ConfirmPopup'
import CheckCloseCallBackAlertPopup from 'pageComponents/common/pop/CheckCloseCallBackAlertPopup'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import NdaArticles from 'pageComponents/mypage/common/nda/NdaArticles'

import DateUtils from 'modules/utils/DateUtils'
import { StringUtils } from 'modules/utils/StringUtils'
import { exeFunc } from 'modules/utils/ReactUtils'
import { AlertLabels, NdaSignTypeCode, PopupApiStatus, UsisType } from 'modules/consts/BizConst'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import { LOGIN_LINK_KEYS } from 'modules/contexts/common/LoginContext'

const NdaEformPopup = forwardRef((props, ref) => {
  const { signType, usisType, vo, setEformData } = props
  const commonContext = useContext(CommonContext)

  const [isOpen, setIsOpen] = useState(false)
  const [frameLoad, setFrameLoad] = useState(false)

  const iframeBodyRef = useRef()
  const iframeRef = useRef()
  const autoCloseCallbackPopupRef = useRef()
  const popupCloseConfirmRef = useRef()
  const alertPopupRef = useRef()

  const frameFormRef = useRef()
  const articlesDataRef = useRef()
  const contractDataRef = useRef()

  useImperativeHandle(ref, () => ({
    open,
    close
  }))

  const open = async () => {
    await commonContext.actions.callbackAfterSessionRefresh(
      async () => {
        setIsOpen(true)

        const inttData = {
          enprNm: '',
          enprAdr: '',
          enprSign: '',
          enprSignprsnNm: '',

          invmNm: '',
          invmAdr: '',
          invmSign: '',
          invmSignprsnNm: ''
        }

        if (vo) {
          for (let key in inttData)
            inttData[String(key)] = StringUtils.hasLength(vo[String(key)]) ? vo[String(key)] : ''
        }

        if (signType == NdaSignTypeCode.DSMS_SIGN) {
          if (usisType == UsisType.COMPANY) {
            inttData.enprNm = commonContext.state.user.info?.name
            inttData.invmNm = vo?.rcvInttNm
          } else if (usisType == UsisType.INVESTOR) {
            inttData.enprNm = vo?.rcvInttNm
            inttData.invmNm = commonContext.state.user.info?.name
          }
        }

        // 약관 정보 JSON (clipsoft eform oof memo 처리)
        articlesDataRef.current.value = JSON.stringify(NdaArticles.getNdaArticles(vo?.ndaValdNyy, vo?.ndaSpclArtcCon))
        // 계약 정보
        contractDataRef.current.value = JSON.stringify({
          ndaCnttId: StringUtils.hasLength(vo?.ndaCnttId) ? vo.ndaCnttId : '',
          formattedDateStr:
            signType == NdaSignTypeCode.DSMS_SIGN
              ? new Intl.DateTimeFormat('ko', { dateStyle: 'long' }).format(new Date())
              : DateUtils.customDateFormat(vo?.rgsnTs, 'yyyy년 MM월 dd일'),

          signType: StringUtils.hasLength(signType) ? signType : '',
          profile: process.env.REACT_APP_PROFILE,
          // todo : 공통 로그인 1차 작업 마무리 후 NDA 처리 확인
          // ivtToken: sessionStorage.getItem('token'),
          ivtToken: window.getCookieValue(LOGIN_LINK_KEYS.AUTH_COOKIE),
          usisType: usisType,

          ...inttData
        })
        frameFormRef.current.submit()
        window.addEventListener('message', messageFromChild)
      },
      true,
      true
    )

    document.body.classList.add('popupScrollLock')
  }

  const close = () => {
    const iframe = document.querySelector('#ndaSignEformIframe')
    if (iframe) iframeBodyRef.current.removeChild(iframe)
    setIsOpen(false)
    setFrameLoad(false)
    document.body.classList.remove('popupScrollLock')
  }

  useEffect(() => {}, [])

  const messageFromChild = (event) => {
    if (event.data.status == PopupApiStatus.SUCCESS) {
      if (setEformData) setEformData(event.data)
      exeFunc(autoCloseCallbackPopupRef, 'open', '서명 되었습니다.')
    } else if (event.data.status == PopupApiStatus.ERROR) {
      exeFunc(alertPopupRef, 'open', AlertLabels.askAdmin)
    }
  }

  const onClickPopupCloseBtn = () => {
    if (signType === NdaSignTypeCode.COMPLETE) {
      close()
    } else {
      exeFunc(popupCloseConfirmRef, 'open', '서명을 저장하지 않고 종료하시겠습니까?')
    }
  }

  return (
    <>
      {isOpen && (
        <div className="popup_wrap popup_nda">
          <div className="popup_layout">&nbsp;</div>
          <div className="popup_container" style={{ width: '1000px', height: '90%' }}>
            <PopupHeader handlePopup={onClickPopupCloseBtn} />
            <div className="popup_content" style={{ height: '90%' }} ref={iframeBodyRef}>
              {!frameLoad && <Loading />}
              <iframe
                onLoad={() => {
                  if (!frameLoad) setFrameLoad(true)
                }}
                id="ndaSignEformIframe"
                name="ndaSignEformIframe"
                src="#"
                width="100%"
                height="100%"
              />
              <form
                id="frameForm"
                target="ndaSignEformIframe"
                ref={frameFormRef}
                action={process.env.REACT_APP_LOAN_BOX_URL + '/clip/ndaReport.do'}
                method="post"
              >
                <input type="hidden" id="articleData" name="articleData" ref={articlesDataRef} value="" />
                <input type="hidden" id="contractData" name="contractData" ref={contractDataRef} value="" />
              </form>
            </div>
            <PopupFooter>
              <div className="btn_group">
                <Button className={'blue'} onClick={onClickPopupCloseBtn}>
                  닫기
                </Button>
              </div>
            </PopupFooter>
          </div>
          <AlertPopup ref={alertPopupRef} />
          <ConfirmPopup ref={popupCloseConfirmRef} onConfirm={close} />
          <CheckCloseCallBackAlertPopup ref={autoCloseCallbackPopupRef} callBack={close} />
        </div>
      )}
    </>
  )
})

export default NdaEformPopup
