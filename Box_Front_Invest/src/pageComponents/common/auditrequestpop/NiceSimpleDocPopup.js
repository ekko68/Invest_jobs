import React, {forwardRef, useContext, useEffect, useImperativeHandle, useRef} from 'react';
import AlertPopup from "pageComponents/common/pop/AlertPopup";

import CommonAxios, {loader} from "modules/utils/CommonAxios";
import {getPostConfig} from "modules/utils/CommonAxios";
import Api from "modules/consts/Api";
import {exeFunc} from "modules/utils/ReactUtils";
import {AlertLabels} from "modules/consts/BizConst";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {LOGIN_LINK_KEYS} from "modules/contexts/common/LoginContext";

const NiceSimpleDocPopup = forwardRef((props, ref) => {
    const { setKeyData } = props;
    const commonContext = useContext(CommonContext);

    const formRef = useRef();
    const keyRef = useRef();
    const bizrnoRef = useRef();

    const alertPopupRef = useRef();

    useImperativeHandle(ref, () => ({
        formSubmit
    }));

    const formSubmit = async () => {
        const settings = {
            width : window.screen.width,
            height : window.screen.height,
            // width : 1200,
            // height : 300,
            status : "no",
            scrollbars : "yes",
            toolbar : "no",
            menubar : "no",
            location : "no",
            resizable : "no",
            fullscreen : "no",
            channelmode : "no",
            // top :  Math.ceil((window.screen.width-700)/2),
            // left : Math.ceil((window.screen.height-200)/2)
        }

        let params = '';
        for(let key in settings) {
            params = params + `${String(key)}=${settings[key]}, `;
        }

        await commonContext.actions.callbackAfterSessionRefresh(async () => {
            const res = await CommonAxios(getPostConfig(Api.common.niceSimpleKeySave));
            if(res && res.status === 200 && res?.data?.code === '200') {
                setKeyData(res.data.data?.docKey);
                keyRef.current.value = res.data.data?.docKey;
                bizrnoRef.current.value = res.data.data?.bizrno;
            } else {
                exeFunc(alertPopupRef, 'open', AlertLabels.askAdmin);
                return;
            }

            setTimeout(() => {
                loader(true);
            }, 100)

            const win = window.open("", "pop", params);

            // todo 세션 타이머 팝업 정지의 경우 로직 개선 작업을 고려할것!
            sessionStorage.setItem(LOGIN_LINK_KEYS.TOKEN_TIMER_STOP, "stop");

            // let timerCnt = 0;
            const timer = setInterval(() => {
                // console.log("timerCnt :" + ++timerCnt);
                if(win.closed) {
                    clearInterval(timer);
                    loader(false);
                }
            }, 1000);

            // let tokenTimerCnt = 0;
            const tokenTimer = setInterval(() => {
                // console.log("tokenTimerCnt :" + ++tokenTimerCnt);
                if(win.closed) {
                    sessionStorage.removeItem(LOGIN_LINK_KEYS.TOKEN_TIMER_STOP);
                    clearInterval(tokenTimer);
                }
                else commonContext.actions.refreshToken();
            }, 10000);

            // formRef.current.action = 'https://ibkbox.one-click.co.kr/sp/SP0100M001GE.nice';
            formRef.current.action = 'https://ibkbox.one-click.co.kr/sp/SP0100M002GE.nice';
            formRef.current.target = "pop";
            formRef.current.submit();
        }, true, true);

    }

    return (
        <>
            <form id="popForm" ref={formRef} name="popForm" action="" method="post">
                <input title="기관코드" type="hidden" id="cporcd" name="cporcd" value="004"/>
                <input title="상품코드" type="hidden" id="pdt_seq" name="pdt_seq" value="0011"/>
                <input title="은행키" type="hidden" id="orgclbyctnidtkey" ref={keyRef} name="orgclbyctnidtkey" value=""/>
                <input title="토큰" type="hidden" id="token" name="token" value={process.env.REACT_APP_BANK_KEY}/>
                <input title="사업자번호" type="hidden" id="bizno" name="bizno" ref={bizrnoRef} value=""/>
            </form>
            <AlertPopup ref={alertPopupRef} />
        </>
    )
});

export default NiceSimpleDocPopup;