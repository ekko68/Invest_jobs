import LensOutlinedIcon from '@mui/icons-material/LensOutlined'
import { Box, Stack, useTheme } from '@mui/material'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
// import * as React from 'react';
import { useContext, useEffect, useState, useMemo, useRef } from 'react'
import PageLayout from 'components/PageLayout'

import { useHistory } from 'react-router-dom'
import {
  saveVncmLoanDetail,
  getVnentrLonSgshPrtRceptDetail,
  sendVncmLoanEmail,
  sendVncmLoanSms,
  getVnemtrlonAplcDetail
} from 'modules/consts/InvestApi'
import PopupAlert from 'components/PopupAlert'
import PopupAlert2Button from 'components/PopupAlert2Button'

import ROUTER_NAMES from 'modules/consts/RouterConst'
import { fileDownload } from 'modules/utils/CommonUtils'
import { StringUtils } from 'modules/utils/StringUtils'
import { InvestContext } from 'modules/common/InvestContext'
import { UserContext } from 'modules/common/UserContext'
import { loader } from 'modules/utils/CommonAxios'
import { useReactToPrint } from 'react-to-print'
import html2canvas from 'html2canvas'
import jsPdf from 'jspdf'
import PopupConfirm from 'components/PopupConfirm'

const disabledComCdId = 'RST01003'

