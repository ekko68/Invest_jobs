import React, {useContext, useEffect, useRef, useState} from 'react';
import { useHistory } from 'react-router-dom';
import { isSafari } from "react-device-detect";

import Header from "components/header/Header";
import Gallery01 from "components/common/Gallery01";
import BreadCrumbs from "components/common/BreadCrumbs";
import CardLayout from "components/common/card/CardLayout";
import Button from "components/atomic/Button";
import Footer from "components/common/Footer";

import NdaProcessImage from "pageComponents/mypage/common/nda/NdaProcessImage";
import ProfileImage from "pageComponents/mypage/common/ProfileImage";
import AlertPopup from "pageComponents/common/pop/AlertPopup";
import CheckCloseCallBackAlertPopup from "pageComponents/common/pop/CheckCloseCallBackAlertPopup";
import ConfirmPopup from "pageComponents/common/pop/ConfirmPopup";
import NdaSubmitPopup from "pageComponents/mypage/common/nda/NdaSubmitPopup";
import NdaEformPopup from "pageComponents/mypage/common/nda/NdaEformPopup";
import NdaPdfPopup from "pageComponents/mypage/common/nda/NdaPdfPopup";
import WarningIconPopup from "pageComponents/common/pop/WarningIconPopup";

import CommonAxios from "modules/utils/CommonAxios";
import ROUTER_NAMES from "modules/consts/RouterConst";
import QueryUtils from "modules/utils/QueryUtils";
import ResponseUtils from "modules/utils/ResponseUtils";
import {StringUtils} from "modules/utils/StringUtils";
import Api from "modules/consts/Api";
import {AlertLabels, NdaCodeLabels, NdaSignTypeCode, UsisType} from "modules/consts/BizConst";
import {exeFunc} from "modules/utils/ReactUtils";
import {getPostConfig} from "modules/utils/CommonAxios";
import LabelUtils from "modules/utils/LabelUtils";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {isNumber} from "modules/utils/NumberUtils";

