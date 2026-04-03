import { Add } from '@mui/icons-material'
import { Button, MenuItem, TableBody, TableCell, TableRow, useTheme } from '@mui/material'
import { BtSelect } from 'components/bt/BtSelect/BtSelect'
import TextFieldInput from 'components/common/TextFieldInput'
import { createKey } from 'modules/utils/CommonUtils'
import MuiNumberInput from 'pageComponents/common/number/MuiNumberInput'
import React, { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react'

const PrmrLpChcFildList = forwardRef(({ prmrLpChcFildList, list, title }, ref) => {
  const theme = useTheme()
  const scrollRef = useRef()
  const [isUpdate, setIsUpdate] = useState(true)

  useImperativeHandle(ref, () => ({}))
  useEffect(() => {}, [])
  useEffect(() => {}, [list])

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
      item[prmrLpChcFildList] = lastItem[prmrLpChcFildList] + 1
    } else {
      item[prmrLpChcFildList] = 1
    }
    item['sqn'] = list.length + 1
    item['invstInst'] = ''
    item['sprnFild'] = ''
    item['sprnAmt'] = ''
    item['progrsStg'] = ''
    item['rgsnUserId'] = ''
    item['key'] = createKey()

    return item
  }
  // 주요LP 지원 및 선정분야
  const renderPrmrLpChcFildList = useCallback(() => {
    const rowList = []

    if (list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        const row = (
          <TableRow key={item.key}>
            <TableCell align="center" component="th" scope="row">
              <TextFieldInput
                size="small"
                item={item}
                name={'invstInst' + i}
                numberProperty={'invstInst'}
                values={item.invstInst}
              />
            </TableCell>
            <TableCell
              align="center"
              component="th"
              scope="row"
              sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
            >
              <TextFieldInput
                size="small"
                item={item}
                name={'sprnFild' + i}
                numberProperty={'sprnFild'}
                values={item.sprnFild}
              />
            </TableCell>
            <TableCell
              align="left"
              component="th"
              scope="row"
              sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
            >
              <MuiNumberInput
                item={item}
                type={'hundMilliwon'}
                numberProperty="sprnAmt"
                sx={{ width: '100%' }}
                displayValue={item['sprnAmt']}
              />
            </TableCell>
            <TableCell
              align="left"
              component="th"
              scope="row"
              sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
            >
              <TextFieldInput
                size="small"
                item={item}
                name={'progrsStg' + i}
                numberProperty={'progrsStg'}
                values={item.progrsStg}
              />
              {/* <BtSelect defaultValue={item.progrsStg}>
                          <MenuItem disabled value={0}>선택하세요</MenuItem>
                          <MenuItem value={1} onClick={()=> item.progrsStg = '1'}>선정</MenuItem>
                          <MenuItem value={2} onClick={()=> item.progrsStg = '2'}>서류 통과</MenuItem>
                          <MenuItem value={3} onClick={()=> item.progrsStg = '3'}>서류 심사 중</MenuItem>
                          <MenuItem value={4} onClick={()=> item.progrsStg = '4'}>지원 예정</MenuItem>
                      </BtSelect> */}
            </TableCell>
          </TableRow>
        )
        rowList.push(row)
      }
    }
    const row2 = (
      <TableRow>
        <TableCell colSpan={4} align="center" component="th" scope="row">
          <Button color="primary" variant="outlined" endIcon={<Add />} onClick={onClickAdd}>
            행 추가
          </Button>
        </TableCell>
      </TableRow>
    )
    rowList.push(row2)

    return rowList
  })

  return renderPrmrLpChcFildList()
})

export default memo(PrmrLpChcFildList)
