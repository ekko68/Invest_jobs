import { useState, useEffect, useRef, useContext, memo } from 'react'
import { useHistory } from 'react-router-dom'
import { FiberManualRecordOutlined, HomeOutlined, CheckOutlined, CloseOutlined } from '@mui/icons-material'
import { Grid, Divider, Stack, Typography, useTheme, TextField } from '@mui/material'
import { BtNavSelect } from 'components/bt/BtNavSelect'
import { BtContentGrid } from 'components/bt/BtContentGrid'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'

import { isNumber } from 'modules/utils/NumberUtils'

const VnentrLonCmRegViewCompanyInfo = (props) => {
  const { companyInfo, changeCompanyInfo, readOnly } = props
  const theme = useTheme()

  const addDashBzn = (bzn) => {
    // '617-86-11111'
    if (bzn && bzn.length > 5) {
      return `${bzn.substring(0, 3)}-${bzn.substring(3, 5)}-${bzn.substring(5, bzn.length)}`
    } else if (bzn.length > 3) {
      return `${bzn.substring(0, 3)}-${bzn.substring(3, 5)}`
    }
    return bzn
  }
  const addDashRsprCnplTpn = (rsprCnplTpn) => {
    // '010-1234-1234'
    if (rsprCnplTpn && rsprCnplTpn.length > 7) {
      return `${rsprCnplTpn.substring(0, 3)}-${rsprCnplTpn.substring(3, 7)}-${rsprCnplTpn.substring(
        7,
        rsprCnplTpn.length
      )}`
    } else if (rsprCnplTpn.length > 3) {
      return `${rsprCnplTpn.substring(0, 3)}-${rsprCnplTpn.substring(3, 7)}`
    }
    return rsprCnplTpn
  }

  return (
    <>
      <Stack direction={'column'} spacing={1}>
        <Typography variant="h3">
          <FiberManualRecordOutlined color="primary" sx={{ mr: 1, fontSize: '1rem' }} />
          기업 정보 입력
        </Typography>
        <Divider sx={{ height: '1px', backgroundColor: theme.palette.primary.main }} />
      </Stack>

      <Stack direction={'column'} spacing={1}>
        <Grid container sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
          <BtContentGrid gridXs={6} title={'기업명'}>
            <TextField
              size="small"
              value={companyInfo['etnm']}
              sx={{ width: '100%' }}
              disabled={readOnly}
            />
          </BtContentGrid>

          <BtContentGrid gridXs={6} title={'대표자명'}>
            <TextField
              size="small"
              value={companyInfo['rprnm']}
              sx={{ width: '100%' }}
              disabled={readOnly}
            />
          </BtContentGrid>

          <BtContentGrid gridXs={6} title={'사업자번호'}>
            <TextField
              size="small"
              value={addDashBzn(companyInfo['bzn'])}
              sx={{ width: '100%' }}
              disabled={readOnly}
            />
          </BtContentGrid>

          <BtContentGrid gridXs={6} title={'설립년월일'}>
            <DatePicker
              format="YYYY-MM-DD"
              sx={{ width: '100%' }}
              slotProps={{ textField: { size: 'small' } }}
              value={dayjs(companyInfo['col'])}
              onChange={(event) => {
                changeCompanyInfo('col', event.format('YYYY-MM-DD'))
              }}
              disabled={readOnly}
            />
          </BtContentGrid>

          <BtContentGrid gridXs={12} title={'본사 주소'}>
            <TextField
              size="small"
              value={companyInfo['adr']}
              sx={{ width: '100%' }}
              onChange={(event) => {
                changeCompanyInfo('adr', event.target.value)
              }}
              disabled={readOnly}
            />
          </BtContentGrid>

          <BtContentGrid gridXs={6} title={'기업 담당자명'}>
            <TextField
              size="small"
              value={companyInfo['rsprNm']}
              sx={{ width: '100%' }}
              onChange={(event) => {
                changeCompanyInfo('rsprNm', event.target.value)
              }}
              disabled={readOnly}
            />
          </BtContentGrid>

          <BtContentGrid gridXs={6} title={'담당자 직책'}>
            <TextField
              size="small"
              value={companyInfo['rsprJbclNm']}
              sx={{ width: '100%' }}
              onChange={(event) => {
                changeCompanyInfo('rsprJbclNm', event.target.value)
              }}
              disabled={readOnly}
            />
          </BtContentGrid>

          <BtContentGrid gridXs={6} title={'담당자 연락처'}>
            <TextField
              size="small"
              value={addDashRsprCnplTpn(companyInfo['rsprCnplTpn'])}
              sx={{ width: '100%' }}
              inputProps={{ maxLength: 13 }}
              onChange={(event) => {
                const valueDashRemoved = event.target.value.replaceAll('-', '').replaceAll(' ', '')
                if (isNumber(valueDashRemoved) || valueDashRemoved === '') {
                  changeCompanyInfo('rsprCnplTpn', valueDashRemoved)
                }
              }}
              disabled={readOnly}
            />
          </BtContentGrid>

          <BtContentGrid gridXs={6} title={'담당자 이메일'}>
            <TextField
              size="small"
              value={companyInfo['rsprEad']}
              sx={{ width: '100%' }}
              onChange={(event) => {
                changeCompanyInfo('rsprEad', event.target.value)
              }}
              disabled={readOnly}
            />
          </BtContentGrid>
        </Grid>
      </Stack>
    </>
  )
}
export default memo(VnentrLonCmRegViewCompanyInfo)
