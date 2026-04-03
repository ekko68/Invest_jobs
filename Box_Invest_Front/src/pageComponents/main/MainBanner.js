import React, {forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useState} from 'react'
import CommonBottomBannerCard from "pageComponents/common/CommonBottomBannerCard";
import {createKey} from "modules/utils/CommonUtils";

const MainBanner = forwardRef((props, ref) => {
    const [list, setList] = useState([])

    useImperativeHandle(ref, () => ({
        setData
    }))
    const setData = (list) => {
        setList(list)
    }

    useLayoutEffect(() => {
    }, [])
    useEffect(async () => {
    }, [])

    return (
        <div className="section section03">
            <div className="banner_inner">{list?.map((listItem, i) => (
                <CommonBottomBannerCard key={createKey()} data={listItem} idx={i}/>
            ))}</div>
        </div>
    )
})
export default MainBanner
