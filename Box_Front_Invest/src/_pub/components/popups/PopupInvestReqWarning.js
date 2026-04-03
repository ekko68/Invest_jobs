/** @jsxImportSource @emotion/react */

// IR자료요청 완료 팝업
import { warningIrStyle } from 'assets/style/PopupStyle'
import { popupLayoutStyle } from 'assets/style/ComponentStyle'
import PopupHeader from 'components/popups/PopupHeader'
import Button from 'components/atomic/Button'
import { colors } from 'assets/style/style.config'
import { CloseBtn } from 'components/atomic/IconButton'

const PopupInvestReqWarning = (props) => {
  const { handlePopup } = props

  // 페이지에서 팝업 자체 핸들러 (팝업 닫기)
  const onPopup = () => {
    handlePopup && handlePopup()
  }

  return (
    <div className="popup_wrap popup_invest_req_warning" css={popupLayoutStyle('460px')}>
      <div className="popup_layout">&nbsp;</div>
      <div className="popup_container scroll " css={warningIrStyle}>
        <CloseBtn onClick={onPopup} className={'btn_popup_close'} />
        <div className="popup_content">
          <div className="ir_warning_wrap">
            <p className="text">
              한 번에
              <p className="highlight_full_lemon">
                <span className="text">최대 5번의 투자 심사</span>
              </p>
              를 받을 수 있습니다.
            </p>
            <p className="info">다른 투자 심사가 종료된 후, 신청 가능합니다.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PopupInvestReqWarning
