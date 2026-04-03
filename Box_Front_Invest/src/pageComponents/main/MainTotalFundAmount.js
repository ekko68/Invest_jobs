import React, {forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useState} from 'react'
import NumberBox from 'components/common/number/NumberBox'
import {StringUtils} from "modules/utils/StringUtils";
import {createKey} from "modules/utils/CommonUtils";

const MainTotalFundAmount = forwardRef((props, ref) => {
    const [numberList, setNumberList] = useState([]);

    useImperativeHandle(ref, () => ({
        setData
    }))

    const setData = (amountStr) => {
        StringUtils.hasLength(amountStr) ? setNumberList(String(amountStr).split(",")) : setNumberList(["0"]);
    }

    useLayoutEffect(() => {
    }, [])
    useEffect(async () => {
    }, [])

    return (
        <div className="section section04 default_size">
            <div className="fund_header">
                <p className="sub_title">IBK Fund Rising</p>
                <h3 className="section_title">총 펀드금액</h3>
                <div className="number_box_wrap">{
                    numberList?.map((item, index) => {
                        if (index >= numberList.length - 1) {
                            return <NumberBox data={String(item)} key={createKey()} listIndex={index} unit={true}/>
                        } else {
                            return <NumberBox data={String(item)} listIndex={index} key={createKey()} comma={true}/>
                        }
                    })
                }</div>
            </div>
        </div>
    )
})
export default MainTotalFundAmount
