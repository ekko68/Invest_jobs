import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState, useContext } from 'react'
import PopupHeader from 'components/popups/PopupHeader'
import PopupFooter from 'components/popups/PopupFooter'
import Button from 'components/atomic/Button'
import { investReq01Style } from 'assets/style/PopupStyle'
import { colors } from 'assets/style/style.config'
import SimpleDocPopup from 'pageComponents/common/auditrequestpop/NiceSimpleDocPopup'
import NiceSimpleDocIssue from 'pageComponents/common/auditrequestpop/NiceSimpleDocIssue'
import NiceSimpleDocList from 'pageComponents/common/auditrequestpop/NiceSimpleDocList'
import ReactEvent from 'modules/utils/ReactEvent'
import { createKey, deepCopyByRecursion } from 'modules/utils/CommonUtils'
import { CheckYn } from 'modules/consts/BizConst'
import CommonAxios, { getPostConfig } from 'modules/utils/CommonAxios'
import { exeFunc } from 'modules/utils/ReactUtils'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import { openSessionAlert } from 'pageComponents/common/pop/SessionCheckAlert'
import ConfirmPopup from 'pageComponents/common/pop/ConfirmPopup'
import InfotechResPopup from 'pageComponents/common/auditrequestpop/InfotechResPopup'

/**
 * 투자심사요청 팝업 병합작업
 * 3. 간편서류 제출 발급(다운)
 */

