import { FiberManualRecordOutlined } from '@mui/icons-material'
import {
  Box,
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
  TextField,
  Typography,
  useTheme
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { BtContentGrid } from 'components/bt/BtContentGrid'
import { BtSelect } from 'components/bt/BtSelect/BtSelect'
import dayjs from 'dayjs'
import Api from 'modules/consts/Api'
import { AlertLabels } from 'modules/consts/BizConst'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import CommonAxios, { fileDownload, getConfig, getPostConfig } from 'modules/utils/CommonAxios'
import { createKey } from 'modules/utils/CommonUtils'
import QueryUtils from 'modules/utils/QueryUtils'
import { exeFunc } from 'modules/utils/ReactUtils'
import { StringUtils } from 'modules/utils/StringUtils'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import CheckCloseAlertPopup from 'pageComponents/common/pop/CheckCloseAlertPopup'
import CheckCloseCallBackAlertPopup from 'pageComponents/common/pop/CheckCloseCallBackAlertPopup'
import ConfirmPopup from 'pageComponents/common/pop/ConfirmPopup'
import { useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'

const PrplCmDetailView = (props) => {
  const theme = useTheme()
  const history = useHistory()
  const confirmPopRef = useRef()
  const checkCloseAlertPopRef = useRef()
  const checkCloseCallBackAlertPopupRef = useRef()
  const alertPopRef = useRef()
  const [load, setLoad] = useState(false)
  const [vo, setVo] = useState({
    rgsnUserId: '',
    rgsnUserNm: '',
    rgsnTs: '',
    amnnUserId: '',
    amnnUserNm: '',
    amnnTs: '',
    rvsRnum: '',
    utlinsttId: '',
    rcmdEnprBzn: '',
    rcmdId: '',
    prnNm: '',
    chrgAudofir: '',
    cnpl: '',
    ead: '',
    rcmdEnprNm: '',
    mainBiz: '',
    leadInvstrPrnNm: '',
    leadInvstrAmount: '',
    leadInvstrStep: 0,
    invmRndEndPnttm: '',
    totInvmCnfmnAmt: '',
    totInvmCnfmnAmtTo: '',
    progrsValue: '',
    progrsValueTo: '',
    recomendOpinion: '',
    oprtrCnfaYn: '',
    atchmnfl: '',
    sbmsStts: '',
    atchmnfl2: []
  })

  //추천취소
  const onClickCancel = () => {
    exeFunc(confirmPopRef, 'open', AlertLabels.prplcmCancel)
  }

  const confirmCancel = async () => {
    await commonContext.actions.callbackAfterSessionRefresh(
      async () => {
        const res = await CommonAxios(getPostConfig(Api.ibkPrplCntr.prplCmCancel, vo))
        if (res && res.status === 200 && res.data.code === '200') {
          exeFunc(checkCloseAlertPopRef, 'open', AlertLabels.canceled)
          const prplCmDetailObject = await loadPrplCmDetailView()
          setVo(prplCmDetailObject)
        } else {
          exeFunc(alertPopRef, 'open', AlertLabels.askAdmin)
        }
      },
      true,
      true
    )
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

  //commonContext의 현재값 반환
  const commonContext = useContext(CommonContext)
  const loadPrplCmDetailView = async () => {
    const query = QueryUtils.getQuery(props)
    const url = Api.ibkPrplCntr.prplCmDetail + '/' + query['rcmdId']

    const res = await CommonAxios(getConfig(url), false)

    if (res && res.status === 200) {
      return res.data.data
    }
  }

  const onClickList = () => {
    let url = ROUTER_NAMES.PRPL_CM_LIST_VIEW
    const query = QueryUtils.getQuery(props)
    if (query) {
      if (query.hasOwnProperty('page')) {
        url += '?page=' + query['page']
      }
    }
    history.push(url)
  }

  const isMounted = useRef(false) // useEffect에서 mount 유무 동기확인을 위함

  useEffect(() => {
    if (commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
      isMounted.current = true

      commonContext.actions.pageMountPathCheck(history, async () => {
        setLoad(false)
        const query = QueryUtils.getQuery(props)
        if (query && query.hasOwnProperty('rcmdId')) {
          const prplCmDetailViewObject = await loadPrplCmDetailView()

          if (prplCmDetailViewObject) {
            setVo(prplCmDetailViewObject)
            setLoad(true)
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
                      size="small"
                      value={vo.prnNm}
                      disabled
                      sx={{ width: '100%', backgroundColor: theme.palette.disabled.lighter }}
                    />
                  </BtContentGrid>

                  <BtContentGrid gridXs={6} title={'담당 심사역'} required={true}>
                    <TextField
                      size="small"
                      value={vo.chrgAudofir}
                      disabled
                      sx={{ width: '100%', backgroundColor: theme.palette.disabled.lighter }}
                    />
                  </BtContentGrid>

                  <BtContentGrid gridXs={6} title={'연락처'} required={true}>
                    <TextField
                      size="small"
                      value={isTelFormat(vo.cnpl)}
                      disabled
                      sx={{ width: '100%', backgroundColor: theme.palette.disabled.lighter }}
                    />
                  </BtContentGrid>

                  <BtContentGrid gridXs={6} title={'이메일'} required={true}>
                    <TextField
                      size="small"
                      value={vo.ead}
                      disabled
                      sx={{ width: '100%', backgroundColor: theme.palette.disabled.lighter }}
                    />
                  </BtContentGrid>
                </Grid>
              </Stack>

              <Stack direction={'column'} spacing={1}>
                <Grid container sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
                  <BtContentGrid gridXs={6} title={'추천 기업명'} required={true}>
                    <TextField
                      size="small"
                      value={vo.rcmdEnprNm}
                      disabled
                      sx={{ width: '100%', backgroundColor: theme.palette.disabled.lighter }}
                    />
                  </BtContentGrid>
                  <BtContentGrid gridXs={6} title={'사업자번호'} required={true}>
                    <TextField
                      size="small"
                      value={StringUtils.bizNum(vo.rcmdEnprBzn)}
                      disabled
                      sx={{ width: '100%', backgroundColor: theme.palette.disabled.lighter }}
                    />
                  </BtContentGrid>

                  <BtContentGrid gridXs={12} title={'주요사업'} required={true}>
                    <TextField
                      size="small"
                      value={vo.mainBiz}
                      sx={{ width: '100%', backgroundColor: theme.palette.disabled.lighter }}
                      disabled
                      placeholder="20자 이내 작성"
                    />
                  </BtContentGrid>

                  <BtContentGrid gridXs={12} title={'리드투자자'}>
                    <Stack direction={'row'} spacing={2} sx={{ width: '100%' }}>
                      <Stack flexGrow={1} direction={'row'} alignItems={'center'} spacing={1}>
                        <Typography sx={{ width: '5rem' }}>운용사명</Typography>
                        <TextField
                          flexGrow={1}
                          size="small"
                          value={vo.leadInvstrPrnNm}
                          disabled
                          sx={{ width: '100%', backgroundColor: theme.palette.disabled.lighter }}
                        />
                      </Stack>
                      <Stack flexGrow={1} direction={'row'} alignItems={'center'} spacing={1}>
                        <Typography sx={{ width: '2rem' }}>금액</Typography>
                        <TextField
                          size="small"
                          value={StringUtils.comma(vo.leadInvstrAmount)}
                          disabled
                          sx={{ width: '100%', backgroundColor: theme.palette.disabled.lighter }}
                        />
                      </Stack>
                      <Stack flexGrow={1} direction={'row'} alignItems={'center'} spacing={1}>
                        <Typography sx={{ width: '3rem' }}>단계</Typography>
                        <BtSelect
                          flexGrow={1}
                          defaultValue={vo.leadInvstrStep}
                          disabled
                          sx={{ width: '100%', backgroundColor: theme.palette.disabled.lighter }}
                        >
                          <MenuItem disabled value={'0'}>
                            선택하세요
                          </MenuItem>
                          <MenuItem value={'1'}>IR</MenuItem>
                          <MenuItem value={'2'}>투심</MenuItem>
                          <MenuItem value={'3'}>확정</MenuItem>
                          <MenuItem value={'4'}>미정</MenuItem>
                        </BtSelect>
                      </Stack>
                    </Stack>
                  </BtContentGrid>

                  <BtContentGrid gridXs={12} title={'투자 라운드 종료시점'}>
                    <FormControl>
                      <RadioGroup row>
                        <FormControlLabel
                          checked={vo.invmRndEndPnttm !== ' '}
                          value="1"
                          control={<Radio disabled />}
                          label={
                            <DatePicker
                              format="YYYY-MM-DD"
                              value={dayjs(vo.invmRndEndPnttm)}
                              disabled
                              sx={{ width: '100%', backgroundColor: theme.palette.disabled.lighter }}
                            />
                          }
                        />
                        <FormControlLabel
                          checked={vo.invmRndEndPnttm === ' '}
                          value="2"
                          control={<Radio disabled />}
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
                          checked={vo.totInvmCnfmnAmt !== 0 && vo.totInvmCnfmnAmtTo !== 0}
                          control={<Radio disabled />}
                          label={
                            <Stack alignItems={'center'} direction={'row'} spacing={2}>
                              <TextField
                                size="small"
                                InputProps={{ endAdornment: <InputAdornment position="end">억원</InputAdornment> }}
                                value={StringUtils.comma(vo.totInvmCnfmnAmt)}
                                disabled
                                sx={{ width: '100%', backgroundColor: theme.palette.disabled.lighter }}
                              />
                              <Typography>~</Typography>
                              <TextField
                                size="small"
                                InputProps={{ endAdornment: <InputAdornment position="end">억원</InputAdornment> }}
                                value={StringUtils.comma(vo.totInvmCnfmnAmtTo)}
                                disabled
                                sx={{ width: '100%', backgroundColor: theme.palette.disabled.lighter }}
                              />
                            </Stack>
                          }
                        />
                        <FormControlLabel
                          value="2"
                          checked={vo.totInvmCnfmnAmt === 0 && vo.totInvmCnfmnAmtTo === 0}
                          control={<Radio disabled />}
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
                          checked={vo.progrsValue !== 0 && vo.progrsValueTo !== 0}
                          control={<Radio disabled />}
                          label={
                            <Stack alignItems={'center'} direction={'row'} spacing={2}>
                              <TextField
                                size="small"
                                InputProps={{ endAdornment: <InputAdornment position="end">억원</InputAdornment> }}
                                value={StringUtils.comma(vo.progrsValue)}
                                disabled
                                sx={{ width: '100%', backgroundColor: theme.palette.disabled.lighter }}
                              />
                              <Typography>~</Typography>
                              <TextField
                                size="small"
                                InputProps={{ endAdornment: <InputAdornment position="end">억원</InputAdornment> }}
                                value={StringUtils.comma(vo.progrsValueTo)}
                                disabled
                                sx={{ width: '100%', backgroundColor: theme.palette.disabled.lighter }}
                              />
                            </Stack>
                          }
                        />
                        <FormControlLabel
                          value="2"
                          checked={vo.progrsValue === 0 && vo.progrsValueTo === 0}
                          control={<Radio disabled />}
                          label="미정"
                        />
                      </RadioGroup>
                    </FormControl>
                  </BtContentGrid>

                  <BtContentGrid gridXs={12} title={'추천 의견'} required={true}>
                    <TextField
                      size="small"
                      value={vo.recomendOpinion}
                      disabled
                      sx={{ width: '100%', backgroundColor: theme.palette.disabled.lighter }}
                      multiline
                      rows={10}
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
                      <Box
                        sx={{
                          p: 2,
                          boxSizing: 'border-box',
                          width: '100%',
                          backgroundColor: theme.palette.background.default
                        }}
                      >
                        <Stack direction="column" justifyContent="flex-start" alignItems="flex-start" sx={{ p: 2 }}>
                          {vo.atchmnfl2 &&
                            vo.atchmnfl2.map((item, index) => (
                              <div
                                className="file_item"
                                key={createKey()}
                                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                                onClick={() =>
                                  commonContext.actions.callbackAfterSessionRefresh(
                                    () => fileDownload(item),
                                    true,
                                    true
                                  )
                                }
                              >
                                <Typography>{item['fileNm']}</Typography>
                              </div>
                            ))}
                        </Stack>
                      </Box>
                    </Stack>
                  </BtContentGrid>
                </Grid>
              </Stack>

              <Stack direction={'row'} spacing={1} justifyContent="center" alignItems="center">
                {commonContext.state.user.info?.name === vo?.prnNm && vo?.sbmsStts === 'Y' && (
                  <Button size="large" variant="outlined" disableElevation onClick={onClickCancel}>
                    추천 취소
                  </Button>
                )}
                <Button size="large" variant="contained" disableElevation onClick={onClickList}>
                  확인
                </Button>
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Container>

      <CheckCloseCallBackAlertPopup ref={checkCloseCallBackAlertPopupRef} callBack={onClickList} />
      <ConfirmPopup ref={confirmPopRef} onConfirm={confirmCancel} />
      <CheckCloseAlertPopup ref={checkCloseAlertPopRef} />
      <AlertPopup ref={alertPopRef} />
      {/* End of Contents */}
    </>
  )
}

export default PrplCmDetailView
