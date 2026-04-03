/** @jsxImportSource @emotion/react */
import React, {useContext, useEffect, useRef, useState} from 'react'
import {useHistory} from 'react-router-dom'

import Header from 'components/header/Header'
import Footer from 'components/common/Footer'
import Gallery01 from 'components/common/Gallery01'
import BreadCrumbs from 'components/common/BreadCrumbs'
import Button from 'components/atomic/Button'
import CardLayout from 'components/common/card/CardLayout'
import ToggleCheckBox from 'components/atomic/ToggleCheckBox'

import MaxLengthCount from 'pageComponents/common/number/MaxLengthCount'
import Eventing from 'pageComponents/mypage/investor/event/Eventing'
import NumberInput from 'pageComponents/common/number/NumberInput'
import Faq from 'pageComponents/mypage/investor/event/Faq'
import Banner from 'pageComponents/mypage/investor/event/Banner'

import CheckCloseCallBackAlertPopup from 'pageComponents/common/pop/CheckCloseCallBackAlertPopup'

import MoveConfirmPopup from 'pageComponents/common/pop/MoveConfirmPopup'
import ProfileImage from "pageComponents/mypage/common/ProfileImage";

import ROUTER_NAMES from 'modules/consts/RouterConst'
import ResponseUtils from 'modules/utils/ResponseUtils'
import {exeFunc, getFunc, setFunc} from 'modules/utils/ReactUtils'
import QueryUtils from 'modules/utils/QueryUtils'
import Api from 'modules/consts/Api'
import VoUtils from 'modules/utils/VoUtils'
import {AlertLabels, CheckYn, FileUploadExtOpt, FileUploadSizeOpt} from 'modules/consts/BizConst'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import ConfirmPopup from 'pageComponents/common/pop/ConfirmPopup'
import CommonAxios from 'modules/utils/CommonAxios'
import {getPostConfig} from 'modules/utils/CommonAxios'
import {RegexConst} from "modules/consts/Regex";
import {StringUtils} from "modules/utils/StringUtils";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {deepCopyByRecursion} from "modules/utils/CommonUtils";

