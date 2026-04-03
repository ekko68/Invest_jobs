import React, {useContext, useEffect, useRef, useState} from 'react';
import Button from "components/atomic/Button";
import {CommonContext} from "modules/contexts/common/CommomContext";
import PopupHeader from "components/popups/PopupHeader";
import PopupFooter from "components/popups/PopupFooter";
import {isNumber} from "../../modules/utils/NumberUtils";

const TokenTimerPopup = (props) => {
    const {onClickClose, startSec = null, calcTokenTimeFunc = null} = props;
    const commonContext = useContext(CommonContext);

    const countRef = useRef(60);
    const [count, setCount] = useState(60);

    useEffect(() => {
        if(isNumber(startSec)) countRef.current = startSec;
        const calcTimeFunc = calcTokenTimeFunc != null ? calcTokenTimeFunc : countRef.current - 1;

        const timer = setInterval(() => {
            countRef.current = calcTimeFunc();

            if(countRef.current < 0) clearInterval(timer);
            else setCount(countRef.current);
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="popup_wrap popup_confirm" style={{zIndex: 100000000}}>
            <div className="popup_layout">&nbsp;</div>
            <div className="popup_container scroll ">
                <PopupHeader title={''} handlePopup={onClickClose} className="popup_header" />
                <div className="popup_content">
                    <div className="txt_inner">
                        {`자동 로그아웃까지 ${count}초 남았습니다.`} <br/> 연장하시겠습니까?
                    </div>
                </div>
                <PopupFooter className="popup_footer">
                    <div className="btn_group">
                        <Button className={'button'}
                                onClick={async () => {
                                    await commonContext.actions.logout();
                                    onClickClose();
                                }}>
                            로그아웃
                        </Button>
                        <Button className={'button btn_blue'}
                                onClick={async () => {
                                    await commonContext.actions.refreshToken();
                                    onClickClose();
                                }}>
                            확인
                        </Button>
                    </div>
                </PopupFooter>
            </div>
        </div>

    )
}

export default TokenTimerPopup;