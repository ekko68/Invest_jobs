import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';
import ReactEvent from "modules/utils/ReactEvent";
import {exeFunc, setFunc} from "modules/utils/ReactUtils";
import {StringUtils} from "modules/utils/StringUtils";
import PopupHeader from "components/popups/PopupHeader";
import {investReq04Style} from "assets/style/PopupStyle";
import MaxLengthCount from "pageComponents/common/number/MaxLengthCount";
import PopupFooter from "components/popups/PopupFooter";
import Button from "components/atomic/Button";
import {colors} from "assets/style/style.config";
import AlertPopup from "pageComponents/common/pop/AlertPopup";
import {CheckYn} from "modules/consts/BizConst";

/**
 * 투자심사요청 팝업 병합작업
 * 5. 요청 메시지 작성
 */

const RequestStep5 = forwardRef((props, ref) => {

    const sectionRef = useRef();
    const maxLengthCountRef = useRef();
    const alertPopupRef = useRef();

    const [message, setMessage] = useState(''); // 메시지

    useEffect(() => {}, []);
    useImperativeHandle(ref, () => ({
        init,
        show,
        hide,
        getData,
        setActive
    }));

    const init = () => {
        setMessage('');
        setFunc(maxLengthCountRef, 'setData', 0);
    }

    const show = () => {
        setActive(true)
    }
    const hide = () => {
        setActive(false)
    }
    const close = () => {
        ReactEvent.dispatchEvent('closePop')
    }
    const getData = () => {
        return message
    }
    const setActive = (active) => {
        const classList = sectionRef.current['classList']
        active ? classList.add('active') : classList.remove('active')
    }
    const onChangeMessage = (event) => {
        setFunc(maxLengthCountRef, 'setData', event.target.value.length)
        setMessage(event.target.value)
    }

    const onClickPrev = () => {
        ReactEvent.dispatchEvent('setStep', 3)
    }

    const onClickNext = () => {
        if(!StringUtils.hasLength(message)) {
            exeFunc(alertPopupRef, 'open', '요청 메시지를 입력해주세요');
            return;
        }
        ReactEvent.dispatchEvent('setStep', 5);
    }

    const onClickSubmit = () => {
        if(!StringUtils.hasLength(message)) {
            exeFunc(alertPopupRef, 'open', '요청 메시지를 입력해주세요');
            return;
        }
        ReactEvent.dispatchEvent('openConfirm')
    }

    return (
        <>
            <div ref={sectionRef} className="popup_section section06">
                <PopupHeader title={props?.vcData?.ibkVcYn === CheckYn.YES ? '메시지 입력 (4/5)' : '메시지 입력 (4/4)'} handlePopup={close} />
                <div className="popup_content" css={investReq04Style}>
                    <div className="popup_container03">
                        <textarea
                            title='투자심사요청 메시지'
                            className="message_box"
                            value={message}
                            placeholder="투자사에게 보내는 메시지를 입력해 주세요."
                            maxLength={1000}
                            onChange={(event) => onChangeMessage(event)}
                            style={{lineHeight:'1.4'}}
                        >
                          &nbsp;
                        </textarea>
                        <div className="count_wrap">
                            <MaxLengthCount ref={maxLengthCountRef} max={1000} defaultCount={String(message).length} />
                        </div>
                    </div>
                </div>
                <PopupFooter>
                    <div className="btn_group">
                        <Button type="linear" theme={colors.blue} onClick={onClickPrev}>
                            이전
                        </Button>
                        {
                            (props?.vcData?.ibkVcYn === CheckYn.YES)
                                ?   <Button theme={colors.blue} onClick={onClickNext}>
                                        다음
                                    </Button>
                                :   <Button theme={colors.blue} disabled={CheckYn.NO} onClick={onClickSubmit}>
                                        제출
                                    </Button>
                        }
                    </div>
                </PopupFooter>
            </div>
            <AlertPopup ref={alertPopupRef} />
        </>
    )
});

export default RequestStep5;