/** @jsxImportSource @emotion/react */
import React, {useContext, useEffect, useState} from 'react'
import {cardItem06Style} from 'assets/style/ComponentStyle'

import ResponseUtils from 'modules/utils/ResponseUtils'
import VoUtils from "modules/utils/VoUtils";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey} from "modules/utils/CommonUtils";
import NoResult from "components/common/NoResult";

const WorkerPreview = (props) => {
    const {api} = props;
    const commonContext = useContext(CommonContext);
    const [list, setList] = useState([])

    useEffect(() => {
        if (api !== '') {
            commonContext.actions.callbackAfterSessionRefresh(async () => {
                const resWorkerList = await loadWorkerList();
                if (resWorkerList) {
                    VoUtils.setListVoNullToEmpty(resWorkerList, [], ['utlinsttId', 'tmmbSqn', 'fileId', 'imgUrl']);
                    setList(resWorkerList);
                }
            }, true, true);
        }
    }, [api])

    const loadWorkerList = async () => {
        const resWorkerObject = await ResponseUtils.getIrSimpleResponse(api, null, false)
        return resWorkerObject['irMemberTab']
    }
    return (
        <div className="ir_section_wrap ">
            <div className="ir_worker">
                <div className="section section01">
                    {
                        (list?.length > 0)
                            ?   <ul className="worker_list">{list?.map((item, index) => (
                                <li className="worker_item" key={createKey()}>
                                    <div className={'carditem06'} css={cardItem06Style}>
                                        {/*<div className="img_wrap img_cover">*/}
                                        <div className="img_cover" style={{minHeight: '199px', maxHeight: '199px', width: '199px', height: '100%'}}>
                                            {item.imgUrl ? <img src={item.imgUrl} alt=""/> : <img src={'/images/img_person.png'} alt=""/>}
                                        </div>
                                        <div className="content">
                                            <div className="content_inner scroll_lightgrey">
                                                <p className="position">{item.tmmbJbcl}</p>
                                                <p className="name">{item.tmmbNm}</p>
                                                <p className="info">{item.crrCon}</p>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}</ul>

                            :   <NoResult isIrView={true}
                                          msg={'등록된 IR 인력 정보가 없습니다.'}/>
                    }
                </div>
            </div>
        </div>
    )
}
export default WorkerPreview
