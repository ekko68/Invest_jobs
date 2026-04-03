import { Add } from "@mui/icons-material";
import { Button, FormControlLabel, Radio, RadioGroup, Stack, TableCell, TableRow, useTheme } from "@mui/material";
import TextFieldInput from 'components/common/TextFieldInput';
import { createKey } from "modules/utils/CommonUtils";
import React, { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useState } from 'react';

const OpratnHmfMntncList = forwardRef(({
  fncnEnlsPsstList,
  list,
  copy,
  rdoRatioActive,
  setRdoRatioActive,
  totalPrs,
  setTotalPrs,
  setTotalCurrent,
  title
}, ref) => {
  const theme = useTheme();

  useImperativeHandle(ref, () => ({}))
  useEffect(() => {}, [])
  useEffect(() => {}, [list])
  const [isUpdate, setIsUpdate] = useState(true)

  const onClickAdd = () => {
    if (list.length >= 20) {
        alert('등록 가능한 인원수를 초과하였습니다.최대 20 입니다.')
        // exeFunc(alertPopRef, 'open', '등록 가능한 인원수를 초과하였습니다.최대 20 입니다.');
        return
    }
    const item = createEmptyItem()
    list.push(item)
    setIsUpdate(!isUpdate)
  }

  const createEmptyItem = () => {
    const item = {}
    if (list.length > 0) {
      const lastItem = list[list.length - 1]
      item[fncnEnlsPsstList] = lastItem[fncnEnlsPsstList] + 1
    } else {
      item[fncnEnlsPsstList] = 1;
    }
    item['sqn'] = list.length+1
    item['opratnHnfNm'] = ''
    item['nowHffcY'] = false
    item['nowHffcN'] = true
    item['nowHffcYn'] = 'N'
    item['rm'] = ''
    item['rgsnUserId'] = ''
    item['key'] = createKey()
    return item
  }
// 운용 인력 유지율 자동계산
const changeNow = useCallback((val,numberProperty) => {
    let total = 0
    if(numberProperty === 'opratnHnfNm') {
        for(let i=0 ; i<list.length ; i++) {
            total += list[i].opratnHnfNm === '' ? 0 : 1;  
        }
        setTotalPrs(total);
    }
},[totalPrs])

// 라디오 버튼 컨트롤
const rdoClickBtn = useCallback((e, i, item)=> {
    let num = 0;
    let total1 = 0;
    let total2 = 0;

    if(e.target.id === 'nowHffcY'+i) {
        item.nowHffcY = true;
        item.nowHffcN = false;
        item.nowHffcYn = 'Y';
        num = i+1;
        for(let i=0 ; i<list.length ; i++) {
            total1 += list[i].nowHffcYn === 'Y' ? 1 : 0;  
        }
        setTotalCurrent(total1);
    }else if(e.target.id === 'nowHffcN'+i) {
        item.nowHffcY = false;
        item.nowHffcN = true;
        item.nowHffcYn = 'N';
        num = i-1;
        
        for(let i=0 ; i<list.length ; i++) {
            total2 += list[i].nowHffcYn === 'Y' ? 1 : 0;  
            total2 - list[i].nowHffcYn === 'N' ? 1 : 0;  
        }
        setTotalCurrent(total2);
    }
    setRdoRatioActive(num);
    },[rdoRatioActive])
    

  // 제안펀드 참여 운용 인력
  const renderOpratnHmfMntncList = useCallback(() => {
    const rowList = []
    
    if (list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        const row = (
            <TableRow key={createKey()}>
                <TableCell align="center" component="th" scope="row">
                    <TextFieldInput size="small" item={item} numberProperty={'opratnHnfNm'} name="opratnHnfNm" values={item.opratnHnfNm} changeNow={()=> changeNow(item.opratnHnfNm, 'opratnHnfNm')} disabled={copy === 'view'}/>
                </TableCell>
                <TableCell align="center" component="th" scope="row" sx={{borderLeft:`1px solid ${theme.palette.divider}`}}>
                    <Stack direction="row" justifyContent="center">
                        <RadioGroup row>
                            <FormControlLabel value="Y" control={<Radio id={'nowHffcY'+i} onClick={e=>rdoClickBtn(e,i,item)} checked={item.nowHffcY === true} disabled={copy === 'view'} />} label="Y" />
                            <FormControlLabel value="N" control={<Radio id={'nowHffcN'+i} onClick={e=>rdoClickBtn(e,i,item)} checked={item.nowHffcN === true} disabled={copy === 'view'} />} label="N" />
                        </RadioGroup> 
                    </Stack>
                    
                </TableCell>
                <TableCell align="left" component="th" scope="row" sx={{borderLeft:`1px solid ${theme.palette.divider}`}}>
                    <TextFieldInput size="small" item={item} numberProperty={"rm"} name="rm" values={item.rm} disabled={copy === 'view'} /> 
                </TableCell>
            </TableRow>
            )
            rowList.push(row)
        }
    }
    const row2 = (
        <TableRow>
            <TableCell colSpan={4} align="center" component="th" scope="row">
            <Button color="primary" variant="outlined" endIcon={<Add/>} onClick={onClickAdd} disabled={copy === 'view'}>행 추가</Button>
            </TableCell>
        </TableRow>
    )
    rowList.push(row2)
    
    return rowList
  })

  return (
    renderOpratnHmfMntncList()
  )
})

export default memo(OpratnHmfMntncList)
