import React, {useContext, useEffect, useRef, useState} from "react";
import ResponseUtils from "modules/utils/ResponseUtils";
import Api from "modules/consts/Api";
import {setFunc} from "modules/utils/ReactUtils";

import Paging from "pageComponents/common/Paging";
import DateUtils from "modules/utils/DateUtils";
import NoResult from "components/common/NoResult";
import {StringUtils} from "modules/utils/StringUtils";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey} from "modules/utils/CommonUtils";

const KiprisDesignItem = (props) => {

    const {
        applicantNumber,
        isKiprisTabLoading
    } = props;
    const commonContext = useContext(CommonContext);

    const pageRef = useRef(1);
    const pagingRef = useRef();
    const isLoadingRef = useRef(true);

    const [designList, setDesignList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadKiprisDesignPage = async () => {
        isLoadingRef.current = true;
        setIsLoading(true);

        const params = {
            page: pageRef.current,
            record: 3,
            pageSize: 3,
            applicantNumber: applicantNumber
        }
        const res = await ResponseUtils.getSimpleResponse(Api.my.company.kiprisDesignList, params, false);
        isLoadingRef.current = false;

        if (res) {
            setDesignList(res?.list);
            pageRef.current = res['page'];
            setFunc(pagingRef, 'setPaging', res);
        }
    }

    const onClickPage = async (pageNumber) => {
        await commonContext.actions.callbackAfterSessionRefresh(async () => {
            pageRef.current = pageNumber;
            await loadKiprisDesignPage();
        }, true, true)
    }

    useEffect(() => {
        if(!isLoadingRef.current) setIsLoading(false);
    }, [designList]);

    useEffect(() => {
        commonContext.actions.callbackAfterSessionRefresh(loadKiprisDesignPage, false, false);
    }, []);

    return (
        <>
            <ul className="ipr_list ipr_patent">
                {
                    (isKiprisTabLoading || isLoading)
                        ? <NoResult msg={'데이터 로딩중입니다.'} style={{marginTop: "40px"}}/>

                        : (designList?.length > 0)
                            ? designList.map((item, index) => (
                                <div className="ipr_item type02" key={createKey()}>
                                    <div className="ipr_item_inner">
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
                                                <p className="ipr_content">{item['applicationCon']}</p>
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
                                </div>
                            ))
                            : <NoResult msg={'등록된 디자인 정보가 없습니다.'} style={{marginTop: "40px"}}/>
                }
            </ul>
            <div className="pagination_wrap">
                {/*<Pagination02 />*/}
                <Paging ref={pagingRef} onChangePage={onClickPage} onPrev={onClickPage} onNext={onClickPage} paginationClass={'pagination02'}/>
            </div>
        </>
    )
}

export default KiprisDesignItem;