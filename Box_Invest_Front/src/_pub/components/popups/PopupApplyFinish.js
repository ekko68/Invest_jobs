// 컨설팅 신청 완료 팝업
import PopupHeader from 'components/popups/PopupHeader'
import PopupFooter from 'components/popups/PopupFooter'
import Button from 'components/atomic/Button'
import { colors } from 'assets/style/style.config'

const PopupConfirm = (props) => {
  const { handlePopup, children } = props

  // 페이지에서 팝업 자체 핸들러 (팝업 닫기)
  const onPopup = () => {
    handlePopup && handlePopup()
  }

  return (
    <div className="popup_wrap popup_apply_finish">
      <div className="popup_layout">&nbsp;</div>
      <div className="popup_container scroll ">
        <PopupHeader title={'신청완료'} handlePopup={onPopup} className="popup_header" />
        <div className="popup_content">{children}</div>
        <PopupFooter>
          <div className="btn_group">
            <Button theme={colors.blue}>확인</Button>
          </div>
        </PopupFooter>
      </div>
    </div>
  )
}

export default PopupConfirm
