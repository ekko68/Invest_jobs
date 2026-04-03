import { forwardRef, useContext, useImperativeHandle, useState } from 'react';
import { useHistory } from 'react-router-dom'

import Button from "components/atomic/Button";
import PopupFooter from "components/popups/PopupFooter";
import PopupHeader from "components/popups/PopupHeader";

import { CommonContext } from "modules/contexts/common/CommomContext";
import ROUTER_NAMES from 'modules/consts/RouterConst';

const ConvertRequestPopupNew = forwardRef((props, ref) => {
    const history = useHistory();
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
        // 간접투자 신규에서 삭제
        // if(!StringUtils.hasLength(fileVo.fileId)) {
        //     if(props.alertPopupRef) exeFunc(props.alertPopupRef, 'open', '사업자등록증 파일을 첨부해주세요.');
        //     return;
        // }
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
                                <br />다시 투자 희망기업으로 전환이 불가능합니다&#46;<br />
                                 투자사 전환을 요청하시겠습니까&#63;
                            </div>

                            {/* <div className="file_upload_wrap">
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
                                    <Button type={'linear'} theme={colors.blue}
                                            onClick={() => commonContext.actions.onClickUploadFile(
                                                document.querySelector("#UsisConvertLicenseFile"),
                                                res => setFileVo({fileId: res['fileId'], fileNm: res['fileNm']}),
                                                props.alertPopupRef,
                                                {limitSizeOpt: FileUploadSizeOpt.DEFAULT, acceptExtOpt: FileUploadExtOpt.LICENSE}
                                            )}>
                                        파일추가
                                    </Button>
                                </div>
                                <p className="sub_text">투자사 전환을 위해 사업자등록증을 첨부해주세요.</p>
                            </div> */}

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

export default ConvertRequestPopupNew;