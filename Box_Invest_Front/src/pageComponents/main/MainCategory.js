/** @jsxImportSource @emotion/react */

import React, {forwardRef, useContext, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState} from 'react'
import {useHistory} from "react-router-dom";

import {categoryItem01Style} from "assets/style/ComponentStyle";
import Title from 'components/atomic/Title'

import ROUTER_NAMES from "modules/consts/RouterConst";
import {CommonContext} from "modules/contexts/common/CommomContext";
import {createKey, deepCopyByRecursion} from "modules/utils/CommonUtils";
import {CodeContext} from "modules/contexts/common/CodeContext";

const MainCategory = forwardRef((props, ref) => {
    const history = useHistory();
    const commonContext = useContext(CommonContext);
    const codeContext = useContext(CodeContext);

    const [list, setList] = useState([]);

    // 리스트 정보는 api에서 넘어오지만
    // 메인에 고정으로 보이는 10개 이미지는 프론트에 존재하므로 id 저장 후 세팅
    const fieldImageList = [
        {fieldId: 'IVF00000', name: '3D프린트', imgUrl: '/images/img_main_field_print.png'},
        {fieldId: 'IVF00040', name: 'IT/서비스', imgUrl: '/images/img_main_field_it.png'},
        {fieldId: 'IVF00036', name: '항공기/드론', imgUrl: '/images/img_main_field_airplane.png'},
        {fieldId: 'IVF00037', name: '헬스케어', imgUrl: '/images/img_main_field_health.png'},
        {fieldId: 'IVF00006', name: '광고마케팅', imgUrl: '/images/img_main_field_marketing.png'},
        {fieldId: 'IVF00013', name: '바이오', imgUrl: '/images/img_main_field_bio.png'},
        {fieldId: 'IVF00019', name: '뷰티', imgUrl: '/images/img_main_field_beauty.png'},
        {fieldId: 'IVF00026', name: '유아', imgUrl: '/images/img_main_field_baby.png'},
        {fieldId: 'IVF00028', name: '자동차', imgUrl: '/images/img_main_field_car.png'},
        {fieldId: 'IVF00008', name: '금융', imgUrl: '/images/img_main_field_finance.png'},
    ]

    useImperativeHandle(ref, () => ({
        // setData
    }))
    // const setData = (list) => {
    //     setList(list);
    // }

    const isMountedRef = useRef(false);

    useEffect(async () => {
        if(codeContext.state.isLoaded && !isMountedRef.current) {
            isMountedRef.current = true;
            setList(codeContext.actions.getCategoryList())
        }
    }, [codeContext.state.isLoaded])

    return (
        <div className="section section01 default_size">
            <Title>분야</Title>
            <div className="category_list">
                {
                    fieldImageList.map((element, index) => {
                        const item = list?.find(e => e?.invmFildCd == element.fieldId);
                        if(item !== null && item !== undefined) return (
                            <div className={'category_item01'} css={categoryItem01Style} key={createKey()} style={{cursor: 'pointer'}}>
                                <div className="category_inner"
                                     onClick={() => commonContext.actions.callbackAfterOnlyLoginCheck(() => history.push(ROUTER_NAMES.COMPANY + '?invmFildCd=' + item['invmFildCd']))}>
                                    <img src={element.imgUrl} alt="분야 썸네일" />
                                    <p className="title">{item?.value}</p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
})
export default MainCategory
