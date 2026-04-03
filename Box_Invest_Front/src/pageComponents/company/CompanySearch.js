import {forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState} from 'react'

import {colors} from 'assets/style/style.config'
import Button from 'components/atomic/Button'
import Select from 'components/atomic/Select'
import SearchCalendar from 'pageComponents/common/SearchCalendar'

import DateUtils from 'modules/utils/DateUtils'
import FormUtils from 'modules/utils/FormUtils'
import {exeFunc, setFunc} from 'modules/utils/ReactUtils'
import {CodeContext} from "modules/contexts/common/CodeContext";
import {StringUtils} from "modules/utils/StringUtils";
import {NumInputRef} from "pageComponents/common/number/NumInput";
import {SelCmmId} from "modules/consts/BizConst";
import {isAnyNotNumber} from "modules/utils/NumberUtils";

const CompanySearch = forwardRef((props, ref) => {
    const codeContext = useContext(CodeContext);


    const searchAreaRef = useRef()
    const companyNmRef = useRef()
    const minSaleRef = useRef()
    const maxSaleRef = useRef()
    const minMemberRef = useRef()
    const maxMemberRef = useRef()
    const minDateRef = useRef()
    const maxDateRef = useRef()
    const bizSelectRef = useRef()
    const bizSizeRef = useRef()
    const [searchItem, setSearchItem] = useState({
        companyNm: '',
        minSale: null,
        maxSale: null,
        minDate: '',
        maxDate: '',
        minMember: null,
        maxMember: null,
        bizSelect: SelCmmId.ALL,
        region: SelCmmId.ALL,
        // bizSize: '',
        companyType: SelCmmId.ALL
    })
    const [categorySelect, setCategorySelect] = useState({
        selected: '',
        selList: []
    })
    const onChangeCategorySelect = (e) => {
        searchItem.bizSelect = e.target.value
        setCategorySelect({
            ...categorySelect,
            selected: e.target.value
        })
    }
    const [regionSelect, setRegionSelect] = useState({
        selected: '',
        selList: []
    })
    const onChangeRegionSelect = (e) => {
        searchItem.region = e.target.value
        setRegionSelect({
            ...regionSelect,
            selected: e.target.value
        })
    }
    const [companyTypeSelect, setCompanyTypeSelect] = useState({
        selected: '',
        selList: []
    })
    const onChangeCompanyTypeSelect = (e) => {
        searchItem.companyType = e.target.value
        setCompanyTypeSelect({
            ...companyTypeSelect,
            selected: e.target.value
        })
    }
    const handleSearchDetail = () => {
        const classList = searchAreaRef.current.classList
        if (classList.contains('active')) {
            classList.remove('active')
        } else {
            classList.add('active')
        }
    }
    useImperativeHandle(ref, () => ({
        getSearchItem,
        reset,
        open,
        close,
        setSearchInitParam,
        // setData
    }))
    const open = () => {
        const classList = searchAreaRef.current.classList
        classList.add('active')
    }
    const close = () => {
        const classList = searchAreaRef.current.classList
        classList.remove('active')
    }
    const getSearchItem = () => {
        return searchItem
    }

    // 투자분야 페이지 등 값 설정에 따른 페이지 검색설정 초기화 용
    const setSearchInitParam = (param) => {
        setSearchItem(param);
    }

    const reset = () => {
        let item = {
            companyNm: '',
            minSale: null,
            maxSale: null,
            minDate: '',
            maxDate: '',
            minMember: null,
            maxMember: null,
            bizSelect: SelCmmId.ALL,
            region: SelCmmId.ALL,
            // bizSize: '',
            companyType: SelCmmId.ALL
        }
        setSearchItem(item)
        companyNmRef.current.value = '';
        minSaleRef.current.value = null;
        maxSaleRef.current.value = null;
        minMemberRef.current.value = null;
        maxMemberRef.current.value = null;

        setFunc(minDateRef, 'reset');
        setFunc(maxDateRef, 'reset');
        setFunc(bizSelectRef, 'reset');

        setCategorySelect({
            ...categorySelect,
            selected: SelCmmId.ALL
        })
        setRegionSelect({
            ...regionSelect,
            selected: SelCmmId.ALL
        })
        setCompanyTypeSelect({
            ...companyTypeSelect,
            selected: SelCmmId.ALL
        })
    }

    const onClickRefresh = () => {
        reset()
    }
    const onChangeMinDate = (selectedDate, item) => {
        const d = DateUtils.customDateFormat(selectedDate, 'yyyyMMdd')
        searchItem['minDate'] = d
    }
    const onChangeMaxDate = (selectedDate, item) => {
        const d = DateUtils.customDateFormat(selectedDate, 'yyyyMMdd')
        searchItem['maxDate'] = d
    }
    const onChangeInputDate = (event) => {
        FormUtils.setVoInput(searchItem, event.target.id, event.target.value)
    }
    const onChangeInput = (event) => {
        FormUtils.setVoInput(searchItem, event.target.id, event.target.value)
    }
    const onClickSearch = () => {
        if(!isAnyNotNumber(searchItem.maxSale, searchItem.minSale)) {
            if(Number(searchItem.maxSale) < Number(searchItem.minSale)) {
                if(props.alertPopRef) exeFunc(props.alertPopRef, 'open', '매출액을 확인해주세요.');
                return;
            }
        }
        if(!StringUtils.isAnyBlank(searchItem.maxDate, searchItem.minDate)) {
            if(searchItem.maxDate < searchItem.minDate) {
                if(props.alertPopRef) exeFunc(props.alertPopRef, 'open', '설립일자를 확인해주세요.');
                return;
            }
        }
        if(!isAnyNotNumber(searchItem.maxMember, searchItem.minMember)) {
            if(Number(searchItem.maxMember) < Number(searchItem.minMember)) {
                if(props.alertPopRef) exeFunc(props.alertPopRef, 'open', '근로자 수를 확인해주세요.');
                return;
            }
        }

        if (props.onClickSearch) props.onClickSearch();
    }

    const onKeyUpEnter = async (event) => {
        if (event.keyCode === 13) {
            onClickSearch();
        }
    }

    const isMountedRef = useRef(false);

    useEffect(() => {
        if(codeContext.state.isLoaded && !isMountedRef.current) {
            isMountedRef.current = true;

            const categoryList = codeContext.actions.getCategoryList();
            if (categoryList.length > 0) {
                const categoryEmptyItem = {
                    fileId: '',
                    id: SelCmmId.ALL,
                    imgUrl: '',
                    invmFildId: '',
                    invmFildNm: '',
                    value: '전체'
                }
                categoryList.unshift(categoryEmptyItem)
            }
            setCategorySelect({
                selList: categoryList,
                selected: SelCmmId.ALL
            })

            const regionList = codeContext.actions.getRegionList();
            if (regionList.length > 0) {
                const regionEmptyItem = {
                    comCdId: '',
                    comCdNm: '',
                    id: SelCmmId.ALL,
                    value: '전체'
                }
                regionList.unshift(regionEmptyItem)
            }
            setRegionSelect({
                selList: regionList,
                selected: SelCmmId.ALL
            })

            const companyTypeList = codeContext.actions.getCompanyTypeList();
            if (companyTypeList.length > 0) {
                const companyTypeEmptyItem = {
                    comCdId: '',
                    comCdNm: '',
                    id: SelCmmId.ALL,
                    value: '전체'
                }
                companyTypeList.unshift(companyTypeEmptyItem)
            }
            setCompanyTypeSelect({
                selList: companyTypeList,
                selected: SelCmmId.ALL
            })
        }
    }, [codeContext.state.isLoaded]);

    return (
        <div className="search_section">
            {/*<div className={`search_wrap ${searchActive ? 'active' : ''}`}>*/}
            <div className={`search_wrap`} ref={searchAreaRef}>
                {/*search_top start*/}
                <div className="search_top">
                    <div className="inner">
                        <input
                            ref={companyNmRef}
                            id={'companyNm'}
                            type="text"
                            className="input"
                            placeholder="기업명을 입력해주세요"
                            onChange={(event) => onChangeInput(event)}
                            onKeyUp={event => onKeyUpEnter(event)}
                            title='기업명'
                        />
                        <Button className="search" theme={colors.blue} onClick={onClickSearch}>
                            검색
                        </Button>
                        <Button className="search_detail" type={'linear'} theme={colors.blue} onClick={handleSearchDetail}>
                            상세검색
                        </Button>

                        {/*좋아요 버튼 누르면 up + active*/}
                        {/*<Button className="up" type={'linear'} theme={colors.lightGrey}>*/}
                        {/*    <span className="hide">좋아요</span>*/}
                        {/*</Button>*/}

                        <Button className="refresh" type={'linear'} theme={colors.lightGrey} onClick={onClickRefresh}>
                            <span className="hide">새로고침</span>
                        </Button>
                    </div>
                </div>
                {/*search_top end*/}
                {/*search_bottom start*/}
                <div className="search_bottom">
                    <div className="inner">
                        {/*left_section start*/}
                        <div className="left_section">
                            <div className="input_row">
                                <div className="label">
                                    매출액<span className="sub_info">(원)</span>
                                </div>
                                <div className="input_wrap">
                                    <NumInputRef type="text"
                                              className="input text_right"
                                              autoComplete="off"
                                              defaultValue={searchItem.minSale}
                                              placeholder="최소"
                                              title='매출액(최소)'
                                              setState={value => setSearchItem({...searchItem, minSale: value})}
                                              name={'minSale'}
                                              ref={minSaleRef}
                                    />
                                    <span className="interval">~</span>
                                    <NumInputRef type="text"
                                              className="input text_right"
                                              autoComplete="off"
                                              defaultValue={searchItem.maxSale}
                                              placeholder="최대"
                                              title='매출액(최대)'
                                              setState={value => setSearchItem({...searchItem, maxSale: value})}
                                              name={'maxSale'}
                                              ref={maxSaleRef}
                                    />
                                </div>
                            </div>
                            <div className="input_row">
                                <div className="label">설립일</div>
                                <div className="input_wrap">
                                    <SearchCalendar
                                        ref={minDateRef}
                                        valueType={'dash'}
                                        date={DateUtils.insertYyyyMmDdDash(searchItem['minDate'])}
                                        onChangeDate={onChangeMinDate}
                                        item={searchItem}
                                        title='설립일(이후)'

                                        popperPlacement='bottom-start'
                                        popperModifiers={[
                                            {
                                                name: 'preventOverflow',
                                                options: {
                                                    boundary: 'viewport',
                                                    escapeWithReference: true,
                                                    padding: 10
                                                }
                                            },
                                            {
                                                name: 'flip',
                                                enabled: false
                                            },
                                        ]}
                                    />
                                    <span className="interval">~</span>
                                    <SearchCalendar
                                        ref={maxDateRef}
                                        valueType={'dash'}
                                        date={DateUtils.insertYyyyMmDdDash(searchItem['maxDate'])}
                                        onChangeDate={onChangeMaxDate}
                                        item={searchItem}
                                        title='설립일(이전)'

                                        popperPlacement='bottom-start'
                                        popperModifiers={[
                                            {
                                                name: 'preventOverflow',
                                                options: {
                                                    boundary: 'viewport',
                                                    escapeWithReference: true,
                                                    padding: 10
                                                }
                                            },
                                            {
                                                name: 'flip',
                                                enabled: false
                                            },
                                        ]}
                                    />
                                </div>
                            </div>
                            <div className="input_row">
                                <div className="label">근로자</div>
                                <div className="input_wrap">
                                    <NumInputRef type="text"
                                                 className="input text_right"
                                                 autoComplete="off"
                                                 defaultValue={searchItem.minMember}
                                                 placeholder="최소"
                                                 title='근로자수(최소)'
                                                 setState={value => setSearchItem({...searchItem, minMember: value})}
                                                 name={'minMember'}
                                                 ref={minMemberRef}
                                    />
                                    <span className="interval">~</span>
                                    <NumInputRef type="text"
                                                 className="input text_right"
                                                 autoComplete="off"
                                                 defaultValue={searchItem.maxMember}
                                                 placeholder="최대"
                                                 title='근로자수(최대)'
                                                 setState={value => setSearchItem({...searchItem, maxMember: value})}
                                                 name={'maxMember'}
                                                 ref={maxMemberRef}
                                    />
                                </div>
                            </div>
                        </div>
                        {/*left_section end*/}
                        {/*right_section start*/}
                        <div className="right_section">
                            <div className="input_row">
                                <div className="label">산업분류</div>
                                <div className="input_wrap">
                                    <Select
                                        optList={categorySelect.selList}
                                        // selected={categorySelect.selected}
                                        selected={searchItem.bizSelect}
                                        onChange={onChangeCategorySelect}
                                        title='산업분류'
                                    />
                                </div>
                            </div>
                            <div className="input_row">
                                <div className="label">지역</div>
                                <div className="input_wrap">
                                    {/*<input ref={locationRef} type="text" id={'location'} onChange={(event) => onChangeInput(event)} />*/}
                                    <Select
                                        optList={regionSelect.selList}
                                        // selected={regionSelect.selected}
                                        selected={searchItem.region}
                                        onChange={onChangeRegionSelect}
                                        title='지역'
                                    />
                                </div>
                            </div>
                            <div className="input_row">
                                <div className="label">기업규모</div>
                                <div className="input_wrap">
                                    {/*<input ref={bizSizeRef} type="text" id={'bizSize'} onChange={(event) => onChangeInput(event)} />*/}
                                    <Select
                                        optList={companyTypeSelect.selList}
                                        // selected={companyTypeSelect.selected}
                                        selected={searchItem.companyType}
                                        onChange={onChangeCompanyTypeSelect}
                                        title='기업규모'
                                    />
                                </div>
                            </div>
                        </div>
                        {/*right_section end*/}
                    </div>
                </div>
                {/*search_bottom end*/}
            </div>
        </div>
    )
});
export default CompanySearch;
