import LensOutlinedIcon from '@mui/icons-material/LensOutlined'
import { Box, Stack, useTheme } from '@mui/material'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import { grey } from '@mui/material/colors'
import MuiCommModal from 'components/BtaModal/MuiCommModal'
import PageLayout from 'components/PageLayout'
import PopupAlert from 'components/PopupAlert'
import { InvestContext } from 'modules/common/InvestContext'
import { UserContext } from 'modules/common/UserContext'
import { approveVc, denyVc, getBasicInfoDetail } from 'modules/consts/InvestApi'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { deepCopyByRecursion } from 'modules/fns/commonFn'
import { loader } from 'modules/utils/CommonAxios'
import { StringUtils } from 'modules/utils/StringUtils'
import { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

const InvmCnvrsUpStView = (props) => {
  const theme = useTheme()
  const history = useHistory()
  const id = props.match.params.id
  const [dataDetail, setDataDetail] = useState(null)
  const userContext = useContext(UserContext)
  const investContext = useContext(InvestContext)
  // ===== Alert
  const [alert, setAlert] = useState({
    status: false,
    msg: ''
  })
  // ===== 상세조회
  const getDataDetailCall = async () => {
    loader(true, 'Uploading...')
    const res = await getBasicInfoDetail({ id: id })

    if (res.data.code === '200') {
      setDataDetail(res.data.data)
      loader()
    }
  }
  // 투자사 전환 상태 변경 요청
  const handleConfirm = async (targetId, buttonTitle) => {
    if (!StringUtils.hasLength(targetId)) return
    const data = {
      params: targetId,
      adminUser: userContext.actions.getIvtAdminUser()
    }

    let _msg = ''
    let result = false

    if (buttonTitle === '승인') {
      // 승인 -> 투자사 전환으로 변환
      const res = await approveVc(data)
      _msg = '해당 투자희망기업의 투자사 전환이 완료되었습니다.'
      result = true
      if (res.status === 200 && res.data.code == '200') {
        _msg = '해당 투자희망기업의 투자사 전환이 완료되었습니다.'
        result = true
      } else _msg = '시스템오류입니다. 관리자에게 문의하세요'
    } else if (buttonTitle === '대기') {
      // 반려 -> 투자희망기업으로 변환
      const res = await denyVc(data)
      if (res.status === 200 && res.data.code == '200') {
        _msg = '투자사 전환 요청이 대기 상태로 처리 되었습니다.'
        result = true
      } else _msg = '시스템오류입니다. 관리자에게 문의하세요'
    } else {
      return
    }

    setAlert({
      status: true,
      msg: _msg
    })
  }
  const handleAlertReset = () => {
    setAlert({
      status: false,
      msg: ''
    })
  }

  // 관심분약 명 조회
  const selectCnrnBizName = (item) => {
    let itembox = deepCopyByRecursion(investContext.state.codeInfo.categoryList)
    itembox = itembox.filter((el) => el.id === item)
    return itembox[0].invmFildCdnm
  }

  // 활용기술 명 조회
  const selectUtlzTchnName = (item) => {
    let itembox = deepCopyByRecursion(investContext.state.codeInfo.techList)
    itembox = itembox.filter((el) => el.id === item)
    console.log(itembox)
    return itembox[0].utlzTchnCdnm
  }

  // 주요 투자 단계 조회
  const selectPrmpInvmStgListName = (item) => {
    let itembox = deepCopyByRecursion(investContext.state.codeInfo.investStepList)
    itembox = itembox.filter((el) => el.id === item)
    console.log(itembox)
    return itembox[0].comCdNm
  }

  // 주요투자 업종
  const selectPrmrInvmTpbsName = (item) => {
    let itembox = deepCopyByRecursion(investContext.state.codeInfo.prmrInvmTpbsList)
    itembox = itembox.filter((el) => el.id === item)
    return itembox[0].comCdNm
  }

  useEffect(() => {
    id && getDataDetailCall()
  }, [])

  return (
    <>
      {/* Header */}
      <PageLayout currentMenu={'invest'} currentCate={'vcMngm'} currentPage={'InvmCnvrsUpStView'}>
        <Stack direction="row" spacing={8}>
          <Box sx={{ width: '100%' }}>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }} />
            <Stack direction={'column'} spacing={4} alignItems="center">
              <Stack direction={'column'} spacing={2} sx={{ width: '100%' }}>
                <Stack direction={'row'} alignItems="center" spacing={1}>
                  <Typography
                    flexGrow={1}
                    variant="h1"
                    sx={{ lineHeight: '2.375rem', fontSize: '1.875rem', fontWeight: 'bold' }}
                  >
                    VC 관리 (요청)
                  </Typography>
                </Stack>
                <Divider />
                <Stack direction={'column'} spacing={6}>
                  {/* 기본정보 시작 */}
                  <Stack direction={'column'} spacing={2}>
                    <Stack direction={'row'} spacing={1} alignItems={'center'}>
                      <LensOutlinedIcon color="secondary" />
                      <Typography
                        flexGrow={1}
                        variant="h2"
                        sx={{ lineHeight: '1.375rem', fontSize: '1.375rem', fontWeight: 'bold' }}
                      >
                        기본정보
                      </Typography>
                    </Stack>

                    <Box sx={{ flexGrow: 1 }}>
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
                              <Typography variant="body1">투자사명</Typography>
                            </Stack>
                          </Grid>
                          <Grid xs sx={{ p: 2 }}>
                            <Typography variant="body1">{dataDetail?.companyBasicVO.bplcNm}</Typography>
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
                              <Typography variant="body1">대표번호</Typography>
                            </Stack>
                          </Grid>
                          <Grid xs sx={{ p: 2 }}>
                            <Typography variant="body1">{StringUtils.bizNum(dataDetail?.bzn)}</Typography>
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
                              <Typography variant="body1">대표</Typography>
                            </Stack>
                          </Grid>
                          <Grid xs sx={{ p: 2 }}>
                            <Typography variant="body1">{dataDetail?.companyBasicVO?.rprsntvNm}</Typography>
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
                              <Typography variant="body1">팩스번호</Typography>
                            </Stack>
                          </Grid>
                          <Grid xs sx={{ p: 2 }}>
                            <Typography variant="body1">
                              {StringUtils.faxNum(dataDetail?.companyBasicVO?.reprsntFxnum)}
                            </Typography>
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
                              <Typography variant="body1">설립일</Typography>
                            </Stack>
                          </Grid>
                          <Grid xs sx={{ p: 2 }}>
                            <Typography variant="body1">
                              {StringUtils.date(dataDetail?.companyBasicVO?.fondDe)}
                            </Typography>
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
                            <Typography variant="body1">{dataDetail?.companyBasicVO?.reprsntEmail}</Typography>
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
                              <Typography variant="body1">투자유형</Typography>
                            </Stack>
                          </Grid>
                          <Grid xs sx={{ p: 2 }}>
                            <Typography variant="body1">{''}</Typography>
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
                              <Typography variant="body1">직원수</Typography>
                            </Stack>
                          </Grid>
                          <Grid xs sx={{ p: 2 }}>
                            <Typography variant="body1">{dataDetail?.companyBasicVO?.empCnt}</Typography>
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
                              <Typography variant="body1">주소</Typography>
                            </Stack>
                          </Grid>
                          <Grid xs sx={{ p: 2 }}>
                            <Typography variant="body1">{dataDetail?.companyBasicVO?.addr}</Typography>
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
                              <Typography variant="body1">홈페이지</Typography>
                            </Stack>
                          </Grid>
                          <Grid xs sx={{ p: 2 }}>
                            <Typography variant="body1">{dataDetail?.companyBasicVO?.hmpgAdres}</Typography>
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
                              <Typography variant="body1">관심분야</Typography>
                            </Stack>
                          </Grid>
                          <Grid xs sx={{ p: 2 }}>
                            <Stack direction="row" spacing={1}>
                              {dataDetail?.companyBasicVO?.cnrnFildList?.length > 0 &&
                                dataDetail?.companyBasicVO?.cnrnFildList?.map((item, idx) => (
                                  <Chip key={idx} label={item.cnrnFildNm} variant="outlined" sx={{ borderRadius: 2 }} />
                                ))}
                            </Stack>
                          </Grid>
                        </Grid>

                        <Grid xs={6} container sx={{ borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}` }}>
                          <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                            <Typography variant="body1">협약벤처기관 여부</Typography>
                          </Grid>
                          <Grid xs sx={{ p: 2 }}>
                            <Typography variant="body1">{dataDetail?.agrnVncnYn}</Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Box>
                  </Stack>
                  {/* 추자정보 시작 */}
                  <Stack direction={'column'} spacing={2}>
                    <Stack direction={'row'} spacing={1} alignItems={'center'}>
                      <LensOutlinedIcon color="secondary" />
                      <Typography
                        flexGrow={1}
                        variant="h2"
                        sx={{ lineHeight: '1.375rem', fontSize: '1.375rem', fontWeight: 'bold' }}
                      >
                        투자정보
                      </Typography>
                    </Stack>

                    <Box sx={{ flexGrow: 1 }}>
                      <Grid container sx={{ borderTop: `1px solid ${theme.palette.secondary.main}` }}>
                        <Grid xs={6} container sx={{ borderBottom: `1px solid ${theme.palette.lightBlueGrey.dark}` }}>
                          <Grid backgroundColor={theme.palette.lightBlueGrey.main} width={150} sx={{ p: 2 }}>
                            <Stack
                              direction="column"
                              justifyContent="center"
                              alignItems="flex-start"
                              sx={{ height: '100%' }}
                            >
                              <Typography variant="body1">관심 비지니스 분야</Typography>
                            </Stack>
                          </Grid>
                          <Grid xs sx={{ p: 2 }}>
                            {/* dataDetail.cnrnBizFildCon */}
                            <Stack direction="row" spacing={1}>
                              {dataDetail?.cnrnBizFildCon?.trim() != '' &&
                                dataDetail?.cnrnBizFildCon
                                  .split(',')
                                  .map((item, idx) => (
                                    <Chip
                                      key={idx}
                                      label={selectCnrnBizName(item)}
                                      variant="outlined"
                                      sx={{ borderRadius: 2 }}
                                    />
                                  ))}
                            </Stack>
                          </Grid>
                        </Grid>

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
                              <Typography variant="body1">활용기술</Typography>
                            </Stack>
                          </Grid>
                          <Grid xs sx={{ p: 2 }}>
                            {/* dataDetail.utlzTchn */}
                            <Stack direction="row" spacing={1}>
                              {dataDetail?.utlzTchn?.trim() != '' &&
                                dataDetail?.utlzTchn
                                  .split(',')
                                  .map((item, idx) => (
                                    <Chip
                                      key={idx}
                                      label={selectUtlzTchnName(item)}
                                      variant="outlined"
                                      sx={{ borderRadius: 2 }}
                                    />
                                  ))}
                            </Stack>
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
                              <Typography variant="body1">주요 투자 단계</Typography>
                            </Stack>
                          </Grid>
                          <Grid xs sx={{ p: 2 }}>
                            {/* dataDetail.prmpInvmStg */}
                            <Stack direction="row" spacing={1}>
                              {dataDetail?.prmpInvmStg?.trim() != '' &&
                                dataDetail?.prmpInvmStg
                                  .split(',')
                                  .map((item, idx) => (
                                    <Chip
                                      key={idx}
                                      label={selectPrmpInvmStgListName(item)}
                                      variant="outlined"
                                      sx={{ borderRadius: 2 }}
                                    />
                                  ))}
                            </Stack>
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
                              <Typography variant="body1">투자 금액 범위</Typography>
                            </Stack>
                          </Grid>
                          <Grid xs sx={{ p: 2 }}>
                            <Typography variant="body1"></Typography>
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
                              <Typography variant="body1">주요 투자 지역</Typography>
                            </Stack>
                          </Grid>
                          <Grid xs sx={{ p: 2 }}>
                            <Typography variant="body1"></Typography>
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
                              <Typography variant="body1">주요투자업종</Typography>
                            </Stack>
                          </Grid>
                          <Grid xs sx={{ p: 2 }}>
                            {/* dataDetail.prmrInvmTpbs */}
                            <Stack direction="row" spacing={1}>
                              {dataDetail?.prmrInvmTpbs?.trim() != '' &&
                                dataDetail?.prmrInvmTpbs
                                  .split(',')
                                  .map((item, idx) => (
                                    <Chip
                                      key={idx}
                                      label={selectPrmrInvmTpbsName(item)}
                                      variant="outlined"
                                      sx={{ borderRadius: 2 }}
                                    />
                                  ))}
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
                              <Typography variant="body1">대표이사 정보</Typography>
                            </Stack>
                          </Grid>
                          {/* dataDetail.rpdirInfoList */}
                          <Grid xs sx={{ p: 0 }}>
                            <TableContainer component={Paper} sx={{ borderRadius: 0, boxShadow: 'none' }}>
                              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead
                                  sx={{
                                    borderTop: `1px solid ${theme.palette.secondary.main}`,
                                    backgroundColor: theme.palette.lightBlueGrey.main
                                  }}
                                >
                                  <TableRow>
                                    <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                                      성명
                                    </TableCell>
                                    <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                                      전화번호
                                    </TableCell>
                                    <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                                      이메일
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {dataDetail?.rpdirInfoList?.length > 0 &&
                                    dataDetail?.rpdirInfoList
                                      .filter((item) => item.invmHnfInfoCd === 'IHI01001')
                                      .map((item, idx) => (
                                        <TableRow key={idx}>
                                          <TableCell align="center" component="th" scope="row">
                                            {item.invmHnfNm}
                                          </TableCell>
                                          <TableCell align="center" component="th" scope="row">
                                            {StringUtils.telNumber(item.tpn)}
                                          </TableCell>
                                          <TableCell align="center" component="th" scope="row">
                                            {item.ead}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
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
                              <Typography variant="body1">투자인력 정보</Typography>
                            </Stack>
                          </Grid>
                          {/* dataDetail.ivcpHmrsInfoList */}
                          <Grid xs sx={{ p: 0 }}>
                            <TableContainer component={Paper} sx={{ borderRadius: 0, boxShadow: 'none' }}>
                              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead
                                  sx={{
                                    borderTop: `1px solid ${theme.palette.secondary.main}`,
                                    backgroundColor: theme.palette.lightBlueGrey.main
                                  }}
                                >
                                  <TableRow>
                                    <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                                      성명
                                    </TableCell>
                                    <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                                      전화번호
                                    </TableCell>
                                    <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                                      이메일
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {dataDetail?.rpdirInfoList?.length > 0 &&
                                    dataDetail?.rpdirInfoList
                                      .filter((item) => item.invmHnfInfoCd == 'IHI01002')
                                      .map((item, idx) => (
                                        <TableRow key={idx}>
                                          <TableCell align="center" component="th" scope="row">
                                            {item.invmHnfNm}
                                          </TableCell>
                                          <TableCell align="center" component="th" scope="row">
                                            {StringUtils.telNumber(item.tpn)}
                                          </TableCell>
                                          <TableCell align="center" component="th" scope="row">
                                            {item.ead}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
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
                              <Typography variant="body1">관리인력 정보</Typography>
                            </Stack>
                          </Grid>
                          {/* dataDetail.mngmHmrsInfoList */}
                          <Grid xs sx={{ p: 0 }}>
                            <TableContainer component={Paper} sx={{ borderRadius: 0, boxShadow: 'none' }}>
                              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead
                                  sx={{
                                    borderTop: `1px solid ${theme.palette.secondary.main}`,
                                    backgroundColor: theme.palette.lightBlueGrey.main
                                  }}
                                >
                                  <TableRow>
                                    <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                                      성명
                                    </TableCell>
                                    <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                                      전화번호
                                    </TableCell>
                                    <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                                      이메일
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {dataDetail?.rpdirInfoList?.length > 0 &&
                                    dataDetail?.rpdirInfoList
                                      .filter((item) => item.invmHnfInfoCd == 'IHI01003')
                                      .map((item, idx) => (
                                        <TableRow key={idx}>
                                          <TableCell align="center" component="th" scope="row">
                                            {item.invmHnfNm}
                                          </TableCell>
                                          <TableCell align="center" component="th" scope="row">
                                            {StringUtils.telNumber(item.tpn)}
                                          </TableCell>
                                          <TableCell align="center" component="th" scope="row">
                                            {item.ead}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
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
                  size="small"
                  sx={{
                    width: 120,
                    fontWeight: 'bold',
                    borderRadius: 12
                  }}
                  onClick={() => history.push(`${ROUTER_NAMES.INVEST_VCMNGM_INVMCNVRSLISTVIEW}`)}
                >
                  목록
                </Button>

                <MuiCommModal
                  type="confirm"
                  buttonTitle="대기"
                  id={id}
                  contents="투자사 전환 요청을 대기 상태로 처리 하시겠습니까?"
                  open={false}
                  cancelEnabled={true}
                  handleConfirm={handleConfirm}
                  color={'info'}
                  variant="outlined"
                  size="large"
                  sx={{ width: 120, fontWeight: 'bold', borderRadius: 12 }}
                  // sx={{color:theme.palette.white.main, fontWeight:'bold', boxShadow:'none', '&:hover':{boxShadow:'none'}}}
                />
                <MuiCommModal
                  id={id}
                  buttonTitle="승인"
                  contents="투자사 전환을 승인 하시겠습니까?"
                  cancelEnabled={true}
                  open={false}
                  color="secondary"
                  variant="contained"
                  size="large"
                  sx={{
                    width: 120,
                    color: theme.palette.white.main,
                    fontWeight: 'bold',
                    borderRadius: 12,
                    boxShadow: 'none',
                    '&:hover': { boxShadow: 'none' }
                  }}
                  type="confirm"
                  handleConfirm={handleConfirm}
                  // sx={{color:theme.palette.white.main, fontWeight:'bold', boxShadow:'none', '&:hover':{boxShadow:'none' }}}
                />
                {/* <Button color={'info'} variant="outlined" size="large" sx={{
                width:120,
                fontWeight:'bold',
                borderRadius:12,
              }}>대기</Button>

              <Button color="secondary" variant="contained" size="large" sx={{
                width:120,
                color:theme.palette.white.main,
                fontWeight:'bold',
                borderRadius:12,
                boxShadow:'none',
                '&:hover':{
                  boxShadow:'none'
                }
              }}>승인</Button> */}
              </Stack>
            </Stack>
          </Box>
          {alert.status && (
            <PopupAlert
              msg={alert.msg}
              handlePopup={() => (
                handleAlertReset(),
                () => {
                  history.push(`${ROUTER_NAMES.INVEST_VCMNGM_INVMCNVRSLISTVIEW}`)
                }
              )}
            />
          )}
        </Stack>
      </PageLayout>
    </>
  )
}

export default InvmCnvrsUpStView
