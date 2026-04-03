import React, {forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState} from 'react';

import {colors} from "assets/style/style.config";

import PopupHeader from "components/popups/PopupHeader";
import Input from "components/atomic/Input";
import Button from "components/atomic/Button";
import PopupFooter from "components/popups/PopupFooter";
import AlertPopup from "pageComponents/common/pop/AlertPopup";

import ReactEvent from "modules/utils/ReactEvent";
import {RegexConst} from "modules/consts/Regex";
import {exeFunc} from "modules/utils/ReactUtils";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {CheckYn, FileUploadExtOpt, FileUploadSizeOpt} from "modules/consts/BizConst";

/**
 * 투자심사요청 팝업 병합작업
 * 4. 파일 업로드
 */

const RequestStep4 = forwardRef((props, ref) => {

    const commonContext = useContext(CommonContext);
    
    const alertPopRef = useRef()
    const sectionRef = useRef()

    const resourceInitData = {
        fileId: '',
        fileNm: ''
    };

    const [inputUrl, setInputUrl] = useState('') // 홍보영상
    const [inputResource, setInputResource] = useState({...resourceInitData}); // 발표자료PPT
    const [inputAdditionalResource, setInputAdditionalResource] = useState({...resourceInitData}); // 추가서류
    
    useEffect(() => {}, []);
    useImperativeHandle(ref, () => ({
        init,
        show,
        hide,
        getData,
        setActive
    }));

    const init = () => {
        setInputUrl('')
        setInputResource({...resourceInitData});
        setInputAdditionalResource({...resourceInitData});
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
        return {
            requestResource: inputResource,
            requestAdditionalResource: inputAdditionalResource,
            requestUrl: inputUrl
        }
    }

    const setActive = (active) => {
        const classList = sectionRef.current['classList']
        active ? classList.add('active') : classList.remove('active')
    }

    const onClickPrev = () => {
        ReactEvent.dispatchEvent('setStep', 2)
    }

    const onClickNext = () => {
        if(String(inputUrl).trim() !== '' && String(inputUrl).search(RegexConst.URL_CHECK_REGEX) === -1) {
            exeFunc(alertPopRef, 'open', '홍보영상 URL을 확인해주세요');
            return;
        }

        ReactEvent.dispatchEvent('setStep', 4);
    }

    return (
        <div ref={sectionRef} className="popup_section section05">
            <PopupHeader title={props?.vcData?.ibkVcYn === CheckYn.YES ? '추가자료 제출 (3/5)' : '추가자료 제출 (3/4)'} handlePopup={close} />
            <div className="popup_content">
                <div className="popup_container02">
                    <div className="cnt_wrap">
                        <p className="cnt_title">
                            발표자료 PDF
                        </p>
                        <div className="input_section">
                            <input
                                title='발표자료PDF 파일'
                                type="file"
                                name="file"
                                multiple={false}
                                id={'IrPresentationResource'}
                                accept={FileUploadExtOpt.PDF.str}
                                style={{ display: 'none' }}
                            />
                            <Input name={'input01'} title='발표자료PDF' value={inputResource.fileNm} placeholder={''} readOnly />
                            <Button type={'linear'} theme={colors.blue}
                                    onClick={() => commonContext.actions.onClickUploadFile(
                                        document.querySelector("#IrPresentationResource"),
                                        res => setInputResource({fileId: res['fileId'], fileNm: res['fileNm']}),
                                        alertPopRef,
                                        {limitSizeOpt: FileUploadSizeOpt.FIFTY_MB, acceptExtOpt: FileUploadExtOpt.PDF}
                                    )}>
                                파일첨부
                            </Button>
                        </div>
                        <p className='limit_text'>업로드 가능 최대 파일 용량 : 50MB</p>
                    </div>
                    <div className="cnt_wrap">
                        <p className="cnt_title">
                            추가 서류 <span style={{ fontSize: '12px' }}>(ppt, pptx, doc, docx, pdf, hwp)</span>
                        </p>
                        <div className="input_section">
                            <input
                                title='추가서류 파일'
                                type="file"
                                name="file"
                                multiple={false}
                                id={'IrAdditionalResource'}
                                accept={FileUploadExtOpt.DOC.str}
                                style={{ display: 'none' }}
                            />
                            <Input name={'input01'} title='추가서류' value={inputAdditionalResource.fileNm} placeholder={''} readOnly />
                            <Button type={'linear'} theme={colors.blue}
                                    onClick={() => commonContext.actions.onClickUploadFile(
                                        document.querySelector("#IrAdditionalResource"),
                                        res => setInputAdditionalResource({fileId: res['fileId'], fileNm: res['fileNm']}),
                                        alertPopRef,
                                        {limitSizeOpt: FileUploadSizeOpt.FIFTY_MB, acceptExtOpt: FileUploadExtOpt.DOC}
                                        )}>
                                파일첨부
                            </Button>
                        </div>
                        <p className='limit_text'>업로드 가능 최대 파일 용량 : 50MB</p>
                    </div>
                    <div className="cnt_wrap">
                        <p className="cnt_title">홍보영상</p>
                        <div className="input_section bg_color">
                            <Input
                                title='홍보영상URL'
                                name={'input02'}
                                value={inputUrl}
                                onChange={(e) => setInputUrl(e.target.value)}
                                placeholder={'URL입력'}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <PopupFooter>
                <div className="btn_group">
                    <Button type="linear" theme={colors.blue} onClick={onClickPrev}>
                        이전
                    </Button>
                    <Button theme={colors.blue} onClick={onClickNext}>
                        다음
                    </Button>
                </div>
            </PopupFooter>
            <AlertPopup ref={alertPopRef} />
        </div>
    )
});

export default RequestStep4;