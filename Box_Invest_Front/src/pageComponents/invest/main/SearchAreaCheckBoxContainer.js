import {forwardRef, useEffect, useImperativeHandle, useState} from 'react'

import SearchCheckbox from 'pageComponents/common/SearchCheckbox'
import {createKey, deepCopyByRecursion} from "modules/utils/CommonUtils";
import {exeFunc} from "modules/utils/ReactUtils";

const SearchAreaCheckBoxContainer = forwardRef((props, ref) => {

    const {type, alertPopRef = null, selectedTotalCountRef = null} = props

    const [list, setList] = useState([])
    useEffect(() => {
        return () => {
        }
    })
    useImperativeHandle(ref, () => ({
        setCheckList,
        getList,
        getSelectedCheckList,
        resetList,
        // getContinuesSelectedCheckList
    }))

    const setCheckList = (listParam=[]) => {
        if(!Array.isArray(listParam)) return;
        const _list = deepCopyByRecursion(listParam);

        for (let i = 0; i < _list.length; i++) {
            const item = _list[i]
            item.uid = `${type}_checkItem_uid_${i}`;
            if (item.hasOwnProperty('status') === false) {
                item.status = false
            }
        }
        setList(_list)
    }

    const getList = () => {
        return list
    }

    const resetList = () => {
        const tempList = []
        if (list.length > 0) {
            for (let i = 0; i < list.length; i++) {
                const item = list[i]
                item.status = false
                tempList.push(item)
            }
        }
        setList(tempList)
    }

    const getSelectedCheckList = () => {
        const temp = []
        for (let i = 0; i < list.length; i++) {
            const item = list[i]
            if (item.status) {
                temp.push(item.id)
            }
        }
        return temp
    }

    const onChangeCheckBoxSelected = (e) => {
        if(selectedTotalCountRef !== null) {
            if(e.target.checked) {
                if(selectedTotalCountRef.current >= 5) {
                    if(alertPopRef !== null) exeFunc(alertPopRef, 'open', '최대 5개까지 복수 선택이 가능합니다.')
                    return;
                }
                selectedTotalCountRef.current++;
            }
            else selectedTotalCountRef.current--;
        }

        let newList = []
        for (let i = 0; i < list.length; i++) {
            const checkBoxListItem = list[i]
            if (checkBoxListItem.uid === e.target.id) {
                checkBoxListItem.status = e.target.checked
            }
            newList.push(checkBoxListItem)
        }
        setCheckList(newList)
    }

    return (
        <>
            {
                list?.length > 0 &&
                <div className="checkbox_list_wrap">
                    {
                        list?.map((item, i) => (
                            <div className="checkbox_item" key={createKey()}>
                                <SearchCheckbox
                                    checkbox={item}
                                    onChange={(e) => onChangeCheckBoxSelected(e)}
                                    checked={item.status}
                                    shape={'shape01'}
                                    title={String(type) + i}
                                />
                            </div>
                        ))
                    }
                </div>
            }
        </>
    )
});
export default SearchAreaCheckBoxContainer;
