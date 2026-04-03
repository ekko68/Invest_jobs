import Button from 'components/atomic/Button'

const PopupAlert = (props) => {
  const { className = '', msg = '메세지를 입력하세요', btnMsg = '확인', handlePopup } = props

  const onPopup = (btnType) => {
    if (handlePopup) handlePopup(btnType)
  }

  return (
    <div className={`popup_wrap popup_confirm ${className}`}>
      <div className="layer">&nbsp;</div>
      <div className="popup_container">
        <div className="popup_content">
          <p className="msg">{msg}</p>
        </div>
        <div className="popup_footer">
          <Button className={'full_blue'} onClick={() => onPopup('btnMsg')}>
            {btnMsg}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PopupAlert
