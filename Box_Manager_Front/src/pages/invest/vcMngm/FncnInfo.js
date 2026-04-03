import { forwardRef, useCallback, useEffect, useImperativeHandle, useState, memo } from 'react'
import AddIcon from '@mui/icons-material/Add'
import { Box, FormControl, MenuItem, TextField, IconButton, useTheme } from '@mui/material'
import Button from '@mui/material/Button'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import { BtaSelect_copy } from 'components/BtaSelect'
import * as commonFn from 'modules/fns/commonFn'
import { Remove } from '@mui/icons-material'
import { yearsToMonths } from 'date-fns'

const FncnInfo = forwardRef(({ sqn, list = [], updateFncnInfoList }, ref) => {
  const [isUpdate, setIsUpdate] = useState(true)
  const theme = useTheme()
  useImperativeHandle(ref, () => ({}))
  useEffect(() => {}, [])
  useEffect(() => {}, [list])

  const years = []
  const currentYear = new Date().getFullYear()
  for (let i = 0; i < 10; i++) {
    const year = currentYear - i
    years.push(year)
  }

  const onClickAdd = () => {
    if (list?.length >= 20) {
      alert('등록 가능한 인원수를 초과하였습니다.최대 20 입니다.')
      // exeFunc(alertPopRef, 'open', '등록 가능한 인원수를 초과하였습니다.최대 20 입니다.');
      return
    }
    const item = createEmptyItem()
    list?.push(item)
    updateFncnInfoList(list)
    setIsUpdate(!isUpdate)
    // moveToBottom()
  }
  const createEmptyItem = () => {
    const item = {}
    if (list?.length > 0) {
      const lastItem = list[list?.length - 1]
      item[sqn] = list?.length
    } else {
      item[sqn] = 1
    }
    item['utlinsttId'] = ''
    item['rgyeDsnc'] = ''
    item['fncnAmt'] = ''
    item['memo'] = ''
    return item
  }

  // item 삭제
  // const onClickDelete = (item) => {
  //   if (list.length > 0) {
  //     let index = -1
  //     const sqn = item[sqn]
  //     for (let i = 0; i < list.length; i++) {
  //       const listItem = list[i]
  //       if (listItem[sqn] === sqn) {
  //         index = i
  //         break
  //       }
  //     }
  //     if (index > -1) {
  //       list.splice(index, 1)
  //     }
  //     setIsUpdate(!isUpdate)
  //   }
  // }
  const onClickDelete = (index) => {
    const newList = [...list]
    newList.splice(index, 1)
    updateFncnInfoList(newList)
  }

  const handleSelectChange = (index, value) => {
    const newList = [...list]
    newList[index].rgyeDsnc = value
    updateFncnInfoList(newList)
  }

  // 투자사 인력 정보
  const renderHnfInfo = useCallback(() => {
    console.log('list', list)
    if (list?.length === 0) {
      return <></>
    } else if (list?.length > 0) {
      const rowList = []
      for (let i = 0; i < list?.length; i++) {
        const item = list[i]
        const row = (
          <TableRow key={commonFn.createKey()}>
            <TableCell align="center" component="th" scope="row">
              <FormControl id={'rgyeDsnc'} size="small" sx={{ width: '100%' }}>
                <BtaSelect_copy
                  defaultValue={list[i].rgyeDsnc}
                  poHandleChange={(value) => handleSelectChange(i, value)}
                >
                  {years.map((year) => (
                    <MenuItem key={year} value={year} defaultValue={currentYear}>
                      {year}년
                    </MenuItem>
                  ))}
                  {/* <MenuItem value={'20'}>2021년</MenuItem>
                  <MenuItem value={'30'}>2019년</MenuItem>
                  <MenuItem value={'40'}>2018년</MenuItem>
                  <MenuItem value={'50'}>2017년</MenuItem> */}
                </BtaSelect_copy>
              </FormControl>
            </TableCell>
            <TableCell align="center" component="th" scope="row">
              <TextField
                id={'fncnAmt'}
                size="small"
                sx={{ width: '100%' }}
                defaultValue={item.fncnAmt}
                onChange={(e) => (item.fncnAmt = e.target.value)}
              />
            </TableCell>
            <TableCell align="center" component="th" scope="row">
              <TextField
                id={'memo'}
                size="small"
                sx={{ width: '100%' }}
                defaultValue={item.memo}
                onChange={(e) => (item.memo = e.target.value)}
              />
            </TableCell>
            <TableCell align="center" component="th" scope="row">
              <Box sx={{ px: 2 }}>
                <IconButton
                  onClick={() => onClickDelete(i)}
                  size="small"
                  sx={{ border: `1px solid ${theme.palette.text.sub}` }}
                >
                  <Remove />
                </IconButton>
              </Box>
            </TableCell>
          </TableRow>
        )
        rowList.push(row)
      }
      return rowList
    }
  }, [list])

  return (
    <>
      {renderHnfInfo()}
      <TableRow key={commonFn.createKey()}>
        <TableCell colSpan={3} align="center" component="th" scope="row">
          <Button onClick={onClickAdd} color="secondary" variant="outlined" endIcon={<AddIcon />}>
            행 추가
          </Button>
          {/* {
            <IconButton
              onClick={() => onClickDelete(item)}
              size="small"
              sx={{ border: `1px solid ${theme.palette.text.sub}` }}
            >
              <Remove />
            </IconButton>
          } */}
        </TableCell>
      </TableRow>
    </>
  )
})

export default FncnInfo
