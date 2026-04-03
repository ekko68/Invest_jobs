import React, {useContext, useEffect, useRef, useState} from 'react'
import {useHistory} from 'react-router-dom'

import Radio from 'components/atomic/Radio'
import CardLayout from 'components/common/card/CardLayout'
import BreadCrumbs from 'components/common/BreadCrumbs'
import Button from 'components/atomic/Button'
import Header from 'components/header/Header'
import Gallery01 from 'components/common/Gallery01'
import Footer from 'components/common/Footer'

import AlertPopup from "pageComponents/common/pop/AlertPopup";
import ConfirmPopup from "pageComponents/common/pop/ConfirmPopup";
import CheckCloseCallBackAlertPopup from "pageComponents/common/pop/CheckCloseCallBackAlertPopup";
import ProfileImage from "pageComponents/mypage/common/ProfileImage";

import ROUTER_NAMES from 'modules/consts/RouterConst'
import QueryUtils from "modules/utils/QueryUtils";
import ResponseUtils from "modules/utils/ResponseUtils";
import Api from "modules/consts/Api";
import VoUtils from "modules/utils/VoUtils";
import {StringUtils} from "modules/utils/StringUtils";
import DateUtils from "modules/utils/DateUtils";
import CommonAxios from "modules/utils/CommonAxios";
import {getPostConfig} from "modules/utils/CommonAxios";
import {exeFunc} from "modules/utils/ReactUtils";
import {AlertLabels, ConsultStatusCode, UsisType} from "modules/consts/BizConst";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey} from "modules/utils/CommonUtils";
import {CodeContext} from "modules/contexts/common/CodeContext";

