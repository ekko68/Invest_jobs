import React, {forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState} from 'react'
import CardLayout from 'components/common/card/CardLayout'
import KiprisIpItem from "pageComponents/mypage/company/info/KiprisIpItem";
import KiprisTrademarkItem from "pageComponents/mypage/company/info/KiprisTrademarkItem";
import KiprisDesignItem from "pageComponents/mypage/company/info/KiprisDesignItem";
import ResponseUtils from "modules/utils/ResponseUtils";
import Api from "modules/consts/Api";
import {StringUtils} from "modules/utils/StringUtils";
import {createKey} from "modules/utils/CommonUtils";
import {CommonContext} from "modules/contexts/common/CommomContext";

const KiprisSection = (props) => {

    const commonContext = useContext(CommonContext);

    const applicantNumber = useRef('');

    const [isKiprisTabLoading, setIsKiprisTabLoading] = useState(true);

    const [tabList, setTabList] = useState({
        active: 'patent',
        list: [
            {id: 'patent', label: '특허/실용신안', cnt: 0},
            {id: 'trademark', label: '상표', cnt: 0},
            {id: 'design', label: '디자인', cnt: 0}
        ]
    })

    const handleTabList = (id) => {
        setTabList({
            ...tabList,
            active: id
        })
    }

    const setData = async () => {

        const tabTotalRes = await ResponseUtils.getSimpleResponse(Api.my.company.kiprisTabTotal, null, false);
        if (tabTotalRes) {
            const temp = [
                {
                    id: 'patent',
                    label: '특허/실용신안',
                    cnt: StringUtils.hasLength(tabTotalRes['ipTotalCnt']) ? tabTotalRes['ipTotalCnt'] : 0
                },
                {
                    id: 'trademark',
                    label: '상표',
                    cnt: StringUtils.hasLength(tabTotalRes['trademarkTotalCnt']) ? tabTotalRes['trademarkTotalCnt'] : 0
                },
                {
                    id: 'design',
                    label: '디자인',
                    cnt: StringUtils.hasLength(tabTotalRes['designTotalCnt']) ? tabTotalRes['designTotalCnt'] : 0
                }
            ]

            setTabList({
                ...tabList,
                list: temp
            })

            applicantNumber.current = StringUtils.hasLength(tabTotalRes['applicantNumber']) ? tabTotalRes['applicantNumber'] : '';
        }

        setIsKiprisTabLoading(false);
    }

    const kiprisTab = {
        patent: <KiprisIpItem applicantNumber={applicantNumber.current}
                              isKiprisTabLoading={isKiprisTabLoading} />,
        trademark: <KiprisTrademarkItem applicantNumber={applicantNumber.current}
                                        isKiprisTabLoading={isKiprisTabLoading} />,
        design: <KiprisDesignItem applicantNumber={applicantNumber.current}
                                  isKiprisTabLoading={isKiprisTabLoading} />
    }

    const isMounted = useRef(false);

    useEffect(() => {
        if(commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current){
            isMounted.current = true;
            setData();
        }
    }, [commonContext.state.user]);

    useEffect(() => {
        return () => isMounted.current = false;
    }, []);

    return (
        <div className="section section06">
            <div className="section_header">
                <h3 className="section_title">지적재산권</h3>
            </div>
            <CardLayout>
                <div className="ipr_wrap info_section">
                    <div className="tab_wrap">
                        {tabList.list.map((d, idx) => (
                            <button
                                className={`btn_tab ${tabList.active === d.id ? 'active' : ''}`}
                                key={createKey()}
                                onClick={() => {handleTabList(d.id)}}
                            >
                                <span className="label">{d.label}</span>
                                <span className={`${tabList.active === d.id ? 'blue badge' : 'badge'}`}>{d.cnt}</span>
                            </button>
                        ))}
                    </div>
                    <div className="ipr_list_wrap">
                        {kiprisTab[tabList.active]}
                    </div>
                </div>
            </CardLayout>
        </div>
    )
};

export default KiprisSection;
