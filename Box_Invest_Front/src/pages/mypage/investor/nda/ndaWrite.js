/** @jsxImportSource @emotion/react */
import React, {useContext, useEffect, useRef, useState} from 'react'
import {useHistory} from 'react-router-dom'

import Header from 'components/header/Header'
import Footer from 'components/common/Footer'
import Gallery01 from 'components/common/Gallery01'
import BreadCrumbs from 'components/common/BreadCrumbs'
import CardLayout from 'components/common/card/CardLayout'
import Button from 'components/atomic/Button'
import Select from "components/atomic/Select";

import NdaProcessImage from "pageComponents/mypage/common/nda/NdaProcessImage";
import ProfileImage from "pageComponents/mypage/common/ProfileImage";
import AlertPopup from "pageComponents/common/pop/AlertPopup";
import CheckCloseCallBackAlertPopup from "pageComponents/common/pop/CheckCloseCallBackAlertPopup";
import NdaSubmitPopup from "pageComponents/mypage/common/nda/NdaSubmitPopup";
import NdaEformPopup from "pageComponents/mypage/common/nda/NdaEformPopup";
import ConfirmPopup from "pageComponents/common/pop/ConfirmPopup";
import WarningIconPopup from "pageComponents/common/pop/WarningIconPopup";

import CommonAxios from "modules/utils/CommonAxios";
import ROUTER_NAMES from "modules/consts/RouterConst";
import {exeFunc} from "modules/utils/ReactUtils";
import ResponseUtils from "modules/utils/ResponseUtils";
import Api from "modules/consts/Api";
import {AlertLabels, NdaSignTypeCode, UsisType} from "modules/consts/BizConst";
import {StringUtils} from "modules/utils/StringUtils";
import {getPostConfig} from "modules/utils/CommonAxios";
import {CommonContext} from "modules/contexts/common/CommomContext";
import QueryUtils from "modules/utils/QueryUtils";

