import Button from 'components/atomic/Button'

const PopupConfirm = (props) => {
  const {
    className = '',
    msg = '메세지를 입력하세요',
    btnMsg = '확인',
    btnMsg2 = '취소',
    handlePopup,
    children
  } = props

  const onPopup = (type) => {
    if (handlePopup) handlePopup(type)
  }

  return (
    <div className={`popup_wrap popup_confirm ${className}`}>
      <div className="layer">&nbsp;</div>
      <div className="popup_container">
        <div className="popup_content">
          <p className="msg">{msg}</p>
        </div>
        <div className="popup_footer">
          {children ? (
            children
          ) : (
            <>
              <Button className={'full_grey_dark'} onClick={() => onPopup('cancel')}>
                {btnMsg2}
              </Button>
              <Button className={'full_blue'} onClick={() => onPopup('confirm')}>
                {btnMsg}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default PopupConfirm
