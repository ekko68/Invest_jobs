/** @jsxImportSource @emotion/react */
import React, {useContext, useEffect, useState} from 'react'
import CardLayout from 'components/common/card/CardLayout'
import NoResult from "components/common/NoResult";

import DateUtils from 'modules/utils/DateUtils'
import ResponseUtils from 'modules/utils/ResponseUtils'
import {StringUtils} from 'modules/utils/StringUtils'
import VoUtils from "modules/utils/VoUtils";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey} from "modules/utils/CommonUtils";

const ResultPlansPreview = (props) => {
    const {api} = props;
    const commonContext = useContext(CommonContext);

    const [vo, setVo] = useState({
        awardList: [],
        exportList: [],
        investList: [],
        planList: [],
        policyFundList: []
    })

    useEffect(() => {
        if (api !== '') {
            commonContext.actions.callbackAfterSessionRefresh(async () => {
                const resResultPlan = await loadResultPlan()
                if (resResultPlan) {
                    if (resResultPlan.awardList) {
                        VoUtils.setListVoNullToEmpty(resResultPlan.awardList, [], ['utlinsttId', 'beawAcrsSqn']);
                    }
                    if (resResultPlan.exportList) {
                        VoUtils.setListVoNullToEmpty(resResultPlan.exportList, ['eprtAmt'], ['utlinsttId', 'eprtHstSqn']);
                    }
                    if (resResultPlan.investList) {
                        VoUtils.setListVoNullToEmpty(resResultPlan.investList, ['invmAmt'], ['utlinsttId', 'invmOtcmSqn']);
                    }
                    if (resResultPlan.planList) {
                        VoUtils.setListVoNullToEmpty(resResultPlan.planList, [], ['utlinsttId', 'prmrPlanSqn']);
                    }
                    if (resResultPlan.policyFundList) {
                        VoUtils.setListVoNullToEmpty(resResultPlan.policyFundList, ['plfnAmt'], ['utlinsttId', 'plfnSqn']);
                    }

                    setVo(resResultPlan)
                }
            }, true, true);
        }
    }, [api])

    const loadResultPlan = async () => {
        const prodTechMarketRes = await ResponseUtils.getIrSimpleResponse(api, null, false);
        return prodTechMarketRes['irPlanAndResultTab']
    }
    const getUnit = (item) => {
        let r = ''
        if (item['prmrIndeNm'] === '매출') {
            r = '원'
        } else if (item['prmrIndeNm'] === '채용') {
            r = '명'
        }
        return r
    }
    return (
        <div className="ir_section_wrap ">
            <div className="ir_result_plans">
                <CardLayout>
                    <div className="section section01">
                        <h3 className="ico_title">주요성과</h3>
                        <div className="table_box">
                            <div className="table_section">
                                <div className="section_header">
                                    <p className="section_title">투자</p>
                                    <span className="info">&#40;단위:원&#41;</span>
                                </div>
                                <table className="table type03">
                                    <caption>투자 테이블</caption>
                                    <colgroup>
                                        <col width={'33%'}/>
                                        <col width={'30%'}/>
                                        <col width={'37%'}/>
                                    </colgroup>
                                    <thead>
                                    <tr>
                                        <th>구분</th>
                                        <th>금액</th>
                                        <th>날짜</th>
                                    </tr>
                                    </thead>
                                    <tbody>{
                                        (vo?.investList?.length > 0)
                                            ? vo.investList.map((item, i) => (
                                                <tr key={createKey()}>
                                                    <td>{item['indiCon']}</td>
                                                    <td className="text_right">{StringUtils.comma(item['invmAmt'])}</td>
                                                    <td>{DateUtils.insertYyyyMmDdDash(item['invmDt'])}</td>
                                                </tr>
                                            ))
                                            : <tr>
                                                <td colSpan={3}>
                                                    <NoResult msg={'입력된 정보가 없습니다.'} style={{marginTop: '40px', marginBottom: '40px'}}/>
                                                </td>
                                            </tr>
                                    }</tbody>
                                </table>
                            </div>
                            <div className="table_section">
                                <div className="section_header">
                                    <p className="section_title">수상실적</p>
                                </div>
                                <table className="table type03">
                                    <caption>수상실적 테이블</caption>
                                    <colgroup>
                                        <col width={'33%'}/>
                                        <col width={'30%'}/>
                                        <col width={'37%'}/>
                                    </colgroup>
                                    <thead>
                                    <tr>
                                        <th>주최</th>
                                        <th>수상내역</th>
                                        <th>날짜</th>
                                    </tr>
                                    </thead>
                                    <tbody>{
                                        (vo?.awardList?.length > 0)
                                            ? vo.awardList.map((item, i) => (
                                                <tr key={createKey()}>
                                                    <td>{item['hldPlac']}</td>
                                                    <td>{item['beawHst']}</td>
                                                    <td>{DateUtils.insertYyyyMmDdDash(item['beawDt'])}</td>
                                                </tr>
                                            ))
                                            : <tr>
                                                <td colSpan={3}>
                                                    <NoResult msg={'입력된 정보가 없습니다.'} style={{marginTop: '40px', marginBottom: '40px'}}/>
                                                </td>
                                            </tr>
                                    }</tbody>
                                </table>
                            </div>
                        </div>
                        <div className="table_box">
                            <div className="table_section">
                                <div className="section_header">
                                    <p className="section_title">수출</p>
                                    <span className="info">&#40;단위:원&#41;</span>
                                </div>
                                <table className="table type03">
                                    <caption>수출 테이블</caption>
                                    <colgroup>
                                        <col width={'33%'}/>
                                        <col width={'30%'}/>
                                        <col width={'37%'}/>
                                    </colgroup>
                                    <thead>
                                    <tr>
                                        <th>장소</th>
                                        <th>금액</th>
                                        <th>날짜</th>
                                    </tr>
                                    </thead>
                                    <tbody>{
                                        (vo?.exportList?.length > 0)
                                            ? vo.exportList.map((item, i) => (
                                                <tr key={createKey()}>
                                                    <td>{item['eprtTgt']}</td>
                                                    <td className="text_right">{StringUtils.comma(item['eprtAmt'])}</td>
                                                    <td>{DateUtils.insertYyyyMmDdDash(item['eprtDt'])}</td>
                                                </tr>
                                            ))
                                            : <tr>
                                                <td colSpan={3}>
                                                    <NoResult msg={'입력된 정보가 없습니다.'} style={{marginTop: '40px', marginBottom: '40px'}}/>
                                                </td>
                                            </tr>
                                    }</tbody>
                                </table>
                            </div>
                            <div className="table_section">
                                <div className="section_header">
                                    <p className="section_title">정책자금</p>
                                    <span className="info">&#40;단위:원&#41;</span>
                                </div>
                                <table className="table type03">
                                    <caption>정책자금 테이블</caption>
                                    <colgroup>
                                        <col width={'33%'}/>
                                        <col width={'30%'}/>
                                        <col width={'37%'}/>
                                    </colgroup>
                                    <thead>
                                    <tr>
                                        <th>내용</th>
                                        <th>금액</th>
                                        <th>날짜</th>
                                    </tr>
                                    </thead>
                                    <tbody>{
                                        (vo?.policyFundList?.length > 0)
                                            ? vo.policyFundList.map((item, i) => (
                                                <tr key={createKey()}>
                                                    <td>{item['plfnCon']}</td>
                                                    <td className="text_right">{StringUtils.comma(item['plfnAmt'])}</td>
                                                    <td>{DateUtils.insertYyyyMmDdDash(item['plfnPrfrDd'])}</td>
                                                </tr>
                                            ))
                                            : <tr>
                                                <td colSpan={3}>
                                                    <NoResult msg={'입력된 정보가 없습니다.'} style={{marginTop: '40px', marginBottom: '40px'}}/>
                                                </td>
                                            </tr>
                                    }</tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div className="section section02">
                        <h3 className="ico_title">주요계획</h3>
                        <div className="table_box">
                            <div className="table_section">
                                <table className="table type03">
                                    <caption>정책자금 테이블</caption>
                                    <colgroup>
                                        <col width={'20%'}/>
                                        <col width={'20%'}/>
                                        <col width={'20%'}/>
                                        <col width={'20%'}/>
                                        <col width={'20%'}/>
                                    </colgroup>
                                    <thead>
                                    <tr>
                                        <th>주요지표</th>
                                        <th>현재</th>
                                        <th>&#43;3M</th>
                                        <th>&#43;6M</th>
                                        <th>&#43;9M</th>
                                    </tr>
                                    </thead>
                                    <tbody>{
                                        (vo?.planList?.length > 0)
                                            ? vo.planList.map((item, i) => (
                                                <tr key={createKey()}>
                                                    <td>{item['prmrIndeNm']}</td>
                                                    <td className="text_right">
                                                        {StringUtils.comma(item['psntIndeCon'])}
                                                        {getUnit(item)}
                                                    </td>
                                                    <td className="text_right">
                                                        {StringUtils.comma(item['mn3IndeCon'])}
                                                        {getUnit(item)}
                                                    </td>
                                                    <td className="text_right">
                                                        {StringUtils.comma(item['mn6IndeCon'])}
                                                        {getUnit(item)}
                                                    </td>
                                                    <td className="text_right">
                                                        {StringUtils.comma(item['mn9IndeCon'])}
                                                        {getUnit(item)}
                                                    </td>
                                                </tr>
                                            ))
                                            : <tr>
                                                <td colSpan={5}>
                                                    <NoResult msg={'입력된 정보가 없습니다.'} style={{marginTop: '40px', marginBottom: '40px'}}/>
                                                </td>
                                            </tr>
                                    }</tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </CardLayout>
                {/*{props.PrevNextBtns}*/}
            </div>
        </div>
    )
}
export default ResultPlansPreview
