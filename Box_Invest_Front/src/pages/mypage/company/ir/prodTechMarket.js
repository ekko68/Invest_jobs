/** @jsxImportSource @emotion/react */
import React, {useContext, useEffect, useRef, useState} from 'react'
import {useHistory} from 'react-router-dom'

import Header from 'components/header/Header'
import Footer from 'components/common/Footer'
import Gallery01 from 'components/common/Gallery01'
import BreadCrumbs from 'components/common/BreadCrumbs'
import Tab from 'components/common/Tab'
import Button from 'components/atomic/Button'
import CardLayout from 'components/common/card/CardLayout'
import {NextBtn, PrevBtn} from 'components/atomic/IconButton'
import NoResult from "components/common/NoResult";

import ProfileImage from "pageComponents/mypage/common/ProfileImage";

import ROUTER_NAMES from 'modules/consts/RouterConst'
import ResponseUtils from 'modules/utils/ResponseUtils'
import Api from 'modules/consts/Api'
import CommonConst from 'modules/consts/CommonConst'
import {StringUtils} from 'modules/utils/StringUtils'
import DateUtils from 'modules/utils/DateUtils'
import VoUtils from 'modules/utils/VoUtils'
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey} from "modules/utils/CommonUtils";

const ProdTechMarket = (props) => {

    const galleryData = {
        title: '마이페이지',
        img: '/images/gallery02_img1.png'
    }

    const history = useHistory()
    const commonContext = useContext(CommonContext);

    const [progress, setProgress] = useState(0)
    const [vo, setVo] = useState({
        ipList: [],
        market: {mrktChrc: '', mrktInvgDesc: '', utlinsttId: ''},
        marketPlayerList: [],
        marketTargetList: [],
        product: {prdtChrc: '', prdtDesc: '', utlinsttId: ''},
        saleList: [],
        tech: {holdTchnChrc: '', holdTchnDesc: '', utlinsttId: ''}
    })

    // tab 목록
    const [tabList] = useState({
        active: ROUTER_NAMES.MY_PAGE_IR_PROD_TECH_MARKET,
        list: CommonConst.IR_TAB_LIST
    })


    const handleTabList = (id) => {
        history.replace(id)
    }
    const onClickPrev = () => {
        // 이전 : 재무정보
        history.replace(ROUTER_NAMES.MY_PAGE_IR_FINANCE)
    }
    const onClickNext = () => {
        // 다음 : 성과 및 계획
        history.replace(ROUTER_NAMES.MY_PAGE_IR_RESULT_PLANS)
    }
    const onClickModify = () => {
        history.replace(ROUTER_NAMES.MY_PAGE_IR_PROD_TECH_MARKET_WRITE)
    }
    const onClickCancel = () => {
        history.replace(ROUTER_NAMES.MY_PAGE_IR)
    }

    const loadProgress = async () => {
        const resProgress = await ResponseUtils.getSimpleResponse(Api.my.company.irProgress)
        return resProgress
    }
    const loadProdTechMarket = async () => {
        const prodTechMarketRes = await ResponseUtils.getSimpleResponse(Api.my.company.irExtraInfoDetail)
        return prodTechMarketRes
    }

    const isMounted = useRef(false);
    const mountApiCntRef = useRef(0);

    useEffect(() => {
        if (commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
            isMounted.current = true;

            commonContext.actions.pageMountPathCheck(history, async () => {
                mountApiCntRef.current = 2;

                loadProgress().then(res => {
                    mountApiCntRef.current--;
                    setProgress(res.progress);
                }).catch(err => {
                    console.error(err);
                    mountApiCntRef.current--;
                });

                loadProdTechMarket().then(res => {
                    mountApiCntRef.current--;

                    VoUtils.setVoNullToEmpty(res.market)
                    VoUtils.setVoNullToEmpty(res.product)
                    VoUtils.setVoNullToEmpty(res.tech)
                    setVo(res)
                }).catch(err => {
                    console.error(err);
                    mountApiCntRef.current--;
                });
            }, mountApiCntRef);
        }
    }, [commonContext.state.user]);

    useEffect(() => {
        return () => {
            isMounted.current = false;
            mountApiCntRef.current = 0;
        }
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
                                    IR 작성<strong className="progress highlight_blue">&#40;{progress}%&#41;</strong>
                                </h3>
                            </div>
                            <div className="tab_header">
                                <Tab handleTabActive={handleTabList} data={tabList}/>
                                <div className="btn_group">
                                    <Button className={'linear blue'} onClick={onClickCancel}>
                                        나가기
                                    </Button>
                                    <Button className={'blue'} onClick={onClickModify}>
                                        수정하기
                                    </Button>
                                </div>
                            </div>
                            {/*ir_section_wrap start*/}
                            <div className="ir_section_wrap ">
                                <div className="ir_prod_tech_market">
                                    <CardLayout>
                                        {/*section01 start*/}
                                        <div className="section section01">
                                            <h3 className="ico_title">제품</h3>
                                            <div className="text_box_wrap flex_btw">
                                                {/*설명 start*/}
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
                                                {/*설명 end*/}
                                                {/*특징 및 차별성 start*/}
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
                                                {/*특징 및 차별성 end*/}
                                            </div>
                                            {/*주요 매출처 start*/}
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

                                                    <tbody>
                                                    {
                                                        (vo?.saleList?.length > 0)
                                                            ? vo.saleList.map((item, index) => (
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
                                                    }
                                                    </tbody>
                                                </table>
                                            </div>
                                            {/*주요 매출처 end*/}
                                        </div>
                                        {/*section01 end*/}

                                        {/*section02 start*/}
                                        <div className="section section02">
                                            <h3 className="ico_title">기술</h3>
                                            <div className="text_box_wrap flex_btw">
                                                {/*주요보유기술 start*/}
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
                                                {/*주요보유기술 end*/}
                                                {/*장점/특징/차별성 start*/}
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
                                                {/*장점/특징/차별성 end*/}
                                            </div>
                                            {/*지적재산권 현황 start*/}
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
                                                    <tbody>
                                                    {
                                                        (vo?.ipList?.length > 0)
                                                            ? vo.ipList.map((item, index) => (
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
                                                    }
                                                    </tbody>
                                                </table>
                                            </div>
                                            {/*지적재산권 현황 end*/}
                                        </div>
                                        {/*section02 end*/}

                                        {/*section03 start*/}
                                        <div className="section section03">
                                            <h3 className="ico_title">시장</h3>
                                            <div className="text_box_wrap flex_btw">
                                                {/*시장리서치 start*/}
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
                                                {/*시장리서치 end*/}
                                                {/*장점/특징/차별성 start*/}
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
                                                {/*장점/특징/차별성 end*/}
                                            </div>
                                            {/*주요 목표 시장 및 규모 start*/}
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
                                                    <tbody>
                                                    {
                                                        (vo?.marketTargetList?.length > 0)
                                                            ? vo?.marketTargetList?.map((item, index) => (
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
                                                    }
                                                    </tbody>
                                                </table>
                                            </div>
                                            {/*주요 목표 시장 및 규모 end*/}
                                            {/*시장 플레이어 start*/}
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
                                                    <tbody>
                                                    {
                                                        (vo?.marketPlayerList?.length > 0)
                                                            ? vo.marketPlayerList.map((item, index) => (
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
                                                    }
                                                    </tbody>
                                                </table>
                                            </div>
                                            {/*시장 플레이어 end*/}
                                        </div>
                                        {/*section03 end*/}
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
export default ProdTechMarket
