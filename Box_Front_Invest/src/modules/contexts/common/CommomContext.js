/**
 * 공통 Context
 */
import React, {useContext, useEffect, useRef, useState} from 'react'

import CommonAxios from "modules/utils/CommonAxios";
import {getConfig} from "modules/utils/CommonAxios";
import Api from "modules/consts/Api";
import {CheckYn, FileUploadExtOpt, FileUploadSizeOpt} from "modules/consts/BizConst";
import {exeFunc} from "modules/utils/ReactUtils";
import ResponseUtils from "modules/utils/ResponseUtils";
import {isNumber} from "modules/utils/NumberUtils";
import {LoginContext} from "modules/contexts/common/LoginContext";

const CommonContext = React.createContext({
    state: {},
    actions: {}
});

const {Provider} = CommonContext;

const CommonContextProvider = ({children}) => {

    /** login context */

    const loginContext = useContext(LoginContext);

    /** state */

    const [alarmNotice, setAlarmNotice] = useState({
        unreadYn: CheckYn.NO,
        // count: 0
    });

    /** file upload ========================================================================== */
    const onClickUploadFile = (fileInput = null
                               , setFileFunc = (res) => {}
                               , alertPopupRef
                               , options
                                   ={limitSizeOpt: FileUploadSizeOpt.DEFAULT, acceptExtOpt: FileUploadExtOpt.ALL}) => {
        if(fileInput) {
            fileInput.click();
            fileInput.addEventListener('change', (event) => onChangeUploadFile(event, setFileFunc, alertPopupRef, options), {once: true});
        }
    }

    const onChangeUploadFile = async (event, setFileFunc = (res) => {}, alertPopupRef = null, options={}) => {
        await loginContext.actions.callbackAfterSessionRefresh(async () => {
            if (event.target.files?.length > 0) {
                const file = event.target.files[0];

                const limitSizeOpt =
                    isNumber(options?.limitSizeOpt?.size) ? options.limitSizeOpt : FileUploadSizeOpt.DEFAULT;

                let isExtPass = true;
                if(options?.acceptExtOpt?.list?.length > 0) {
                    const ext = file.name.substring(file.name.lastIndexOf('.'));
                    if (options.acceptExtOpt.list.findIndex(e => e === ext) < 0) isExtPass = false;
                }

                if(file.size > limitSizeOpt.size) {
                    if(alertPopupRef) exeFunc(alertPopupRef, 'open', `업로드 파일 용량(${limitSizeOpt.name} 이하)을 초과 하였습니다.`);
                } else if (!isExtPass) {
                    if(alertPopupRef) exeFunc(alertPopupRef, 'open', '파일 확장자를 확인해 주세요.');
                } else {
                    const res = await ResponseUtils.getFileUploadResponse(file);
                    if (res && setFileFunc) setFileFunc(res);
                }
            } else {
                if(alertPopupRef) exeFunc(alertPopupRef, 'open', '잠시 후에 다시 시도해주세요.');
            }

            event.target.value = '';
        }, true, true);
    }

    /** ========================================================================== file upload */

    /** alarm ================================================================================ */
    const checkAlarmNotice = async (isLoading=false) => {
        // if(!StringUtils.hasLength(sessionStorage.getItem("token"))) return;
        if(!window.tokenCheck()) return;

        const res = await CommonAxios(getConfig(Api.common.alarmInvestUnread, null), isLoading);
        if(res.data?.code == '200') setAlarmNotice({...alarmNotice, unreadYn: res.data.data.unreadYn});
    }

    const setAlarmUnreadYn = (unreadYn) => {
        setAlarmNotice({...alarmNotice, unreadYn: unreadYn});
    }

    /** ================================================================================ alarm */


    /** common context useEffect hook */
    const alarmInterval = useRef();

    useEffect(() => {
        console.log('common context mount');

        // 알림의 경우 context 로드 후 1분 간격으로 호출
        // 알림의 경우 토큰 재갱신 없이 작동하도록 처리
        // 로그인 혹은 세션 변동이 되면 결과적으로 페이지 이동으로 인해 context는 다시 마운트됨
        if(window.tokenCheck()) {
            console.log('first alarm check');
            checkAlarmNotice();

            if(alarmInterval.current !== null) clearInterval(alarmInterval.current);
            alarmInterval.current = setInterval(() => {
                if(!tokenCheck()) clearInterval(alarmInterval.current);
                else {
                    console.log('interval alarm check');
                    checkAlarmNotice();
                }
            }, 1000 * 60);
        }

        return () => {
            clearInterval(alarmInterval.current);
        }
    }, []);

    const contextValue = {
        state: {
            alarmNotice,

            ...loginContext.state,
            /*
             위 loginContext.state 포함된 목록
             user,
             tokenRefreshToggle
             */
        },
        actions: {
            onClickUploadFile,

            checkAlarmNotice,
            setAlarmUnreadYn,

            ...loginContext.actions,
            /*
             위 loginContext.actions에 포함된 목록
             contextMountUserInfoSet,
             pageMountPathCheck,
             userChangeCheck,
             callbackAfterOnlyLoginCheck,
             callbackAfterSessionRefresh,
             refreshToken,
             logout,
             */
        }
    }
    return <Provider value={contextValue}>{children}</Provider>
}

export {CommonContext, CommonContextProvider}
