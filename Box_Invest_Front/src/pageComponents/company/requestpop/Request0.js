/** @jsxImportSource @emotion/react */
import React, {useState, forwardRef, useImperativeHandle, useRef, useEffect, useContext} from 'react'
import {PopupInvestReqAgreeStyle, popupRequestStyle, requestIrStyle} from 'assets/style/PopupStyle'
import {colors} from 'assets/style/style.config'
import {popupLayoutStyle} from 'assets/style/ComponentStyle'

import PopupHeader from 'components/popups/PopupHeader'
import PopupFooter from 'components/popups/PopupFooter'
import Button from 'components/atomic/Button'
import Checkbox from 'components/atomic/Checkbox'
import ReactEvent from 'modules/utils/ReactEvent'
import {createKey, deepCopyByRecursion} from "modules/utils/CommonUtils";
import {CheckYn} from "modules/consts/BizConst";
import CommonAxios, {getPostConfig} from "modules/utils/CommonAxios";
import Api from "modules/consts/Api";
import {StringUtils} from "modules/utils/StringUtils";
import {exeFunc} from "modules/utils/ReactUtils";
import {CommonContext} from "modules/contexts/common/CommomContext";

const Request0 = forwardRef((props, ref) => {

    const commonContext = useContext(CommonContext);

    const termsIframeBody1 = useRef();
    const termsIframeBody2 = useRef();

    const initCheckBoxList = [
        {id: 'chk01', value: '동의', status: false},
        {id: 'chk02', value: '동의', status: false},
        {id: 'chkAll', value: '전체동의', status: false}
    ];

    const initTermsData = {
        isCallSuccess: false,
        personalInfo: {
            title: '개인정보 동의 (필수)',
            mnbFileNum: ''
        },
        serviceInfo: {
            title: 'IBK 서비스 제공 동의 (필수)',
            mnbFileNum: ''
        },
    };

    //투자심사 요청하기
    const [checkboxList, setCheckboxList] = useState(deepCopyByRecursion(initCheckBoxList));
    const [termsData, setTermsData] = useState(deepCopyByRecursion(initTermsData));
    const popRef = useRef()

    useImperativeHandle(ref, () => ({
        init,
        open,
        close,
    }));

    const init = () => {
        setCheckboxList(deepCopyByRecursion(initCheckBoxList));
        setTermsData((deepCopyByRecursion(initTermsData)));
    }

    const open = async () => {
        popRef.current.style.display = 'flex';
        await loadTermsInfo();
    }
    const close = () => {
        popRef.current.style.display = 'none';
        removeTermsIframe();
    }

    // 페이지에서 팝업 자체 핸들러 (팝업 닫기)
    const onPopup = () => {
        removeTermsIframe();
        ReactEvent.dispatchEvent('close');
    }

    const removeTermsIframe = () => {
        const iframeBodyRefArr = [termsIframeBody1, termsIframeBody2];

        const iframeIdArr = ['#personalInfoTermsIframe', '#serviceInfoTermsIframe'];

        for (let i = 0; i < iframeBodyRefArr.length; i++) {
            const iframe = document.querySelector(iframeIdArr[i]);
            if (iframe) iframeBodyRefArr[i].current.removeChild(iframe);
        }
    }

    // 투자심사 요청하기 checkbox 핸들러
    const handleCheckbox = (e) => {
        const _checkboxList = deepCopyByRecursion(checkboxList);
        let isSelectAll = true;

        for (let item of _checkboxList) {
            if (item.id == e.target.id) item.status = e.target.checked;
            if (!item.status && item.id !== 'chkAll') isSelectAll = false;
        }

        _checkboxList.find(e => e.id === 'chkAll').status = isSelectAll;
        setCheckboxList(_checkboxList);
    }

    const onSelectAll = (e) => {
        const _checkboxList = deepCopyByRecursion(checkboxList);
        _checkboxList.forEach(item => item.status = e.target.checked);
        setCheckboxList(_checkboxList);
    }

    const onClickNext = () => {
        ReactEvent.dispatchEvent('step', 1)
    }

    const loadTerms = async (url) => {
        const res = await CommonAxios(getPostConfig(url))
        if (res?.status == 200 && res?.data?.code == '200') return res.data.data;
        else return null;
    };

    const loadTermsInfo = async () => {
        let _termsData = {};

        await commonContext.actions.callbackAfterSessionRefresh(async () => {
            return new Promise(resolve => {
                const result = deepCopyByRecursion(termsData);

                let isErr = false;
                let callTermsCheck = 2;

                loadTerms(Api.common.termsBoxPersonalInfo)
                    .then(resData => {
                        if (StringUtils.hasLength(resData?.termsFileNum)) result.personalInfo.mnbFileNum = resData.termsFileNum;
                        else isErr = true;
                        callTermsCheck--;
                    })
                    .catch(err => {
                        console.error(err);
                        isErr = true;
                        callTermsCheck--;
                    });

                loadTerms(Api.common.termsBoxServiceInfo)
                    .then(resData => {
                        if (StringUtils.hasLength(resData?.termsFileNum)) result.serviceInfo.mnbFileNum = resData.termsFileNum;
                        else isErr = true;
                        callTermsCheck--;
                    })
                    .catch(err => {
                        console.error(err);
                        isErr = true;
                        callTermsCheck--;
                    });

                const timer = setInterval(() => {
                    if (callTermsCheck == 0) {
                        clearInterval(timer);
                        result.isCallSuccess = !isErr;
                        resolve(result);
                    }
                });
            }).then(res => _termsData = res);
        }, false, true); // 유저체크는 어차피 앞에서 투자심사 체크시 체킹이 되므로 여기서는 제외처리함

        if (_termsData?.isCallSuccess) {
            setTermsData(_termsData);
        } else {
            if(props.alertPopup) exeFunc(props.alertPopup, 'open', '약관 정보 조회중 에러가 발생했습니다.');
            close();
        }
    };

    useEffect(() => {
        return () => {
            removeTermsIframe();
        }
    }, []);

    return (
        <div ref={popRef} className="popup_wrap popup_policy" css={popupLayoutStyle('500px')} style={{display: 'none'}}>

            <div className="popup_layout">&nbsp;</div>
            <div className="popup_container scroll active_section01" css={popupRequestStyle}>

                {
                    termsData.isCallSuccess &&
                    <div className="popup_section section01">
                        <PopupHeader title={'IR 자료요청'} handlePopup={onPopup}/>
                        <div className="popup_content">
                            <div className="popup_content_wrap">
                                <div className="agree_box_wrap">
                                    <p className="popup_title">서비스 제공 동의</p>

                                    <div className="agree_box">
                                        <div className="agree_box_top">
                                            <span className="title">{termsData.personalInfo.title}</span>
                                            <Checkbox
                                                type={'reverse'}
                                                checkbox={checkboxList[0]}
                                                onChange={handleCheckbox}
                                                checked={checkboxList[0].status}
                                            />
                                        </div>
                                        <div className="agree_box_bottom">
                                            <div className="content" ref={termsIframeBody1}>
                                                <iframe
                                                    id={'personalInfoTermsIframe'}
                                                    width={'100%'} height={'100%'}
                                                    src={`${process.env.REACT_APP_MAIN_BOX_URL}/renderImg.do?fileMngmNo=${termsData.personalInfo.mnbFileNum}`}/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="agree_box">
                                        <div className="agree_box_top">
                                            <span className="title">{termsData.serviceInfo.title}</span>
                                            <Checkbox
                                                type={'reverse'}
                                                checkbox={checkboxList[1]}
                                                onChange={handleCheckbox}
                                                checked={checkboxList[1].status}
                                            />
                                        </div>
                                        <div className="agree_box_bottom">
                                            <div className="content" ref={termsIframeBody2}>
                                                <iframe
                                                    id={'serviceInfoTermsIframe'}
                                                    width={'100%'} height={'100%'}
                                                    src={`${process.env.REACT_APP_MAIN_BOX_URL}/renderImg.do?fileMngmNo=${termsData.serviceInfo.mnbFileNum}`}/>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="agree_box">
                                        <div className="agree_box_top">
                                            <span className="title"> </span>
                                            <Checkbox
                                                type={'reverse'}
                                                checkbox={checkboxList[2]}
                                                onChange={onSelectAll}
                                                checked={checkboxList[2].status}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <PopupFooter>
                            <div className="btn_group">
                                {/*<Button theme={colors.blue} onClick={onClickNext} disabled={checkboxList[3].status === false ? CHECK_YN.YES : 'N'}>*/}
                                <Button theme={colors.blue} onClick={onClickNext} disabled={checkboxList[2].status === false ? CheckYn.YES : CheckYn.NO}>
                                    동의
                                </Button>
                            </div>
                        </PopupFooter>
                    </div>
                }

            </div>

        </div>
    );
});

export default Request0;
