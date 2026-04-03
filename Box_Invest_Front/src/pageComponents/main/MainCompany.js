import React, {forwardRef, useContext, useEffect, useImperativeHandle, useLayoutEffect, useState, useRef} from 'react'

import Title from 'components/atomic/Title'
import Button from 'components/atomic/Button'
import {colors} from 'assets/style/style.config'

import ResponseUtils from 'modules/utils/ResponseUtils'
import Api from 'modules/consts/Api'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import {exeFunc} from 'modules/utils/ReactUtils'
import MainCompanyCard from 'pageComponents/main/maincompany/MainCompanyCard'
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey} from "modules/utils/CommonUtils";

const MainCompany = forwardRef((props, ref) => {

    const commonContext = useContext(CommonContext);

    const alertPopRef = useRef();
    const pageRef = useRef(0);
    const totalPageRef = useRef(1);

    const [list, setList] = useState([]);

    useImperativeHandle(ref, () => ({
        setData,
        setPage,
        setAllData
    }));

    const setPage = (currentPage = 0, currentTotalPage = 1) => {
        pageRef.current = currentPage
        totalPageRef.current = currentTotalPage
    }
    const setData = (tempList, isMore = false) => {
        if (isMore === false) setList(tempList)
        else if (isMore) {
            const temp = list.concat(tempList)
            setList(temp)
        }
    }
    const setAllData = (currentPage = 0, currentTotalPage = 1, tempList = []) => {
        pageRef.current = currentPage
        totalPageRef.current = currentTotalPage
        setList(tempList)
    }
    const getCompanyRecent = async (loading = true) => {
        if (pageRef.current >= totalPageRef.current) {
            exeFunc(alertPopRef, 'open', '더이상 데이타가 없습니다.');
            return
        }
        const params = {
            page: pageRef.current + 1,
            record: 8,
            pageSize: 1
        }
        const companyRecentObject = await ResponseUtils.getObject(
            Api.main.companyRecent,
            params,
            ['page', 'totalPage'],
            'list',
            true
        )
        if (companyRecentObject) {
            pageRef.current = companyRecentObject['page']
            totalPageRef.current = companyRecentObject['totalPage']
            const list = companyRecentObject['list']
            if (pageRef.current === 1) {
                setData(list)
            } else if (pageRef.current > 1) {
                setData(list, true)
            }
        }
    }

    return (
        <>
            <div className="section section02 default_size">
                <Title>기업</Title>
                <div className="corp_list">{
                    list?.map((item, i) => <MainCompanyCard key={createKey()} data={item}/>)
                }</div>
                <div className="btn_group">
                    {
                        (totalPageRef.current > pageRef.current) &&
                        <Button theme={colors.blue} onClick={() => commonContext.actions.callbackAfterOnlyLoginCheck(getCompanyRecent)}>
                            더보기
                        </Button>
                    }
                </div>
            </div>
            <AlertPopup ref={alertPopRef}/>
        </>
    )
})
export default MainCompany
