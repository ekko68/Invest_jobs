/** @jsxImportSource @emotion/react */
import React, {useState, useContext, useEffect, useRef} from 'react'
import {useHistory} from 'react-router-dom'

import {colors} from 'assets/style/style.config'
import {InvestListStyle} from 'assets/style/InvestStyle'

import SearchArea from 'pageComponents/invest/main/SearchArea'
import InvestListCard from 'pageComponents/invest/main/InvestListCard'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'

import Button from 'components/atomic/Button'
import Header from "components/header/Header";
import Gallery01 from "components/common/Gallery01";
import Footer from "components/common/Footer";
import BreadCrumbs from "components/common/BreadCrumbs";
import NoResult from "components/common/NoResult";

import {exeFunc, getFunc, setPromiseFunc} from 'modules/utils/ReactUtils'
import ReactEvent from 'modules/utils/ReactEvent'
import ResponseUtils from 'modules/utils/ResponseUtils'
import Api from 'modules/consts/Api'
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey, deepCopyByRecursion} from "modules/utils/CommonUtils";

const Invest = (props) => {

    const galleryData = {
        title: '투자기관',
        subInfo: '',
        img: '/images/gallery01_img1.png'
    }

    const history = useHistory()
    const commonContext = useContext(CommonContext);

    const alertPopRef = useRef()
    const searchWrap = useRef()
    const searchAreaRef = useRef()
    const keywordRef = useRef()

    const pageRef = useRef(0);
    const totalPageRef = useRef(0);

    // useEffect에서 mount 체크를 즉각적으로 하는 것이 아닌 mount 이후 상황에 따른 리랜더링이 필요하므로 state처리
    const [mountChk, setMountChk] = useState(false);
    const [list, setList] = useState([]);

    const searchParamRef = useRef({
        bplcNm: '',
        categoryList: [],
        techList: [],
        investStepList: [],
        regionList: []
    });

    const loadInvestList = async (isSearch = false) => {
        const searchParam = searchParamRef.current;

        const params = {
            page: pageRef.current + 1,
            record: 8,
            pageSize: 1,

            bplcNm: searchParam['bplcNm'],
            invmFildCdList: `${searchParam['categoryList']}`,
            utlzTchnCdList: `${searchParam['techList']}`,
            invmStgCdList: `${searchParam['investStepList']}`,
            invmAreaCdList: `${searchParam['regionList']}`
        }

        const investObject = await ResponseUtils.getObject(Api.vc.infoList, params, ['page', 'totalPage'], 'list', false)
        if (investObject) {
            pageRef.current = investObject['page']
            totalPageRef.current = investObject['totalPage']
            const list = investObject['list']
            for (let i = 0; i < list.length; i++) {
                const item = list[i]
                item.tags = []
            }
            if (pageRef.current === 1) {
                setData(list)
            } else if (pageRef.current > 1) {
                setData(list, true)
            }
        } else {
            setList([])
        }
    }

    const search = async () => {
        pageRef.current = 0
        totalPageRef.current = 1

        searchParamRef.current = {
            bplcNm: keywordRef.current.value,
            ...getFunc(searchAreaRef, 'getSelectedCheckList')
        };

        if (String(keywordRef.current.value).trim() === ''
            && searchParamRef.current.categoryList.length === 0
            && searchParamRef.current.investStepList.length === 0
            && searchParamRef.current.regionList.length === 0
            && searchParamRef.current.techList.length === 0

            && list?.length > 0) {
            exeFunc(alertPopRef, 'open', '검색정보를 입력하세요.')
            return
        }

        await loadInvestList(true);
    }

    const onClickRefresh = () => {
        exeFunc(searchAreaRef, 'onClickSearchReset')
        exeFunc(searchAreaRef, 'search')
    }

    const setData = (tempList, isMore = false) => {
        const _tempList = tempList?.map(item => { return {...item, key: createKey() }});

        if (!isMore) setList(_tempList)
        else setList(deepCopyByRecursion(list).concat(_tempList));
    }

    const handleSearch = () => {
        const classList = searchWrap.current['classList']
        if (classList.contains('active')) {
            classList.remove('active')
        } else {
            classList.add('active')
        }
    }

    const searchEventListener = async () => {
        await commonContext.actions.callbackAfterSessionRefresh(async () => {
            const classList = searchWrap.current['classList']
            classList.remove('active')

            await search();
        }, true, true);
    }

    const onKeyUpEnter = async (event) => {
        if (event.keyCode === 13) {
            await commonContext.actions.callbackAfterSessionRefresh(search, true, true);
        }
    }

    const isMountRef = useRef(false);

    useEffect(() => {
        if(commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMountRef.current) {
            isMountRef.current = true;
            window.scrollY = 0;

            commonContext.actions.pageMountPathCheck(history, async () => {
                await loadInvestList();
                setMountChk(true);
            });
        }
    }, [commonContext.state.user]);

    useEffect(() => {
        ReactEvent.addEventListener('search', searchEventListener)
        return () => {
            ReactEvent.removeEventListener('search')
            setMountChk(false);
            setList([]);
            isMountRef.current = false;
        }
    }, [])

    return (
        <>
            <Header {...props} />
            <div className="page_container">
                <div className="wrap">
                    <div className="gallery_logo_wrap">
                        <Gallery01 data={galleryData}/>
                    </div>
                    <BreadCrumbs {...props} />
                    <div className="sub_wrap bg02 invest_wrap invest_main_wrap" css={InvestListStyle}>
                        <div className="invest_inner default_size02">
                            <div className={`search_wrap`} ref={searchWrap}>
                                <div className="search_inner">
                                    <div className="search_top">
                                        <input type="text"
                                               className="input"
                                               title='투자사명'
                                               placeholder="투자사명을 입력해주세요"
                                               ref={keywordRef}
                                               onKeyUp={event => onKeyUpEnter(event)}/>
                                        <Button theme={colors.blue} className={'btn_search'}
                                                onClick={() => commonContext.actions.callbackAfterSessionRefresh(search, true, true)}>
                                            검색
                                        </Button>
                                        <Button type={'linear'} className={'btn_more'} onClick={handleSearch}>
                                            상세검색
                                        </Button>
                                        <Button className="refresh" type={'linear'} theme={colors.lightGrey} onClick={onClickRefresh}>
                                            <span className="hide">새로고침</span>
                                        </Button>
                                    </div>
                                    <SearchArea ref={searchAreaRef} handleSearch={handleSearch} resetSearchInttNm={() => keywordRef.current.value = ''}/>
                                </div>
                            </div>

                            <div className="invest_list_wrap">
                                <ul className="invest_list">
                                    {
                                        list?.length > 0
                                            ? list.map((item, i) => (
                                                <li className="invest_item" key={item.key}>
                                                    <InvestListCard data={item}/>
                                                </li>
                                            ))
                                            : mountChk ? <NoResult msg={'검색된 결과가 없습니다.'} style={{marginTop:'100px', marginBottom: '550px'}}/> : <></>
                                    }
                                </ul>
                            </div>

                            <div className="btn_wrap">
                                {
                                    (list?.length > 0 && totalPageRef.current > pageRef.current) &&
                                    <Button theme={colors.blue} className={'btn_more'} onClick={() => commonContext.actions.callbackAfterSessionRefresh(loadInvestList, true, true)}>
                                        더보기
                                    </Button>
                                }
                            </div>
                        </div>
                    </div>
                    <AlertPopup ref={alertPopRef}/>
                    <Footer/>
                </div>
            </div>
            {/*<Footer/>*/}
        </>
    )
}

export default Invest
