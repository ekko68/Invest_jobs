import { Add } from '@mui/icons-material'
import {
  Button,
  FormControlLabel,
  Grid,
  InputAdornment,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  IconButton
} from '@mui/material'
import { BtContentGrid } from 'components/bt/BtContentGrid'
import { createKey } from 'modules/utils/CommonUtils'
import React, { useState, forwardRef, useCallback, useImperativeHandle, useEffect, useRef } from 'react'
import MuiNumberInput from 'pageComponents/common/number/MuiNumberInput'
import TextFieldInput from 'components/common/TextFieldInput'
import ProFundPartcptnList from 'pageComponents/ibkPrplCntr/fund/ProFundPartcptnList'
import OpratnHmfMntncList from 'pageComponents/ibkPrplCntr/fund/OpratnHmfMntncList'
import QuestionMarkIcon from '@mui/icons-material/QuestionMark'
import Tooltip from '@mui/material/Tooltip'

const OprtorHmfInfo = forwardRef((props, ref) => {
  const { vo, theme, copy } = props
  const [totalPrs, setTotalPrs] = useState(0)
  const [totalCurrent, setTotalCurrent] = useState(0)

  useImperativeHandle(ref, () => ({
    resultObj
  }))

  // 제안 펀드 참여 운용 인력
  const [proFundPartcptn, setProFundPartcptn] = useState([])

  // 운용인력 유지율
  const [opratnHmfMntnc, setOpratnHmfMntnc] = useState([])

  const [rdoRatioActive, setRdoRatioActive] = useState(0)
  const [opratnHnfInfoDscplYn, setOpratnHnfInfoDscplYn] = useState('')

  const resultObj = () => {
    const temp = [opratnHmfMntnc, proFundPartcptn, opratnHnfInfoDscplYn]
    return temp
  }

  // 라디오 버튼 컨트롤
  const rdoClickBtn = useCallback((e, item) => {
    if (e.target.id === 'opratnHnfInfoDscplY') {
      setOpratnHnfInfoDscplYn('Y')
    } else if (e.target.id === 'opratnHnfInfoDscplN') {
      setOpratnHnfInfoDscplYn('N')
    }
  })

  useEffect(() => {
    if (vo.utlinsttId !== '') {
      // 제안펀드 참여 운용 인력 세팅
      const arrTemp = [...vo.proFundPartcptn]
      const proFundPartcptnResult = []
      for (let i = 0; i < arrTemp.length; i++) {
        const resObj = {
          sqn: arrTemp[i].sqn,
          hmrsDsnc : arrTemp[i].hmrsDsnc,
          partcptnNm: arrTemp[i].partcptnNm,
          invtCareer: arrTemp[i].invtCareer,
          cnwkYyCnt: arrTemp[i].cnwkYyCnt,
          fiveFyerInvmAmt: arrTemp[i].fiveFyerInvmAmt,
          tenFyerInvmRtrvlacrsInvt: arrTemp[i].tenFyerInvmRtrvlacrsInvt,
          tenFyerInvmRtrvlacrsRtrvl: arrTemp[i].tenFyerInvmRtrvlacrsRtrvl,
          rgsnUserId: arrTemp[i].rgsnUserId
        }

        proFundPartcptnResult.push(resObj)
      }
      setProFundPartcptn(proFundPartcptnResult)

      // 운용인력 유지율 세팅
      const tempArr = [...vo.opratnHmfMntnc]
      const opratnHmfResult = []
      for (let i = 0; i < tempArr.length; i++) {
        const resObj = {
          sqn: tempArr[i].sqn,
          fundId: vo.fundId,
          opratnHnfNm: tempArr[i].opratnHnfNm,
          nowHffcY: false,
          nowHffcN: false,
          nowHffcYn: tempArr[i].nowHffcYn,
          rm: tempArr[i].rm,
          rgsnUserId: tempArr[i].rgsnUserId
        }
        if (resObj.nowHffcYn === 'Y') {
          resObj.nowHffcY = true
        } else if (resObj.nowHffcYn === 'N') {
          resObj.nowHffcN = true
        }

        opratnHmfResult.push(resObj)
      }

      setOpratnHmfMntnc(opratnHmfResult)
      if (vo.opratnHnfInfoDscplYn === 'Y') {
        setOpratnHnfInfoDscplYn('Y')
      } else if (vo.opratnHnfInfoDscplYn === 'N') {
        setOpratnHnfInfoDscplYn('N')
      }
      let total1 = 0
      let total2 = 0
      for (let i = 0; i < opratnHmfResult.length; i++) {
        total1 += opratnHmfResult[i].opratnHnfNm === '' ? 0 : 1
        total2 += opratnHmfResult[i].nowHffcYn === 'Y' ? 1 : 0
      }
      setTotalPrs(total1)
      setTotalCurrent(total2)
    }
  }, [vo])

  return (
    <>
      <Stack direction={'column'} spacing={1}>
        <Grid container sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
          <BtContentGrid gridXs={6} title={'총 운용인력 수'} required={true}>
            <TextFieldInput
              title={'총 운용인력 수'}
              size="small"
              values={vo.opratnHnfInfoTotCo}
              item={vo}
              numberProperty="opratnHnfInfoTotCo"
              disabled={copy === 'view'}
              requiredChk={true}
            />
          </BtContentGrid>
          <BtContentGrid gridXs={6} title={'대표 펀드 매니저명'} required={true}>
            <TextFieldInput
              title={'대표 펀드 매니저명'}
              size="small"
              values={vo.opratnHnfInfoMngrNm}
              item={vo}
              numberProperty="opratnHnfInfoMngrNm"
              disabled={copy === 'view'}
              requiredChk={true}
            />
          </BtContentGrid>
          <BtContentGrid gridXs={12} title={'운용인력 징계여부'}>
            <Stack direction="row" justifyContent="center">
              <RadioGroup row>
                <FormControlLabel
                  value="Y"
                  control={
                    <Radio
                      id={'opratnHnfInfoDscplY'}
                      onClick={(e) => rdoClickBtn(e, 'Y')}
                      checked={opratnHnfInfoDscplYn === 'Y'}
                      disabled={copy === 'view'}
                    />
                  }
                  label="Y"
                />
                <FormControlLabel
                  value="N"
                  control={
                    <Radio
                      id={'opratnHnfInfoDscplN'}
                      onClick={(e) => rdoClickBtn(e, 'N')}
                      checked={opratnHnfInfoDscplYn === 'N'}
                      disabled={copy === 'view'}
                    />
                  }
                  label="N"
                />
              </RadioGroup>
            </Stack>
          </BtContentGrid>

          <BtContentGrid gridXs={12} title={'제안펀드 참여 운용인력'} required={true}>
            <TableContainer component={Paper} sx={{ borderRadius: 0, boxShadow: 'none' }}>
              <Table size="small" sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead
                  sx={{
                    borderTop: `1px solid ${theme.palette.divider}`
                  }}
                >
                  <TableRow>
                    <TableCell align="center">인력구분</TableCell>
                    <TableCell align="center" sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}>이름</TableCell>
                    <TableCell align="center" sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}>
                      투자경력(년)
                      <Tooltip
                        title={                            
                        <>
                          <h5>사전검토표 작성일 기준, VC, AC, PEF, PI 투자경력</h5>
                        </>
                        }
                      >
                        <IconButton sx={{ padding: '0px 0px 3px 0px' }}>
                          <QuestionMarkIcon sx={{ height: '1rem' }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center" sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}>
                      근속연수(년)
                      <Tooltip
                        title={                            
                        <>
                          <h5>사전검토표 작성일 기준</h5>
                        </>
                        }
                      >
                        <IconButton sx={{ padding: '0px 0px 3px 0px' }}>
                          <QuestionMarkIcon sx={{ height: '1rem' }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center" sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}>
                      5년간 투자금액(억원)
                      <Tooltip
                        title={                            
                        <>
                          <h5>사전검토표 작성일 기준 5년이내 투자금액</h5>
                          <br />
                          <h5>* 기재사항은 증빙자료가 있는 경우에만 인정, 투자시 주 담당자로 참여한 건만 인정하며 참여인력간 중복불가</h5>
                          <br />
                          <h5>* 보통주, RCPS, CB, BW등 증권형태의 투자를 실적으로 인정, 지분인수 없는 투자(PF,LP출자,문화컨텐츠대출)는 제외</h5>
                        </>
                        }
                      >
                        <IconButton sx={{ padding: '0px 0px 3px 0px' }}>
                          <QuestionMarkIcon sx={{ height: '1rem' }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell align="center" sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}>
                      10년간 투자 중<br />
                      완전회수 실적(억원) (감액포함)
                      <Tooltip
                        title={                            
                        <>
                          <h5>{"사전검토표 작성일 기준 10년 이내 투자하여 미회수가치가 '0'인 자산의 회수실적(전액감액건 포함)"}</h5>
                        </>
                        }
                      >
                        <IconButton sx={{ padding: '0px 0px 3px 0px' }}>
                          <QuestionMarkIcon sx={{ height: '1rem' }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <ProFundPartcptnList
                    key={'proFundPartcptn'}
                    type={'proFundPartcptn'}
                    keyProp={'proFundPartcptn'}
                    {...proFundPartcptn}
                    showMonthYearPicker={true}
                    list={proFundPartcptn}
                    copy={copy}
                  />
                </TableBody>
              </Table>
            </TableContainer>
          </BtContentGrid>

          <BtContentGrid gridXs={12} title={'운용인력 유지율'} required={true}>
            <TableContainer component={Paper} sx={{ borderRadius: 0, boxShadow: 'none' }}>
              <Table size="small" sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead
                  sx={{
                    borderTop: `1px solid ${theme.palette.divider}`
                  }}
                >
                  <TableRow>
                    <TableCell align="center">운용인력명</TableCell>
                    <TableCell align="center" sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}>
                      현재 재직 여부
                    </TableCell>
                    <TableCell align="center" sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}>
                      비고
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <OpratnHmfMntncList
                    key={'opratnHmfMntnc'}
                    type={'opratnHmfMntnc'}
                    keyProp={'opratnHmfMntnc'}
                    {...opratnHmfMntnc}
                    showMonthYearPicker={true}
                    list={opratnHmfMntnc}
                    copy={copy}
                    rdoRatioActive={rdoRatioActive}
                    setRdoRatioActive={setRdoRatioActive}
                    totalPrs={totalPrs}
                    setTotalPrs={setTotalPrs}
                    setTotalCurrent={setTotalCurrent}
                  />
                  <TableRow>
                    <TableCell align="center" component="th" scope="row">
                      <Typography variant="h6" color={'primary'}>
                        총 {totalPrs}명
                      </Typography>
                    </TableCell>
                    <TableCell
                      align="center"
                      component="th"
                      scope="row"
                      sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                    >
                      <Typography variant="h6" color={'primary'}>
                        현재 재직 {totalCurrent}명
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

export default React.memo(OprtorHmfInfo)
