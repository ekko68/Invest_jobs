/** @jsxImportSource @emotion/react */

import React, {useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import DateUtils from "modules/utils/DateUtils";
import {CommonContext} from "modules/contexts/common/CommomContext";

const MainCompanyCard = (props) => {
    const {data} = props
    const history = useHistory()
    const commonContext = useContext(CommonContext);

    return (
        <div className='corpitem'>
            <div className='inner' style={{cursor: 'pointer'}}
                 onClick={() => commonContext.actions.callbackAfterOnlyLoginCheck(() => history.push(ROUTER_NAMES.COMPANY_DETAIL + '?utlinsttId=' + data['utlinsttId']))}>
                <p className="title">{data?.bplcNm}</p>
                <div className="sub_content">
                    <div className="date">
                        설립일 : <span>{DateUtils.customDateFormat(data?.fondDe, 'yyyy년 MM월 dd일')}</span>
                    </div>
                    <div className="etc">
                        <p className="number">
                            직원수 : <span>{data?.empCnt}</span>명
                        </p>
                        <p className="views">
                            조회 : <span>{data?.crewRtrv}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainCompanyCard;
