// 컨설팅 신청 완료 팝업
import PopupHeader from 'components/popups/PopupHeader'

const PopupConfirm = (props) => {
  const { handlePopup, children } = props

  // 페이지에서 팝업 자체 핸들러 (팝업 닫기)
  const onPopup = () => {
    handlePopup && handlePopup()
  }

  return (
    <div className="popup_wrap popup_confirm popup_investor_switch">
      <div className="popup_layout">&nbsp;</div>
      <div className="popup_container scroll ">
        <PopupHeader title={''} handlePopup={onPopup} className="popup_header" />
        {children}
      </div>
    </div>
  )
}

export default PopupConfirm
