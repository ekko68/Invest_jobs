/** @jsxImportSource @emotion/react */
import React, {useContext, useEffect, useState} from 'react'
import CardLayout from 'components/common/card/CardLayout'
import NoResult from "components/common/NoResult";

import ResponseUtils from 'modules/utils/ResponseUtils'
import {StringUtils} from 'modules/utils/StringUtils'
import DateUtils from 'modules/utils/DateUtils'
import VoUtils from "modules/utils/VoUtils";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey} from "modules/utils/CommonUtils";

const ProdTechMarketPreview = (props) => {
    const {api} = props;
    const commonContext = useContext(CommonContext);

    const [vo, setVo] = useState({
        ipList: [],
        market: {mrktChrc: '', mrktInvgDesc: '', utlinsttId: ''},
        marketPlayerList: [],
        marketTargetList: [],
        product: {prdtChrc: '', prdtDesc: '', utlinsttId: ''},
        saleList: [],
        tech: {holdTchnChrc: '', holdTchnDesc: '', utlinsttId: ''}
    });

    useEffect(() => {
        if (api !== '') {
            commonContext.actions.callbackAfterSessionRefresh(async () => {
                const prodTechMarketRes = await loadProdTechMarket()
                if (prodTechMarketRes) {
                    if (prodTechMarketRes.market) {
                        VoUtils.setVoNullToEmpty(prodTechMarketRes.market, [], ['utlinsttId']);
                    }
                    if (prodTechMarketRes.product) {
                        VoUtils.setVoNullToEmpty(prodTechMarketRes.product, [], ['utlinsttId']);
                    }
                    if (prodTechMarketRes.tech) {
                        VoUtils.setVoNullToEmpty(prodTechMarketRes.tech, [], ['utlinsttId']);
                    }

                    if (prodTechMarketRes.ipList) {
                        VoUtils.setListVoNullToEmpty(prodTechMarketRes.ipList, [], ['utlinsttId', 'holdTchnSqn']);
                    }
                    if (prodTechMarketRes.marketPlayerList) {
                        VoUtils.setListVoNullToEmpty(prodTechMarketRes.marketPlayerList, ['amslAmt'], ['utlinsttId', 'mrktPtcnSqn']);
                    }
                    if (prodTechMarketRes.marketTargetList) {
                        VoUtils.setListVoNullToEmpty(prodTechMarketRes.marketTargetList, ['prmrGoalAmt'], ['utlinsttId', 'prmrGoalSqn']);
                    }
                    if (prodTechMarketRes.saleList) {
                        VoUtils.setListVoNullToEmpty(prodTechMarketRes.saleList, ['amslAmt', 'amslRlim'], ['utlinsttId', 'amplSqn']);
                    }

                    setVo(prodTechMarketRes)
                }
            }, true, true);
        }
    }, [api])

    const loadProdTechMarket = async () => {
        const prodTechMarketRes = await ResponseUtils.getIrSimpleResponse(api, null, false);
        return prodTechMarketRes['irExtraTab']
    }

    return (
        <div className="ir_section_wrap ">
            <div className="ir_prod_tech_market">
                <CardLayout>
                    <div className="section section01">
                        <h3 className="ico_title">제품</h3>
                        <div className="text_box_wrap flex_btw">
                            <div className="text_box_section">
                                <div className="section_header">
                                    <p className="section_title">설명</p>
                                </div>
                                <div className="text_box">
                                    <div
                                        className="text_box_inner scroll_lightgrey"
                                        dangerouslySetInnerHTML={{__html: StringUtils.toBr(vo.product.prdtDesc)}}
                                    />
                                </div>
                            </div>
                            <div className="text_box_section">
                                <div className="section_header">
                                    <p className="section_title">특징 및 차별성</p>
                                </div>
                                <div className="text_box">
                                    <div
                                        className="text_box_inner scroll_lightgrey"
                                        dangerouslySetInnerHTML={{__html: StringUtils.toBr(vo.product.prdtChrc)}}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="table_section">
                            <div className="section_header">
                                <p className="section_title">주요 매출처</p>
                                <span className="info">&#40;단위:원&#41;</span>
                            </div>
                            <table className="table type03">
                                <caption>주요 매출처 테이블</caption>
                                <colgroup>
                                    <col width={'10%'}/>
                                    <col width={'30%'}/>
                                    <col width={'15%'}/>
                                    <col width={'10%'}/>
                                </colgroup>
                                <thead>
                                <tr>
                                    <th>지역</th>
                                    <th>내용</th>
                                    <th>금액</th>
                                    <th>비중</th>
                                </tr>
                                </thead>
                                <tbody>{
                                    (vo?.saleList?.length > 0)
                                        ? vo.saleList.map((item, i) => (
                                            <tr key={createKey()}>
                                                <td>{item['areaDsncNm']}</td>
                                                <td>{item['amslCon']}</td>
                                                <td>{StringUtils.comma(item['amslAmt'])}</td>
                                                <td className={'text_right'}>{item['amslRlim']}%</td>
                                            </tr>
                                        ))
                                        : <tr>
                                            <td colSpan={4}>
                                                <NoResult msg={'입력된 정보가 없습니다.'} style={{marginTop: '40px', marginBottom: '40px'}}/>
                                            </td>
                                        </tr>
                                }</tbody>
                            </table>
                        </div>
                    </div>
                    <div className="section section02">
                        <h3 className="ico_title">기술</h3>
                        <div className="text_box_wrap flex_btw">
                            <div className="text_box_section">
                                <div className="section_header">
                                    <p className="section_title">주요보유기술</p>
                                </div>
                                <div className="text_box">
                                    <div
                                        className="text_box_inner scroll_lightgrey"
                                        dangerouslySetInnerHTML={{__html: StringUtils.toBr(vo.tech.holdTchnDesc)}}
                                    />
                                </div>
                            </div>
                            <div className="text_box_section">
                                <div className="section_header">
                                    <p className="section_title">장점&#47;특징&#47;차별성</p>
                                </div>
                                <div className="text_box">
                                    <div
                                        className="text_box_inner scroll_lightgrey"
                                        dangerouslySetInnerHTML={{__html: StringUtils.toBr(vo.tech.holdTchnChrc)}}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="table_section">
                            <div className="section_header">
                                <p className="section_title">지적재산권 현황</p>
                            </div>
                            <table className="table type03">
                                <caption>지적재산권 현황 테이블</caption>
                                <colgroup>
                                    <col width={'15%'}/>
                                    <col width={'45%'}/>
                                    <col width={'20%'}/>
                                    <col width={'20%'}/>
                                </colgroup>
                                <thead>
                                <tr>
                                    <th>상태</th>
                                    <th>내용</th>
                                    <th>출원번호</th>
                                    <th>날짜</th>
                                </tr>
                                </thead>
                                <tbody>{
                                    (vo?.ipList?.length > 0)
                                        ? vo.ipList.map((item, i) => (
                                            <tr key={createKey()}>
                                                <td>{item['sttsNm']}</td>
                                                <td>{item['pnotPrrgCon']}</td>
                                                <td>{item['alfrNo']}</td>
                                                <td>{DateUtils.insertYyyyMmDdDash(item['pnotPrrgRgda'])}</td>
                                            </tr>
                                        ))
                                        : <tr>
                                            <td colSpan={4}>
                                                <NoResult msg={'입력된 정보가 없습니다.'} style={{marginTop: '40px', marginBottom: '40px'}}/>
                                            </td>
                                        </tr>
                                }</tbody>
                            </table>
                        </div>
                    </div>
                    <div className="section section03">
                        <h3 className="ico_title">시장</h3>
                        <div className="text_box_wrap flex_btw">
                            <div className="text_box_section">
                                <div className="section_header">
                                    <p className="section_title">시장리서치</p>
                                </div>
                                <div className="text_box">
                                    <div
                                        className="text_box_inner scroll_lightgrey"
                                        dangerouslySetInnerHTML={{__html: StringUtils.toBr(vo.market.mrktInvgDesc)}}
                                    />
                                </div>
                            </div>
                            <div className="text_box_section">
                                <div className="section_header">
                                    <p className="section_title">장점&#47;특징&#47;차별성</p>
                                </div>
                                <div className="text_box">
                                    <div
                                        className="text_box_inner scroll_lightgrey"
                                        dangerouslySetInnerHTML={{__html: StringUtils.toBr(vo.market.mrktChrc)}}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="table_section">
                            <div className="section_header">
                                <p className="section_title">주요 목표 시장 및 규모</p>
                                <span className="info">&#40;단위:원&#41;</span>
                            </div>
                            <table className="table type03">
                                <caption>주요 목표 시장 테이블</caption>
                                <colgroup>
                                    <col width={'20%'}/>
                                    <col width={'60%'}/>
                                    <col width={'20%'}/>
                                </colgroup>
                                <thead>
                                <tr>
                                    <th>지역</th>
                                    <th>내용</th>
                                    <th>금액</th>
                                </tr>
                                </thead>
                                <tbody>{
                                    (vo?.marketTargetList?.length > 0)
                                        ? vo?.marketTargetList?.map((item, i) => (
                                            <tr key={createKey()}>
                                                <td>{item['areaDsncNm']}</td>
                                                <td className={'text_left'}>{item['prmrGoalCon']}</td>
                                                <td>{StringUtils.comma(item['prmrGoalAmt'])}</td>
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
                                <p className="section_title">시장 플레이어</p>
                                <span className="info">&#40;단위:원&#41;</span>
                            </div>
                            <table className="table type03">
                                <caption>시장 플레이어 테이블</caption>
                                <colgroup>
                                    <col width={'15%'}/>
                                    <col width={'20%'}/>
                                    <col width={'45%'}/>
                                    <col width={'20%'}/>
                                </colgroup>
                                <thead>
                                <tr>
                                    <th>지역</th>
                                    <th>플레이어</th>
                                    <th>내용</th>
                                    <th>매출</th>
                                </tr>
                                </thead>
                                <tbody>{
                                    (vo?.marketPlayerList?.length > 0)
                                        ? vo.marketPlayerList.map((item, i) => (
                                            <tr key={createKey()}>
                                                <td>{item['areaDsncNm']}</td>
                                                <td>{item['mrktPtcnNm']}</td>
                                                <td className={'text_left'}>{item['mrktPtcnCon']}</td>
                                                <td>{StringUtils.comma(item['amslAmt'])}</td>
                                            </tr>
                                        ))
                                        : <tr>
                                            <td colSpan={4}>
                                                <NoResult msg={'입력된 정보가 없습니다.'} style={{marginTop: '40px', marginBottom: '40px'}}/>
                                            </td>
                                        </tr>
                                }</tbody>
                            </table>
                        </div>
                    </div>
                </CardLayout>
            </div>
        </div>
    )
}
export default ProdTechMarketPreview
