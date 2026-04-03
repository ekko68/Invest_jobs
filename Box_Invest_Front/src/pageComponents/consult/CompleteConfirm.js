import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import PopupHeader from 'components/popups/PopupHeader'
import PopupFooter from 'components/popups/PopupFooter'
import Button from 'components/atomic/Button'
import ROUTER_NAMES from "modules/consts/RouterConst";
import { useHistory } from 'react-router-dom'

const CompleteConfirm = forwardRef((props, ref) => {
    const [isOpen, setIsOpen] = useState(false)

    const history = useHistory();

    useImperativeHandle(ref, () => ({
        open,
        close
    }))

    const open = () => {
        setIsOpen(true);
        document.body.classList.add("alertScrollLock");
    }

    const close = () => {
        setIsOpen(false)
        document.body.classList.remove("alertScrollLock");
    }

    const onConfirm = () => {
        setIsOpen(false)
        document.body.classList.remove("alertScrollLock");
        history.push(ROUTER_NAMES.MY_PAGE_CONSULT);
    }

    useEffect(() => {
        setIsOpen(false)
    }, [])

    return (
        <>
            {
                isOpen &&
                <div className="popup_wrap popup_confirm">
                    <div className="popup_layout">&nbsp;</div>
                    <div className="popup_container scroll ">
                        <PopupHeader title={''} handlePopup={close} className="popup_header" />
                        <div className="popup_content">
                            <div className="txt_inner">
                                <p className="txt01">컨설팅 신청이 완료되었습니다.</p>
                                <p className="txt02">컨설팅 신청 단계를 확인하시겠습니까?</p>
                            </div>
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
            }
        </>
    )
})

export default CompleteConfirm
