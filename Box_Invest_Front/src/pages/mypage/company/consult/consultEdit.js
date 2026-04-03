/** @jsxImportSource @emotion/react */
import React, {useContext, useEffect, useRef, useState} from 'react'
import { useHistory } from 'react-router-dom';

import Header from 'components/header/Header'
import Footer from 'components/common/Footer'
import Gallery01 from 'components/common/Gallery01'
import BreadCrumbs from 'components/common/BreadCrumbs'
import CardLayout from 'components/common/card/CardLayout'
import Button from 'components/atomic/Button'

import AlertPopup from "pageComponents/common/pop/AlertPopup";
import CheckCloseCallBackAlertPopup from "pageComponents/common/pop/CheckCloseCallBackAlertPopup";
import ConfirmPopup from "pageComponents/common/pop/ConfirmPopup";
import ProfileImage from "pageComponents/mypage/common/ProfileImage";

import Radio from 'components/atomic/Radio'
import ROUTER_NAMES from "modules/consts/RouterConst";
import ResponseUtils from "modules/utils/ResponseUtils";
import Api from "modules/consts/Api";
import QueryUtils from "modules/utils/QueryUtils";
import VoUtils from "modules/utils/VoUtils";
import CommonAxios from "modules/utils/CommonAxios";
import {getPostConfig} from "modules/utils/CommonAxios";
import {exeFunc} from "modules/utils/ReactUtils";
import {AlertLabels} from "modules/consts/BizConst";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey} from "modules/utils/CommonUtils";
import {CodeContext} from "modules/contexts/common/CodeContext";
import {StringUtils} from "modules/utils/StringUtils";


