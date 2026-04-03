import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd'
import { Box, Stack, useTheme } from '@mui/material'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Button from '@mui/material/Button'
import Button2 from 'components/atomic/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import PageLayout from 'components/PageLayout'
import PopupConfirm from 'components/PopupConfirm'
import { getVncmloanAgisDetail, saveDetailView } from 'modules/consts/InvestApi'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { loader } from 'modules/utils/CommonAxios'
import { useContext, useEffect, useState, useRef } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { BtaAsteriskIcon } from '../../../components/BtaAsteriskIcon/BtaAsteriskIcon'
import { UserContext } from '../../../modules/common/UserContext'
import * as commonFn from 'modules/fns/commonFn'
import Api from 'modules/consts/Api'
import CommonAxios from 'modules/utils/CommonAxios'
import dayjs from 'dayjs'
import { fileDownload, getfile } from 'modules/utils/CommonUtils'

const AgremVnentrInvtMgDetailView = (props) => {
  const theme = useTheme()
  const location = useLocation()
  let path = location.pathname
  let category = path.split('/')
  const history = useHistory()
  const id = props.match.params.id
  const [confirmReg, setConfirmReg] = useState(false)
  const [confirmCancel, setConfirmCancel] = useState(false)
  const userContext = useContext(UserContext)
  const [detailView, setDetailView] = useState({
    agremVnentrSeq: '', //시퀀스 번호
    invmEnprNm: '', //투자기관명
    bzn: '', //사업자번호
    adr: '', //주소
    agremYn: 'Y', //협약여부
    agremCnclsde: dayjs().format('YYYY-MM-DD'), //협약체결일
    agremExprtnde: dayjs().add(1, 'year').format('YYYY-MM-DD'), //협약 만기일
    agrmntAtchmnfl2: [], //협약서
    agrmntAtchmnflList: [],
    contactRsprOneNm: '', //연락담당자1 이름
    contactRsprOneCnplTpn: '', //연락담당자1 전화번호
    contactRsprOneEad: '', //연락담당자1 이메일
    contactRsprTwoNm: '', //연락담당자2 이름
    contactRsprTwoCnplTpn: '', //연락담당자2 전화번호
    contactRsprTwoEad: '', //연락담당자2 이메일
    adminUser: ''
  })
  const fileIdRef = useRef()

  detailView.adminUser = userContext.state.userInfo?.mngrId

  // 상세조회
  const getDetailView = async () => {
    loader(true, 'Uploading...')
    const res = await getVncmloanAgisDetail(id)
    if (res.data.code === '200') {
      setDetailView(res.data.data)
      loader()
    }
  }

  const FileUploadExtOpt = {
    LICENSE: { str: '.jpg, .jpeg, .png, .pdf', list: ['.jpg', '.jpeg', '.png', '.pdf'] },
    IMAGE: { str: '.jpg, .jpeg, .png, .gif', list: ['.jpg', '.jpeg', '.png', '.gif'] },
    IMAGE_WITHOUT_GIF: { str: '.jpg, .jpeg, .png', list: ['.jpg', '.jpeg', '.png'] },
    DOC: { str: '.ppt, .pptx, .doc, .docx, .pdf, .hwp', list: ['.ppt', '.pptx', '.doc', '.docx', '.pdf', '.hwp'] },
    PDF: { str: '.pdf', list: ['.pdf'] },
    EXCEL: { str: '.xlsx', list: ['.xlsx'] },
    ALL: { str: '', list: [] }
  }

  // 문자열 변환
  const StringUtils = {
    telNumber: (value) => {
      return String(value).replace(/(\d{3})(\d{4})(\d{4})/g, '$1-$2-$3')
    },
    bizNum: (value) => {
      return String(value).replace(/(\d{3})(\d{2})(\d{5})/g, '$1-$2-$3')
    }
  }

  /** 사업자번호 하이픈 및 입력제한 */
  const handleBusiNum = (e) => {
    const regex = /^[0-9]*$/
    const num = e.target.value.replace(/-/g, '', '')
    if (regex.test(num) && e.target.value.length < 13 && num.length < 11) {
      const {
        target: { name }
      } = e
      setDetailView((prev) => ({ ...prev, [name]: isBusiFormat(num) }))
    }
  }
  const isBusiFormat = (busiNum) => {
    return busiNum.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3')
  }

  /** 전화번호 하이픈 및 입력제한 */
  const handlePhoneNum = (e) => {
    const regex = /^[0-9]*$/
    const num = e.target.value.replace(/-/g, '', '')
    if (regex.test(num) && e.target.value.length < 14 && num.length < 12) {
      const {
        target: { name }
      } = e
      setDetailView((prev) => ({ ...prev, [name]: isTelFormat(num) }))
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
      } else if (tel.length === 11) {
        //000-0000-0000
        return tel.replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
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

  const handleConfirmReg = () => {
    detailView.bzn = detailView.bzn.replace(/-/g, '', '')
    detailView.contactRsprOneCnplTpn = detailView.contactRsprOneCnplTpn.replace(/-/g, '', '')
    detailView.contactRsprTwoCnplTpn = detailView.contactRsprTwoCnplTpn.replace(/-/g, '', '')

    // 필수값 체크
    if (detailView.invmEnprNm === '') {
      alert('투자기관명을 입력하세요')
      return false
    }
    if (detailView.bzn === '') {
      alert('사업자번호를 입력하세요')
      return false
    }
    if (detailView.contactRsprOneNm === '') {
      alert('연락담당자1 이름을 입력하세요')
      return false
    }
    if (detailView.contactRsprOneCnplTpn === '') {
      alert('연락담당자1 전화번호를 입력하세요')
      return false
    }
    if (detailView.contactRsprTwoNm === '') {
      alert('연락담당자2 이름을 입력하세요')
      return false
    }
    if (detailView.contactRsprTwoCnplTpn === '') {
      alert('연락담당자2 전화번호를 입력하세요')
      return false
    }

    setConfirmReg(!confirmReg)
  }

  //협약 여부 버튼 체크
  const handleClick = (agremYnVlaue) => {
    setDetailView((prevDetailView) => ({
      ...prevDetailView,
      agremYn: agremYnVlaue
    }))
  }

  //협약 체결일, 협약 만기일
  const initializeDate = (dateValue, fallbackDate) => {
    return dateValue ? dayjs(dateValue) : fallbackDate
  }

  //협약 체결일
  const handleCnclsdeChange = (date) => {
    const newAgremCnclsde = date.format('YYYY-MM-DD')
    const newAgremExprnde = detailView.agremExprtnde

    if (dayjs(newAgremExprnde).isBefore(newAgremCnclsde)) {
      alert('협약만기일은 협약체결일 이후여야 합니다.')
      setDetailView((prevDetailView) => ({
        ...prevDetailView,
        agremCnclsde: newAgremCnclsde,
        agremExprtnde: dayjs(newAgremCnclsde).add(1, 'year').format('YYYY-MM-DD')
      }))
    } else {
      setDetailView((prevDetailView) => ({
        ...prevDetailView,
        agremCnclsde: newAgremCnclsde
      }))
    }
  }

  //협약 만기일
  const handleExprndeChange = (date) => {
    const newAgremCnclsde = detailView.agremCnclsde
    const newAgremExprnde = date.format('YYYY-MM-DD')

    if (dayjs(newAgremExprnde).isBefore(newAgremCnclsde)) {
      alert('협약만기일은 협약체결일 이후여야 합니다.')
      setDetailView((prevDetailView) => ({
        ...prevDetailView,
        agremCnclsde: newAgremCnclsde,
        agremExprtnde: dayjs(newAgremCnclsde).add(1, 'year').format('YYYY-MM-DD')
      }))
    } else {
      setDetailView((prevDetailView) => ({
        ...prevDetailView,
        agremExprtnde: newAgremExprnde
      }))
    }
  }

  // 협약 체결일 없으면 오늘날짜 협약 만기일은 1년뒤로 자동 세팅
  if (detailView.agremCnclsde === ' ') {
    setDetailView((prevDetailView) => ({
      ...prevDetailView,
      agremCnclsde: dayjs().format('YYYY-MM-DD'),
      agremExprtnde: dayjs().add(1, 'year').format('YYYY-MM-DD')
    }))
  }

  const handleConfirmCancel = () => {
    setConfirmCancel(!confirmCancel)
  }
  // 등록 취소
  const handleCancel = (type) => {
    if (type === 'confirm') {
      history.push(`${ROUTER_NAMES.INVEST_RECOMENDRCEPT_AGREMVNENTRINVTMGLISTVIEW}`)
    } else {
      handleConfirmCancel()
    }
  }

  // 게시글 등록
  const handleConfirm = async (type) => {
    if (type === 'confirm') {
      loader(true, 'Uploading...')
      const url = Api.invest.vncmloanAgisSave
      const formData = new FormData()
      for (let key in detailView) {
        formData.append(key, detailView[key])
      }
      for (let i = 0; i < detailView.agrmntAtchmnfl2.length; i++) {
        const fileData = detailView.agrmntAtchmnfl2[i]
        if (fileData.file) {
          formData.append('file', fileData.file)
        } else if (fileData.fileId) {
          const downloadedFile = await getfile(fileData)
          formData.append('file', downloadedFile)
        }
      }

      formData.append('json', new Blob([JSON.stringify(detailView)], { type: 'application/json' }))

      const res = await CommonAxios('IVT', getFileUploadConfig(url, formData))
      if (res.data.code === '200') {
        history.push(`${ROUTER_NAMES.INVEST_RECOMENDRCEPT_AGREMVNENTRINVTMGLISTVIEW}`)
        loader()
      }
    } else {
      setConfirmReg(!confirmReg)
    }
  }

  const getFileUploadConfig = (url, form) => {
    const config = {
      url: url,
      method: 'post',
      data: form,
      fileused: true
    }
    return config
  }

  // 파일 업로드 실행
  const handleFiles = () => {
    if (detailView.agrmntAtchmnfl2.length < 5) {
      fileIdRef.current.click()
    } else {
      alert('파일은 최대 5개까지만 첨부 가능합니다.')
    }
  }

  // 파일 업로드 세부
  const onSelectFile = (event) => {
    const localFile = event.target.files[0]
    const parsedLocalFile = {
      fileNm: localFile.name,
      file: localFile
    }
    setDetailView((pre) => {
      return { ...pre, agrmntAtchmnfl2: [...pre.agrmntAtchmnfl2, parsedLocalFile] }
    })
  }

  //첨부된 파일 삭제
  const deleteHandler = (fileData) => {
    const updatedAgrmntAtchmnfl2 = detailView.agrmntAtchmnfl2.filter((file) => file.fileNm !== fileData.fileNm)
    setDetailView((pre) => {
      return { ...pre, agrmntAtchmnfl2: updatedAgrmntAtchmnfl2 }
    })
  }

  // ===== 파일 다운로드
  const handleFileDownload = async (file) => {
    await fileDownload(file)
  }

  useEffect(() => {
    if (detailView.agremCnclsde) {
      setDetailView((prevDetailView) => ({
        ...prevDetailView,
        agremExprtnde: dayjs(detailView.agremCnclsde).add(1, 'year').subtract(1, 'day').format('YYYY-MM-DD')
      }))
    }
  }, [detailView.agremCnclsde])

  useEffect(() => {
    id && getDetailView()
  }, [])
  return (
    <>
      {/* Header */}
      <PageLayout currentMenu={'invest'} currentCate={'recomendRcept'} currentPage={'agremVnentrInvtMgDetailView'}>
        {confirmCancel && (
          <PopupConfirm msg={'정말로 취소하시겠습니까?'}>
            <Button2 className={'full_grey_dark'} onClick={() => handleCancel('cancel')}>
              취소
            </Button2>
            <Button2 className={'full_blue'} onClick={() => handleCancel('confirm')}>
              확인
            </Button2>
          </PopupConfirm>
        )}
        {confirmReg && (
          <PopupConfirm msg={'저장하시겠습니까?'}>
            <Button2 className={'full_grey_dark'} onClick={() => handleConfirm('cancel')}>
              취소
            </Button2>
            <Button2 className={'full_blue'} onClick={() => handleConfirm('confirm')}>
              확인
            </Button2>
          </PopupConfirm>
        )}
        <Stack direction="row" spacing={8}>
          {/* Side Menu */}

          {/* End of Side Menu */}
          <Box sx={{ width: '100%' }}>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}></Breadcrumbs>
            <Stack direction={'column'} spacing={4} alignItems="center">
              <Stack direction={'column'} spacing={2} sx={{ width: '100%' }}>
                <Stack direction={'row'} alignItems="center" spacing={1}>
                  <Typography
                    flexGrow={1}
                    variant="h1"
                    sx={{ lineHeight: '2.375rem', fontSize: '1.875rem', fontWeight: 'bold' }}
                  >
                    협약 벤처투자기관 관리
                  </Typography>
                </Stack>

                <Stack direction={'column'} spacing={6}>
                  <Stack direction={'column'} spacing={2}>
                    <Box sx={{ flexGrow: 1 }}>
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
                              spacing={0.5}
                              direction="row"
                              justifyContent="flex-start"
                              alignItems="center"
                              sx={{ height: '100%' }}
                            >
                              <Typography variant="body1">투자기관명</Typography>
                              <BtaAsteriskIcon />
                            </Stack>
                          </Grid>
                          <Grid xs sx={{ p: 2 }}>
                            <TextField
                              size="small"
                              sx={{ width: '100%' }}
                              value={detailView.invmEnprNm}
                              onChange={(e) => setDetailView({ ...detailView, invmEnprNm: e.target.value })}
                            />
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
                              spacing={0.5}
                              direction="row"
                              justifyContent="flex-start"
                              alignItems="center"
                              sx={{ height: '100%' }}
                            >
                              <Typography variant="body1">사업자번호</Typography>
                              <BtaAsteriskIcon />
                            </Stack>
                          </Grid>
                          <Grid xs sx={{ p: 2 }}>
                            <TextField
                              size="small"
                              sx={{ width: '100%' }}
                              name="bzn"
                              value={StringUtils.bizNum(detailView.bzn)}
                              onChange={handleBusiNum}
                            />
                          </Grid>
                        </Grid>

                        <Grid xs={12} container sx={{ borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}` }}>
                          <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                            <Stack
                              direction="column"
                              justifyContent="center"
                              alignItems="flex-start"
                              sx={{ height: '100%' }}
                            >
                              <Typography variant="body1">주소</Typography>
                            </Stack>
                          </Grid>
                          <Grid xs sx={{ p: 2 }}>
                            <TextField
                              size="small"
                              sx={{ width: '100%' }}
                              value={detailView.adr}
                              onChange={(e) => setDetailView({ ...detailView, adr: e.target.value })}
                            />
                          </Grid>
                        </Grid>

                        <Grid xs={12} container sx={{ borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}` }}>
                          <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                            <Stack
                              direction="column"
                              justifyContent="center"
                              alignItems="flex-start"
                              sx={{ height: '100%' }}
                            >
                              <Typography variant="body1">협약여부</Typography>
                            </Stack>
                          </Grid>
                          <Grid xs sx={{ p: 2 }}>
                            <ButtonGroup variant="outlined" default="">
                              <Button
                                color={detailView.agremYn === 'Y' ? 'secondary' : 'info'}
                                variant={detailView.agremYn === 'Y' ? 'contained' : 'outlined'}
                                sx={{ color: detailView.agremYn === 'Y' ? theme.palette.white.main : '' }}
                                onClick={() => handleClick('Y')}
                                disableElevation
                              >
                                협약
                              </Button>
                              <Button
                                color={detailView.agremYn === 'N' ? 'secondary' : 'info'}
                                variant={detailView.agremYn === 'N' ? 'contained' : 'outlined'}
                                sx={{ color: detailView.agremYn === 'N' ? theme.palette.white.main : '' }}
                                onClick={() => handleClick('N')}
                                disableElevation
                              >
                                협약 해제
                              </Button>
                            </ButtonGroup>
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
                              <Typography variant="body1">협약체결일</Typography>
                            </Stack>
                          </Grid>
                          <Grid xs sx={{ p: 2 }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                format="YYYY-MM-DD"
                                sx={{ width: '100%' }}
                                value={initializeDate(detailView?.agremCnclsde, dayjs())}
                                onChange={handleCnclsdeChange}
                              />
                            </LocalizationProvider>
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
                              <Typography variant="body1">협약 만기일</Typography>
                            </Stack>
                          </Grid>
                          <Grid xs sx={{ p: 2 }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                format="YYYY-MM-DD"
                                sx={{ width: '100%' }}
                                value={initializeDate(detailView?.agremExprtnde, dayjs().add(1, 'year').startOf('day'))}
                                onChange={handleExprndeChange}
                              />
                            </LocalizationProvider>
                          </Grid>
                        </Grid>

                        <Grid xs={12} container sx={{ borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}` }}>
                          <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                            <Stack
                              direction="column"
                              justifyContent="center"
                              alignItems="flex-start"
                              sx={{ height: '100%' }}
                            >
                              <Typography variant="body1">협약서</Typography>
                            </Stack>
                          </Grid>
                          <Grid xs sx={{ p: 2 }}>
                            <Stack direction={'column'} spacing={2}>
                              {detailView.agrmntAtchmnfl2.length > 0 && (
                                <Stack
                                  justifyContent={'center'}
                                  alignItems={'start'}
                                  direction={'column'}
                                  spacing={1}
                                  sx={{ p: 3, width: '100%', boxSizing: 'border-box' }}
                                  backgroundColor={theme.palette.lightBlueGrey.main}
                                >
                                  {detailView.agrmntAtchmnfl2.map((file, idx) => (
                                    <Box
                                      key={commonFn.createKey()}
                                      width={340}
                                      alignItems={'center'}
                                      justifyItems="start"
                                      display={'flex'}
                                    >
                                      <button
                                        key={idx}
                                        className="btn_download"
                                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                        onClick={() => handleFileDownload(file)}
                                      >
                                        {file.fileNm}
                                      </button>
                                      <div>
                                        <a
                                          onClick={() => deleteHandler(file)}
                                          style={{ cursor: 'pointer' }}
                                          className="file_del"
                                        >
                                          [x]
                                        </a>
                                      </div>
                                    </Box>
                                  ))}
                                </Stack>
                              )}
                              {detailView.agrmntAtchmnfl2.length == 0 && (
                                <Stack direction={'column'} spacing={2}>
                                  <Stack
                                    justifyContent={'center'}
                                    alignItems={'center'}
                                    direction={'row'}
                                    spacing={1}
                                    sx={{ p: 3, width: '100%', boxSizing: 'border-box' }}
                                    backgroundColor={theme.palette.lightBlueGrey.main}
                                  >
                                    <PlaylistAddIcon color="secondary" />
                                    <Typography variant="body2">
                                      파일을 드래그해서 올려 놓거나, 파일추가를 통해 파일을 등록하세요.
                                    </Typography>
                                  </Stack>
                                </Stack>
                              )}
                            </Stack>

                            <Stack direction={'row'} alignItems={'center'} spacing={2}>
                              <input
                                ref={fileIdRef}
                                type="file"
                                name="file"
                                multiple
                                accept={FileUploadExtOpt.DOC.str}
                                onChange={onSelectFile}
                                style={{ display: 'none' }}
                              />
                              <Button variant="outlined" color="info" sx={{ boxShadow: 'none' }} onClick={handleFiles}>
                                파일첨부
                              </Button>
                              <Typography color="grey" variant="body2">
                                * pptx, doc, docx, hwp, pdf 100MB 이내
                              </Typography>
                            </Stack>
                          </Grid>
                        </Grid>

                        <Grid xs={12} container sx={{ borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}` }}>
                          <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                            <Stack
                              direction="column"
                              justifyContent="center"
                              alignItems="flex-start"
                              sx={{ height: '100%' }}
                            >
                              <Typography variant="body1">연락 담당자1</Typography>
                            </Stack>
                          </Grid>
                          <Grid xs sx={{ p: 2 }}>
                            <Stack direction={'column'} spacing={2}>
                              <Stack direction={'row'} alignItems={'center'} spacing={2}>
                                <Stack width={200} alignItems={'center'} direction={'row'} spacing={1}>
                                  <Typography color={'grey'}>이름</Typography>
                                  <BtaAsteriskIcon />
                                </Stack>
                                <TextField
                                  size="small"
                                  sx={{ width: '100%' }}
                                  value={detailView.contactRsprOneNm}
                                  onChange={(e) => setDetailView({ ...detailView, contactRsprOneNm: e.target.value })}
                                />
                              </Stack>
                              <Stack direction={'row'} alignItems={'center'} spacing={2}>
                                <Stack width={200} alignItems={'center'} direction={'row'} spacing={1}>
                                  <Typography color={'grey'}>전화번호</Typography>
                                  <BtaAsteriskIcon />
                                </Stack>
                                <TextField
                                  size="small"
                                  sx={{ width: '100%' }}
                                  name="contactRsprOneCnplTpn"
                                  value={StringUtils.telNumber(detailView.contactRsprOneCnplTpn)}
                                  onChange={handlePhoneNum}
                                />
                              </Stack>
                              <Stack direction={'row'} alignItems={'center'} spacing={2}>
                                <Stack width={200} alignItems={'center'} direction={'row'} spacing={1}>
                                  <Typography color={'grey'}>이메일</Typography>
                                </Stack>
                                <TextField
                                  size="small"
                                  sx={{ width: '100%' }}
                                  value={detailView.contactRsprOneEad}
                                  onChange={(e) => setDetailView({ ...detailView, contactRsprOneEad: e.target.value })}
                                />
                              </Stack>
                            </Stack>
                          </Grid>
                        </Grid>

                        <Grid xs={12} container sx={{ borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}` }}>
                          <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                            <Stack
                              direction="column"
                              justifyContent="center"
                              alignItems="flex-start"
                              sx={{ height: '100%' }}
                            >
                              <Typography variant="body1">연락 담당자2</Typography>
                            </Stack>
                          </Grid>
                          <Grid xs sx={{ p: 2 }}>
                            <Stack direction={'column'} spacing={2}>
                              <Stack direction={'row'} alignItems={'center'} spacing={2}>
                                <Stack width={200} alignItems={'center'} direction={'row'} spacing={1}>
                                  <Typography color={'grey'}>이름</Typography>
                                  <BtaAsteriskIcon />
                                </Stack>
                                <TextField
                                  size="small"
                                  sx={{ width: '100%' }}
                                  value={detailView.contactRsprTwoNm}
                                  onChange={(e) => setDetailView({ ...detailView, contactRsprTwoNm: e.target.value })}
                                />
                              </Stack>
                              <Stack direction={'row'} alignItems={'center'} spacing={2}>
                                <Stack width={200} alignItems={'center'} direction={'row'} spacing={1}>
                                  <Typography color={'grey'}>전화번호</Typography>
                                  <BtaAsteriskIcon />
                                </Stack>
                                <TextField
                                  size="small"
                                  sx={{ width: '100%' }}
                                  name="contactRsprTwoCnplTpn"
                                  value={StringUtils.telNumber(detailView.contactRsprTwoCnplTpn)}
                                  onChange={handlePhoneNum}
                                />
                              </Stack>
                              <Stack direction={'row'} alignItems={'center'} spacing={2}>
                                <Stack width={200} alignItems={'center'} direction={'row'} spacing={1}>
                                  <Typography color={'grey'}>이메일</Typography>
                                </Stack>
                                <TextField
                                  size="small"
                                  sx={{ width: '100%' }}
                                  value={detailView.contactRsprTwoEad}
                                  onChange={(e) => setDetailView({ ...detailView, contactRsprTwoEad: e.target.value })}
                                />
                              </Stack>
                            </Stack>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Box>
                  </Stack>
                </Stack>
              </Stack>

              <Stack spacing={2} direction="row" justifyContent="center">
                <Button
                  color={'info'}
                  variant="outlined"
                  size="large"
                  onClick={() => history.push(ROUTER_NAMES.INVEST_RECOMENDRCEPT_AGREMVNENTRINVTMGLISTVIEW)}
                  sx={{
                    width: 120,
                    fontWeight: 'bold',
                    borderRadius: 12
                  }}
                >
                  목록
                </Button>

                <Button
                  color="secondary"
                  variant="contained"
                  size="large"
                  onClick={handleConfirmReg}
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
                >
                  저장
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </PageLayout>
    </>
  )
}

export default AgremVnentrInvtMgDetailView
