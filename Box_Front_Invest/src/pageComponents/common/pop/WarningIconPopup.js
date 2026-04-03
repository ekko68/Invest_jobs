import React, {forwardRef, useImperativeHandle, useState} from 'react';
import PopupHeader from "components/popups/PopupHeader";
import PopupFooter from "components/popups/PopupFooter";
import Button from "components/atomic/Button";

const WarningIconPopup = forwardRef((props, ref) => {
    const { message='', confirmFunc=null, closeFunc=null, isCancelBtn=false, cancelFunc=null } = props;
    const [isOpen, setIsOpen] = useState(false)

    useImperativeHandle(ref, () => ({
        open,
        close
    }))

    const open = () => {
        setIsOpen(true);
        document.body.classList.add("alertScrollLock");
    }
    const close = () => {
        setIsOpen(false);
        document.body.classList.remove("alertScrollLock");
    }

    const onClose = () => {
        if(closeFunc && (typeof closeFunc === 'function')) {
            document.body.classList.remove("alertScrollLock");
            closeFunc()
        }  else {
            close();
        }
    }

    const onCancel = () => {
        if(cancelFunc && (typeof cancelFunc === 'function')) {
            document.body.classList.remove("alertScrollLock");
            cancelFunc()
        }  else {
            close();
        }
    }

    const onConfirm = () => {
        if(confirmFunc && (typeof confirmFunc === 'function')) {
            document.body.classList.remove("alertScrollLock");
            confirmFunc()
        }  else {
            close();
        }
    }

    return (
        <>
            {
                isOpen &&
                <div className="popup_wrap popup_nda">
                    <div className="popup_layout">&nbsp;</div>
                    <div className="popup_container">
                        <PopupHeader handlePopup={onClose}/>
                        <div className="popup_content">
                            <div className="popup_nda_wrap">
                                <div className="img_wrap">
                                    <img src="/images/ico_warning.png" alt=""/>
                                </div>
                                <p className="text"
                                   style={{textAlign:'center'}}
                                   dangerouslySetInnerHTML={{__html: message}}/>
                            </div>
                        </div>
                        <PopupFooter>
                            <div className="btn_group gap">
                                {
                                    isCancelBtn &&
                                    <Button className={'light_grey'} onClick={onCancel}>
                                        취소
                                    </Button>
                                }
                                <Button className={'blue'} onClick={onConfirm}>
                                    확인
                                </Button>
                            </div>
                        </PopupFooter>
                    </div>
                </div>
            }
        </>
    )
});

export default WarningIconPopup;