const NdaView = (props) => {

    const history = useHistory();
    const commonContext = useContext(CommonContext);

    const galleryData = {
        title: '마이페이지',
        img: '/images/gallery02_img1.png'
    }

    const [vo, setVo] = useState({
        ndaCnttId: '',
        ndaRqstTtl: '',
        ndaRqstCon: '',

        dsmsInttId: '',
        rcvInttId: '',

        dsmsInttNm: '',
        rcvInttNm: '',

        pgrsSttsCd: '',
        pgrsSttsNm: '',

        rgsnTs: '',

        // 약정 유효 년수
        ndaValdNyy: null,

        // 약정 특별조항 내용
        ndaSpclArtcCon: '',

        // 서명 데이터 (base64)
        dsmsInttSignFile: '',
        rcvInttSignFile: '',

        // 서명인
        dsmsInttSignprsnNm: '',
        rcvInttSignprsnNm: '',

        // PDF 파일 아이디
        ndaPtdfFileId: '',

        // eform (수신기관 서명, 체결완료 폼) 매핑 정보
        enprNm: '',
        enprAdr: '',
        enprSign: '',
        enprSignprsnNm: '',
        invmNm: '',
        invmAdr: '',
        invmSign: '',
        invmSignprsnNm: ''
    });

    const signAlertPopupRef = useRef();
    const ndaEformCompletePopupRef = useRef();
    const ndaEformSignPopupRef = useRef();
    const submitPopupRef = useRef();
    const confirmCancelPopupRef = useRef();
    const alertConfirmSealRef = useRef();
    const alertPopupRef = useRef();
    const autoCloseCallbackPopupRef = useRef();

    const ndaPdfPopupRef = useRef();

    // 버튼 확인 스테이트
    const [isRecieveStandBy, setIsRecieveStandBy] = useState(false);
    const [isSigned, setIsSigned] = useState(false);

    const setEformData = (data) => {
        if(!StringUtils.isAnyBlank(data?.rcvInttSignFile, data?.rcvInttSignprsnNm, data?.ndaPtdfFileId)) {
            setVo({
                ...vo,
                rcvInttSignFile: data.rcvInttSignFile,
                rcvInttAdr: data.rcvInttAdr,
                rcvInttSignprsnNm: data.rcvInttSignprsnNm,
                ndaPtdfFileId: data.ndaPtdfFileId,

                invmSign: data.rcvInttSignFile,
                invmAdr: data.rcvInttAdr,
                invmSignprsnNm: data.rcvInttSignprsnNm,
            });
        }
    }

    const onClickList = () => {
        let url = '';
        const query = QueryUtils.getQuery(props);

        if(StringUtils.hasLength(query?.type) && query.type === 'send') url = ROUTER_NAMES.MY_PAGE_INVESTOR_NDA_SEND;
        else url = ROUTER_NAMES.MY_PAGE_INVESTOR_NDA_RECEIVE;

        if(StringUtils.hasLength(query?.page)) {
            url += `?page=${query.page}`;
            if(StringUtils.hasLength(query?.pgrsSttsCd)) url += `&pgrsSttsCd=${query.pgrsSttsCd}`;
        }

        history.push(url);
    }

    const checkStampYn = async () => {
        const res = await ResponseUtils.getSimpleResponse(Api.my.vc.seal, null, false);
        if(res) {
            return StringUtils.hasLength(res.rgslImgFileId);
        } else {
            return false;
        }
    }

    const onClickSignNdaEform = async () => {
        if(await checkStampYn() == false) {
            exeFunc(alertConfirmSealRef, 'open', '등록된 인감정보가 없습니다. <br/> 인감 등록을 먼저 진행해주세요.');
            return;
        }
        exeFunc(ndaEformSignPopupRef, 'open');
    }

    const onClickCheckNda = () => {
        // 사파리 브라우저는 pdf 띄우기가 안되므로 Eform으로 띄운다.
        if(vo?.pgrsSttsCd === NdaCodeLabels.APPROVAL
            && StringUtils.hasLength(vo?.ndaPtdfFileId)
            && !isSafari) { // react-device-detect
            exeFunc(ndaPdfPopupRef, 'open');
        } else {
            exeFunc(ndaEformCompletePopupRef, 'open');
        }
    }

    const onClickCancel = () => {
        exeFunc(confirmCancelPopupRef, 'open', '반려 처리 하시겠습니까?');
    }

    const onClickSave = () => {
        if(!isSigned) {
            exeFunc(signAlertPopupRef, 'open');
            return;
        }
        exeFunc(submitPopupRef, 'open');
    }

    const onConfirmSave = async () => {
        await commonContext.actions.callbackAfterSessionRefresh(save, true, true);
    }

    const onConfirmCancel = async () => {
        await commonContext.actions.callbackAfterSessionRefresh(cancel, true, true);
    }

    const save = async () => {
        const res = await CommonAxios(getPostConfig(Api.my.vc.ndaContractSign, vo));
        if(res?.status === 200 && res?.data?.code === '200') {
            exeFunc(autoCloseCallbackPopupRef, 'open', AlertLabels.saved);
        } else {
            exeFunc(alertPopupRef, 'open', AlertLabels.askAdmin);
        }
    }

    const cancel = async () => {
        const res = await CommonAxios(getPostConfig(Api.my.vc.ndaContractCancel, {id: vo.ndaCnttId}));
        if(res?.status === 200 && res?.data?.code === '200') {
            exeFunc(autoCloseCallbackPopupRef, 'open', AlertLabels.canceled);
        } else {
            exeFunc(alertPopupRef, 'open', AlertLabels.askAdmin);
        }
    }

    const autoCloseCallback = async () => {
        await loadNdaView();
    }

    const loadNdaView = async () => {
        const query = QueryUtils.getQuery(props);
        if(StringUtils.hasLength(query?.ndaCnttId))  {
            const url = Api.my.vc.ndaContractDetail + "/" + query.ndaCnttId;
            const res = await ResponseUtils.getSimpleResponse(url);
            setVo(res);

            const userInfo = commonContext.state.user.info;
            if(res?.rcvInttId === userInfo?.groupId
                && res?.pgrsSttsCd === NdaCodeLabels.READY) {
                setIsRecieveStandBy(true);
            } else {
                setIsRecieveStandBy(false);
            }
        }
    }

    const isMounted = useRef(false);

    useEffect(() => {
        if(commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
            isMounted.current = true;
            commonContext.actions.pageMountPathCheck(history, loadNdaView);
        }
    }, [commonContext.state.user]);

    useEffect(() => {
        return () => isMounted.current = false;
    }, []);

    useEffect(() => {
        if(!StringUtils.isAnyBlank(vo?.rcvInttSignFile, vo?.rcvInttSignprsnNm, vo?.ndaPtdfFileId)
            && !isSigned) setIsSigned(true);
    }, [vo]);

    return (
        <>
            <Header />
            <div className="page_container">
                <div className="wrap mypage_wrap nda_wrap write mypage_common bg02">
                    <div className="gallery_logo_wrap">
                        <Gallery01 data={galleryData} />
                        <ProfileImage/>
                    </div>
                    <BreadCrumbs {...props} />

                    <div className="container nda_request_container default_size02">
                        <div className="section_header">
                            <h3 className="section_title">NDA 체결</h3>
                        </div>
                        {/*사용자 서명 팝업*/}
                        <WarningIconPopup ref={signAlertPopupRef} message={'사용사 서명을 입력해주세요.'} />
                        {/*최종 제출 팝업*/}
                        <NdaSubmitPopup ref={submitPopupRef} onConfirm={onConfirmSave} isLast={true} />
                        {/*NDA 서명 작성 eform 팝업*/}
                        <NdaEformPopup ref={ndaEformSignPopupRef} signType={NdaSignTypeCode.RCV_SIGN} usisType={UsisType.INVESTOR} vo={vo} setEformData={setEformData} />
                        {/*NDA 서명 확인 eform 팝업*/}
                        <NdaEformPopup ref={ndaEformCompletePopupRef} signType={NdaSignTypeCode.COMPLETE} usisType={UsisType.INVESTOR} vo={vo} setEformData={null} />
                        {/*NDA 최종 PDF 팝업*/}
                        <NdaPdfPopup ref={ndaPdfPopupRef} ndaPdfFileId={vo?.ndaPtdfFileId} />

                        <CardLayout>
                            {/*section01 start*/}
                            <NdaProcessImage />
                            {/*section01 end*/}

                            {/*================= 서명요청 view start */}
                            {/*section02 start*/}
                            <div className={'section section02'}>
                                <div className="card_header">
                                    <div className="ico_title">NDA 서명요청</div>
                                </div>
                                <div className="nda_form_table">
                                    <table className="table type02">
                                        <colgroup>
                                            <col width={'15%'} />
                                            <col width={'35%'} />
                                            <col width={'15%'} />
                                            <col width={'35%'} />
                                        </colgroup>
                                        <tbody>
                                        <tr>
                                            <th>제목</th>
                                            <td colSpan={1}>
                                                <div className="text_wrap">{vo.ndaRqstTtl}</div>
                                            </td>
                                            <th className={'vertical_top'}>유효년수</th>
                                            <td colSpan={1}>
                                                <div className="text_wrap">{isNumber(vo.ndaValdNyy) && `${vo.ndaValdNyy} 년`}</div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>요청기업</th>
                                            <td colSpan={1}>
                                                <div className="text_wrap">{vo.dsmsInttNm}</div>
                                            </td>
                                            <th>요청상태</th>
                                            <td colSpan={1}>
                                                <div className="text_wrap">
                                                    <p className={LabelUtils.getNdaBadgeStyle(vo.pgrsSttsCd)}>
                                                        {vo.pgrsSttsNm}
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className={'vertical_top'}>특별조항</th>
                                            <td colSpan={3}>
                                                <div className="text_box_wrap"
                                                     dangerouslySetInnerHTML={{__html: StringUtils.toBr(vo.ndaSpclArtcCon)}}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className={'vertical_top'}>내용</th>
                                            <td colSpan={3}>
                                                <div className="text_box_wrap"
                                                     dangerouslySetInnerHTML={{__html:StringUtils.toBr(vo.ndaRqstCon)}}
                                                />
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {/*section02 end*/}
                            {
                                // 받은 기업 + 대기 상태
                                isRecieveStandBy
                                    // 서명 전
                                    ?   !isSigned
                                        ? (
                                            <div className="btn_group">
                                                <Button className={''} onClick={onClickList}>리스트</Button>
                                                <Button className={''} onClick={onClickCancel}>반려</Button>
                                                <Button className={'blue'} onClick={onClickSignNdaEform}>서명</Button>
                                            </div>
                                        )
                                        // 서명 후
                                        : (
                                            <div className="btn_group">
                                                <Button className={''} onClick={onClickList}>리스트</Button>
                                                <Button className={''} onClick={onClickCancel}>반려</Button>
                                                <Button className={'blue'} onClick={onClickSave}>완료</Button>
                                            </div>
                                        )

                                    // 받은 기업 + 완료, 취소 상태 or 보낸 기업일 경우
                                    : (
                                        <div className="btn_group">
                                            <Button className={''} onClick={onClickList}>리스트</Button>
                                            {
                                                (vo?.pgrsSttsCd !== NdaCodeLabels.CANCEL) &&
                                                <Button className={'blue'} onClick={onClickCheckNda}>NDA 확인</Button>
                                            }
                                        </div>
                                    )
                            }
                            {/*================= 서명요청 view end */}
                        </CardLayout>
                    </div>
                </div>
            </div>
            <ConfirmPopup ref={alertConfirmSealRef} onConfirm={() => history.push(ROUTER_NAMES.MY_PAGE_INVESTOR_STAMP_WRITE)} />
            <ConfirmPopup ref={confirmCancelPopupRef} onConfirm={onConfirmCancel} />
            <AlertPopup ref={alertPopupRef} />
            <CheckCloseCallBackAlertPopup ref={autoCloseCallbackPopupRef} callBack={autoCloseCallback} />
            <Footer />
        </>
    )
}

export default NdaView;