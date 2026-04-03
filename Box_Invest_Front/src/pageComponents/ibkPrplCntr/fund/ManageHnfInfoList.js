import { Add } from "@mui/icons-material";
import { Button, FormControlLabel, Radio, RadioGroup, Stack, TableCell, TableRow, useTheme } from "@mui/material";
import TextFieldInput from 'components/common/TextFieldInput';
import { createKey } from "modules/utils/CommonUtils";
import React, { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useState } from 'react';

const ManageHnfInfoList = forwardRef(({
  manageHnfInfo,
  list,
  copy,
  totalNm,
  setTotalNm,
  currentWork,
  setCurrentWork,
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
      item[manageHnfInfo] = lastItem[manageHnfInfo] + 1
    } else {
      item[manageHnfInfo] = 1;
    }
    item['sqn'] = list.length+1
    item['name'] = ''
    item['rmdp'] = ''
    item['rmrk'] = ''
    item['rgsnUserId'] = ''
    item['key'] = createKey()
    return item
  }

    // 관리 인력정보 자동계산
    const autoCalc = useCallback((val, numberProperty) => {
        let total1 = 0;
        let total2 = 0;
        const temp = [...list];
        if(numberProperty === 'name') {
            temp.forEach((item)=> {
                total1 += item.name === '' ? 0 : 1; 
            })
            setTotalNm(total1)
        }else if(numberProperty === 'rmdp') {
            temp.forEach((item)=> {
                total2 += item.rmdp === '' ? 0 : 1; 
            })
            setCurrentWork(total2)
        }
    }, [totalNm, currentWork])
    
  const renderManageHnfInfoList = useCallback(() => {
    const rowList = []
    
    if (list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        const row = (
            <TableRow key={createKey()}>
                <TableCell align="center" component="th" scope="row">
                    <TextFieldInput size="small" numberProperty={'name'} item={item} values={item.name} changeNow={()=> autoCalc(item.name, 'name')} disabled={copy === 'view'}/>
                </TableCell>
                <TableCell align="center" component="th" scope="row" sx={{borderLeft:`1px solid ${theme.palette.divider}`}}>
                    <TextFieldInput size="small" numberProperty={'rmdp'} item={item} values={item.rmdp} changeNow={()=> autoCalc(item.rmdp, 'rmdp')} disabled={copy === 'view'}/>
                </TableCell>
                <TableCell align="left" component="th" scope="row" sx={{borderLeft:`1px solid ${theme.palette.divider}`}}>
                    <TextFieldInput size="small" numberProperty={"rmrk"} item={item} values={item.rmrk} disabled={copy === 'view'}/> 
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
    renderManageHnfInfoList()
  )
})

export default memo(ManageHnfInfoList)
