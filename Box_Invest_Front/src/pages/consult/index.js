/** @jsxImportSource @emotion/react */
import React, {useContext, useEffect, useRef} from 'react'
import {useHistory} from 'react-router-dom'
import {consultMainStyle} from 'assets/style/ConsultStyle'
import {colors} from 'assets/style/style.config'

import Button from 'components/atomic/Button'
import Slider5 from 'components/common/slider/Slider5'
import Header from 'components/header/Header'
import Footer from 'components/common/Footer'

import ConfirmPopup from 'pageComponents/common/pop/ConfirmPopup'
import ConsultReqPop from 'pageComponents/consult/ConsultReqPop'
import AlertPopup from "pageComponents/common/pop/AlertPopup";
import CompleteConfirm from "pageComponents/consult/CompleteConfirm";
import WarningIconPopup from "pageComponents/common/pop/WarningIconPopup";

import ReactEvent from 'modules/utils/ReactEvent'
import Api from "modules/consts/Api";
import {exeFunc, setFunc} from 'modules/utils/ReactUtils'
import CommonAxios from "modules/utils/CommonAxios";
import {getPostConfig} from "modules/utils/CommonAxios";
import {AlertLabels, UsisType} from "modules/consts/BizConst";
import {StringUtils} from "modules/utils/StringUtils";
import {CommonContext} from "modules/contexts/common/CommomContext";

