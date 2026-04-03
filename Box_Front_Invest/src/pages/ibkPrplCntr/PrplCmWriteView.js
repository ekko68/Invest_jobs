import { CloudUploadOutlined, FiberManualRecordOutlined, HomeOutlined, Close } from '@mui/icons-material'
import {
  Box,
  Button,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  useTheme
} from '@mui/material'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { BtContentGrid } from 'components/bt/BtContentGrid'
import { BtNavSelect } from 'components/bt/BtNavSelect'
import { BtSelect } from 'components/bt/BtSelect/BtSelect'
// import Grid from '@mui/material/Unstable_Grid2';
import Header from 'components/header/Header'
import Api from 'modules/consts/Api'
import { AlertLabels, FileUploadExtOpt, FileUploadSizeOpt } from 'modules/consts/BizConst'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import CommonAxios, { getConfig, getPostConfig } from 'modules/utils/CommonAxios'
import { createKey } from 'modules/utils/CommonUtils'
import DateUtils from 'modules/utils/DateUtils'
import QueryUtils from 'modules/utils/QueryUtils'
import { exeFunc } from 'modules/utils/ReactUtils'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import ConfirmPopup from 'pageComponents/common/pop/ConfirmPopup'
import { useContext, useEffect, useRef, useState, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { StringUtils } from 'modules/utils/StringUtils'
import { getfile } from 'modules/utils/CommonAxios'
import dayjs from 'dayjs'
import TextFieldInput from 'components/common/TextFieldInput'
import MuiNumberInput from 'pageComponents/common/number/MuiNumberInput'
import { isNumber } from 'modules/utils/NumberUtils'

const PrplCmWriteView = (props) => {
  const theme = useTheme()
  const history = useHistory()
  const commonContext = useContext(CommonContext)
  const alertPopRef = useRef()
  const confirmPopRef = useRef()

  const [vo, setVo] = useState({
    utlinsttId: '', //이용기관(회사) ID
    rcmdEnprBzn: '', //추천 기업 사업자 번호
    prnNm: '', //운용사명
    chrgAudofir: '', //담당 심사역
    cnpl: '', //연락처
    ead: '', //이메일
    rcmdEnprNm: '', //추천 기업명
    mainBiz: '', //주요사업
    leadInvstrPrnNm: '', //리드투자자_운용사명
    leadInvstrAmount: '', //리드투자자_금액
    leadInvstrStep: 0, //리드투자자_단계
    invmRndEndPnttm: '', //투자 라운드 종료시점
    totInvmCnfmnAmt: '', //총 투자 유치금액
    progrsValue: '', //진행밸류
    recomendOpinion: '', //추천의견
    oprtrCnfaYn: '', //운영자 읽음 여부
    atchmnfl1: [], //첨부파일
    atchmnfl2: [],
    sbmsStts: '', //취소여부
    totInvmCnfmnAmtTo: '', //총 투자 유치금액
    progrsValueTo: '' //진행밸류
  })

  const fileIdRef = useRef()
  const [rdoChk1, setRdoChk1] = useState('')
  const [rdoChk2, setRdoChk2] = useState('')
  const [rdoChk3, setRdoChk3] = useState('')

  // 라디오 버튼 체크
  const handleRdoChk = (e, gubun) => {
    if (e.target.name === 'invmRndEndPnttm') {
      setRdoChk1(gubun)
    } else if (e.target.name === 'totInvmCnfmnAmt') {
      setRdoChk2(gubun)
    } else if (e.target.name === 'progrsValue') {
      setRdoChk3(gubun)
    }
  }

  const savePrplcm = async (e) => {
    //금액 , 제거
    // vo.leadInvstrAmount = vo.leadInvstrAmount.replace(/,/g, '', '')
    vo.totInvmCnfmnAmt = vo.totInvmCnfmnAmt.replace(/,/g, '', '')
    vo.totInvmCnfmnAmtTo = vo.totInvmCnfmnAmtTo.replace(/,/g, '', '')
    vo.progrsValue = vo.progrsValue.replace(/,/g, '', '')
    vo.progrsValueTo = vo.progrsValueTo.replace(/,/g, '', '')

    //하이픈 제거
    vo.cnpl = vo.cnpl.replace(/-/g, '', '')
    vo.rcmdEnprBzn = vo.rcmdEnprBzn.replace(/-/g, '', '')

    if (String(vo.chrgAudofir).trim() === '') {
      exeFunc(alertPopRef, 'open', '담당 심사역을 입력해주세요.')
      return
    }

    if (String(vo.cnpl).trim() === '') {
      exeFunc(alertPopRef, 'open', '연락처를 입력해주세요.')
      return
    }

    if (String(vo.ead).trim() === '') {
      exeFunc(alertPopRef, 'open', '이메일을 입력해주세요.')
      return
    }

    if (String(vo.rcmdEnprNm).trim() === '') {
      exeFunc(alertPopRef, 'open', '추천기업명을 입력해주세요.')
      return
    }

    if (String(vo.rcmdEnprBzn).trim() === '') {
      exeFunc(alertPopRef, 'open', '사업자번호를 입력해주세요.')
      return
    }

    if (String(vo.rcmdEnprBzn).trim().length < 10) {
      exeFunc(alertPopRef, 'open', '사업자번호를 확인해주세요.')
      return
    }

    if (String(vo.mainBiz).trim() === '') {
      exeFunc(alertPopRef, 'open', '주요사업을 입력해주세요.')
      return
    }

    if (String(vo.recomendOpinion).trim() === '') {
      exeFunc(alertPopRef, 'open', '추천의견을 입력해주세요.')
      return
    }

    if (String(vo.atchmnfl2).trim() === '') {
      exeFunc(alertPopRef, 'open', '파일을 첨부해주세요.')
      return
    }

    vo.utlinsttId = commonContext.state.user.info.groupId
    let isSaveComplete = true
    const url = Api.ibkPrplCntr.prplCmWrite

    const formData = new FormData()
    for (let key in vo) {
      formData.append(key, vo[key])
    }
    for (let i = 0; i < vo.atchmnfl2.length; i++) {
      const fileData = vo.atchmnfl2[i]
      if (fileData.file) {
        formData.append('file', fileData.file)
      } else if (fileData.fileId) {
        const downloadedFile = await getfile(fileData)
        formData.append('file', downloadedFile)
      }
    }

    formData.append('json', new Blob([JSON.stringify(vo)], { type: 'application/json' }))

    const saveRes = await CommonAxios(getFileUploadConfig(url, formData), true)
    if (saveRes) {
      if (saveRes.data.code !== '200') {
        isSaveComplete = false
      }
    } else {
      isSaveComplete = false
    }

    if (isSaveComplete) {
      history.push(ROUTER_NAMES.PRPL_CM_LIST_VIEW)
    } else {
      exeFunc(alertPopRef, 'open', AlertLabels.notSaved)
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

  /** 금액 숫자 콤마 */
  const handleCommaNum = (e) => {
    const regex = /^[0-9]*$/
    const num = e.target.value.replace(/,/g, '', '')
    if (regex.test(num) && e.target.value.length < 26 && num.length < 20) {
      const {
        target: { name }
      } = e
      setVo((prev) => ({ ...prev, [name]: isCommaFormat(num) }))
    }
  }
  const isCommaFormat = (num) => {
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  /** 사업자번호 하이픈 및 입력제한 */
  const handleBusiNum = (e) => {
    const regex = /^[0-9]*$/
    const num = e.target.value.replace(/-/g, '', '')
    if (regex.test(num) && e.target.value.length < 13 && num.length < 11) {
      const {
        target: { name }
      } = e
      setVo((prev) => ({ ...prev, [name]: isBusiFormat(num) }))
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
      setVo((prev) => ({ ...prev, [name]: isTelFormat(num) }))
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
        //02-0000-0000
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

  //텍스트 입력
  const changeText = (e) => {
    const { name, value } = e.target
    const nextInputs = {
      ...vo,
      [name]: value
    }
    setVo(nextInputs)
  }

  //셀렉트 박스 값
  const clickSelData = (val) => {
    setVo({ ...vo, leadInvstrStep: val })
  }

  const loadPrplcmWrite = async () => {
    await commonContext.actions.callbackAfterSessionRefresh(
      async () => {
        const res = await CommonAxios(getPostConfig(Api.ibkPrplCntr.prplCmWrite, vo))

        if (res && res.status === 200 && res.data.code === '200') {
          const prplCmWriteObject = await loadPrplCmWriteList()
          setVo(prplCmWriteObject)
        } else {
          exeFunc(alertPopRef, 'open', AlertLabels.askAdmin)
        }
      },
      true,
      true
    )
  }

  const loadPrplCmWriteList = async () => {
    const url = Api.ibkPrplCntr.prplCmList

    const res = await CommonAxios(getConfig(url), false)
    if (res && res.status === 200) {
      return res.data.data
    }
  }

  const onDatePickerChange = (currentDate, id) => {
    const year = currentDate.$y
    const month = currentDate.$M < 10 ? '0' + Number(currentDate.$M + 1) : currentDate.$M
    const day = currentDate.$D < 10 ? '0' + currentDate.$D : currentDate.$D
    const ymd = year + month + day

    setRdoChk1('Y')
    setVo({ ...vo, invmRndEndPnttm: DateUtils.customDateFormat(ymd, 'yyyy-MM-dd') })
  }

  const onClickCancel = () => {
    exeFunc(confirmPopRef, 'open', AlertLabels.prplcmWriteCancel)
  }

  const confirmCancel = async () => {
    history.push(ROUTER_NAMES.PRPL_CM_LIST_VIEW)
  }

  // TODO: Drag 중일 때 box에 highlight 주면 좋다
  const [isDragging, setIsDragging] = useState(false)

  const fileId = useRef(0)
  const dragRef = useRef(null)

  const onChangeFiles = useCallback(
    (e) => {
      let selectFiles = []
      let filedAdded = []

      if (e.type === 'drop') {
        selectFiles = e.dataTransfer.files
      } else {
        selectFiles = e.target.files
      }

      for (const file of selectFiles) {
        filedAdded = [
          ...filedAdded,
          {
            fileNm: file.name,
            file: file
          }
        ]
      }

      setVo({ ...vo, atchmnfl2: filedAdded })
    },
    [vo]
  )

  const handleDragIn = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  })
  const handleDragOut = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  })
  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer && e.dataTransfer.files) {
      setIsDragging(true)
    }
  })
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()

      onChangeFiles(e)
      setIsDragging(false)
    },
    [onChangeFiles]
  )
  const initDragEvents = useCallback((e) => {
    if (dragRef.current !== null) {
      dragRef.current.addEventListener('dragenter', handleDragIn)
      dragRef.current.addEventListener('dragleave', handleDragOut)
      dragRef.current.addEventListener('dragover', handleDragOver)
      dragRef.current.addEventListener('drop', handleDrop)
    }
  })
  const resetDragEvents = useCallback((e) => {
    if (dragRef.current !== null) {
      dragRef.current.removeEventListener('dragenter', handleDragIn)
      dragRef.current.removeEventListener('dragleave', handleDragOut)
      dragRef.current.removeEventListener('dragover', handleDragOver)
      dragRef.current.removeEventListener('drop', handleDrop)
    }
  })

  useEffect(() => {
    initDragEvents()

    return () => resetDragEvents()
  }, [initDragEvents, resetDragEvents])

  // 파일 업로드 실행
  const handleFiles = () => {
    fileIdRef.current.click()
    const options = { limitSizeOpt: FileUploadSizeOpt.DEFAULT, acceptExtOpt: FileUploadExtOpt.DOC }
    fileIdRef.current.addEventListener('change', (event) => onUploadFile(event, alertPopRef, options), { once: true })
  }

  // 파일 업로드 세부
  const onUploadFile = (event, alertPopupRef = null, options = {}) => {
    if (event.target.files?.length > 0) {
      const file = event.target.files[0]

      const limitSizeOpt = isNumber(options?.limitSizeOpt?.size) ? options.limitSizeOpt : FileUploadSizeOpt.DEFAULT

      let isExtPass = true
      if (options?.acceptExtOpt?.list?.length > 0) {
        const ext = file.name.substring(file.name.lastIndexOf('.'))
        if (options.acceptExtOpt.list.findIndex((e) => e === ext) < 0) isExtPass = false
      }

      if (file.size > limitSizeOpt.size) {
        if (alertPopupRef)
          exeFunc(alertPopupRef, 'open', `업로드 파일 용량(${limitSizeOpt.name} 이하)을 초과 하였습니다.`)
      } else if (!isExtPass) {
        if (alertPopupRef) exeFunc(alertPopupRef, 'open', '파일 확장자를 확인해 주세요.')
      } else {
        onChangeFiles(event)
      }
    } else {
      if (alertPopupRef) exeFunc(alertPopupRef, 'open', '잠시 후에 다시 시도해주세요.')
    }

    event.target.value = ''
  }
  //첨부된 파일 삭제
  const deleteHandler = (fileData) => {
    const updatedAgrmntAtchmnfl2 = vo.atchmnfl2.filter((file) => file.fileNm !== fileData.fileNm)
    setVo((pre) => {
      return { ...pre, atchmnfl2: updatedAgrmntAtchmnfl2 }
    })
  }

  const isMounted = useRef(false) // useEffect에서 mount 유무 동기확인을 위함

  useEffect(() => {
    if (commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
      isMounted.current = true

      commonContext.actions.pageMountPathCheck(history, async () => {
        if (props.location.search !== '') {
          const query = QueryUtils.getQuery(props)
          if (query && query.hasOwnProperty('utlinsttId') && 'rcmdEnprBzn') {
            await loadPrplcmWrite()
          }
        }
      })
    }
  }, [commonContext.state.user])

  return (
    <>
      <Container maxWidth="false" disableGutters sx={{ maxWidth: '1280px', px: '1.25rem' }}>
        <Stack spacing={4} direction={'column'} sx={{ py: 5 }}>
          {/* 제안 펀드 정보 */}
          <Paper sx={{ p: 4 }}>
            <Stack direction={'column'} spacing={4}>
              <Stack direction={'column'} spacing={1}>
                <Typography variant="h3">
                  <FiberManualRecordOutlined color="primary" sx={{ mr: 1, fontSize: '1rem' }} />
                  운용사 추천기업 등록
                </Typography>
                <Divider sx={{ height: '1px', backgroundColor: theme.palette.primary.main }} />
              </Stack>

              <Stack direction={'column'} spacing={1}>
                <Grid container sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
                  <BtContentGrid gridXs={6} title={'운용사명'} required={true}>
                    <TextField
                      name="prnNm"
                      size="small"
                      value={
                        StringUtils.hasLength(commonContext.state.user.info?.name)
                          ? commonContext.state.user.info.name
                          : ''
                      }
                      sx={{ width: '100%' }}
                      onChange={changeText}
                    />
                  </BtContentGrid>

                  <BtContentGrid gridXs={6} title={'담당 심사역'} required={true}>
                    <TextFieldInput
                      size="small"
                      item={vo}
                      name={'chrgAudofir'}
                      numberProperty={'chrgAudofir'}
                      values={vo.chrgAudofir}
                    />
                  </BtContentGrid>

                  <BtContentGrid gridXs={6} title={'연락처'} required={true}>
                    <TextField
                      name="cnpl"
                      size="small"
                      value={vo.cnpl}
                      sx={{ width: '100%' }}
                      onChange={handlePhoneNum}
                    />
                  </BtContentGrid>

                  <BtContentGrid gridXs={6} title={'이메일'} required={true}>
                    <TextFieldInput size="small" item={vo} name={'ead'} numberProperty={'ead'} values={vo.ead} />
                  </BtContentGrid>
                </Grid>
              </Stack>

              <Stack direction={'column'} spacing={1}>
                <Grid container sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
                  <BtContentGrid gridXs={6} title={'추천 기업명'} required={true}>
                    <TextFieldInput
                      size="small"
                      item={vo}
                      name={'rcmdEnprNm'}
                      numberProperty={'rcmdEnprNm'}
                      values={vo.rcmdEnprNm}
                    />
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'사업자번호'} required={true}>
                    <TextField
                      name="rcmdEnprBzn"
                      size="small"
                      value={vo.rcmdEnprBzn}
                      sx={{ width: '100%' }}
                      onChange={handleBusiNum}
                    />
                  </BtContentGrid>

                  <BtContentGrid gridXs={12} title={'주요사업'} required={true}>
                    <TextFieldInput
                      size="small"
                      item={vo}
                      name={'mainBiz'}
                      numberProperty={'mainBiz'}
                      placeholder="20자 이내 작성"
                      values={vo.mainBiz}
                    />
                  </BtContentGrid>

                  <BtContentGrid gridXs={12} title={'리드투자자'}>
                    <Stack direction={'row'} spacing={2} sx={{ width: '100%' }}>
                      <Stack flexGrow={1} direction={'row'} alignItems={'center'} spacing={1}>
                        <Typography sx={{ width: '4rem' }}>운용사명</Typography>

                        <TextFieldInput
                          size="small"
                          item={vo}
                          name={'leadInvstrPrnNm'}
                          numberProperty={'leadInvstrPrnNm'}
                          values={vo.leadInvstrPrnNm}
                        />
                      </Stack>
                      <Stack flexGrow={1} direction={'row'} alignItems={'center'} spacing={1}>
                        <Typography sx={{ width: '2rem' }}>금액</Typography>

                        <MuiNumberInput
                          item={vo}
                          numberProperty="leadInvstrAmount"
                          sx={{ width: '100%' }}
                          displayValue={vo['leadInvstrAmount']}
                          type='hundMilliwon'
                        />
                      </Stack>
                      <Stack flexGrow={1} direction={'row'} alignItems={'center'} spacing={1}>
                        <Typography sx={{ width: '2rem' }}>단계</Typography>
                        <BtSelect flexGrow={1} defaultValue={vo.leadInvstrStep} sx={{ width: '100%' }}>
                          <MenuItem disabled value={0}>
                            선택하세요
                          </MenuItem>
                          <MenuItem value={1} onClick={() => clickSelData(1)}>
                            IR
                          </MenuItem>
                          <MenuItem value={2} onClick={() => clickSelData(2)}>
                            투심
                          </MenuItem>
                          <MenuItem value={3} onClick={() => clickSelData(3)}>
                            확정
                          </MenuItem>
                          <MenuItem value={4} onClick={() => clickSelData(4)}>
                            미정
                          </MenuItem>
                        </BtSelect>
                      </Stack>
                    </Stack>
                  </BtContentGrid>

                  <BtContentGrid gridXs={12} title={'투자 라운드 종료시점'}>
                    <FormControl>
                      <RadioGroup row>
                        <FormControlLabel
                          value="1"
                          control={
                            <Radio
                              name="invmRndEndPnttm"
                              onClick={(e) => handleRdoChk(e, 'Y')}
                              checked={rdoChk1 === 'Y'}
                            />
                          }
                          label={
                            <DatePicker
                              name="invmRndEndPnttm"
                              format="YYYY-MM-DD"
                              sx={{ width: '100%' }}
                              selected={vo.invmRndEndPnttm}
                              onChange={(currentDate) => onDatePickerChange(currentDate, 'invmRndEndPnttm')}
                              minDate={dayjs(new Date())}
                            />
                          }
                        />
                        <FormControlLabel
                          value="2"
                          control={
                            <Radio
                              name="invmRndEndPnttm"
                              onClick={(e) => handleRdoChk(e, 'N')}
                              checked={rdoChk1 === 'N'}
                            />
                          }
                          label="미정"
                        />
                      </RadioGroup>
                    </FormControl>
                  </BtContentGrid>

                  <BtContentGrid gridXs={12} title={'총 투자 유치금액'}>
                    <FormControl>
                      <RadioGroup row>
                        <FormControlLabel
                          value="1"
                          control={
                            <Radio
                              name="totInvmCnfmnAmt"
                              onClick={(e) => handleRdoChk(e, 'Y')}
                              checked={rdoChk2 === 'Y'}
                            />
                          }
                          label={
                            <Stack alignItems={'center'} direction={'row'} spacing={2}>
                              <TextField
                                name="totInvmCnfmnAmt"
                                size="small"
                                InputProps={{ endAdornment: <InputAdornment position="end">억원</InputAdornment> }}
                                value={vo.totInvmCnfmnAmt}
                                sx={{ width: '100%' }}
                                onChange={handleCommaNum}
                                onFocus={() => setRdoChk2('Y')}
                              />
                              <Typography>~</Typography>
                              <TextField
                                name="totInvmCnfmnAmtTo"
                                size="small"
                                InputProps={{ endAdornment: <InputAdornment position="end">억원</InputAdornment> }}
                                value={vo.totInvmCnfmnAmtTo}
                                sx={{ width: '100%' }}
                                onChange={handleCommaNum}
                              />
                            </Stack>
                          }
                        />
                        <FormControlLabel
                          value="2"
                          control={
                            <Radio
                              name="totInvmCnfmnAmt"
                              onClick={(e) => handleRdoChk(e, 'N')}
                              checked={rdoChk2 === 'N'}
                            />
                          }
                          label="미정"
                        />
                      </RadioGroup>
                    </FormControl>
                  </BtContentGrid>

                  <BtContentGrid gridXs={12} title={'진행밸류(pre)'}>
                    <FormControl>
                      <RadioGroup row>
                        <FormControlLabel
                          value="1"
                          control={
                            <Radio name="progrsValue" onClick={(e) => handleRdoChk(e, 'Y')} checked={rdoChk3 === 'Y'} />
                          }
                          label={
                            <Stack alignItems={'center'} direction={'row'} spacing={2}>
                              <TextField
                                name="progrsValue"
                                size="small"
                                InputProps={{ endAdornment: <InputAdornment position="end">억원</InputAdornment> }}
                                value={vo.progrsValue}
                                sx={{ width: '100%' }}
                                onChange={handleCommaNum}
                                onFocus={() => setRdoChk3('Y')}
                              />
                              <Typography>~</Typography>
                              <TextField
                                name="progrsValueTo"
                                size="small"
                                InputProps={{ endAdornment: <InputAdornment position="end">억원</InputAdornment> }}
                                value={vo.progrsValueTo}
                                sx={{ width: '100%' }}
                                onChange={handleCommaNum}
                              />
                            </Stack>
                          }
                        />
                        <FormControlLabel
                          value="2"
                          control={
                            <Radio name="progrsValue" onClick={(e) => handleRdoChk(e, 'N')} checked={rdoChk3 === 'N'} />
                          }
                          label="미정"
                        />
                      </RadioGroup>
                    </FormControl>
                  </BtContentGrid>

                  <BtContentGrid gridXs={12} title={'추천 의견'} required={true}>
                    <TextField
                      name="recomendOpinion"
                      size="small"
                      value={vo.recomendOpinion}
                      sx={{ width: '100%' }}
                      multiline
                      rows={10}
                      onChange={changeText}
                    />
                  </BtContentGrid>

                  <BtContentGrid
                    gridXs={12}
                    title={'파일첨부'}
                    required={true}
                    additionalContents={
                      <Typography variant="body2" sx={{ color: theme.palette.text.sub }}>
                        (회사 자료, <br />
                        투심 보고서)
                      </Typography>
                    }
                  >
                    <Stack direction={'column'} spacing={2} sx={{ width: '100%' }}>
                      {/* <label onDrop={(e) => handleDrop(e)}> */}
                      <Box
                        sx={{
                          p: 2,
                          boxSizing: 'border-box',
                          width: '100%',
                          backgroundColor: theme.palette.background.default
                        }}
                        ref={dragRef}
                      >
                        {vo.atchmnfl2.length > 0 ? (
                          vo.atchmnfl2.map((file) => {
                            return (
                              <>
                                <Box key={createKey()} width={340} alignItems={'center'} display={'flex'}>
                                  <Typography>{file.fileNm}</Typography>

                                  <IconButton
                                    onClick={() => deleteHandler(file)}
                                    size="small"
                                    sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                                  >
                                    <Close />
                                  </IconButton>
                                </Box>
                              </>
                            )
                          })
                        ) : (
                          <Stack
                            direction="column"
                            justifyContent="center"
                            alignItems="center"
                            sx={{ borderRadius: 3, p: 3, border: `3px solid ${theme.palette.disabled.light}` }}
                          >
                            <CloudUploadOutlined sx={{ color: theme.palette.disabled.light, fontSize: '4rem' }} />
                            <Typography sx={{ textAlign: 'center' }}>
                              파일을 드래그해서 올려 놓거나,
                              <br />
                              파일첨부 버튼을 눌러 파일을 등록해 주세요.
                            </Typography>
                          </Stack>
                        )}
                      </Box>
                      {/* </label> */}
                      <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
                        <input
                          ref={fileIdRef}
                          type="file"
                          name="file"
                          multiple
                          accept={FileUploadExtOpt.DOC.str}
                          // onChange={onSelectFile}
                          style={{ display: 'none' }}
                        />
                        <Button variant="outlined" onClick={handleFiles}>
                          파일첨부
                        </Button>
                        <Typography variant="body2" sx={{ color: theme.palette.text.sub }}>
                          펀드 IM 자료 첨부. pptx, doc, docx, hwp, pdf 100MB 이내
                        </Typography>
                      </Stack>
                    </Stack>
                  </BtContentGrid>
                </Grid>
              </Stack>

              <Stack direction={'row'} spacing={1} justifyContent="center" alignItems="center">
                <Button size="large" variant="outlined" onClick={onClickCancel} disableElevation>
                  취소
                </Button>
                <Button size="large" variant="contained" onClick={(e) => savePrplcm(e)} disableElevation>
                  제출
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Container>

      <AlertPopup ref={alertPopRef} />
      <ConfirmPopup ref={confirmPopRef} onConfirm={confirmCancel} />
    </>
  )
}

export default PrplCmWriteView
