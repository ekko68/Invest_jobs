import React, {useEffect, useState, useRef, useContext} from 'react'
import {useHistory} from 'react-router-dom'

import Header from 'components/header/Header'
import Gallery01 from 'components/common/Gallery01'
import Footer from 'components/common/Footer'
import BreadCrumbs from 'components/common/BreadCrumbs'
import NoResult from 'components/common/NoResult'
import Button from 'components/atomic/Button'

import Paging from 'pageComponents/common/Paging'

import Api from 'modules/consts/Api'
import ResponseUtils from 'modules/utils/ResponseUtils'
import {exeFunc, getFunc, setFunc} from 'modules/utils/ReactUtils'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import QueryUtils from 'modules/utils/QueryUtils'
import DateUtils from 'modules/utils/DateUtils'
import AlertPopup from "pageComponents/common/pop/AlertPopup";
import {AlertLabels, QnaStatusCode} from "modules/consts/BizConst";
import {StringUtils} from "modules/utils/StringUtils";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey} from "modules/utils/CommonUtils";

const Qa = (props) => {
    const galleryData = {
        title: 'Q&A',
        subInfo: '',
        img: '/images/gallery03_img1.png'
    }

    const history = useHistory()
    const commonContext = useContext(CommonContext);

    const [list, setList] = useState([])

    const pagingRef = useRef()
    const pageRef = useRef(1);
    const totalPageRef = useRef(1);
    const [total, setTotal] = useState(0)
    const inputRef = useRef()
    const alertPopupRef = useRef();

    const onChangePage = async (pageNumber) => {
        pageReload(pageNumber)
    }

    const onClickDetail = (item) => {
        if (commonContext.state.user.info?.groupId !== item?.rgsrUsisId) {
            exeFunc(alertPopupRef, 'open', AlertLabels.isPrivate);
            return
        }

        // if (sessionStorage.getItem('token') !== null) {
        if (window.tokenCheck()) {
            const pagingInfo = getFunc(pagingRef, 'getPaging')
            const url =
                ROUTER_NAMES.CUSTOMER_SUPPORT_QA_VIEW +
                '?inqrSbjcId=' +
                item['inqrSbjcId'] +
                '&page=' +
                pagingInfo.page +
                '&searchContent=' +
                inputRef.current.value
            history.push(url)
        } else {
            exeFunc(alertPopupRef, 'open', AlertLabels.isPrivate);
        }
    }

    const onClickSearch = async () => {
        pageReload()
    }

    const pageReload = (pageNumber = 1) => {
        const url =
            ROUTER_NAMES.CUSTOMER_SUPPORT_QA + '?page=' + pageNumber + '&searchContent=' + inputRef.current.value
        history.push(url)
    }

    const onKeyUpEnter = async (event) => {
        if (event.keyCode === 13) {
            pageReload()
        }
    }

    const getPgstNm = (item) => {
        // 완료 : status_complete, 대기 : status_standBy, 취소 : status_cancel
        let styleName = 'status_standBy'
        if (item['pgstCd'] === QnaStatusCode.COMPLETE) styleName = 'status_complete'
        else if (item['pgstCd'] === QnaStatusCode.CANCEL) styleName = 'status_cancel'

        return <span className={styleName}>{item['pgstNm']}</span>
    }

    const onClickQaWrite = async () => {
        history.push(ROUTER_NAMES.CUSTOMER_SUPPORT_QA_WRITE)
    }

    const loadQaList = async () => {
        let searchContent = ''
        const query = QueryUtils.getQuery(props)
        if (query) {
            if (query.hasOwnProperty('page')) pageRef.current = parseInt(query.page)
            if (query.hasOwnProperty('searchContent')) searchContent = query.searchContent
        }
        inputRef.current.value = searchContent
        const params = {
            page: pageRef.current,
            record: 10,
            pageSize: 5,
            searchContent: searchContent
        }
        const qaListObject = await ResponseUtils.getSimpleResponse(Api.support.qaList, params, false);
        if (qaListObject) {
            pageRef.current = qaListObject['page']
            totalPageRef.current = qaListObject['totalPage']
            setTotal(qaListObject['total'])
            setFunc(pagingRef, 'setPaging', qaListObject)
            setList(qaListObject['list'])
        }
    }

    const isMounted = useRef(false); // useEffect에서 mount 유무 동기확인을 위함

    useEffect(() => {
        if (commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
            isMounted.current = true;

            commonContext.actions.pageMountPathCheck(history, async () => {
                if (inputRef.current) {
                    inputRef.current.value = ''
                }
                await loadQaList();
            });
        }
    }, [commonContext.state.user]);

    useEffect(() => {
        return () => isMounted.current = false
    }, []);

    return (
        <>
            <Header page={'sub'} {...props} />
            <div className="page_container">
                <div className="wrap cs_qna list">
                    <div className="gallery_logo_wrap">
                        <Gallery01 data={galleryData}/>
                    </div>
                    <BreadCrumbs {...props} />
                    <div className="container default_size02">
                        <div className="section section01">
                            <div className="section_header">
                                <h3 className={'title'}>Q&#38;A</h3>
                                {
                                    StringUtils.hasLength(commonContext.state.user.info?.userAuth) &&
                                    <div className="btn_group">
                                        <Button className={'blue linear'} onClick={onClickQaWrite}>
                                            문의하기
                                        </Button>
                                    </div>
                                }
                            </div>
                            <div className="card_layout_wrap">
                                <div className="info_header">
                                    <div className="numbercase ta_right">
                                        <p className="text">
                                            전체 : <span>{total}</span>건
                                        </p>
                                    </div>
                                </div>
                                <div className="table_wrap">
                                    <table className="table ">
                                        <caption>Q&#38;A 리스트 테이블</caption>
                                        <colgroup>
                                            <col width={'5%'}/>
                                            <col width={'*'}/>
                                            <col width={'10%'}/>
                                            <col width={'10%'}/>
                                            <col width={'15%'}/>
                                            <col width={'10%'}/>
                                        </colgroup>
                                        <thead>
                                        <tr>
                                            <th>NO</th>
                                            <th>제목</th>
                                            <th>작성자</th>
                                            <th>타입</th>
                                            <th>신청날짜</th>
                                            <th>상태</th>
                                        </tr>
                                        </thead>
                                        <tbody>{
                                            (list?.length > 0)
                                                ? list.map((item, index) => (
                                                    <tr key={createKey()} style={{cursor: 'pointer'}} onClick={() => onClickDetail(item)}>
                                                        <td className={'ta_center'}>{item['rvsRnum']}</td>
                                                        <td>
                                                            <p className="content ta_left cursor_pointer">{item['inqrSbjcTtl']}</p>
                                                        </td>
                                                        <td className={'ta_center'}>{item['rgsnUserNm']}</td>
                                                        <td className={'ta_center'}>{item['inqrDsncNm']}</td>
                                                        <td className={'ta_center'}>{DateUtils.convertYyyyMmDdNormalDate(item['rgsnTs'])}</td>
                                                        <td className={'ta_center'}>{getPgstNm(item)}</td>
                                                    </tr>
                                                ))
                                                : <tr>
                                                    <td colSpan={6}><NoResult msg={'등록된 Q&A가 없습니다.'} style={{marginTop: '40px', marginBottom: '40px'}}/></td>
                                                </tr>
                                        }</tbody>
                                    </table>
                                </div>
                                <div className={'search_form'}>
                                    <input ref={inputRef} type="text" title='Q&A검색' className={'input'} onKeyUp={(event) => onKeyUpEnter(event)}/>
                                    <Button className={'blue'} onClick={onClickSearch}>
                                        검색
                                    </Button>
                                </div>
                                <div className="pagination_wrap">
                                    <Paging ref={pagingRef} onChangePage={onChangePage} onPrev={onChangePage} onNext={onChangePage}/>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer/>
                </div>
            </div>
            <AlertPopup ref={alertPopupRef}/>
        </>
    )
}
export default Qa
