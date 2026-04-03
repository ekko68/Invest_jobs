/** @jsxImportSource @emotion/react */
import React, {useContext, useEffect, useState} from 'react'
import InformationTooltip from 'components/atomic/InformationTooltip'
import CardLayout from 'components/common/card/CardLayout'
import NoResult from "components/common/NoResult";

import ResponseUtils from 'modules/utils/ResponseUtils'
import {StringUtils} from 'modules/utils/StringUtils'
import DateUtils from 'modules/utils/DateUtils'
import VoUtils from "modules/utils/VoUtils";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey} from "modules/utils/CommonUtils";

const FinancePreview = (props) => {
    const {api, isCompanyRequestDetail} = props;
    const commonContext = useContext(CommonContext);

    /** 통합 vo - IR작성 / 주요재무현황 / 주요채무현황 List */
    const [vo, setVo] = useState({
        utlinsttId: '', // 이용기관(회사) ID
        /** 재무상태표 */
        flasAmt: 0, // 유동자산
        qckasAmt: 0, // 당좌자산 금액
        inasAmt: 0, // 재고자산 금액
        etcFlasAmt: 0, // 기타 유동자산 금액
        noneFlasAmt: 0, // 비유동자산
        ivasAmt: 0, // 투자자산 금액
        tgasAmt: 0, // 유형자산 금액
        itasAmt: 0, // 무형자산 금액
        etcNoneFlasAmt: 0, // 기타 비유동자산 금액
        /** 부채상태표 */
        lbltTtsmAmt: 0, // 부채총계
        crlbAmt: 0, // 유동부채 금액
        noneCrlbAmt: 0, // 비유동부채 금액
        cptsTtsmAmt: 0, // 자본총계
        cpfnAmt: 0, // 자본금 금액
        cpspMnyAmt: 0, // 자본잉여금 금액
        cpcrAmt: 0, // 자본조정 금액
        etcInlvPlCtam: 0, // 기타포괄손익 누계액
        ernspAmt: 0, // 이익잉여금 금액
        /** 손익계산서 */
        amslAmt: 0, // 매출액
        ampmAmt: 0, // 매출원가 금액
        sltpAmt: 0, // 매출총이익 금액
        sacstAmt: 0, // 판매관리비 금액
        opprAmt: 0, // 영업이익 금액
        nnoeAmt: 0, // 영업외수익 금액
        nonopExpAmt: 0, // 영업외비용 금액
        orpfAmt: 0, // 경상이익 금액
        crtxAmt: 0, // 법인세 금액
        ctnpAmt: 0, // 당기순이익 금액
        /** 주요채무현황 List*/
        debtList: [],
        /** IR작성(n%) */
        progress: 0
    })

    /** 주요채무현황 / 주요채무현황 API 호출 */
    const getDataFinance = async () => {
        const resFinanceObject = await ResponseUtils.getIrSimpleResponse(api, null, false);
        return resFinanceObject['irFinanceTab']
    }

    /** IR작성 / 주요채무현황 / 주요채무현황 API 최초 한번 호출 */
    const getData = async () => {
        Promise.all([getDataFinance()]).then(([irFinanceDetail]) => {
            if (irFinanceDetail) {
                VoUtils.setInitNumberToZero(vo, irFinanceDetail);
                if (irFinanceDetail.debtList) {
                    VoUtils.setListVoNullToEmpty(irFinanceDetail.debtList, ['brngPlceAmt', 'intRt'], ['utlinsttId', 'brngPlceSqn']);
                }
                setVo((currentVo) => ({...currentVo, ...irFinanceDetail}));
            }
        })
    }
    /** 최초 한번 모든 데이타 호출 */
    useEffect(() => {
        if (api !== '') {
            commonContext.actions.callbackAfterSessionRefresh(getData, true, true);
        }
    }, [api])

    return (
        <div className="ir_section_wrap ">
            <div className="ir_finance">
                <CardLayout>
                    {/*section01 start*/}
                    <div className="section section01">
                        <h3 className="ico_title">주요재무현황</h3>
                        <div className="table_section_wrap flex_btw">
                            {/*재무상태표 start*/}
                            <div className="table_section">
                                <div className="section_header">
                                    <p className="section_title">재무상태표</p>
                                    <span className="info">&#40;단위:원&#41;</span>
                                </div>
                                <table className="table">
                                    <caption>재무상태표 테이블</caption>
                                    <colgroup>
                                        <col width={'33%'}/>
                                        <col width={'30%'}/>
                                        <col width={'37%'}/>
                                    </colgroup>
                                    <tbody>
                                    <tr>
                                        <th rowSpan={3}>
                                            <div className="text_box">
                                                <p className="name">유동자산</p>
                                                <p className="static">{StringUtils.comma(vo.flasAmt)}</p>
                                            </div>
                                        </th>
                                        <td>당좌자산</td>
                                        <td className="text_right">{StringUtils.comma(vo.qckasAmt)}</td>
                                    </tr>
                                    <tr>
                                        <td>재고자산</td>
                                        <td className="text_right">{StringUtils.comma(vo.inasAmt)}</td>
                                    </tr>
                                    <tr>
                                        <td>기타 유동자산</td>
                                        <td className="text_right">{StringUtils.comma(vo.etcFlasAmt)}</td>
                                    </tr>
                                    <tr>
                                        <th rowSpan={4}>
                                            <div className="text_box">
                                                <p className="name">비유동자산</p>
                                                <p className="static">{StringUtils.comma(vo.noneFlasAmt)}</p>
                                            </div>
                                        </th>
                                        <td>투자자산</td>
                                        <td className="text_right">{StringUtils.comma(vo.ivasAmt)}</td>
                                    </tr>
                                    <tr>
                                        <td>유형자산</td>
                                        <td className="text_right">{StringUtils.comma(vo.tgasAmt)}</td>
                                    </tr>
                                    <tr>
                                        <td>무형자산</td>
                                        <td className="text_right">{StringUtils.comma(vo.itasAmt)}</td>
                                    </tr>
                                    <tr>
                                        <td>기타 비유동자산</td>
                                        <td className="text_right">{StringUtils.comma(vo.etcNoneFlasAmt)}</td>
                                    </tr>
                                    </tbody>
                                    <tfoot>
                                    <tr>
                                        <td colSpan={3}>
                                            <div className="total_box flex_btw">
                                                <span>자산총계</span>
                                                <span>{StringUtils.comma(vo.astTtsmAmt)}</span>
                                            </div>
                                        </td>
                                    </tr>
                                    </tfoot>
                                </table>
                                <div className="info_tooltip_wrap">
                                    <InformationTooltip notCloseBtn={true}
                                                        textWrapOff={isCompanyRequestDetail}>
                                        <div className="tooltip_inner">
                                            <ul className="info_list">
                                                <li className="info_item">
                                                    <span className="name">자산총계</span>
                                                    <span className="content">유동자산 + 비유동자산</span>
                                                </li>
                                                <li className="info_item">
                                                    <span className="name">유동자산</span>
                                                    <span className="content">당좌자산 + 재고자산 + 기타 유동자산</span>
                                                </li>
                                                <li className="info_item">
                                                    <span className="name">비유동자산</span>
                                                    <span className="content">투자자산 + 유형자산 + 무형자산 + 기타 비유동자산</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </InformationTooltip>
                                </div>
                            </div>
                            <div className="table_section">
                                <div className="section_header">
                                    <p className="section_title">부채상태표</p>
                                    <span className="info">&#40;단위:원&#41;</span>
                                </div>
                                <table className="table">
                                    <caption>부채상태표 테이블</caption>
                                    <colgroup>
                                        <col width={'33%'}/>
                                        <col width={'30%'}/>
                                        <col width={'37%'}/>
                                    </colgroup>
                                    <tbody>
                                    <tr>
                                        <th rowSpan={2}>
                                            <div className="text_box">
                                                <p className="name">부채총계</p>
                                                <p className="static">{StringUtils.comma(vo.lbltTtsmAmt)}</p>
                                            </div>
                                        </th>
                                        <td>유동부채</td>
                                        <td className="text_right">{StringUtils.comma(vo.crlbAmt)}</td>
                                    </tr>
                                    <tr>
                                        <td>비유동부채</td>
                                        <td className="text_right">{StringUtils.comma(vo.noneCrlbAmt)}</td>
                                    </tr>
                                    <tr>
                                        <th rowSpan={5}>
                                            <div className="text_box">
                                                <p className="name">자본총계</p>
                                                <p className="static">{StringUtils.comma(vo.cptsTtsmAmt)}</p>
                                            </div>
                                        </th>
                                        <td>자본금</td>
                                        <td className="text_right">{StringUtils.comma(vo.cpfnAmt)}</td>
                                    </tr>
                                    <tr>
                                        <td>자본잉여금</td>
                                        <td className="text_right">{StringUtils.comma(vo.cpspMnyAmt)}</td>
                                    </tr>
                                    <tr>
                                        <td>자본조정</td>
                                        <td className="text_right">{StringUtils.comma(vo.cpcrAmt)}</td>
                                    </tr>
                                    <tr>
                                        <td>기타초괄손익 누계액</td>
                                        <td className="text_right">{StringUtils.comma(vo.etcInlvPlCtam)}</td>
                                    </tr>
                                    <tr>
                                        <td>이익잉여금</td>
                                        <td className="text_right">{StringUtils.comma(vo.ernspAmt)}</td>
                                    </tr>
                                    </tbody>
                                    <tfoot>
                                    <tr>
                                        <td colSpan={3}>
                                            <div className="flex_btw">
                                                <span>부채와 자본총계</span>
                                                <span>{StringUtils.comma(vo.lbltCptsTtsm)}</span>
                                            </div>
                                        </td>
                                    </tr>
                                    </tfoot>
                                </table>
                                <div className="info_tooltip_wrap">
                                    <InformationTooltip notCloseBtn={true}
                                                        textWrapOff={isCompanyRequestDetail}>
                                        <div className="tooltip_inner">
                                            <ul className="info_list">
                                                <li className="info_item">
                                                    <span className="name">부채총계</span>
                                                    <span className="content">유동부채 + 비유동부채</span>
                                                </li>
                                                <li className="info_item">
                                                    <span className="name">자본총계</span>
                                                    <span className="content">
                                                                  자본금 + 자본잉여금 + 자본조정 + 기타포괄손익 누계액 + 이익잉여금{' '}
                                                                </span>
                                                </li>
                                                <li className="info_item">
                                                    <span className="name">부채와 자본총계 </span>
                                                    <span className="content">부채총계 + 자본총계</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </InformationTooltip>
                                </div>
                            </div>
                        </div>
                        <div className="profit_loss_wrap">
                            <div className="section_header">
                                <p className="section_title">손익계산서</p>
                                <span className="info">&#40;단위:원&#41;</span>
                            </div>
                            <ul className="profit_loss_list">
                                <li className="profit_loss_item">
                                    <span className="name">매출액</span>
                                    <span className="content">{StringUtils.comma(vo.amslAmt)}</span>
                                </li>
                                <li className="profit_loss_item">
                                    <span className="name">매출원가</span>
                                    <span className="content">{StringUtils.comma(vo.ampmAmt)}</span>
                                </li>
                                <li className="profit_loss_item">
                                    <span className="name">매출총이익</span>
                                    <span className="content">{StringUtils.comma(vo.sltpAmt)}</span>
                                </li>
                                <li className="profit_loss_item">
                                    <span className="name">판매관리비</span>
                                    <span className="content">{StringUtils.comma(vo.sacstAmt)}</span>
                                </li>
                                <li className="profit_loss_item">
                                    <span className="name">영업이익</span>
                                    <span className="content">{StringUtils.comma(vo.opprAmt)}</span>
                                </li>
                                <li className="profit_loss_item">
                                    <span className="name">영업외수익</span>
                                    <span className="content">{StringUtils.comma(vo.nnoeAmt)}</span>
                                </li>
                                <li className="profit_loss_item">
                                    <span className="name">영업외비용</span>
                                    <span className="content">{StringUtils.comma(vo.nonopExpAmt)}</span>
                                </li>
                                <li className="profit_loss_item">
                                    <span className="name">경상이익</span>
                                    <span className="content">{StringUtils.comma(vo.orpfAmt)}</span>
                                </li>
                                <li className="profit_loss_item">
                                    <span className="name">법인세</span>
                                    <span className="content">{StringUtils.comma(vo.crtxAmt)}</span>
                                </li>
                                <li className="profit_loss_item">
                                    <span className="name">당기순이익</span>
                                    <span className="content">{StringUtils.comma(vo.ctnpAmt)}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="section section02">
                        <h3 className="ico_title">주요채무현황</h3>
                        <div className="section_header">
                            <p className="section_title">&nbsp;</p>
                            <span className="info">&#40;단위:원&#41;</span>
                        </div>
                        <div className="table_wrap">
                            <table className="table">
                                <caption>주요채무현황 테이블</caption>
                                <colgroup>
                                    <col width={'16%'}/>
                                    <col width={'16%'}/>
                                    <col width={'16%'}/>
                                    <col width={'16%'}/>
                                    <col width={'56%'}/>
                                </colgroup>
                                <thead>
                                <tr>
                                    <th>차입처</th>
                                    <th>차입금액</th>
                                    <th>만기일</th>
                                    <th>이자율</th>
                                    <th>상환조건</th>
                                </tr>
                                </thead>
                                <tbody>{
                                    (vo?.debtList?.length > 0)
                                        ?   vo.debtList.map((item, index) => (
                                            <tr key={createKey()}>
                                                <td className="text_left">{item.brngPlceNm}</td>
                                                <td className="text_right">{StringUtils.comma(item.brngPlceAmt)}</td>
                                                <td className="text_center">{DateUtils.insertYyyyMmDdDash(item.expiDt)}</td>
                                                <td className="text_right">{item.intRt}%</td>
                                                <td className="text_left">{item.rpmnCndtCon}</td>
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
                </CardLayout>
            </div>
        </div>
    )
}
export default FinancePreview
