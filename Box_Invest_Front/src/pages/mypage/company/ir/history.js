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
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey} from "modules/utils/CommonUtils";

const History = (props) => {

    const galleryData = {
        title: '마이페이지',
        img: '/images/gallery02_img1.png'
    }

    const history = useHistory()
    const commonContext = useContext(CommonContext);

    const [progress, setProgress] = useState(0)
    const [list, setList] = useState([])

    // tab 목록
    const [tabList, setTabList] = useState({
        active: ROUTER_NAMES.MY_PAGE_IR_HISTORY,
        list: CommonConst.IR_TAB_LIST
    });

    const handleTabList = (id) => {
        history.replace(id)
    }

    const onClickPrev = () => {
        // 이전 : IR 기본정보
        history.replace(ROUTER_NAMES.MY_PAGE_IR_BASIC_INFO)
    }

    const onClickNext = () => {
        // 다음 : 주요인력
        history.replace(ROUTER_NAMES.MY_PAGE_IR_WORKER)
    }

    const onClickCancel = () => {
        history.replace(ROUTER_NAMES.MY_PAGE_IR)
    }

    const onClickModify = () => {
        const url = ROUTER_NAMES.MY_PAGE_IR_HISTORY_WRITE + '?type=modify'
        history.replace(url)
    }

    const loadProgress = async () => {
        const resProgress = await ResponseUtils.getSimpleResponse(Api.my.company.irProgress, null, false);
        return resProgress
    }

    const loadHistoryList = async () => {
        const resHistoryList = await ResponseUtils.getList(Api.my.company.irHistoryGroupList, null);
        return resHistoryList
    }

    const isMounted = useRef(false);
    const mountApiCntRef = useRef(0);

    useEffect(() => {
        if(commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
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
                loadHistoryList().then(res => {
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
                                <div className="ir_history">
                                    <CardLayout>
                                        <div className="section section01">
                                            <h3 className="ico_title">연혁</h3>
                                            {
                                                (list?.length > 0)
                                                    ?   <div className="history_wrap">
                                                        {
                                                            list.map((listItem, i) => (
                                                                <div className="history_section" key={createKey()}>
                                                                    <p className="year">{listItem.year}</p>
                                                                    <ul className="history_list">
                                                                        {
                                                                            listItem.hasOwnProperty('historyList') && listItem.historyList?.map((item, j) =>
                                                                                <li className="history_item" key={createKey()}>
                                                                                    <p className="date">{DateUtils.customDateFormat(item.ordvYm, 'yyyy-MM')}</p>
                                                                                    <p className="content">{item.ordvCon}</p>
                                                                                </li>
                                                                            )
                                                                        }
                                                                    </ul>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                    :   <NoResult msg={'등록된 IR 연혁 정보가 없습니다.'}
                                                                  isIrView={true} />
                                            }
                                        </div>
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
export default History
