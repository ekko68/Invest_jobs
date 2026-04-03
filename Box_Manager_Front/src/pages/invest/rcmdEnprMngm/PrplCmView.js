import { Box, Stack, useTheme } from '@mui/material'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Button from '@mui/material/Button'
import Button2 from 'components/atomic/Button'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import PageLayout from 'components/PageLayout'
import PopupConfirm from 'components/PopupConfirm'
import { UserContext } from 'modules/common/UserContext'
import { getProposalCompany, saveProposalCompany } from 'modules/consts/InvestApi'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { loader } from 'modules/utils/CommonAxios'
import { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { fileDownload } from 'modules/utils/CommonUtils'
import PopupAlert from 'components/PopupAlert'

const PrplCmView = (props) => {
  const history = useHistory()
  const theme = useTheme()
  const userContext = useContext(UserContext)
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const utlinsttId = searchParams.get('utlinsttId')
  const rcmdEnprBzn = searchParams.get('rcmdEnprBzn')
  const [confirmCancel, setConfirmCancel] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [isConfirmPopup, setIsConfirmPopup] = useState(false)
  const [isAlertFail, setIsAlertFail] = useState(false)
  // const {utlinsttId, rcmdEnprBzn} = useParams();
  let path = location.pathname
  let category = path.split('/')
  const [prplCm, setPrplCm] = useState({
    sprnFild: ''
  })

  const getList = async () => {
    loader(true, 'Uploading...')
    let params = {
      utlinsttId: utlinsttId,
      rcmdEnprBzn: rcmdEnprBzn
    }
    let res = await getProposalCompany(params)
    if (res.data.code === '200') {
      setPrplCm(res.data.data)
      loader()
    }
  }

  const isTelFormat = (tel) => {
    let result = ''
    if (tel?.length === 8) {
      return tel.replace(/(\d{4})(\d{4})/, '$1-$2')
    } else if (tel?.indexOf('02') === 0) {
      if (tel?.length === 9) {
        //02-000-0000
        return tel.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3')
      } else if (tel?.length === 10) {
        //02-0000-0000
        return tel.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3')
      }
    } else if (tel?.length === 10) {
      //000-000-0000
      return tel.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})$/g, '$1-$2-$3')
    } else if (tel?.length === 11) {
      //000-0000-0000
      return tel.replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
    }
    return tel
  }

  const StringUtils = {
    comma: (value) => {
      const num = value === undefined || value === null || String(value).trim() === '' ? 0 : value
      // negative lookbehind 문법 사파리, ios 지원 안함
      // return String(num).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
      const splitNum = num.toString().split('.')
      splitNum[0] = splitNum[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return splitNum.join('.')
    },
    bizNum: (value) => {
      return String(value).replace(/(\d{3})(\d{2})(\d{5})/g, '$1-$2-$3')
    }
  }

  const handleConfirmCancel = () => {
    setConfirmCancel(!confirmCancel)
  }
  // 등록 취소
  const handleCancel = (type) => {
    if (type === 'confirm') {
      history.push(`${ROUTER_NAMES.INVEST_RCMDENPRMNGM_PRPLCM}`)
    } else {
      handleConfirmCancel()
    }
  }

  const goList = () => {
    history.push(ROUTER_NAMES.INVEST_RCMDENPRMNGM_PRPLCM, props.location.state)
  }

  const submit = async (type) => {
    const res = await saveProposalCompany({
      params: prplCm,
      adminUser: userContext.actions.getIvtAdminUser()
    })
    if (res?.data?.code === '200') {
      setIsConfirmPopup(true)
    } else {
      setAlertMessage('저장에 실패하였습니다')
      setIsAlertFail(true)
    }
  }

  // ===== 파일 다운로드
  const handleFileDownload = async (file) => {
    await fileDownload(file)
  }

  useLayoutEffect(() => {
    if (category[2] !== userContext.state.category) {
      userContext.actions.setCategory(category[2])
    }
  }, [userContext.state.category])

  useEffect(() => {
    getList()
  }, [])
  if (prplCm) {
    return (
      <>
        {/* Header */}

        <PageLayout currentMenu={'invest'} currentCate={'rcmdEnprMngm'} currentPage={'prplCmView'}>
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
                      추천받은 기업 상세
                    </Typography>
                  </Stack>

                  <Divider />

                  <Stack direction={'column'} spacing={2}>
                    <Stack direction={'column'} spacing={2}>
                      <Box sx={{ flexGrow: 1 }}>
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
                                <Typography variant="body1">운용사명</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Typography variant="body1">{prplCm?.prnNm}</Typography>
                            </Grid>
                          </Grid>

                          <Grid xs={6} container sx={{ borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}` }}>
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Typography variant="body1">담당 심사역</Typography>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Typography variant="body1">{prplCm?.chrgAudofir}</Typography>
                            </Grid>
                          </Grid>

                          <Grid xs={6} container sx={{ borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}` }}>
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Typography variant="body1">연락처</Typography>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Typography variant="body1">{isTelFormat(prplCm?.cnpl)}</Typography>
                            </Grid>
                          </Grid>

                          <Grid xs={6} container sx={{ borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}` }}>
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Typography variant="body1">이메일</Typography>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Typography variant="body1">{prplCm?.ead}</Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Box>
                    </Stack>

                    <Stack direction={'column'} spacing={2}>
                      <Box sx={{ flexGrow: 1 }}>
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
                                <Typography variant="body1">추천 회사명</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Typography variant="body1">{prplCm?.rcmdEnprNm}</Typography>
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
                              <Typography variant="body1">{StringUtils.bizNum(prplCm?.rcmdEnprBzn)}</Typography>
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
                                <Typography variant="body1">리드투자자</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }} container>
                              <Grid xs={4}>
                                <Typography variant="body1">{prplCm?.leadInvstrPrnNm}</Typography>
                              </Grid>

                              <Grid xs={4}>
                                <Typography variant="body1">
                                  금액{' '}
                                  <span style={{ textAlign: 'right' }}>
                                    {StringUtils.comma(prplCm?.leadInvstrAmount)}
                                  </span>
                                </Typography>
                              </Grid>

                              <Grid xs={4}>
                                <Typography variant="body1">
                                  단계{' '}
                                  {prplCm?.leadInvstrStep === '1'
                                    ? 'IR'
                                    : prplCm?.leadInvstrStep === '2'
                                    ? '투심'
                                    : prplCm?.leadInvstrStep === '3'
                                    ? '확정'
                                    : prplCm?.leadInvstrStep === '4'
                                    ? '미정'
                                    : ' '}
                                </Typography>
                              </Grid>
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
                                  투자 라운드
                                  <br />
                                  종료시점
                                </Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">
                                  {prplCm?.invmRndEndPnttm === ' ' ? '미정' : prplCm?.invmRndEndPnttm}
                                </Typography>
                              </Stack>
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
                                <Typography variant="body1">총 투자 유치금액</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">
                                  {prplCm.totInvmCnfmnAmt === 0 && prplCm.totInvmCnfmnAmtTo === 0
                                    ? '미정'
                                    : `${StringUtils.comma(prplCm?.totInvmCnfmnAmt)}억 ~ ${StringUtils.comma(
                                        prplCm?.totInvmCnfmnAmtTo
                                      )}억`}
                                </Typography>
                              </Stack>
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
                                <Typography variant="body1">진행밸류(pre)</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">
                                  {prplCm.progrsValue === 0 && prplCm.progrsValueTo === 0
                                    ? '미정'
                                    : `${StringUtils.comma(prplCm?.progrsValue)}억 ~ ${StringUtils.comma(
                                        prplCm?.progrsValueTo
                                      )}억`}
                                </Typography>
                              </Stack>
                            </Grid>
                          </Grid>

                          <Grid
                            xs={12}
                            container
                            sx={{ borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}`, height: '10rem' }}
                          >
                            <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                              <Stack
                                direction="column"
                                justifyContent="center"
                                alignItems="flex-start"
                                sx={{ height: '100%' }}
                              >
                                <Typography variant="body1">추천 의견</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <Typography variant="body1">{prplCm?.recomendOpinion}</Typography>
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
                                <Typography variant="body1">첨부 파일</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              {prplCm?.atchmnfl2?.map((file, idx) => (
                                <Typography
                                  variant="body1"
                                  sx={{ cursor: 'pointer', textDecoration: 'underline' }}
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

                    <Stack direction={'column'} spacing={2}>
                      <Box sx={{ flexGrow: 1 }}>
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
                                <Typography variant="body1">메모</Typography>
                              </Stack>
                            </Grid>
                            <Grid xs sx={{ p: 2 }}>
                              <TextField
                                size="small"
                                // id="filled-search"
                                // label="Search field"
                                // type="search"
                                multiline
                                rows={4}
                                sx={{ width: '100%' }}
                                value={prplCm?.sprnFild}
                                onChange={(e) => setPrplCm({ ...prplCm, sprnFild: e.target.value })}
                              />
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
                    onClick={goList}
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
                    onClick={submit}
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
          {isConfirmPopup && <PopupAlert msg="저장되었습니다" btnMsg="확인" handlePopup={goList} />}
        </PageLayout>
        {isAlertFail && <PopupAlert msg={alertMessage} handlePopup={(e) => setIsAlertFail(false)} />}
      </>
    )
  } else {
    return history.push('/notFound')
  }
}

export default PrplCmView
