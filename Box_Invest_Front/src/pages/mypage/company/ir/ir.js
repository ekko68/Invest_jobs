/** @jsxImportSource @emotion/react */
import React, {useContext, useEffect, useRef, useState} from 'react'
import {useHistory} from 'react-router-dom'

import {colors} from 'assets/style/style.config'

import Header from 'components/header/Header'
import Footer from 'components/common/Footer'
import Gallery01 from 'components/common/Gallery01'
import BreadCrumbs from 'components/common/BreadCrumbs'
import Button from 'components/atomic/Button'
import ProfileImage from "pageComponents/mypage/common/ProfileImage";

import ROUTER_NAMES from 'modules/consts/RouterConst'
import ResponseUtils from 'modules/utils/ResponseUtils'
import Api from 'modules/consts/Api'
import DateUtils from "modules/utils/DateUtils";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {StringUtils} from "modules/utils/StringUtils";

const Ir = (props) => {

    const [progress, setProgress] = useState(-1)
    const [lastModified, setLastModified] = useState("")

    const galleryData = {
        title: '마이페이지',
        img: '/images/gallery02_img1.png'
    }

    const history = useHistory();
    const commonContext = useContext(CommonContext);

    const loadProgress = async () => {
        const resProgress = await ResponseUtils.getSimpleResponse(Api.my.company.irProgress, null, false)
        return resProgress
    }

    const onClickIrView = () => {
        history.push(ROUTER_NAMES.MY_PAGE_IR_BASIC_INFO)
    }

    const onClickIrWrite = () => {
        history.push(ROUTER_NAMES.MY_PAGE_IR_BASIC_INFO_WRITE)
    }

    const isMounted = useRef(false);

    useEffect(() => {
        if(commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
            isMounted.current = true;

            commonContext.actions.pageMountPathCheck(history, async () => {
                const resProgress = await loadProgress();
                setProgress(resProgress.progress);
                setLastModified(resProgress.lastModifiedTimestamp);
            });
        }
    }, [commonContext.state.user]);

    useEffect(() => {
        return () => isMounted.current = false;
    }, []);

    return (
        <>
            <Header/>
            <div className="page_container">
                <div className={'wrap mypage_wrap ir_main_wrap bg02'}>
                    <div className="gallery_logo_wrap">
                        <Gallery01 data={galleryData}/>
                        <ProfileImage/>
                    </div>
                    <BreadCrumbs {...props} />
                    <div className="container default_size02">
                        {/*section start*/}
                        <div className="section section01">
                            <div className="section_header">
                                <h3 className="section_title"> IR 작성</h3>
                            </div>
                            {/*section start*/}
                            <div className="ir_section_wrap ">
                                {
                                    (progress < 0)
                                        ?   <></>
                                        :   (progress === 0)
                                            ?   (
                                                <div className="ir_apply_wrap status02">
                                                    <div className="ir_apply_inner">
                                                        <div className="ir_apply_cont">
                                                            <p className="title">현재 작성된 IR이 없습니다.</p>
                                                            <p className="info">온라인투자심사를 진행하기위해서는 최초 1회 작성이 필요합니다.</p>
                                                            <p className="btn_group">
                                                                <Button theme={colors.blue} onClick={onClickIrWrite}>
                                                                    IR 작성하기
                                                                </Button>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )

                                            :   (
                                                <div className="ir_apply_wrap status01">
                                                    <div className="ir_apply_inner">
                                                        <div className="ir_apply_cont">
                                                            <p className="title">
                                                                <strong>{commonContext.state.user.info?.name ? commonContext.state.user.info.name : ""}</strong> 온라인 투자심사
                                                            </p>
                                                            <p className="info">{(StringUtils.hasLength(lastModified)) ?
                                                                DateUtils.customDateFormat(lastModified, 'yyyy-MM-dd HH:mm:ss') : ""}</p>
                                                            <p className="btn_group">
                                                                <Button theme={colors.blue} onClick={onClickIrView}>
                                                                    자세히보기
                                                                </Button>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                }
                            </div>
                            {/*section end*/}
                        </div>
                        {/*section end*/}
                    </div>
                    <Footer/>
                </div>
            </div>
        </>
    )
}
export default Ir
