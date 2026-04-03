import React, {useContext, useEffect, useRef, useState} from 'react'
import {useHistory} from 'react-router-dom'

import Header from 'components/header/Header'
import Footer from 'components/common/Footer'
import Gallery01 from 'components/common/Gallery01'
import BreadCrumbs from 'components/common/BreadCrumbs'
import Button from 'components/atomic/Button'
import Select from 'components/atomic/Select'

import ConfirmPopup from 'pageComponents/common/pop/ConfirmPopup'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import CheckCloseCallBackAlertPopup from 'pageComponents/common/pop/CheckCloseCallBackAlertPopup'
import MoveTabConfirmPopup from 'pageComponents/common/pop/MoveTabConfirmPopup'

import ROUTER_NAMES from 'modules/consts/RouterConst'
import {exeFunc} from 'modules/utils/ReactUtils'
import {AlertLabels} from 'modules/consts/BizConst'
import CommonAxios from 'modules/utils/CommonAxios'
import {getPostConfig} from 'modules/utils/CommonAxios'
import Api from 'modules/consts/Api'
import {CommonContext} from "modules/contexts/common/CommomContext";
import {StringUtils} from "modules/utils/StringUtils";
import {CodeContext} from "modules/contexts/common/CodeContext";

const QaWrite = (props) => {

    const history = useHistory();
    const commonContext = useContext(CommonContext);
    const codeContext = useContext(CodeContext);

    // const inqrSbjcTtlRef = useRef()
    // const inqrSbjcConRef = useRef()
    const alertPopRef = useRef()
    const confirmPopRef = useRef()
    const moveTabEmptyConfirmRef = useRef()
    const checkCloseCallBackAlertPopupRef = useRef()

    const galleryData = {
        title: '고객지원',
        img: '/images/gallery02_img1.png'
    }

    const [load, setLoad] = useState(false);
    const [typeSelectList, setTypeSelectList] = useState({
        selected: '',
        selList: [
            {id: '', value: ''},
        ]
    });

    const [qnaData, setQnaData] = useState({
        inqrSbjcTtl: '',
        inqrSbjcCon: ''
    });

    // 타입 select 핸들러
    const handleTypeSelectList = (e) => {
        setTypeSelectList({
            ...typeSelectList,
            selected: e.target.value
        })
    }

    const onClickSave = () => {
        if (String(qnaData.inqrSbjcTtl).trim() === '' || String(qnaData.inqrSbjcCon).trim() === '') {
            exeFunc(alertPopRef, 'open', '제목 또는 내용을 입력하세요.');
            return
        }
        exeFunc(confirmPopRef, 'open', AlertLabels.saveIt);
    }

    const save = async () => {
        const params = {
            inqrSbjcTtl: qnaData.inqrSbjcTtl,
            inqrSbjcCon: qnaData.inqrSbjcCon,
            inqrDsncCd: typeSelectList.selected
        }
        let isSaveComplete = true
        const saveRes = await CommonAxios(getPostConfig(Api.support.qaSave, params))
        if (saveRes) {
            if (saveRes.status !== 200) {
                isSaveComplete = false
            }
        } else {
            isSaveComplete = false
        }
        if (isSaveComplete) {
            exeFunc(checkCloseCallBackAlertPopupRef, 'open', AlertLabels.saved);
        } else {
            exeFunc(alertPopRef, 'open', AlertLabels.notSaved);
        }
    }

    const onConfirmSave = async () => {
        await commonContext.actions.callbackAfterSessionRefresh(save, true, true);
    }

    const autoCloseCallBack = () => {
        history.replace(ROUTER_NAMES.CUSTOMER_SUPPORT_QA)
    }

    const onClickCancel = () => {
        if (String(qnaData.inqrSbjcTtl).trim() === '' || String(qnaData.inqrSbjcCon).trim() === '') {
            exeFunc(moveTabEmptyConfirmRef, 'open', AlertLabels.doNotSaveMove, ROUTER_NAMES.CUSTOMER_SUPPORT_QA);
            return
        }
        history.replace(ROUTER_NAMES.CUSTOMER_SUPPORT_QA)
    }

    const onConfirmMoveTabEmpty = async (url) => {
        location.replace(url)
    }

    const isMounted = useRef(false);

    useEffect(() => {
        if(commonContext.state.user.isLoaded && codeContext.state.isLoaded
            && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
            isMounted.current = true;

            commonContext.actions.pageMountPathCheck(history, async () => {
                setLoad(false);

                const qaTypeList = codeContext.actions.getQaTypeList();
                if (qaTypeList?.length > 0) {
                    setTypeSelectList({
                        selected: qaTypeList[0].id,
                        selList: qaTypeList
                    })
                }
                setLoad(true);
            });
        }
    }, [commonContext.state.user, codeContext.state.isLoaded]);

    useEffect(() => {
        return () => isMounted.current = false;
    }, []);

    return (
        <>
            <Header page={'sub'} {...props} />
            <div className="page_container">
                <div className="wrap cs_qna write ">
                    <div className="gallery_logo_wrap">
                        <Gallery01 data={galleryData}/>
                    </div>
                    <BreadCrumbs {...props} />
                    <div className="container default_size02">
                        {/*section start*/}
                        <div className="section section01">
                            <div className="section_header">
                                <h3 className="title">Q&#38;A 쓰기</h3>
                            </div>
                            {
                                load &&
                                <div className="card_layout_wrap">
                                    <div className="table_wrap type02 border_none">
                                        <table className="table">
                                            <caption>Q&#38;A 쓰기 테이블</caption>
                                            <colgroup>
                                                <col width={'10%'}/>
                                                <col width={'40%'}/>
                                                <col width={'10%'}/>
                                                <col width={'40%'}/>
                                            </colgroup>
                                            <tbody>
                                            <tr>
                                                <th>제&nbsp;&nbsp;&nbsp;&nbsp;목</th>
                                                <td colSpan={3}>
                                                    <input title='Q&A제목' type="text" className="input"
                                                           defaultValue={qnaData.inqrSbjcTtl}
                                                           maxLength={200}
                                                           onChange={e => {
                                                               e.target.value = StringUtils.cutStrByLimit(e.target.value, 200);
                                                               setQnaData({...qnaData, inqrSbjcTtl: e.target.value});
                                                           }}/>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>타입</th>
                                                <td colSpan={3}>
                                                    <Select
                                                        title='Q&A타입'
                                                        className={'select_type'}
                                                        optList={typeSelectList.selList}
                                                        selected={typeSelectList.selected}
                                                        onChange={handleTypeSelectList}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>글쓴이</th>
                                                <td colSpan={3}>{
                                                    StringUtils.hasLength(commonContext.state.user.info?.userNm)
                                                        ?   commonContext.state.user.info.userNm :   ''
                                                }</td>
                                            </tr>
                                            <tr>
                                                <th className={'vertical_middle'}>내&nbsp;&nbsp;&nbsp;&nbsp;용</th>
                                                <td colSpan={3}>
                                                    <textarea title='Q&A내용' className={'textarea'}
                                                              defaultValue={qnaData.inqrSbjcCon}
                                                              maxLength={1000}
                                                              onChange={e => {
                                                                  e.target.value = StringUtils.cutStrByLimit(e.target.value, 1000);
                                                                  setQnaData({...qnaData, inqrSbjcCon: e.target.value});
                                                              }}/>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className={'btn_group'}>
                                        <Button className={'blue linear'} onClick={onClickCancel}>
                                            취소
                                        </Button>
                                        <Button className={'blue'} onClick={onClickSave}>
                                            저장
                                        </Button>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    <Footer/>
                </div>
            </div>
            <AlertPopup ref={alertPopRef}/>
            <ConfirmPopup ref={confirmPopRef} onConfirm={onConfirmSave}/>
            <CheckCloseCallBackAlertPopup ref={checkCloseCallBackAlertPopupRef} callBack={autoCloseCallBack}/>
            <MoveTabConfirmPopup ref={moveTabEmptyConfirmRef} onConfirm={onConfirmMoveTabEmpty}/>
        </>
    )
}
export default QaWrite
