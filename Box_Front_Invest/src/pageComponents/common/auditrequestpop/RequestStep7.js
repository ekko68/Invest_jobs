import React, {forwardRef, useEffect, useImperativeHandle, useRef} from 'react';
import ReactEvent from "modules/utils/ReactEvent";
import PopupHeader from "components/popups/PopupHeader";
import PopupFooter from "components/popups/PopupFooter";
import Button from "components/atomic/Button";

/**
 * 투자심사요청 팝업 병합작업
 * 6. 요청 완료 팝업
 */

const RequestStep7 = forwardRef((props, ref) => {
    const { invmInttNm, onRefresh } = props;
    const sectionRef = useRef();

    useEffect(() => {}, [])
    useImperativeHandle(ref, () => ({
        show,
        hide,
        getData,
        setActive
    }));

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
        return '온라인 투자 심사 완료'
    }
    const setActive = (active) => {
        const classList = sectionRef.current['classList']
        active ? classList.add('active') : classList.remove('active')
    }
    const onClickCheck = () => {
        close()
        if (onRefresh) onRefresh()
    }

    return (
        <div ref={sectionRef} className="popup_section section07 popup_apply_finish">
            <div className="popup_container scroll ">
                <PopupHeader title={'신청완료'} handlePopup={close} className="popup_header" />
                <div className="popup_content">
                    <p className="title">
                        <span className="company_name">{invmInttNm}</span>에 <br />
                        온라인 투자심사 요청이 완료되었습니다.
                    </p>
                </div>
                <PopupFooter>
                    <div className="btn_group">
                        <Button className={'blue'} onClick={onClickCheck}>
                            확인
                        </Button>
                    </div>
                </PopupFooter>
            </div>
        </div>
    )
});

export default RequestStep7;

