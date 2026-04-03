/** @jsxImportSource @emotion/react */
import React, {useContext, useEffect, useRef, useState} from 'react'
import {useHistory} from 'react-router-dom'

import Button from 'components/atomic/Button'
import {NextBtn, PrevBtn} from 'components/atomic/IconButton'
import InformationTooltip from 'components/atomic/InformationTooltip'
import BreadCrumbs from 'components/common/BreadCrumbs'
import CardLayout from 'components/common/card/CardLayout'
import Footer from 'components/common/Footer'
import Gallery01 from 'components/common/Gallery01'
import Header from 'components/header/Header'
import Tab from 'components/common/Tab'
import NoResult from "components/common/NoResult";

import ProfileImage from "pageComponents/mypage/common/ProfileImage";

import Api from 'modules/consts/Api'
import CommonConst from 'modules/consts/CommonConst'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import ResponseUtils from 'modules/utils/ResponseUtils'
import {StringUtils} from 'modules/utils/StringUtils'
import DateUtils from 'modules/utils/DateUtils'
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey} from "modules/utils/CommonUtils";

const Finance = (props) => {

    const galleryData = {
        title: '마이페이지',
        img: '/images/gallery02_img1.png'
    }

    const history = useHistory();
    const commonContext = useContext(CommonContext);

    // tab 목록
    const [tabList, setTabList] = useState({
        active: ROUTER_NAMES.MY_PAGE_IR_FINANCE,
        list: CommonConst.IR_TAB_LIST
    })

    /** 통합 vo - IR작성 / 주요재무현황 / 주요채무현황 List */
    const [vo, setVo] = useState({
        ampmAmt: 0,
        amslAmt: 0,
        cpcrAmt: 0,
        cpfnAmt: 0,
        cpspMnyAmt: 0,
        cptsTtsmAmt: 0,
        crlbAmt: 0,
        crtxAmt: 0,
        ctnpAmt: 0,
        debtList: [],
        ernspAmt: 0,
        etcFlasAmt: 0,
        etcInlvPlCtam: 0,
        etcNoneFlasAmt: 0,
        flasAmt: 0,
        inasAmt: 0,
        itasAmt: 0,
        ivasAmt: 0,
        lbltTtsmAmt: 0,
        nnoeAmt: 0,
        noneCrlbAmt: 0,
        noneFlasAmt: 0,
        nonopExpAmt: 0,
        opprAmt: 0,
        orpfAmt: 0,
        progress: 0,
        qckasAmt: 0,
        sacstAmt: 0,
        sltpAmt: 0,
        tgasAmt: 0,
        utlinsttId: '',
        lbltCptsTtsm: 0,
        astTtsmAmt: 0
    })

    const handleTabList = (id) => {
        history.replace(id)
    }

    const onClickPrev = () => {
        // 이전 : 주주현황
        history.replace(ROUTER_NAMES.MY_PAGE_IR_STOCK)
    }

    const onClickNext = () => {
        // 다음 :  제품/기술시장
        history.replace(ROUTER_NAMES.MY_PAGE_IR_PROD_TECH_MARKET)
    }

    const onClickModify = () => {
        history.replace(ROUTER_NAMES.MY_PAGE_IR_FINANCE_WRITE)
    }

    const onClickCancel = () => {
        history.replace(ROUTER_NAMES.MY_PAGE_IR)
    }

    /** IR작성 진행율 API 호출 */
    const getDataProgress = async () => {
        return await ResponseUtils.getObject(Api.my.company.irProgress, null, ['progress']);
    }

    /** 주요채무현황 / 주요채무현황 API 호출 */
    const getDataFinance = async () => {
        const tempVo = {...vo}
        delete tempVo.progress
        const properties = Object.keys(tempVo)
        return await ResponseUtils.getObject(Api.my.company.irFinanceDetail, null, properties);
    }

    /** IR작성 / 주요채무현황 / 주요채무현황 API 최초 한번 호출 */
    const getData = async () => {
        Promise.all([getDataFinance(), getDataProgress()]).then(([irFinanceDetail, irProgres]) => {
            setVo((currentVo) => ({...currentVo, ...irFinanceDetail, progress: irProgres.progress || 0}))
        })
    }

    /** 최초 한번 모든 데이타 호출 */
    const isMounted = useRef(false);

    useEffect(() => {
        if (commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
            isMounted.current = true;
            commonContext.actions.pageMountPathCheck(history, getData);
        }
    }, [commonContext.state.user]);

    useEffect(() => {
        return () => isMounted.current = false;
    }, []);

    return (
        <>
            <Header/>
            <div className="page_container">
                <div className="wrap mypage_wrap ir_wrap bg02">
                    <div className="gallery_logo_wrap">
                        <Gallery01 data={galleryData}/>
                        <ProfileImage/>
                    </div>

                    <BreadCrumbs {...props} />

                    <div className="container default_size02">
                        {/*section start*/}
                        <div className="section section01">
                            <div className="section_header">
                                <h3 className="section_title">
                                    IR 작성<strong className="progress highlight_blue">&#40;{vo.progress}%&#41;</strong>
                                </h3>
                            </div>
                            <div className="tab_header">
                                <Tab handleTabActive={handleTabList} data={tabList}/>
                                <div className="btn_group">
                                    <Button className={'linear blue'} onClick={onClickCancel}>나가기</Button>
                                    <Button className={'blue'} onClick={onClickModify}>
                                        수정하기
                                    </Button>
                                </div>
                            </div>
                            {/*ir_section_wrap start*/}
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
                                                        <InformationTooltip notCloseBtn={true}>
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
                                                {/*재무상태표 end*/}

                                                {/*부채상태표 start*/}
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
                                                        <InformationTooltip notCloseBtn={true}>
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
                                                {/*부채상태표 end*/}
                                            </div>

                                            {/*손익계산서 start*/}
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
                                            {/*손익계산서 end*/}
                                        </div>
                                        {/*section01 end*/}

                                        {/*section02 start*/}
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
                                                    <tbody>
                                                    {
                                                        (vo?.debtList?.length > 0)
                                                            ? vo.debtList.map((item, i) => (
                                                                <tr key={createKey()}>
                                                                    <td className="text_left">{item.brngPlceNm}</td>
                                                                    <td className="text_right">{StringUtils.comma(item.brngPlceAmt)}</td>
                                                                    <td className="text_center">{DateUtils.insertYyyyMmDdDash(item.expiDt)}</td>
                                                                    <td className="text_right">{item.intRt}%</td>
                                                                    <td className="text_left">{item.rpmnCndtCon}</td>
                                                                </tr>
                                                            ))
                                                            :   <tr>
                                                                <td colSpan={5}>
                                                                    <NoResult msg={'입력된 정보가 없습니다.'} style={{marginTop: '40px', marginBottom: '40px'}}/>
                                                                </td>
                                                            </tr>
                                                    }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        {/*section02 end*/}
                                    </CardLayout>
                                    <div className="prev_next_wrap">
                                        <PrevBtn onClick={onClickPrev}/>
                                        <NextBtn onClick={onClickNext}/>
                                    </div>
                                </div>
                            </div>
                            {/*ir_section_wrap end*/}
                        </div>
                        {/*section end*/}
                    </div>
                    <Footer/>
                </div>
            </div>
        </>
    )
}
export default Finance
