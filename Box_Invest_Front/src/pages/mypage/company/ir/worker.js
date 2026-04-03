/** @jsxImportSource @emotion/react */
import React, {useContext, useEffect, useRef, useState} from 'react'
import {useHistory} from 'react-router-dom'

import {cardItem06Style} from 'assets/style/ComponentStyle'
import Header from 'components/header/Header'
import Footer from 'components/common/Footer'
import Gallery01 from 'components/common/Gallery01'
import BreadCrumbs from 'components/common/BreadCrumbs'
import Tab from 'components/common/Tab'
import Button from 'components/atomic/Button'
import NoResult from "components/common/NoResult";
import {NextBtn, PrevBtn} from 'components/atomic/IconButton'
import ProfileImage from "pageComponents/mypage/common/ProfileImage";

import ROUTER_NAMES from 'modules/consts/RouterConst'
import ResponseUtils from 'modules/utils/ResponseUtils'
import Api from 'modules/consts/Api'
import CommonConst from 'modules/consts/CommonConst'
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey} from "modules/utils/CommonUtils";

const Worker = (props) => {

    const history = useHistory()
    const commonContext = useContext(CommonContext);

    const galleryData = {
        title: '마이페이지',
        img: '/images/gallery02_img1.png'
    }

    const [list, setList] = useState([])
    const [progress, setProgress] = useState(0)
    const [tabList, setTabList] = useState({
        active: ROUTER_NAMES.MY_PAGE_IR_WORKER,
        list: CommonConst.IR_TAB_LIST
    })

    const handleTabList = (id) => {
        history.replace(id)
    }

    const onClickPrev = () => {
        // 이전 : 주요연혁
        history.replace(ROUTER_NAMES.MY_PAGE_IR_HISTORY)
    }

    const onClickNext = () => {
        // 다음 : 주주현황
        history.replace(ROUTER_NAMES.MY_PAGE_IR_STOCK)
    }

    const onClickModify = () => {
        const url = ROUTER_NAMES.MY_PAGE_IR_WORKER_WRITE + '?type=modify'
        history.replace(url)
    }

    const onClickCancel = () => {
        history.replace(ROUTER_NAMES.MY_PAGE_IR)
    }

    const loadProgress = async () => {
        const resProgress = await ResponseUtils.getSimpleResponse(Api.my.company.irProgress)
        return resProgress
    }

    const loadWorkerList = async () => {
        const resWorkerList = await ResponseUtils.getList(Api.my.company.irMemberList)
        return resWorkerList
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

                loadWorkerList().then(res => {
                    mountApiCntRef.current--;
                    setList(res);
                }).catch(err => {
                    console.error(err);
                    mountApiCntRef.current--;
                });
            }, mountApiCntRef);
        }
    }, [commonContext.state.user])

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
                                <div className="ir_worker">
                                    <div className="section section01">
                                        <ul className="worker_list">
                                            {
                                                (list?.length > 0)
                                                    ? list.map((item, i) => (
                                                        <li className="worker_item" key={createKey()}>
                                                            <div className={'carditem06'} css={cardItem06Style}>
                                                                <div className="img_wrap img_cover">
                                                                    {item.imgUrl ? <img src={item.imgUrl} alt=""/> :
                                                                        <img src={'/images/img_person.png'} alt=""/>}
                                                                </div>
                                                                <div className="content">
                                                                    <div className="content_inner scroll_lightgrey">
                                                                        <p className="position">{item.tmmbJbcl}</p>
                                                                        <p className="name">{item.tmmbNm}</p>
                                                                        <p className="info">{item.crrCon}</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))
                                                    : <NoResult msg={'등록된 IR 인력 정보가 없습니다.'}
                                                                style={{marginTop: '40px', marginBottom: '40px'}} />
                                            }
                                        </ul>
                                    </div>
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
export default Worker
