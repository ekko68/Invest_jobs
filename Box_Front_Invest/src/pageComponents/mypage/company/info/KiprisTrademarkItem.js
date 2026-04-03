import React, {useContext, useEffect, useRef, useState} from "react";
import {useHistory} from 'react-router-dom';

import ResponseUtils from "modules/utils/ResponseUtils";
import Api from "modules/consts/Api";
import {setFunc} from "modules/utils/ReactUtils";

import Paging from "pageComponents/common/Paging";
import DateUtils from "modules/utils/DateUtils";
import {StringUtils} from "modules/utils/StringUtils";
import NoResult from "components/common/NoResult";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey} from "modules/utils/CommonUtils";

const KiprisTrademarkItem = (props) => {

    const {
        applicantNumber,
        isKiprisTabLoading
    } = props;
    const commonContext = useContext(CommonContext);

    const pageRef = useRef(1);
    const pagingRef = useRef();
    const isLoadingRef = useRef(true);

    const [tmList, setTmList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadKiprisTrademarkPage = async () => {
        isLoadingRef.current = true;
        setIsLoading(true);

        const params = {
            page: pageRef.current,
            record: 3,
            pageSize: 3,
            applicantNumber: applicantNumber
        }
        const res = await ResponseUtils.getSimpleResponse(Api.my.company.kiprisTrademarkList, params, false);
        isLoadingRef.current = false;

        if (res) {
            setTmList(res?.list);
            pageRef.current = res['page'];
            setFunc(pagingRef, 'setPaging', res);
        }
    }

    const onClickPage = async (pageNumber) => {
        await commonContext.actions.callbackAfterSessionRefresh(async () => {
            pageRef.current = pageNumber;
            await loadKiprisTrademarkPage();
        }, true, true)
    }

    useEffect(() => {
        if(!isLoadingRef.current) setIsLoading(false);
    }, [tmList]);

    useEffect(() => {
        commonContext.actions.callbackAfterSessionRefresh(loadKiprisTrademarkPage, false, false);
    }, []);

    return (
        <>
            <ul className="ipr_list ipr_patent">
                {
                    (isKiprisTabLoading || isLoading)
                        ? <NoResult msg={'데이터 로딩중입니다.'} style={{marginTop: "40px"}}/>

                        : (tmList?.length > 0)
                            ? tmList.map((item, index) => (
                                <div className="ipr_item type02" key={createKey()}>
                                    <div className="ipr_item_inner">
                                        {/*{getImageRender(item)}*/}
                                        {
                                            StringUtils.hasLength(item?.smImgUrl)
                                                ? <div className="img_wrap">
                                                    <img src={item.smImgUrl} alt={item.smImgUrl}/>
                                                </div>
                                                : <div className="img_wrap">
                                                    <img src={'images/tmp/invest_list_card_no_image.png'} alt=""/>
                                                </div>
                                        }
                                        <div className="container_wrap">
                                            <div className="content_wrap">
                                                <h4 className="ipr_name">{item['inventionName']}</h4>
                                            </div>
                                            <div className="info_wrap">
                                                <ul className="ipr_info_list">
                                                    <li className="ipr_info_item">
                                                        <span className="dl">출원번호</span>
                                                        <span className="dd">{item['applicationNumber']}</span>
                                                    </li>
                                                    <li className="ipr_info_item">
                                                        <span className="dl">출원일자</span>
                                                        <span className="dd">{DateUtils.customDateFormat(item['applicationDate'], 'yyyy년 MM월 dd일')}</span>
                                                    </li>
                                                    <li className="ipr_info_item">
                                                        <span className="dl">등록번호</span>
                                                        <span className="dd">{item['registrationNumber']}</span>
                                                    </li>
                                                    <li className="ipr_info_item">
                                                        <span className="dl">등록일자</span>
                                                        <span className="dd">{DateUtils.customDateFormat(item['registrationDate'], 'yyyy년 MM월 dd일')}</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>))
                            : <NoResult msg={'등록된 상표 정보가 없습니다.'} style={{marginTop: "40px"}}/>
                }
            </ul>
            <div className="pagination_wrap">
                <Paging ref={pagingRef} onChangePage={onClickPage} onPrev={onClickPage} onNext={onClickPage} paginationClass={'pagination02'}/>
            </div>
        </>
    )
}

export default KiprisTrademarkItem;