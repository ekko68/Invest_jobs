import React, {forwardRef, useContext, useImperativeHandle, useRef, useState} from "react";
import {useHistory} from "react-router-dom";

import CardLayout from "components/common/card/CardLayout";
import Select from "components/atomic/Select";
import NoResult from "components/common/NoResult";
import Paging from "pageComponents/common/Paging";

import {ListType, NdaCodeLabels, NdaLabels} from "modules/consts/BizConst";
import ResponseUtils from "modules/utils/ResponseUtils";
import {setFunc} from "modules/utils/ReactUtils";
import DateUtils from "modules/utils/DateUtils";
import LabelUtils from "modules/utils/LabelUtils";
import {StringUtils} from "modules/utils/StringUtils";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey} from "modules/utils/CommonUtils";

const NdaList = forwardRef((props, ref) => {
    const {apiUrl, routerUrl, pageQueryRef, tabName, noResultMsg, setBadgeCnt} = props;

    const history = useHistory();
    const commonContext = useContext(CommonContext);

    const [list, setList] = useState([]);
    const [orderBySelect, setOrderBySelect] = useState({
        selected: '',
        selList: [
            {id: '', value: '전체'},
            {id: NdaCodeLabels.READY, value: NdaLabels.READY}, // 대기
            {id: NdaCodeLabels.APPROVAL, value: NdaLabels.APPROVAL}, // 체결
            {id: NdaCodeLabels.CANCEL, value: NdaLabels.CANCEL} // 미체결
        ]
    });

    const pagingRef = useRef();
    const pageRef = useRef(1);
    const totalPageRef = useRef(1);

    useImperativeHandle(ref, () => ({
        setData
    }));

    const setData = async () => {
        pageRef.current = StringUtils.hasLength(pageQueryRef?.current?.page) ? pageQueryRef?.current.page : 1;
        await loadNdaList(StringUtils.hasLength(pageQueryRef?.current?.pgrsSttsCd) ? pageQueryRef?.current.pgrsSttsCd : '');
        if (pageQueryRef?.current) pageQueryRef.current = {};
    }

    const loadNdaList = async (selectedStatus = orderBySelect.selected) => {
        const params = {
            page: pageRef.current,
            record: 5,
            pageSize: 5,
            pgrsSttsCd: selectedStatus
        }
        const pageRes = await ResponseUtils.getSimpleResponse(apiUrl, params, false);

        if (pageRes) {
            pageRef.current = pageRes['page'];
            totalPageRef.current = pageRes['totalPage'];
            setFunc(pagingRef, 'setPaging', pageRes);
            setList(pageRes['list']);

            if (setBadgeCnt) {
                setBadgeCnt(pageRes.badgeCntMap[ListType.RECEIVE], pageRes.badgeCntMap[ListType.SEND]);
            }
        }
    }

    const handleOrderSelect = async (e) => {
        setOrderBySelect({
            ...orderBySelect,
            selected: e.target.value
        });
        pageRef.current = 1;
        await commonContext.actions.callbackAfterSessionRefresh(async () => await loadNdaList(e.target.value), true, true);
    }

    const onChangePage = async (pageNumber) => {
        pageRef.current = pageNumber;
        await commonContext.actions.callbackAfterSessionRefresh(loadNdaList, true, true);
    }

    const onClickDetail = (item) => {
        console.log(history.location)
        // let url = routerUrl + (StringUtils.hasLength(history.location?.search) ? '?' : '&')
        //     + 'ndaCnttId=' + item['ndaCnttId'] + '&page=' + pageRef.current;
        let url = routerUrl + '&ndaCnttId=' + item['ndaCnttId'] + '&page=' + pageRef.current;
        if (StringUtils.hasLength(orderBySelect.selected)) url = url + '&pgrsSttsCd=' + orderBySelect.selected;

        history.push(url);
    }

    return (
        <div className="card_layout_wrap nda_req_list receive">
            <CardLayout>
                <div className="card_header">
                    <h3 className="ico_title">{tabName}</h3>
                    <div className="select_wrap">
                        <Select
                            className={'type02'}
                            optList={orderBySelect.selList}
                            selected={orderBySelect.selected}
                            onChange={handleOrderSelect}
                        />
                    </div>
                </div>
                <div className="table_wrap">
                    <table className="table type02">
                        <caption>NDA 받은 요청 테이블</caption>
                        <colgroup>
                            <col width={'6%'}/>
                            <col width={'17%'}/>
                            <col width={'17%'}/>
                            <col width={'33%'}/>
                            <col width={'15%'}/>
                            <col width={'12%'}/>
                        </colgroup>
                        <thead>
                        <tr>
                            <th>NO</th>
                            <th>보냄</th>
                            <th>받음</th>
                            <th>내용</th>
                            <th>작성날짜</th>
                            <th>상태</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            list?.length > 0
                                ? list.map((item, index) => (
                                    <tr key={createKey()} style={{cursor: 'pointer'}} onClick={() => onClickDetail(item)}>
                                        <td>{item.rvsRnum}</td>
                                        <td>
                                            <p className="send">{item.dsmsInttNm}</p>
                                        </td>
                                        <td>
                                            <p className="receive">{item.rcvInttNm}</p>
                                        </td>
                                        <td>
                                            <p className="content">{item.ndaRqstTtl}</p>
                                        </td>
                                        <td>
                                            <p className="date">{DateUtils.convertYyyyMmDdNormalDate(item.rgsnTs)}</p>
                                        </td>
                                        <td>
                                            <p className={LabelUtils.getNdaBadgeStyle(item.pgrsSttsCd)}>{item.pgrsSttsNm}</p>
                                        </td>
                                    </tr>
                                ))
                                : <tr><td colSpan={6}><NoResult msg={noResultMsg} style={{marginTop: '40px', marginBottom: '40px'}}/></td></tr>
                        }
                        </tbody>
                    </table>
                </div>
                <div className="pagination_wrap">
                    <Paging ref={pagingRef} onChangePage={onChangePage} onPrev={onChangePage} onNext={onChangePage}/>
                </div>
            </CardLayout>
        </div>
    )
});

export default NdaList;