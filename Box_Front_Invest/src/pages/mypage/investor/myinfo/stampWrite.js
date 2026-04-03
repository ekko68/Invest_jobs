/** @jsxImportSource @emotion/react */
import React, {useContext, useEffect, useRef, useState} from "react";
import {useHistory} from "react-router-dom";

import Header from 'components/header/Header'
import Footer from 'components/common/Footer'
import Gallery01 from 'components/common/Gallery01'
import BreadCrumbs from 'components/common/BreadCrumbs'
import Button from 'components/atomic/Button'

import ProfileImage from "pageComponents/mypage/common/ProfileImage";
import StampDeletePopup from "pageComponents/mypage/common/info/StampDeletePopup";
import AlertPopup from "pageComponents/common/pop/AlertPopup";
import ConfirmPopup from "pageComponents/common/pop/ConfirmPopup";
import CheckCloseCallBackAlertPopup from "pageComponents/common/pop/CheckCloseCallBackAlertPopup";

import {exeFunc, setFunc} from "modules/utils/ReactUtils";
import CommonAxios from "modules/utils/CommonAxios";
import {AlertLabels, FileUploadExtOpt, FileUploadSizeOpt} from "modules/consts/BizConst";
import ResponseUtils from "modules/utils/ResponseUtils";
import {StringUtils} from "modules/utils/StringUtils";
import ROUTER_NAMES from "modules/consts/RouterConst";
import Api from "modules/consts/Api";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {isNumber} from "../../../../modules/utils/NumberUtils";

