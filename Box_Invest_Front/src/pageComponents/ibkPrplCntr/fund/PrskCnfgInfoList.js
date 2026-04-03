import { Add } from '@mui/icons-material'
import { Button, TableCell, TableRow, useTheme, Typography } from '@mui/material'
import TextFieldInput from 'components/common/TextFieldInput'
import { createKey } from 'modules/utils/CommonUtils'
import MuiNumberInput from 'pageComponents/common/number/MuiNumberInput'
import React, { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useState } from 'react'
import { StringUtils } from 'modules/utils/StringUtils'

const PrskCnfgInfoList = forwardRef(
  ({ fundStchCnfg, list, copy, prtnAmt, setPrtnAmt, prtnRto, setPrtnRto, title }, ref) => {
    const theme = useTheme()
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
        item[fundStchCnfg] = lastItem[fundStchCnfg] + 1
      } else {
        item[fundStchCnfg] = 1
      }
      item['rgsnSqn'] = list.length + 1
      item['stchNm'] = ''
      item['prtnAmt'] = 0
      item['prtnRto'] = 0
      item['rmrk'] = ''
      item['rgsnUserId'] = ''
      item['key'] = createKey()
      return item
    }
    // 주요 주주 구성 자동계산
    const autoCalc = (numberProperty) => {
      let total1 = 0
      let total2 = 0
      const temp = [...list]
      
      if (numberProperty === 'prtnAmt') {
        if (temp.length < 20) {
          temp.forEach((item) => {
            total1 += Number(item.prtnAmt)
          })
          setPrtnAmt(total1)
        }
      } else if (numberProperty === 'prtnRto') {
        if (temp.length < 20) {
          temp.forEach((item) => {
            total2 += Number(item.prtnRto)
          })
          setPrtnRto(total2)
        }
      }
    }
    

    // 주요 주주 구성
    const renderPrskCnfgInfoList = useCallback(() => {
      const rowList = []

      if (list.length > 0) {
        for (let i = 0; i < list.length; i++) {
          const item = list[i]
          const row = (
            <TableRow key={createKey()}>
              <TableCell align="center" component="th" scope="row">
                <TextFieldInput
                  size="small"
                  numberProperty={'stchNm'}
                  name="stchNm"
                  item={item}
                  values={item.stchNm}
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
                  numberProperty={'prtnAmt'}
                  name="prtnAmt"
                  item={item}
                  value={item.prtnAmt}
                  changeNow={() => autoCalc('prtnAmt')}
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
                  numberProperty={'prtnRto'}
                  name="prtnRto"
                  item={item}
                  value={item.prtnRto}
                  changeNow={() => autoCalc('prtnRto')}
                  disabled={copy === 'view'}
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
                  numberProperty={'rmrk'}
                  name="rmrk"
                  item={item}
                  values={item.rmrk}
                  disabled={copy === 'view'}
                />
              </TableCell>
            </TableRow>
            
          )
          rowList.push(row)
        }
      }
      const row2 = (
        <TableRow>
          <TableCell colSpan={4} align="center" component="th" scope="row">
            <Button
              color="primary"
              variant="outlined"
              endIcon={<Add />}
              onClick={onClickAdd}
              disabled={copy === 'view'}
            >
              행 추가
            </Button>
          </TableCell>
        </TableRow>
      )
      rowList.push(row2)
      
      const row3 = (
        <TableRow>
          <TableCell align="center" component="th" scope="row">
            <Typography variant="h6" color={'primary'}>
              합계
            </Typography>
          </TableCell>
          <TableCell
            align="center"
            component="th"
            scope="row"
            sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
          >
            <Typography variant="h6" color={'primary'}>
              {StringUtils.comma(prtnAmt)} 원
            </Typography>
          </TableCell>
          <TableCell
            align="center"
            component="th"
            scope="row"
            sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
          >
            <Typography variant="h6" color={'primary'}>
              {prtnRto}%
            </Typography>
          </TableCell>
          <TableCell
            align="left"
            component="th"
            scope="row"
            sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
          ></TableCell>
        </TableRow>
      )
      rowList.push(row3)

      return rowList
    })

    return renderPrskCnfgInfoList()
  }
)

export default PrskCnfgInfoList
