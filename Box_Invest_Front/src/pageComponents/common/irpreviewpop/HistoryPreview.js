/** @jsxImportSource @emotion/react */
import React, {useContext, useEffect, useState} from 'react'
import CardLayout from 'components/common/card/CardLayout'
import DateUtils from 'modules/utils/DateUtils'
import ResponseUtils from 'modules/utils/ResponseUtils'
import VoUtils from "modules/utils/VoUtils";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey} from "modules/utils/CommonUtils";
import NoResult from "components/common/NoResult";

const HistoryPreview = (props) => {
    const {api} = props;
    const commonContext = useContext(CommonContext);

    const [list, setList] = useState([])

    useEffect(() => {
        if (api !== '') {
            commonContext.actions.callbackAfterSessionRefresh(async () => {
                const resHistoryList = await loadHistoryList()
                if (resHistoryList) {
                    VoUtils.setListVoNullToEmpty(resHistoryList, [], ['utlinsttId', 'ordvSqn']);
                    setList(resHistoryList)
                }
            }, true, true);
        }
    }, [api])

    const loadHistoryList = async () => {
        const resHistoryObject = await ResponseUtils.getIrSimpleResponse(api, null, false);
        return resHistoryObject['irHistoryTab']
    }

    return (
        <div className="ir_section_wrap ">
            <div className="ir_history">
                <CardLayout>
                    <div className="section section01">
                        <h3 className="ico_title">연혁</h3>
                        {
                            (list?.length > 0)
                                ?   <div className="history_wrap">{
                                    list.map((item, index) => (
                                        <div className="history_section" key={createKey()}>
                                            <p className="year">{item.year}</p>
                                            <ul className="history_list">
                                                {
                                                    item.hasOwnProperty('historyList') && item.historyList?.map((_item, _index) => (
                                                        <li className="history_item" key={createKey()}>
                                                            <p className="date">{DateUtils.customDateFormat(_item.ordvYm, 'yyyy-MM')}</p>
                                                            <p className="content">{_item.ordvCon}</p>
                                                        </li>
                                                    ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>

                                : <NoResult isIrView={true}
                                            msg={'등록된 IR 연혁 정보가 없습니다.'}/>
                        }
                    </div>
                </CardLayout>
            </div>
        </div>
    )
}
export default HistoryPreview
