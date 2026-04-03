import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useState } from 'react'

import CommonBottomBannerCard from "pageComponents/common/CommonBottomBannerCard";
import {createKey} from "modules/utils/CommonUtils";

const DashboardBanner = forwardRef((props, ref) => {
    const [list, setList] = useState([])

    useImperativeHandle(ref, () => ({
        setData
    }))
    const setData = (list) => {
        setList(list)
    }
    return (
        <div className="banner_inner">{
            list?.map((item, i) => (<CommonBottomBannerCard key={createKey()} data={item} idx={i} />))
        }</div>
    )
})
export default DashboardBanner
