import React, {useContext} from 'react';
import CardLayout from "components/common/card/CardLayout";
import BoxUrl from "modules/consts/BoxUrl";
import {RequestStatusCodeLabels, UsisType} from "modules/consts/BizConst";
import {StringUtils} from "modules/utils/StringUtils";
import {CommonContext} from "modules/contexts/common/CommomContext";

const RequestDetailUsisBox = (props) => {

    const {
        requestVo,
        progressList
    } = props;

    const commonContext = useContext(CommonContext);

    const gotoCmpLink = (usisId, cmpFlg) => {
        // 기업인 경우
        if(cmpFlg) window.open(BoxUrl.REACT_APP_URL[String(process.env.REACT_APP_PROFILE)] + '/company/detail?utlinsttId=' + usisId)
        // 투자사인경우
        else window.open(BoxUrl.REACT_APP_URL[String(process.env.REACT_APP_PROFILE)] + '/invest/detail?utlinsttId=' + usisId)
    }

    const getLogoImage = (imgUrl) => {
        if(StringUtils.hasLength(imgUrl)) return <img src={imgUrl} alt="이용기관 로고"/>
        else return <img src={require('assets/images/no_img.jpg').default} alt="이미지없음"/>
    }

    return (
        <div className="section section01">
            {
                (() => {
                    if(!(progressList?.length > 0)) return <></>;

                    let topSectionData = {};
                    let bottomSectionData = {};

                    const getSectionData = (isCmp = true) => {
                        const sectionData = {
                            layoutType: '',
                            title: '',

                            usisId: '',
                            usisNm: '',
                            usisType: '',
                            logoUrl: '',

                            cmpFlg: false,
                        }

                        sectionData.layoutType = isCmp ? 'dark' : '';
                        sectionData.usisId = isCmp ? requestVo.rqstEnprId : requestVo.invmCmpId;
                        sectionData.usisNm = isCmp ? requestVo.rqstBplcNm : requestVo.invmCmpBplcNm;
                        sectionData.usisType = isCmp ? requestVo.enprDsncClsfNm : requestVo.invmCmpPtrnNm;
                        sectionData.logoUrl = isCmp ? requestVo.enprLogoImageUrl : requestVo.invmLogoImageUrl;

                        sectionData.cmpFlg = isCmp;
                        return sectionData;
                    }

                    if(progressList[0].invmExntPgsgCd === RequestStatusCodeLabels.SUGGEST) {
                        topSectionData = getSectionData(false);
                        bottomSectionData = getSectionData(true);

                        topSectionData.title = commonContext.state.user.info?.type === UsisType.COMPANY
                            ? '받은 제안' : '보낸 제안';
                    }
                    else if(progressList[0].invmExntPgsgCd === RequestStatusCodeLabels.REQUEST) {
                        topSectionData = getSectionData(true);
                        bottomSectionData = getSectionData(false);

                        topSectionData.title = commonContext.state.user.info?.type === UsisType.COMPANY
                            ? '보낸 요청' : '받은 요청';
                    }
                    else return <></>

                    // todo : css 확인
                    // -> 색상도 기업일 경우 dark로 맞추려 했으나 해당 cardlayout이 반대로 적용될 경우,
                    // 글자색 등이 변경이 되지 않으므로 필요하면 css의 수정이 필요할 듯

                    return (
                        <>
                            <div className="card_section">
                                {/*<CardLayout type={topSectionData.layoutType}>*/}
                                <CardLayout type={''}>
                                    <div className="request_group">
                                        <div className="send">
                                            <div className="content_title">{topSectionData.title}</div>
                                            <div className="request_company">
                                                <div className="img" style={{cursor: 'pointer'}}
                                                     onClick={() => gotoCmpLink(topSectionData.usisId, topSectionData.cmpFlg)}>
                                                    {getLogoImage(topSectionData.logoUrl)}</div>
                                                <div className="info">
                                                    <p className="name">{topSectionData.cmpFlg ? '투자 희망 기업' : '투자기관'}</p>
                                                    <p className="title" style={{cursor: 'pointer'}}
                                                       onClick={() => gotoCmpLink(topSectionData.usisId, topSectionData.cmpFlg)}>
                                                        {topSectionData.usisNm}</p>
                                                    <span className="type">{topSectionData.usisType}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardLayout>
                            </div>
                            <div className="card_section">
                                {/*<CardLayout type={bottomSectionData.layoutType}>*/}
                                <CardLayout type={'dark'}>
                                    <div className="request_group">
                                        <div className="receive">
                                            <div className="img" style={{cursor: 'pointer'}}
                                                 onClick={() => gotoCmpLink(bottomSectionData.usisId, bottomSectionData.cmpFlg)}>
                                                {getLogoImage(bottomSectionData.logoUrl)}</div>
                                            <div className="info">
                                                <p className="name white">{bottomSectionData.cmpFlg ? '투자 희망 기업' : '투자기관'}</p>
                                                <p className="title white" style={{cursor: 'pointer'}}
                                                   onClick={() => gotoCmpLink(bottomSectionData.usisId, bottomSectionData.cmpFlg)}>
                                                    {bottomSectionData.usisNm}</p>
                                                <span className="type white">{bottomSectionData.usisType}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardLayout>
                            </div>
                        </>
                    )
                })()
            }
        </div>
    )
}

export default RequestDetailUsisBox;