import React, {forwardRef, useImperativeHandle, useState} from 'react';
import Badge from "components/atomic/Badge";
import {createKey} from "modules/utils/CommonUtils";

const RequestTab = forwardRef((props, ref) => {

    const { tabType, history, receiveRouter, sendRouter } = props

    useImperativeHandle(ref, () => ({
        setData
    }));

    const [tabList, setTabList] = useState({
        active: tabType,
        list: [
            { id: 'receive', label: '받은 요청', count: '0' },
            { id: 'send', label: '보낸 요청', count: '0' }
        ]
    });

    const handleTabList = (id) => {
        if (id === tabType) return
        if (id === 'receive') {
            history.push(receiveRouter)
        } else {
            history.push(sendRouter)
        }
    }

    const setData = (receiveCnt = 0, sendCnt = 0) => {
        setTabList({
            ...tabList,
            list: [
                { id: 'receive', label: '받은 요청', count: String(receiveCnt) },
                { id: 'send', label: '보낸 요청', count: String(sendCnt) }
            ]
        });
    }

    return (
        <div className="tab_wrap">
            {tabList &&
            tabList.list?.map((d, idx) => (
                <button
                    className={`btn_tab ${tabList.active === d.id ? 'active' : ''}`}
                    key={createKey()}
                    onClick={() => handleTabList(d.id)}
                >
                    <span className="text">{d.label}</span>
                    <Badge className={`rounded ${tabList.active === d.id ? 'blue' : ''}`}>{d.count}</Badge>
                </button>
            ))}
        </div>
    )
});

export default RequestTab;