import React, {forwardRef, useContext, useImperativeHandle, useState} from 'react';
import Badge from "components/atomic/Badge";

import {ListType} from "modules/consts/BizConst";
import {StringUtils} from "modules/utils/StringUtils";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey, deepCopyByRecursion} from "modules/utils/CommonUtils";

const NdaListTab = forwardRef((props, ref) => {

    const { tabType='', history=null, receiveRouter='', sendRouter='' } = props;
    const commonContext = useContext(CommonContext);

    const [tabData, setTabData] = useState({
        active: tabType,
        list: [
            {id: ListType.RECEIVE, label: '받은 요청', count: '0', router: receiveRouter},
            {id: ListType.SEND, label: '보낸 요청', count: '0', router: sendRouter}
        ]
    });

    useImperativeHandle(ref, () => ({
        setBadgeCnt
    }));

    const setBadgeCnt = (receiveCnt = 0, sendCnt = 0) => {
        const _tabData = deepCopyByRecursion(tabData);
        for(let tab of _tabData.list) {
            if(tab.id === ListType.RECEIVE) tab.count = String(receiveCnt);
            else if(tab.id === ListType.SEND) tab.count = String(sendCnt);
        }

        setTabData(_tabData);
    }

    return (
        <div className="tab_wrap">
            {
                tabData &&
                tabData.list?.map((d, idx) => (
                    <button
                        className={`btn_tab ${tabData.active === d.id ? 'active' : ''}`}
                        key={createKey()}
                        onClick={() => {if(StringUtils.hasLength(d.router) && history !== null) history.push(d.router)}}
                    >
                        <span className="text">{d.label}</span>
                        <Badge className={`rounded ${tabData.active === d.id ? 'blue' : ''}`}>{d.count}</Badge>
                    </button>
                ))
            }
        </div>
    )
});

export default NdaListTab;