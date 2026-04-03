import { useTheme } from '@mui/material';
import TextFieldInput from 'components/common/TextFieldInput';
import { createKey } from 'modules/utils/CommonUtils';
import { exeFunc } from 'modules/utils/ReactUtils';
import AlertPopup from 'pageComponents/common/pop/AlertPopup';
import { forwardRef, memo, useCallback, useEffect, useRef, useState } from 'react';

const FncnBsnsPmglList = forwardRef((props, ref) => {
    const {pmglList, list, pageType} = props
    const [isUpdate, setIsUpdate] = useState(true)
    const alertPopRef = useRef()
    
    useEffect(() => {
        if(pageType === '') {
            const item = createEmptyItem()
            list.push(item)
            setIsUpdate(!isUpdate)
        } else {
            if(list.length === 0) {
                const item = createEmptyItem()
                list.push(item)
                setIsUpdate(!isUpdate)
            }
        }
    }, [list])

    // 행추가 버튼 클릭
    const onClikAdd = () => {
      if (list.length >= 20) {
          exeFunc(alertPopRef, 'open', '등록 가능한 인원수를 초과하였습니다.최대 20행 입니다.');
          return
      }
      const item = createEmptyItem()
      list.push(item)
      setIsUpdate(!isUpdate)
    }

    // 행추가
    const createEmptyItem = () => {
        const item = {}
        if (list.length > 0) {
          const lastItem = list[list.length - 1]
          item[pmglList] = lastItem[pmglList] + 1
        } else {
          item[pmglList] = 1;
        }
        item['rgsnSqn'] = list.length+1
        item['fncnBsnsPmglCon'] = ''
        item['iibsFrrgId'] = ''

        return item
    }
    
    // 행 삭제
    const onClickDelete = (item) => {
        if (list.length > 0) {
            let index = -1
            const seq = item['rgsnSqn']
            for (let i = 0; i < list.length; i++) {
                const listItem = list[i]
                if (listItem['rgsnSqn'] === seq) {
                    index = i
                    break
                }
            }
            if (index > -1) {
                list.splice(index, 1)
            }

        setIsUpdate(!isUpdate)
        }
    }

    const renderPmglList = useCallback(()=> {
        const rowList = []
        
        if(list.length > 0) {
            for(let i=0 ; i<list.length ; i++) {
                const row = (
                <>
                    <tr key={createKey()}>
                        <td>
                            <TextFieldInput
                                title={'주목적 내용'}
                                size="small"
                                numberProperty="fncnBsnsPmglCon"
                                name="fncnBsnsPmglCon"
                                item={list[i]}
                                values={list[i].fncnBsnsPmglCon} />
                        </td>
                        <td style={{width : "75px"}}>
                            <button type="button" className="button_add_row" onClick={()=>{ onClickDelete(list[i])}}>
                                삭제
                            </button>
                        </td>
                    </tr>
                </>
                )
                rowList.push(row)
            }
        }
        
        const row2 = (
            <>
                <tr>
                    <td className="td_add_row" colSpan={3}>
                        <button type="button" className="button_add_row" onClick={()=>{onClikAdd()}}>
                            행 추가 +
                        </button>
                    </td>
                </tr>
                <AlertPopup ref={alertPopRef}/>
            </>
        )
        rowList.push(row2)

        return rowList
    })
    
    return renderPmglList()
})

export default memo(FncnBsnsPmglList)