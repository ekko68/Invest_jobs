import { FiberManualRecordOutlined } from '@mui/icons-material'
import {
  Button,
  Container,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  InputAdornment,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  TextField
} from '@mui/material'
import dayjs from 'dayjs'
import { BtContentGrid } from 'components/bt/BtContentGrid'
import { BtSelect } from 'components/bt/BtSelect/BtSelect'
import DatePickerItem from 'components/common/DatePickerItem'
import TextFieldInput from 'components/common/TextFieldInput'
import Api from 'modules/consts/Api'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import CommonAxios, { getConfig, getPostConfig } from 'modules/utils/CommonAxios'
import QueryUtils from 'modules/utils/QueryUtils'
import { exeFunc } from 'modules/utils/ReactUtils'
import { StringUtils } from 'modules/utils/StringUtils'
import MuiNumberInput from 'pageComponents/common/number/MuiNumberInput'
import FncnEnlsPsstList from 'pageComponents/ibkPrplCntr/fund/FncnEnlsPsstList'
import FundValidtionPop from 'pageComponents/ibkPrplCntr/fund/FundValidtionPop'
import PrmrLpChcFildList from 'pageComponents/ibkPrplCntr/fund/PrmrLpChcFildList'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { FormatUtils } from 'modules/utils/StringUtils'