const StampWrite = (props) => {

    const commonContext = useContext(CommonContext);

    const galleryData = {
        title: '마이페이지',
        img: '/images/gallery02_img1.png'
    }

    const [vo, setVo] = useState({
        utlinsttId: '',
        rgslImgFileId: '',
        signBase64File: '',
        rgsnUserId: '',
        amnnUserId: '',
        rgsnTs: '',
        amnnTs: ''
    });

    const [stampUploadFile, setStampUploadFile] = useState({
        fileName: '',
        fileUrl: '',
        file: {}
    });

    const stampFileRef = useRef();
    const deletePopupRef = useRef();
    const confirmPopupRef = useRef();
    const alertPopupRef = useRef();
    const autoCloseCallBackPopupRef = useRef();

    const history = useHistory();


    const onClickDelete = () => {
        setFunc(deletePopupRef, 'open');
    }

    const deleteConfirm = () => {
        setVo({
            ...vo,
            rgslImgFileId: '',
            signBase64File: ''
        });
        setStampUploadFile({
            fileName: '',
            fileUrl: '',
            file: {}
        });
    }

    const onClickSave = () => {
        setFunc(confirmPopupRef, 'open', AlertLabels.saveIt);
    }

    const saveConfirm = async () => {
        await commonContext.actions.callbackAfterSessionRefresh(async () => {
            const formData = new FormData();

            if(StringUtils.hasLength(stampUploadFile?.fileName)) formData.append('file', stampUploadFile.file);
            formData.append('json', new Blob([JSON.stringify(vo)], {type : 'application/json'}));

            const res = await CommonAxios({
                url: Api.my.vc.sealSave,
                method: 'post',
                data: formData,
                fileused: true
            }, false);

            if(ResponseUtils.isValidateResponse(res)) exeFunc(autoCloseCallBackPopupRef, 'open', AlertLabels.saved);
            else exeFunc(alertPopupRef, 'open', AlertLabels.askAdmin);
        }, true, true);
    }

    const onChangeFile = (event) => {
        if(event.target.files?.length > 0) {
            const file = event.target.files[0];

            if (file?.size > 100 * 1024 * 1024) {
                exeFunc(alertPopupRef, 'open', '업로드 파일 용량(100MB 이하)을 초과 하였습니다.');
                return;
            }

            const ext = file.name.substring(file.name.lastIndexOf('.'));
            if (FileUploadExtOpt.IMAGE_WITHOUT_GIF.list.findIndex(e => e === ext) < 0) {
                exeFunc(alertPopupRef, 'open', '파일 확장자를 확인해 주세요.');
                return;
            }

            setStampUploadFile({
                fileName: file?.name,
                fileUrl: URL.createObjectURL(file),
                file: file
            });
        }
        else {
            exeFunc(alertPopupRef, 'open', '잠시 후에 다시 시도해주세요');
        }
    }

    const loadStampInfo = async () => {
        const resDataObj = await ResponseUtils.getSimpleResponse(Api.my.vc.seal);
        if (resDataObj) setVo(resDataObj);
    }

    const isMounted = useRef(false);

    useEffect(() => {
        if(commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
            isMounted.current = true;
            commonContext.actions.pageMountPathCheck(history, loadStampInfo);
        }
    }, [commonContext.state.user]);

    useEffect(() => {
        return () => isMounted.current = false;
    }, []);

    return (
        <div className="layout">
            <Header/>
            <StampDeletePopup ref={deletePopupRef} deleteConfirm={deleteConfirm}/>

            <div className="page_container">
                <div className="wrap mypage_wrap info_wrap write company bg02">
                    <div className="gallery_logo_wrap">
                        <Gallery01 data={galleryData}/>
                        <ProfileImage/>
                    </div>
                    <BreadCrumbs {...props} />
                    <div className="container default_size02">
                        <div className="section section06">
                            <div className="section_header">
                                <div className="section_title_inner">
                                    <h3 className="section_title">인감</h3>
                                    <div className="info_tooltip_wrap">
                                        <button className={'btn_help'}>
                                            <span className="hide">정보살펴보기</span>
                                        </button>
                                        <div className="info_tooltip">
                                            <div className="tooltip_inner">
                                                <div className="tit_section">
                                                    <p className="tit">인감</p>
                                                    <button className="btn_delete_grey" onClick={onClickDelete}>
                                                        <span className="hide">삭제</span>
                                                    </button>
                                                </div>
                                                <p className="cnt nowrap">
                                                    PNG.JPG 형식으로 등록 가능하며&#44;
                                                    <br/> 1개의 이미지만 등록 가능합니다&#46;
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="btn_group">
                                    <Button onClick={() => history.push(ROUTER_NAMES.MY_PAGE_INVESTOR_INFO)}>취소</Button>
                                    <Button className={'blue'} onClick={onClickSave}>저장</Button>
                                </div>
                            </div>

                            <div className="stamp_wrap">
                                <input
                                    type="file"
                                    accept={FileUploadExtOpt.IMAGE_WITHOUT_GIF.str}
                                    multiple={false}
                                    ref={stampFileRef}
                                    style={{display: 'none'}}
                                    onChange={e => onChangeFile(e)}
                                />

                                {
                                    (!StringUtils.hasLength(vo?.rgslImgFileId) && !StringUtils.hasLength(stampUploadFile?.fileName))
                                        ?
                                        <Button className={'btn linear_grey'} onClick={() => stampFileRef.current.click()}>
                                            서명등록하기
                                        </Button>
                                        :
                                        <div className="stamp_container">
                                            <div className="stamp">
                                                <img src={
                                                    StringUtils.hasLength(stampUploadFile?.fileName)
                                                        ? stampUploadFile.fileUrl : vo.signBase64File
                                                } alt=""/>
                                                {/*서명등록한 후, 마우스호버시 서명을 삭제할 수 있는 휴지통이 활성화 됨*/}
                                                <div className="trash" onClick={onClickDelete}>&nbsp;</div>
                                            </div>
                                        </div>
                                }
                            </div>
                        </div>
                    </div>
                    <Footer/>
                </div>
            </div>
            <AlertPopup ref={alertPopupRef} />
            <ConfirmPopup ref={confirmPopupRef} onConfirm={saveConfirm} />
            <CheckCloseCallBackAlertPopup ref={autoCloseCallBackPopupRef} callBack={() => history.push(ROUTER_NAMES.MY_PAGE_INVESTOR_INFO)} />
        </div>
    )
}
export default StampWrite
