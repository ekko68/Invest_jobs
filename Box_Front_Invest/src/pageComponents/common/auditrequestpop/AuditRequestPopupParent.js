import React, { forwardRef, useContext, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react'
import { popupRequestStyle } from 'assets/style/PopupStyle'

import ConfirmPopup from 'pageComponents/common/pop/ConfirmPopup'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'

import RequestStep1 from 'pageComponents/common/auditrequestpop/RequestStep1'
import RequestStep2 from 'pageComponents/common/auditrequestpop/RequestStep2'
import RequestStep3 from 'pageComponents/common/auditrequestpop/RequestStep3'
import RequestStep4 from 'pageComponents/common/auditrequestpop/RequestStep4'
import RequestStep5 from 'pageComponents/common/auditrequestpop/RequestStep5'
import RequestStep6 from 'pageComponents/common/auditrequestpop/RequestStep6'
import RequestStep7 from 'pageComponents/common/auditrequestpop/RequestStep7'

import { exeFunc, getFunc } from 'modules/utils/ReactUtils'
import ReactEvent from 'modules/utils/ReactEvent'
import QueryUtils from 'modules/utils/QueryUtils'
import Api from 'modules/consts/Api'
import { getPostConfig } from 'modules/utils/CommonAxios'
import CommonAxios from 'modules/utils/CommonAxios'
import { AlertLabels, CheckYn } from 'modules/consts/BizConst'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import WarningIconPopup from 'pageComponents/common/pop/WarningIconPopup'

const AuditRequestPopupParent = forwardRef((props, ref) => {
  const {
    onRefresh,
    submitApi = '',
    vcData = {
      bplcNm: '',
      ibkVcYn: ''
    }
  } = props
  const commonContext = useContext(CommonContext)

  const [isOpen, setIsOpen] = useState(false)

  // const [guideLawPoupOpen, setGuideLawPopup] = useState(true);
  const guideLawPopupRef = useRef()
  const [guidePopupCheck, setGuidePopupCheck] = useState(false)

  const sectionRef = useRef()
  const popRef = useRef()
  const confirmPopup = useRef()
  const alertPopup = useRef()

  const requestStep1Ref = useRef()
  const requestStep2Ref = useRef()
  const requestStep3Ref = useRef()
  const requestStep4Ref = useRef()
  const requestStep5Ref = useRef()
  const requestStep6Ref = useRef()
  const requestStep7Ref = useRef()

  const sectionRefs = [
    requestStep1Ref,
    requestStep2Ref,
    requestStep3Ref,
    requestStep4Ref,
    requestStep5Ref,
    requestStep6Ref,
    requestStep7Ref
  ]

  useImperativeHandle(ref, (props) => ({
    open,
    close
  }))

  const open = () => {
    setInit()
    setIsOpen(true)
    popRef.current.classList.add('active')
    setStep(0)

    exeFunc(guideLawPopupRef, 'open')
    document.body.classList.add('popupScrollLock')
  }
  const close = () => {
    setInit()
    setIsOpen(false)
    popRef.current.classList.remove('active')
    document.body.classList.remove('popupScrollLock')
  }

  const closePop = () => {
    close()
  }

  const setInit = () => {
    // setGuideLawPopup(true);
    setGuidePopupCheck(false)
    for (let popRef of sectionRefs) {
      if (popRef !== requestStep7Ref) exeFunc(popRef, 'init')
    }
  }

  const setStep = (step) => {
    for (let i = 0; i < sectionRefs.length; i++) {
      const sectionRef = sectionRefs[i]

      if (i === step) exeFunc(sectionRef, 'show')
      else exeFunc(sectionRef, 'hide')
    }
  }

  const onConfirm = async () => {
    const resourceFiles = getFunc(requestStep4Ref, 'getData')
    const rcmdData = getFunc(requestStep6Ref, 'getData')

    const params = {
      anncDatFileId: resourceFiles.requestResource.fileId,
      addtDocFileId: resourceFiles.requestAdditionalResource.fileId,
      pbrlPictUrl: resourceFiles.requestUrl,
      rqstMsgCon: getFunc(requestStep5Ref, 'getData'),
      inqAblNdd: getFunc(requestStep2Ref, 'getData'),
      atrwStplCosnYn: getFunc(requestStep1Ref, 'getData') ? CheckYn.YES : CheckYn.NO,

      brcd: rcmdData.brcd,
      emn: rcmdData.emn,
      emm: rcmdData.emm,
      infotechId: props.location.state === undefined ? '' : props.location.state
    }

    if (submitApi === Api.vc.auditRequestSave) {
      params.invmCmpId = QueryUtils.getQuery(props)?.utlinsttId
    } else if (submitApi === Api.my.company.auditRequestSave) {
      params.invmExntRqstId = QueryUtils.getQuery(props)?.invmExntRqstId
    } else {
      exeFunc(alertPopup, 'open', AlertLabels.askAdmin)
      close()
      return
    }

    await commonContext.actions.callbackAfterSessionRefresh(
      async () => {
        const submitRes = await CommonAxios(getPostConfig(Api.vc.auditRequestSave, params))

        if (submitRes && submitRes.status === 200 && submitRes.data?.code === '200') {
          vcData?.ibkVcYn === CheckYn.YES ? exeFunc(requestStep6Ref, 'hide') : exeFunc(requestStep5Ref, 'hide')
          exeFunc(requestStep7Ref, 'show')
        } else {
          exeFunc(alertPopup, 'open', AlertLabels.askAdmin)
        }
      },
      true,
      true
    )
  }

  const onAlert = (message) => {
    exeFunc(alertPopup, 'open', message)
  }
  const onCancel = () => {
    close()
  }
  const openConfirm = () => {
    exeFunc(confirmPopup, 'open', '자료를 제출하시겠습니까?')
  }
  const onSubmit = () => {
    // exeFunc(requestStep5Ref, 'hide');
    exeFunc(requestStep6Ref, 'hide')
    exeFunc(requestStep7Ref, 'show')
  }

  const onRefreshEvent = () => {
    if (onRefresh) {
      onRefresh()
    }
  }

  useLayoutEffect(() => {
    ReactEvent.addEventListener('closePop', closePop)
    ReactEvent.addEventListener('setStep', setStep)
    ReactEvent.addEventListener('openConfirm', openConfirm)
    ReactEvent.addEventListener('alert', onAlert)
    ReactEvent.addEventListener('submit', onSubmit)
    return () => {
      ReactEvent.removeEventListener('closePop')
      ReactEvent.removeEventListener('setStep')
      ReactEvent.removeEventListener('openConfirm')
      ReactEvent.removeEventListener('alert')
      ReactEvent.removeEventListener('submit')
    }
  }, [])

  return (
    <div ref={popRef} className="popup_wrap popup_invest_req_agree">
      <div className="popup_layout">&nbsp;</div>

      {/*심사 요청 시 하단 안내문구 출력*/}
      <WarningIconPopup
        ref={guideLawPopupRef}
        confirmFunc={() => {
          setGuidePopupCheck(true)
          exeFunc(guideLawPopupRef, 'close')
        }}
        closeFunc={() => {
          closePop()
          exeFunc(guideLawPopupRef, 'close')
        }}
        message={
          '본 투자와 관련하여, 관련 법률(&#39;김영란법&#39;, &#39;이해충돌방법&#39; 등)을 준수하고,' +
          '<br/>' +
          '위반 시 투자검토 대상에서 제외 될 수 있음을 알려드립니다.'
        }
      />

      {guidePopupCheck && (
        <>
          <div
            ref={sectionRef}
            className={`popup_container scroll_lightgrey`}
            style={{ maxHeight: '95%' }} // 약관 항목이 많음에 따라 조정
            css={popupRequestStyle}
          >
            {/*<div ref={sectionRef} className={`popup_container scroll`} css={popupRequestStyle}>*/}
            <RequestStep1 ref={requestStep1Ref} {...props} alertPopup={alertPopup} />
            <RequestStep2 ref={requestStep2Ref} {...props} />
            <RequestStep3 ref={requestStep3Ref} {...props} />
            <RequestStep4 ref={requestStep4Ref} {...props} />
            <RequestStep5 ref={requestStep5Ref} {...props} />
            <RequestStep6 ref={requestStep6Ref} {...props} />
            <RequestStep7 ref={requestStep7Ref} {...props} onRefresh={onRefreshEvent} invmInttNm={vcData.bplcNm} />
          </div>
          <ConfirmPopup ref={confirmPopup} onConfirm={onConfirm} onCancel={onCancel} />
          <AlertPopup ref={alertPopup} />
        </>
      )}
    </div>
  )
})

export default AuditRequestPopupParent
