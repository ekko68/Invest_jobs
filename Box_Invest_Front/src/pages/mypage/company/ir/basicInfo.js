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
import NoResult from 'components/common/NoResult'
import {NextBtn, PrevBtn} from 'components/atomic/IconButton'

import ProfileImage from "pageComponents/mypage/common/ProfileImage";

import ROUTER_NAMES from 'modules/consts/RouterConst'
import {FormatUtils, StringUtils} from 'modules/utils/StringUtils'
import ResponseUtils from 'modules/utils/ResponseUtils'
import Api from 'modules/consts/Api'
import DateUtils from 'modules/utils/DateUtils'
import CommonConst from 'modules/consts/CommonConst'
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey} from "modules/utils/CommonUtils";
import {CodeContext} from "modules/contexts/common/CodeContext";
import {isNumber} from "modules/utils/NumberUtils";

const BasicInfo = (props) => {

    const galleryData = {
        title: '마이페이지',
        img: '/images/gallery02_img1.png'
    }

    const history = useHistory()
    const commonContext = useContext(CommonContext);
    const codeContext = useContext(CodeContext);

    const [progress, setProgress] = useState(0)
    const [vo, setVo] = useState({
        acpr: '',
        adr: '',
        bnnm: '',
        btnm: '',
        bzn: '',
        cgn: '',
        cnpl: '',
        col: '',
        cpfnAmt: null,
        empCnt: null,
        enprDsncCd: '',
        etvlAmt: null,
        hmpgUrlAdr: '',
        investList: [],
        invmMnyUsus: '',
        invmRtrvPlanCon: '',
        pvprAmt: null,
        rprnm: '',
        supportList: [],
        ttisStcnt: null,
        utlinsttId: '',
        zpcd: ''
    })

    // tab 목록
    const [tabList, setTabList] = useState({
        active: ROUTER_NAMES.MY_PAGE_IR_BASIC_INFO,
        list: CommonConst.IR_TAB_LIST
    })

    const [enprDsncCdList, setEnprDsncCdList] = useState([])

    const handleTabList = (id) => {
        history.replace(id)
    }

    const onClickPrev = () => {
    }

    const onClickNext = () => {
        // 다음 : 주요연혁
        history.replace(ROUTER_NAMES.MY_PAGE_IR_HISTORY)
    }

    const onClickModify = () => {
        const url = ROUTER_NAMES.MY_PAGE_IR_BASIC_INFO_WRITE + '?type=modify'
        history.replace(url)
    }

    const onClickCancel = () => {
        history.replace(ROUTER_NAMES.MY_PAGE_IR)
    }

    const loadProgress = async () => {
        const resProgress = await ResponseUtils.getSimpleResponse(Api.my.company.irProgress, null, false)
        return resProgress
    }

    const loadBasicInfo = async () => {
        const basicInfoObjectProperties = [
            'utlinsttId',
            'bnnm',
            'enprDsncCd',
            'bzn',
            'col',
            'rprnm',
            'empCnt',
            'btnm',
            'cgn',
            'cnpl',
            'hmpgUrlAdr',
            'adr',
            'zpcd',
            'cpfnAmt',
            'pvprAmt',
            'ttisStcnt',
            'acpr',
            'etvlAmt',
            'invmMnyUsus',
            'invmRtrvPlanCon'
        ]
        const basicInfoListProperties = ['investList', 'supportList']
        const resBasicInfo = await ResponseUtils.getMultiObjectMultiList(
            Api.my.company.irBasicInfoDetail,
            null,
            basicInfoObjectProperties,
            basicInfoListProperties,
            false
        )
        return resBasicInfo
    }

    const isMounted = useRef(false);
    const mountApiCntRef = useRef(0);

    useEffect(() => {
        if(commonContext.state.user.isLoaded && codeContext.state.isLoaded
            && !commonContext.state.user.isPageMountCheck && !isMounted.current) {

            isMounted.current = true;
            commonContext.actions.pageMountPathCheck(history, async () => {
                mountApiCntRef.current = 2;

                const companyTypeList = codeContext.actions.getCompanyTypeList();
                setEnprDsncCdList(companyTypeList)

                loadProgress().then(res => {
                    mountApiCntRef.current--;
                    setProgress(res.progress);
                }).catch(err => {
                    console.error(err);
                    mountApiCntRef.current--;
                });

                loadBasicInfo().then(res => {
                    mountApiCntRef.current--;
                    setVo(res);
                }).catch(err => {
                    console.error(err);
                    mountApiCntRef.current--;
                });
            }, mountApiCntRef);
        }
    }, [commonContext.state.user, codeContext.state.isLoaded]);

    useEffect(() => {
        return () => isMounted.current = false;
    }, []);

    return (
        <>
            <Header {...props} />
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
                                {/*보기화면일때 start*/}
                                <div className="btn_group">
                                    <Button className={'linear blue'} onClick={onClickCancel}>
                                        나가기
                                    </Button>
                                    <Button className={'blue'} onClick={onClickModify}>
                                        수정하기
                                    </Button>
                                </div>
                                {/*보기화면일때 end*/}
                            </div>
                            {/*ir_section_wrap start*/}
                            <div className="ir_section_wrap ">
                                <div className="ir_basic">
                                    <CardLayout>
                                        <h3 className="page_title">
                                            {/*<strong>회사명</strong>*/}
                                            <strong>{StringUtils.hasLength(commonContext.state.user.info?.name) ? commonContext.state.user.info.name : ""}</strong>
                                        </h3>
                                        {/*section01 start*/}
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
                                                    <td>{enprDsncCdList?.find(e => e.id === vo.enprDsncCd)?.value}</td>
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
                                                    <td>{isNumber(vo.empCnt) ? `${FormatUtils.numberWithCommas.format(vo.empCnt)} 명` : ''}</td>
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
                                                        {
                                                            String(vo.hmpgUrlAdr).trim() !== ''
                                                                ? <a href={vo.hmpgUrlAdr} target={'_blank'} rel="noopener noreferrer">{vo.hmpgUrlAdr}</a>
                                                                : ''
                                                        }
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>주소</th>
                                                    <td colSpan={3}>{vo.adr}</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        {/*section01 end*/}
                                        {/*section02 start*/}
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
                                                    <td>{isNumber(vo.cpfnAmt) && StringUtils.comma(vo.cpfnAmt)}</td>
                                                    <th>액면가&#40;원&#41;</th>
                                                    <td>{isNumber(vo.pvprAmt) && StringUtils.comma(vo.pvprAmt)}</td>
                                                </tr>
                                                <tr>
                                                    <th>총발행주식 수</th>
                                                    <td>{isNumber(vo.ttisStcnt) && StringUtils.comma(vo.ttisStcnt)}</td>
                                                    <th>결산기</th>
                                                    <td>{vo.acpr}</td>
                                                </tr>
                                                <tr>
                                                    <th>기업가치&#40;원&#41;</th>
                                                    <td colSpan={3}>{isNumber(vo.etvlAmt) && StringUtils.comma(vo.etvlAmt)}</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        {/*section02 end*/}
                                        {/*section03 start*/}
                                        <div className="section section03" style={{marginBottom: '0px'}}>
                                            {/*info_area start*/}
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
                                            {/*info_area end*/}
                                            {/*info_area start*/}
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
                                            {/*info_area end*/}
                                            {/*info_area start*/}
                                            <div className="info_area">
                                                <div className="info_header">
                                                    <h4 className="info_title">기존투자유치</h4>
                                                    <p className="sub_info">(단위 : 원)</p>
                                                </div>
                                                <div className="info_content h275">
                                                    <div className="list_box">
                                                        <ul className="info_list_header">
                                                            <div className="info_cell date">년월</div>
                                                            <div className="info_cell name">기업명</div>
                                                            <div className="info_cell price">금액</div>
                                                        </ul>
                                                        <ul className="info_list scroll">
                                                            {
                                                                vo?.investList?.length === 0
                                                                    ? <li className="no_result_wrap">
                                                                        <NoResult msg={'입력된 정보가 없습니다.'}/>
                                                                    </li>
                                                                    : vo.investList.map((item, i) => (
                                                                        <li className="info_row" key={createKey()}>
                                                                            <div className="info_cell date">{DateUtils.customDateFormat(item.invmEnmtYm, 'yyyy-MM')}</div>
                                                                            <div className="info_cell name">{item.invmEnmtEtnm}</div>
                                                                            <div className="info_cell price">{StringUtils.comma(item.invmEnmtAmt)}</div>
                                                                        </li>
                                                                    ))
                                                            }
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            {/*info_area end*/}
                                            {/*info_area start*/}
                                            <div className="info_area">
                                                <div className="info_header">
                                                    <h4 className="info_title">지원금(기보/신보/정부)</h4>
                                                    <p className="sub_info">(단위 : 원)</p>
                                                </div>
                                                <div className="info_content h275">
                                                    <div className="list_box">
                                                        <ul className="info_list_header">
                                                            <div className="info_cell date">년월</div>
                                                            <div className="info_cell name">기업명</div>
                                                            <div className="info_cell price">금액</div>
                                                        </ul>
                                                        <ul className="info_list scroll">{
                                                            vo?.supportList?.length === 0
                                                                ? <li className="no_result_wrap">
                                                                    <NoResult msg={'입력된 정보가 없습니다.'}/>
                                                                </li>
                                                                : vo.supportList.map((item, i) => (
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
                                            {/*info_area end*/}
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
export default BasicInfo
