import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import PopupHeader from 'components/popups/PopupHeader'
import PopupFooter from 'components/popups/PopupFooter'
import Button from 'components/atomic/Button'

const MoveTabConfirmPopup = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  let message = useRef('')
  let tabId = useRef('')
  useImperativeHandle(ref, () => ({
    open,
    close
  }))

  const open = (msg = null, id = null) => {
    message.current = msg
    tabId.current = id
    setIsOpen(true)
    document.body.classList.add("alertScrollLock");
  }

  const close = () => {
    setIsOpen(false)
    document.body.classList.remove("alertScrollLock");
    // if (props.onCancel) {
    //   props.onCancel(tabId.current)
    // }
  }

  const onCancel = () => {
    setIsOpen(false)
    document.body.classList.remove("alertScrollLock");
    if (props.onCancel) {
      props.onCancel(tabId.current)
    }
  }

  const onConfirm = () => {
    setIsOpen(false)
    document.body.classList.remove("alertScrollLock");
    if (props.onConfirm) {
      props.onConfirm(tabId.current)
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
          <div className="popup_wrap popup_nda">
            <div className="popup_layout">&nbsp;</div>
            <div className="popup_container">
              <PopupHeader handlePopup={close}/>
              <div className="popup_content">
                <div className="popup_nda_wrap">
                  <div className="img_wrap">
                    <img src="/images/ico_warning.png" alt=""/>
                  </div>
                  <p className="text"
                     style={{textAlign:'center'}}
                     dangerouslySetInnerHTML={{__html: getMessage()}}/>
                </div>
              </div>
              <PopupFooter>
                <div className="btn_group gap">
                  <Button className={'light_grey'} onClick={onCancel}>
                    취소
                  </Button>
                  <Button className={'blue'} onClick={onConfirm}>
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

export default MoveTabConfirmPopup
