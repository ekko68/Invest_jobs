import React, {forwardRef, useContext, useImperativeHandle, useRef, useState} from 'react';
import {useHistory} from 'react-router-dom';

import DetailPopup from "pageComponents/mypage/common/message/DetailPopup";
import SendFormPopup from "pageComponents/mypage/common/message/SendFormPopup";

import Button from "components/atomic/Button";
import NoResult from "components/common/NoResult";
import CardLayout from "components/common/card/CardLayout";

import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey} from "modules/utils/CommonUtils";
import {StringUtils} from "modules/utils/StringUtils";
import {exeFunc} from "modules/utils/ReactUtils";
import DateUtils from "modules/utils/DateUtils";
import ResponseUtils from "modules/utils/ResponseUtils";
import {CheckYn} from "modules/consts/BizConst";

const RecentMessageList = forwardRef((props, ref) => {

    const {
        listRouter='',
        apiProps={
            loadListApi: '',
            detailApi: '',
            replyApi: '',
        }
    } = props;

    const history = useHistory();
    const commonContext = useContext(CommonContext);

    const [list, setList] = useState([]);

    const detailPopupRef = useRef();
    const replyFormPopupRef = useRef();

    useImperativeHandle(ref, () => ({
        setData
    }));

    const setData = async () => {
        await loadMessageRecentList();
    }

    const loadMessageRecentList = async () => {
        if(!StringUtils.hasLength(apiProps.loadListApi)) return;
        const res = await ResponseUtils.getSimpleResponse(apiProps.loadListApi, null, false);
        if (res) setList(res.list);
    }

    return (
        <div className={'section section03 msg_latest msg_list_wrap'}>
            <div className="card_layout_wrap">
                <CardLayout>
                    <div className="card_header">
                        <h3 className="title">
                            최근 메시지
                        </h3>
                        <div className="btn_more" style={{cursor: 'pointer'}}
                             onClick={() => {if(StringUtils.hasLength(listRouter)) history.push(listRouter)}}>
                            <span className="hide">더보기</span>
                        </div>
                    </div>
                    <div className="table_wrap">
                        <table className="table">
                            <caption>받은 메시지함 테이블</caption>
                            <colgroup>
                                <col width={'5%'}/>
                                <col width={'*'}/>
                                <col width={'10%'}/>
                                <col width={'10%'}/>
                                <col width={'17%'}/>
                                <col width={'25%'}/>
                                <col width={'10%'}/>
                            </colgroup>
                            <thead>
                            <tr>
                                <th>NO</th>
                                <th>제목</th>
                                <th>분류</th>
                                <th>보낸사람</th>
                                <th>소속</th>
                                <th>날짜</th>
                                <th>첨부</th>
                            </tr>
                            </thead>
                            <tbody>{
                                (list?.length > 0)
                                    ? list.map((item, i) => (
                                        <tr key={createKey()}
                                            style={{cursor: 'pointer'}}
                                            onClick={() => exeFunc(detailPopupRef, 'open', item)}>
                                            <td>{20 - i}</td>
                                            <td className={`content${item.replyYn === CheckYn.YES ? ' apply' : ''}${item.cnfaYn === CheckYn.NO ? ' new' : ''}`}>
                                                <div className='text_wrap'>
                                                    <div className="text">
                                                        {item.msgTtl}
                                                    </div>
                                                    {
                                                        (item.rcvInOneDayYn === CheckYn.YES && item.cnfaYn === CheckYn.NO) &&
                                                        <div className='new_text'>new</div>
                                                    }
                                                </div>
                                            </td>
                                            <td>{item.msgPtrnNm}</td>
                                            <td>{
                                                StringUtils.hasLength(item?.rgsnUserNm)
                                                    ? String(item.rgsnUserNm).substring(0, 1) + '**'
                                                    : ''
                                            }</td>
                                            <td className="team">
                                                <p>{item.trntBplcNm}</p>
                                            </td>
                                            <td>{DateUtils.convertYyyyMmDdNormalDate(item.rgsnTs)}</td>
                                            <td className="attachment">{
                                                item?.fileYn === CheckYn.YES
                                                    ? <div className="attachment_img"><span className="hide">첨부파일</span></div>
                                                    : <></>
                                            }</td>
                                        </tr>
                                    ))
                                    : <tr>
                                        <td colSpan={8}><NoResult msg={'최근메시지 정보가 없습니다.'} style={{marginTop: '40px', marginBottom: '40px'}}/></td>
                                    </tr>
                            }</tbody>
                        </table>
                    </div>
                </CardLayout>
            </div>

            <DetailPopup ref={detailPopupRef}
                         loadApi={apiProps.detailApi}
                         openReplyPopup={(parentId, parentTtl) => {
                             exeFunc(detailPopupRef, 'close');
                             exeFunc(replyFormPopupRef, 'open', parentId, parentTtl);
                         }} />
            <SendFormPopup ref={replyFormPopupRef}
                           title={'답장하기'}
                           sendApi={apiProps.replyApi}
                           refreshList={() => commonContext.actions.callbackAfterSessionRefresh(
                               loadMessageRecentList, true, true
                           )} />
        </div>
    )
});

export default RecentMessageList;