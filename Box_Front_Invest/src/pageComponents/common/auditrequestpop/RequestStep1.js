import React, {forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState} from 'react';

import {colors} from "assets/style/style.config";

import PopupHeader from "components/popups/PopupHeader";
import Checkbox from "components/atomic/Checkbox";
import PopupFooter from "components/popups/PopupFooter";
import Button from "components/atomic/Button";

import AlertPopup from "pageComponents/common/pop/AlertPopup";

import ReactEvent from "modules/utils/ReactEvent";
import {CheckYn, PopupApiStatus} from "modules/consts/BizConst";
import {exeFunc} from "modules/utils/ReactUtils";
import CommonAxios, {getPostConfig, loader} from "modules/utils/CommonAxios";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {deepCopyByRecursion} from "modules/utils/CommonUtils";
import Api from "modules/consts/Api";
import {StringUtils} from "modules/utils/StringUtils";
import {LOGIN_LINK_KEYS} from "modules/contexts/common/LoginContext";

/**
 * 투자심사요청 팝업 병합작업
 * 1. 정보 동의
 */

const RequestStep1 = forwardRef((props, ref) => {

    const commonContext = useContext(CommonContext);

    const alertPopupRef = useRef();
    const infotechStatusRef = useRef("fail");
    const sectionRef = useRef();

    const termsIframeBody1 = useRef();
    const termsIframeBody2 = useRef();
    const termsIframeBody3 = useRef();
    const termsIframeBody4 = useRef();
    const termsIframeBody5 = useRef();

    const initData = [
        {id: 'chk01', value: '동의', status: false},
        {id: 'chk02', value: '동의', status: false},
        {id: 'chk03', value: '동의', status: false},
        {id: 'chk04', value: '동의', status: false},
        {id: 'chk05', value: '동의', status: false},
        {id: 'chk06', value: '전체동의', status: false}
    ]

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
        tradeIndfoView: {
            title: '거래정보 조회 위임 동의',
            mnbFileNum: ''
        },
        autoCollectMandatory: {
            title: '개인(신용)정보 수집 이용 제공 동의',
            mnbFileNum: ''
        },
        autoCollectChoice: {
            title: '개인(신용)정보 수집 이용 동의 (고객 맞춤 서비스 및 상품 추천)',
            mnbFileNum: ''
        }
    };

    const [checkboxList, setCheckboxList] = useState(deepCopyByRecursion(initData));
    const [termsData, setTermsData] = useState(deepCopyByRecursion(initTermsData));

    useImperativeHandle(ref, () => ({
        init,
        show,
        hide,
        setActive,
        getData,
    }))

    const init = () => {
        setCheckboxList(deepCopyByRecursion(initData));
        setTermsData((deepCopyByRecursion(initTermsData)));
    }

    const loadTerms = async (url) => {
        const res = await CommonAxios(getPostConfig(url))
        if (res?.status == 200 && res?.data?.code == '200') return res.data.data;
        else return null;
    }

    const loadTermsInfo = async () => {
        let _termsData = {};

        await commonContext.actions.callbackAfterSessionRefresh(async () => {
            return new Promise(resolve => {
                const result = deepCopyByRecursion(termsData);
                let isErr = false;
                let callTermsCheck = 3;

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
                loadTerms(Api.common.termsBoxAutoCollect)
                    .then(resData => {
                        if (StringUtils.isAnyBlank(resData?.collectMandatoryTermsFileNum, resData?.collectChoiceTermsFileNum, resData?.tradeViewTermsFileNum)) {
                            isErr = true;
                        } else {
                            result.tradeIndfoView.mnbFileNum = resData?.tradeViewTermsFileNum;
                            result.autoCollectMandatory.mnbFileNum = resData?.collectMandatoryTermsFileNum;
                            result.autoCollectChoice.mnbFileNum = resData?.collectChoiceTermsFileNum;
                        }
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
        }, true, true);

        if (_termsData?.isCallSuccess) {
            setTermsData(_termsData);
        } else {
            exeFunc(alertPopupRef, 'open', '약관 정보 조회중 에러가 발생했습니다.');
            close();
        }
    }

    const removeTermsIframe = () => {
        const iframeBodyRefArr= [termsIframeBody1, termsIframeBody2, termsIframeBody3,
            termsIframeBody4, termsIframeBody5];

        const iframeIdArr = ['#personalInfoTermsIframe', '#serviceInfoTermsIframe', '#tradeInfoViewTermsIframe',
            '#autoCollectMandatoryTermsIframe', '#autoCollectChoiceTermsIframe'];

        for(let i = 0; i < iframeBodyRefArr.length; i++) {
            const iframe = document.querySelector(iframeIdArr[i]);
            if(iframe) iframeBodyRefArr[i].current.removeChild(iframe);
        }
    }

    const show = () => {
        setActive(true)
    }

    const hide = () => {
        removeTermsIframe();
        setActive(false)
    }

    const close = () => {
        removeTermsIframe();
        ReactEvent.dispatchEvent('closePop')
    }

    const getData = () => {
        // return '스크래핑 자동 수집 관련 전체동의 리턴'
        // return checkboxList.find(e => e.id === 'chk03').status;
        return (checkboxList[2].status && checkboxList[3].status && checkboxList[4].status);
    }

    const setActive = (active) => {
        const classList = sectionRef.current['classList']
        active ? classList.add('active') : classList.remove('active')
    }

    const handleCheckbox = (e) => {
        const id = e.target.id
        const chk = e.target.checked
        const temp = []
        let isSelectAll = true
        for (let i = 0; i < checkboxList.length; i++) {
            const chkItem = checkboxList[i]
            if (chkItem.id === id) {
                chkItem.status = chk
            }
            if (i < checkboxList.length - 1) {
                if (chkItem.status === false) {
                    isSelectAll = false
                }
            }
            temp.push(chkItem)
        }
        temp[5].status = isSelectAll // 전체동의
        setCheckboxList(temp)
    }

    const onSelectAll = (e) => {
        const chk = e.target.checked
        const _checkboxList = checkboxList.map(item => { return {...item, status: chk} });
        setCheckboxList(_checkboxList);
    }

    const onClickNext = async () => {

        // 스크래핑 자동 수집 동의 여부 (-> 동의하지 않으면 Intotech 인증키 갱신 없이 이동)
        if (!(checkboxList[2].status && checkboxList[3].status && checkboxList[4].status)) {
            ReactEvent.dispatchEvent('setStep', 1);
        } else {
            // 인포텍 등록 팝업을 띄울 때 세션 재갱신을 한번 처리
            await commonContext.actions.callbackAfterSessionRefresh(async () => {

                // 인포텍 만료기간 갱신을 위해 이미 clientCertKey가 존재하더라도 무조건 띄움
                // 등록, 갱신은 서버 서비스에서 자체적으로 처리
                // const resCert = await ResponseUtils.getSimpleResponse(Api.common.testDocInfotechCert, null);
                // if(StringUtils.hasLength(resCert)) {
                //   exeFunc(alertPopupRef, 'open', '이미 인증서가 존재합니다');
                //   return;
                // }

                // 인포텍 팝업 오픈
                const popupWidth = 695;
                // const popupHeight = 660;
                const popupHeight = 520;
                const popupX = (window.screen.width / 2) - (popupWidth / 2);
                const popupY = (window.screen.height / 2) - (popupHeight / 2);
                infotechStatusRef.current = 'fail';
                // let popObj = window.open(
                //     `//${window.location.host}/infotech/infotech.html?csnNmbnYn=N&profile=${process.env.REACT_APP_PROFILE}`,
                //     "인포텍",
                //     'status=no, height=' + popupHeight + ', width=' + popupWidth + ', left='+ popupX + ', top='+ popupY
                // );
                let popObj = window.open(
                    `//${window.location.host}/infotech/infotechPop.html?csnNmbnYn=N&profile=${process.env.REACT_APP_PROFILE}`,
                    "인포텍",
                    'status=no, height=' + popupHeight + ', width=' + popupWidth + ', left=' + popupX + ', top=' + popupY
                );

                setTimeout(() => {
                    loader(true);
                    // 세션 타이머 설정
                    sessionStorage.setItem(LOGIN_LINK_KEYS.TOKEN_TIMER_STOP, "stop");
                }, 100);

                window.infotechPopupParentCallback = (status) => {
                    infotechStatusRef.current = status;
                }

                let timer = setInterval(() => {
                    if (popObj.closed) {
                        clearInterval(timer);
                        loader(false);
                        if (infotechStatusRef.current === PopupApiStatus.SUCCESS) {
                            ReactEvent.dispatchEvent('setStep', 1);
                        } else if (infotechStatusRef.current === PopupApiStatus.ERROR) {
                            // exeFunc(alertPopupRef, 'open', AlertLabels.askAdmin);
                            exeFunc(alertPopupRef, 'open', '인증서 조회 및 등록에 실패하였습니다.');
                        }
                    }
                }, 500);

                const tokenTimer = setInterval(() => {
                    // console.log("tokenTimerCnt :" + ++tokenTimerCnt);
                    if (popObj.closed) {
                        sessionStorage.removeItem(LOGIN_LINK_KEYS.TOKEN_TIMER_STOP);
                        clearInterval(tokenTimer);
                    } else commonContext.actions.refreshToken();
                }, 10000);

            }, true, false);
        }
    }

    const onClickCancel = () => {
        close()
    }

    useEffect(() => {
        loadTermsInfo();

        return () => {
            removeTermsIframe();
        }
    }, [])

    return (
        <>
            {
                termsData.isCallSuccess &&
                <div ref={sectionRef} className="popup_section section01 active">
                    <PopupHeader title={'투자심사 요청하기'} handlePopup={close}/>
                    <div className="popup_content">
                        <div className="popup_content_wrap">
                            <div className="agree_box_wrap">
                                <p className="popup_title">개인정보 동의</p>
                                <div className="agree_box">
                                    <div className="agree_box_top">
                                        {/*<span className="title">{ContractText.AUDIT_REQUEST.PERSONAL_INFO_AGREE.title + " (필수)"}</span>*/}
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
                                        {/*<span className="title">{ContractText.AUDIT_REQUEST.SERVICE_OFFER_AGREE.title + " (필수)"}</span>*/}
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
                                        <span className="title">{termsData.tradeIndfoView.title}</span>
                                        <Checkbox
                                            type={'reverse'}
                                            checkbox={checkboxList[2]}
                                            onChange={handleCheckbox}
                                            checked={checkboxList[2].status}
                                        />
                                    </div>
                                    <div className="agree_box_bottom">
                                        <div className="content" ref={termsIframeBody3}>
                                            <iframe
                                                id={'tradeInfoViewTermsIframe'}
                                                width={'100%'} height={'100%'}
                                                src={`${process.env.REACT_APP_MAIN_BOX_URL}/renderImg.do?fileMngmNo=${termsData.tradeIndfoView.mnbFileNum}`}/>
                                        </div>
                                    </div>
                                </div>

                                <div className="agree_box">
                                    <div className="agree_box_top">
                                        <span className="title">{termsData.autoCollectMandatory.title}</span>
                                        <Checkbox
                                            type={'reverse'}
                                            checkbox={checkboxList[3]}
                                            onChange={handleCheckbox}
                                            checked={checkboxList[3].status}
                                        />
                                    </div>
                                    <div className="agree_box_bottom">
                                        <div className="content" ref={termsIframeBody4}>
                                            <iframe
                                                id={'autoCollectMandatoryTermsIframe'}
                                                width={'100%'} height={'100%'}
                                                src={`${process.env.REACT_APP_MAIN_BOX_URL}/renderImg.do?fileMngmNo=${termsData.autoCollectMandatory.mnbFileNum}`}/>
                                        </div>
                                    </div>
                                </div>


                                <div className="agree_box">
                                    <div className="agree_box_top">
                                        <span className="title">{termsData.autoCollectChoice.title}</span>
                                        <Checkbox
                                            type={'reverse'}
                                            checkbox={checkboxList[4]}
                                            onChange={handleCheckbox}
                                            checked={checkboxList[4].status}
                                        />
                                    </div>
                                    <div className="agree_box_bottom">
                                        <div className="content" ref={termsIframeBody5}>
                                            <iframe
                                                id={'autoCollectChoiceTermsIframe'}
                                                width={'100%'} height={'100%'}
                                                src={`${process.env.REACT_APP_MAIN_BOX_URL}/renderImg.do?fileMngmNo=${termsData.autoCollectChoice.mnbFileNum}`}/>
                                        </div>
                                    </div>
                                </div>


                                <div className="agree_box">
                                    <div className="agree_box_top">
                                        <span className="title"> </span>
                                        <Checkbox
                                            type={'reverse'}
                                            checkbox={checkboxList[5]}
                                            onChange={onSelectAll}
                                            checked={checkboxList[5].status}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <PopupFooter>
                        <div className="btn_group">
                            <Button className={'button'} onClick={onClickCancel}>
                                취소
                            </Button>
                            {/* 자동 정보 수집 동의는 건너뛸 수 있다*/}
                            <Button theme={colors.blue} onClick={onClickNext} disabled={(checkboxList[0].status === true && checkboxList[1].status === true) ? CheckYn.NO : CheckYn.YES}>
                                다음
                            </Button>
                        </div>
                    </PopupFooter>
                    <AlertPopup ref={alertPopupRef}/>
                </div>
            }
        </>
    )
});

export default RequestStep1;