const ConsultEdit = (props) => {
    const galleryData = {
        title: '마이페이지',
        img: '/images/gallery02_img1.png'
    }

    const history = useHistory();
    const commonContext = useContext(CommonContext);
    const codeContext = useContext(CodeContext);

    const [load, setLoad] = useState(false);
    const [radioList, setRadioList] = useState({
        selected: '',
        list: [{
            id: '',
            value: ''
        }]
    });

    const [vo, setVo] = (useState({
        cnsgPtrnCd: "",
        cnsgPtrnNm: "",
        cnsgReqsCon: "",
        cnsgReqsId: "",
        cnsgReqsTtl: "",
        cnsgSttsCd: "",
        cnsgSttsNm: "",
        rgsnTs: "",
        amnnTs: "",
    }));

    const alertPopupRef = useRef();
    const autoAlertPopupRef = useRef();
    const confirmSavePopupRef = useRef();
    const confirmCancelPopupRef = useRef();

    const handleRadio = (e) => {
        setRadioList({
            ...radioList,
            selected: e.target.id
        });
        setVo({
            ...vo,
            cnsgPtrnCd: e.target.id
        })
    }

    const handleOnChange = e => {
        setVo({
           ...vo,
           [e.target.name]: e.target.value
        });
    }

    const onClickSave = () => {
        if(String(vo.cnsgReqsTtl).trim() === '') {
            exeFunc(alertPopupRef, 'open', '제목을 입력하세요');
            return;
        }

        if(String(vo.cnsgReqsCon).trim() === '') {
            exeFunc(alertPopupRef, 'open', '내용을 입력하세요');
            return ;
        }

        exeFunc(confirmSavePopupRef, 'open', AlertLabels.saveIt);
    }

    const onClickCancel = () => {
        exeFunc(confirmCancelPopupRef, 'open', AlertLabels.notSaveMove);
    }

    const editCancel = () => {
        let url = ROUTER_NAMES.MY_PAGE_CONSULT_DETAIL + "?" + 'cnsgReqsId=' + vo.cnsgReqsId;
        const query = QueryUtils.getQuery(props);
        if(query && query.hasOwnProperty('page')) {
            url = url + '&page=' + query['page'];
        }
        history.push(url);
    }

    const onClickConfirmSave = async () => {
        await commonContext.actions.callbackAfterSessionRefresh(save, true, true);
    }

    const save = async () => {
        const res = await CommonAxios(getPostConfig(Api.my.company.consultingSave, vo));
        if(res && res.status === 200) {
            exeFunc(autoAlertPopupRef, 'open', AlertLabels.saved);
        } else {
            exeFunc(alertPopupRef, 'open', AlertLabels.askAdmin);
        }
    }

    const autoCloseCallBack = () => {
        editCancel();
    }

    const loadConsultDetail = async () => {
        const query = QueryUtils.getQuery(props);
        const url = Api.my.company.consultingDetail + '/' + query['cnsgReqsId'];
        const consultObject = ResponseUtils.getSimpleResponse(url, null, false);
        return consultObject;
    }

    const isMounted = useRef(false);

    useEffect(() => {
        if(commonContext.state.user.isLoaded && codeContext.state.isLoaded
            && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
            isMounted.current = true;

            commonContext.actions.pageMountPathCheck(history, async () => {
                setLoad(false);

                const categoryList = codeContext.actions.getConsultingTypeList();

                const query = QueryUtils.getQuery(props);
                if(query && query.hasOwnProperty('cnsgReqsId')) {
                    const consultDetail = await loadConsultDetail();
                    VoUtils.setVoNullToEmpty(consultDetail);

                    setVo(consultDetail);

                    if(categoryList.length > 0) {
                        setRadioList({
                            selected: consultDetail['cnsgPtrnCd'],
                            list: categoryList
                        });
                    }
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
            <Header />
            <div className="page_container">
                <div className="wrap mypage_wrap mypage_consult detail bg02">
                    <div className="gallery_logo_wrap">
                        <Gallery01 data={galleryData} />
                        <ProfileImage />
                    </div>

                    <BreadCrumbs {...props} />

                    <div className="container default_size02">
                        {/*section start*/}
                        <div className="section section01">
                            <div className="section_header">
                                <div className="consult_view_header">
                                    <div className="header_text">컨설팅</div>
                                    <div className="header_button_wrap">
                                        <Button className={'full grey'} onClick={onClickCancel}>취소</Button>
                                        <Button className={'full blue'} onClick={onClickSave}>저장</Button>
                                    </div>
                                </div>
                            </div>
                            <div className="consult_list_wrap">
                                <div className="card_layout_wrap">
                                    {load &&
                                    <CardLayout>
                                        <div className="question_wrap first">
                                            <div className="info_header">
                                                <h3 className="ico_title">내 질문</h3>
                                            </div>
                                            <div className="question_table">
                                                <table className="table">
                                                    <caption>내 질문 테이블</caption>
                                                    <colgroup>
                                                        <col width={'10%'} />
                                                        <col width={'90%'} />
                                                    </colgroup>
                                                    <thead className='hide'>
                                                        <tr>
                                                            <th>질의타입</th>
                                                            <th>내용</th>
                                                            <th>제목</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    <tr>
                                                        <td className="title">질의 &nbsp;&nbsp; 타입</td>
                                                        <td className="check_list">
                                                            {radioList.list.map((radio) => (
                                                                <Radio
                                                                    key={createKey()}
                                                                    radio={radio}
                                                                    title={radio.value}
                                                                    onChange={(e) => handleRadio(e)}
                                                                    checked={radio.id === radioList.selected}
                                                                />
                                                            ))}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="title">
                                                            제&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;목
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="input"
                                                                style={{width: '100%'}}
                                                                maxLength={200}
                                                                type="text"
                                                                title='컨설팅제목'
                                                                name={"cnsgReqsTtl"}
                                                                defaultValue={vo.cnsgReqsTtl}
                                                                onChange={e => {
                                                                    e.target.value = StringUtils.cutStrByLimit(e.target.value, 200);
                                                                    handleOnChange(e)
                                                                }}
                                                                placeholder='제목을 입력해주세요.'/>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="title">
                                                            내&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;용
                                                        </td>
                                                        <td className='content_textarea'>
                                                            <textarea
                                                                className="textarea scroll"
                                                                maxLength={1000}
                                                                title='컨설팅내용'
                                                                name={"cnsgReqsCon"}
                                                                defaultValue={vo.cnsgReqsCon}
                                                                onChange={e => {
                                                                    e.target.value = StringUtils.cutStrByLimit(e.target.value, 1000);
                                                                    handleOnChange(e)
                                                                }}
                                                                placeholder='내용을 입력해주세요.'
                                                            ></textarea>
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </CardLayout>
                                    }
                                </div>
                            </div>
                        </div>
                        {/*section end*/}
                    </div>
                    <Footer />
                </div>
            </div>
            <AlertPopup ref={alertPopupRef} />
            <CheckCloseCallBackAlertPopup ref={autoAlertPopupRef} callBack={autoCloseCallBack} />
            <ConfirmPopup ref={confirmSavePopupRef} onConfirm={onClickConfirmSave} />
            <ConfirmPopup ref={confirmCancelPopupRef} onConfirm={editCancel} />
        </>
    )
}
export default ConsultEdit
