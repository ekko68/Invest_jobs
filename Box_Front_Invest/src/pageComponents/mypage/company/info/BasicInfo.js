import React, {forwardRef, useEffect, useImperativeHandle, useState} from 'react'
import {useHistory} from 'react-router-dom'
import Button from 'components/atomic/Button'
import CardLayout from 'components/common/card/CardLayout'
import NoResult from "components/common/NoResult";
import ROUTER_NAMES from 'modules/consts/RouterConst'
import DateUtils from 'modules/utils/DateUtils'
import {StringUtils} from 'modules/utils/StringUtils'

import VoUtils from 'modules/utils/VoUtils'
import {createKey} from "modules/utils/CommonUtils";
import {CheckYn} from "modules/consts/BizConst";
import {isNumber} from "modules/utils/NumberUtils";

const BasicInfo = forwardRef((props, ref) => {
    const history = useHistory()
    const [vo, setVo] = useState({
        addr: '',
        adres: '',
        bizrno: '',
        bplcNm: '',
        bsunDwarCd: '',
        bsunDwarNm: '',
        btnm: '',
        bzstNm: '',
        cnrnFildList: [],
        crewRtrv: '',
        empCnt: null,
        enfmClsfCd: '',
        enfmClsfNm: '',
        enprDsncClsfCd: '',
        enprDsncClsfNm: '',
        enprInrdCon: '',
        fondDe: '',
        guAdrAllNm: '',
        hmpgAdres: '',
        ipList: [],
        jurirno: '',
        logoImageUrl: '',
        lstnYn: '',
        msrnAmslAmt: null,
        msrnAmslYear: '',
        nwAdrAllNm: '',
        postNo: '',
        reprsntEmail: '',
        reprsntFxnum: '',
        reprsntTelno: '',
        rprsntvNm: '',
        rvsRnum: '',
        salamt: null,
        utlinsttId: '',

        // oppbYn: '',
        // invmAmtCd: '',
        // invmAmtNm: '',
        // invmStgCd: '',
        // invmStgNm: '',
    })
    useImperativeHandle(ref, () => ({
        setData
    }))
    const setData = (data) => {
        VoUtils.setVoNullToEmpty(data, ['empCnt', 'salamt'])
        setVo(data)
    }
    const onClickInfoWrite = () => {
        history.push(ROUTER_NAMES.MY_PAGE_COMPANY_INFO_WRITE)
    }

    return (
        <div className="section section01">
            <div className="section_header">
                <h3 className="section_title"> 내 정보</h3>
                <div className="switch_btn_wrap">
                    <Button className={'blue investor_switch_btn'} onClick={props.onClickConvert}>투자사전환요청</Button>
                    <Button className={'blue'} onClick={onClickInfoWrite}>
                        수정하기
                    </Button>
                </div>
            </div>
            <CardLayout>
                {/*basic_wrap start*/}
                <div className="basic_wrap info_section">
                    <div className="card_header">
                        <h3 className="ico_title title">기본정보</h3>
                    </div>
                    <div className="info_table">
                        <table className="table type03">
                            <caption>기본정보 테이블</caption>
                            <colgroup>
                                <col width={'12%'}/>
                                <col width={'38%'}/>
                                <col width={'12%'}/>
                                <col width={'38%'}/>
                            </colgroup>
                            <tbody>
                            <tr>
                                <th>기업명</th>
                                <td>{vo.bplcNm}</td>
                                <th>대표번호</th>
                                <td>{vo.reprsntTelno}</td>
                            </tr>
                            <tr>
                                <th>대표</th>
                                <td>{vo.rprsntvNm}</td>
                                <th>팩스번호</th>
                                <td>{vo.reprsntFxnum}</td>
                            </tr>
                            <tr>
                                <th>설립일</th>
                                <td>{DateUtils.insertYyyyMmDdDash(vo.fondDe)}</td>
                                <th>이메일</th>
                                <td>{vo.reprsntEmail}</td>
                            </tr>
                            <tr>
                                <th>기업형태</th>
                                <td>{vo.enfmClsfNm}</td>
                                <th>직원수</th>
                                <td>{
                                    isNumber(vo.empCnt) && `${vo.empCnt} 명`
                                }</td>
                            </tr>
                            <tr>
                                <th>주소</th>
                                <td>{
                                    (StringUtils.hasLength(vo.postNo) ? `(${vo.postNo}) ` : '') + vo.addr
                                }</td>
                                <th>홈페이지</th>
                                <td>{vo.hmpgAdres}</td>
                            </tr>
                            <tr>
                                <th>업종</th>
                                <td>{vo.btnm}</td>
                                <th>최근매출(원)</th>
                                <td>{
                                    isNumber(vo.msrnAmslAmt)
                                        // ?   `${formatUtils.numberWithCommas.format(vo.msrnAmslAmt)}원` + (StringUtils.hasLength(vo.msrnAmslYear) ? ` (${vo.msrnAmslYear}년)` : '')
                                        ?   `${StringUtils.comma(vo.msrnAmslAmt)}원` + (StringUtils.hasLength(vo.msrnAmslYear) ? ` (${vo.msrnAmslYear}년)` : '')
                                        :   ''
                                }</td>
                            </tr>
                            <tr>
                                <th>업태</th>
                                <td>{vo.bzstNm}</td>
                                <th>기업구분</th>
                                <td>{vo.enprDsncClsfNm}</td>
                            </tr>
                            <tr>
                                <th>관심분야</th>
                                <td>
                                    <ul className="tag_box_list">{
                                        vo?.cnrnFildList?.map((item, index) => (
                                            <li className="tag_box_item" key={createKey()}>
                                                {item['cnrnFildNm']}
                                            </li>
                                        ))
                                    }</ul>
                                </td>
                                <th>상장구분</th>
                                <td>
                                    {vo.lstnYn === CheckYn.YES ? '상장' : vo.lstnYn === CheckYn.NO ? '비상장' : ''}
                                </td>
                            </tr>
                            <tr>
                                <th>사업장 소재지</th>
                                <td colSpan={3}>{vo.bsunDwarNm}</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="introduce_wrap info_section">
                    <div className="card_header">
                        <h3 className="ico_title title">소개</h3>
                    </div>
                    {
                        StringUtils.hasLength(vo.enprInrdCon)
                            ?   <p className="introduce_text" dangerouslySetInnerHTML={{__html: StringUtils.toBr(vo.enprInrdCon)}}></p>
                            :   <NoResult msg={'등록된 소개내용이 없습니다.'} style={{marginTop: '40px', marginBottom: '40px'}}/>
                    }
                </div>
            </CardLayout>
        </div>
    )
});

export default BasicInfo;
