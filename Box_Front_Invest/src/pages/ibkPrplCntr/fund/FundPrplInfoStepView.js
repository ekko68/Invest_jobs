import { FiberManualRecordOutlined } from '@mui/icons-material'
import {
  Button,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme
} from '@mui/material'
import { BtContentGrid } from 'components/bt/BtContentGrid'
import { BtSelect } from 'components/bt/BtSelect/BtSelect'
import DatePickerItem from 'components/common/DatePickerItem'
import dayjs from 'dayjs'
import Api from 'modules/consts/Api'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import CommonAxios, { getConfig, getPostConfig } from 'modules/utils/CommonAxios'
import { createKey } from 'modules/utils/CommonUtils'
import QueryUtils from 'modules/utils/QueryUtils'
import { exeFunc } from 'modules/utils/ReactUtils'
import { StringUtils } from 'modules/utils/StringUtils'
import ConfirmPopup from 'pageComponents/common/pop/ConfirmPopup'
import { useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import MuiNumberInput from 'pageComponents/common/number/MuiNumberInput'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'

const FundPrplInfoStepView = (props) => {
  const history = useHistory()
  const [investTotal, setInvestTotal] = useState(0)
  const [ratioTotal, setRatioTotal] = useState(0)
  const commonContext = useContext(CommonContext)
  const confirmPopupRef = useRef()
  const alertPop = useRef()

  // 주요LP 지원 및 선정분야
  const [prmrLpChcFildList, setPrmrLpChcFildList] = useState([])

  // 출자자 모집현황
  const [fncnEnlsPsstList, setFncnEnlsPsstList] = useState([])

  // 기본 데이터
  const [vo, setVo] = useState({
    utlinsttId: '', //운용사명
    fundId: '', //펀드id
    fundNm: '', //펀드명
    fundPtrn: 0, //펀드유형
    orgzTrgpft: '', // 결성목표액
    ibkInvstmntPrplAmt: '', // 제안금액
    stdrErnRt: '', // 기준수익률
    cntnncPdyy: '', // 존속기간
    rsltMendngIrrExcessErn: '', // 성과보수
    invtPdyy: '', // 투자기간
    mngMendngRt: '', // 관리보수
    pmntMthd: 0, // 납부방식
    invtTgt: '', // 투자대상
    orgzTgpr: '', // 결성목표가
    orgzRto: '', // 결성 목표율
    auditStg: '', //심사단계
    rplyCon: '', // 답변내용
    fundDsnc: 0, //펀드유형
    gpFncnInfo: '', // gp출자금액
    ProposalDocBaseDay: '', // 제안서 기준일
    prmrLpChcFild: [],
    fncnEnlsPsst: []
  })

  // 복사본 만들기
  const copyData = () => {
    const url =
      ROUTER_NAMES.FUND_PRPL_INFO_STEP + '?utlinsttId=' + commonContext.state.user.info.groupId + '&fundId=' + vo.fundId
    history.push(url, { copy: 'write' })
  }

  // 제안 취소 팝업 호출
  const showConfirmPop = () => {
    exeFunc(confirmPopupRef, 'open', '제출 완료된 펀드제안을 정말 취소하시겠습니까?')
  }

  // 다음 페이지 이동
  const nextStepPage = () => {
    const url =
      ROUTER_NAMES.FUND_PRPL_INFO_STEP_VIEW2 +
      '?utlinsttId=' +
      commonContext.state.user.info.groupId +
      '&fundId=' +
      vo.fundId
    history.push(url, { copy: 'view', fundNm: vo.fundNm })
  }

  // 제안 취소
  const fundSupportCancel = async () => {
    const param = { ...vo, auditStg: 'cancel' }
    let isSaveComplete = true

    console.log('param Vo = ', param)
    const url = Api.fund.fundPrplInfoCancle + '/' + vo.fundId
    const updateRes = await CommonAxios(getPostConfig(url, param), true)
    console.log('updateRes ==== ', updateRes)

    if (updateRes) {
      if (updateRes.data.code !== '200') {
        isSaveComplete = false
        exeFunc(alertPop, 'open', updateRes.data.message)
      }
    } else {
      isSaveComplete = false
    }

    if (isSaveComplete) {
      history.push(ROUTER_NAMES.FUND_PRPL_INFO_LIST_VIEW)
    }
  }

  // 계속작성이나 상세페이지 왔을 때 상세조회
  const loadFundDetail = async () => {
    const query = QueryUtils.getQuery(props)
    const url = Api.fund.fundPrplInfoSave + '/' + query['fundId']
    const res = await CommonAxios(getConfig(url), false)

    if (res && res.status === 200) {
      return res.data.data
    }
  }

  // 주요 LP지원 및 선정 데이터 세팅
  const prmrLpChcFildSetFunc = (getPrmrLpChcFild) => {
    const prmrLpChcFildLength = prmrLpChcFildList.length - getPrmrLpChcFild.length
    const resultPrmrLpChcFild = []

    for (let i = 0; i < getPrmrLpChcFild.length; i++) {
      const resObj = {
        sqn: getPrmrLpChcFild[i].sqn,
        fundId: getPrmrLpChcFild[i].fundId,
        invstInst: getPrmrLpChcFild[i].invstInst,
        sprnFild: getPrmrLpChcFild[i].sprnFild,
        sprnAmt: getPrmrLpChcFild[i].sprnAmt,
        progrsStg: getPrmrLpChcFild[i].progrsStg,
        rgsnUserId: getPrmrLpChcFild[i].rgsnUserId,
        rgsnTs: getPrmrLpChcFild[i].rgsnTs
      }
      resultPrmrLpChcFild.push(resObj)
    }

    for (let i = 0; i < prmrLpChcFildLength; i++) {
      const resObj = {
        sqn: resultPrmrLpChcFild[i].sqn + 1,
        fundId: '',
        invstInst: '',
        sprnFild: '',
        sprnAmt: '',
        progrsStg: 0,
        rgsnUserId: '',
        rgsnTs: ''
      }
      resultPrmrLpChcFild.push(resObj)
    }

    setPrmrLpChcFildList(resultPrmrLpChcFild)
  }

  // 출자자 모집현황 데이터 세팅
  const fncnEnlsPsstFunc = (getFncnEnlsPsst) => {
    const resultList = []
    const fncnEnlsPsstLength = fncnEnlsPsstList.length - getFncnEnlsPsst.length

    for (let i = 0; i < getFncnEnlsPsst.length; i++) {
      const resObj = {
        sqn: getFncnEnlsPsst[i].sqn,
        fundId: getFncnEnlsPsst[i].fundId,
        invstInst: getFncnEnlsPsst[i].invstInst,
        invstMny: getFncnEnlsPsst[i].invstMny,
        rate: getFncnEnlsPsst[i].rate,
        progrsStg: getFncnEnlsPsst[i].progrsStg,
        rgsnUserId: getFncnEnlsPsst[i].rgsnUserId,
        rgsnTs: getFncnEnlsPsst[i].rgsnTs,
        invstMnyRdoY: false,
        invstMnyRdoN: false,
        rateRdoY: false,
        rateRdoN: false
      }
      if (resObj.invstMny !== ' ') {
        resObj.invstMnyRdoY = true
      } else {
        resObj.invstMnyRdoN = true
      }

      resultList.push(resObj)
    }
    for (let i = 0; i < fncnEnlsPsstLength; i++) {
      const resObj = {
        sqn: resultList[i].sqn + 1,
        invstInst: '',
        invstMny: '',
        rate: 0,
        progrsStg: 0,
        rgsnUserId: '',
        rgsnTs: '',
        invstMnyRdoY: false,
        invstMnyRdoN: false,
        rateRdoY: false,
        rateRdoN: false
      }
      resultList.push(resObj)
    }
    setFncnEnlsPsstList(resultList)
  }

  const isMounted = useRef(false) //useEffect에서 mount 유무 동기확인을 위함

  useEffect(() => {
    if (commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
      isMounted.current = true

      commonContext.actions.pageMountPathCheck(history, async () => {
        const query = QueryUtils.getQuery(props)
        if (query && query.hasOwnProperty('utlinsttId')) {
          const fundDetailObject = await loadFundDetail()
          if (fundDetailObject !== null) {
            console.log('fundDetailObject view = ', fundDetailObject)
            setVo(fundDetailObject)

            const getPrmrLpChcFild = fundDetailObject.prmrLpChcFild
            const getFncnEnlsPsst = fundDetailObject.fncnEnlsPsst

            prmrLpChcFildSetFunc(getPrmrLpChcFild)
            fncnEnlsPsstFunc(getFncnEnlsPsst)
            setInvestTotal(fundDetailObject.orgzTgpr)       
            setRatioTotal(fundDetailObject.orgzRto)
          }
        }
      })
    }
  }, [commonContext.state.user])

  const theme = useTheme()

  return (
    <>
      <Container maxWidth="false" disableGutters sx={{ maxWidth: '1280px', px: '1.25rem' }}>
        <Stack spacing={4} direction={'column'} sx={{ py: 5 }}>
          <Paper sx={{ p: 4 }}>
            <Stepper activeStep={0} alternativeLabel>
              <Step key={'0'}>
                <StepLabel>제안 펀드 정보</StepLabel>
              </Step>
              <Step key={'1'}>
                <StepLabel>운용사 상세 정보</StepLabel>
              </Step>
              <Step key={'2'}>
                <StepLabel>답변 확인</StepLabel>
              </Step>
            </Stepper>
          </Paper>

          {/* 제안 펀드 정보 */}
          <Paper sx={{ p: 4 }}>
            <Stack direction={'column'} spacing={4}>
              <Stack direction={'column'} spacing={1}>
                <Typography variant="h3">
                  <FiberManualRecordOutlined color="primary" sx={{ mr: 1, fontSize: '1rem' }} />
                  제안 펀드 정보
                </Typography>
                <Divider sx={{ height: '1px', backgroundColor: theme.palette.primary.main }} />
              </Stack>

              <Stack direction={'column'} spacing={1}>
                <Grid container sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
                  <BtContentGrid gridXs={6} title={'펀드명'} required={true}>
                    <TextField
                      size="small"
                      value={vo.fundNm}
                      disabled
                      sx={{ width: '100%', backgroundColor: theme.palette.disabled.lighter }}
                    />
                  </BtContentGrid>
                  <DatePickerItem
                    format="YYYY-MM-DD"
                    title={'제안서 기준일'}
                    sx={{ width: '100%' }}
                    numberProperty="ProposalDocBaseDay"
                    item={vo}
                    values={dayjs(vo.ProposalDocBaseDay)}
                    disabled={true}
                  />
                  <BtContentGrid gridXs={6} title={'펀드유형'} required={true}>
                    <BtSelect defaultValue={vo.fundPtrn} disabled={true}>
                      <MenuItem disabled value={' '}>
                        선택하세요
                      </MenuItem>
                      <MenuItem value={'FNP01001'}>벤처투자조합</MenuItem>
                      <MenuItem value={'FNP01002'}>신기술투자조합</MenuItem>
                      <MenuItem value={'FNP01003'}>일반 PEF</MenuItem>
                      <MenuItem value={'FNP01004'}>전문투자형 PEF</MenuItem>
                      <MenuItem value={'FNP01005'}>기타</MenuItem>
                    </BtSelect>
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'GP출자금액'}>
                    <TextField
                      size="small"
                      value={vo.gpFncnInfo}
                      disabled
                      sx={{ width: '100%', backgroundColor: theme.palette.disabled.lighter }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">억원</InputAdornment>
                      }}
                    />
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'펀드 구분'}>
                    <BtSelect defaultValue={vo.fundDsnc} disabled={true}>
                      <MenuItem disabled value={' '}>
                        선택하세요
                      </MenuItem>
                      <MenuItem value={'BLIND'}>블라인드</MenuItem>
                      <MenuItem value={'PRJT'}>프로젝트</MenuItem>
                    </BtSelect>
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'결성목표액'} required={true}>
                    <TextField
                      size="small"
                      value={vo.orgzTrgpft}
                      disabled
                      sx={{ width: '100%', backgroundColor: theme.palette.disabled.lighter }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">억원</InputAdornment>
                      }}
                    />
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'IBK출자 제안금액'} required={true}>
                    <TextField
                      size="small"
                      value={vo.ibkInvstmntPrplAmt}
                      disabled
                      sx={{ width: '100%', backgroundColor: theme.palette.disabled.lighter }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">억원</InputAdornment>
                      }}
                    />
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'기준수익률(IRR)'} required={true}>
                    <TextField
                      size="small"
                      value={vo.stdrErnRt}
                      disabled
                      sx={{ width: '100%', backgroundColor: theme.palette.disabled.lighter }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                      }}
                    />
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'존속기간'} required={true}>
                    <TextField
                      size="small"
                      value={vo.cntnncPdyy}
                      disabled
                      sx={{ width: '100%', backgroundColor: theme.palette.disabled.lighter }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">년</InputAdornment>
                      }}
                    />
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'성과보수'} required={true}>
                    <TextField
                      size="small"
                      value={vo.rsltMendngIrrExcessErn}
                      disabled
                      sx={{ width: '100%', backgroundColor: theme.palette.disabled.lighter }}
                      InputProps={{
                        startAdornment: <InputAdornment position="start">IRR 초과수익의</InputAdornment>,
                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                      }}
                    />
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'투자기간'} required={true}>
                    <TextField
                      size="small"
                      value={vo.invtPdyy}
                      disabled
                      sx={{ width: '100%', backgroundColor: theme.palette.disabled.lighter }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">년</InputAdornment>
                      }}
                    />
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'관리보수'} required={true}>
                    <TextField
                      size="small"
                      value={vo.mngMendngRt}
                      disabled
                      sx={{ width: '100%', backgroundColor: theme.palette.disabled.lighter }}
                      InputProps={{
                        endAdornment: <InputAdornment position="end">%</InputAdornment>
                      }}
                    />
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'납부방식'} required={true}>
                    <BtSelect defaultValue={vo.pmntMthd} disabled={true}>
                      <MenuItem disabled value={0}>
                        선택하세요
                      </MenuItem>
                      <MenuItem value={'PMT01001'}>수시납</MenuItem>
                      <MenuItem value={'PMT01002'}>분할납</MenuItem>
                      <MenuItem value={'PMT01003'}>일시납</MenuItem>
                    </BtSelect>
                  </BtContentGrid>
                  <BtContentGrid gridXs={12} title={'투자대상'}>
                    <TextField
                      size="small"
                      value={vo.invtTgt}
                      disabled
                      sx={{ width: '100%', backgroundColor: theme.palette.disabled.lighter }}
                    />
                  </BtContentGrid>
                  <BtContentGrid gridXs={12} title={'주요LP 지원 및 선정분야'}>
                    <TableContainer component={Paper} sx={{ borderRadius: 0, boxShadow: 'none' }}>
                      <Table size="small" sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead
                          sx={{
                            borderTop: `1px solid ${theme.palette.divider}`
                          }}
                        >
                          <TableRow>
                            <TableCell align="center">출자기관</TableCell>
                            <TableCell align="center" sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}>
                              지원 분야
                            </TableCell>
                            <TableCell align="center" sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}>
                              지원 금액(억원)
                            </TableCell>
                            <TableCell align="center" sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}>
                              진행 단계
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {prmrLpChcFildList.map((data, i) => (
                            <TableRow key={createKey()}>
                              <TableCell align="center" component="th" scope="row">
                                <TextField size="small" sx={{ width: '100%' }} value={data.invstInst} disabled />
                              </TableCell>
                              <TableCell
                                align="center"
                                component="th"
                                scope="row"
                                sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                              >
                                <TextField size="small" sx={{ width: '100%' }} value={data.sprnFild} disabled />
                              </TableCell>
                              <TableCell
                                align="left"
                                component="th"
                                scope="row"
                                sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                              >
                                <TextField sx={{ width: '100%' }} size="small" value={data.sprnAmt} disabled />
                              </TableCell>
                              <TableCell
                                align="left"
                                component="th"
                                scope="row"
                                sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                              >
                                <TextField size="small" value={data.progrsStg} disabled sx={{ width: '100%' }} />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </BtContentGrid>
                  <BtContentGrid gridXs={12} title={'출자자 모집현황'} required={true}>
                    <TableContainer component={Paper} sx={{ borderRadius: 0, boxShadow: 'none' }}>
                      <Table size="small" sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead
                          sx={{
                            borderTop: `1px solid ${theme.palette.divider}`
                          }}
                        >
                          <TableRow>
                            <TableCell align="center">출자기관</TableCell>
                            <TableCell align="center" sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}>
                              출자 금액
                            </TableCell>
                            <TableCell align="center" sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}>
                              비율
                            </TableCell>
                            <TableCell align="center" sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}>
                              진행 단계
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {fncnEnlsPsstList.map((data, j) => (
                            <TableRow key={createKey()}>
                              <TableCell align="center" component="th" scope="row">
                                <TextField size="small" value={data.invstInst} sx={{ width: '100%' }} disabled />
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
                                      control={<Radio value="Y" checked={data.invstMnyRdoY === true} disabled />}
                                      label={
                                        <TextField size="small" sx={{ width: '6rem' }} value={data.invstMny} disabled />
                                      }
                                    />
                                    <FormControlLabel
                                      control={<Radio value="N" checked={data.invstMnyRdoN === true} disabled />}
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
                                  item={data}
                                  numberProperty="rate"
                                  sx={{ width: '6rem' }}
                                  displayValue={data.rate}
                                  disabled
                                />
                              </TableCell>
                              <TableCell
                                align="left"
                                component="th"
                                scope="row"
                                sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                              >
                                <TextField size="small" value={data.progrsStg} disabled sx={{ width: '100%' }} />
                              </TableCell>
                            </TableRow>
                          ))}

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
                                value={vo.ibkPrplAmt}
                                InputProps={{ endAdornment: <InputAdornment position="end">억원</InputAdornment> }}
                                disabled
                                sx={{ width: '10rem', backgroundColor: theme.palette.disabled.lighter }}
                              />
                            </TableCell>
                            <TableCell
                              align="center"
                              component="th"
                              scope="row"
                              sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                            >
                              <TextField
                                size="small"
                                value={vo.ibkPrplRto}
                                InputProps={{ endAdornment: <InputAdornment position="end">%</InputAdornment> }}
                                disabled
                                sx={{ width: '10rem', backgroundColor: theme.palette.disabled.lighter }}
                              />
                            </TableCell>
                            <TableCell
                              align="left"
                              component="th"
                              scope="row"
                              sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                            >
                              <TextField size="small" value={'제안'} disabled sx={{ width: '100%' }} />
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell align="center" component="th" scope="row">
                              <Typography variant="h6" color={'primary'}>
                                결성목표액
                              </Typography>
                            </TableCell>
                            <TableCell
                              align="center"
                              component="th"
                              scope="row"
                              sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                            >
                              <Typography variant="h6" color={'primary'}>
                                {StringUtils.comma(investTotal)} 억원
                              </Typography>
                            </TableCell>
                            <TableCell
                              align="center"
                              component="th"
                              scope="row"
                              sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                            >
                              <Typography variant="h6" color={'primary'}>
                                {ratioTotal}%
                              </Typography>
                            </TableCell>
                            <TableCell
                              align="left"
                              component="th"
                              scope="row"
                              sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                            ></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </BtContentGrid>
                </Grid>
              </Stack>

              <Stack direction={'row'} spacing={1} justifyContent="center" alignItems="center">
                {(vo.auditStg === 'AUD01001' && (
                  <Button size="large" variant="outlined" onClick={showConfirmPop} disableElevation>
                    제안 취소
                  </Button>
                )) ||
                  (vo.auditStg === 'cancel' && (
                    <Button size="large" variant="outlined" onClick={copyData} disableElevation>
                      복사본 만들기
                    </Button>
                  ))}
                <Button size="large" variant="contained" onClick={nextStepPage} disableElevation>
                  다음
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Container>

      <ConfirmPopup ref={confirmPopupRef} onConfirm={fundSupportCancel} />
      <AlertPopup ref={alertPop} />
      {/* End of Contents */}
    </>
  )
}

export default FundPrplInfoStepView
