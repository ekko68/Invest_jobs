import React, {forwardRef, useImperativeHandle, useState} from 'react';
import { useHistory } from "react-router-dom"; 
import PopupHeader from "components/popups/PopupHeader";
import PopupFooter from "components/popups/PopupFooter";
import Button from "components/atomic/Button";
import DateUtils from "modules/utils/DateUtils";
import {StringUtils} from "modules/utils/StringUtils";
import ROUTER_NAMES from 'modules/consts/RouterConst';

const ConvertResponsePopup = forwardRef((props, ref) => {
    const history = useHistory();
    const [isOpen, setIsOpen] = useState(false);
    const [data, setData] = useState({
        msg: '',
        date: ''
    });

    useImperativeHandle(ref, () => ({
        open,
        close
    }))

    const open = (msg, date) => {
        setData({
            msg: msg,
            date: date
        });
        setIsOpen(true);
        document.body.classList.add("popupScrollLock");
    }

    const close = () => {
        setIsOpen(false);

        document.body.classList.remove("popupScrollLock");
    }

    const onConfirm = () => {
        setIsOpen(false);
        props.redirectUrl && history.push(ROUTER_NAMES.MY_PAGE_COMPANY_INFO)
        if(props.onConfirm) props.onConfirm();
        document.body.classList.remove("popupScrollLock");
    }

    const render = () => {
        if(isOpen === false) {
            return <></>
        } else {
            return (
                <div className="popup_wrap popup_confirm popup_investor_switch">
                    <div className="popup_layout">&nbsp;</div>
                    <div className="popup_container scroll ">
                        <PopupHeader title={''} handlePopup={close} className="popup_header" />
                        <div className="popup_content_wrap">
                            <div className="text grey black">
                                {
                                    (data.msg !== null && data.msg !== '') &&
                                    <p dangerouslySetInnerHTML={{ __html: StringUtils.toBr(data.msg)}}/>
                                }
                                {
                                    (data.date !== null && data.date !== '') &&
                                    <p className="req_date_wrap">
                                        요청일&nbsp;:<span className="req_date">{DateUtils.insertYyyyMmDdDash(data.date)}</span>
                                    </p>
                                }
                            </div>
                        </div>
                        <PopupFooter>
                            <div className="btn_group gap">
                                <Button className={'blue'} onClick={onConfirm}>확인</Button>
                            </div>
                        </PopupFooter>
                    </div>
                </div>
            )
        }
    }

    return render();
});

export default ConvertResponsePopup;

