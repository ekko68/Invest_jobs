/** @jsxImportSource @emotion/react */
import React from 'react';
import { useHistory } from 'react-router-dom';

import {colors} from "assets/style/style.config";
import CardLayout from "components/common/card/CardLayout";
import Badge from "components/atomic/Badge";
import NoResult from "components/common/NoResult";

import {createKey} from "modules/utils/CommonUtils";
import DateUtils from "modules/utils/DateUtils";
import LabelUtils from "modules/utils/LabelUtils";
import {ListType, UsisType} from "modules/consts/BizConst";
import {isNumber} from "modules/utils/NumberUtils";

const RecentAuditList = (props) => {

    const {
        title = '',
        noResultMsg = '',

        badgeCnt = 0,
        auditList = [],

        listType = '',
        usisType = '',

        router = {
            detailRouter: '',
            listRouter: ''
        }

    } = props;

    const history = useHistory();

    return (
        <div className={`screening_section ${listType === ListType.RECEIVE ? 'receive' : 'send'}`}>
            <CardLayout type={'default'}>
                <div className="invest_board_wrap">
                    <div className="card_header">
                        <h3 className="title">
                            {title}
                            <Badge theme={colors.blue} type={'rounded'}>
                                {isNumber(badgeCnt) ? badgeCnt : 0}
                            </Badge>
                        </h3>
                        <div className="btn_more" style={{ cursor: 'pointer' }}
                             onClick={() => history.push(router.listRouter)}>
                            <span className="hide">더보기</span>
                        </div>
                    </div>
                    <ul className="invest_board_list">{
                        (auditList?.length > 0)
                            ? auditList.map((item, index) => (
                                <li
                                    className="invest_board_item"
                                    key={createKey()}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        let url = router.detailRouter + '?invmExntRqstId=' + item.invmExntRqstId;
                                        url += (listType === ListType.RECEIVE ? '&type=receive' : '&type=send');
                                        history.push(url);
                                    }}>
                                    <span className="date">{DateUtils.insertYyyyMmDdDash(item.invmSttgDt)}</span>
                                    <div className="name_wrap">
                                        <p className="name">{
                                            usisType === UsisType.COMPANY
                                                ? item.invmCmpBplcNm
                                                : usisType === UsisType.INVESTOR
                                                    ? item.rqstBplcNm
                                                    : ''
                                        }</p>
                                    </div>
                                    <p className="info">{
                                        usisType === UsisType.COMPANY
                                            ? item.invmCmpPtrnNm
                                            : usisType === UsisType.INVESTOR
                                                ? item.enprDsncClsfNm
                                                : ''
                                    }</p>
                                    <Badge className={LabelUtils.getBadgeStyle(String(item.invmExntPgsgNm))}>
                                        {String(item.invmExntPgsgNm)}
                                    </Badge>
                                </li>
                            ))
                            : <li><NoResult msg={noResultMsg} style={{marginTop: '20px'}}/></li>
                    }</ul>
                </div>
            </CardLayout>
        </div>
    )
}

export default RecentAuditList;