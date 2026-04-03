import React, { forwardRef, useContext, useImperativeHandle, useRef, useState } from 'react'
import Button from 'components/atomic/Button'
import CardLayout from 'components/common/card/CardLayout'
import NoResult from "components/common/NoResult";

import AlertPopup from 'pageComponents/common/pop/AlertPopup'

import ResponseUtils from 'modules/utils/ResponseUtils'
import Api from 'modules/consts/Api'
import { exeFunc } from 'modules/utils/ReactUtils'
import QueryUtils from 'modules/utils/QueryUtils'
import {StringUtils} from 'modules/utils/StringUtils'
import { CommonContext } from 'modules/contexts/common/CommomContext';
import {createKey} from "modules/utils/CommonUtils";

const InvestDetailMemberList = forwardRef((props, ref) => {

    const commonContext = useContext(CommonContext);

    const alertPopRef = useRef()
    const pageRef = useRef(0)
    const totalPageRef = useRef(1)

    const [list, setList] = useState([])

    useImperativeHandle(ref, () => ({
        setData,
        setPage
    }))

    const setData = (tempList, isMore = false) => {
        if (isMore === false) setList(tempList)
        else if (isMore) {
            const temp = list.concat(tempList)
            setList(temp)
        }
    }

    const setPage = (currentPage = 0, currentTotalPage = 1) => {
        pageRef.current = currentPage
        totalPageRef.current = currentTotalPage
    }

    const getMore = async (loading = true) => {
        if (pageRef.current >= totalPageRef.current) {
            exeFunc(alertPopRef, 'open', '더이상 데이타가 없습니다.');
            return
        }
        const query = QueryUtils.getQuery(props)
        if (query.hasOwnProperty('utlinsttId')) {
            const params = {
                page: pageRef.current + 1,
                record: 4,
                pageSize: totalPageRef.current,
                utlinsttId: query['utlinsttId']
            }
            const resMemberList = await ResponseUtils.getSimpleResponse(Api.vc.memberList, params, false);
            if (resMemberList) {
                pageRef.current = resMemberList['page']
                totalPageRef.current = resMemberList['totalPage']
                const list = resMemberList['list']
                if (pageRef.current === 1) {
                    setData(list)
                } else if (pageRef.current > 1) {
                    setData(list, true)
                }
            }
        }
    }

    return (
        <>
            <CardLayout>
                <h3 className="section_title bold">대표심사역</h3>
                <div className="judge_wrap">{
                    list?.length > 0
                        ? list.map((item, index) => (
                            <div className="judge" key={createKey()}>
                                <div className="img_wrap">
                                    {
                                        StringUtils.hasLength(item?.imgUrl)
                                            ? <img src={item.imgUrl} alt={item?.rprsCrofNm} />
                                            : <></>
                                    }
                                </div>
                                <div className="info">
                                    <p className="name">
                                        {item['rprsCrofNm']}
                                        <span>{item['rprsCrofJbcl']}</span>
                                    </p>
                                    <ul className="career_list scroll">{
                                        StringUtils.brToArray(item['crrCon'])?.map((arrItem, _index) => (
                                            <li className="career_item" key={createKey()}>
                                                {arrItem}
                                            </li>
                                        ))
                                    }</ul>
                                </div>
                            </div>
                        ))
                        : <NoResult msg={'등록된 대표심사역 정보가 없습니다.'} style={{ marginTop: '20px' }} />
                }</div>
                {
                    (totalPageRef.current > pageRef.current && list?.length > 0)
                        ? <div className="button_wrap">
                            <Button className={'blue'}
                                onClick={() => commonContext.actions.callbackAfterSessionRefresh(getMore, true, true)}>
                                더보기
                            </Button>
                        </div>
                        : <></>
                }
            </CardLayout>
            <AlertPopup ref={alertPopRef} />
        </>
    )
});

export default InvestDetailMemberList;
