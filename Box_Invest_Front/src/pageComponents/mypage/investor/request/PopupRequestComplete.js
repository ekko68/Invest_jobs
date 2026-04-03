import PopupHeader from 'components/popups/PopupHeader'
import Button from 'components/atomic/Button'
import { useHistory } from 'react-router-dom'
import { forwardRef, useImperativeHandle, useState } from 'react'
import ROUTER_NAMES from 'modules/consts/RouterConst'

const PopupRequestComplete = forwardRef((props, ref) => {
  const { onComplete } = props
  const history = useHistory()
  const [isOpen, setIsOpen] = useState(false)
  useImperativeHandle(ref, () => ({
    open,
    close
  }))
  const open = () => {
    setIsOpen(true)
  }
  const close = () => {
    setIsOpen(false)
  }
  const onClickComplete = () => {
    // const url = ROUTER_NAMES.MY_PAGE_INVESTOR_REQUEST + '?type=send'
    // history.push(url)
    close()
    if (onComplete) {
      onComplete()
    }
  }
  const render = () => {
    if (isOpen === false) return <></>
    return (
      <div className="popup_wrap popup_complete">
        <div className="popup_layout">&nbsp;</div>
        <div className="popup_container scroll ">
          <PopupHeader title={''} handlePopup={close} className="popup_header" />
          <div className="popup_content">
            <p className="msg">심사를 완료하시겠습니까?</p>
          </div>
          <div className="popup_footer ">
            <Button onClick={close}>취소</Button>
            <Button className={'blue'} onClick={onClickComplete}>
              확인
            </Button>
          </div>
        </div>
      </div>
    )
  }
  return render()
});

export default PopupRequestComplete;