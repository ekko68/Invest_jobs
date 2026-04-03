import React from 'react';

import DateUtils from "modules/utils/DateUtils";
import {RequestStatusLabels, RequestStatusCodeLabels} from "modules/consts/BizConst";
import {createKey} from "modules/utils/CommonUtils";

const RequestDetailProgress = (props) => {

    const { progressList = [], statusCode = '' } = props;

    const activeList = {
        EXN00000: [RequestStatusCodeLabels.SUGGEST],
        EXN00001: [RequestStatusCodeLabels.SUGGEST, RequestStatusCodeLabels.REQUEST],
        EXN00002: [RequestStatusCodeLabels.SUGGEST, RequestStatusCodeLabels.REQUEST, RequestStatusCodeLabels.EVALUATE],
        EXN00003: [RequestStatusCodeLabels.SUGGEST, RequestStatusCodeLabels.REQUEST, RequestStatusCodeLabels.EVALUATE, RequestStatusCodeLabels.COMPLETE],
        EXN00004: [RequestStatusCodeLabels.SUGGEST, RequestStatusCodeLabels.REQUEST, RequestStatusCodeLabels.EXPIRED, RequestStatusCodeLabels.CANCEL],
        EXN00005: [RequestStatusCodeLabels.SUGGEST, RequestStatusCodeLabels.REQUEST, RequestStatusCodeLabels.EXPIRED, RequestStatusCodeLabels.CANCEL]
    }

    const nonActiveList = {
        EXN00000: [RequestStatusCodeLabels.REQUEST, RequestStatusCodeLabels.EVALUATE, RequestStatusCodeLabels.COMPLETE],
        EXN00001: [RequestStatusCodeLabels.EVALUATE, RequestStatusCodeLabels.COMPLETE],
        EXN00002: [RequestStatusCodeLabels.COMPLETE],
        EXN00003: [],
        EXN00004: [RequestStatusCodeLabels.COMPLETE],
        EXN00005: [RequestStatusCodeLabels.COMPLETE]
    }

    return (
        <>
            {
                progressList.length > 0 &&
                activeList[String(statusCode)]?.map(status => {
                    const item = progressList.find(e => e['invmExntPgsgCd'] === status);
                    if(item) {
                        return (
                            <li className="progress_item active" key={createKey()}>
                                <div className="progress_item_inner">
                                    <p className="text">{item['invmExntPgsgNm']}</p>
                                    <p className="text second">({DateUtils.customDateFormat(item['rgsnTs'], 'yyyy년 MM월 dd일')})</p>
                                </div>
                            </li>
                        )
                    }
                    else if(status === RequestStatusCodeLabels.EVALUATE) {
                        return (
                            <li className="progress_item" key={createKey()}>
                                <div className="progress_item_inner">
                                    <p className="text">{RequestStatusLabels[status]}</p>
                                </div>
                            </li>
                        )
                    }
                })
            }
            {
                progressList.length > 0 &&
                nonActiveList[String(statusCode)]?.map(status => (
                    <li className="progress_item" key={createKey()}>
                        <div className="progress_item_inner">
                            <p className="text">{RequestStatusLabels[status]}</p>
                        </div>
                    </li>
                ))
            }
        </>
    )
}

export default RequestDetailProgress;