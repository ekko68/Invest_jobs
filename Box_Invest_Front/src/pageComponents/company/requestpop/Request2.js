/** @jsxImportSource @emotion/react */

// IR자료요청 완료 팝업
import { useState, forwardRef, useImperativeHandle, useRef, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { completeIrStyle } from 'assets/style/PopupStyle'
import { popupLayoutStyle } from 'assets/style/ComponentStyle'
import PopupHeader from 'components/popups/PopupHeader'
import PopupFooter from 'components/popups/PopupFooter'
import Button from 'components/atomic/Button'
import { colors } from 'assets/style/style.config'
import ReactEvent from 'modules/utils/ReactEvent'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { CompanyContext } from 'modules/contexts/company/companyContext'
import QueryUtils from 'modules/utils/QueryUtils'
import BoxUrl from "modules/consts/BoxUrl";

const Request2 = forwardRef((props, ref) => {
  const companyContext = useContext(CompanyContext)
  const history = useHistory()
  const { vo } = props

  const [isOpen, setIsOpen] = useState(false)
  // 페이지에서 팝업 자체 핸들러 (팝업 닫기)
  const onPopup = () => {
    ReactEvent.dispatchEvent('close')
  }
  const popRef = useRef()
  useImperativeHandle(ref, () => ({
    open,
    close
  }))
  const open = () => {
    popRef.current.style.display = 'flex'
    setIsOpen(true)
  }
  const close = () => {
    popRef.current.style.display = 'none'
    setIsOpen(false)
  }
  const onClickConfirm = () => {
    ReactEvent.dispatchEvent('close')
    const query = QueryUtils.getQuery(props)
    if (query.hasOwnProperty('utlinsttId')) {
      const url = ROUTER_NAMES.COMPANY_DETAIL + '?utlinsttId=' + query['utlinsttId']
      history.replace(url)
    }
  }
  const onClickStep = () => {
    ReactEvent.dispatchEvent('close');
    const url =
      ROUTER_NAMES.MY_PAGE_INVESTOR_REQUEST_DETAIL + '?invmExntRqstId=' + companyContext.state.invmExntRqstId
    // history.push(url)
    const profile = String(process.env.REACT_APP_PROFILE);
    // return window.location.href = BoxUrl.getReactAppUrl(profile) + url;
    return window.location.href = BoxUrl.REACT_APP_URL[String(profile)] + url;
  }
  return (
    <div
      ref={popRef}
      className="popup_wrap popup_ir_req_comp"
      css={popupLayoutStyle('620px')}
      style={{ display: 'none' }}
    >
      <div className="popup_layout">&nbsp;</div>
      <div className="popup_container scroll " css={completeIrStyle}>
        <PopupHeader title={'IR 자료요청'} handlePopup={onPopup} />
        <div className="popup_content">
          <div className="ir_complete_wrap">
            <p className="text">투자심사를 위한 IR 자료요청 완료</p>
            {/*<p className="info">※ (주)일루넥스의 투자 심사 승인이 필요합니다.</p>*/}
            <p className="info">※ {vo.basicData.bplcNm}의 투자 심사 승인이 필요합니다.</p>
            <Link to={'#'} className="btn_goto" onClick={onClickStep} style={{ cursor: 'pointer' }}>
              투자 심사 단계 바로가기
            </Link>
          </div>
        </div>
        <PopupFooter>
          <div className="btn_group">
            <Button theme={colors.blue} onClick={onClickConfirm}>
              확인
            </Button>
          </div>
        </PopupFooter>
      </div>
    </div>
  )
});

export default Request2;