const FundPrplInfoStep = (props) => {
  const theme = useTheme()
  const history = useHistory()
  const commonContext = useContext(CommonContext)
  const [investTotal, setInvestTotal] = useState(0)
  const [ratioTotal, setRatioTotal] = useState(0)
  const popupRef = useRef()
  const fncnEnlsPsstRef = useRef()
  const [emptyVal, setEmptyVal] = useState('')
  const [copyChk, setCopyChk] = useState('')
  const numberCommaFormat = FormatUtils.numberWithCommas

  // 주요LP 지원 및 선정분야
  const [prmrLpChcFildList, setPrmrLpChcFildList] = useState([
    {
      sqn: 1,
      invstInst: '',
      sprnFild: '',
      sprnAmt: '',
      progrsStg: '',
      rgsnUserId: ''
    }
  ])
  // 출자자 모집현황
  const [fncnEnlsPsstList, setFncnEnlsPsstList] = useState([
    {
      sqn: 1,
      invstInst: '',
      invstMny: 0,
      rate: 0,
      invstMnyRdoY: false,
      invstMnyRdoN: true,
      progrsStg: '',
      rgsnUserId: ''
    }
  ])

  const [vo, setVo] = useState({
    utlinsttId: '', //운용사명
    fundId: '', //펀드ID
    fundNm: '', //펀드명
    fundPtrn: '0', //펀드유형
    orgzTrgpft: 0, // 결성목표액
    ibkInvstmntPrplAmt: '0', // 제안금액
    stdrErnRt: 0, // 기준수익률
    cntnncPdyy: '0', // 존속기간
    rsltMendngIrrExcessErn: 0, // 성과보수
    invtPdyy: '0', // 투자기간
    mngMendngRt: 0, // 관리보수
    pmntMthd: 0, // 납부방식
    invtTgt: '', // 투자대상
    orgzTgpr: '', // 결성목표가
    orgzRto: '', // 결성목표율
    ibkPrplAmt: 0, // ibk제안금액
    ibkPrplRto: 0, // ibk제안율
    auditStg: '', //심사단계
    rplyCon: '', // 답변내용
    fundDsnc: '0', //펀드구분
    gpFncnInfo: 0, // gp출자금액
    proposalDocBaseDay: '', // 제안서 기준일
    prmrLpChcFild: [],
    fncnEnlsPsst: []
  })

  // 저장 후 종료 및 다음 페이지 넘어갈 때
  const saveFundInfo = async (gubun) => {
    if (chkValidation()) {
      exeFunc(popupRef, 'open')

      return false
    }
    let fundIdData = ''

    const param = {
      ...vo,
      prmrLpChcFild: prmrLpChcFildList,
      fncnEnlsPsst: fncnEnlsPsstList,
      utlinsttId: commonContext.state.user.info.groupId,
      orgzTgpr: investTotal.toString(),
      ibkPrplAmt: vo.ibkInvstmntPrplAmt,
      orgzRto: ratioTotal.toString(),
      auditStg: 'save'
      // proposalDocBaseDay: dayjs(vo.proposalDocBaseDay).format('YYYYMMDD')
    }

    let isSaveComplete = true

    const url = Api.fund.fundPrplInfoSave
    console.log('vo --- ', param)

    if (props.location.search !== '') {
      const updateRes = await CommonAxios(getPostConfig(url, param), true)
      console.log('updateRes ==== ', updateRes)
      if (updateRes) {
        if (updateRes.status !== 200) {
          isSaveComplete = false
        }
      } else {
        isSaveComplete = false
      }
      fundIdData = updateRes.data.data
    } else {
      const saveRes = await CommonAxios(getPostConfig(url, param), true)
      console.log('saveRes ==== ', saveRes)
      if (saveRes) {
        if (saveRes.status !== 200) {
          isSaveComplete = false
        }
      } else {
        isSaveComplete = false
      }
      fundIdData = saveRes.data.data
    }

    if (isSaveComplete) {
      if (gubun === 'quit') {
        history.push(ROUTER_NAMES.FUND_PRPL_INFO_LIST_VIEW)
      } else {
        const url = ROUTER_NAMES.FUND_PRPL_INFO_STEP2 + props.location.search

        if (props.history.location.pathname === ROUTER_NAMES.FUND_PRPL_INFO_STEP) {
          history.push(url, { ...vo, copy: 'write', fundId: fundIdData, fundNm: vo.fundNm })
        } else {
          history.push(url, { ...vo, copy: 'view', fundId: fundIdData })
        }
      }
    }
  }

  // 복사본 만들기
  const copyFundInfo = async (gubun) => {
    if (chkValidation()) {
      exeFunc(popupRef, 'open')

      return false
    }

    const param = {
      ...vo,
      prmrLpChcFild: prmrLpChcFildList,
      fncnEnlsPsst: fncnEnlsPsstList,
      utlinsttId: commonContext.state.user.info.groupId,
      orgzTgpr: investTotal.toString(),
      ibkPrplAmt: vo.ibkInvstmntPrplAmt,
      orgzRto: ratioTotal.toString(),
      auditStg: 'save'
    }
    let isSaveComplete = true
    let fundIdData = ''
    const url = Api.fund.fundCopy
    console.log('vo --- ', param)

    if (props.location.search !== '') {
      const copyRes = await CommonAxios(getPostConfig(url, param), true)
      console.log('copyRes ==== ', copyRes)
      if (copyRes) {
        if (copyRes.status !== 200) {
          isSaveComplete = false
        }
      } else {
        isSaveComplete = false
      }
      fundIdData = copyRes.data.data
    }

    if (isSaveComplete) {
      if (gubun === 'quit') {
        history.push(ROUTER_NAMES.FUND_PRPL_INFO_LIST_VIEW)
      } else {
        const url = ROUTER_NAMES.FUND_PRPL_INFO_STEP2 + props.location.search
        if (props.history.location.pathname === ROUTER_NAMES.FUND_PRPL_INFO_STEP) {
          history.push(url, { ...vo, copy: 'write', fundId: fundIdData })
        } else {
          history.push(url, { ...vo, copy: 'view', fundId: fundIdData })
        }
      }
    }
  }

  // 필수 값 체크
  const chkValidation = () => {
    
    if (vo.fundNm === '') {
      setEmptyVal('펀드명')
      return true
    } else if (vo.fundPtrn === '0') {
      setEmptyVal('펀드유형')
      return true
    } else if (vo.orgzTrgpft === 0) {
      setEmptyVal('결성목표액')
      return true
    } else if (vo.ibkInvstmntPrplAmt === 0 || vo.ibkInvstmntPrplAmt === '0') {
      setEmptyVal('IBK출자 제안금액')
      return true
    } else if (vo.stdrErnRt === 0) {
      setEmptyVal('기준수익률')
      return true
    } else if (vo.cntnncPdyy === '' || vo.cntnncPdyy === '0') {
      setEmptyVal('존속기간')
      return true
    } else if (vo.rsltMendngIrrExcessErn === 0) {
      setEmptyVal('성과보수')
      return true
    } else if (vo.invtPdyy === '' || vo.invtPdyy === '0') {
      setEmptyVal('투자기간')
      return true
    } else if (vo.mngMendngRt === 0) {
      setEmptyVal('관리보수')
      return true
    } else if (vo.pmntMthd === 0) {
      setEmptyVal('납부방식')
      return true
    }
    if (fncnEnlsPsstList.length === 0) {
      setEmptyVal('출자자 모집현황')
      return true
    } else {
      for (let i = 0; i < fncnEnlsPsstList.length; i++) {
        if (i === 0) {
          if (fncnEnlsPsstList[i].invstInst === '') {
            setEmptyVal('출자자 모집현황 출자기관')
            return true
          } else if (fncnEnlsPsstList[i].invstMny === 0 && fncnEnlsPsstList[i].invstMnyRdoY === true) {
            setEmptyVal('출자자 모집현황 출자금액')
            return true
          } else if (fncnEnlsPsstList[i].progrsStg === '') {
            setEmptyVal('출자자 모집현황 진행단계')
            return true
          }
        }
        if (i > 0) {
          if (fncnEnlsPsstList[i].invstInst !== '') {
            if (fncnEnlsPsstList[i].invstMny === 0 && fncnEnlsPsstList[i].invstMnyRdoY === true) {
              setEmptyVal('출자자 모집현황 출자금액')
              return true
            } else if (fncnEnlsPsstList[i].progrsStg === '') {
              setEmptyVal('출자자 모집현황 진행단계')
              return true
            }
          }
        }
      }
    }

    return false
  }

  //셀렉트 박스 값 선택
  const clickSelData = useCallback(
    (val, id) => {
      if (id === 'fundPtrn') {
        setVo({ ...vo, fundPtrn: val })
      } else if (id === 'pmntMthd') {
        setVo({ ...vo, pmntMthd: val })
      } else if (id === 'fundDsnc') {
        setVo({ ...vo, fundDsnc: val })
      }
    },
    [vo]
  )

  // 계속작성이나 상세페이지 왔을 때 상세조회
  const loadFundDetail = async () => {
    const query = QueryUtils.getQuery(props)
    const url = Api.fund.fundPrplInfoSave + '/' + query['fundId']
    const res = await CommonAxios(getConfig(url), false)

    if (res && res.status === 200) {
      return res.data.data
    }
  }

  // 주요LP 지원 데이터 셋팅
  const getPrmrLpChcFildFunc = (getPrmrLpChcFild) => {
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
    setPrmrLpChcFildList(resultPrmrLpChcFild)
  }

  // 출자자 모집현황 데이터 셋팅
  const getFncnEnlsPsstFunc = (getFncnEnlsPsst) => {
    const resultList = []

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
      if (resObj.invstMny !== '0') {
        resObj.invstMnyRdoY = true
      } else {
        resObj.invstMnyRdoN = true
      }
      if (resObj.rate !== 0) {
        resObj.rateRdoY = true
      } else {
        resObj.rateRdoN = true
        resObj.rate = 0
      }
      resultList.push(resObj)
    }
    setFncnEnlsPsstList(resultList)
  }

  const isMounted = useRef(false) // useEffect에서 mount 유무 동기확인을 위함

  useEffect(() => {
    
    if (commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
      isMounted.current = true

      commonContext.actions.pageMountPathCheck(history, async () => {
        if (props.location.search !== '') {
          const query = QueryUtils.getQuery(props)
          if (query && query.hasOwnProperty('utlinsttId')) {
            const fundDetailObject = await loadFundDetail()
            if (fundDetailObject !== null) {
              console.log('fundDetailObject write = ', fundDetailObject)
              setVo(fundDetailObject)
              const getPrmrLpChcFild = fundDetailObject.prmrLpChcFild
              const getfncnEnlsPsst = fundDetailObject.fncnEnlsPsst

              getPrmrLpChcFildFunc(getPrmrLpChcFild)
              getFncnEnlsPsstFunc(getfncnEnlsPsst)

              setInvestTotal(fundDetailObject.orgzTgpr)      
              setRatioTotal(fundDetailObject.orgzRto)
            }
            if (props.location.state !== undefined) {
              setCopyChk(props.location.state.copy)
            }
          }
        }
      })
    }
  }, [commonContext.state.user])

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
                <StepLabel>제출 완료</StepLabel>
              </Step>
            </Stepper>
          </Paper>
          <FundValidtionPop ref={popupRef} theme={theme} emptyVal={emptyVal} />

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
                    <TextFieldInput
                      size="small"
                      name="fundNm"
                      item={vo}
                      values={vo.fundNm}
                      numberProperty="fundNm"
                      requiredChk={true}
                    />
                  </BtContentGrid>
                  <DatePickerItem
                    format="YYYY-MM-DD"
                    title={'제안서 기준일'}
                    sx={{ width: '100%' }}
                    numberProperty="proposalDocBaseDay"
                    item={vo}
                    values={dayjs(vo.proposalDocBaseDay)}
                  />
                  <BtContentGrid gridXs={6} title={'펀드유형'} required={true}>
                    <BtSelect defaultValue={vo.fundPtrn}>
                      <MenuItem disabled value={'0'}>
                        선택하세요
                      </MenuItem>
                      <MenuItem value={'FNP01001'} onClick={() => clickSelData('FNP01001', 'fundPtrn')}>
                        벤처투자조합
                      </MenuItem>
                      <MenuItem value={'FNP01002'} onClick={() => clickSelData('FNP01002', 'fundPtrn')}>
                        신기술투자조합
                      </MenuItem>
                      <MenuItem value={'FNP01003'} onClick={() => clickSelData('FNP01003', 'fundPtrn')}>
                        일반 PEF
                      </MenuItem>
                      <MenuItem value={'FNP01004'} onClick={() => clickSelData('FNP01004', 'fundPtrn')}>
                        전문투자형 PEF
                      </MenuItem>
                      <MenuItem value={'FNP01005'} onClick={() => clickSelData('FNP01005', 'fundPtrn')}>
                        기타
                      </MenuItem>
                    </BtSelect>
                  </BtContentGrid>

                  <BtContentGrid gridXs={6} title={'GP출자금액'}>
                    <MuiNumberInput
                      item={vo}
                      type="hundMilliwon"
                      numberProperty="gpFncnInfo"
                      sx={{ width: '100%' }}
                      displayValue={vo['gpFncnInfo']}
                    />
                  </BtContentGrid>

                  <BtContentGrid gridXs={6} title={'펀드 구분'}>
                    <BtSelect defaultValue={vo.fundDsnc}>
                      <MenuItem disabled value={'0'}>
                        선택하세요
                      </MenuItem>
                      <MenuItem value={'BLIND'} onClick={() => clickSelData('BLIND', 'fundDsnc')}>
                        블라인드
                      </MenuItem>
                      <MenuItem value={'PRJT'} onClick={() => clickSelData('PRJT', 'fundDsnc')}>
                        프로젝트
                      </MenuItem>
                    </BtSelect>
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'결성목표액'} required={true}>
                    <MuiNumberInput
                      item={vo}
                      type={'hundMilliwon'}
                      numberProperty="orgzTrgpft"
                      sx={{ width: '100%' }}
                      displayValue={vo['orgzTrgpft']}
                    />
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'IBK출자 제안금액'} required={true}>
                    <TextField
                      size="small"
                      value={vo['ibkInvstmntPrplAmt']}
                      InputProps={{ endAdornment: <InputAdornment position="end">억원</InputAdornment> }}
                      sx={{ width: '100%' }}
                      onChange={(e)=>{
                        const NUM_REGEX = {
                          NOT_NUMBER: /[^-.0-9]/gi,
                        }
                        let val = e.target.value.replace(NUM_REGEX.NOT_NUMBER, '')
                        setVo({...vo, 
                          ibkInvstmntPrplAmt : numberCommaFormat.format(val),
                          ibkPrplAmt : numberCommaFormat.format(val)
                        })
                      }}
                    />
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'기준수익률(IRR)'} required={true}>
                    <MuiNumberInput
                      item={vo}
                      type='percent'
                      numberProperty="stdrErnRt"
                      sx={{ width: '100%' }}
                      displayValue={vo['stdrErnRt']}
                    />
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'존속기간'} required={true}>
                    <TextFieldInput
                      size="small"
                      name="cntnncPdyy"
                      item={vo}
                      values={vo.cntnncPdyy}
                      numberProperty="cntnncPdyy"
                      requiredChk={true}
                    />
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'성과보수'} required={true}>
                    <MuiNumberInput
                      item={vo}
                      numberProperty="rsltMendngIrrExcessErn"
                      sx={{ width: '100%' }}
                      displayValue={vo['rsltMendngIrrExcessErn']}
                    />
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'투자기간'} required={true}>
                    <TextFieldInput
                      size="small"
                      name="invtPdyy"
                      item={vo}
                      values={vo.invtPdyy}
                      numberProperty="invtPdyy"
                      requiredChk={true}
                    />
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'관리보수'} required={true}>
                    <MuiNumberInput
                      item={vo}
                      type='percent'
                      numberProperty="mngMendngRt"
                      sx={{ width: '100%' }}
                      displayValue={vo['mngMendngRt']}
                    />
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'납부방식'} required={true}>
                    <BtSelect defaultValue={vo.pmntMthd}>
                      <MenuItem disabled value={0}>
                        선택하세요
                      </MenuItem>
                      <MenuItem value="PMT01001" onClick={() => clickSelData('PMT01001', 'pmntMthd')}>
                        수시납
                      </MenuItem>
                      <MenuItem value="PMT01002" onClick={() => clickSelData('PMT01002', 'pmntMthd')}>
                        분할납
                      </MenuItem>
                      <MenuItem value="PMT01003" onClick={() => clickSelData('PMT01003', 'pmntMthd')}>
                        일시납
                      </MenuItem>
                    </BtSelect>
                  </BtContentGrid>
                  <BtContentGrid gridXs={12} title={'투자대상'}>
                    <TextFieldInput
                      size="small"
                      name="invtTgt"
                      numberProperty="invtTgt"
                      item={vo}
                      values={vo.invtTgt.trim()}
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
                          <PrmrLpChcFildList
                            {...prmrLpChcFildList}
                            list={prmrLpChcFildList}
                          />
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </BtContentGrid>
                  <BtContentGrid gridXs={12} title={'출자자 모집현황'} required={true}>
                    <TableContainer component={Paper} sx={{ borderRadius: 0, boxShadow: 'none' }}>
                      <Table size="small" sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
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
                          <FncnEnlsPsstList
                            {...fncnEnlsPsstList}
                            list={fncnEnlsPsstList}
                            investTotal={investTotal}
                            setInvestTotal={setInvestTotal}
                            ratioTotal={ratioTotal}
                            setRatioTotal={setRatioTotal}
                            vo={vo}
                          />
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
                                {StringUtils.comma(investTotal)}억원
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
                {copyChk === 'write' ? (
                  <Button
                    size="large"
                    variant="outlined"
                    name="save"
                    onClick={() => copyFundInfo('quit')}
                    disableElevation
                  >
                    저장 및 종료
                  </Button>
                ) : (
                  <Button
                    size="large"
                    variant="outlined"
                    name="save"
                    onClick={() => saveFundInfo('quit')}
                    disableElevation
                  >
                    저장 및 종료
                  </Button>
                )}
                {copyChk === 'write' ? (
                  <Button
                    size="large"
                    variant="contained"
                    name="next"
                    onClick={() => copyFundInfo('save')}
                    disableElevation
                  >
                    저장 후 다음
                  </Button>
                ) : (
                  <Button
                    size="large"
                    variant="contained"
                    name="next"
                    onClick={() => saveFundInfo('save')}
                    disableElevation
                  >
                    저장 후 다음
                  </Button>
                )}
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </>
  )
}

export default FundPrplInfoStep
