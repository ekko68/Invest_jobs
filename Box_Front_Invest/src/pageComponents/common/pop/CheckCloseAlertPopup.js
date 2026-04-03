import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react'
import PopupHeader from 'components/popups/PopupHeader'
import Button from "components/atomic/Button";
import {colors} from "assets/style/style.config";

const CheckCloseAlertPopup = forwardRef((props, ref) => {
    const [isOpen, setIsOpen] = useState(false)
    const message = useRef('')

    useImperativeHandle(ref, () => ({
        open,
        close
    }))

    // const open = (msg = null) => {
    const open = (msg = '') => {
        message.current = msg
        setIsOpen(true)
        /*setTimeout(() => close(), 1000)*/
        document.body.classList.add("alertScrollLock");
    }

    const close = () => {
        setIsOpen(false)
        document.body.classList.remove("alertScrollLock");
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
                        <PopupHeader title={''} handlePopup={close} className="popup_header"/>
                        <div className="popup_content">
                            <div className="txt_inner" style={{color: 'black'}}>{getMessage()}</div>
                        </div>
                        <div className="btn_wrap">
                            <Button theme={colors.blue} onClick={close}>
                                확인
                            </Button>
                        </div>
                    </div>
                </div>
            )
        }
    }

    return render()
})

export default CheckCloseAlertPopup