const ConsultDetail = (props) => {
    const galleryData = {
        title: '마이페이지',
        img: '/images/gallery02_img1.png'
    }

    const history = useHistory()
    const commonContext = useContext(CommonContext);
    const codeContext = useContext(CodeContext);

    const [radioList, setRadioList] = useState({
        selected: '',
        list: [{
            id: '',
            value: ''
        }]
    });

    const [vo, setVo] = (useState({
        cnsgDt: "",
        cnsgPtrnCd: "",
        cnsgPtrnNm: "",
        cnsgReqsCon: "",
        cnsgReqsId: "",
        cnsgReqsTtl: "",
        cnsgRplyCon: "",
        cnsgSttsCd: "",
        cnsgSttsNm: "",
        rgsnTs: "",
        amnnTs: "",
        rplyTs: ""
    }));

    const [load, setLoad] = useState(false);

    const cancelConfirmPopRef = useRef();
    const alertPopRef = useRef();
    const checkCloseAlertPopRef = useRef();

    const onClickList = () => {
        let url = ROUTER_NAMES.MY_PAGE_CONSULT;

        const query = QueryUtils.getQuery(props);
        if (query && query.hasOwnProperty('page')) url = url + '?page=' + query['page'];

        history.push(url);
    }

    const loadConsultDetail = async () => {
        const query = QueryUtils.getQuery(props);
        const url = Api.my.company.consultingDetail + '/' + query['cnsgReqsId'];
        const consultObject = ResponseUtils.getSimpleResponse(url, null, false);
        return consultObject;
    }

    const onClickCancelPopup = () => {
        exeFunc(cancelConfirmPopRef, "open", "컨설팅 의뢰를 취소하시겠습니까?");
    }

    const autoCloseCallBack = () => {
        onClickList();
    }

    const onConfirmCancel = async () => {
        await commonContext.actions.callbackAfterSessionRefresh(cancelConsult, true, true);
    }

    const cancelConsult = async () => {
        const reqBody = {
            id: vo.cnsgReqsId
        };

        const res = await CommonAxios(getPostConfig(Api.my.company.consultingCancel, reqBody), false);
        if (res && res.status === 200) {
            exeFunc(checkCloseAlertPopRef, "open", AlertLabels.canceled);
        } else {
            exeFunc(alertPopRef, "open", AlertLabels.askAdmin);
        }
    }


    const onClickMoveWrite = () => {
        let url = ROUTER_NAMES.MY_PAGE_CONSULT_WRITE + "?" + 'cnsgReqsId=' + vo.cnsgReqsId;
        const query = QueryUtils.getQuery(props);
        if (query && query.hasOwnProperty('page')) url = url + '&page=' + query.page;
        history.push(url);
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
                if (query && query.hasOwnProperty('cnsgReqsId')) {
                    const consultDetail = await loadConsultDetail();
                    VoUtils.setVoNullToEmpty(consultDetail);

                    setVo(consultDetail);

                    if (categoryList.length > 0) {
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
            <Header/>
            <div className="page_container">
                <div className="wrap mypage_wrap mypage_consult detail bg02">
                    <div className="gallery_logo_wrap">
                        <Gallery01 data={galleryData}/>
                        <ProfileImage/>
                    </div>

                    <BreadCrumbs {...props} />

                    <div className="container default_size02">
                        {/*section start*/}
                        <div className="section section01">
                            <div className="section_header">
                                <div className="consult_view_header">
                                    <div className="header_text">컨설팅</div>
                                    <div className="header_button_wrap">
                                        {
                                            (vo.cnsgSttsCd && vo.cnsgSttsCd === ConsultStatusCode.READY)
                                                ?   <>
                                                        <Button className={'linear blue'} onClick={onClickList}>리스트</Button>
                                                        <Button className={'linear grey del'} onClick={onClickCancelPopup}>취소</Button>
                                                        <Button className={'full blue'} onClick={onClickMoveWrite}>수정하기</Button>
                                                    </>
                                                :   <Button className={'linear blue'} onClick={onClickList}>리스트</Button>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="consult_list_wrap">
                                <div className="card_layout_wrap">
                                    {load &&
                                    <CardLayout>
                                        <div className="question_wrap first">
                                            <div className="info_header">
                                                <h3 className="ico_title">진행단계</h3>
                                            </div>
                                            <div className="question_table">
                                                <table className="table">
                                                    <caption>진행단계 테이블</caption>
                                                    <colgroup>
                                                        <col width={'10%'}/>
                                                        <col width={'90%'}/>
                                                    </colgroup>
                                                    <thead className={'hide'}>
                                                    <tr>
                                                        <th>진행상태</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    <tr>
                                                        <td className="title">진행 상태</td>
                                                        {/*<td>대기중</td>*/}
                                                        <td>{vo.cnsgSttsNm}</td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="question_wrap">
                                            <div className="info_header">
                                                <h3 className="ico_title">내 질문</h3>
                                            </div>
                                            <div className="question_table">
                                                <table className="table">
                                                    <caption>내 질문 테이블</caption>
                                                    <colgroup>
                                                        <col width={'10%'}/>
                                                        <col width={'90%'}/>
                                                    </colgroup>
                                                    <thead className={'hide'}>
                                                    <tr>
                                                        <th>질의타입</th>
                                                        <th>제목</th>
                                                        <th>내용</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    <tr>
                                                        <td className="title">질의 &nbsp;&nbsp; 타입</td>
                                                        <td className="check_list">
                                                            {
                                                                radioList?.list?.map((radio) => (
                                                                    <Radio
                                                                        key={createKey()}
                                                                        radio={radio}
                                                                        disabled={true}
                                                                        checked={radio.id === radioList.selected}
                                                                    />
                                                                ))
                                                            }
                                                            <p className="date_text">{DateUtils.convertYyyyMmDdNormalDate(vo.rgsnTs)}</p>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="title">
                                                            제&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;목
                                                        </td>
                                                        <td>{vo.cnsgReqsTtl}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className="title">
                                                            내&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;용
                                                        </td>
                                                        <td>
                                                            <p className="content scroll" dangerouslySetInnerHTML={{__html: StringUtils.toBr(vo.cnsgReqsCon)}}/>
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {
                                            (vo?.cnsgRplyCon !== '') &&
                                            <div className="answer_wrap">
                                                <div className="info_header">
                                                    <h3 className="ico_title">컨설턴트 답변</h3>
                                                    <p className="date_text">{DateUtils.convertYyyyMmDdNormalDate(vo.rplyTs)}</p>
                                                </div>
                                                <div className="answer_inner" dangerouslySetInnerHTML={{__html: StringUtils.toBr(vo.cnsgRplyCon)}}>
                                                </div>
                                            </div>
                                        }
                                    </CardLayout>
                                    }
                                </div>
                            </div>
                        </div>
                        {/*section end*/}
                    </div>
                    <Footer/>
                </div>
            </div>
            <ConfirmPopup ref={cancelConfirmPopRef} onConfirm={onConfirmCancel}/>
            <AlertPopup ref={alertPopRef}/>
            <CheckCloseCallBackAlertPopup ref={checkCloseAlertPopRef} callBack={autoCloseCallBack}/>
        </>
    )
}
export default ConsultDetail
