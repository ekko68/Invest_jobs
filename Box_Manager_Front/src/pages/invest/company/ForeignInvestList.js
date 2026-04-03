import React, {useContext, useEffect, useLayoutEffect, useState} from 'react';
import {useLocation} from "react-router-dom";

import PopupAlert from "components/PopupAlert";
import SearchForm from "components/SearchForm";
import NoResult from "components/NoResult";
import Pagination from "components/Pagination";
import PageLayout from "components/PageLayout";

import {UserContext} from "modules/common/UserContext";
import {loader} from "modules/utils/CommonAxios";
import {getCompanyList} from "modules/consts/InvestApi";
import {NoImage02} from "modules/consts/Img";
import {createKey, deepCopyByRecursion} from "modules/fns/commonFn";

const ForeignInvestList = (props) => {

    const location = useLocation();
    let path = location.pathname;
    let category = path.split('/')[2];
    const userContext = useContext(UserContext);

    const SEL_FILTER = {
        OSIV_HOPE: 'osivHope'
    };

    // ===== search list state
    const [list, setList] = useState(null);
    const [paging, setPaging] = useState(null);

    const [searchInput, setSearchInput] = useState('');
    const [searchSelList, setSearchSelList] = useState({
        active: SEL_FILTER.OSIV_HOPE,
        list: [
            { id: SEL_FILTER.OSIV_HOPE, value: SEL_FILTER.OSIV_HOPE, label: '해외투자희망' },
        ]
    });

    const [alert, setAlert] = useState({
        status: false,
        msg: ''
    });

    // =====

    const getList = async (pageParam) => {
        loader(true, 'Uploading...')
        let param = {
            page: 1,
            osivHopeyn: 'Y'
        }

        param = {...param, ...pageParam};

        const res = await getCompanyList({ ...param, record: 12 })
        if (res.status === 200) {
            const data = res.data.data
            setList(data.list?.map(item => { return {...item, key: createKey()} }))

            setPaging({
                endPage: data.endPage,
                next: data.next,
                page: data.page,
                prev: data.prev,
                record: data.record,
                startPage: data.startPage,
                total: data.total,
                totalPage: data.totalPage
            });
        }
    };

    // ===== search
    const onSelectActive = (selected) => {
        const _searchSelList = deepCopyByRecursion(searchSelList);
        _searchSelList.active = selected;

        setSearchSelList(_searchSelList);
    };

    const handleSearch = async () => {
        const params ={
            bplcNm: searchInput,
            page: 1
        };
        await getList(params)
    }

    const handlePaging = async (param) => {
        await getList(param)
    }

    const handleReset = async (afterAlert) => {
        await getList({ page: 1 })
        onSelectActive(SEL_FILTER.OSIV_HOPE);
        setSearchInput('')
    }

    // useEffect

    // useEffect(() => {
    //     handleSearch();
    // }, [searchSelList.active]);

    useEffect(() => {
        getList();
    }, []);

    useLayoutEffect(() => {
        if (category !== userContext.state.category) {
            userContext.actions.setCategory(category)
        }
    }, [userContext.state.category]);

    return (
        <PageLayout currentMenu={'invest'} currentCate={'investCompany'} currentPage={'investCompanyForeignList'}>
            {alert.status && <PopupAlert msg={alert.msg} handlePopup={() => setAlert({ status: false, msg: '' })} />}
            <div className="content_inner page_recommend">
                <h4 className="page_title">해외투자희망기업</h4>
                <div className="header_search">
                    <SearchForm
                        // selectNone={true}
                        selectList={searchSelList}
                        searchInput={searchInput}
                        setSearchInput={setSearchInput}
                        onSelectActive={onSelectActive}
                        handleSearch={handleSearch}
                        placeholder="회사명을 입력하세요."
                    />
                </div>
                {/*section_header start*/}
                {/*<div className="section_header" style={{justifyContent: 'space-between'}}>*/}
                <div className="section_header">
                    {/*<p className="section_title">해외투자희망기업 리스트</p>*/}
                    <div className="button_group">
                        <button className={'btn_refresh'} title={'새로고침'} onClick={handleReset}>
                            <span className="hide">새로고침</span>
                        </button>
                    </div>
                </div>
                {!list || list.length <= 0 ? (
                    <div className="table_no_result">
                        <NoResult style={{ border: 'none' }} />
                    </div>
                ) : (
                    <ul className="recommend_list">
                        {list.map((item, idx) => {
                            return (
                                <li className="recommend_item" key={'item_item' + idx}>
                                    <div className="recommend_item_inner">
                                        {item.rcmdEnprStupYn === 'Y' && <div className="badge_wrap">추천기업</div>}
                                        <div className="img_wrap">
                                            <img src={item.logoImageUrl ? item.logoImageUrl : NoImage02} alt="logo" />
                                        </div>
                                        <div className="text_info">
                                            <div className="etc">
                                                <span className="title line">{item.bsunDwarNm ? item.bsunDwarNm : '-'}</span>
                                                <span className="title">{item.yearCnt}년</span>
                                            </div>
                                            <div className="com_name">{item.bplcNm}</div>
                                            <div className="team">{item.btnm}</div>
                                            <div className="text">{item.enprInrdCon}</div>
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                )}
                <div className={'paging_wrap'}>{paging && <Pagination pagingData={paging} handlePaging={handlePaging} />}</div>
            </div>
        </PageLayout>
    )
}

export default ForeignInvestList;