const NdaWrite = (props) => {
    const history = useHistory();
    const commonContext = useContext(CommonContext);

    const galleryData = {
        title: '마이페이지',
        img: '/images/gallery02_img1.png'
    }

    const [isSigned, setIsSigned] = useState(false);
    const [targetList, setTargetList] = useState([{id: '', value: '선택'}]);

    const [vo, setVo] = useState({
        ndaCnttId: '',
        ndaRqstTtl: '',
        ndaRqstCon: 'NDA 서명 버튼을 눌러서 NDA 내용을 검토하신 후 동의하실 경우 서명을 해주시기 바랍니다.',

        dsmsInttId: '',
        rcvInttId: '',

        dsmsInttNm: '',
        rcvInttNm: '',

        pgrsSttsCd: '',
        pgrsSttsNm: '',

        rgsnTs: '',

        // 약정 유효 년수
        ndaValdNyy: 3,

        // 약정 특별조항 내용
        ndaSpclArtcCon: '해당사항 없음.',

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
    const submitPopupRef = useRef();
    const alertPopupRef = useRef();
    const alertConfirmSealRef = useRef();
    const alertConfirmSignRef = useRef();
    const autoCloseCallbackPopupRef = useRef();
    const ndaEformPopupRef = useRef();

    const checkStampYn = async () => {
        const res = await ResponseUtils.getSimpleResponse(Api.my.vc.seal);
        if(res) {
            return StringUtils.hasLength(res.rgslImgFileId);
        } else {
            return false;
        }
    }

    const onClickSign = async () => {
        if(await checkStampYn() == false) {
            exeFunc(alertConfirmSealRef, 'open', '등록된 인감정보가 없습니다. <br/> 인감 등록을 먼저 진행해주세요.');
            return;
        }
        if (!StringUtils.hasLength(vo.rcvInttId)) {
            exeFunc(alertPopupRef, 'open', '받는 기업을 선택해주세요.');
            return;
        }
        exeFunc(alertConfirmSignRef, 'open', '서명 후 받는기업, 유효년수, 특별조항을 수정하실 경우 재서명이 필요합니다.');
    }

    const setEformData = (data) => {
        if (!StringUtils.isAnyBlank(data?.dsmsInttSignFile, data?.dsmsInttSignprsnNm)) {
            setVo({
                ...vo,
                dsmsInttNm: commonContext.state.user.info?.name,
                dsmsInttSignFile: data.dsmsInttSignFile,
                dsmsInttAdr: data.dsmsInttAdr,
                dsmsInttSignprsnNm: data.dsmsInttSignprsnNm,

                invmNm: commonContext.state.user.info?.name,
                invmSign: data.dsmsInttSignFile,
                invmAdr: data.dsmsInttAdr,
                invmSignprsnNm: data.dsmsInttSignprsnNm,
            });
            setIsSigned(true);
        }
    }

    const onClickSave = () => {
        if (!isSigned) {
            exeFunc(signAlertPopupRef, 'open');
            return;
        }
        if (!StringUtils.hasLength(vo.ndaRqstTtl)) {
            exeFunc(alertPopupRef, 'open', '제목을 입력해주세요.');
            return;
        }
        if (!StringUtils.hasLength(vo.rcvInttId)) {
            exeFunc(alertPopupRef, 'open', '받는 기업을 선택해주세요.');
            return;
        }
        if (!StringUtils.hasLength(vo.ndaRqstCon)) {
            exeFunc(alertPopupRef, 'open', '내용을 입력해주세요.');
            return;
        }

        exeFunc(submitPopupRef, 'open');
    }

    const onConfirm = async () => {
        await commonContext.actions.callbackAfterSessionRefresh(save, true, true);
    }

    const save = async () => {
        const res = await CommonAxios(getPostConfig(Api.my.vc.ndaSubmit, vo));
        if (res && res.status === 200 && res?.data?.code === '200') {
            exeFunc(autoCloseCallbackPopupRef, 'open', AlertLabels.saved);
        } else {
            exeFunc(alertPopupRef, 'open', AlertLabels.askAdmin);
        }
    }

    const autoCloseCallback = () => {
        history.push(ROUTER_NAMES.MY_PAGE_INVESTOR_NDA_SEND);
    }

    const loadAuditTargetList = async () => {
        const res = await ResponseUtils.getList(Api.my.vc.ndaTargetList, null, 'list', false);
        return res;
    }

    const loadRegistNdaFormInttData = async () => {
        const res = await ResponseUtils.getSimpleResponse(Api.my.vc.ndaRgistFormIntt, null, false);
        if(res) {
            setVo({
                ...vo
                , invmNm: res.hasOwnProperty('inttNm') ? res.inttNm : ''
                , invmAdr: res.hasOwnProperty('inttAdr') ? res.inttAdr : ''
                , invmSign: res.hasOwnProperty('signData') ? res.signData : ''
                , invmSignprsnNm: res.hasOwnProperty('signprsnNm') ? res.signprsnNm : ''
            });
        }
    }

    const isMounted = useRef(false);
    const mountApiCntRef = useRef(0);

    useEffect(() => {
        if(commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
            isMounted.current = true;

            commonContext.actions.pageMountPathCheck(history, async () => {
                mountApiCntRef.current = 2;

                loadAuditTargetList().then(res => {
                    mountApiCntRef.current--;
                    if (res) {
                        res.unshift({id: '', value: '선택'})
                        setTargetList(res);
                    }
                }).catch(err => {
                    console.error(err);
                    mountApiCntRef.current--;
                });
                loadRegistNdaFormInttData()
                    .then(_ => mountApiCntRef.current--)
                    .catch(err => {
                        console.error(err);
                        mountApiCntRef.current--;
                    });
            }, mountApiCntRef);
        }
    }, [commonContext.state.user]);

    useEffect(() => {
        return () => isMounted.current = false;
    }, []);

    return (
        <>
            <Header/>
            <div className="page_container">
                <div className="wrap mypage_wrap nda_wrap write mypage_common bg02">
                    <div className="gallery_logo_wrap">
                        <Gallery01 data={galleryData}/>
                        <ProfileImage/>
                    </div>
                    <BreadCrumbs {...props} />

                    <div className="container nda_request_container default_size02">
                        <div className="section_header">
                            <h3 className="section_title">NDA 서명 요청</h3>
                        </div>
                        {/*사용자 서명 팝업*/}
                        <WarningIconPopup ref={signAlertPopupRef} message={'사용사 서명을 입력해주세요.'} />
                        {/*최종 제출 팝업*/}
                        <NdaSubmitPopup ref={submitPopupRef} onConfirm={onConfirm}/>
                        {/*NDA eform 팝업*/}
                        <NdaEformPopup ref={ndaEformPopupRef}
                                       signType={NdaSignTypeCode.DSMS_SIGN} usisType={UsisType.INVESTOR} vo={vo}
                                       setEformData={setEformData} />

                        <CardLayout>
                            {/*section01 start*/}
                            <NdaProcessImage/>
                            {/*section01 end*/}

                            {/*================= 서명요청 form start*/}
                            {/*section02 start*/}
                            <div className={'section section02'}>
                                <div className="card_header">
                                    <div className="ico_title">NDA 서명요청</div>
                                </div>
                                <div className="nda_form_table">
                                    <table className="table type02">
                                        <colgroup>
                                            <col width={'15%'}/>
                                            <col width={'35%'}/>
                                            <col width={'15%'}/>
                                            <col width={'35%'}/>
                                        </colgroup>
                                        <tbody>
                                        <tr>
                                            <th>제목</th>
                                            <td>
                                                <div className="input_wrap">
                                                    <input type="text"
                                                           className={'input'}
                                                           placeholder={'제목'}
                                                           defaultValue={vo.ndaRqstTtl}
                                                           onChange={e => setVo({
                                                               ...vo,
                                                               ndaRqstTtl: e.target.value
                                                           })}/>
                                                </div>
                                            </td>
                                            <th>받는기업</th>
                                            <td>
                                                <div className="input_wrap">
                                                    <Select optList={targetList}
                                                            selected={vo.rcvInttId}
                                                            onChange={e => {
                                                                setVo({
                                                                    ...vo,
                                                                    dsmsInttSignFile: '',
                                                                    invmSign: '',
                                                                    rcvInttId: e.target.value,
                                                                    rcvInttNm: targetList.find(element => element.id === e.target.value)?.value
                                                                });
                                                                setIsSigned(false);
                                                            }}/>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>요청기업</th>
                                            <td>{StringUtils.hasLength(commonContext.state.user.info?.name) ? commonContext.state.user.info.name : ''}</td>
                                            <th>NDA문서</th>
                                            <td>
                                                <div className="sign_btn_wrap">
                                                    {
                                                        isSigned
                                                            ? <p className="ico_complete">서명완료</p>
                                                            : (
                                                                <>
                                                                    <Button className={'blue linear'} onClick={onClickSign}>서명</Button>
                                                                    <p className="warning">※아직 NDA서명이 되지 않았습니다.</p>
                                                                </>
                                                            )
                                                    }
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className={'vertical_top'}>유효년수</th>
                                            <td colSpan={3}>
                                                <div className="input_wrap">
                                                    <input type="number"
                                                           style={{maxWidth: "100px"}}
                                                           className={'input'}
                                                           placeholder={3}
                                                           defaultValue={vo.ndaValdNyy}
                                                           disabled={isSigned}
                                                           onChange={e => {
                                                               e.target.value = Number(String(e.target.value).replace(/\D/gm, ''));
                                                               setVo({
                                                                   ...vo,
                                                                   dsmsInttSignFile: '',
                                                                   invmSign: '',
                                                                   ndaValdNyy: e.target.value
                                                               })
                                                               setIsSigned(false);
                                                           }}/> 년 &nbsp;&nbsp;
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className={'vertical_top'}>특별조항</th>
                                            <td colSpan={3}>
                                                <div className="textarea_wrap">
                                                    <textarea
                                                        className={'textarea'}
                                                        defaultValue={vo.ndaSpclArtcCon}
                                                        disabled={isSigned}
                                                        onChange={e => {
                                                            setVo({
                                                                ...vo,
                                                                dsmsInttSignFile: '',
                                                                invmSign: '',
                                                                ndaSpclArtcCon: e.target.value
                                                            });
                                                            setIsSigned(false);
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className={'vertical_top'}>내용</th>
                                            <td colSpan={3}>
                                                <div className="textarea_wrap">
                                                    <textarea
                                                        className={'textarea'}
                                                        defaultValue={vo.ndaRqstCon}
                                                        onChange={e => setVo({
                                                            ...vo,
                                                            ndaRqstCon: e.target.value
                                                        })}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            {/*section02 end*/}
                            <div className="btn_group">
                                <Button className={''} onClick={() => {
                                    const type = QueryUtils.getQuery(props)?.type;
                                    if(StringUtils.hasLength(type) && type === 'send') history.push(ROUTER_NAMES.MY_PAGE_INVESTOR_NDA_SEND);
                                    else history.push(ROUTER_NAMES.MY_PAGE_INVESTOR_NDA_RECEIVE);
                                }}>취소</Button>
                                <Button className={'blue'} onClick={onClickSave}>확인</Button>
                            </div>
                            {/*================= 서명요청 form end*/}
                        </CardLayout>
                    </div>
                    <Footer/>
                </div>
            </div>
            <AlertPopup ref={alertPopupRef}/>
            <ConfirmPopup ref={alertConfirmSealRef} onConfirm={() => history.push(ROUTER_NAMES.MY_PAGE_INVESTOR_STAMP_WRITE)} />
            <ConfirmPopup ref={alertConfirmSignRef} onConfirm={() => exeFunc(ndaEformPopupRef, 'open')} />
            <CheckCloseCallBackAlertPopup ref={autoCloseCallbackPopupRef} callBack={autoCloseCallback}/>
        </>
    )
}
export default NdaWrite
