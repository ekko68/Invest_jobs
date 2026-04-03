import { Add } from '@mui/icons-material'
import { Button, Stack, TableCell, TableRow, Typography, useTheme, MenuItem } from '@mui/material'
import TextFieldInput from 'components/common/TextFieldInput'
import { createKey } from 'modules/utils/CommonUtils'
import MuiNumberInput from 'pageComponents/common/number/MuiNumberInput'
import React, { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useState } from 'react'
import { BtSelect } from 'components/bt/BtSelect/BtSelect'

const ProFundPartcptnList = forwardRef(({ fncnEnlsPsstList, list, copy, title }, ref) => {
  const theme = useTheme()

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
      item[fncnEnlsPsstList] = 1
    }
    item['sqn'] = list.length + 1
    item['hmrsDsnc'] = '0'
    item['partcptnNm'] = ''
    item['invtCareer'] = ''
    item['cnwkYyCnt'] = ''
    item['fiveFyerInvmAmt'] = ''
    item['tenFyerInvmRtrvlacrsInvt'] = ''
    item['tenFyerInvmRtrvlacrsRtrvl'] = ''
    item['rgsnUserId'] = ''
    item['key'] = createKey()
    return item
  }

  const renderProFundPartcptnList = useCallback(() => {
    const rowList = []

    if (list.length > 0) {
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        const row = (
          <TableRow key={createKey()}>
            <TableCell align="center" component="th" scope="row">
              <BtSelect defaultValue={item.hmrsDsnc} disabled={copy === 'view'}>
                <MenuItem disabled value={'0'}>
                  선택하세요
                </MenuItem>
                <MenuItem value={'HMRS01'} onClick={() => item.hmrsDsnc = 'HMRS01'}>
                  대표펀드매니저
                </MenuItem>
                <MenuItem value={'HMRS02'} onClick={() => item.hmrsDsnc = 'HMRS02'}>
                  핵심운용인력
                </MenuItem>
              </BtSelect>
            </TableCell>
            <TableCell
              align="center"
              component="th"
              scope="row"
              sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
            >
              <TextFieldInput
                size="small"
                numberProperty={'partcptnNm'}
                name="partcptnNm"
                item={item}
                values={item.partcptnNm}
                disabled={copy === 'view'}
              />
            </TableCell>
            <TableCell
              align="center"
              component="th"
              scope="row"
              sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
            >
              <MuiNumberInput
                size="small"
                item={item}
                numberProperty={'invtCareer'}
                sx={{ width: '100%' }}
                displayValue={item['invtCareer']}
                disabled={copy === 'view'}
              />
            </TableCell>
            <TableCell
              align="left"
              component="th"
              scope="row"
              sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
            >
              <MuiNumberInput
                size="small"
                item={item}
                numberProperty={'cnwkYyCnt'}
                sx={{ width: '100%' }}
                displayValue={item['cnwkYyCnt']}
                disabled={copy === 'view'}
              />
            </TableCell>
            <TableCell
              align="left"
              component="th"
              scope="row"
              sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
            >
              <MuiNumberInput
                size="small"
                item={item}
                numberProperty={'fiveFyerInvmAmt'}
                displayValue={item['fiveFyerInvmAmt']}
                disabled={copy === 'view'}
              />
            </TableCell>
            <TableCell
              align="left"
              component="th"
              scope="row"
              sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
            >
              <Stack direction={'row'} spacing={2}>
                <Stack direction={'row'} alignItems="center">
                  <Typography sx={{ width: '2rem' }}>투자</Typography>
                  <MuiNumberInput
                    size="small"
                    item={item}
                    numberProperty={'tenFyerInvmRtrvlacrsInvt'}
                    displayValue={item['tenFyerInvmRtrvlacrsInvt']}
                    sx={{ width: '5rem' }}
                    disabled={copy === 'view'}
                  />
                </Stack>
                <Stack direction={'row'} alignItems="center">
                  <Typography sx={{ width: '2rem' }}>회수</Typography>
                  <MuiNumberInput
                    size="small"
                    item={item}
                    numberProperty={'tenFyerInvmRtrvlacrsRtrvl'}
                    displayValue={item['tenFyerInvmRtrvlacrsRtrvl']}
                    sx={{ width: '5rem' }}
                    disabled={copy === 'view'}
                  />
                </Stack>
              </Stack>
            </TableCell>
          </TableRow>
        )
        rowList.push(row)
      }
    }
    const row2 = (
      <TableRow>
        <TableCell colSpan={6} align="center" component="th" scope="row">
          <Button color="primary" variant="outlined" endIcon={<Add />} onClick={onClickAdd} disabled={copy === 'view'}>
            행 추가
          </Button>
        </TableCell>
      </TableRow>
    )
    rowList.push(row2)

    return rowList
  })

  return renderProFundPartcptnList()
})

export default memo(ProFundPartcptnList)
