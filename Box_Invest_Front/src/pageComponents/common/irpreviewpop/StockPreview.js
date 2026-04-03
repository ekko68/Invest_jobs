/** @jsxImportSource @emotion/react */
import React, {useContext, useEffect, useState} from 'react'

import InformationTooltip from 'components/atomic/InformationTooltip'
import CardLayout from 'components/common/card/CardLayout'
import NoResult from "components/common/NoResult";

import ResponseUtils from 'modules/utils/ResponseUtils'
import {StringUtils} from 'modules/utils/StringUtils'
import VoUtils from "modules/utils/VoUtils";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey} from "modules/utils/CommonUtils";

const StockPreview = (props) => {
    const {api, isCompanyRequestDetail} = props;
    const commonContext = useContext(CommonContext);
    const [list, setList] = useState([])

    useEffect(() => {
        if (api !== '') {
            commonContext.actions.callbackAfterSessionRefresh(async () => {
                const stockholderList = await loadStockholderList()
                if (stockholderList) {
                    VoUtils.setListVoNullToEmpty(stockholderList, ['pfstHoldCnt', 'pfstPvpr', 'pfstAmt', 'cmscHoldCnt', 'cmscPvpr', 'cmscAmt', 'prra'], ['utlinsttId', 'stchSqn']);
                    setList(stockholderList);
                }
            }, true, true)
        }
    }, [api])

    const loadStockholderList = async () => {
        const resStockObject = await ResponseUtils.getIrSimpleResponse(api, null, false);
        return resStockObject['irStockHolderTab']
    }

    return (
        <div className="ir_section_wrap ">
            <div className="ir_stock">
                <CardLayout>
                    <div className="section section01">
                        <h3 className="ico_title">주주</h3>
                        {
                            (list?.length > 0)
                                ? <>
                                    <table className="table">
                                        <caption>주주현황 테이블</caption>
                                        <colgroup>
                                            <col width={'9%'}/>
                                            <col width={'15%'}/>
                                            <col width={'15%'}/>
                                            <col width={'13%'}/>
                                            <col width={'13%'}/>
                                            <col width={'8%'}/>
                                            <col width={'*'}/>
                                        </colgroup>
                                        <thead>
                                        <tr>
                                            <th rowSpan={2} className="middle">
                                                주주명
                                            </th>
                                            <th colSpan={2}>보유 주식수 및 액면가</th>
                                            <th colSpan={2}>금액</th>
                                            <th rowSpan={2} className={'middle'}>
                                                지분율
                                            </th>
                                            <th rowSpan={2} className={'middle'}>
                                                비고
                                            </th>
                                        </tr>
                                        <tr>
                                            <th>우선주</th>
                                            <th>보통주</th>
                                            <th>우선주</th>
                                            <th>보통주</th>
                                        </tr>
                                        </thead>
                                        <tbody>{
                                            list.map((item, i) => (
                                                <tr key={createKey()}>
                                                    <th>{item.stchNm}</th>
                                                    <th>
                                                        {StringUtils.comma(item.pfstHoldCnt)}주 &#47; {StringUtils.comma(item.pfstPvpr)}원
                                                    </th>
                                                    <th>
                                                        {StringUtils.comma(item.cmscHoldCnt)}주 &#47; {StringUtils.comma(item.cmscPvpr)}원
                                                    </th>
                                                    <th>{StringUtils.comma(item.pfstAmt)}</th>
                                                    <th>{StringUtils.comma(item.cmscAmt)}</th>
                                                    <th>{StringUtils.comma(item.prra)}%</th>
                                                    <th>{item.rmrk}</th>
                                                </tr>
                                            ))
                                        }</tbody>
                                        <tfoot>{
                                            (() => {
                                                let prra = 0
                                                let pfstHoldCnt = 0
                                                let cmscHoldCnt = 0
                                                let pfstPvpr = 0
                                                let cmscPvpr = 0
                                                let pfstAmt = 0
                                                let cmscAmt = 0

                                                list?.forEach((listItem, idx) => {
                                                    prra += listItem.prra
                                                    pfstHoldCnt += listItem.pfstHoldCnt
                                                    cmscHoldCnt += listItem.cmscHoldCnt
                                                    pfstAmt += listItem.pfstAmt
                                                    cmscAmt += listItem.cmscAmt
                                                    if (idx === 0) {
                                                        pfstPvpr = listItem.pfstPvpr
                                                        cmscPvpr = listItem.cmscPvpr
                                                    }
                                                })

                                                return (
                                                    <tr>
                                                        <th>합계</th>
                                                        <td>
                                                            {StringUtils.comma(pfstHoldCnt)} &#47; {StringUtils.comma(pfstPvpr)}원
                                                        </td>
                                                        <td>
                                                            {StringUtils.comma(cmscHoldCnt)} &#47; {StringUtils.comma(cmscPvpr)}원
                                                        </td>
                                                        <td>{StringUtils.comma(pfstAmt)}원</td>
                                                        <td>{StringUtils.comma(cmscAmt)}원</td>
                                                        <td>{StringUtils.comma(prra)}%</td>
                                                        <td></td>
                                                    </tr>
                                                )
                                            })()
                                        }</tfoot>
                                    </table>
                                    <div className="notice_wrap">
                                        <InformationTooltip notCloseBtn={true}
                                                            textWrapOff={isCompanyRequestDetail}>
                                            본 지분율은 일반적인 산정방식인 우선주에 의결권이 없음을 전제로 한 것이며 따라서 해당 기업의
                                            정관에서 정한 사항에 따라 실제와 차이가 있을 수 있습니다.
                                            {/*<p className="text">*/}
                                            {/*    본 지분율은 일반적인 산정방식인 우선주에 의결권이 없음을 전제로 한 것이며 따라서 해당 기업의*/}
                                            {/*    정관에서 정한 사항에 따라 실제와 차이가 있을 수 있습니다.*/}
                                            {/*</p>*/}
                                        </InformationTooltip>
                                    </div>
                                </>

                                : <NoResult isIrView={true}
                                            msg={'등록된 IR 주주 정보가 없습니다.'}/>
                        }
                    </div>
                </CardLayout>
            </div>
        </div>
    )
}
export default StockPreview
