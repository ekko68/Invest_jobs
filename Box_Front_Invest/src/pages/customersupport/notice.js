import React, {useEffect, useState, useRef, useContext} from 'react'
import {useHistory} from 'react-router-dom'

import Header from 'components/header/Header'
import Gallery01 from 'components/common/Gallery01'
import Footer from 'components/common/Footer'
import BreadCrumbs from 'components/common/BreadCrumbs'
import NoResult from 'components/common/NoResult'
import Button from 'components/atomic/Button'

import Paging from 'pageComponents/common/Paging'

import ResponseUtils from 'modules/utils/ResponseUtils'
import Api from 'modules/consts/Api'
import {getFunc, setFunc} from 'modules/utils/ReactUtils'
import {StringUtils} from 'modules/utils/StringUtils'
import DateUtils from 'modules/utils/DateUtils'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import QueryUtils from 'modules/utils/QueryUtils'
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey} from "modules/utils/CommonUtils";
import {CheckYn} from "modules/consts/BizConst";

const Notice = (props) => {
    const galleryData = {
        title: '공지사항',
        subInfo: '',
        img: '/images/gallery03_img1.png'
    }
    const history = useHistory()
    const [list, setList] = useState([])
    const pagingRef = useRef()
    const pageRef = useRef(1);
    const totalPageRef = useRef(1);
    const [total, setTotal] = useState(0)
    const inputRef = useRef()

    const commonContext = useContext(CommonContext);

    const onChangePage = (pageNumber) => {
        pageReload(pageNumber)
    }

    const onClickDetail = (item) => {
        const pagingInfo = getFunc(pagingRef, 'getPaging')
        const url =
            ROUTER_NAMES.CUSTOMER_SUPPORT_NOTICE_VIEW +
            '?pbnsId=' +
            item['pbnsId'] +
            '&page=' +
            pagingInfo.page +
            '&searchContent=' +
            inputRef.current.value
        history.push(url)
    }

    const onClickSearch = async () => {
        pageReload()
    }

    const pageReload = (pageNumber = 1) => {
        const url =
            ROUTER_NAMES.CUSTOMER_SUPPORT_NOTICE + '?page=' + pageNumber + '&searchContent=' + inputRef.current.value
        history.push(url)
    }

    const onKeyUpEnter = async (event) => {
        if (event.keyCode === 13) {
            pageReload()
        }
    }

    const loadNoticeList = async () => {
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
        const noticeListObject = await ResponseUtils.getSimpleResponse(Api.support.noticeList, params, false)
        if (noticeListObject) {
            pageRef.current = noticeListObject['page']
            totalPageRef.current = noticeListObject['totalPage']
            setTotal(noticeListObject['total'])
            setFunc(pagingRef, 'setPaging', noticeListObject)
            setList(noticeListObject['list'])
        }
    }

    const isMounted = useRef(false); // useEffect에서 mount 유무 동기확인을 위함

    useEffect(() => {
        if(commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
            isMounted.current = true;

            commonContext.actions.pageMountPathCheck(history, async () => {
                if (inputRef.current) inputRef.current.value = ''
                await loadNoticeList();
            });
        }
    }, [commonContext.state.user]);

    useEffect(() => {
        return () => {
            isMounted.current = false;
        }
    }, []);

    return (
        <>
            <Header page={'sub'} {...props} />
            <div className="page_container">
                {/*<div className="wrap cs_notice list bg02">*/}
                <div className="wrap cs_notice list">
                    <div className="gallery_logo_wrap">
                        <Gallery01 data={galleryData}/>
                    </div>
                    <BreadCrumbs {...props} />
                    <div className="container default_size02">
                        <div className="section section01">
                            <div className="section_header">
                                <h3 className={'title'}>공지사항</h3>
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
                                        <caption>공지사항 리스트 테이블</caption>
                                        <colgroup>
                                            <col width={'5%'}/>
                                            <col width={'*'}/>
                                            <col width={'5%'}/>
                                            <col width={'15%'}/>
                                        </colgroup>
                                        <thead>
                                        <tr>
                                            <th>NO</th>
                                            <th>제목</th>
                                            <th>첨부</th>
                                            <th>등록일</th>
                                        </tr>
                                        </thead>
                                        <tbody>{
                                            (list?.length > 0)
                                                ? list.map((item, i) => (
                                                    <tr key={createKey()} style={{cursor: 'pointer'}} onClick={() => onClickDetail(item)}>
                                                        <td className={'ta_center'}>{item['rvsRnum']}</td>
                                                        <td className={'cursor_pointer'}>{item.pbnsTtl}</td>
                                                        <td className="attachment">
                                                            {
                                                                item['fileYn'] === CheckYn.YES
                                                                    ? (
                                                                        <div className="attachment_img">
                                                                            <span className="hide">첨부파일</span>
                                                                        </div>
                                                                    )
                                                                    : <></>
                                                            }
                                                        </td>
                                                        <td className={'ta_center'}>{DateUtils.customDateFormat(item['rgsnTs'], 'yyyy-MM-dd')}</td>
                                                    </tr>
                                                ))
                                                : <tr>
                                                    <td colSpan={4}><NoResult msg={'등록된 공지사항이 없습니다.'} style={{marginTop: '40px', marginBottom: '40px'}}/></td>
                                                </tr>
                                        }</tbody>
                                    </table>
                                </div>
                                <div className={'search_form'}>
                                    <input ref={inputRef} type="text" title="공지사항검색" className={'input'} onKeyUp={(event) => onKeyUpEnter(event)}/>
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
        </>
    )
}
export default Notice
