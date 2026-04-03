import React, {useContext, useEffect, useRef, useState} from "react";
import {useHistory} from 'react-router-dom';

import Gallery01 from 'components/common/Gallery01'
import BreadCrumbs from 'components/common/BreadCrumbs'
import CardLayout from 'components/common/card/CardLayout'
import Footer from 'components/common/Footer'
import Header from 'components/header/Header'
import NoResult from "components/common/NoResult";

import Paging from "pageComponents/common/Paging";
import ProfileImage from "pageComponents/mypage/common/ProfileImage";

import ROUTER_NAMES from 'modules/consts/RouterConst'
import ResponseUtils from "modules/utils/ResponseUtils";
import Api from "modules/consts/Api";
import DateUtils from "modules/utils/DateUtils";

import {setFunc} from "modules/utils/ReactUtils";
import QueryUtils from "modules/utils/QueryUtils";
import {ConsultStatusCode} from "modules/consts/BizConst";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey} from "modules/utils/CommonUtils";

const Consult = (props) => {
    const history = useHistory()
    const galleryData = {
        title: '마이페이지',
        img: '/images/gallery02_img1.png'
    }

    const pageRef = useRef(1);
    const [total, setTotal] = useState(0);

    const pagingRef = useRef();

    const [list, setList] = useState([]);
    const commonContext = useContext(CommonContext);

    const onClickDetail = (item) => {
        const url = ROUTER_NAMES.MY_PAGE_CONSULT_DETAIL + '?page=' + pageRef.current + '&cnsgReqsId=' + item['cnsgReqsId'];
        history.push(url);
    }

    const onClickPage = async (pageNumber) => {
        await commonContext.actions.callbackAfterSessionRefresh(async () => {
            pageRef.current = pageNumber;
            await loadConsultingList();
        }, true, true);
    }

    const loadConsultingList = async () => {
        const params = {
            page: pageRef.current,
            record: 5,
            pageSize: 5
        };

        const consultPagingObject = await ResponseUtils.getSimpleResponse(Api.my.company.consultingList, params, false);
        if (consultPagingObject) {
            setTotal(consultPagingObject['total']);
            setList(consultPagingObject['list']);
            setFunc(pagingRef, 'setPaging', consultPagingObject);
        }
    }

    const isMounted = useRef(false);

    useEffect(() => {
        if(commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
            isMounted.current = true;

            commonContext.actions.pageMountPathCheck(history, async () => {
                const query = QueryUtils.getQuery(props);
                if (query && query.hasOwnProperty('page')) {
                    pageRef.current = parseInt(query['page']);
                }
                await loadConsultingList();
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
                <div className="wrap mypage_wrap mypage_consult bg02">
                    <div className="gallery_logo_wrap">
                        <Gallery01 data={galleryData}/>
                        <ProfileImage/>
                    </div>

                    <BreadCrumbs {...props} />

                    <div className="container default_size02">
                        {/*section start*/}
                        <div className="section section01">
                            <div className="section_header">컨설팅</div>
                            <div className="consult_list_wrap">
                                <div className="card_layout_wrap">
                                    <CardLayout>
                                        <div className="info_header">
                                            <h3 className="ico_title">컨설팅 리스트</h3>
                                            <div className="numbercase">
                                                <p className="text">
                                                    {/*전체 : <span>4</span>건*/}
                                                    전체 : <span>{total}</span>건
                                                </p>
                                            </div>
                                        </div>
                                        <div className="table_wrap">
                                            <table className="table">
                                                <caption>컨설팅 리스트 테이블</caption>
                                                <colgroup>
                                                    <col width={'5%'}/>
                                                    <col width={'60%'}/>
                                                    <col width={'10%'}/>
                                                    <col width={'15%'}/>
                                                    <col width={'10%'}/>
                                                </colgroup>
                                                <thead>
                                                <tr>
                                                    <th>NO</th>
                                                    <th>제목</th>
                                                    <th>타입</th>
                                                    <th>신청날짜</th>
                                                    <th>상태</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    list?.length > 0
                                                        ? list.map((item, i) => (
                                                            <tr key={createKey()} style={{cursor: 'pointer'}} onClick={() => onClickDetail(item)}>
                                                                <td>{item['rvsRnum']}</td>
                                                                <td className="content">
                                                                    <p>
                                                                        <a>{item['cnsgReqsTtl']}</a>
                                                                    </p>
                                                                </td>
                                                                <td>{item['cnsgPtrnNm']}</td>
                                                                <td className="date">
                                                                    <p>{DateUtils.convertYyyyMmDdNormalDate(item['rgsnTs'])}</p>
                                                                </td>
                                                                {
                                                                    (() => {
                                                                        /*승인 : approval / 대기 : wait / 완료 : 아무것도 안넣으셔도 됩니다. / 취소 : status_cancel*/
                                                                        let styleName = 'wait';
                                                                        if (item['cnsgSttsCd'] === ConsultStatusCode.COMPLETE) styleName = '';
                                                                        else if (item['cnsgSttsCd'] === ConsultStatusCode.CANCEL) styleName = 'status_cancel';

                                                                        return (
                                                                            <td>
                                                                                <p className={styleName}>{item['cnsgSttsNm']}</p>
                                                                            </td>
                                                                        )
                                                                    })()
                                                                }
                                                            </tr>
                                                        ))
                                                        : <tr><td colSpan={5}><NoResult msg={'등록된 컨설팅 신청정보가 없습니다.'}/></td></tr>
                                                }
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="pagination_wrap">
                                            {/*<Pagination01 />*/}
                                            <Paging ref={pagingRef} onChangePage={onClickPage} onPrev={onClickPage} onNext={onClickPage}/>
                                        </div>
                                    </CardLayout>
                                </div>
                            </div>
                        </div>
                        {/*section end*/}
                    </div>
                    <Footer/>
                </div>
            </div>
        </>
    )
}

export default Consult
