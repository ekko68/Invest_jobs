import { Add } from '@mui/icons-material'
import {
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  InputAdornment,
  MenuItem,
  Radio,
  RadioGroup,
  TableCell,
  TableRow,
  Typography,
  useTheme,
  TextField
} from '@mui/material'
import { BtSelect } from 'components/bt/BtSelect/BtSelect'
import { createKey } from 'modules/utils/CommonUtils'
import TextFieldInput from 'components/common/TextFieldInput'
import MuiNumberInput from 'pageComponents/common/number/MuiNumberInput'
import React, { forwardRef, memo, useCallback, useEffect, useImperativeHandle, useState } from 'react'

const FncnEnlsPsstList = forwardRef(
  ({ fncnEnlsPsstList, list, investTotal, setInvestTotal, ratioTotal, setRatioTotal, vo}, ref) => {
    const theme = useTheme()
    const [rdoRatioActive, setRdoRatioActive] = useState(0)

    useImperativeHandle(ref, () => ({}))
    useEffect(() => {
      changeNow()
      if(vo.ibkPrplAmt !== 0 && list[0].invstInst !== "") {
        let sum = 0
        list.forEach((item) => {
          if (item.invstMny !== 0) {
            sum += Number(item.invstMny)
          }
        })
        sum += Number(vo.ibkPrplAmt)
        setInvestTotal(sum)   
        settingRateDate(sum)
      }
    }, [vo])
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
      item['invstInst'] = ''
      item['invstMny'] = 0
      item['rate'] = 0
      item['invstMnyRdoY'] = false
      item['invstMnyRdoN'] = true
      item['progrsStg'] = ''
      item['rgsnUserId'] = ''
      item['key'] = createKey()
      return item
    }

    // 라디오 버튼 값 체크
    const handleRdoChk = (e, j, data) => {
        let num = 0
        if (e.target.id === 'invstMnyY' + j) {
          data.invstMnyRdoY = true
          data.invstMnyRdoN = false
          num = j + 2
        } else if (e.target.id === 'invstMnyN' + j) {
          data.invstMnyRdoY = false
          data.invstMnyRdoN = true
          data.invstMny = '0'
          data.rate = '0'
          let sum = 0

          for (let i = 0; i < list.length; i++) {
            if (list[i].invstMny !== 0) {
              sum += Number(list[i].invstMny)
            }
          }

          sum += Number(vo.ibkPrplAmt)
          setInvestTotal(Math.abs(sum))
          num = j - 2
          
          settingRateDate(sum)        
        }
        setRdoRatioActive(num)
    }

    // 결성목표액(원) 계산
    const changeNow = useCallback(() => {
        let sum = 0
        if (list.length < 20) {
          if(list[0].invstInst !== "") {
            for (let i = 0; i < list.length; i++) {
              sum += Number(list[i].invstMny)
            }
            sum += Number(vo.ibkPrplAmt)
            setInvestTotal(sum)   
            settingRateDate(sum)  
          }
        }
      },
      [investTotal, ratioTotal, vo]
    )
    
    // 비율 세팅
    const settingRateDate = (sum)=> {
      let sum2 = 0;
      
      for (let i = 0; i < list.length; i++) {
        let rate = (Number(list[i].invstMny) / sum) * 100

        list[i].rate = Number(rate.toFixed(1))
        sum2 += Math.round(list[i].rate)
      }

      let ibkRate = (Number(vo.ibkPrplAmt) / sum) * 100
      vo.ibkPrplRto = ibkRate.toFixed(1)
      sum2 += Number(vo.ibkPrplRto)

      if(Math.round(sum2) === 99) {
        setRatioTotal(Math.ceil(sum2))   
      }else if(Math.round(sum2) === 101) {
        setRatioTotal(Math.floor(sum2))   
      }else {
        setRatioTotal(Math.round(sum2))   
      }
    }

    // 출자자 모집현황
    const renderFncnEnlsPsstList = useCallback(() => {
      const rowList = []

      if (list.length > 0) {
        for (let i = 0; i < list.length; i++) {
          const item = list[i]
          const row = (
            <TableRow key={createKey()}>
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
                <FormControl>
                  <RadioGroup row>
                    <FormControlLabel
                      control={
                        <Radio
                          value="Y"
                          id={'invstMnyY' + i}
                          onClick={(e) => handleRdoChk(e, i, item)}
                          checked={item.invstMnyRdoY === true}
                        />
                      }
                      label={
                        <MuiNumberInput
                          size="small"
                          item={item}
                          type={'hundMilliwon'}
                          numberProperty="invstMny"
                          sx={{ width: '6rem' }}
                          displayValue={item['invstMny']}
                          changeNow={() => changeNow()}
                          disabled={item.invstMnyRdoY === false}
                        />
                      }
                    />
                    <FormControlLabel
                      control={
                        <Radio
                          value="N"
                          id={'invstMnyN' + i}
                          onClick={(e) => handleRdoChk(e, i, item)}
                          checked={item.invstMnyRdoN === true}
                        />
                      }
                      label="미정"
                    />
                  </RadioGroup>
                </FormControl>
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
                  type="percent"
                  numberProperty="rate"
                  sx={{ width: '6rem' }}
                  displayValue={item['rate']}
                  readOnly={true}
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
              </TableCell>
            </TableRow>
          )
          rowList.push(row)
        }
      }
      const row2 = (
        <TableRow>
          <TableCell colSpan={4} align="center" component="th" scope="row">
            <Button variant="outlined" endIcon={<Add />} onClick={onClickAdd}>
              행 추가
            </Button>
          </TableCell>
        </TableRow>
      )
      rowList.push(row2)
      const row3 = (
        <TableRow>
          <TableCell align="center" component="th" scope="row">
            <Typography>IBK</Typography>
          </TableCell>
          <TableCell
            align="center"
            component="th"
            scope="row"
            sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
          >
          <TextField
              size="small"
              value={vo['ibkPrplAmt']}
              InputProps={{ endAdornment: <InputAdornment position="end">억원</InputAdornment> }}
              sx={{ width: '100%' }}
              disabled={true}
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
              sx={{ width: '10rem' }}
              numberProperty="ibkPrplRto"
              type='percent'
              name="ibkPrplRto"
              item={vo}
              displayValue={vo.ibkPrplRto}
              readOnly={true}
            />
            
          </TableCell>
          <TableCell align="left" component="th" scope="row" sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}>
            <TextField size="small" sx={{ width: '100%' }} value={'제안'} disabled></TextField>
          </TableCell>
        </TableRow>
      )
      rowList.push(row3)

      return rowList
    })

    return renderFncnEnlsPsstList()
  }
)

export default memo(FncnEnlsPsstList)
