/** @jsxImportSource @emotion/react */
import React, {useEffect, useState, useRef, useContext} from 'react'
import {useHistory} from 'react-router-dom'

import Header from 'components/header/Header'
import Footer from 'components/common/Footer'
import Gallery01 from 'components/common/Gallery01'
import BreadCrumbs from 'components/common/BreadCrumbs'
import Button from 'components/atomic/Button'
import Select from 'components/atomic/Select'
import NoResult from "components/common/NoResult";

import EventCard from 'pageComponents/mypage/investor/event/EventCard'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import CheckCloseAlertPopup from 'pageComponents/common/pop/CheckCloseAlertPopup'
import ProfileImage from "pageComponents/mypage/common/ProfileImage";

import Api from 'modules/consts/Api'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import ResponseUtils from 'modules/utils/ResponseUtils'
import {exeFunc} from 'modules/utils/ReactUtils'
import CommonAxios from 'modules/utils/CommonAxios'
import {getPostConfig} from 'modules/utils/CommonAxios'
import {AlertLabels, CheckYn} from 'modules/consts/BizConst'
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey} from "modules/utils/CommonUtils";

const Exclusive = (props) => {
    const history = useHistory();
    const commonContext = useContext(CommonContext);

    const galleryData = {
        title: '마이페이지',
        img: '/images/gallery02_img1.png'
    }

    const alertPopRef = useRef()
    const checkCloseAlertPopupRef = useRef()
    const pageRef = useRef(0)
    const totalPageRef = useRef(0)

    const [list, setList] = useState([])
    const [selectOrderList, setSelectOrderList] = useState({
        selected: '',
        selList: [
            {id: '', value: '전체'},
            {id: CheckYn.YES, value: '진행중'},
            {id: CheckYn.NO, value: '종료'}
        ]
    })

    const handleSelectOrder = async (e) => {
        setSelectOrderList({
            ...selectOrderList,
            selected: e.target.value
        })
        pageRef.current = 0
        totalPageRef.current = 0
        setTimeout(async () => {
            await loadWebLinkList(e.target.value)
        }, 100)
    }

    const setData = (tempList, isMore = false) => {
        if (isMore === false) setList(tempList)
        else if (isMore) {
            const temp = list.concat(tempList)
            setList(temp)
        }
    }

    const onClickAdd = () => {
        history.push(ROUTER_NAMES.MY_PAGE_INVESTOR_EXCLUSIVE_WRITE)
    }

    const onClickMore = async () => {
        await commonContext.actions.callbackAfterSessionRefresh(async () => {
            const orderValue = selectOrderList.selected
            await loadWebLinkList(orderValue)
        }, true, true);
    }

    const onRemove = async (item) => {
        await webLinkDelete(item)
    }

    const webLinkDelete = async (item) => {
        const params = {
            id: item['invmCmpExusPageId']
        }
        let isDeleteComplete = true
        const deleteRes = await CommonAxios(getPostConfig(Api.my.vc.webLinkDelete, params), false)
        if (deleteRes && deleteRes.status === 200) {
            if (deleteRes.data.hasOwnProperty('code') && deleteRes.data.code !== '200') {
                isDeleteComplete = false;
            }
        } else {
            isDeleteComplete = false
        }
        if (isDeleteComplete) {
            exeFunc(checkCloseAlertPopupRef, 'open', AlertLabels.deleted) // '삭제 되었습니다'
            pageRef.current = 0
            totalPageRef.current = 1
            await loadWebLinkList()
        } else {
            exeFunc(alertPopRef, 'open', AlertLabels.notDeleted) // '삭제 중 오류가 발생 하였습니다. 관리자에게 문의하세요.'
        }
    }

    const loadWebLinkList = async (orderValue = '') => {
        const params = {
            page: pageRef.current + 1,
            record: 8,
            pageSize: 1,
            ongoingYn: orderValue
        }
        const resWebLinkListObject = await ResponseUtils.getObject(
            Api.my.vc.weblinkList,
            params,
            ['page', 'totalPage'],
            'list',
            false
        )
        if (resWebLinkListObject) {
            pageRef.current = resWebLinkListObject['page']
            totalPageRef.current = resWebLinkListObject['totalPage']
            const tempList = resWebLinkListObject['list']
            if (pageRef.current === 1) {
                setData(tempList)
            } else if (pageRef.current > 1) {
                setData(tempList, true)
            }
        }
    }

    const isMounted = useRef(false);

    useEffect(() => {
        if(commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
            isMounted.current = true;
            commonContext.actions.pageMountPathCheck(history, loadWebLinkList);
        }
    }, [commonContext.state.user]);

    useEffect(() => {
        return () => isMounted.current = false;
    }, []);

    return (
        <>
            <Header/>
            <div className="page_container">
                <div className="wrap wrap_no_overflow mypage_wrap for_investor_wrap list bg02">
                    <div className="gallery_logo_wrap">
                        <Gallery01 data={galleryData}/>
                        <ProfileImage/>
                    </div>

                    <BreadCrumbs {...props} />

                    <div className="container default_size02">
                        <div className="section section01">
                            <div className="section_header">
                                <h3 className="section_title"> 투자사 전용</h3>
                                <div className="section_right_wrap">
                                    <Select
                                        className={'type02'}
                                        title='진행상태'
                                        optList={selectOrderList.selList}
                                        selected={selectOrderList.selected}
                                        onChange={handleSelectOrder}
                                    />
                                    <div className="btn_group">
                                        <Button className={'blue'} onClick={onClickAdd}>
                                            추가하기
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div className="for_investor_list_wrap">
                                <ul className="for_investor_list">
                                    {
                                        list?.length > 0
                                            ? list.map((item, i) => (
                                                <li className="for_investor_item" key={createKey()}>
                                                    <EventCard data={item} onRemove={onRemove}/>
                                                </li>
                                            ))
                                            : <li><NoResult msg={'등록된 투자사 전용페이지 정보가 없습니다.'}/></li>
                                    }
                                </ul>
                            </div>
                            {
                                (totalPageRef.current > pageRef.current) &&
                                <div className="button_wrap">
                                    <Button className={'blue'} onClick={onClickMore}>
                                        더보기
                                    </Button>
                                </div>
                            }
                        </div>
                    </div>
                    <Footer/>
                </div>
            </div>
            <AlertPopup ref={alertPopRef}/>
            <CheckCloseAlertPopup ref={checkCloseAlertPopupRef} />
        </>
    )
}
export default Exclusive
