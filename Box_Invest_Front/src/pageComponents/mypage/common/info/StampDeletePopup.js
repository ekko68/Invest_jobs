import React, {forwardRef, useImperativeHandle, useState} from 'react';
import PopupFooter from "components/popups/PopupFooter";
import Button from "components/atomic/Button";
import PopupConfirm from "components/popups/PopupConfirm";

const StampDeletePopup = forwardRef((props, ref) => {

    const { deleteConfirm } = props;

    const [isOpen, setIsOpen] = useState(false);

    useImperativeHandle(ref, () => ({
        open,
        close
    }));

    const open = () => {
        setIsOpen(true);
        document.body.classList.add("popupScrollLock");
    }

    const close = () => {
        setIsOpen(false);
        document.body.classList.remove("popupScrollLock");
    }

    const onConfirm = () => {
        setIsOpen(false);
        if (deleteConfirm) deleteConfirm();
        document.body.classList.remove("popupScrollLock");
    }

    return isOpen && (
        <PopupConfirm handlePopup={close}>
            <div className="popup_content_wrap">
                <div className="text grey black">
                    인감 이미지를 삭제하시겠습니까?
                    {/*<br/>인감 이미지를 삭제하면 메인박스에서도 삭제됩니다.*/}
                </div>
            </div>
            <PopupFooter>
                <div className="btn_group gap">
                    <Button className={'blue'} onClick={onConfirm}>삭제</Button>
                </div>
            </PopupFooter>
        </PopupConfirm>
    )
});

export default StampDeletePopup;