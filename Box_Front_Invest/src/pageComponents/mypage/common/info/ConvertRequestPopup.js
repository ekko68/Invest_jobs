import React, {forwardRef, useContext, useImperativeHandle, useState} from 'react';
import {colors} from "assets/style/style.config";

import PopupHeader from "components/popups/PopupHeader";
import PopupFooter from "components/popups/PopupFooter";
import Button from "components/atomic/Button";

import {FileUploadExtOpt, FileUploadSizeOpt} from "modules/consts/BizConst";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {StringUtils} from "modules/utils/StringUtils";
import {exeFunc} from "modules/utils/ReactUtils";

const ConvertRequestPopup = forwardRef((props, ref) => {

    const commonContext = useContext(CommonContext);
    const [isOpen, setIsOpen] = useState(false);

    const [fileVo, setFileVo] = useState({
        fileId: '',
        fileNm: '',
    });

    useImperativeHandle(ref, () => ({
        open,
        close
    }))

    const open = () => {
        setIsOpen(true);
        document.body.classList.add("popupScrollLock");
    }

    const close = () => {
        setIsOpen(false);
        document.body.classList.remove("popupScrollLock");
    }

    const onConfirm = () => {
        if(!StringUtils.hasLength(fileVo.fileId)) {
            if(props.alertPopupRef) exeFunc(props.alertPopupRef, 'open', '사업자등록증 파일을 첨부해주세요.');
            return;
        }

        setIsOpen(false);
        if(props.onConfirm) props.onConfirm(fileVo);
        document.body.classList.remove("popupScrollLock");
    }

    const render = () => {
        if(isOpen === false) {
            return <></>
        } else {
            return (
                <div className="popup_wrap popup_confirm popup_investor_switch">
                    <div className="popup_layout">&nbsp;</div>
                    <div className="popup_container scroll ">
                        <PopupHeader title={''} handlePopup={close} className="popup_header" />
                        <div className="popup_content_wrap">
                            <div className="text grey">
                                <p className={'highlight_full_lemon'}>
                                    <span className="text title">투자사 전환 요청 관련 안내</span>
                                </p>
                                투자사로 전환될 경우
                                <br /> 기존 입력된 &#39;내 정보&#39; 이외 데이터는 모두 삭제되고 다시 투자 희망기업으로 전환이
                                불가능합니다&#46; 투자사 전환을 요청하시겠습니까&#63;
                            </div>

                            <div className="file_upload_wrap">
                                <div className="file_upload">

                                    <input
                                        title='사업자등록증 파일'
                                        type="file"
                                        name="file"
                                        multiple={false}
                                        id={'UsisConvertLicenseFile'}
                                        accept={FileUploadExtOpt.LICENSE.str}
                                        style={{ display: 'none' }}
                                    />
                                    <input className="input" title='추가서류' value={fileVo.fileNm} placeholder={''} readOnly/>
                                    <button type={'linear'}
                                            onClick={() => commonContext.actions.onClickUploadFile(
                                                document.querySelector("#UsisConvertLicenseFile"),
                                                res => setFileVo({fileId: res['fileId'], fileNm: res['fileNm']}),
                                                props.alertPopupRef,
                                                {limitSizeOpt: FileUploadSizeOpt.DEFAULT, acceptExtOpt: FileUploadExtOpt.LICENSE}
                                            )}>
                                        파일추가
                                    </button>
                                </div>
                                <p className="sub_text">투자사 전환을 위해 사업자등록증을 첨부해주세요.</p>
                            </div>

                        </div>
                        <PopupFooter>
                            <div className="btn_group gap investor_switch_info_btn">
                                <Button className={'light_grey'} onClick={close}>취소</Button>
                                <Button className={'blue'} onClick={onConfirm}>투자사전환요청</Button>
                            </div>
                        </PopupFooter>
                    </div>
                </div>
            )
        }
    }

    return render();
});

export default ConvertRequestPopup;