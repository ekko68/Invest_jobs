import React, {forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {useHistory} from "react-router-dom";

import {colors} from "assets/style/style.config";
import {investReq01Style, investReq02Style} from "assets/style/PopupStyle";

import PopupHeader from "components/popups/PopupHeader";
import PopupFooter from "components/popups/PopupFooter";
import Button from "components/atomic/Button";
import MinusPlus from "components/common/number/MinusPlus";

import IrPreviewPopup from "pageComponents/common/irpreviewpop/IrPreviewPopup";

import ReactEvent from "modules/utils/ReactEvent";
import ResponseUtils from "modules/utils/ResponseUtils";
import Api from "modules/consts/Api";
import {exeFunc} from "modules/utils/ReactUtils";
import ROUTER_NAMES from "modules/consts/RouterConst";
import DateUtils from "modules/utils/DateUtils";
import IrPreviewApi from "modules/consts/IrPreviewApi";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {CheckYn} from "modules/consts/BizConst";

/**
 * 투자심사요청 팝업 병합작업
 * 2. IR 확인
 */

const RequestStep2 = forwardRef((props, ref) => {

    const history = useHistory();
    const commonContext = useContext(CommonContext);

    const previewRef = useRef();
    const sectionRef = useRef();

    const initData = {
        irTitle: '',
        irPopupTitle: '',
        lastModifiedDate: '',
        lastModifiedTimestamp: '',
        progress: 0
    };

    const [irInfo, setIrInfo] = useState({...initData});

    useEffect(() => {}, []);

    useImperativeHandle(ref, () => ({
        init,
        show,
        hide,
        setActive,
        getData
    }));

    const init = () => {
        setIrInfo({...initData});
    }

    const show = async () => {
        await commonContext.actions.callbackAfterSessionRefresh(async () => {
            const resProgress = await loadProgress()
            setIrInfo(resProgress)
            setActive(true);
        }, true, true);
    }

    const hide = () => {
        setActive(false)
    }

    const close = () => {
        ReactEvent.dispatchEvent('closePop')
    }

    const getData = () => {
        return calcValue
    }

    const setActive = (active) => {
        const classList = sectionRef.current['classList']
        active ? classList.add('active') : classList.remove('active');
    }

    const onClickNext = () => {
        ReactEvent.dispatchEvent('setStep', 2);
    }

    const onClickPreview = () => {
        exeFunc(previewRef, 'open');
    }

    const loadProgress = async () => {
        const resProgress = await ResponseUtils.getSimpleResponse(Api.my.company.irProgress);
        return resProgress;
    }

    const [calcValue, setCalcValue] = useState(15) // 기본 15일
    const handleCalc = (type) => {
        if (type === 'minus') {
            if (calcValue > 0) {
                setCalcValue(calcValue - 1)
            } else {
                return false
            }
        } else {
            if(calcValue < 30) {
                setCalcValue(calcValue + 1)
            } else {
                return false
            }
        }
    }

    const onClickRegistryIr = () => {
        history.push(ROUTER_NAMES.MY_PAGE_IR_BASIC_INFO_WRITE)
    }
    const render = () => {
        if (irInfo.progress === 0) {
            return (
                <div ref={sectionRef} className="popup_section section02">
                    <PopupHeader title={props?.vcData?.ibkVcYn === CheckYn.YES ? '투자심사 요청 (1/5)' : '투자심사 요청 (1/4)'}
                                 handlePopup={close} />
                    <div className="popup_content" css={investReq02Style}>
                        <div className="popup_container01">
                            <p className="main_txt">IR 정보 확인하기</p>
                            <p className="txt">단한번의 IR 작성을 통해 원하는 투자사에게 투자심사요청을 해보세요.</p>
                            <div className="inner_box">
                                <div className="txt_wrap">
                                    <p className="sub_txt">IR 등록이 필요합니다</p>
                                </div>
                                <div className="btn_add" onClick={onClickRegistryIr}>
                                    <p>등록하기</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <PopupFooter>
                        <div className="btn_group">
                            <Button theme={colors.blue} disabled={CheckYn.YES}>
                                다음
                            </Button>
                        </div>
                    </PopupFooter>
                </div>
            )
        } else if (irInfo.progress > 0) {
            return (
                <>
                    <div ref={sectionRef} className="popup_section section03">
                        <PopupHeader title={props?.vcData?.ibkVcYn === CheckYn.YES ? '투자심사 요청 (1/5)' : '투자심사 요청 (1/4)'}
                                     handlePopup={close} />
                        <div className="popup_content" css={investReq01Style}>
                            <div className="popup_container01">
                                <p className="main_txt">IR 정보 확인하기</p>
                                <p className="txt">단한번의 IR 작성을 통해 원하는 투자사에게 투자심사요청을 해보세요.</p>
                                {/* <div className="term_setup">
                                    <span className="label">조회 기간 설정 : </span>
                                    <MinusPlus value={calcValue} handleCalc={handleCalc} />
                                </div> */}
                                <div className="inner_box">
                                    <div className="txt_wrap">
                                        <p className="sub_txt">{irInfo.irTitle}</p>
                                        <p className="DateTime">{DateUtils.customDateFormat(irInfo.lastModifiedTimestamp, 'yyyy년 MM월 dd일 HH시 mm분 ss초')}</p>
                                    </div>
                                    <div className="btn_preview" onClick={onClickPreview}>
                                        <p>자세히보기</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <PopupFooter>
                            <div className="btn_group">
                                <Button theme={colors.blue} onClick={onClickNext}>
                                    다음
                                </Button>
                            </div>
                        </PopupFooter>
                    </div>
                    <IrPreviewPopup ref={previewRef}
                                    irTitle={irInfo.irPopupTitle}
                                    api={IrPreviewApi.vcAudit} />
                </>
            )
        }
    }

    return render();
});

export default RequestStep2;