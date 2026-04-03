/** @jsxImportSource @emotion/react */
import { requestIrStyle } from 'assets/style/PopupStyle'
import { popupLayoutStyle } from 'assets/style/ComponentStyle'
import PopupHeader from 'components/popups/PopupHeader'
import PopupFooter from 'components/popups/PopupFooter'
import Button from 'components/atomic/Button'
import { colors } from 'assets/style/style.config'

const PopupIrReq = (props) => {
  const { handlePopup } = props

  // 페이지에서 팝업 자체 핸들러 (팝업 닫기)
  const onPopup = () => {
    handlePopup && handlePopup()
  }

  return (
    <div className="popup_wrap popup_ir_req" css={popupLayoutStyle('620px')}>
      <div className="popup_layout">&nbsp;</div>
      <div className="popup_container scroll " css={requestIrStyle}>
        <PopupHeader title={'IR 자료요청'} handlePopup={onPopup} />
        <div className="popup_content">
          <div className="ir_request_wrap">
            <div className="img_wrap">
              <img src="/images/tmp/img_user02.png" alt="" />
            </div>
            <div className="form_wrap">
              <p className="info">
                <span className="highlight_blue">(주) 일루넥스</span>에게 투자심사를 위한 IR 자료를 요청합니다.
              </p>
              <textarea placeholder="투자심사 요청 메시지를 전송합니다." className="textarea scroll"></textarea>
              <div className="number_wrap">
                <span className="cnt">0</span>
                <span className="max">1000</span>
              </div>
            </div>
          </div>
        </div>
        <PopupFooter>
          <div className="btn_group">
            <Button theme={colors.lightGrey}>취소</Button>
            <Button theme={colors.blue}>요청</Button>
          </div>
        </PopupFooter>
      </div>
    </div>
  )
}

export default PopupIrReq
