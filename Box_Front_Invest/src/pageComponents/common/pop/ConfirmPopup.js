import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import PopupHeader from 'components/popups/PopupHeader'
import PopupFooter from 'components/popups/PopupFooter'
import Button from 'components/atomic/Button'

const ConfirmPopup = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  const message = useRef('')
  const params = useRef(null)

  useImperativeHandle(ref, () => ({
    open,
    openParams,
    close
  }))

  // const open = (msg = null) => {
  const open = (msg = '') => {
    message.current = msg
    setIsOpen(true)
    document.body.classList.add("alertScrollLock");
  }

  const close = () => {
    setIsOpen(false)
    document.body.classList.remove("alertScrollLock");
    if (props.onCancel) {
      props.onCancel()
    }
  }
  const openParams = (msg = null, param = null) => {
    message.current = msg
    params.current = param
    setIsOpen(true)
    document.body.classList.add("alertScrollLock");
  }

  const onConfirm = () => {
    setIsOpen(false)
    document.body.classList.remove("alertScrollLock");
    if (props.onConfirm) {
      if (params.current) props.onConfirm(params.current)
      else props.onConfirm()
    }
  }

  useEffect(() => {
    setIsOpen(false)
  }, [])

  const getMessage = () => {
    if (message.current) {
      if (typeof message.current === 'object') {
        return (
          <>
            <p className="txt01">{message.current.title}</p>
            <p className="txt02">{message.current.text}</p>
          </>
        )
      } else {
        return message.current
      }
    } else {
      return props.children
    }
  }

  const render = () => {
    if (isOpen === false) {
      return <></>
    } else {
      return (
        <div className="popup_wrap popup_confirm">
          <div className="popup_layout">&nbsp;</div>
          <div className="popup_container scroll ">
            <PopupHeader title={''} handlePopup={close} className="popup_header" />
            <div className="popup_content">
              <div className="txt_inner" style={{color: 'black'}} dangerouslySetInnerHTML={{__html:getMessage()}}/>
            </div>
            <PopupFooter className="popup_footer">
              <div className="btn_group">
                <Button className={'button'} onClick={close}>
                  취소
                </Button>
                <Button className={'button btn_blue'} onClick={onConfirm}>
                  확인
                </Button>
              </div>
            </PopupFooter>
          </div>
        </div>
      )
    }
  }

  return render()
})

export default ConfirmPopup
