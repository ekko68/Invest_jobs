import React, {useContext, useEffect, useRef, useState} from 'react'
import {useHistory} from 'react-router-dom'

import Header from 'components/header/Header'
import Footer from 'components/common/Footer'
import Gallery01 from 'components/common/Gallery01'
import BreadCrumbs from 'components/common/BreadCrumbs'
import Button from 'components/atomic/Button'

import QueryUtils from 'modules/utils/QueryUtils'
import Api from 'modules/consts/Api'
import ResponseUtils from 'modules/utils/ResponseUtils'
import {StringUtils} from 'modules/utils/StringUtils'
import ROUTER_NAMES from 'modules/consts/RouterConst'

import {fileDownload} from 'modules/utils/CommonAxios'
import VoUtils from 'modules/utils/VoUtils'
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey} from "modules/utils/CommonUtils";

const NoticeView = (props) => {
    const galleryData = {
        title: '고객지원',
        img: '/images/gallery02_img1.png'
    }
    const history = useHistory()
    const [vo, setVo] = useState({
        amnnUserNm: '',
        attachFileList: [],
        pbnsCon: '',
        pbnsId: '',
        pbnsTtl: '',
        rgsnTs: '',
        rgsnUserNm: '',
        rvsRnum: ''
    })

    const commonContext = useContext(CommonContext);

    const loadNoticeDetail = async () => {
        const query = QueryUtils.getQuery(props)
        const url = Api.support.noticeDetail + '/' + query['pbnsId']
        const noticeDetailObject = ResponseUtils.getSimpleResponse(url, null, false)
        return noticeDetailObject
    }

    const onClickList = () => {
        let url = ROUTER_NAMES.CUSTOMER_SUPPORT_NOTICE
        const query = QueryUtils.getQuery(props)
        if (query) {
            if (query.hasOwnProperty('page')) {
                url += '?page=' + query['page']
                if (query.hasOwnProperty('searchContent')) url += '&searchContent=' + query.searchContent;
            }
        }
        history.push(url)
    };

    const isMounted = useRef(false); // useEffect에서 mount 유무 동기확인을 위함

    useEffect(() => {
        if(commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
            isMounted.current = true;

            commonContext.actions.pageMountPathCheck(history, async () => {
                const query = QueryUtils.getQuery(props)
                if (query) {
                    if (query.hasOwnProperty('pbnsId')) {
                        const noticeDetailObject = await loadNoticeDetail()
                        VoUtils.setVoNullToEmpty(noticeDetailObject, [], ['attachFileList'])
                        setVo(noticeDetailObject)
                    }
                }
            });
        }
    }, [commonContext.state.user]);

    useEffect(() => {
        return () => isMounted.current = false;
    }, []);

    return (
        <>
            <Header page={'sub'} {...props} />
            <div className="page_container">
                <div className="wrap cs_notice view">
                    <div className="gallery_logo_wrap">
                        <Gallery01 data={galleryData}/>
                    </div>
                    <BreadCrumbs {...props} />
                    <div className="container default_size02">
                        <div className="section section01">
                            <div className="section_header">
                                <h3 className="title">공지사항</h3>
                            </div>
                            <div className="card_layout_wrap">
                                <div className="table_wrap type02 border_none">
                                    {
                                        StringUtils.hasLength(vo?.pbnsId) &&
                                        <table className="table  ">
                                            <caption>공지사항 상세 테이블</caption>
                                            <colgroup>
                                                <col width={'100%'}/>
                                            </colgroup>
                                            <thead>
                                            <tr>
                                                <th style={{padding: '25px'}}>
                                                    <h3 className={'title'}>{vo.pbnsTtl}</h3>
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr>
                                                <td>
                                                    <div
                                                        className="view_content"
                                                        style={{minHeight: "400px"}}
                                                        dangerouslySetInnerHTML={{__html: StringUtils.toBr(vo.pbnsCon)}}
                                                    ></div>
                                                </td>
                                            </tr>
                                            {/*attach_wrap start*/}
                                            {
                                                vo?.attachFileList?.length > 0 &&
                                                <tr>
                                                    <td>
                                                        <div className="attach_wrap">
                                                            <div className="attach_content" style={{
                                                                paddingLeft: '20px',
                                                                paddingRight: '20px',
                                                                paddingTop: '10px',
                                                                paddingBottom: '10px'
                                                            }}>
                                                                <div className="title">첨부</div>
                                                                <div className="file_list">{
                                                                    vo.attachFileList.map((item, index) => (
                                                                        <div className="file_item" key={createKey()}
                                                                             style={{cursor: 'pointer'}}
                                                                             onClick={() => commonContext.actions.callbackAfterSessionRefresh(() => fileDownload(item), true, true)}>
                                                                            <div className="text cursor_pointer">{item['fileNm']}</div>
                                                                        </div>
                                                                    ))
                                                                }</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            }
                                            </tbody>
                                        </table>
                                    }
                                </div>
                                <div className={'btn_group'}>
                                    <Button className={'blue'} onClick={onClickList}>
                                        목록으로
                                    </Button>
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
export default NoticeView