const ExclusiveWrite = (props) => {

    const history = useHistory();
    const commonContext = useContext(CommonContext);

    const galleryData = {
        title: '마이페이지',
        img: '/images/gallery02_img1.png'
    }

    const inrdConRef = useRef()
    const contentMaxLengthCountRef = useRef()
    const lgtyImgFileIdRef = useRef()
    const lgtyImgFileNmRef = useRef()
    const rprsImgFileNmRef = useRef()
    const rprsImgFileIdRef = useRef()
    const inrdImgFileNmRef = useRef()
    const inrdImgFileIdRef = useRef()
    const ivstContentMaxLengthCountRef = useRef()
    const pageConRef = useRef()
    const eventingRef = useRef()
    const faqRef = useRef()
    const bannerRef = useRef()
    const alertPopRef = useRef()
    const confirmPopRef = useRef()
    const checkCloseCallBackAlertPopupRef = useRef()
    const confirmCancelPopRef = useRef()
    const moveConfirmPopupRef = useRef()

    const [toggleChk, setToggleChk] = useState({id: 'toggleChk01', value: '비활성화', status: false})
    const handleToggleChk = (e) => {
        vo.pageMainData.invmAplcAbyn = e.target.checked ? CheckYn.YES : CheckYn.NO
        let msg = ''
        if (e.target.checked) {
            msg = '활성화'
        } else {
            msg = '비활성화'
        }
        setToggleChk({
            ...toggleChk,
            value: msg,
            status: !toggleChk.status
        })
    }

    const [vo, setVo] = useState({
        bannerList: [],
        eventList: [],
        faqList: [],
        pageMainData: {
            bplcNm: '',
            cscnCpyrCon: '',
            cscnEmlAdr: '',
            cscnHmpgUrl: '',
            cscnTpn: '',
            dtlLkngUrlAdr: '',
            etvlAmt: 0,
            fundAmt: 0,
            hmpgUrl: '',
            inrdCon: '',
            inrdImgFileId: '',
            inrdImgFileNm: '',
            inrdImgUrl: '',
            inrdTtl: '',
            invmAplcAbyn: CheckYn.NO,
            invmCmpExusPageId: '',
            invmRtrvEnprCnt: 0,
            lgtyImgFileId: '',
            lgtyImgFileNm: '',
            lgtyImgUrl: '',
            pageCon: '',
            pageTtl: '',
            rprsImgFileId: '',
            rprsImgFileNm: '',
            rprsImgUrl: '',
            rvsRnum: '',
            ttalIvenCnt: 0,
            utlinsttId: ''
        }
    })

    const onChangeInputPageMainData = (property, value) => {
        const _vo = deepCopyByRecursion(vo);

        _vo.pageMainData[property] = value;
        setVo(_vo);

        setVo(_vo);
    }

    /** Validation */

    const validateCompare = async () => {
        const weblinkDetailObject = await loadWebLinkDetail()
        VoUtils.setVoNullToEmpty(weblinkDetailObject['pageMainData'], [
            'etvlAmt',
            'fundAmt',
            'invmRtrvEnprCnt',
            'ttalIvenCnt'
        ])
        VoUtils.setListVoNullToEmpty(weblinkDetailObject['bannerList'], ['bnnrSqn'], ['rvsRnum'])
        VoUtils.setListVoNullToEmpty(weblinkDetailObject['eventList'], ['evntSqn'], ['rvsRnum'])
        VoUtils.setListVoNullToEmpty(weblinkDetailObject['faqList'], ['faqSqn'], ['rvsRnum'])
        vo.eventList = getFunc(eventingRef, 'getData')
        vo.faqList = getFunc(faqRef, 'getData')
        vo.bannerList = getFunc(bannerRef, 'getData')
        if (JSON.stringify(vo) !== JSON.stringify(weblinkDetailObject)) {
            return false
        }
        return true
    }

    const validationRegex = (showAlert = true) => {

        if (String(vo.pageMainData.hmpgUrl).search(RegexConst.URL_CHECK_REGEX) === -1) {
            if (showAlert) exeFunc(alertPopRef, 'open', '홈페이지 URL을 확인해주세요.');
            return false;
        }

        if (String(vo.pageMainData.dtlLkngUrlAdr).search(RegexConst.URL_CHECK_REGEX) === -1) {
            if (showAlert) exeFunc(alertPopRef, 'open', '자세히보기 URL을 확인해주세요.');
            return false;
        }

        const eventList = vo.eventList = getFunc(eventingRef, 'getData');

        if (eventList && eventList.length > 0) {
            for (let i = 0; i < eventList.length; i++) {
                const item = eventList[i];
                if (item.hasOwnProperty('evntBkmrUrl') && String(item.evntBkmrUrl).trim() !== ''
                    && String(item.evntBkmrUrl).search(RegexConst.URL_CHECK_REGEX) === -1) {
                    if (showAlert) exeFunc(alertPopRef, 'open', '이벤트 바로가기 URL을 확인해주세요');
                    return false;
                }
            }
        }

        if (String(vo.pageMainData.cscnEmlAdr).trim() !== '' && String(vo.pageMainData.cscnEmlAdr).search(RegexConst.MAIL_CHECK_REGEX) === -1) {
            if (showAlert) exeFunc(alertPopRef, 'open', '기타정보 이메일을 확인해주세요.');
            return false;
        }

        if (String(vo.pageMainData.cscnHmpgUrl).trim() !== '' && String(vo.pageMainData.cscnHmpgUrl).search(RegexConst.URL_CHECK_REGEX) === -1) {
            if (showAlert) exeFunc(alertPopRef, 'open', '기타정보 홈페이지 URL을 확인해주세요');
            return false;
        }

        return true;
    }

    const validateIsEmpty = (showAlert = true) => {
        // /* 메인 정보 */
        let properties = ['lgtyImgFileId', 'rprsImgFileId', 'hmpgUrl', 'dtlLkngUrlAdr', 'pageTtl', 'pageCon']
        let isEmpty = false
        for (let i = 0; i < properties.length; i++) {
            if (vo.pageMainData[properties[i]] === '') {
                isEmpty = true
                break
            }
        }
        if (isEmpty) {
            if (showAlert) exeFunc(alertPopRef, 'open', '메인 정보에 입력된 값이 없는 항목이 있습니다.');
            return true
        }
        /* 투자사 정보 */
        properties = ['inrdImgFileId', 'bplcNm', 'inrdTtl', 'inrdCon']
        isEmpty = false
        for (let i = 0; i < properties.length; i++) {
            if (vo.pageMainData[properties[i]] === '') {
                isEmpty = true
                break
            }
        }
        if (isEmpty) {
            if (showAlert) exeFunc(alertPopRef, 'open', '투자사 정보에 입력된 값이 없는 항목이 있습니다.');
            return true
        }
        return false
    }

    /** Move */


    /** Cancel Button */

    const onClickCancel = async () => {
        history.replace(ROUTER_NAMES.MY_PAGE_INVESTOR_EXCLUSIVE)
    }

    /** Save Button */

    const onClickSave = async () => {
        await commonContext.actions.callbackAfterSessionRefresh(async () => {
            const query = QueryUtils.getQuery(props)
            if (query.hasOwnProperty('invmCmpExusPageId')) {
                // if (await validateCompare()) {
                //   exeFunc(alertPopRef, 'open', AlertLabels.noChange) // '변경된 내용이 없습니다.'
                //   return
                // }
            }
            if (validateIsEmpty()) {
                return;
            }

            if (!validationRegex()) {
                return;
            }
            exeFunc(confirmPopRef, 'open', '저장 하시겠습니까?')
        }, true, true);
    }

    /** pop ref confirm */

    const autoCloseCallBack = () => {
        history.push(ROUTER_NAMES.MY_PAGE_INVESTOR_EXCLUSIVE)
    }

    const onConfirmCancel = () => {
        history.push(ROUTER_NAMES.MY_PAGE_INVESTOR_EXCLUSIVE)
    }

    const onConfirmSave = async () => {
        await commonContext.actions.callbackAfterSessionRefresh(save, true, true)
    }

    const onConfirmSaveBeforeMove = async (url) => {
        await commonContext.actions.callbackAfterSessionRefresh(async () => {
            if ((await saveBeforeMove()) === false) {
                return
            }
            setTimeout(() => {
                location.replace(url)
            }, 500)
        }, true, true);
    }

    const save = async () => {
        let isSaveComplete = true
        vo.eventList = getFunc(eventingRef, 'getData')
        vo.faqList = getFunc(faqRef, 'getData')
        vo.bannerList = getFunc(bannerRef, 'getData')

        const saveRes = await CommonAxios(getPostConfig(Api.my.vc.webLinkSave, vo), false)
        if (saveRes && saveRes.status === 200) {
            if (saveRes.data.hasOwnProperty('code') && saveRes.data.code !== '200') {
                isSaveComplete = false;
            }
        } else {
            isSaveComplete = false
        }
        if (isSaveComplete) {
            exeFunc(checkCloseCallBackAlertPopupRef, 'open', AlertLabels.saved) // '저장되었습니다.'
            // await init(saveRes.data?.data?.invmCmpExusPageId);

            // 투자사 전용 페이지 목록 이동으로 수정
            setTimeout(() => {
                history.push(ROUTER_NAMES.MY_PAGE_INVESTOR_EXCLUSIVE);
            }, 1000);
        } else {
            exeFunc(alertPopRef, 'open', AlertLabels.notSaved) // '저장되지 않았습니다. 관리자에게 문의하세요'
        }
    }

    const saveBeforeMove = async () => {
        vo.eventList = getFunc(eventingRef, 'getData')
        vo.faqList = getFunc(faqRef, 'getData')
        vo.bannerList = getFunc(bannerRef, 'getData')
        let isSaveComplete = true
        const saveRes = await CommonAxios(getPostConfig(Api.my.vc.webLinkSave, vo), true)
        if (saveRes && saveRes.status === 200) {
            if (saveRes.data.hasOwnProperty('code') && saveRes.data.code !== '200') {
                isSaveComplete = false
            }
        } else {
            isSaveComplete = false
        }
        if (isSaveComplete) {
            exeFunc(checkCloseCallBackAlertPopupRef, 'open', AlertLabels.saved) // '저장되었습니다.'
        } else {
            exeFunc(alertPopRef, 'open', AlertLabels.notSaved) // '저장되지 않았습니다. 관리자에게 문의하세요'
        }
        return isSaveComplete
    }
    const onConfirmCancelSaveBeforeMove = () => {
        history.replace(ROUTER_NAMES.MY_PAGE_INVESTOR_EXCLUSIVE)
    }

    /** load Axios */

    const init = async (invmCmpExusPageId) => {
        const weblinkDetailObject = await loadWebLinkDetail(invmCmpExusPageId)
        if (weblinkDetailObject) {
            VoUtils.setVoNullToEmpty(weblinkDetailObject['pageMainData'], [
                'etvlAmt',
                'fundAmt',
                'invmRtrvEnprCnt',
                'ttalIvenCnt'
            ])
            VoUtils.setListVoNullToEmpty(weblinkDetailObject['bannerList'], ['bnnrSqn'], ['rvsRnum'])
            VoUtils.setListVoNullToEmpty(weblinkDetailObject['eventList'], ['evntSqn'], ['rvsRnum'])
            VoUtils.setListVoNullToEmpty(weblinkDetailObject['faqList'], ['faqSqn'], ['rvsRnum'])
            setVo(weblinkDetailObject)
            setToggleChk({
                id: 'toggleChk01',
                value: weblinkDetailObject.pageMainData['invmAplcAbyn'] === CheckYn.YES ? '활성화' : '비활성화',
                status: weblinkDetailObject.pageMainData['invmAplcAbyn'] === CheckYn.YES ? true : false
            })
            setFunc(eventingRef, 'setData', weblinkDetailObject['eventList'])
            setFunc(faqRef, 'setData', weblinkDetailObject['faqList'])
            setFunc(bannerRef, 'setData', weblinkDetailObject['bannerList'])
        }
    }

    const loadWebLinkDetail = async (invmCmpExusPageId) => {
        let url = Api.my.vc.webLinkDetail
        const query = QueryUtils.getQuery(props)
        if (query.hasOwnProperty('invmCmpExusPageId') && StringUtils.hasLength(query['invmCmpExusPageId'])) {
            url = Api.my.vc.webLinkDetail + '/' + query['invmCmpExusPageId']
        } else if (StringUtils.hasLength(invmCmpExusPageId)) {
            url = Api.my.vc.webLinkDetail + '/' + invmCmpExusPageId;
        }
        const loadWebLinkDetail = await ResponseUtils.getSimpleResponse(url, null, false);
        return loadWebLinkDetail
    }

    const isMounted = useRef(false);

    useEffect(() => {
        if(commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
            isMounted.current = true;
            commonContext.actions.pageMountPathCheck(history, init);
        }
    }, [commonContext.state.user]);

    useEffect(() => {
        return () => isMounted.current = false;
    }, []);

    return (
        <>
            <Header/>
            <div className="page_container">
                <div className="wrap mypage_wrap for_investor_wrap write bg02">
                    <div className="gallery_logo_wrap">
                        <Gallery01 data={galleryData}/>
                        <ProfileImage/>
                    </div>
                    <BreadCrumbs {...props} />
                    <div className="container default_size02">
                        <div className="section_header">
                            <h3 className="section_title"> 투자사 전용</h3>
                            <div className="btn_group">
                                <Button onClick={onClickCancel}>취소</Button>
                                <Button className={'blue'} onClick={onClickSave}>
                                    저장
                                </Button>
                            </div>
                        </div>
                        <CardLayout>
                            <div className="section section01">
                                <div className="card_header">
                                    <h3 className="ico_title"><span className="essen_ico">*</span>메인정보</h3>
                                    <span className="essential">* 표시항목은 필수 입력 항목입니다.</span>
                                </div>
                                <div className="form_table_wrap">
                                    <table className="table type02">
                                        <caption>메인정보</caption>
                                        <colgroup>
                                            <col width={'10%'}/>
                                            <col width={'40%'}/>
                                            <col width={'10%'}/>
                                            <col width={'40%'}/>
                                        </colgroup>
                                        <tbody>
                                        <tr>
                                            <th>기관로고</th>
                                            <td>
                                                <div className="input_btn_wrap input_wrap">
                                                    <input
                                                        ref={lgtyImgFileIdRef}
                                                        title='기관로고파일'
                                                        type="file"
                                                        name="file"
                                                        multiple={false}
                                                        accept={FileUploadExtOpt.IMAGE.str}
                                                        style={{display: 'none'}}
                                                    />
                                                    <input
                                                        id={'lgtyImgFileNm'}
                                                        title='기관로고파일명'
                                                        ref={lgtyImgFileNmRef}
                                                        type="text"
                                                        className="input"
                                                        placeholder={'gif, jpg, png'}
                                                        disabled={CheckYn.YES}
                                                        defaultValue={vo.pageMainData.lgtyImgFileNm}
                                                    />
                                                    <Button className={'blue linear'}
                                                            onClick={() => commonContext.actions.onClickUploadFile(
                                                                lgtyImgFileIdRef.current,
                                                                res => {
                                                                    const _vo = deepCopyByRecursion(vo);
                                                                    _vo.pageMainData.lgtyImgFileNm = res.fileNm;
                                                                    _vo.pageMainData.lgtyImgFileId = res.fileId;
                                                                    _vo.pageMainData.lgtyImgUrl = res.imgUrl;
                                                                    setVo(_vo);
                                                                },
                                                                alertPopRef,
                                                                {limitSizeOpt: FileUploadSizeOpt.DEFAULT, acceptExtOpt: FileUploadExtOpt.IMAGE}
                                                            )}>
                                                        업로드
                                                    </Button>
                                                </div>
                                            </td>
                                            <th>홈페이지</th>
                                            <td>
                                                <div className="input_wrap">
                                                    <input
                                                        id={'hmpgUrl'}
                                                        title='홈페이지주소'
                                                        type="text"
                                                        className="input"
                                                        placeholder=""
                                                        defaultValue={vo.pageMainData.hmpgUrl}
                                                        onChange={(event) => onChangeInputPageMainData('hmpgUrl', event.target.value)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>대표이미지</th>
                                            <td>
                                                <div className="input_btn_wrap input_wrap">
                                                    <input
                                                        ref={rprsImgFileIdRef}
                                                        title='대표이미지파일'
                                                        type="file"
                                                        name="file"
                                                        multiple={false}
                                                        accept={FileUploadExtOpt.IMAGE.str}
                                                        style={{display: 'none'}}
                                                    />
                                                    <input
                                                        id={'rprsImgFileNm'}
                                                        title='대표이미지파일명'
                                                        ref={rprsImgFileNmRef}
                                                        type="text"
                                                        className="input"
                                                        placeholder={'size : 1200*800 (gif, jpg, png)'}
                                                        disabled={CheckYn.YES}
                                                        defaultValue={vo.pageMainData.rprsImgFileNm}
                                                    />
                                                    <Button className={'blue linear'}
                                                            onClick={() => commonContext.actions.onClickUploadFile(
                                                                rprsImgFileIdRef.current,
                                                                res => {
                                                                    const _vo = deepCopyByRecursion(vo);
                                                                    _vo.pageMainData.rprsImgFileNm = res.fileNm;
                                                                    _vo.pageMainData.rprsImgFileId = res.fileId;
                                                                    _vo.pageMainData.rprsImgUrl = res.imgUrl;
                                                                    setVo(_vo);
                                                                },
                                                                alertPopRef,
                                                                {limitSizeOpt: FileUploadSizeOpt.DEFAULT, acceptExtOpt: FileUploadExtOpt.IMAGE}
                                                            )}>
                                                        업로드
                                                    </Button>
                                                </div>
                                            </td>
                                            <th>자세히보기</th>
                                            <td>
                                                <div className="input_wrap">
                                                    <input
                                                        id={'dtlLkngUrlAdr'}
                                                        title='자세히보기URL'
                                                        type="text"
                                                        className="input"
                                                        placeholder="자세히보기 링크를 입력하세요."
                                                        defaultValue={vo.pageMainData.dtlLkngUrlAdr}
                                                        onChange={(event) => onChangeInputPageMainData('dtlLkngUrlAdr', event.target.value)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>제목</th>
                                            <td colSpan={3}>
                                                <div className="input_wrap">
                                                    <input
                                                        id={'pageTtl'}
                                                        title='메인제목'
                                                        type="text"
                                                        className="input"
                                                        placeholder="제목을 입력해 주세요. (50자 이내)"
                                                        maxLength={50}
                                                        defaultValue={vo.pageMainData.pageTtl}
                                                        onChange={(event) => {
                                                            event.target.value = StringUtils.cutStrByLimit(event.target.value, 50);
                                                            onChangeInputPageMainData('pageTtl', event.target.value);
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
                                                        id={'pageCon'}
                                                        title='메인내용'
                                                        className={'textarea'}
                                                        placeholder={''}
                                                        defaultValue={vo.pageMainData.pageCon}
                                                        onChange={(event) => {
                                                            event.target.value = StringUtils.cutStrByLimit(event.target.value, 300);
                                                            onChangeInputPageMainData('pageCon', event.target.value);
                                                        }}
                                                        maxLength={300}
                                                    />
                                                </div>
                                                <div className="max_count_wrap">
                                                    <MaxLengthCount
                                                        ref={contentMaxLengthCountRef}
                                                        max={300}
                                                        defaultCount={String(vo.pageMainData.pageCon).length}/>
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="section section02">
                                <div className="card_header">
                                    <h3 className="ico_title"><span className="essen_ico">*</span>투자사정보</h3>
                                </div>
                                <div className="form_table_wrap">
                                    <table className="table type02">
                                        <caption>투자사정보</caption>
                                        <colgroup>
                                            <col width={'10%'}/>
                                            <col width={'40%'}/>
                                            <col width={'10%'}/>
                                            <col width={'40%'}/>
                                        </colgroup>
                                        <tbody>
                                        <tr>
                                            <th>대표이미지</th>
                                            <td>
                                                <div className="input_btn_wrap input_wrap">
                                                    <input
                                                        ref={inrdImgFileIdRef}
                                                        title='대표이미지파일'
                                                        type="file"
                                                        name="file"
                                                        multiple={false}
                                                        accept={FileUploadExtOpt.IMAGE.str}
                                                        style={{display: 'none'}}
                                                    />
                                                    <input
                                                        id={'inrdImgFileNm'}
                                                        title='대표이미지파일명'
                                                        ref={inrdImgFileNmRef}
                                                        type="text"
                                                        className="input"
                                                        placeholder={'gif, jpg, png'}
                                                        disabled={CheckYn.YES}
                                                        defaultValue={vo.pageMainData.inrdImgFileNm}
                                                    />
                                                    <Button className={'blue linear'}
                                                            // onClick={onClickInrdImgFileIdUpload}>
                                                            onClick={() => commonContext.actions.onClickUploadFile(
                                                                inrdImgFileIdRef.current,
                                                                res => {
                                                                    const _vo = deepCopyByRecursion(vo);
                                                                    _vo.pageMainData.inrdImgFileNm = res.fileNm;
                                                                    _vo.pageMainData.inrdImgFileId = res.fileId;
                                                                    _vo.pageMainData.inrdImgUrl = res.imgUrl;
                                                                    setVo(_vo);
                                                                },
                                                                alertPopRef,
                                                                {limitSizeOpt: FileUploadSizeOpt.DEFAULT, acceptExtOpt: FileUploadExtOpt.IMAGE}
                                                            )}>
                                                        업로드
                                                    </Button>
                                                </div>
                                            </td>
                                            <th>투자사명</th>
                                            <td>
                                                <div className="input_wrap">
                                                    <input
                                                        id={'bplcNm'}
                                                        title='투자사명'
                                                        type="text"
                                                        className="input"
                                                        placeholder=""
                                                        disabled={CheckYn.YES}
                                                        defaultValue={vo.pageMainData.bplcNm}
                                                        // onChange={(event) => onChangeInputPageMainData('bplcNm', event.target.value)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>제목</th>
                                            <td colSpan={3}>
                                                <div className="input_wrap">
                                                    <input
                                                        id={'inrdTtl'}
                                                        title='투자사정보제목'
                                                        type="text"
                                                        className="input"
                                                        placeholder="제목을 입력해 주세요."
                                                        defaultValue={vo.pageMainData.inrdTtl}
                                                        maxLength={100}
                                                        onChange={(event) => {
                                                            event.target.value = StringUtils.cutStrByLimit(event.target.value, 100);
                                                            onChangeInputPageMainData('inrdTtl', event.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className="vertical_top">내용</th>
                                            <td colSpan={3}>
                                                <div className="textarea_wrap h118">
                                                    <textarea
                                                        id={'inrdCon'}
                                                        title='투자사정보내용'
                                                        className={'textarea'}
                                                        placeholder={'서브내용을 입력해 주세요.'}
                                                        defaultValue={vo.pageMainData.inrdCon}
                                                        maxLength={500}
                                                        onChange={event => {
                                                            event.target.value = StringUtils.cutStrByLimit(event.target.value, 500);
                                                            onChangeInputPageMainData('inrdCon', event.target.value);
                                                        }}
                                                    />
                                                </div>
                                                <div className="max_count_wrap">
                                                    <MaxLengthCount
                                                        ref={ivstContentMaxLengthCountRef}
                                                        max={500}
                                                        defaultCount={String(vo.pageMainData.inrdCon).length}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="section section03">
                                <div className="card_header">
                                    <h3 className="ico_title"><span className="essen_ico">*</span>투자지표</h3>
                                </div>
                                <div className="form_table_wrap">
                                    <table className="table type02">
                                        <caption>투자지표</caption>
                                        <colgroup>
                                            <col width={'10%'}/>
                                            <col width={'40%'}/>
                                            <col width={'10%'}/>
                                            <col width={'40%'}/>
                                        </colgroup>
                                        <tbody>
                                        <tr>
                                            <th>펀드금액</th>
                                            <td>
                                                <div className="input_wrap">
                                                    <NumberInput
                                                        item={vo.pageMainData}
                                                        title='펀드금액'
                                                        numberProperty={'fundAmt'}
                                                        displayValue={vo.pageMainData.fundAmt}
                                                    />
                                                </div>
                                            </td>
                                            <th>총 투자기업 수</th>
                                            <td>
                                                <div className="input_wrap">
                                                    <NumberInput
                                                        item={vo.pageMainData}
                                                        title='투자기업수'
                                                        numberProperty={'ttalIvenCnt'}
                                                        displayValue={vo.pageMainData.ttalIvenCnt}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>기업가치</th>
                                            <td>
                                                <div className="input_wrap">
                                                    <NumberInput
                                                        item={vo.pageMainData}
                                                        title='기업가치'
                                                        numberProperty={'etvlAmt'}
                                                        displayValue={vo.pageMainData.etvlAmt}
                                                    />
                                                </div>
                                            </td>
                                            <th>EXIT 기업</th>
                                            <td>
                                                <div className="input_wrap">
                                                    <NumberInput
                                                        item={vo.pageMainData}
                                                        title='EXIT기업'
                                                        numberProperty={'invmRtrvEnprCnt'}
                                                        displayValue={vo.pageMainData.invmRtrvEnprCnt}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/*진행중 이벤트*/}
                            <Eventing ref={eventingRef} alertPopRef={alertPopRef}/>

                            {/*FAQ*/}
                            <Faq ref={faqRef} alertPopRef={alertPopRef}/>

                            {/*배너정보*/}
                            <Banner ref={bannerRef} alertPopRef={alertPopRef}/>

                            {/*기타정보*/}
                            <div className="section section07">
                                <div className="card_header">
                                    <h3 className="ico_title">기타정보</h3>
                                </div>
                                <div className="form_table_wrap">
                                    <table className="table type02">
                                        <caption>기타정보</caption>
                                        <colgroup>
                                            <col width={'10%'}/>
                                            <col width={'40%'}/>
                                            <col width={'10%'}/>
                                            <col width={'40%'}/>
                                        </colgroup>
                                        <tbody>
                                        <tr>
                                            <th>고객센터</th>
                                            <td>
                                                <div className="input_wrap">
                                                    <input
                                                        id={'cscnTpn'}
                                                        title='고객센터번호'
                                                        type="text"
                                                        className="input"
                                                        placeholder="고객센터 번호를 입력해 주세요."
                                                        defaultValue={vo.pageMainData.cscnTpn}
                                                        onChange={(event) => {
                                                            event.target.value = String(event.target.value).trim().replace(/[^-0-9]/gi, '');
                                                            onChangeInputPageMainData('cscnTpn', event.target.value);
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                            <th>이메일</th>
                                            <td>
                                                <div className="input_wrap">
                                                    <input
                                                        id={'cscnEmlAdr'}
                                                        title='이메일'
                                                        type="text"
                                                        className="input"
                                                        placeholder="투자사 이메일을 입력해 주세요."
                                                        defaultValue={vo.pageMainData.cscnEmlAdr}
                                                        onChange={(event) => onChangeInputPageMainData('cscnEmlAdr', event.target.value)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>홈페이지</th>
                                            <td>
                                                <div className="input_wrap">
                                                    <input
                                                        id={'cscnHmpgUrl'}
                                                        title='홈페이지주소'
                                                        type="text"
                                                        className="input"
                                                        placeholder="투자사 홈페이지 링크를 입력해 주세요."
                                                        defaultValue={vo.pageMainData.cscnHmpgUrl}
                                                        onChange={(event) => onChangeInputPageMainData('cscnHmpgUrl', event.target.value)}
                                                    />
                                                </div>
                                            </td>
                                            <th>copyright</th>
                                            <td>
                                                <div className="input_wrap">
                                                    <input
                                                        id={'cscnCpyrCon'}
                                                        title='copyright'
                                                        type="text"
                                                        className="input"
                                                        placeholder="copyright를 입력해 주세요."
                                                        defaultValue={vo.pageMainData.cscnCpyrCon}
                                                        onChange={(event) => onChangeInputPageMainData('cscnCpyrCon', event.target.value)}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="section section08">
                                <div className="card_header">
                                    <h3 className="ico_title">투자설정</h3>
                                </div>
                                <div className="form_table_wrap">
                                    <table className="table type02">
                                        <caption>투자설정</caption>
                                        <colgroup>
                                            <col width={'10%'}/>
                                            <col width={'40%'}/>
                                            <col width={'10%'}/>
                                            <col width={'40%'}/>
                                        </colgroup>
                                        <tbody>
                                        <tr>
                                            <th>투자신청</th>
                                            <td colSpan={3}>
                                                <div className="toggles_wrap">
                                                    <ToggleCheckBox title='투자신청설정' data={toggleChk} onChange={handleToggleChk}/>
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </CardLayout>
                        <div className="btn_group form_btns">
                            <Button onClick={onClickCancel}>취소</Button>
                            <Button className={'blue'} onClick={onClickSave}>
                                저장
                            </Button>
                        </div>
                    </div>
                    <Footer/>
                </div>
            </div>
            <AlertPopup ref={alertPopRef}/>
            <ConfirmPopup ref={confirmPopRef} onConfirm={onConfirmSave}/>
            <ConfirmPopup ref={confirmCancelPopRef} onConfirm={onConfirmCancel}/>
            <MoveConfirmPopup
                ref={moveConfirmPopupRef}
                onConfirm={onConfirmSaveBeforeMove}
                onCancel={onConfirmCancelSaveBeforeMove}
            />
          <CheckCloseCallBackAlertPopup ref={checkCloseCallBackAlertPopupRef} callBack={autoCloseCallBack} />
        </>
    )
}
export default ExclusiveWrite