const VnentrLonSgshPrtRceptDetailView = (props) => {
  const theme = useTheme()
  const history = useHistory()

  const userContext = useContext(UserContext)
  const investContext = useContext(InvestContext)

  const id = props.match.params.id

  const [statusValue, setStatusValue] = useState('10')

  const [view, setView] = useState(null)

  const [confirmReg, setConfirmReg] = useState(false)
  const [emailReg, setEmailReg] = useState(false)
  const [emailObj, setEmailObj] = useState(null)
  const [smsReg, setSmsReg] = useState(false)
  const [smsObj, setSmsObj] = useState(null)
  const [errPop, setErrPop] = useState(false)
  const [errMsg, setErrMsg] = useState('')

  const [invmTpbsList, setInvmTpbsList] = useState([])
  const [investRoundList, setInvestRoundList] = useState([])
  const [isAlertFail, setIsAlertFail] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const printContents = useRef()

  const invtIndutySeCdNm = useMemo(() => {
    if (!view?.invtIndutySe) {
      return ''
    }

    if (!(invmTpbsList?.length > 0 && invmTpbsList.find)) {
      return ''
    }
    const elementFound = invmTpbsList.find((element) => element.comCdId == view.invtIndutySe)
    return elementFound?.comCdNm
  }, [invmTpbsList, view])

  const investRoundCdNm = useMemo(() => {
    if (!view?.invtDtlsInvtPnttm) {
      return ''
    }

    if (!(investRoundList?.length > 0 && investRoundList.find)) {
      return ''
    }
    const elementFound = investRoundList.find((element) => element.comCdId == view.invtDtlsInvtPnttm)
    return elementFound?.comCdNm
  }, [investRoundList, view])

  useEffect(() => {
    if (investContext.state.codeInfo.isLoaded) {
      const prmrInvmTpbsList = investContext.state.codeInfo.prmrInvmTpbsList
      const investStepList = investContext.state.codeInfo.investStepList

      if (prmrInvmTpbsList?.length > 0) {
        setInvmTpbsList(prmrInvmTpbsList)
      }

      if (investStepList?.length > 0) {
        setInvestRoundList(investStepList)
      }
    }
  }, [investContext.state.codeInfo])

  const handleStatusChange = (event) => {
    setStatusValue(event.target.value)
    setView({ ...view, recomendSttus: event.target.value })
  }

  // ===== 파일 다운로드
  const handleFileDownload = async (file) => {
    await fileDownload(file)
  }

  // 이메일 전송
  const sendEmail = async () => {
    loader(true, 'Uploading...')
    const res = await sendVncmLoanEmail({
      params: emailObj,
      adminUser: userContext.actions.getIvtAdminUser()
    })

    if (res.data.code === '200') {
      setEmailReg(false)
    }else {
      setErrMsg(res.data.message)
      setErrPop(true)
      setEmailReg(false)
    }
  }

  // SMS 전송
  const sendSms = async () => {
    loader(true, 'Uploading...')
    const res = await sendVncmLoanSms({
      params: smsObj,
      adminUser: userContext.actions.getIvtAdminUser()
    })

    if (res.data.code === '200') {
      setSmsReg(false)
    }else {
      setErrMsg(res.data.message)
      setErrPop(true)
      setSmsReg(false)
    }
  }

  // 등록 확인
  const handleSaveConfirmAfter = (type) => {
    if (type === 'confirm') {
      history.push(`${ROUTER_NAMES.INVEST_RECOMENDRCEPT_VNENTRLONSGSHPRTRCEPTVIEW}`)
      loader()
      setConfirmReg(!confirmReg)
    }
  }
  // 상태 등록
  const handleConfirm = async (type) => {
    if (type === 'confirm') {
      loader(true, 'Uploading...')
      console.log('view = ', view)
      if (view.recomendSttus !== 'RST01002') {
        view.invtInsttDlivMsg = ' '
      }
      const res = await saveVncmLoanDetail({
        params: view,
        adminUser: userContext.actions.getIvtAdminUser()
      })
      if (res.data.code === '200') {
        setConfirmReg(!confirmReg)
      } else {
        setErrMsg(res.data.message)
        setErrPop(!errPop)
      }
    }
  }

  const isTelFormat = (tel) => {
    let result = ''
    if (tel.length === 8) {
      return tel.replace(/(\d{4})(\d{4})/, '$1-$2')
    } else if (tel.indexOf('02') === 0) {
      if (tel.length === 9) {
        //02-000-0000
        return tel.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3')
      } else if (tel.length === 10) {
        //02-0000-0000
        return tel.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3')
      }
    } else if (tel.length === 10) {
      //000-000-0000
      return tel.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})$/g, '$1-$2-$3')
    } else if (tel.length === 11) {
      //000-0000-0000
      return tel.replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
    }
    return tel
  }
  /** 금액 숫자 콤마 */
  const handleCommaNum = (e) => {
    const regex = /^[0-9]*$/
    const num = e.target.value.replace(/,/g, '', '')
    if (regex.test(num) && e.target.value.length < 26 && num.length < 20) {
      const {
        target: { name }
      } = e
      setObj((prev) => ({ ...prev, [name]: isCommaFormat(num) }))
    }
  }
  const isCommaFormat = (num) => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  // ===== 상세조회
  const getView = async () => {
    loader(true, 'Uploading...')
    const res = await getVnentrLonSgshPrtRceptDetail(id, '')
    if (res.data.code === '200') {
      
      setView(res.data.data)
      setStatusValue(res.data.data.recomendSttus)
      setEmailObj({
        csm: res.data.data.etnm,
        dsmsEad: res.data.data.contactAudofirRsprEad,
        emlThtxCon: '',
        emlTtlNm: '', 
        ibkboxEnmbId: res.data.data.utlinsttId,
        rcvEad: res.data.data.rsprEad
      })
      setSmsObj({
        smtsKcd: 'M',
        smsBswrDcd: 'AH007',
        smrvNo: res.data.data.rsprCnplTpn,
        mmsTtlNm: '', 
        mmsDsmsCon: '', 
      })
      loader()
    }
  }

  useEffect(() => {
    id && getView()
  }, [])

  const goCompanyRecommend = async () => {
    const params = {
      vnentrlonId: '',
      bzn: view.rcmdEnprBzn
    }
    const res = await getVnemtrlonAplcDetail(params)
    if (res?.data?.code === '200' && res.data.data?.vnentrlonId) {
      const params02 = {
        vnentrlonId: res.data.data.vnentrlonId,
        bzn: ''
      }
      history.push(ROUTER_NAMES.INVEST_RECOMENDRCEPT_MGVNENTRLONCMDETAILVIEW, params02)
    } else {
      setAlertMessage('기업 신청 정보를 찾을 수 없습니다')
      setIsAlertFail(true)
    }
  }

  // 출력버튼
  const handlePrint = useReactToPrint({
    content: () => printContents.current
  })

  // pdf 저장
  const handlePdfPrint = async () => {
    const paper = document.getElementById('pdfContents')
    paper.style.padding = '0px 20px 0px 20px'
    document.getElementById('btn1').style.display = 'none'
    document.getElementById('btn2').style.display = 'none'

    const canvas = await html2canvas(paper, { scale: 1.5 })
    const imgFile = canvas.toDataURL('image/png')

    const doc = new jsPdf('p', 'mm', 'a4')

    const imgWidth = 210
    const pageHeight = imgWidth * 1.414
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0

    doc.addImage(imgFile, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      doc.addPage()
      doc.addImage(imgFile, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    window.open(doc.output('bloburl'))
    const pdf = new File([doc.output('blob')], 'test.pdf', { type: 'application/pdf' })
    document.getElementById('btn1').style.display = ''
    document.getElementById('btn2').style.display = ''

    return pdf
  }

  return (
    <>
      {/* Header */}

      <PageLayout currentMenu={'invest'} currentCate={'recomendRcept'} currentPage={'VnentrLonSgshPrtRceptDetailView'}>
        {isAlertFail && <PopupAlert msg={alertMessage} handlePopup={(e) => setIsAlertFail(false)} />}
        {confirmReg && (
          <PopupAlert msg="저장되었습니다" btnMsg="확인" handlePopup={() => handleSaveConfirmAfter('confirm')} />
        )}
        {errPop && <PopupAlert handlePopup={() => setErrPop(!errPop)} msg={errMsg} />}
        {emailReg && (
          <PopupAlert2Button
            handlePopupCancel={() => setEmailReg(false)}
            handlePopup={() => sendEmail()}
            btnMsgConfirm="전송"
            msg={'추천 기업의 담당자 이메일\n(' + view.rsprEad + ')로 이메일을 전송합니다.'}
          />
        )}
        {smsReg && (
          <PopupAlert2Button
            handlePopupCancel={() => setSmsReg(false)}
            handlePopup={() => sendSms()}
            btnMsgConfirm="전송"
            msg={'추천 기업의 담당자 연락처\n(' + view.rsprCnplTpn + ')로 SMS을 전송합니다.'}
          />
        )}
        {view && (
          <Stack direction="row" spacing={8} id="pdfContents" ref={printContents}>
            <Box sx={{ width: '100%' }}>
              <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}></Breadcrumbs>

              <Stack direction={'column'} spacing={4} alignItems="center">
                <Stack direction={'column'} spacing={2} sx={{ width: '100%' }}>
                  <Stack direction={'row'} alignItems="center" spacing={1}>
                    <Typography
                      flexGrow={1}
                      variant="h1"
                      sx={{
                        lineHeight: '2.375rem',
                        fontSize: '1.875rem',
                        fontWeight: 'bold'
                      }}
                    >
                      IBK벤처대출 접수(VC)
                    </Typography>
                  </Stack>

                  <Divider />

                  <Stack direction={'column'} spacing={6}>
                    <Stack direction={'column'} spacing={4}>
                      <Stack direction={'column'} spacing={1}>
                        <Stack direction={'row'} spacing={1} alignItems={'center'}>
                          <LensOutlinedIcon color="secondary" />
                          <Typography
                            flexGrow={1}
                            variant="h2"
                            sx={{
                              lineHeight: '1.375rem',
                              fontSize: '1.375rem',
                              fontWeight: 'bold'
                            }}
                          >
                            추천기업
                          </Typography>
                        </Stack>
                        <Divider sx={{ backgroundColor: theme.palette.secondary.main }} />
                      </Stack>

                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="h3"
                          sx={{ lineHeight: '1.5rem', fontSize: '1.125rem', fontWeight: 'bold' }}
                          paddingBottom={true}
                        >
                          1.기본정보
                        </Typography>
                        <Grid container sx={{ borderTop: `1px solid ${theme.palette.info.main}` }}>
                          <Grid
                            xs={6}
                            container
                            sx={{
                              borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}`
                            }}
                          >
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">기업명</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Typography variant="body1">{view.etnm}</Typography>
                            </Grid>
                          </Grid>

                          <Grid xs={6} container sx={{ borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}` }}>
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">대표자명</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Typography variant="body1">{view.rprnm}</Typography>
                            </Grid>
                          </Grid>

                          <Grid xs={6} container sx={{ borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}` }}>
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">사업자번호</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Typography variant="body1">{StringUtils.bizNum(view.rcmdEnprBzn)}</Typography>
                            </Grid>
                          </Grid>

                          <Grid xs={6} container sx={{ borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}` }}>
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">설립년월일</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Typography variant="body1">{view.col}</Typography>
                            </Grid>
                          </Grid>

                          <Grid
                            xs={12}
                            container
                            sx={{ borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}` }}
                          >
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">본사 주소</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Typography variant="body1">{view.adr}</Typography>
                            </Grid>
                          </Grid>

                          <Grid
                            xs={12}
                            container
                            sx={{ borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}` }}
                          >
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">
                                  업종명
                                  <br />
                                  (표준산업분류)
                                </Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Typography variant="body1">{view.btnm}</Typography>
                            </Grid>
                          </Grid>

                          <Grid xs={6} container sx={{ borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}` }}>
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">투자업종 구분</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Typography variant="body1">{invtIndutySeCdNm}</Typography>
                            </Grid>
                          </Grid>

                          <Grid xs={6} container sx={{ borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}` }}>
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">주요제품</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Typography variant="body1">{view.mainProduct}</Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Box>

                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="h3"
                          sx={{ lineHeight: '1.5rem', fontSize: '1.125rem', fontWeight: 'bold' }}
                          paddingBottom={true}
                        >
                          2. 담당자 정보
                        </Typography>
                        <Grid container sx={{ borderTop: `1px solid ${theme.palette.info.main}` }}>
                          <Grid
                            xs={6}
                            container
                            sx={{
                              borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}`
                            }}
                          >
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">기업 담당자명</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Typography variant="body1">{view.rsprNm}</Typography>
                            </Grid>
                          </Grid>

                          <Grid xs={6} container sx={{ borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}` }}>
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">담당자 직책</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Typography variant="body1">{view.rsprJbclNm}</Typography>
                            </Grid>
                          </Grid>

                          <Grid xs={6} container sx={{ borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}` }}>
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">담당자 연락처</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Typography variant="body1">{isTelFormat(view.rsprCnplTpn)}</Typography>
                            </Grid>
                          </Grid>

                          <Grid xs={6} container sx={{ borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}` }}>
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">담당자 이메일</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Typography variant="body1">{view.rsprEad}</Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Box>

                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="h3"
                          sx={{ lineHeight: '1.5rem', fontSize: '1.125rem', fontWeight: 'bold' }}
                          paddingBottom={true}
                        >
                          3. 투자 의견
                        </Typography>
                        <Grid container sx={{ borderTop: `1px solid ${theme.palette.info.main}` }}>
                          <Grid
                            xs={12}
                            container
                            sx={{
                              borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}`
                            }}
                          >
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">기업 경쟁력 또는 성장가능성</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2, height: '10rem' }}>
                              <Typography variant="body1">{view.entrprsCmptpw}</Typography>
                            </Grid>
                          </Grid>

                          <Grid
                            xs={12}
                            container
                            sx={{ borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}` }}
                          >
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">후속투자 가능성 및 예상시기</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2, height: '10rem' }}>
                              <Typography variant="body1">{view.fllwinvtPosbltyExpectEra}</Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Box>
                    </Stack>
                    <Stack direction={'column'} spacing={4}>
                      <Stack direction={'column'} spacing={1}>
                        <Stack direction={'row'} spacing={1} alignItems={'center'}>
                          <LensOutlinedIcon color="secondary" />
                          <Typography
                            flexGrow={1}
                            variant="h2"
                            sx={{
                              lineHeight: '1.375rem',
                              fontSize: '1.375rem',
                              fontWeight: 'bold'
                            }}
                          >
                            투자기관
                          </Typography>
                        </Stack>
                        <Divider sx={{ backgroundColor: theme.palette.secondary.main }} />
                      </Stack>

                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="h3"
                          sx={{ lineHeight: '1.5rem', fontSize: '1.125rem', fontWeight: 'bold' }}
                          paddingBottom={true}
                        >
                          1.투자 내역
                        </Typography>
                        <Grid container sx={{ borderTop: `1px solid ${theme.palette.info.main}` }}>
                          <Grid
                            xs={6}
                            container
                            sx={{
                              borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}`
                            }}
                          >
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">투자기관</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Typography variant="body1">{view.invtDtlsInvtInstt}</Typography>
                            </Grid>
                          </Grid>

                          <Grid xs={6} container sx={{ borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}` }}>
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">투자라운드(직전)</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Typography variant="body1">{investRoundCdNm}</Typography>
                            </Grid>
                          </Grid>

                          <Grid xs={6} container sx={{ borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}` }}>
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">투자금액(원)</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Typography variant="body1">{isCommaFormat(view.invtDtlsInvtAmount)}</Typography>
                            </Grid>
                          </Grid>

                          <Grid xs={6} container sx={{ borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}` }}>
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">투자일자(직전)</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Typography variant="body1">{view.invtDtlsInvtDe}</Typography>
                            </Grid>
                          </Grid>

                          <Grid xs={6} container sx={{ borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}` }}>
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">주당가격(원)</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Typography variant="body1">{isCommaFormat(view.invtDtlsStkpc)}</Typography>
                            </Grid>
                          </Grid>

                          <Grid xs={6} container sx={{ borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}` }}>
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">기업가치(원)</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Typography variant="body1">{isCommaFormat(view.invtDtlsEtvlAmt)}</Typography>
                            </Grid>
                          </Grid>

                          <Grid xs={6} container sx={{ borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}` }}>
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">투자종류</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Typography variant="body1">{view.invtDtlsInvtKnd}</Typography>
                            </Grid>
                          </Grid>

                          <Grid xs={6} container sx={{ borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}` }}>
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">비고</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Typography variant="body1">{view.invtDtlsRm}</Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Box>

                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="h3"
                          sx={{ lineHeight: '1.5rem', fontSize: '1.125rem', fontWeight: 'bold' }}
                          paddingBottom={true}
                        >
                          2. 담당자 정보
                        </Typography>
                        <Typography variant="body2" paddingBottom={1}>
                          * 담당 심사역 정보
                        </Typography>
                        <Grid container sx={{ borderTop: `1px solid ${theme.palette.secondary.main}` }}>
                          <Grid
                            xs={6}
                            container
                            sx={{
                              borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}`
                            }}
                          >
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">이름</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Typography variant="body1">{view.chrgAudofirRsprNm}</Typography>
                            </Grid>
                          </Grid>

                          <Grid xs={6} container sx={{ borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}` }}>
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">직책</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Typography variant="body1">{view.chrgAudofirRsprJbclNm}</Typography>
                            </Grid>
                          </Grid>

                          <Grid xs={6} container sx={{ borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}` }}>
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">연락처</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Typography variant="body1">{isTelFormat(view.chrgAudofirRsprCnplTpn)}</Typography>
                            </Grid>
                          </Grid>

                          <Grid xs={6} container sx={{ borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}` }}>
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">이메일</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Typography variant="body1">{view.chrgAudofirRsprEad}</Typography>
                            </Grid>
                          </Grid>
                        </Grid>

                        <Typography variant="body2" paddingTop={4} paddingBottom={1}>
                          * 연락 심사역 정보
                        </Typography>
                        <Grid container sx={{ borderTop: `1px solid ${theme.palette.secondary.main}` }}>
                          <Grid
                            xs={6}
                            container
                            sx={{
                              borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}`
                            }}
                          >
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">이름</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Typography variant="body1">{view.contactAudofirRsprNm}</Typography>
                            </Grid>
                          </Grid>

                          <Grid xs={6} container sx={{ borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}` }}>
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">직책</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Typography variant="body1">{view.contactAudofirRsprJbclNm}</Typography>
                            </Grid>
                          </Grid>

                          <Grid xs={6} container sx={{ borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}` }}>
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">연락처</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Typography variant="body1">{isTelFormat(view.contactAudofirRsprCnplTpn)}</Typography>
                            </Grid>
                          </Grid>

                          <Grid xs={6} container sx={{ borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}` }}>
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">이메일</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Typography variant="body1">{view.contactAudofirRsprEad}</Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Box>

                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="h3"
                          sx={{ lineHeight: '1.5rem', fontSize: '1.125rem', fontWeight: 'bold' }}
                          paddingBottom={true}
                        >
                          3. 투자사실 증빙 서류 첨부
                        </Typography>

                        <Grid container sx={{ borderTop: `1px solid ${theme.palette.secondary.main}` }}>
                          <Grid
                            xs={12}
                            container
                            sx={{
                              borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}`
                            }}
                          >
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">첨부 파일</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              {view.invtFactPrufPapersAtchList &&
                                view.invtFactPrufPapersAtchList.length !== 0 &&
                                view.invtFactPrufPapersAtchList?.map((file, idx) => (
                                  <Typography
                                    variant="body1"
                                    sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                                    onClick={() => handleFileDownload(file)}
                                  >
                                    {file.fileNm}
                                  </Typography>
                                ))}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Box>

                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="h3"
                          sx={{ lineHeight: '1.5rem', fontSize: '1.125rem', fontWeight: 'bold' }}
                          paddingBottom={true}
                        >
                          4. 투자분석 보고서(투자심사자료) 첨부
                        </Typography>

                        <Grid container sx={{ borderTop: `1px solid ${theme.palette.secondary.main}` }}>
                          <Grid
                            xs={12}
                            container
                            sx={{
                              borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}`
                            }}
                          >
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">첨부 파일</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              {view.invtAnalsReprtAtchList &&
                                view.invtAnalsReprtAtchList.length !== 0 &&
                                view.invtAnalsReprtAtchList?.map((file, idx) => (
                                  <Typography
                                    variant="body1"
                                    sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                                    onClick={() => handleFileDownload(file)}
                                  >
                                    {file.fileNm}
                                  </Typography>
                                ))}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Box>

                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="h3"
                          sx={{ lineHeight: '1.5rem', fontSize: '1.125rem', fontWeight: 'bold' }}
                          paddingBottom={true}
                        >
                          5. 기타 파일 첨부
                        </Typography>

                        <Grid container sx={{ borderTop: `1px solid ${theme.palette.secondary.main}` }}>
                          <Grid
                            xs={12}
                            container
                            sx={{
                              borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}`
                            }}
                          >
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">첨부 파일</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              {view.etcFileAtchList &&
                                view.etcFileAtchList.length !== 0 &&
                                view.etcFileAtchList?.map((file, idx) => (
                                  <Typography
                                    variant="body1"
                                    sx={{ textDecoration: 'underline', cursor: 'pointer' }}
                                    onClick={() => handleFileDownload(file)}
                                  >
                                    {file.fileNm}
                                  </Typography>
                                ))}
                            </Grid>
                          </Grid>
                        </Grid>
                      </Box>
                    </Stack>

                    <Stack direction={'column'} spacing={4}>
                      <Stack direction={'column'} spacing={1}>
                        <Stack direction={'row'} spacing={1} alignItems={'center'}>
                          <LensOutlinedIcon color="secondary" />
                          <Typography
                            flexGrow={1}
                            variant="h2"
                            sx={{ lineHeight: '1.375rem', fontSize: '1.375rem', fontWeight: 'bold' }}
                          >
                            상태 등록
                          </Typography>
                        </Stack>
                        <Grid container sx={{ borderTop: `1px solid ${theme.palette.info.main}` }}>
                          <Grid
                            xs={12}
                            container
                            sx={{
                              borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}`
                            }}
                          >
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">투자기관</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Stack direction={'row'} spacing={2}>
                                <FormControl size="small" sx={{ minWidth: 280 }}>
                                  <Select value={view.recomendSttus} onChange={handleStatusChange} displayEmpty>
                                    {view.recomendSttusCdList &&
                                      view.recomendSttusCdList.length !== 0 &&
                                      view.recomendSttusCdList.map((row, index) => (
                                        <MenuItem
                                          key={row.comCdId}
                                          value={row.comCdId}
                                          disabled={row.comCdId == disabledComCdId}
                                        >
                                          {row.comCdNm}
                                        </MenuItem>
                                      ))}
                                  </Select>
                                </FormControl>
                                {statusValue === 'RST01004' && (
                                  <Typography color={'grey'} sx={{ textIndent: '-0.5rem', pl: '2rem' }}>
                                    * 대출 대상 기업이 혁신투자BOX 로그인 시 대출 서류 제출을 안내합니다.
                                  </Typography>
                                )}
                              </Stack>
                            </Grid>
                          </Grid>
                          {statusValue === 'RST01002' && (
                            <Grid
                              xs={12}
                              container
                              sx={{
                                borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}`
                              }}
                            >
                              <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                                <Stack
                                  direction="column"
                                  justifyContent="center"
                                  alignItems="flex-start"
                                  sx={{ height: '100%' }}
                                >
                                  <Typography variant="body1">
                                    투자 기관에
                                    <br />
                                    전달할 메시지
                                  </Typography>
                                </Stack>
                              </Grid>
                              <Grid xs sx={{ p: 2 }}>
                                <TextField
                                  multiline
                                  rows={4}
                                  size="small"
                                  sx={{ width: '100%' }}
                                  onChange={(e) => {
                                    setView({ ...view, invtInsttDlivMsg: e.target.value })
                                  }}
                                  value={view.invtInsttDlivMsg}
                                />
                              </Grid>
                            </Grid>
                          )}
                          {statusValue === 'RST01004' && (
                            <>
                              <Grid
                                xs={12}
                                container
                                sx={{
                                  borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}`
                                }}
                              >
                                <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                                  <Stack
                                    direction="column"
                                    justifyContent="center"
                                    alignItems="flex-start"
                                    sx={{ height: '100%' }}
                                  >
                                    <Typography variant="body1">
                                      대출 대상 기업에
                                      <br />
                                      알림 발송
                                    </Typography>
                                  </Stack>
                                </Grid>
                                <Grid xs sx={{ p: 2 }}>
                                  <Stack direction={'row'} spacing={2}>
                                    <Button
                                      variant="contained"
                                      color="secondary"
                                      disableElevation
                                      sx={{ color: theme.palette.white.main }}
                                      onClick={() => setEmailReg(true)}
                                    >
                                      이메일 보내기
                                    </Button>
                                    <Button
                                      variant="contained"
                                      color="secondary"
                                      disableElevation
                                      sx={{ color: theme.palette.white.main }}
                                      onClick={() => setSmsReg(true)}
                                    >
                                      SMS 보내기
                                    </Button>
                                  </Stack>
                                  <Typography color={'grey'} paddingTop={1}>
                                    * 대출 대상 기업에 서류 제출 알림을 보내시려면 위 버튼을 눌러주세요.
                                  </Typography>
                                </Grid>
                              </Grid>

                              <Grid
                                xs={12}
                                container
                                sx={{
                                  borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}`
                                }}
                              >
                                <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                                  <Stack
                                    direction="column"
                                    justifyContent="center"
                                    alignItems="flex-start"
                                    sx={{ height: '100%' }}
                                  >
                                    <Typography variant="body1">자료 제출 여부</Typography>
                                  </Stack>
                                </Grid>
                                <Grid xs={2} sx={{ p: 2 }}>
                                  <Typography variant="body1" sx={{ pt: 1 }}>
                                    {view.dtaPresentnYn === 'Y' ? '대출 서류 제출 완료' : '대출 서류 미제출'}
                                  </Typography>
                                </Grid>
                                {view.dtaPresentnYn === 'Y' && (
                                  <Grid xs={2} sx={{ p: 2 }}>
                                    <Stack direction={'row'}>
                                      <Button
                                        variant="contained"
                                        color="secondary"
                                        disableElevation
                                        sx={{ color: theme.palette.white.main }}
                                        onClick={() => {
                                          //TODO:
                                        }}
                                      >
                                        상세 내용
                                      </Button>
                                    </Stack>
                                  </Grid>
                                )}
                              </Grid>
                            </>
                          )}
                          <Grid xs={12} id="btn1">
                            <Stack
                              direction={'row'}
                              justifyContent="flex-end"
                              spacing={1}
                              paddingTop={1}
                              sx={{ width: '100%' }}
                            >
                              <Button size="small" color="info" variant="outlined" onClick={handlePrint}>
                                출력
                              </Button>
                              <Button size="small" color="info" variant="outlined" onClick={handlePdfPrint}>
                                PDF 저장
                              </Button>
                              {/* <Button size="small" color="info" variant="outlined">
                                BPR 저장
                              </Button> */}
                            </Stack>
                          </Grid>
                        </Grid>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>

                <Stack spacing={2} direction="row" justifyContent="center" id="btn2">
                  <Button
                    color={'info'}
                    variant="outlined"
                    size="large"
                    sx={{
                      width: 120,
                      fontWeight: 'bold',
                      borderRadius: 12
                    }}
                    onClick={() => {
                      history.push(`${ROUTER_NAMES.INVEST_RECOMENDRCEPT_VNENTRLONSGSHPRTRCEPTVIEW}`)
                    }}
                  >
                    목록
                  </Button>

                  <Button
                    color={'info'}
                    variant="outlined"
                    size="large"
                    sx={{
                      width: 120,
                      fontWeight: 'bold',
                      borderRadius: 12,
                      px: 0
                    }}
                    onClick={goCompanyRecommend}
                  >
                    기업 신청 정보
                  </Button>

                  <Button
                    color="secondary"
                    variant="contained"
                    size="large"
                    sx={{
                      width: 120,
                      color: theme.palette.white.main,
                      fontWeight: 'bold',
                      borderRadius: 12,
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: 'none'
                      }
                    }}
                    onClick={() => handleConfirm('confirm')}
                  >
                    저장
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        )}
      </PageLayout>
    </>
  )
}

export default VnentrLonSgshPrtRceptDetailView
