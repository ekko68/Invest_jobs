import { MenuItem, useTheme } from "@mui/material";
import { BtSelect } from "components/bt/BtSelect/BtSelect";
import TextFieldInput from 'components/common/TextFieldInput';
import { createKey } from 'modules/utils/CommonUtils';
import { exeFunc } from 'modules/utils/ReactUtils';
import { StringUtils } from "modules/utils/StringUtils";
import AlertPopup from 'pageComponents/common/pop/AlertPopup';
import { forwardRef, memo, useCallback, useEffect, useRef, useState, } from 'react';

const FnsnInvvHmrsList = forwardRef((props, ref) => {
    const {invvHmrsList, list, pageType} = props
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
          item[invvHmrsList] = lastItem[invvHmrsList] + 1
        } else {
          item[invvHmrsList] = 1;
        }
        item['rgsnSqn'] = list.length+1
        item['opcmNm'] = ''
        item['opcmHmrsDcd'] = '0'
        item['opcmHmrsNm'] = ''
        item['opcmHmrsCrrNyy'] = ''
        item['opcmRsprNm'] = ''
        item['opcmCmpnTpn'] = ''
        item['opcmRsprCpn'] = ''
        item['opcmEad'] = ''
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
                            size="small"
                            numberProperty={'opcmNm'}
                            name="opcmNm"
                            item={list[i]}
                            values={list[i].opcmNm}
                        />
                        </td>
                        <td>
                        <BtSelect defaultValue={list[i].opcmHmrsDcd} poHandleChange={()=>{}}>
                            <MenuItem value={'0'} disabled>선택하세요</MenuItem>
                            <MenuItem value={'1'} onClick={()=>{ list[i].opcmHmrsDcd = '1'}}>대표펀드매니저</MenuItem>
                            <MenuItem value={'2'} onClick={()=>{ list[i].opcmHmrsDcd = '2'}}>핵심운용인력</MenuItem>
                        </BtSelect>
                        </td>
                        <td>
                        <TextFieldInput
                            size="small"
                            numberProperty={'opcmHmrsNm'}
                            name="opcmHmrsNm"
                            item={list[i]}
                            values={list[i].opcmHmrsNm}
                        />
                        </td>
                        <td>
                        <TextFieldInput
                            size="small"
                            numberProperty={'opcmHmrsCrrNyy'}
                            name="opcmHmrsCrrNyy"
                            item={list[i]}
                            values={list[i].opcmHmrsCrrNyy}
                            maxLength={5}
                        />
                        </td>
                        <td>
                        <TextFieldInput
                            size="small"
                            numberProperty={'opcmCmpnTpn'}
                            name="opcmCmpnTpn"
                            item={list[i]}
                            values={StringUtils.isTelFormat(list[i].opcmCmpnTpn)}
                        />
                        </td>
                        <td>
                        <TextFieldInput
                            size="small"
                            numberProperty={'opcmRsprCpn'}
                            name="opcmRsprCpn"
                            item={list[i]}
                            values={StringUtils.isTelFormat(list[i].opcmRsprCpn)}
                        />
                        </td>
                        <td>
                        <TextFieldInput
                            size="small"
                            numberProperty={'opcmEad'}
                            name="opcmEad"
                            item={list[i]}
                            values={list[i].opcmEad}
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

export default memo(FnsnInvvHmrsList)