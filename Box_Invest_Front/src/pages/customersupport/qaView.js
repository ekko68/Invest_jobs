import React, {useContext, useEffect, useRef, useState} from 'react'
import {useHistory} from 'react-router-dom'

import Header from 'components/header/Header'
import Footer from 'components/common/Footer'
import Gallery01 from 'components/common/Gallery01'
import BreadCrumbs from 'components/common/BreadCrumbs'
import Button from 'components/atomic/Button'

import CheckCloseCallBackAlertPopup from "pageComponents/common/pop/CheckCloseCallBackAlertPopup";
import ConfirmPopup from "pageComponents/common/pop/ConfirmPopup";
import AlertPopup from "pageComponents/common/pop/AlertPopup";
import CheckCloseAlertPopup from "pageComponents/common/pop/CheckCloseAlertPopup";

import QueryUtils from 'modules/utils/QueryUtils'
import Api from 'modules/consts/Api'
import DateUtils from 'modules/utils/DateUtils'
import {StringUtils} from 'modules/utils/StringUtils'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import VoUtils from 'modules/utils/VoUtils'
import CommonAxios from "modules/utils/CommonAxios";
import {getConfig, getPostConfig} from "modules/utils/CommonAxios";
import {exeFunc} from "modules/utils/ReactUtils";
import {AlertLabels, CheckYn, QnaStatusCode} from "modules/consts/BizConst";
import {CommonContext} from "modules/contexts/common/CommomContext";

