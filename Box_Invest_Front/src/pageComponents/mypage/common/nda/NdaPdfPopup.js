import React, {forwardRef, useContext, useImperativeHandle, useRef, useState} from 'react';

import PopupHeader from "components/popups/PopupHeader";
import Loading from "components/common/Loading";
import PopupFooter from "components/popups/PopupFooter";
import Button from "components/atomic/Button";

import AlertPopup from "pageComponents/common/pop/AlertPopup";

import CommonAxios from "modules/utils/CommonAxios";
import Api from "modules/consts/Api";
import {exeFunc} from "modules/utils/ReactUtils";
import {AlertLabels} from "modules/consts/BizConst";
import {CommonContext} from "modules/contexts/common/CommomContext";

const NdaPdfPopup = forwardRef((props, ref) => {

    const {ndaPdfFileId} = props;
    const commonContext = useContext(CommonContext);

    const alertPopupRef = useRef();
    const iframeRef = useRef();
    const iframeBodyRef = useRef();
    const iframeLinkRef = useRef("#");

    const [isOpen, setIsOpen] = useState(false);
    const [frameLoad, setFrameLoad] = useState(false);

    useImperativeHandle(ref, () => ({
        open,
        close
    }));

    const open = async () => {
        await commonContext.actions.callbackAfterSessionRefresh(async () => {
            const res = await CommonAxios({
                url: Api.common.fileNdaPdfDownload + "/" + ndaPdfFileId,
                method: 'get',
                responseType: 'blob'
            }, true);

            /**
             * stream src -> iframe이 읽지 못함
             * createObjectURL -> 리액트 라우터 처리에서 문제가 됨
             * ==> FileReader.readAsDataUrl로 임시 base64 link로 처리
             */
            if (res) {
                const blob = new Blob([res.data], {type: res.headers['content-type']});
                // const blob = new Blob([res.data], {type: 'application/pdf'});

                // const objLink = window.URL.createObjectURL(blob);
                const reader = new FileReader();
                reader.readAsDataURL(blob);

                new Promise((resolve => {
                    reader.onload = () => {
                        iframeLinkRef.current = reader.result;
                        resolve();
                    }
                })).then(() => setIsOpen(true))
                    .catch(() => exeFunc(alertPopupRef, 'open', AlertLabels.askAdmin));
            } else {
                exeFunc(alertPopupRef, 'open', AlertLabels.askAdmin);
            }
        }, true, true);
        document.body.classList.add("popupScrollLock");
    }
    const close = () => {
        const iframe = document.querySelector("#ndaPdfIframe");
        if (iframe) iframeBodyRef.current.removeChild(iframe);
        setIsOpen(false);
        setFrameLoad(false);
        document.body.classList.remove("popupScrollLock");
    }

    return (
        <>
            {
                isOpen && (
                    <div className="popup_wrap popup_nda">
                        <div className="popup_layout">&nbsp;</div>
                        <div className="popup_container" style={{width: '1000px', height: '90%'}}>
                            <PopupHeader handlePopup={close}/>
                            <div className="popup_content" style={{height: '90%'}} ref={iframeBodyRef}>
                                {!frameLoad && <Loading/>}
                                <iframe
                                    onLoad={() => {
                                        if (!frameLoad) setFrameLoad(true)
                                    }}
                                    id='ndaPdfIframe'
                                    name='ndaPdfIframe'
                                    src={iframeLinkRef.current}
                                    width='100%' height='100%'
                                    ref={iframeRef}
                                />
                            </div>
                            <PopupFooter>
                                <div className="btn_group">
                                    <Button className={'blue'} onClick={close}>닫기</Button>
                                </div>
                            </PopupFooter>
                        </div>
                        <AlertPopup ref={alertPopupRef}/>
                    </div>
                )
            }
        </>
    )
});

export default NdaPdfPopup;