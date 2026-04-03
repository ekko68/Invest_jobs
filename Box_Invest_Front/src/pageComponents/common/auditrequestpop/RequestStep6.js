import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';

import {investReq04Style} from "assets/style/PopupStyle";
import {colors} from "assets/style/style.config";

import PopupHeader from "components/popups/PopupHeader";
import PopupFooter from "components/popups/PopupFooter";
import Button from "components/atomic/Button";
import Input from "components/atomic/Input";

import AlertPopup from "pageComponents/common/pop/AlertPopup";

import ReactEvent from "modules/utils/ReactEvent";
import {exeFunc, setFunc} from "modules/utils/ReactUtils";
import {StringUtils} from "modules/utils/StringUtils";
import {RecommendBranchPopup, RecommendEmployeePopup} from "./RcmdBrncSearchPopup";
import {deepCopyByRecursion} from "modules/utils/CommonUtils";
import {CheckYn} from "modules/consts/BizConst";

const RequestStep6 = forwardRef((props, ref) => {

    const initData = {
        brcd: '',
        krnBrm: '',

        emn: '',
        emm: '',
    }

    const sectionRef = useRef();
    const alertPopupRef = useRef();

    const rcmdBrncPopRef = useRef();
    const rcmdBrncEmpPopRef = useRef();

    const [rcmdData, setRcmdData] = useState({...initData});

    useImperativeHandle(ref, () => ({
        init,
        show,
        hide,
        getData,
        setActive
    }));

    const init = () => {
        setRcmdData({...initData});
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
        return deepCopyByRecursion(rcmdData);
    }
    const setActive = (active) => {
        const classList = sectionRef.current['classList']
        active ? classList.add('active') : classList.remove('active')
    }

    const onClickSubmit = () => {
        ReactEvent.dispatchEvent('openConfirm')
    }

    return (
        <>
            <div ref={sectionRef} className="popup_section section05">
                <PopupHeader title={'추천 영업점 및 직원 (선택) (5/5)'} handlePopup={close} />
                <div className="popup_content" css={investReq04Style}>
                    <div className="popup_container02">
                        <div className="cnt_wrap">
                            <p className="cnt_title">
                                추천영업점
                            </p>
                            <div className="input_section">
                                <Input name={'input01'} title='추천영업점'
                                       value={StringUtils.hasLength(rcmdData.brcd)
                                           ? `${rcmdData.krnBrm} (${rcmdData.brcd})` : ''}
                                       placeholder={''} readOnly />
                                <Button type={'linear'} theme={colors.blue}
                                        onClick={() => exeFunc(rcmdBrncPopRef, 'open')}>
                                    찾기
                                </Button>
                            </div>
                        </div>

                        <div className="cnt_wrap">
                            <p className="cnt_title">
                                추천직원
                            </p>
                            <div className="input_section">
                                <Input name={'input02'} title='추천직원'
                                       value={StringUtils.hasLength(rcmdData.emn)
                                           ?`${rcmdData.emm} (${rcmdData.emn})` : ''}
                                       placeholder={''} readOnly />
                                <Button type={'linear'} theme={colors.blue}
                                        onClick={() => exeFunc(rcmdBrncEmpPopRef, 'open')}>
                                    찾기
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
                <PopupFooter>
                    <div className="btn_group">
                        <Button type="linear" theme={colors.blue} onClick={() => ReactEvent.dispatchEvent('setStep', 4)}>
                            이전
                        </Button>
                        <Button theme={colors.blue} disabled={CheckYn.NO} onClick={onClickSubmit}>
                            제출
                        </Button>
                    </div>
                </PopupFooter>
            </div>
            <AlertPopup ref={alertPopupRef} />
            <RecommendBranchPopup ref={rcmdBrncPopRef} alertPopupRef={alertPopupRef}
                                  setBranch={(krnBrm, brcd) => setRcmdData({
                                      ...rcmdData,
                                      krnBrm: krnBrm,
                                      brcd: brcd
                                  })} />
            <RecommendEmployeePopup ref={rcmdBrncEmpPopRef} alertPopupRef={alertPopupRef}
                                    brcd={rcmdData.brcd}
                                    setEmp={(emm, emn) => setRcmdData({
                                        ...rcmdData,
                                        emm: emm,
                                        emn: emn
                                    })} />
        </>
    )
});

export default RequestStep6;