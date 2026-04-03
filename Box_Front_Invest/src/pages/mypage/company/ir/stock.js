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

import ProfileImage from "pageComponents/mypage/common/ProfileImage";

import ROUTER_NAMES from 'modules/consts/RouterConst'
import {StringUtils} from 'modules/utils/StringUtils'
import ResponseUtils from 'modules/utils/ResponseUtils'
import Api from 'modules/consts/Api'
import CommonConst from 'modules/consts/CommonConst'
import InformationTooltip from 'components/atomic/InformationTooltip'
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey} from "modules/utils/CommonUtils";
import NoResult from "components/common/NoResult";

const Stock = (props) => {

    const history = useHistory()
    const commonContext = useContext(CommonContext);

    const galleryData = {
        title: '마이페이지',
        img: '/images/gallery02_img1.png'
    }

    const [list, setList] = useState([]);
    const [progress, setProgress] = useState(0);

    const [tabList, setTabList] = useState({
        active: ROUTER_NAMES.MY_PAGE_IR_STOCK,
        list: CommonConst.IR_TAB_LIST
    });

    const handleTabList = (id) => {
        history.replace(id)
    }
    const onClickPrev = () => {
        // 이전 : 주요인력
        history.replace(ROUTER_NAMES.MY_PAGE_IR_WORKER)
    }
    const onClickNext = () => {
        // 다음 : 재무정보
        history.replace(ROUTER_NAMES.MY_PAGE_IR_FINANCE)
    }
    const onClickModify = () => {
        history.replace(ROUTER_NAMES.MY_PAGE_IR_STOCK_WRITE)
    }

    const getSummaryRender = () => {
        if (list.length === 0) return <></>
        else if (list.length > 0) {
            let prra = 0
            let pfstHoldCnt = 0
            let cmscHoldCnt = 0
            let pfstPvpr = 0
            let cmscPvpr = 0
            let pfstAmt = 0
            let cmscAmt = 0
            for (let i = 0; i < list.length; i++) {
                const item = list[i]
                prra += item.prra
                pfstHoldCnt += item.pfstHoldCnt
                cmscHoldCnt += item.cmscHoldCnt
                pfstAmt += item.pfstAmt
                cmscAmt += item.cmscAmt
                if (i === 0) {
                    pfstPvpr = item.pfstPvpr
                    cmscPvpr = item.cmscPvpr
                }
            }

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
        }
    }
    const onClickCancel = () => {
        history.replace(ROUTER_NAMES.MY_PAGE_IR)
    }

    const loadProgress = async () => {
        const resProgress = await ResponseUtils.getSimpleResponse(Api.my.company.irProgress)
        return resProgress
    }
    const loadStockholderList = async () => {
        const stockholderList = await ResponseUtils.getList(Api.my.company.irStockholdersList)
        return stockholderList
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
                loadStockholderList().then(res => {
                    mountApiCntRef.current--;
                    setList(res);
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
                                <div className="ir_stock">
                                    <CardLayout>
                                        {/*section01 start*/}
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
                                                            <tfoot>{getSummaryRender()}</tfoot>
                                                        </table>
                                                        <div className="notice_wrap">
                                                            <InformationTooltip notCloseBtn={true}>
                                                                <p className="text">
                                                                    본 지분율은 일반적인 산정방식인 우선주에 의결권이 없음을 전제로 한 것이며 따라서 해당 기업의
                                                                    정관에서 정한 사항에 따라 실제와 차이가 있을 수 있습니다.
                                                                </p>
                                                            </InformationTooltip>
                                                        </div>
                                                    </>

                                                    : <NoResult msg={'등록된 IR 주주 정보가 없습니다.'}
                                                                isIrView={true}/>
                                            }
                                        </div>
                                        {/*section01 end*/}
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
export default Stock