const RequestStep3 = forwardRef((props, ref) => {
  const sectionRef = useRef()
  const simpleDocPopupRef = useRef()
  const confirmPopupRef = useRef()
  const resPopupRef = useRef()
  const [infotechInfo, setInfotechInfo] = useState([])

  const tabInitData = {
    active: 'tab0',
    list: [
      { id: 'tab0', label: '서류발급' },
      { id: 'tab1', label: '서류함' }
    ]
  }

  const [agreeCheck, setAgreeCheck] = useState(false)
  const [niceSimpleDocKey, setNiceSimpleDocKey] = useState('')
  const [tabList, setTabList] = useState(deepCopyByRecursion(tabInitData))
  const alertPopupRef = useRef()

  useEffect(() => {}, [])
  useImperativeHandle(ref, () => ({
    init,
    show,
    hide,
    setActive,
    getData
  }))

  const init = () => {
    setAgreeCheck(false)
    setNiceSimpleDocKey('')
    setTabList(deepCopyByRecursion(tabInitData))
  }

  const show = () => {
    setActive(true)
  }
  const hide = () => {
    setActive(false)
  }
  const close = () => {
    ReactEvent.dispatchEvent('closePop')
  }

  const getData = () => {
    // return '간편서류 재출'
    return niceSimpleDocKey
  }

  const setActive = (active) => {
    const classList = sectionRef.current['classList']
    active ? classList.add('active') : classList.remove('active')
  }

  const onClickNext = async () => {
    ReactEvent.dispatchEvent('setStep', 3)
  }

  const onClickStartFunc = async () => {
    infotechSimpleInfoFunc(infotechInfo)
  }

  // 간편 서류 제출 전 인증서 클라우드 체크
  const onClickSimpleDocSubmit = async () => {
    
    const clientCertKeyYn = await CommonAxios(getPostConfig('/api/doc/infotech/simple/clientcertKey'), true)

    // 클라우드에 등록된 인증서 조회 후 있으면 간편서류 발급
    if (clientCertKeyYn !== null && clientCertKeyYn.data.data !== null) {
      let chkKey = clientCertKeyYn.data.data.clientCertKey.split('/')
      if(chkKey[0] !== '9999') {
        setInfotechInfo(clientCertKeyYn)
        exeFunc(
          confirmPopupRef,
          'open',
          '서류발급은 PC사양에 따라 5분 ~ 15분 가량 소요됩니다. <br> ※ 확인 버튼을 클릭 시 발급이 진행됩니다.'
        )
      }else {
        // 없으면 등록 후 진행 팝업 띄우고 확인 누르면 인증서 등록 페이지 이동
        openSessionAlert(true, '클라우드에 등록된 인증서가 없습니다. 인증서 발급 후 이용해주세요.', () =>
          window.open('https://www.ibkbox.net/ACC001/index.do')
        )
      }
    } else {
      // 없으면 등록 후 진행 팝업 띄우고 확인 누르면 인증서 등록 페이지 이동
      openSessionAlert(true, '클라우드에 등록된 인증서가 없습니다. 인증서 발급 후 이용해주세요.', () =>
        window.open('https://www.ibkbox.net/ACC001/index.do')
      )
    }
    
  }

  // infotech 간편서류 발급
  const infotechSimpleInfoFunc = async(clientCertKeyYn )=> {
    const param = {
      fileNm: '',
      bzn: clientCertKeyYn.data.data.bzn,
      clientCertKey: clientCertKeyYn.data.data.clientCertKey,
      utlinsttId: clientCertKeyYn.data.data.utlinsttId
    }
    // 타임아웃 방지를 위해 나눠서 호출
    const res = await CommonAxios(getPostConfig('/api/doc/infotech/simple/bzn', param), true)
    let msg1 = res.data.message !== 'OK' ? res.data.message : '발급완료'
    if (res.data.code === '200') {
      param.papersPresentnDt = res.data.data.papersPresentnDt
      param.fileNm = res.data.data.fileNm
      props.location.state = param.fileNm
    }
    const res2 = await CommonAxios(getPostConfig('/api/doc/infotech/simple/tax', param), true)
    let msg2 = res2.data.message !== 'OK' ? res2.data.message : '발급완료'
    const res3 = await CommonAxios(getPostConfig('/api/doc/infotech/simple/financial', param), true)
    let msg3 = res3.data.message !== 'OK' ? res3.data.message : '발급완료'
    const res4 = await CommonAxios(getPostConfig('/api/doc/infotech/simple/law', param), true)
    let msg4 = ''
    if(res4.data.data.list[0].out.errYn === 'Y') {
      msg4 = res4.data.data.list[0].out.errMsg
    }else {
      for (let i = 0; i < res4.data.data.list.length; i++) {
        const params = {
          pdfHex: res4.data.data.list[i].out.outZ5004[1].pdfList[0].pdfHex,
          strTxnrmYm: res4.data.data.list[i].out.outZ5004[1].txnrmYm.substring(0, 4) + '01',
          endTxnrmYm: res4.data.data.list[i].out.outZ5004[1].txnrmYm,
          fileNm: param.fileNm,
          docType: 'e105',
          papersPresentnDt: param.papersPresentnDt
        }
        await CommonAxios(getPostConfig('/api/doc/infotech/simple/pdf', params), true)
      }
      msg4 = '발급완료'
    }

    const res5 = await CommonAxios(getPostConfig('/api/doc/infotech/simple/vat', param), true)
    let msg5 = ''
    
    if(res5.data.data.list[0].out.errYn === 'Y') {
      msg5 = res5.data.data.list[0].out.errMsg 
    }else {
      for (let i = 0; i < res5.data.data.list.length; i++) {
        const params = {
          pdfHex: res5.data.data.list[i].out.outZ5004[1].pdfList[0].pdfHex,
          strTxnrmYm: res5.data.data.list[i].out.outZ5004[1].txnrmYm.substring(0, 4) + '01',
          endTxnrmYm: res5.data.data.list[i].out.outZ5004[1].txnrmYm,
          fileNm: param.fileNm,
          docType: 'e107',
          papersPresentnDt: param.papersPresentnDt
        }
        await CommonAxios(getPostConfig('/api/doc/infotech/simple/pdf', params), true)
      }
      msg5 = '발급완료'
    }

    exeFunc(
      resPopupRef,
      'open',
      '사업자 등록증 : '+ msg1 +' <br/><br/>'+
      '납세증명 : '+ msg2 +' <br/><br/>'+
      '표준재무재표증명 : '+ msg3 +' <br/><br/>'+
      '법인세 신고내역 : '+ msg4 +' <br/><br/>'+
      '부가가치세 내역 : '+ msg5 +' <br/><br/>'+
      '홈텍스 간편서류 발급 및 제출이 완료되었습니다. 확인버튼을 누르시고 다음버튼을 눌러 진행해주세요.'
    )
  }

  const handleTabList = (id) => {
    setTabList({
      ...tabList,
      active: id
    })
  }

  const onChangeAgreeEvent = (chk) => {
    setAgreeCheck(chk)
  }

  return (
    <div ref={sectionRef} className="popup_section section04">
      <PopupHeader
        title={props?.vcData?.ibkVcYn === CheckYn.YES ? '간편서류 제출 (2/5)' : '간편서류 제출 (2/4)'}
        handlePopup={close}
      />
      <div className="popup_content" css={investReq01Style}>
        <div className="ir_doc_common_header">
          <p className="main_text">간편서류발급 &amp; 제출</p>
          <p className={'sub_text'}>
            방문없이 간편하게 서류 발급 및 제출을 하고 내 서류함에서 제출 서류를 관리할 수 있습니다.
          </p>
        </div>
        <div className="ir_doc_common_tab tab_wrap">
          {tabList &&
            tabList.list?.map((d, idx) => (
              <button
                className={`btn_tab ${tabList.active === d.id ? 'active' : ''}`}
                key={createKey()}
                onClick={() => handleTabList(d.id)}
              >
                <span className="text">{d.label}</span>
              </button>
            ))}
        </div>
        <div className="tab_container">
          {tabList.active === 'tab0' ? (
            <NiceSimpleDocIssue onChangeAgree={onChangeAgreeEvent} agreeCheck={agreeCheck} />
          ) : (
            <NiceSimpleDocList agreeCheck={agreeCheck} />
          )}
        </div>
      </div>
      <PopupFooter>
        <div className="btn_group">
          <Button
            theme={colors.blue}
            onClick={onClickSimpleDocSubmit}
            disabled={agreeCheck === false ? CheckYn.YES : CheckYn.NO}
          >
            간편서류 발급&제출
          </Button>
          <Button theme={colors.blue} onClick={onClickNext} disabled={agreeCheck === false ? CheckYn.YES : CheckYn.NO}>
            다음
          </Button>
        </div>
      </PopupFooter>
      <SimpleDocPopup ref={simpleDocPopupRef} setKeyData={(key) => setNiceSimpleDocKey(key)} />
      <AlertPopup ref={alertPopupRef} />
      <InfotechResPopup ref={resPopupRef} />
      <ConfirmPopup ref={confirmPopupRef} onConfirm={onClickStartFunc} />
    </div>
  )
})

export default RequestStep3
