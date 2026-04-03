import {
  Grid,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material'
import { BtContentGrid } from 'components/bt/BtContentGrid'
import TextFieldInput from 'components/common/TextFieldInput'
import ManageHnfInfoList from 'pageComponents/ibkPrplCntr/fund/ManageHnfInfoList'
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

const ManageHnfInfo = forwardRef((props, ref) => {
  const { vo, theme, copy } = props
  const [totalNm, setTotalNm] = useState(0)
  const [currentWork, setCurrentWork] = useState(0)
  const [manageHnfInfo, setManageHnfInfo] = useState([])

  useImperativeHandle(ref, () => ({
    manageHnfInfoResult
  }))

  const manageHnfInfoResult = () => {
    return manageHnfInfo
  }

  useEffect(() => {
    if (vo.utlinsttId !== '') {
      const arrTemp = [...vo.opratnHnfInfoDscplL]
      const opratnHnfInfoDscplLResult = []
      for (let i = 0; i < arrTemp.length; i++) {
        const resObj = {
          sqn: arrTemp[i].sqn,
          name: arrTemp[i].name,
          rmdp: arrTemp[i].rmdp,
          rmrk: arrTemp[i].rmrk,
          rgsnUserId: arrTemp[i].rgsnUserId
        }

        opratnHnfInfoDscplLResult.push(resObj)
      }
      setManageHnfInfo(opratnHnfInfoDscplLResult)

      let total1 = 0
      let total2 = 0
      const temp = [...opratnHnfInfoDscplLResult]
      temp.forEach((item) => {
        total1 += item.name === '' ? 0 : 1
        total2 += item.rmdp === '' ? 0 : 1
      })
      setTotalNm(total1)
      setCurrentWork(total2)
    }
  }, [vo])

  return (
    <>
      <Stack direction={'column'} spacing={1}>
        <Grid container sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
          <BtContentGrid gridXs={6} title={'총 관리인력 수'} required={true}>
            <TextFieldInput
              title={'총 관리인력 수'}
              size="small"
              values={vo.manageHnfInfoTotCo}
              item={vo}
              numberProperty="manageHnfInfoTotCo"
              disabled={copy === 'view'}
            />
          </BtContentGrid>

          <BtContentGrid gridXs={6} title={'전문자격증 보유인력'} required={true}>
            <TextFieldInput
              title={'전문자격증 보유인력'}
              size="small"
              values={vo.manageHnfInfoHnf}
              item={vo}
              numberProperty="manageHnfInfoHnf"
              disabled={copy === 'view'}
            />
          </BtContentGrid>

          <BtContentGrid gridXs={12} title={'관리인력 정보'}>
            <TableContainer component={Paper} sx={{ borderRadius: 0, boxShadow: 'none' }}>
              <Table size="small" sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead
                  sx={{
                    borderTop: `1px solid ${theme.palette.divider}`
                  }}
                >
                  <TableRow>
                    <TableCell align="center">이름</TableCell>
                    <TableCell align="center" sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}>
                      리스크 관리경력
                    </TableCell>
                    <TableCell align="center" sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}>
                      비고
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <ManageHnfInfoList
                    key={'manageHnfInfo'}
                    type={'manageHnfInfo'}
                    keyProp={'manageHnfInfo'}
                    {...manageHnfInfo}
                    showMonthYearPicker={true}
                    list={manageHnfInfo}
                    copy={copy}
                    totalNm={totalNm}
                    setTotalNm={setTotalNm}
                    currentWork={currentWork}
                    setCurrentWork={setCurrentWork}
                  />
                  <TableRow>
                    <TableCell align="center" component="th" scope="row">
                      <Typography variant="h6" color={'primary'}>
                        총 {totalNm}명
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                      component="th"
                      scope="row"
                      sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                    >
                      <Typography variant="h6" color={'primary'}>
                        현재 재직 {currentWork}명
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                      component="th"
                      scope="row"
                      sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                    >
                      <Typography variant="h6" color={'primary'}></Typography>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </BtContentGrid>
        </Grid>
      </Stack>
    </>
  )
})

export default React.memo(ManageHnfInfo)
