/** @jsxImportSource @emotion/react */
import PopupHeader from 'components/popups/PopupHeader'
import PopupFooter from 'components/popups/PopupFooter'
import Button from 'components/atomic/Button'

/**@deprecated */
const PopupNdaSign = (props) => {
  const { handlePopup } = props

  // 페이지에서 팝업 자체 핸들러 (팝업 닫기)
  const onPopup = () => {
    handlePopup && handlePopup()
  }

  return (
    <div className="popup_wrap popup_nda">
      <div className="popup_layout">&nbsp;</div>
      <div className="popup_container">
        <PopupHeader handlePopup={onPopup} />
        <div className="popup_content">
          <div className="popup_nda_wrap">
            <p className="text submit">최종 제출하시겠습니까?</p>
          </div>
        </div>
        <PopupFooter>
          <div className="btn_group">
            <Button className={'gray'}>취소</Button>
            <Button className={'blue'}>확인</Button>
          </div>
        </PopupFooter>
      </div>
    </div>
  )
}

export default PopupNdaSign
