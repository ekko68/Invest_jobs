import Button from 'components/atomic/Button'

const PopupAlert2Button = (props) => {
  const {
    className = '',
    msg = '메세지를 입력하세요',
    btnMsgCancel = '취소',
    btnMsgConfirm = '확인',
    handlePopup,
    handlePopupCancel
  } = props

  const onPopup = (btnType) => {
    
    if (btnType === 'btnMsg2') {
      handlePopup()
    }else {
      handlePopupCancel()
    }
  }

  return (
    <div className={`popup_wrap popup_confirm ${className}`}>
      <div className="layer">&nbsp;</div>
      <div className="popup_container">
        <div className="popup_content">
          <p className="msg">{msg}</p>
        </div>
        <div className="popup_footer">
          <Button
            className={'full_grey_dark'}
            onClick={() => {
              onPopup('btnMsg')
            }}
          >
            {btnMsgCancel}
          </Button>
          <Button
            className={'full_blue'}
            onClick={() => {
              onPopup('btnMsg2')
            }}
          >
            {btnMsgConfirm}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default PopupAlert2Button
