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
import DateUtils from 'modules/utils/DateUtils'
import {StringUtils} from 'modules/utils/StringUtils'
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey} from "modules/utils/CommonUtils";

const ResultPlans = (props) => {

    const galleryData = {
        title: '마이페이지',
        img: '/images/gallery02_img1.png'
    }

    const history = useHistory()
    const commonContext = useContext(CommonContext);

    const [progress, setProgress] = useState(0)
    const [vo, setVo] = useState({
        awardList: [],
        exportList: [],
        investList: [],
        planList: [],
        policyFundList: []
    })

    const [tabList, setTabList] = useState({
        active: ROUTER_NAMES.MY_PAGE_IR_RESULT_PLANS,
        list: CommonConst.IR_TAB_LIST
    })

    const handleTabList = (id) => {
        history.replace(id)
    }
    const onClickPrev = () => {
        // 이전 : 제품/기술시장
        history.replace(ROUTER_NAMES.MY_PAGE_IR_PROD_TECH_MARKET)
    }
    const onClickNext = () => {
        // 다음 :
    }
    const onClickModify = () => {
        history.replace(ROUTER_NAMES.MY_PAGE_IR_RESULT_PLANS_WRITE)
    }
    const onClickCancel = () => {
        history.replace(ROUTER_NAMES.MY_PAGE_IR)
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

    const loadProgress = async () => {
        const resProgress = await ResponseUtils.getSimpleResponse(Api.my.company.irProgress)
        return resProgress
    }
    const loadResultPlan = async () => {
        const resResultPlan = await ResponseUtils.getSimpleResponse(Api.my.company.irPlanDetail)
        return resResultPlan
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
                    setProgress(res.progress)
                }).catch(err => {
                    console.error(err);
                    mountApiCntRef.current--;
                });
                loadResultPlan().then(res => {
                    mountApiCntRef.current--;
                    setVo(res);
                }).catch(err => {
                    console.error(err);
                    mountApiCntRef.current--;
                });
            }, mountApiCntRef);
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
                                <div className="ir_result_plans">
                                    <CardLayout>
                                        {/*section01 start*/}
                                        <div className="section section01">
                                            <h3 className="ico_title">주요성과</h3>
                                            <div className="table_box">
                                                {/*투자 start*/}
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
                                                        <tbody>
                                                        {
                                                            (vo?.investList?.length > 0)
                                                                ? vo.investList.map((item, i) => (
                                                                    <tr key={createKey()}>
                                                                        <td>{item['indiCon']}</td>
                                                                        <td>{item['invmAmt']}</td>
                                                                        <td>{DateUtils.insertYyyyMmDdDash(item['invmDt'])}</td>
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
                                                {/*투자 end*/}
                                                {/*수상실적 start*/}
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
                                                {/*수상실적 end*/}
                                            </div>

                                            <div className="table_box">
                                                {/*수출 start*/}
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
                                                {/*수출 end*/}
                                                {/*정책자금 start*/}
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
                                                {/*정책자금 end*/}
                                            </div>
                                        </div>
                                        {/*section01 end*/}

                                        {/*section02 start*/}
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
                                                                ? vo?.planList?.map((item, i) => (
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
                                        {/*section02 end*/}
                                    </CardLayout>
                                    <div className="prev_next_wrap">
                                        <PrevBtn onClick={onClickPrev}/>
                                        {/*<NextBtn />*/}
                                        <div>&nbsp;</div>
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
export default ResultPlans
