/** @jsxImportSource @emotion/react */

// IR자료요청 완료 팝업
import { Link } from 'react-router-dom'
import { completeIrStyle } from 'assets/style/PopupStyle'
import { popupLayoutStyle } from 'assets/style/ComponentStyle'
import PopupHeader from 'components/popups/PopupHeader'
import PopupFooter from 'components/popups/PopupFooter'
import Button from 'components/atomic/Button'
import { colors } from 'assets/style/style.config'

const PopupIrReqComp = (props) => {
  const { handlePopup } = props

  // 페이지에서 팝업 자체 핸들러 (팝업 닫기)
  const onPopup = () => {
    handlePopup && handlePopup()
  }

  return (
    <div className="popup_wrap popup_ir_req_comp" css={popupLayoutStyle('620px')}>
      <div className="popup_layout">&nbsp;</div>
      <div className="popup_container scroll " css={completeIrStyle}>
        <PopupHeader title={'IR 자료요청'} handlePopup={onPopup} />
        <div className="popup_content">
          <div className="ir_complete_wrap">
            <p className="text">투자심사를 위한 IR 자료요청 완료</p>
            <p className="info">※ (주)일루넥스의 투자 심사 승인이 필요합니다.</p>
            <Link to={'/'} className="btn_goto">
              투자 심사 단계 바로가기
            </Link>
          </div>
        </div>
        <PopupFooter>
          <div className="btn_group">
            <Button theme={colors.blue}>확인</Button>
          </div>
        </PopupFooter>
      </div>
    </div>
  )
}

export default PopupIrReqComp
