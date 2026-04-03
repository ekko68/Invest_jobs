import React, {forwardRef, useImperativeHandle, useState} from 'react';
import PopupHeader from 'components/popups/PopupHeader'
import PopupFooter from 'components/popups/PopupFooter'
import Button from 'components/atomic/Button'

const NdaSubmitPopup = forwardRef((props, ref) => {
  const { onConfirm, isLast = false } = props;
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

  const onClickConfirm = () => {
    setIsOpen(false);
    if(onConfirm) onConfirm();
    document.body.classList.remove("popupScrollLock");
  }

  const render = () => {
    if(!isOpen) return <></>

    return (
        <div className="popup_wrap popup_nda">
          <div className="popup_layout">&nbsp;</div>
          <div className="popup_container">
            <PopupHeader handlePopup={close} />
            <div className="popup_content">
              <div className="popup_nda_wrap">
                <p className="text submit">{isLast ? '최종 제출하시겠습니까?' : '제출하시겠습니까?'}</p>
              </div>
            </div>
            <PopupFooter>
              <div className="btn_group">
                <Button className={'gray'} onClick={close}>취소</Button>
                <Button className={'blue'} onClick={onClickConfirm}>확인</Button>
              </div>
            </PopupFooter>
          </div>
        </div>
    )
  }

  return render();
});

export default NdaSubmitPopup;
