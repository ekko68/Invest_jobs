import React, {forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState} from 'react';
import {colors} from "assets/style/style.config";

import CardLayout from "components/common/card/CardLayout";
import Button from "components/atomic/Button";
import NoResult from "components/common/NoResult";
import Total01 from "components/common/number/Total01";

import Paging from 'pageComponents/common/Paging';
import AlertPopup from "pageComponents/common/pop/AlertPopup";
import ConfirmPopup from "pageComponents/common/pop/ConfirmPopup";
import CheckCloseCallBackAlertPopup from "pageComponents/common/pop/CheckCloseCallBackAlertPopup";
import DetailPopup from "pageComponents/mypage/common/message/DetailPopup";
import SendFormPopup from "pageComponents/mypage/common/message/SendFormPopup";

import {createKey, deepCopyByRecursion} from "modules/utils/CommonUtils";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {StringUtils} from "modules/utils/StringUtils";
import DateUtils from "modules/utils/DateUtils";
import {exeFunc, getFunc, setFunc} from "modules/utils/ReactUtils";
import CommonAxios, {getPostConfig} from "modules/utils/CommonAxios";
import {AlertLabels, CheckYn} from "modules/consts/BizConst";
import ResponseUtils from "modules/utils/ResponseUtils";

// 메시지 컴포넌트 재정리
// 우선 페이지 분할 및 라우팅, forwardRef 사용은 기존 투자박스 형식과 맞춰놓음
const MessageList = forwardRef((props, ref) => {

    const {
        tableTitle = '', // 받은메시지함
        listType='',
        apiProps = {
            loadListApi: '',
            readAllApi: '',

            detailApi: '',
            sendApi: '',
            replyApi: '',
        },
        pagePropsParam = {
            record: 10,
            pageSize: 5
        }
    } = props;

    const commonContext = useContext(CommonContext);

    const pagingRef = useRef();
    const pageRef = useRef(1);
    const totalPageRef = useRef(0);

    // 검색어 기능 추가 (현재 제목, 수신or발신기관 기준으로 잡음)
    // 검색 버튼을 클릭할 경우에만 검색어 변경이 적용됨
    // 기존 페이지가 ref이므로 useEffect 적용하지 않고 ref로 우선 처리함
    const searchStrInputRef = useRef();
    const searchStrValueRef = useRef('');

    const alertPopupRef = useRef();
    const readAllConfirmPopupRef = useRef();
    const successAlertPopupRef = useRef();

    const detailPopupRef = useRef();
    const replyFormPopupRef = useRef();

    const [list, setList] = useState([]);

    const onChangePage = async (pageNumber) => {
        await commonContext.actions.callbackAfterSessionRefresh(async () => {
            pageRef.current = pageNumber;
            await loadMessageList();
        }, true, true);
    }

    useImperativeHandle(ref, () => ({
        setData
    }));

    const setData = async () => {
        await loadMessageList();
    }

    const saveReadAll = async () => {
        if(!StringUtils.hasLength(apiProps.readAllApi)) return;

        const res = await CommonAxios(getPostConfig(apiProps.readAllApi));
        if(res?.status === 200 && res.data?.code == '200') exeFunc(successAlertPopupRef, 'open', '전체 읽음으로 변경되었습니다.');
        else exeFunc(alertPopupRef, 'open', AlertLabels.askAdmin);
    }

    const loadMessageList = async () => {
        if(!StringUtils.hasLength(apiProps.loadListApi)) return;

        const params = {
            page: pageRef.current,
            record: pagePropsParam.record,
            pageSize: pagePropsParam.pageSize,
            searchStr: searchStrValueRef.current
        }

        const res = await ResponseUtils.getSimpleResponse(apiProps.loadListApi, params, false);
        if(res) {
            pageRef.current = res.page;
            totalPageRef.current = res.totalPage;

            setFunc(pagingRef, 'setPaging', res);
            setList(deepCopyByRecursion(res.list)?.map(item => { return {...item, key: createKey()} }));
        }
        if(searchStrValueRef.current !== searchStrInputRef.current?.value) {
            searchStrInputRef.current.value = searchStrValueRef.current;
        }
    }

    return (
        <>
            <div className="search_section">
                <div className={'search_wrap message_search'}>
                    {/*search_top start*/}
                    <div className="search_top">
                        <div className="inner">
                            <input type="text" className="input"
                                   ref={searchStrInputRef}
                                   placeholder="검색내용을 입력해주세요" />
                            <Button className="search" theme={colors.blue}
                                    onClick={async () => {
                                        await commonContext.actions.callbackAfterSessionRefresh(async () => {
                                            searchStrValueRef.current = searchStrInputRef.current?.value;
                                            pageRef.current = 1;
                                            await loadMessageList();
                                        }, true, true);
                                    }}
                            >
                                검색
                            </Button>
                        </div>
                    </div>
                    {/*search_top end*/}
                </div>
            </div>

            <div className="card_layout_wrap">
                <CardLayout>
                    <div className="info_header">
                        <h3 className="ico_title">{tableTitle}</h3>
                        {
                            listType === 'receive' &&
                            <div className="btn_wrap">
                                {
                                    StringUtils.hasLength(apiProps.readAllApi) &&
                                    <Button className={'linear blue'}
                                            onClick={() => exeFunc(readAllConfirmPopupRef, 'open', '전체 읽음으로 처리하시겠습니까?')}>
                                        전체읽음
                                    </Button>
                                }
                            </div>
                        }
                    </div>
                    <div className="table_wrap">
                        <table className="table">
                            <caption>{`${tableTitle} 테이블`}</caption>
                            <colgroup>
                                <col width={'5%'}/>
                                <col width={'*'}/>
                                <col width={'8%'}/>
                                <col width={'8%'}/>
                                <col width={'10%'}/>
                                <col width={'20%'}/>
                                <col width={'8%'}/>
                            </colgroup>
                            <thead>
                            <tr>
                                <th>NO</th>
                                <th>제목</th>
                                <th>분류</th>
                                <th>보낸사람</th>
                                {/*<th>소속</th>*/}
                                <th>{listType === 'receive'
                                    ? '발신기관'
                                    : listType === 'send'
                                        ? '수신기관'
                                        : ''}</th>
                                <th>날짜</th>
                                <th>첨부</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                (list?.length > 0)
                                    ? list.map((item, index) => (
                                        <tr key={item.key} style={{cursor: 'pointer'}}
                                            onClick={() => exeFunc(detailPopupRef, 'open', item)}>
                                            <td>{item.rvsRnum}</td>
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
                                            <td>{item['msgPtrnNm']}</td>
                                            <td>
                                                {
                                                    StringUtils.hasLength(item.rgsnUserNm)
                                                        ? String(item.rgsnUserNm).substring(0, 1) + '**'
                                                        : ''
                                                }
                                            </td>
                                            <td className="team">
                                                <p>{!StringUtils.hasLength(listType)
                                                    ? ''
                                                    : listType === 'receive'
                                                        ? item.trntBplcNm
                                                        : listType === 'send'
                                                            ? item.rcvrBplcNm
                                                            : ''}</p>
                                            </td>
                                            <td>{DateUtils.convertYyyyMmDdNormalDate(item.rgsnTs)}</td>
                                            <td className="attachment">
                                                {
                                                    item.fileYn === CheckYn.NO
                                                        ? <></>
                                                        : <div className="attachment_img">
                                                            <span className="hide">첨부파일</span>
                                                        </div>
                                                }
                                            </td>
                                        </tr>
                                    ))
                                    : <tr>
                                        <td colSpan={8}><NoResult msg={'등록된 메시지 정보가 없습니다.'} style={{marginTop: '40px', marginBottom: '40px'}}/></td>
                                    </tr>
                            }</tbody>
                        </table>
                    </div>
                    <Total01 data={getFunc(pagingRef, 'getPaging')?.total}/>
                    <div className="pagination_wrap">
                        <Paging ref={pagingRef}
                                onChangePage={onChangePage}
                                onPrev={onChangePage}
                                onNext={onChangePage}/>
                    </div>
                </CardLayout>
            </div>

            <DetailPopup ref={detailPopupRef}
                         loadApi={apiProps.detailApi}
                         closeRefreshList={msgId => {
                             const _list = deepCopyByRecursion(list);
                             const idx = _list?.findIndex(e => e.msgId === msgId);
                             if(idx > -1) _list[idx].cnfaYn = CheckYn.YES;
                             setList(_list);
                         }}
                         openReplyPopup={(parentId, parentTtl) => {
                             exeFunc(detailPopupRef, 'close');
                             exeFunc(replyFormPopupRef, 'open', parentId, parentTtl);
                         }} />
            <SendFormPopup ref={replyFormPopupRef}
                            title={'답장하기'}
                            sendApi={apiProps.replyApi}
                            refreshList={() => onChangePage(1)} />

            <AlertPopup ref={alertPopupRef} />
            <ConfirmPopup ref={readAllConfirmPopupRef}
                          onConfirm={() => commonContext.actions.callbackAfterSessionRefresh(saveReadAll, true, true)} />
            <CheckCloseCallBackAlertPopup ref={successAlertPopupRef}
                                          callBack={() => commonContext.actions.callbackAfterSessionRefresh(loadMessageList, true, true)} />
        </>
    )
});

export default MessageList;