const QaView = (props) => {
    const galleryData = {
        title: '고객지원',
        img: '/images/gallery02_img1.png'
    }
    const alertPopRef = useRef();
    const confirmPopRef = useRef();
    const checkCloseAlertPopRef = useRef();
    const checkCloseCallBackAlertPopupRef = useRef();
    const [load, setLoad] = useState(false);
    const [vo, setVo] = useState({
        amnnTs: '',
        amnnUserId: '',
        amnnUserNm: '',
        delYn: '',
        imgFileId: '',
        imgUrl: '',
        inqrSbjcCon: '',
        inqrSbjcId: '',
        inqrSbjcRplyCon: '',
        inqrSbjcTtl: '',
        pgstCd: '',
        pgstNm: '',
        inqrDsncCd: '',
        inqrDsncNm: '',
        rgsnTs: '',
        rgsnUserId: '',
        rgsnUserNm: '',
        rnum: '',
        rplyMngrId: '',
        rplyTs: '',
        rvsRnum: '',
        totalCnt: 0,
        rightYn: ''
    })

    const history = useHistory();
    const commonContext = useContext(CommonContext);

    const onClickList = () => {
        let url = ROUTER_NAMES.CUSTOMER_SUPPORT_QA
        const query = QueryUtils.getQuery(props)
        if (query) {
            if (query.hasOwnProperty('page')) {
                url += '?page=' + query['page']
                if (query.hasOwnProperty('searchContent')) {
                    url += '&searchContent=' + query['searchContent']
                }
            }
        }
        history.push(url)
    }

    const onClickCancel = () => {
        exeFunc(confirmPopRef, 'open', AlertLabels.askCancel);
    }

    const confirmCancel = async () => {
        await commonContext.actions.callbackAfterSessionRefresh(async () => {
            const res = await CommonAxios(getPostConfig(Api.support.qaCancel, vo));
            if (res && res.status === 200 && res.data.code === '200') {
                exeFunc(checkCloseAlertPopRef, 'open', AlertLabels.canceled);
                const qaDetailObject = await loadQaDetail();
                setVo(qaDetailObject);
            } else {
                exeFunc(alertPopRef, 'open', AlertLabels.askAdmin);
            }
        }, true, true);
    }

    const loadQaDetail = async () => {
        const query = QueryUtils.getQuery(props)
        const url = Api.support.qaDetail + '/' + query['inqrSbjcId']

        const res = await CommonAxios(getConfig(url), false);

        if (res && res.status === 200 && res.data.data['rightYn'] === CheckYn.YES) {
            return res.data.data
        } else {
            exeFunc(checkCloseCallBackAlertPopupRef, 'open', AlertLabels.isPrivate);
            return
        }
    }

    const isMounted = useRef(false); // useEffect에서 mount 유무 동기확인을 위함

    useEffect(() => {
        if(commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
            isMounted.current = true;

            commonContext.actions.pageMountPathCheck(history, async () => {
                setLoad(false);
                const query = QueryUtils.getQuery(props)
                if (query && query.hasOwnProperty('inqrSbjcId')) {
                    const qaDetailObject = await loadQaDetail()
                    if (qaDetailObject) {
                        VoUtils.setVoNullToEmpty(qaDetailObject, ['totalCnt']);
                        setVo(qaDetailObject);
                        setLoad(true);
                    }
                }
            });
        }
    }, [commonContext.state.user]);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        }
    }, []);

    return (
        <>
            <Header page={'sub'} {...props} />
            <div className="page_container">
                <div className="wrap cs_qna view ">
                    <div className="gallery_logo_wrap">
                        <Gallery01 data={galleryData}/>
                    </div>

                    <BreadCrumbs {...props} />

                    <div className="container default_size02">
                        {/*section start*/}
                        <div className="section section01">
                            <div className="section_header">
                                <h3 className="title">Q&#38;A</h3>
                            </div>
                            <div className="card_layout_wrap">
                                {
                                    load &&
                                    <div className="table_wrap type02 border_none">
                                        <table className="table">
                                            <caption>Q&#38;A 상세 테이블</caption>
                                            <colgroup>
                                                <col width={'10%'}/>
                                                <col width={'40%'}/>
                                                <col width={'10%'}/>
                                                <col width={'40%'}/>
                                            </colgroup>
                                            <tbody>
                                            <tr>
                                                <th>타입</th>
                                                <td>{vo.inqrDsncNm}</td>
                                                <th>상태</th>
                                                <td>
                                                    {
                                                        (() => {
                                                            let styleName = 'status_standBy'
                                                            if (vo.pgstCd === QnaStatusCode.COMPLETE) styleName = 'status_complete'
                                                            else if (vo.pgstCd === QnaStatusCode.CANCEL) styleName = 'status_cancel'

                                                            return <span className={styleName}>{vo.pgstNm}</span>
                                                        })()
                                                    }
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>제&nbsp;&nbsp;&nbsp;&nbsp;목</th>
                                                <td colSpan={3}>
                                                    <h3 className={'title'} style={{fontSize: '14px', fontWeight: 'normal'}}>{vo.inqrSbjcTtl}</h3>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>글쓴이</th>
                                                <td>{vo.rgsnUserNm}</td>
                                                <th>날짜</th>
                                                <td>{DateUtils.convertYyyyMmDdNormalDate(vo.rgsnTs)}</td>
                                            </tr>
                                            <tr>
                                                <th>내&nbsp;&nbsp;&nbsp;&nbsp;용</th>
                                                <td colSpan={3}>
                                                    <div
                                                        className="view_content"
                                                        dangerouslySetInnerHTML={{__html: StringUtils.toBr(vo.inqrSbjcCon)}}
                                                    ></div>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                }

                                {/*reply_wrap start*/}
                                {
                                    (load && vo?.pgstCd === QnaStatusCode.COMPLETE) &&
                                    <div className="reply_wrap">
                                        <div className="section_header">
                                            <h3 className="title">Q&A 답변</h3>
                                        </div>
                                        <div className="table_wrap type02 border_none">
                                            <table className="table  ">
                                                <caption>Q&#38;A 답변 테이블</caption>
                                                <colgroup>
                                                    <col width={'10%'}/>
                                                    <col width={'40%'}/>
                                                    <col width={'10%'}/>
                                                    <col width={'40%'}/>
                                                </colgroup>
                                                <tbody>
                                                <tr>
                                                    <th>날짜</th>
                                                    <td colSpan={3}>{DateUtils.convertYyyyMmDdNormalDate(vo.rplyTs)}</td>
                                                </tr>
                                                <tr>
                                                    <th>답&nbsp;&nbsp;&nbsp;&nbsp;변</th>
                                                    <td colSpan={3}>
                                                        <div
                                                            className="view_content"
                                                            dangerouslySetInnerHTML={{__html: StringUtils.toBr(vo.inqrSbjcRplyCon)}}
                                                        ></div>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                }
                                <div className={'btn_group'}>
                                    <Button className={'blue'} onClick={onClickList}>
                                        목록으로
                                    </Button>
                                    {
                                        (commonContext.state.user.info?.id === vo?.rgsnUserId && vo?.pgstCd === QnaStatusCode.READY) &&
                                        <Button className={'grey'} onClick={onClickCancel}>
                                            취소
                                        </Button>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer/>
                </div>
            </div>
            <CheckCloseCallBackAlertPopup ref={checkCloseCallBackAlertPopupRef} callBack={onClickList}/>
            <ConfirmPopup ref={confirmPopRef} onConfirm={confirmCancel}/>
            <CheckCloseAlertPopup ref={checkCloseAlertPopRef}/>
            <AlertPopup ref={alertPopRef}/>
        </>
    )
}
export default QaView
