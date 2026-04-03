import React, {forwardRef, useContext, useImperativeHandle, useState} from 'react';

import {colors} from "assets/style/style.config";

import PopupHeader from "components/popups/PopupHeader";
import PopupFooter from "components/popups/PopupFooter";
import Button from "components/atomic/Button";

import {StringUtils} from "modules/utils/StringUtils";
import {CommonContext} from "modules/contexts/common/CommomContext";
import DateUtils from "modules/utils/DateUtils";
import {createKey} from "modules/utils/CommonUtils";
import {fileDownload} from "modules/utils/CommonAxios";
import ResponseUtils from "modules/utils/ResponseUtils";
import VoUtils from "modules/utils/VoUtils";
import {CheckYn} from "modules/consts/BizConst";

const DetailPopup = forwardRef((props, ref) => {

    const {
        readOnly,
        loadApi,
        msgType,

        openReplyPopup = null,
        closeRefreshList = null
    } = props;

    const initVo = {
        invmExntRqstId: '',

        sendReplyYn: CheckYn.NO,

        fileList: [],
        fileYn: '',
        imgUrl: '',

        msgId: '',
        prnsMsgId: '',
        cnfaYn: '',
        rcvInttId: '',
        dsmsInttId: '',
        msgTtl: '',
        msgCon: '',
        msgPtrnCd: '',
        msgPtrnNm: '',
        rcvrBplcNm: '',
        trntBplcNm: '',
        rgsnTs: '',
        rgsnUserId: '',
        rgsnUserNm: '',
    }

    const commonContext = useContext(CommonContext);

    const [isOpen, setIsOpen] = useState(false);
    const [vo, setVo] = useState({...initVo});

    useImperativeHandle(ref, () => ({
        open, close
    }));

    const open = async (item) => {
        await commonContext.actions.callbackAfterSessionRefresh(async () => {
            if (item) await loadMessageDetail(item.msgId);
            setIsOpen(true);
        }, true, true);
        document.body.classList.add("popupScrollLock");
    }

    const close = () => {
        if(closeRefreshList) closeRefreshList(vo.msgId);

        setVo({...initVo});
        setIsOpen(false);
        document.body.classList.remove("popupScrollLock");
    }

    const onClickOpenReplyPopup = () => {
        if (openReplyPopup === null) return;

        if (StringUtils.hasLength(vo.prnsMsgId)) openReplyPopup(vo.prnsMsgId, vo.msgTtl);
        else openReplyPopup(vo.msgId, vo.msgTtl);
    }

    const loadMessageDetail = async (msgId) => {
        if (StringUtils.isAnyBlank(loadApi, msgId)) return;

        const res = await ResponseUtils.getSimpleResponse(loadApi + '/' + msgId);
        if (res) {
            VoUtils.setVoNullToEmpty(res, [], ['fileList']);
            setVo(res);
        }
    }

    return (
        <>
            {
                isOpen &&
                <div className="popup_wrap popup_message_check">
                    <div className="popup_layout">&nbsp;</div>
                    <div className="popup_container scroll">
                        <PopupHeader title={'메시지 확인하기'} handlePopup={close}/>
                        <div className="popup_content_inner">
                            <table className="table type04">
                                <caption>계정 정보 테이블</caption>
                                <colgroup>
                                    <col width={'15%'}/>
                                    <col width={'85%'}/>
                                </colgroup>
                                <tbody>
                                <tr>
                                    <th>보낸기업</th>
                                    <td>{vo.trntBplcNm}</td>
                                </tr>
                                <tr>
                                    <th>받은기업</th>
                                    <td>{vo.rcvrBplcNm}</td>
                                </tr>
                                <tr>
                                    <th>날&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;짜</th>
                                    <td>{DateUtils.convertYyyyMmDdNormalDate(vo.rgsnTs)}</td>
                                </tr>
                                <tr className="title">
                                    <th>제&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;목</th>
                                    <td className="limit">
                                        <p>{vo.msgTtl}</p>
                                    </td>
                                </tr>
                                <tr className="contents">
                                    <th>내&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;용</th>
                                    <td className="content_text">
                                        <p className="scroll"
                                           dangerouslySetInnerHTML={{__html: StringUtils.toBr(vo.msgCon)}}></p>
                                    </td>
                                </tr>
                                <tr className="attach_file">
                                    <th>첨부파일</th>
                                    <td className="limit content">
                                        {
                                            vo?.fileList?.map((item, index) => (
                                                <p key={createKey()}
                                                   style={{cursor: 'pointer'}}
                                                   onClick={() =>
                                                       commonContext.actions.callbackAfterSessionRefresh(
                                                           async () => await fileDownload(item), true, true)}>
                                                    {item['fileNm']}
                                                </p>
                                            ))
                                        }
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                        <PopupFooter>
                            <div className="btn_group">
                                <Button theme={colors.lightGrey} onClick={close}>
                                    닫기
                                </Button>
                                {
                                    (() => {
                                        if ((msgType !== undefined && msgType === 'send')
                                            || (readOnly !== undefined && readOnly === true)
                                            || (vo.sendReplyYn !== CheckYn.YES)) return <></>

                                        const userInfo = commonContext.state.user.info;

                                        if (userInfo !== null && vo.dsmsInttId === userInfo.groupId) {
                                            return (
                                                <Button theme={colors.blue} onClick={onClickOpenReplyPopup}>
                                                    추가메시지
                                                </Button>
                                            )
                                        } else {
                                            return (
                                                <Button theme={colors.blue} onClick={onClickOpenReplyPopup}>
                                                    답장하기
                                                </Button>
                                            )
                                        }
                                    })()
                                }
                            </div>
                        </PopupFooter>
                    </div>
                </div>
            }
        </>
    )
});

export default DetailPopup;