const Consult = (props) => {
    const confirmPop = useRef();
    const alertPop = useRef();
    const consultRegPop = useRef();
    const confirmIsCompanyPop = useRef();
    const completeConfirmPop = useRef();

    const history = useHistory();
    const commonContext = useContext(CommonContext);

    // 슬라이더배너 데이터
    const messageList = [
        {
            image: '/images/tmp/img_profile.png',
            content:
                "‘내가 누군데’하는 자세로 우습게 보면서 마지못해 컨설팅을 수락했다. " +
                "그래도 미덥지 않아서인지 공짜 컨설팅이 뭐가 있겠냐며 기업은행 컨설턴트들에게 이런저런 과제를 주며 시험했다. " +
                "그런데 컨설턴트들의 실력이 장난이 아니었다. 자기가 보지 못한 것들을 줄줄이 끄집어내는 게 아닌가.",
            name: 'A회장',
            company: '레미콘 회사 경영'
        },
    ]

    const onClickConfirmConsult = async () => {
        await commonContext.actions.callbackAfterSessionRefresh(async () => {
            if (StringUtils.hasLength(commonContext.state.user.info?.userAuth) && commonContext.state.user.info?.type === UsisType.COMPANY) exeFunc(consultRegPop, 'show');
            else exeFunc(confirmIsCompanyPop, 'open');
        }, true, true);
    }

    const onApplyConfirm = (param) => {
        exeFunc(confirmPop, 'openParams', '컨설팅을 의뢰하시겠습니까?', {...param});
    }

    const onConfirm = async (vo) => {
        await commonContext.actions.callbackAfterSessionRefresh(async () => {
            exeFunc(confirmPop, 'close');
            const res = await CommonAxios(getPostConfig(Api.consulting.consultingSave, vo), false);
            if (res && res.status === 200) {
                exeFunc(completeConfirmPop, 'open');
            } else {
                exeFunc(alertPop, 'open', AlertLabels.notSaved);
            }
            exeFunc(consultRegPop, 'hide');
        }, true, true);
    }

    const isMounted = useRef(false); // useEffect에서 mount 유무 동기확인을 위함

    useEffect(() => {
        if (commonContext.state.user.isLoaded
            && !commonContext.state.user.isPageMountCheck && !isMounted.current) {

            isMounted.current = true;
            commonContext.actions.pageMountPathCheck(history);
        }
    }, [commonContext.state.user]);

    useEffect(() => {
        ReactEvent.addEventListener('applyConfirm', onApplyConfirm)
        // ReactEvent.addEventListener('applyComplete', onApplyComplete)
        return () => {
            isMounted.current = false;
            ReactEvent.removeEventListener('applyConfirm')
            // ReactEvent.removeEventListener('applyComplete')
        }
    }, []);

    return (
        <div className="layout consult_wrap consult_main_wrap" css={consultMainStyle}>
            {/*<PopupConsultReq/>*/}
            <Header page={'type02'} {...props} />
            {/*page_container start*/}
            <div className="page_container">
                {/*wrap bg start*/}
                <div className="wrap bg">
                    {/*main start*/}
                    <div className="main">
                        {/*main_container start*/}
                        <div className="main_container">
                            <div className="container_inner">
                                {/*tit_wrap start*/}
                                <div className="tit_wrap">
                                    <div className="big_tit">
                                        <p>당신의 새로운 길</p>
                                        <p>IBK 투자BOX가 연결합니다.</p>
                                    </div>
                                    <p className="small_tit">
                                        IBK의 동반자 컨설팅이 기업 창업부터 퇴장까지 책임집니다.
                                    </p>
                                    <Button className="commission_btn" theme={colors.blue} onClick={onClickConfirmConsult}>
                                        컨설팅 의뢰하기
                                    </Button>
                                </div>
                                {/*tit_wrap end*/}
                                {/*card_wrap start*/}
                                <div className="card_wrap">
                                    <div className="card ico01">
                                        <p className="card_tit">성장 지원</p>
                                        <p className="card_cnt">
                                            창업기업을 대상으로 창업벤처지원단과 글로벌 엑셀러레이터가 경영진단 컨설팅과 1대1 멘토링 등 맞춤형 지원 프로그램을 지원합니다.
                                        </p>
                                    </div>
                                    <div className="card ico02">
                                        <p className="card_tit">재도약 지원</p>
                                        <p className="card_cnt">
                                            성장이 정체됐거나 위축된 기업을 대상으로 공장 자동화를 통해 스마트공장 구축을 지원하고 &#39;해외진출기업 컨설팅&#39;, &#39;창업절차 및 상권 분석 교육&#39;, &#39;기업구조개선 컨설팅&#39; 등을 제공합니다.
                                        </p>
                                    </div>
                                    <div className="card ico03">
                                        <p className="card_tit">선순환 지원</p>
                                        <p className="card_cnt">
                                            사업정리예정 기업을 대상으로 &#39;지속경영 컨설팅&#39;, &#39;핵심사업 평가 컨설팅&#39; 등을 통해 사업정리예정 기업이 성장 유망 비즈니스를 사장하지 않고 새로운 기업으로 재탄생하도록 돕습니다.
                                        </p>
                                    </div>
                                    <div className="card ico04">
                                        <p className="card_tit">최고의 컨설팅 제공</p>
                                        <p className="card_cnt">
                                            기업은행은 이미 2003년부터 지금까지 중소기업 대상으로 5200여건의 컨설팅을 제공했으며 매년 연평균 1000건 이상의 컨설팅을 수행 중입니다.
                                            변호사, 회계사, 세무사, 변리사, 노무사 등의 전문가로 구성된 70여명의 컨설팅 전담 인력이 최고의 서비스를 제공합니다.
                                        </p>
                                    </div>
                                </div>
                                {/*card_wrap end*/}
                            </div>
                        </div>
                        {/*main_container end*/}
                    </div>
                    {/*main end*/}

                    {/*sub_main start*/}
                    <div className="sub_main">
                        {/*container start*/}
                        <div className="sub_container">
                            <div className="txt_section">
                                <div className="txt_wrap">
                                    {/*<p className="txt01">title name</p>*/}
                                    <p className="txt02">
                                        새로운 희망 새로운 도전
                                        ‘IBK 희망컨설팅 프로젝트’
                                    </p>
                                    <p className="txt03">
                                        IBK컨설팅센터는 현재 새로운 도전을 수행 중입니다. 2015년부터 시작한 &#39;중소기업 희망컨설팅 프로젝트&#39;가 그것으로,
                                        이를 통해 매년 1,000개 기업씩 2017년까지 3년간 총 3,000개 기업에 무료로 컨설팅을 제공할 계획입니다.
                                        특히 기술형 창조기업에는 사업이 안착될 때까지 횟수에 관계 없이 무제한으로 컨설팅을 제공할 방침입니다.
                                        <br/><br/>
                                        동반성장을 위한 금융생태계 환경을 조성하는 IBK 컨설팅 서비스는 2016년 정부의 중소기업 비금융 지원의 핵심 정책으로도 지정된 바 있습니다.
                                    </p>
                                </div>
                                {/*슬라이드*/}
                                <Slider5 data={messageList}/>
                            </div>
                            <div className="img_section">
                                <img src="/images/tmp/img_consult_welcome.png" alt="consult_welcome"/>
                            </div>
                        </div>
                        {/*container end*/}
                    </div>
                    {/*sub_main end*/}
                    <Footer/>
                </div>
                {/*wrap bg end*/}
            </div>
            {/*page_container end*/}
            <ConsultReqPop ref={consultRegPop}/>
            <ConfirmPopup ref={confirmPop} onConfirm={onConfirm}/>
            <WarningIconPopup ref={confirmIsCompanyPop} message={'기업일 경우만 컨설팅 신청이 가능합니다.'}/>
            <AlertPopup ref={alertPop}/>
            <CompleteConfirm ref={completeConfirmPop}/>
        </div>
    )
}
export default Consult
