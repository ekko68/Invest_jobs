/** @jsxImportSource @emotion/react */

import React, {useContext, useRef, useState} from 'react'

import {colors} from 'assets/style/style.config'
import {businessInquiryStyle} from 'assets/style/CompanyStyle'
import Button from 'components/atomic/Button'

import MaxLengthCount from "pageComponents/common/number/MaxLengthCount";
import ConfirmPopup from "pageComponents/common/pop/ConfirmPopup";
import CheckCloseAlertPopup from "pageComponents/common/pop/CheckCloseAlertPopup";

import {exeFunc} from "modules/utils/ReactUtils";
import {StringUtils} from "modules/utils/StringUtils";
import {CommonContext} from "modules/contexts/common/CommomContext";
import QueryUtils from "modules/utils/QueryUtils";
import CommonAxios, {getPostConfig} from "modules/utils/CommonAxios";
import Api from "modules/consts/Api";
import {AlertLabels} from "modules/consts/BizConst";

const BusinessInquiry = (props) => {

    const {alertPopupRef = null} = props;
    const commonContext = useContext(CommonContext);

    const maxCountRef = useRef();
    const confirmInquiryPopupRef = useRef();
    const checkCloseAlertPopupRef = useRef();

    const [inquiryData, setInquiryData] = useState({title: '', content: ''});

    const getButtonRender = () => {
        if (window.tokenCheck() && StringUtils.hasLength(commonContext.state.user.info?.userAuth)) {
            return (
                <Button theme={colors.blue} className={'btn_inquiry'} onClick={send}>
                    문의하기
                </Button>
            )
        } else {
            return <p>기업 로그인 후 이용가능한 서비스입니다.</p>
        }
    }

    const send = () => {
        if (String(inquiryData.title).trim() === '') {
            if(alertPopupRef != null) exeFunc(alertPopupRef, 'open', '제목을 입력하세요');
            return
        }
        if (String(inquiryData.content).trim() === '') {
            if(alertPopupRef != null) exeFunc(alertPopupRef, 'open', '내용을 입력하세요');
            return
        }

        exeFunc(confirmInquiryPopupRef, 'open', '사업문의 메시지를 전송합니다.');
    }

    const saveInquiry = async () => {
        const query = QueryUtils.getQuery(props)
        if (!query.hasOwnProperty('utlinsttId')) return;

        const reqBody = {
            inqrTtl: inquiryData.title,
            inqrCon: inquiryData.content,
            utlinsttId: query.utlinsttId
        }

        await commonContext.actions.callbackAfterSessionRefresh(async () => {
            const res = await CommonAxios(getPostConfig(Api.company.businessAsk, reqBody), false);
            if (res && res.status === 200) {
                // 등록 완료 후, 입력 값 초기화
                setInquiryData({...inquiryData, title: '', content: ''});

                exeFunc(checkCloseAlertPopupRef, 'open', '문의하신 요청 완료되었습니다.');
            } else {
                if(alertPopupRef != null) exeFunc(alertPopupRef, 'open', AlertLabels.askAdmin);
            }
        }, true, true);
    }

    return (
        <div className="business_inquiry card_inner" css={businessInquiryStyle}>
            <div className="card_header">
                <div className="card_title ico_title">사업문의</div>
                {getButtonRender()}
            </div>
            <div className="form_wrap">
                <input type="text"
                       placeholder="제목"
                       className="input"
                       maxLength={100}
                       disabled={commonContext.state.user.info && commonContext.state.user.info.groupId !== '' ? false : true}
                       title='사업문의 제목'
                       value={inquiryData.title}
                       onChange={e => {
                           if (e.target.value.length > 100) e.target.value.substring(0, 100);
                           setInquiryData({...inquiryData, title: e.target.value});
                       }}
                />
                <textarea
                    placeholder="내용"
                    className="textarea"
                    maxLength={200}
                    disabled={commonContext.state.user.info && commonContext.state.user.info.groupId !== '' ? false : true}
                    title='사업문의 내용'
                    value={inquiryData.content}
                    onChange={e => {
                        if (e.target.value.length > 200) e.target.value.substring(0, 200);
                        setInquiryData({...inquiryData, content: e.target.value});
                    }}
                />
                <div style={{display: 'flex', justifyContent: 'space-between'}} >
                    <p className="info">* 지금 바로 담당자에게 문의하세요.</p>
                    <MaxLengthCount ref={maxCountRef} max={200} defaultCount={String(inquiryData.content)?.length}/>
                </div>
            </div>
            <ConfirmPopup ref={confirmInquiryPopupRef} onConfirm={saveInquiry}/>
            <CheckCloseAlertPopup ref={checkCloseAlertPopupRef}/>
        </div>
    )
}

export default BusinessInquiry
