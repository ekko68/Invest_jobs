import { useTheme } from '@mui/material';
import TextFieldInput from 'components/common/TextFieldInput';
import { createKey } from 'modules/utils/CommonUtils';
import { exeFunc } from 'modules/utils/ReactUtils';
import MuiNumberInput from 'pageComponents/common/number/MuiNumberInput';
import AlertPopup from 'pageComponents/common/pop/AlertPopup';
import { forwardRef, memo, useCallback, useEffect, useRef, useState, } from 'react';

const FncnEnlsList = forwardRef((props, ref) => {
    const {fncnEnlsList, list, pageType} = props
    const [isUpdate, setIsUpdate] = useState(true)
    const alertPopRef = useRef()

    useEffect(() => {
        if(pageType === '') {
            const item = createEmptyItem()
            list.push(item)
            setIsUpdate(!isUpdate)
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
          item[fncnEnlsList] = lastItem[fncnEnlsList] + 1
        } else {
          item[fncnEnlsList] = 1;
        }
        item['rgsnSqn'] = list.length+1
        item['opcmNm'] = ''
        item['isncInttNm'] = ''
        item['pgstCon'] = ''
        item['fncnAmt'] = 0
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

    const renderEnlsList = useCallback(()=> {
        const rowList = []
        
        if(list.length > 0) {
            for(let i=0 ; i<list.length ; i++) {
                const row = (
                    <tr key={createKey()}>
                        <td>
                            <TextFieldInput
                                title={'운용사명'}
                                size="small"
                                numberProperty="opcmNm"
                                name="opcmNm"
                                item={list[i]}
                                values={list[i].opcmNm}
                            />
                        </td>
                        <td>
                            <TextFieldInput
                                title={'발급기관명'}
                                size="small"
                                numberProperty="isncInttNm"
                                name="isncInttNm"
                                item={list[i]}
                                values={list[i].isncInttNm}
                            />
                        </td>
                        <td>
                            <TextFieldInput
                                title={'진행상태'}
                                size="small"
                                numberProperty="pgstCon"
                                name="pgstCon"
                                item={list[i]}
                                values={list[i].pgstCon}
                                placeholder="예) LOI, LOC, 투자심사중"
                            />
                        </td>
                        <td>
                            <MuiNumberInput
                                size="small"
                                item={list[i]}
                                type={'fncnAmt'}
                                numberProperty="fncnAmt"
                                sx={{ width: '6rem' }}
                                displayValue={list[i].fncnAmt}
                            />
                        </td>
                        <td>
                            <button type="button" className="button_add_row" onClick={() => { onClickDelete(list[i])} }>
                                삭제
                            </button>
                        </td>
                    </tr>
                )
                rowList.push(row)
            }
        }
        const row2 = (
            <>
                <tr>
                    <td colSpan={5} className="td_add_row">
                        <button type="button" className="button_add_row" onClick={() => { onClikAdd()} }>
                            행 추가 +
                        </button>
                    </td>
                </tr><AlertPopup ref={alertPopRef} />
            </>
        )               
        rowList.push(row2)   
        

        return rowList
    })
    
    return renderEnlsList()
})

export default memo(FncnEnlsList)