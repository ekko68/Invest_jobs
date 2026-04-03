/** @jsxImportSource @emotion/react */
import React, {useContext, useEffect, useState} from 'react'

import CardLayout from 'components/common/card/CardLayout'
import NoResult from 'components/common/NoResult'

import DateUtils from 'modules/utils/DateUtils'
import ResponseUtils from 'modules/utils/ResponseUtils'
import {StringUtils} from 'modules/utils/StringUtils'
import VoUtils from "modules/utils/VoUtils";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey} from "modules/utils/CommonUtils";

const BasicInfoPreview = (props) => {
    const {api} = props;
    const commonContext = useContext(CommonContext);

    const [vo, setVo] = useState({
        utlinsttId: '',
        enprIrrsInfoId: '',
        bnnm: '',
        enprDsncCd: '',
        bzn: '',
        col: '',
        rprnm: '',
        empCnt: 0,
        btnm: '',
        cgn: '',
        cnpl: '',
        hmpgUrlAdr: '',
        adr: '',
        cpfnAmt: 0,
        pvprAmt: 0,
        ttisStcnt: 0,
        acpr: '',
        etvlAmt: 0,
        invmMnyUsus: '',
        invmRtrvPlanCon: '',
        investList: [],
        supportList: []
    })
    const enprDsncCdList = [
        {enprDsncCd: '0000', label: ''},
        {enprDsncCd: '0001', label: '예비 창업'},
        {enprDsncCd: '0002', label: '법인 사업자'},
        {enprDsncCd: '0003', label: '개인 사업자'}
    ]

    useEffect(() => {
        if (api !== '') {
            commonContext.actions.callbackAfterSessionRefresh(async () => {
                const resBasicInfo = await loadBasicInfo()
                if (resBasicInfo) {
                    VoUtils.setVoNullToEmpty(resBasicInfo, ['empCnt', 'cpfnAmt', 'pvprAmt', 'ttisStcnt', 'etvlAmt'], ['utlinsttId', 'investList', 'supportList']);
                    if (resBasicInfo.investList) {
                        VoUtils.setListVoNullToEmpty(resBasicInfo.investList, ['invmEnmtAmt'], ['utlinsttId', 'invmEnmtSqn']);
                    }
                    if (resBasicInfo.supportList) {
                        VoUtils.setListVoNullToEmpty(resBasicInfo.supportList, ['sprnAmt'], ['utlinsttId', 'sprnMnySqn']);
                    }
                    setVo(resBasicInfo)
                }
            }, true, true);
        }
    }, [api])

    const loadBasicInfo = async () => {
        if (api !== '') {
            const resBasicInfo = await ResponseUtils.getIrSimpleResponse(api, null, false)
            return resBasicInfo['irBasicTab']
        } else {
            return null
        }
    }

    return (
        <div className="ir_section_wrap ">
            <div className="ir_basic">
                <CardLayout>
                    {/*<h3 className="page_title">*/}
                    {/*    <strong>{vo.bnnm + " IR 자료"}</strong>*/}
                    {/*</h3>*/}
                    <div className="section section01">
                        <h3 className="ico_title">기본정보</h3>
                        <table className="table">
                            <caption>기본정보 테이블</caption>
                            <colgroup>
                                <col width="12%"/>
                                <col width="38%"/>
                                <col width="12%"/>
                                <col width="38%"/>
                            </colgroup>
                            <tbody>
                            <tr>
                                <th>기업명</th>
                                <td>{vo.bnnm}</td>
                                <th>기업구분</th>
                                <td>{enprDsncCdList?.find(e => e.enprDsncCd === vo.enprDsncCd)?.label}</td>
                            </tr>
                            <tr>
                                <th>사업자등록번호</th>
                                <td>{vo.bzn}</td>
                                <th>설립일자</th>
                                <td>{DateUtils.insertYyyyMmDdDash(vo.col)}</td>
                            </tr>
                            <tr>
                                <th>대표</th>
                                <td>{vo.rprnm}</td>
                                <th>직원 수</th>
                                <td>{StringUtils.comma(vo.empCnt)}</td>
                            </tr>
                            <tr>
                                <th>업태&#47;업종</th>
                                <td>{vo.btnm}</td>
                                <th>법인등록번호</th>
                                <td>{vo.cgn}</td>
                            </tr>
                            <tr>
                                <th>연락처</th>
                                <td>{vo.cnpl}</td>
                                <th>홈페이지</th>
                                <td>
                                    <a href={vo.hmpgUrlAdr} target={'_blank'} rel="noopener noreferrer">
                                        {vo.hmpgUrlAdr}
                                    </a>
                                </td>
                            </tr>
                            <tr>
                                <th>주소</th>
                                <td colSpan={3}>{vo.adr}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="section section02">
                        <h3 className="ico_title">주식&#47;자본&#47;투자유치</h3>
                        <table className="table">
                            <caption>주식&#47;자본&#47;투자유치 테이블</caption>
                            <colgroup>
                                <col width="12%"/>
                                <col width="38%"/>
                                <col width="12%"/>
                                <col width="38%"/>
                            </colgroup>
                            <tbody>
                            <tr>
                                <th>자본금&#40;원&#41;</th>
                                <td>{vo.cpfnAmt}</td>
                                <th>액면가&#40;원&#41;</th>
                                <td>{StringUtils.comma(vo.pvprAmt)}</td>
                            </tr>
                            <tr>
                                <th>총발행주식 수</th>
                                <td>{StringUtils.comma(vo.ttisStcnt)}</td>
                                <th>결산기</th>
                                <td>{vo.acpr}</td>
                            </tr>
                            <tr>
                                <th>기업가치&#40;원&#41;</th>
                                <td colSpan={3}>{StringUtils.comma(vo.etvlAmt)}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="section section03">
                        <div className="info_area">
                            <div className="info_header">
                                <h4 className="info_title">투자금 사용용도</h4>
                            </div>
                            <div className="info_content">
                                <div className="info_text_box">
                                    <div className="inner scroll">{vo.invmMnyUsus}</div>
                                </div>
                            </div>
                        </div>
                        <div className="info_area">
                            <div className="info_header">
                                <h4 className="info_title">EXIT 계획</h4>
                            </div>
                            <div className="info_content">
                                <div className="info_text_box">
                                    <div className="inner scroll">{vo.invmRtrvPlanCon}</div>
                                </div>
                            </div>
                        </div>
                        <div className="info_area">
                            <div className="info_header">
                                <h4 className="info_title">기존투자유치</h4>
                                <p className="sub_info">(단위 : 원)</p>
                            </div>
                            <div className="info_content ">
                                <div className="list_box">
                                    <ul className="info_list_header">
                                        <div className="info_cell date">날짜</div>
                                        <div className="info_cell name">기업명</div>
                                        <div className="info_cell price">금액</div>
                                    </ul>
                                    <ul className="info_list scroll">{
                                        vo?.investList?.length === 0
                                            ? <li className="no_result_wrap"><NoResult msg={'입력된 정보가 없습니다.'}/></li>
                                            : vo?.investList?.map((item, index) => (
                                                <li className="info_row" key={createKey()}>
                                                    <div className="info_cell date">{DateUtils.customDateFormat(item.invmEnmtYm, 'yyyy-MM')}</div>
                                                    <div className="info_cell name">{item.invmEnmtEtnm}</div>
                                                    <div className="info_cell price">{StringUtils.comma(item.invmEnmtAmt)}</div>
                                                </li>
                                            ))
                                    }</ul>
                                </div>
                            </div>
                        </div>
                        <div className="info_area">
                            <div className="info_header">
                                <h4 className="info_title">지원금(기보/신보/정부)</h4>
                                <p className="sub_info">(단위 : 원)</p>
                            </div>
                            <div className="info_content ">
                                <div className="list_box">
                                    <ul className="info_list_header">
                                        <div className="info_cell date">날짜</div>
                                        <div className="info_cell name">기업명</div>
                                        <div className="info_cell price">금액</div>
                                    </ul>
                                    <ul className="info_list scroll">{
                                        vo?.supportList?.length === 0
                                            ? <li className="no_result_wrap"><NoResult msg={'입력된 정보가 없습니다.'}/></li>
                                            : vo?.supportList?.map((item, index) => (
                                                <li className="info_row" key={createKey()}>
                                                    <div className="info_cell date">{DateUtils.insertYyyyMmDdDash(item.sprnMnyEnmtDt)}</div>
                                                    <div className="info_cell name">{item.sprnInttNm}</div>
                                                    <div className="info_cell price">{StringUtils.comma(item.sprnAmt)}</div>
                                                </li>
                                            ))
                                    }</ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardLayout>
            </div>
        </div>
    )
}
export default BasicInfoPreview
