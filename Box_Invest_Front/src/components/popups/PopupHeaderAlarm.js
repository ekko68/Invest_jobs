// 컨설팅 신청 완료 팝업
import PopupHeader from 'components/popups/PopupHeader'
import PopupFooter from 'components/popups/PopupFooter'
import Button from 'components/atomic/Button'

const PopupHeaderAlarm = (props) => {
  const { handlePopup } = props

  // 페이지에서 팝업 자체 핸들러 (팝업 닫기)
  const onPopup = () => {
    handlePopup && handlePopup()
  }

  return (
    <div className="popup_wrap popup_header_alarm">
      <div className="popup_layout">&nbsp;</div>
      <div className="popup_container scroll ">
        <PopupHeader title={'알림'} handlePopup={onPopup} className="popup_header" />
        <div className="popup_content">
          <p className="info_text">
            투자희망요청중 60일 이상 경과한 <br />
            투자건이 있습니다.
          </p>
        </div>
        <PopupFooter>
          <div className="btn_group">
            <Button className={'blue'}>확인</Button>
          </div>
        </PopupFooter>
      </div>
    </div>
  )
}

export default PopupHeaderAlarm
