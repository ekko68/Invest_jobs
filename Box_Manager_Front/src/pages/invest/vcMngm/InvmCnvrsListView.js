import SearchIcon from '@mui/icons-material/Search'
import { Box, IconButton, PaginationItem, Stack, useTheme } from '@mui/material'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Pagination from '@mui/material/Pagination'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { grey } from '@mui/material/colors'
import MuiCommModal from 'components/BtaModal/MuiCommModal'
import MuiCommSelect from 'components/BtaSelect/MuiCommSelect'
import NoResult from 'components/NoResult'
import PageLayout from 'components/PageLayout'
import PopupAlert from 'components/PopupAlert'
import { InvestContext } from 'modules/common/InvestContext'
import { UserContext } from 'modules/common/UserContext'
import Api from 'modules/consts/Api'
import { IVT_CODE } from 'modules/consts/BizCode'
import { approveVc, denyVc, getVcNewList } from 'modules/consts/InvestApi'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { createKey } from 'modules/fns/commonFn'
import { excelDownloadIvtByPostConfigOption, getPostConfig } from 'modules/utils/CommonUtils'
import { StringUtils } from 'modules/utils/StringUtils'
import moment from 'moment'
import { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min'
import { BtaSelect_copy } from '../../../components/BtaSelect/BtaSelect_copy'
import LicensePopup from 'pageComponents/invest/investUser/LicensePopup'

const InvmCnvrsListView = () => {
  const theme = useTheme()
  const history = useHistory()
  const selectRef = useRef('')
  //추가 코드
  const location = useLocation()
  let path = location.pathname
  let category = path.split('/')
  const userContext = useContext(UserContext)
  const investContext = useContext(InvestContext)
  //vnemtrlonReqst data
  const boardParamData = {
    cmpnNm: '', // 회사명
    bzn: '', // 사업자번호
    dsnc: '', // 추천상태
    page: 1,
    record: 20
  }
  const [boardParam, setBoardParam] = useState(boardParamData)
  const [invmCnvrsListView, setInvmCnvrsListView] = useState([])
  const [paging, setPaging] = useState({})
  const initConfirmPop = { isOpen: false, targetId: '', msg: '', useYn: '' }
  const [openModal, setOpenModal] = useState(false)
  const [openWaitModal, setOpenWaitModal] = useState(false)
  const [openYesModal, setOpenYesModal] = useState(false)
  // 사업자 등록증 이미지 view 팝업
  const initLicensePop = { isOpen: false, usisId: '', usisNm: '', usisBzn: '' }
  const [licensePopup, setLicensePopup] = useState({ ...initLicensePop })

  const [searchInput, setSearchInput] = useState('') // 검색
  const [selectList, setSelectList] = useState({
    active: 'cmpnNm'
  })
  const [alert, setAlert] = useState({
    status: false,
    msg: ''
  })
  const [fullPage, setFullPage] = useState(0)
  const [placholder, setPlacholder] = useState('')
  const getFullPage = (data) => {
    let cnt = 0
    for (let i = data.startPage; i <= data.endPage; i++) {
      cnt++
    }
    setFullPage(cnt)
  }

  // 목록 불러온 후 체크박스 설정
  const handleSetCheckbox = (data) => {
    // console.log(data);
    let tempList = data.map((d) => (d['checkbox'] = { ...d, checkbox: { id: d.pbnsId, value: '', status: false } }))
    setInvmCnvrsListView(tempList)
  }

  // ====== 검색
  const handleSetSearchInput = (initial) => {
    // 렌더링시 조건값이 남아있으면 그대로 값 설정
    if (initial) {
      setBoardParam({
        cmpnNm: '', // 제목
        bzn: '', // 작성자
        dsnc: '',
        page: 1,
        record: 20
      })
    } else {
      let searchComNm = boardParam.cmpnNm
      let searchRcmdEnrpBzn = boardParam.bzn
      searchComNm !== ''
        ? (onSelectActive('cmpnNm'), setSearchInput(searchComNm))
        : searchRcmdEnrpBzn !== ''
        ? (onSelectActive('bzn'), setSearchInput(searchRcmdEnrpBzn))
        : (onSelectActive('cmpnNm'), setSearchInput(''))
    }
  }

  // Enter + 검색
  const onKeyPress = (e) => {
    e.key === 'Enter' && handleSearch()
  }

  const handleSearch = () => {
    // 검색 클릭시 페이지 초기화, 조건중 나머지값 초기화
    let params = {}
    const _searchInput = searchInput.trim()
    selectList.active === 'cmpnNm'
      ? (params = {
          page: 1,
          cmpnNm: _searchInput,
          bzn: '',
          record: 20
        })
      : (params = {
          page: 1,
          cmpnNm: '',
          bzn: _searchInput,
          record: 20
        })
    setBoardParam(params)
    // investContext.actions.handleSetSearch(params)
  }

  // 검색 조건
  const onSelectActive = (selected) => {
    if (selected === 'cmpnNm') {
      setPlacholder('회사명')
    } else {
      setPlacholder('사업자번호')
    }
    setSelectList({
      ...selectList,
      active: selected
    })
  }

  // 검색 조건
  const handleOptions = (selected) => {
    let params = {
      ...boardParam,
      dsnc: selected
    }
    setBoardParam(params)
  }

  // == excel download
  const handleExcelDownload = async () => {
    await excelDownloadIvtByPostConfigOption(
      // content-disposition header 인코딩이 utf-8로 세팅할 경우에도 깨지는 현상 있음 -> 사용자 지정 파일명 세팅
      getPostConfig(Api.invest.convertVcListExcelDownload, boardParam),
      'VC관리_' + moment(new Date()).format('YYYYMMDD')
    )
  }

  // ===== 페이징
  const handlePaging = (event, param) => {
    let params = {
      ...boardParam,
      page: param
    }
    setBoardParam(params)
  }

  // ===== 초기화
  const handleReset = () => {
    handleSetSearchInput(true) // 검색 세팅
    setSearchInput('')
  }
  // ===== 목록조회
  const getList = async (params) => {
    console.log(params)
    let res
    if (params) {
      if (params.dsnc === 'ALL') {
        params.dsnc = ''
      }
      if (params) {
        res = await getVcNewList(params)
      } else {
        res = await getVcNewList()
      }
      if (res.data.code === '200') {
        setPaging({
          endPage: res.data.data.endPage,
          next: res.data.data.next,
          page: res.data.data.page,
          prev: res.data.data.prev,
          record: res.data.data.record,
          startPage: res.data.data.startPage,
          total: res.data.data.total,
          totalPage: res.data.data.totalPage
        })

        handleSetCheckbox(res.data.data.list) //  데이터 목록 + 선택 체크박스 추가
        getFullPage(res.data.data)
      }
    }
  }
  // 상세 페이지 이동
  const goDetailPage = (e, item) => {
    console.log('')
    investContext.actions.setVcType(item.invmCnvsStts)
    if (e.target.nodeName !== 'LABEL' && e.target.nodeName !== 'INPUT') {
      if (item.invmCnvsStts === 'CVS01001') {
        history.push(`${ROUTER_NAMES.INVEST_VCMNGM_INVMCNVRSUPSTVIEW}/${item.utlinsttId}`)
      } else {
        history.push(`${ROUTER_NAMES.INVEST_VCMNGM_INVMCNVRSUPSTVIEW2}/${item.utlinsttId}`)
      }
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
        _msg = '해당 투자사의 투자희망기업 전환이 완료되었습니다.'
        result = true
      } else _msg = '시스템오류입니다. 관리자에게 문의하세요'
    } else {
      return
    }

    setAlert({
      status: result,
      msg: _msg
    })
  }

  const invmCnvrsStgChangeView = useCallback((item) => {
    if (item.invmCnvsStts === 'CVS01001') {
      return (
        <TableCell align="center" component="th" scope="row" sx={{ color: theme.palette.info.main }}>
          <Stack justifyContent="center" direction={'row'} spacing={1}>
            <MuiCommModal
              type="confirm"
              buttonTitle="대기"
              id={item.utlinsttId}
              contents="투자사 전환 요청을 대기 상태로 처리 하시겠습니까?"
              open={openWaitModal}
              cancelEnabled={true}
              handleConfirm={handleConfirm}
              // sx={{color:theme.palette.white.main, fontWeight:'bold', boxShadow:'none', '&:hover':{boxShadow:'none'}}}
            />
            <MuiCommModal
              id={item.utlinsttId}
              buttonTitle="승인"
              contents="투자사 전환을 승인 하시겠습니까?"
              cancelEnabled={true}
              open={openYesModal}
              variant="contained"
              color="secondary"
              type="confirm"
              handleConfirm={handleConfirm}
              // sx={{color:theme.palette.white.main, fontWeight:'bold', boxShadow:'none', '&:hover':{boxShadow:'none' }}}
            />
          </Stack>
        </TableCell>
      )
    } else {
      return (
        <TableCell
          align="center"
          component="th"
          scope="row"
          sx={{ color: theme.palette.info.main }}
          onClick={(e) => goDetailPage(e, item)}
        >
          <Typography flexGrow={1} variant="body" sx={{ fontSize: '', fontWeight: 'bold' }}>
            {item.invmCnvsStts === 'CVS01003' ? '승인대기' : '승인완료'}
            <br></br>
            {'('}
            {item.rgsnTs}
            {')'}
          </Typography>
        </TableCell>
      )
    }
  }, [])
  const handleAlertReset = () => {
    setAlert({
      status: false,
      msg: ''
    })
    history.push(`${ROUTER_NAMES.INVEST_VCMNGM_INVMCNVRSLISTVIEW}`)
  }
  useLayoutEffect(() => {
    if (category[2] !== userContext.state.category) {
      userContext.actions.setCategory(category[2])
      handleReset()
    }
  }, [userContext.state.category])

  useEffect(async () => {
    if (category[2] === userContext.state.category) {
      if (boardParam.cmpnNm !== '' || boardParam.bzn !== '' || boardParam.page !== 1) {
        handleSetSearchInput() // 검색 세팅
      }
    }
    await getList(boardParam)
  }, [boardParam])
  return (
    <>
      {/* Header */}
      <PageLayout currentMenu={'invest'} currentCate={'vcMngm'} currentPage={'invmCnvrsListView'}>
        <Stack direction="row" spacing={8}>
          {/* Side Menu */}
          {/* End of Side Menu */}
          <Box sx={{ width: '100%' }}>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}></Breadcrumbs>
            <Stack direction={'column'} spacing={4} alignItems="center">
              <Stack direction={'column'} spacing={2} sx={{ width: '100%' }}>
                <MuiCommSelect
                  pageTitle={'VC 관리'}
                  handleExcelDownload={handleExcelDownload}
                  defaultValue="ALL"
                  optionList={IVT_CODE.CNVS_STG_CD}
                  handleOptions={handleOptions}
                  handleReset={handleReset}
                  showDownLoad={true}
                  showReSetYn={true}
                  ref={selectRef}
                />
                <TableContainer component={Paper} sx={{ borderRadius: 0, boxShadow: 'none' }}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead
                      sx={{
                        borderTop: `1px solid ${theme.palette.secondary.main}`,
                        backgroundColor: theme.palette.lightBlueGrey.main
                      }}
                    >
                      <TableRow key={createKey}>
                        <TableCell align="center">NO</TableCell>
                        <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                          회사명
                        </TableCell>
                        <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                          사업자번호
                        </TableCell>
                        <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                          당행출자여부
                        </TableCell>
                        <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                          가입일시
                        </TableCell>
                        <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                          상태
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {invmCnvrsListView?.length > 0 ? (
                        invmCnvrsListView.map((item, idx) => (
                          <TableRow key={createKey}>
                            <TableCell align="center" component="th" scope="row" onClick={(e) => goDetailPage(e, item)}>
                              {item.rvsRnum}
                            </TableCell>
                            <TableCell align="center" component="th" scope="row" onClick={(e) => goDetailPage(e, item)}>
                              {item.cmpnNm}
                            </TableCell>
                            <TableCell
                              align="center"
                              component="th"
                              scope="row"
                              onClick={() =>
                                setLicensePopup({
                                  isOpen: true,
                                  usisId: item.utlinsttId,
                                  usisNm: item.cmpnNm,
                                  usisBzn: item.bzn
                                })
                              }
                            >
                              {item.bzn}
                            </TableCell>
                            <TableCell align="center" component="th" scope="row" onClick={(e) => goDetailPage(e, item)}>
                              {item.fncnYn}
                            </TableCell>
                            <TableCell align="center" component="th" scope="row" onClick={(e) => goDetailPage(e, item)}>
                              {item.rgsnTs}
                            </TableCell>
                            {invmCnvrsStgChangeView(item)}
                          </TableRow>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8}>
                            <NoResult />
                          </td>
                        </tr>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
                {licensePopup.isOpen && (
                  <LicensePopup
                    usisId={licensePopup.usisId}
                    usisNm={licensePopup.usisNm}
                    usisBzn={licensePopup.usisBzn}
                    closePopup={() => setLicensePopup({ ...initLicensePop })}
                    handleAlert={(_msg) => setAlert({ status: true, msg: _msg })}
                  />
                )}
              </Stack>
              <Pagination
                count={fullPage}
                variant="outlined"
                shape="rounded"
                onChange={handlePaging}
                renderItem={(item) => (
                  <PaginationItem
                    {...item}
                    sx={{
                      color: theme.palette.secondary.main,
                      '&.Mui-selected': {
                        backgroundColor: theme.palette.secondary.main,
                        color: theme.palette.white.main,
                        '&:hover': {
                          backgroundColor: theme.palette.secondary.dark
                        }
                      },
                      '&.MuiPaginationItem-previousNext': {
                        color: grey[500]
                      }
                    }}
                  />
                )}
              />
              <Stack direction={'row'} spacing={1}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <BtaSelect_copy poHandleChange={onSelectActive} defaultValue="cmpnNm">
                    <MenuItem value="cmpnNm">회사명</MenuItem>
                    <MenuItem value="bzn">사업자번호</MenuItem>
                  </BtaSelect_copy>
                </FormControl>
                <TextField
                  placeholder={placholder ? placholder : '회사명'}
                  size="small"
                  sx={{ width: '32rem' }}
                  value={searchInput}
                  onChange={(e) => {
                    setSearchInput(e.target.value)
                  }}
                  onKeyDown={onKeyPress}
                />
                <IconButton
                  sx={{
                    py: 0.875,
                    px: 1.25,
                    backgroundColor: theme.palette.secondary.main,
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: theme.palette.secondary.dark
                    }
                  }}
                  onClick={handleSearch}
                >
                  <SearchIcon color={'white'} />
                </IconButton>
                {/* <Button variant="contained"><SearchIcon/></Button> */}
              </Stack>
            </Stack>
          </Box>
        </Stack>
        {/* 공통 모델 셋팅 */}
        {alert.status && <PopupAlert msg={alert.msg} handlePopup={() => (handleAlertReset(), () => {})} />}
        <MuiCommModal
          type="alert"
          buttonTitle="대기"
          contents="투자사 전환 요청이 대기 상태로 처리 되었습니다."
          open={openModal}
          cancelEnabled={false}
          // handleConfirm={closeModleEvent}
          // sx={{color:theme.palette.white.main, fontWeight:'bold', boxShadow:'none', '&:hover':{boxShadow:'none'}}}
        />
      </PageLayout>
    </>
  )
}

export default InvmCnvrsListView
