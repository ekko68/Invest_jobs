import React, {forwardRef, useContext, useImperativeHandle, useRef, useState} from 'react';

import PopupHeader from "components/popups/PopupHeader";
import Button from "components/atomic/Button";
import {colors} from "assets/style/style.config";

import Api from "modules/consts/Api";
import {exeFunc} from "modules/utils/ReactUtils";
import {createKey} from "modules/utils/CommonUtils";
import {StringUtils} from "modules/utils/StringUtils";
import {CommonContext} from "modules/contexts/common/CommomContext";
import CommonAxios, {getPostConfig} from "modules/utils/CommonAxios";

export const RecommendBranchPopup = forwardRef((props, ref) => {

    // 기존 소스 팝업들이 forwardRef로 처리되어 있어 통일
    const {setBranch = null, alertPopupRef = null} = props;
    const commonContext = useContext(CommonContext);

    const inputRef = useRef();

    const [isOpen, setIsOpen] = useState(false);
    const [searchList, setSearchList] = useState([]);

    useImperativeHandle(ref, () => ({
        open,
        close
    }));

    const open = () => {
        setIsOpen(true);
    }

    const close = () => {
        // init
        inputRef.current.value = '';
        setSearchList([]);

        setIsOpen(false);
    }

    const search = () => {
        if(!StringUtils.hasLength(inputRef.current.value)) {
            if(alertPopupRef !== null) exeFunc(alertPopupRef, 'open', '검색어를 입력해주세요.');
            return;
        }

        commonContext.actions.callbackAfterSessionRefresh(async () => {
            const res = await CommonAxios(getPostConfig(Api.common.ibkBrncList, {searchContent: inputRef.current.value}));
            if (res?.data?.code == '200' && Array.isArray(res.data.data.list)) setSearchList(res.data.data.list);
            else setSearchList([]);
        }, true, true);
    }

    return (
        <>
            {
                isOpen &&
                <div className="popup_wrap reco_popup">
                    <div className="popup_layout">&nbsp;</div>
                    <div className="popup_container">
                        <PopupHeader title={'추천 영업점 조회'} handlePopup={close}/>
                        <div className="popup_content">
                            <div className="cnt_wrap">
                                <div className="input_section">
                                    <input ref={inputRef} placeholder={'영업점이름 또는 영업점 코드를 입력하세요.'}/>
                                    <Button theme={colors.blue} type={'linear'} onClick={search}>조회</Button>
                                </div>

                                <div className="reco_search_wrap">
                                    {
                                        (searchList?.length > 0)
                                            ?   <div className="reco_search">
                                                <ul className="reco_search_list scroll">
                                                    {
                                                        searchList.map(item => (
                                                            <li className="reco_search_item"
                                                                style={{cursor:'pointer'}}
                                                                key={createKey()}
                                                                onClick={() => {
                                                                    if(setBranch !== null) {
                                                                        setBranch(item.krnBrm, item.brcd);
                                                                        close();
                                                                    }
                                                                }}>
                                                                {`-${item.krnBrm}(${item.brcd})`}
                                                            </li>
                                                        ))
                                                    }
                                                </ul>
                                            </div>

                                            :   <div className="reco_search">
                                                <div className="reco_search_nodata">
                                                    일치하는 영업점이 없습니다.
                                                </div>
                                            </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    )
});

export const RecommendEmployeePopup = forwardRef((props, ref) => {

    // 기존 소스 팝업들이 forwardRef로 처리되어 있어 통일

    // setEmp = (emm, emn) => {}
    const {brcd = '', setEmp = null, alertPopupRef = null} = props;
    const commonContext = useContext(CommonContext);

    const inputRef = useRef();

    const [isOpen, setIsOpen] = useState(false);
    const [searchList, setSearchList] = useState([]);

    useImperativeHandle(ref, () => ({
        open,
        close
    }));

    const open = () => {
        // 영업점 번호가 있어야만 띄울 수 있음
        if (!StringUtils.hasLength(brcd)) {
            if (alertPopupRef !== null) exeFunc(alertPopupRef, 'open', '추천 영업점을 먼저 선택해 주세요.');
            return;
        }
        setIsOpen(true);
    }

    const close = () => {
        // init
        inputRef.current.value = '';
        setSearchList([]);

        setIsOpen(false);
    }

    const search = () => {
        if (!StringUtils.hasLength(brcd)) {
            if (alertPopupRef !== null) exeFunc(alertPopupRef, 'open', '추천 영업점을 먼저 선택해 주세요.');
            return;
        }

        const searchNm = StringUtils.hasLength(inputRef.current.value) ? inputRef.current.value : '';

        commonContext.actions.callbackAfterSessionRefresh(async () => {
            const res = await CommonAxios(getPostConfig(Api.common.ibkBrncEmpList, {brcd: brcd, empNm: searchNm}));
            if (res?.data?.code == '200' && Array.isArray(res.data.data.list)) setSearchList(res.data.data.list);
            else setSearchList([]);
        }, true, true);
    }

    return (
        <>
            {
                isOpen &&
                <div className="popup_wrap reco_popup">
                    <div className="popup_layout">&nbsp;</div>
                    <div className="popup_container">
                        <PopupHeader title={'추천 직원 조회'} handlePopup={close}/>
                        <div className="popup_content">
                            <div className="cnt_wrap">
                                <div className="input_section">
                                    <input ref={inputRef} placeholder={'추천 직원 이름을 입력하세요.'}/>
                                    <Button theme={colors.blue} type={'linear'} onClick={search}>조회</Button>
                                </div>

                                <div className="reco_search_wrap">
                                    {
                                        (searchList?.length > 0)
                                            ? <div className="reco_search">
                                                <ul className="reco_search_list scroll">
                                                    {
                                                        searchList.map(item => (
                                                            <li className="reco_search_item"
                                                                style={{cursor:'pointer'}}
                                                                key={createKey()}
                                                                onClick={() => {
                                                                    if (setEmp !== null) {
                                                                        setEmp(item.emm, item.emn);
                                                                        close();
                                                                    }
                                                                }}>
                                                                {`-${item.emm}(${item.emn})`}
                                                            </li>
                                                        ))
                                                    }
                                                </ul>
                                            </div>
                                            : <div className="reco_search">
                                                <div className="reco_search_nodata">
                                                    일치하는 직원이 없습니다.
                                                </div>
                                            </div>
                                    }
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            }
        </>
    )
});