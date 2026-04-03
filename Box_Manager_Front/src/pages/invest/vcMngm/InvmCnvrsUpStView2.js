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
import { InvestContext } from 'modules/common/InvestContext'
import { UserContext } from 'modules/common/UserContext'
import { approveVc, denyVc, getBasicInfoDetail, saveFncnInfo } from 'modules/consts/InvestApi'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { loader } from 'modules/utils/CommonAxios'
import { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import FncnInfo from './FncnInfo'
import { StringUtils } from 'modules/utils/StringUtils'
import PopupAlert from 'components/PopupAlert'
import { deepCopyByRecursion } from 'modules/fns/commonFn'
import { Details } from '@mui/icons-material'

const InvmCnvrsUpStView2 = (props) => {
  const rpdirInfo = {
    sqn: 'sqn',
    utlinsttId: 'utlinsttId',
    fncnAmt: '',
    memo: '',
    rgyeDsnc: ''
  }
  const theme = useTheme()
  const history = useHistory()
  const id = props.match.params.id
  const investContext = useContext(InvestContext)
  // ===== Alert
  const [alert, setAlert] = useState({
    status: false,
    msg: ''
  })
  const [dataDetail, setDataDetail] = useState({
    utlinsttId: ' ', // 	이용기관코드
    cmpnNm: ' ', // 	회사명
    bzn: ' ', // 	사업자등록번호
    cnrnBizFildCon: ' ', // 관심비즈니스분야
    utlzTchn: ' ', // 활용기술유무
    prmrInvmTpbs: ' ', // 주요투자업종
    prmpInvmStg: ' ', // 주요투자단계
    rpdirInfo: ' ', //대표이사정보   추후 삭제
    ivcpHmrsInfo: ' ', //투자사인력정보    추후 삭제
    mngmHmrsInfo: ' ', //관리인력정보   추후 삭제
    prnNm: ' ', //운용사명   추후 삭제
    rprnm: ' ', //대표이사명   추후 삭제
    adres: ' ', // 	화사소재지
    incrYmd: ' ', // 	설립년월일
    fundOprTs: ' ', //     펀드운용시작일
    cptsTtsm: 0, // 	자본총계
    payCapl: 0, // 	납입자본금
    dscplYn: ' ', // 	징계여부
    msrnFsyr: ' ', // 	최근 회계연도 tobe에서 삭제
    astTtsmAmt: 0, //     자산총계
    lbltCpstAmt: 0, //     부채총계
    cptsTtsmAmt: 0, //     자본총계
    bsnErn: 0, //     영업수익
    bsnCt: 0, //     영업비용
    ctnpAmt: 0, //     당기순이익
    astTtsmAmt_1Y: 0, // 	자산총계1Y
    astTtsmAmt_2Y: 0, // 	자산총계2Y
    lbltCpstAmt_1Y: 0, // 	부채총계1Y
    lbltCpstAmt_2Y: 0, // 	부채총계2Y
    cptsTtsmAmt_1Y: 0, // 	자본총계1Y
    cptsTtsmAmt_2Y: 0, // 	자본총계2Y
    bsnErn_1Y: 0, // 	영업수익1Y
    bsnErn_2Y: 0, // 	영업수익2Y
    bsnCt_1Y: 0, // 	영업비용1Y
    bsnCt_2Y: 0, // 	영업비용2Y
    ctnpAmt_1Y: 0, // 	당기순이익1Y
    ctnpAmt_2Y: 0, // 	당기순이익2Y
    invmCnvsStts: '1', //     투자사전환상태
    agrnVncnYn: 'N', //     협약벤처기관여부
    amnnTs: '', // 등록 날짜
    amnnUserId: ' ', // 등록자
    investFieldList: [], //     비즈니스분야정보
    utlzTchnList: [], //     활용기술정보
    prmrInvmTpbsList: [], //     주요투자업종
    prmpInvmStgList: [], //     주요투자단계
    rpdirInfoList: [], //대표이사정보
    ivcpHmrsInfoList: [], //투자사인력정보
    mngmHmrsInfoList: [], //관리인력정보
    stchInfo: [], //주주정보 목록
    etcList: [],
    companyBasicVO: {}, // 기업 기본 정보
    fundList: [], // 펀드 제안 정보
    investRegionList: [], // 관심투자지역
    investAmount: {}, // 주요투자금액단계
    proposalCompanyList: [], // 투자기업추천 정보
    orrpInfoList: [], // 운용보고서 정보
    fncnInfoList: [] // 출자정보
  })
  const userContext = useContext(UserContext)

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
      // params: dataDetail,
      params: targetId,
      adminUser: userContext.actions.getIvtAdminUser(),
      list: dataDetail.fncnInfoList
    }
    // setDataDetail(()=>)
    let _msg = ''
    let result = false

    if (buttonTitle === '승인 완료') {
      // 승인 -> 투자사 전환으로 변환
      const res = await approveVc(data)
      _msg = '해당 투자희망기업의 투자사 전환이 완료되었습니다.'
      result = true
      if (res.status === 200 && res.data.code == '200') {
        _msg = '해당 투자희망기업의 투자사 전환이 완료되었습니다.'
        result = true
      } else _msg = '시스템오류입니다. 관리자에게 문의하세요'
    } else if (buttonTitle === '대기 전환') {
      // 반려 -> 투자희망기업으로 변환
      const res = await denyVc(data)
      if (res.status === 200 && res.data.code == '200') {
        _msg = '해당 투자사의 투자희망기업 전환이 완료되었습니다.'
        result = true
      } else _msg = '시스템오류입니다. 관리자에게 문의하세요'
    } else if (buttonTitle === '저장') {
      // 저장 -> 저장
      const res = await saveFncnInfo(data)
      if (res.status === 200 && res.data.code == '200') {
        _msg = '출자정보 저장이 완료되었습니다.'
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
  // 리스트 화면 이동
  const goList = () => {
    if (alert.msg.includes('완료')) {
      history.push(`${ROUTER_NAMES.INVEST_VCMNGM_INVMCNVRSLISTVIEW}`)
    }
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
    console.log(investContext.state.vcType)
  }, [])

  return (
    <>
      {
        /* Header */
        <PageLayout currentMenu={'invest'} currentCate={'vcMngm'} currentPage={'InvmCnvrsUpStView2'}>
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
                      VC 관리 (승인완료/대기)
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
                                    <Chip
                                      key={idx}
                                      label={item.cnrnFildNm}
                                      variant="outlined"
                                      sx={{ borderRadius: 2 }}
                                    />
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
                                <Typography variant="body1">관심분야</Typography>
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
                                <Typography variant="body1">관심기술</Typography>
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
                                <Typography variant="body1">대표이사 정보</Typography>
                              </Stack>
                            </Grid>
                            {/* dataDetail.rpdirInfoList */}
                            <Grid xs sx={{ p: 0 }}>
                              <TableContainer component={Paper} sx={{ borderRadius: 0, boxShadow: 'none' }}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                  <TableHead
                                    sx={{
                                      // borderTop: `1px solid ${theme.palette.secondary.main}`,
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
                                <Typography variant="body1">투자인력 정보</Typography>
                              </Stack>
                            </Grid>
                            {/* dataDetail.ivcpHmrsInfoList */}
                            <Grid xs sx={{ p: 0 }}>
                              <TableContainer component={Paper} sx={{ borderRadius: 0, boxShadow: 'none' }}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                  <TableHead
                                    sx={{
                                      // borderTop: `1px solid ${theme.palette.secondary.main}`,
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
                                <Typography variant="body1">관리인력 정보</Typography>
                              </Stack>
                            </Grid>
                            {/* dataDetail.mngmHmrsInfoList */}
                            <Grid xs sx={{ p: 0 }}>
                              <TableContainer component={Paper} sx={{ borderRadius: 0, boxShadow: 'none' }}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                  <TableHead
                                    sx={{
                                      // borderTop: `1px solid ${theme.palette.secondary.main}`,
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
                    <Stack direction={'column'} spacing={2}>
                      <Stack direction={'row'} spacing={1} alignItems={'center'}>
                        <LensOutlinedIcon color="secondary" />
                        <Typography
                          flexGrow={1}
                          variant="h2"
                          sx={{ lineHeight: '1.375rem', fontSize: '1.375rem', fontWeight: 'bold' }}
                        >
                          펀드 제안 정보
                        </Typography>
                      </Stack>

                      <TableContainer component={Paper} sx={{ borderRadius: 0, boxShadow: 'none' }}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                          <TableHead
                            sx={{
                              borderTop: `1px solid ${theme.palette.secondary.main}`,
                              backgroundColor: theme.palette.lightBlueGrey.main
                            }}
                          >
                            <TableRow>
                              <TableCell align="center">제안번호</TableCell>
                              <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                                펀드명
                              </TableCell>
                              <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                                제안일
                              </TableCell>
                              <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                                금액
                              </TableCell>
                              <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                                심사완료여부
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {/* dataDetail?.fundList? */}
                            {dataDetail?.fundList?.length > 0 &&
                              dataDetail?.fundList?.map((item, idx) => (
                                <TableRow>
                                  <TableCell align="center" component="th" scope="row">
                                    {idx + 1}
                                  </TableCell>
                                  <TableCell align="center" component="th" scope="row">
                                    {item.fundNm}
                                  </TableCell>
                                  <TableCell align="center" component="th" scope="row">
                                    {item.wody}
                                  </TableCell>
                                  <TableCell align="center" component="th" scope="row">
                                    {item.ibkInvstmntPrplAmt}억원
                                  </TableCell>
                                  <TableCell
                                    align="center"
                                    component="th"
                                    scope="row"
                                    sx={{ color: theme.palette.info.main }}
                                  >
                                    <Typography color={'secondary'}>제출 완료</Typography>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Stack>

                    <Stack direction={'column'} spacing={2}>
                      <Stack direction={'row'} spacing={1} alignItems={'center'}>
                        <LensOutlinedIcon color="secondary" />
                        <Typography
                          flexGrow={1}
                          variant="h2"
                          sx={{ lineHeight: '1.375rem', fontSize: '1.375rem', fontWeight: 'bold' }}
                        >
                          투자기업 추천 정보
                        </Typography>
                      </Stack>

                      <TableContainer component={Paper} sx={{ borderRadius: 0, boxShadow: 'none' }}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                          <TableHead
                            sx={{
                              borderTop: `1px solid ${theme.palette.secondary.main}`,
                              backgroundColor: theme.palette.lightBlueGrey.main
                            }}
                          >
                            <TableRow>
                              <TableCell align="center">No</TableCell>
                              <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                                회사명
                              </TableCell>
                              <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                                사업자번호
                              </TableCell>
                              <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                                주요사업
                              </TableCell>
                              <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                                추천일
                              </TableCell>
                              <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                                상태
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {/* proposalCompanyList */}
                            {dataDetail?.proposalCompanyList?.length > 0 &&
                              dataDetail?.proposalCompanyList?.map((item, idx) => (
                                <TableRow>
                                  <TableCell align="center" component="th" scope="row">
                                    {idx + 1}
                                  </TableCell>
                                  <TableCell align="center" component="th" scope="row">
                                    {item.prnNm}
                                  </TableCell>
                                  <TableCell align="center" component="th" scope="row">
                                    {StringUtils.bizNum(item.rcmdEnprBzn)}
                                  </TableCell>
                                  <TableCell align="center" component="th" scope="row">
                                    {item.mainBiz}
                                  </TableCell>
                                  <TableCell align="center" component="th" scope="row">
                                    {item.invmRndEndPnttm}
                                  </TableCell>
                                  <TableCell align="center" component="th" scope="row">
                                    <Typography color={theme.palette.warning.main}>
                                      {item.sbmsStts === 'N' ? '읽지않음' : '읽음'}
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Stack>

                    <Stack direction={'column'} spacing={2}>
                      <Stack direction={'row'} spacing={1} alignItems={'center'}>
                        <LensOutlinedIcon color="secondary" />
                        <Typography
                          flexGrow={1}
                          variant="h2"
                          sx={{ lineHeight: '1.375rem', fontSize: '1.375rem', fontWeight: 'bold' }}
                        >
                          당행출자정보
                        </Typography>
                      </Stack>

                      <TableContainer component={Paper} sx={{ borderRadius: 0, boxShadow: 'none' }}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                          <TableHead
                            sx={{
                              borderTop: `1px solid ${theme.palette.secondary.main}`,
                              backgroundColor: theme.palette.lightBlueGrey.main
                            }}
                          >
                            <TableRow>
                              <TableCell align="center">년도 구분</TableCell>
                              <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                                금액(억원)
                              </TableCell>
                              <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                                메모
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {
                              <FncnInfo
                                {...rpdirInfo}
                                showMonthYearPicker={true}
                                list={dataDetail['fncnInfoList'] ?? []}
                                updateFncnInfoList={(listItem) =>
                                  setDataDetail((pre) => ({ ...pre, ['fncnInfoList']: listItem }))
                                }
                              />
                            }
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Stack>
                    <Stack direction={'column'} spacing={2}>
                      <Stack direction={'row'} spacing={1} alignItems={'center'}>
                        <LensOutlinedIcon color="secondary" />
                        <Typography
                          flexGrow={1}
                          variant="h2"
                          sx={{ lineHeight: '1.375rem', fontSize: '1.375rem', fontWeight: 'bold' }}
                        >
                          투자 운용 보고서
                        </Typography>
                      </Stack>

                      <TableContainer component={Paper} sx={{ borderRadius: 0, boxShadow: 'none' }}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                          <TableHead
                            sx={{
                              borderTop: `1px solid ${theme.palette.secondary.main}`,
                              backgroundColor: theme.palette.lightBlueGrey.main
                            }}
                          >
                            <TableRow>
                              <TableCell align="center">구분</TableCell>
                              <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                                최종 제출일
                              </TableCell>
                              <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                                파일명
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {/* orrpInfoList */}
                            {dataDetail?.orrpInfoList?.length > 0 &&
                              dataDetail?.orrpInfoList?.map((item, idx) => (
                                <TableRow>
                                  <TableCell align="center" component="th" scope="row">
                                    {item.rptDsnc}
                                  </TableCell>
                                  <TableCell align="center" component="th" scope="row">
                                    {item.lada}
                                  </TableCell>
                                  <TableCell
                                    align="center"
                                    component="th"
                                    scope="row"
                                    sx={{ textDecoration: 'underline' }}
                                  >
                                    {item.fileNm}
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
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
                  {dataDetail?.invmCnvsStts === 'CVS01002' ? (
                    <MuiCommModal
                      type="confirm"
                      buttonTitle="대기 전환"
                      id={id}
                      contents="투자사 전환 요청을 대기 상태로 처리 하시겠습니까?"
                      open={false}
                      cancelEnabled={true}
                      handleConfirm={handleConfirm}
                      color={'secondary'}
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
                      // sx={{color:theme.palette.white.main, fontWeight:'bold', boxShadow:'none', '&:hover':{boxShadow:'none'}}}
                    />
                  ) : (
                    <MuiCommModal
                      type="confirm"
                      buttonTitle="승인 완료"
                      id={id}
                      contents="투자사 전환 요청을 승인 상태로 처리 하시겠습니까?"
                      open={false}
                      cancelEnabled={true}
                      handleConfirm={handleConfirm}
                      color={'secondary'}
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
                      // sx={{color:theme.palette.white.main, fontWeight:'bold', boxShadow:'none', '&:hover':{boxShadow:'none'}}}
                    />
                  )}
                  <MuiCommModal
                    type="confirm"
                    buttonTitle="저장"
                    id={id}
                    contents="출자정보를 저장하시겠습니까?"
                    open={false}
                    cancelEnabled={true}
                    handleConfirm={handleConfirm}
                    color={'secondary'}
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
                    // sx={{color:theme.palette.white.main, fontWeight:'bold', boxShadow:'none', '&:hover':{boxShadow:'none'}}}
                  />
                </Stack>
              </Stack>
            </Box>
            {alert.status && <PopupAlert msg={alert.msg} handlePopup={() => (handleAlertReset(), goList())} />}
          </Stack>
        </PageLayout>
      }
    </>
  )
}

export default InvmCnvrsUpStView2
