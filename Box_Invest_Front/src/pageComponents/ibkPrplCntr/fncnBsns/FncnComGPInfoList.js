import { useTheme } from '@mui/material';
import TextFieldInput from 'components/common/TextFieldInput';
import { createKey } from 'modules/utils/CommonUtils';
import { exeFunc } from 'modules/utils/ReactUtils';
import { StringUtils } from "modules/utils/StringUtils";
import AlertPopup from 'pageComponents/common/pop/AlertPopup';
import { forwardRef, memo, useCallback, useEffect, useRef, useState } from 'react';

const FncnComGPInfoList = forwardRef((props, ref) => {
    const {opcmInfoList, list, pageType} = props
    const [isUpdate, setIsUpdate] = useState(true)
    const alertPopRef = useRef()

    useEffect(() => {
        if(pageType === '') {
            if(list.length === 0) {
                const item = createEmptyItem()
                list.push(item)
                setIsUpdate(!isUpdate)
            }
        }
    }, [])

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
          item[opcmInfoList] = lastItem[opcmInfoList] + 1
        } else {
          item[opcmInfoList] = 1;
        }
        item['rgsnSqn'] = list.length+1
        item['opcmNm'] = ''
        item['opcmRpprNm'] = ''
        item['opcmIncrYmd'] = ''
        item['opcmBzn'] = ''
        item['opcmRsprNm'] = ''
        item['cnplCon'] = ''
        item['emlCon'] = ''
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

    const renderOpcmGpList = useCallback(()=> {
        const rowList = []
        
        if(list.length > 0) {
            for(let i=0 ; i<list.length ; i++) {
                const row = (
                    <tr key={createKey()}>
                        <td>
                        <TextFieldInput
                            title={'공통GP명'}
                            size="small"
                            numberProperty="opcmNm"
                            name="opcmNm"
                            item={list[i]}
                            values={list[i].opcmNm}
                        />

                        </td>
                        <td>
                        <TextFieldInput
                            title={'대표자명'}
                            size="small"
                            numberProperty="opcmRpprNm"
                            name="opcmRpprNm"
                            item={list[i]}
                            values={list[i].opcmRpprNm}
                        />
                        </td>
                        <td>
                        <TextFieldInput
                            title={'설립년월일'}
                            size="small"
                            numberProperty="opcmIncrYmd"
                            name="opcmIncrYmd"
                            item={list[i]}
                            values={list[i].opcmIncrYmd}
                            maxLength={8}
                        />
                        </td>
                        <td>
                        <TextFieldInput
                            title={'사업자 등록번호'}
                            size="small"
                            numberProperty="opcmBzn"
                            name="opcmBzn"
                            item={list[i]}
                            values={StringUtils.formatBusinessNumber(list[i].opcmBzn)}
                        />
                        </td>
                        <td>
                        <TextFieldInput
                            title={'담당자명'}
                            size="small"
                            numberProperty="opcmRsprNm"
                            name="opcmRsprNm"
                            item={list[i]}
                            values={list[i].opcmRsprNm}
                        />
                        </td>
                        <td>
                        <TextFieldInput
                            title={'연락처'}
                            size="small"
                            numberProperty="cnplCon"
                            name="cnplCon"
                            item={list[i]}
                            values={StringUtils.isTelFormat(String(list[i].cnplCon))}
                        />
                        </td>
                        <td>
                        <TextFieldInput
                            title={'이메일'}
                            size="small"
                            numberProperty="emlCon"
                            name="emlCon"
                            item={list[i]}
                            values={list[i].emlCon}
                        />
                        </td>
                        <td>
                        <button type="button" className="button_add_row" onClick={() => {onClickDelete(list[i])} }>
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
                    <td colSpan={8} className="td_add_row">
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
    
    return renderOpcmGpList()
})

export default memo(FncnComGPInfoList)