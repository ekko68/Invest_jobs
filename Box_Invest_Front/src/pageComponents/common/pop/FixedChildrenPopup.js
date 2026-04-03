import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { warningIrStyle } from 'assets/style/PopupStyle'
import { popupLayoutStyle } from 'assets/style/ComponentStyle'
import { CloseBtn } from 'components/atomic/IconButton'

const FixedChildrenPopup = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false)
  useImperativeHandle(ref, () => ({
    open,
    close
  }))

  const open = () => {
    setIsOpen(true)
    document.body.classList.add("alertScrollLock");
  }

  const close = () => {
    setIsOpen(false)
    document.body.classList.remove("alertScrollLock");
  }

  const onClickClose = () => {
    setIsOpen(false)
    document.body.classList.remove("alertScrollLock");
  }

  const render = () => {
    if (isOpen === false) {
      return <></>
    } else if (isOpen) {
      return (
        <div className="popup_wrap popup_invest_req_warning" css={popupLayoutStyle('460px')}>
          <div className="popup_layout">&nbsp;</div>
          <div className="popup_container scroll " css={warningIrStyle}>
            <CloseBtn onClick={onClickClose} className={'btn_popup_close'} />
            <div className="popup_content">
              <div className="ir_warning_wrap">{props.children}</div>
            </div>
          </div>
        </div>
      )
    }
  }

  useEffect(() => {}, [])
  return <>{render()}</>
})

export default FixedChildrenPopup
