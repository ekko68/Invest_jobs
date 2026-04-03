import RefreshIcon from '@mui/icons-material/Refresh'
import SearchIcon from '@mui/icons-material/Search'
import { Box, IconButton, PaginationItem, Stack, useTheme } from '@mui/material'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import { grey } from '@mui/material/colors'
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
import PageLayout from 'components/PageLayout'

import { BtaSelect_copy } from '../../../components/BtaSelect/BtaSelect_copy'

import { useEffect, useState, useContext, useLayoutEffect } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { getVnemtrlonReqstList } from 'modules/consts/InvestApi'
import { InvestContext } from 'modules/common/InvestContext'
import { UserContext } from 'modules/common/UserContext'
import { dateFormat, getTotalNumberBoard } from 'modules/common'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { StringUtils } from 'modules/utils/StringUtils'
import moment from 'moment'
import { excelDownloadIvtByPostConfigOption, getPostConfig } from 'modules/utils/CommonUtils'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import Api from 'modules/consts/Api'

const VnentrLonSgshPrtRceptView = () => {
  const theme = useTheme()

  //추가 코드
  const location = useLocation()
  let path = location.pathname
  let category = path.split('/')
  const userContext = useContext(UserContext)
  const { userInfo } = userContext.state
  const investContext = useContext(InvestContext)
  const history = useHistory()

  //vnemtrlonReqst data
  const boardParamData = {
    searchComNm: '', // 회사명
    searchRcmdEnrpBzn: '', // 사업자번호
    searchRecomendSttus: '', // 추천상태
    page: 1,
    record: 10
  }
  const [boardParam, setBoardParam] = useState(boardParamData)
  const [vnemtrlonReqstList, setVnemtrlonReqstList] = useState([])
  const [paging, setPaging] = useState({})
  const [searchInput, setSearchInput] = useState('') // 검색
  const [selectList, setSelectList] = useState({
    active: 'searchComNm'
    // list: [
    //   { id: 'searchComNm', value: 'searchComNm', label: '회사명' },
    //   { id: 'searchRcmdEnrpBzn', value: 'searchRcmdEnrpBzn', label: '사업자번호' }
    // ]
  })
  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(10)
  const [placholder, setPlacholder] = useState('')

  // ===== 목록조회
  const getList = async (params) => {
    let res
    if (params) {
      res = await getVnemtrlonReqstList(params)
    } else {
      res = await getVnemtrlonReqstList()
    }
    if (res.data.code === '200') {
      // setPaging({
      //   endPage: res.data.data.endPage,
      //   next: res.data.data.next,
      //   page: res.data.data.page,
      //   prev: res.data.data.prev,
      //   record: res.data.data.record,
      //   startPage: res.data.data.startPage,
      //   total: res.data.data.total,
      //   totalPage: res.data.data.totalPage
      //  })
      setPageCount(res.data.data.totalPage)
      setPage(res.data.data.page)

      handleSetCheckbox(res.data.data.list) //  데이터 목록 + 선택 체크박스 추가
    }
  }
  // 목록 불러온 후 체크박스 설정
  const handleSetCheckbox = (data) => {
    // console.log(data);
    let tempList = data.map((d) => (d['checkbox'] = { ...d, checkbox: { id: d.pbnsId, value: '', status: false } }))
    setVnemtrlonReqstList(tempList)
  }

  // ====== 검색
  const handleSetSearchInput = (initial) => {
    // 렌더링시 조건값이 남아있으면 그대로 값 설정
    if (initial) {
      setBoardParam({
        searchComNm: '', // 제목
        searchRcmdEnrpBzn: '', // 작성자
        page: 1,
        record: 10
      })
    } else {
      let searchComNm = boardParam.searchComNm
      let searchRcmdEnrpBzn = boardParam.searchRcmdEnrpBzn
      searchComNm !== ''
        ? (onSelectActive('searchComNm'), setSearchInput(searchComNm))
        : searchRcmdEnrpBzn !== ''
        ? (onSelectActive('searchRcmdEnrpBzn'), setSearchInput(searchRcmdEnrpBzn))
        : (onSelectActive('searchComNm'), setSearchInput(''))
    }
  }
  // 검색
  const onSearch = () => {
    handleSearch()
  }
  // Enter + 검색
  const onKeyPress = (e) => {
    e.key === 'Enter' && onSearch()
  }

  const handleSearch = () => {
    // 검색 클릭시 페이지 초기화, 조건중 나머지값 초기화
    let params = {}
    const _searchInput = searchInput.trim()
    selectList.active === 'searchComNm'
      ? (params = {
          page: 1,
          searchComNm: _searchInput,
          searchRcmdEnrpBzn: '',
          record: 10
        })
      : (params = {
          page: 1,
          searchComNm: '',
          searchRcmdEnrpBzn: _searchInput,
          record: 10
        })
    setBoardParam(params)
    // investContext.actions.handleSetSearch(params)
  }

  // 검색 조건
  const onSelectActive = (selected) => {
    if (selected === 'searchComNm') {
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
  const onSelectActive2 = (selected) => {
    let params = {
      ...boardParam,
      searchRecomendSttus: selected
    }

    // investContext.actions.handleSetSearch(params)
    setBoardParam(params)
  }

  // ===== 페이징
  const handlePaging = (event, param) => {
    // console.log(param)
    let params = {
      ...boardParam,
      page: param
      // ...param
    }

    // investContext.actions.handleSetSearch(params)
    setBoardParam(params)
  }

  // == excel download
  const handleExcelDownload = async () => {
    await excelDownloadIvtByPostConfigOption(
      // content-disposition header 인코딩이 utf-8로 세팅할 경우에도 깨지는 현상 있음 -> 사용자 지정 파일명 세팅
      getPostConfig(Api.invest.vncmloanRcmdVcListExcelDownload, boardParam),
      '_IBK벤처대출 추천 접수(VC)' + moment(new Date()).format('YYYYMMDD')
    )
  }

  // ===== 초기화
  const handleReset = () => {
    // investContext.actions.initialize()
    // setBoardParam({
    //   searchComNm: '', // 제목
    //   searchRcmdEnrpBzn: '', // 작성자
    //   page: 1
    // })
    handleSetSearchInput(true) // 검색 세팅
    setSearchInput('')
  }

  useLayoutEffect(() => {
    if (category[2] !== userContext.state.category) {
      userContext.actions.setCategory(category[2])
      handleReset()
    }
  }, [userContext.state.category])

  useEffect(async () => {
    // console.log(investContext);
    if (category[2] === userContext.state.category) {
      if (
        boardParam.searchComNm !== '' ||
        boardParam.searchRcmdEnrpBzn !== '' ||
        boardParam.page !== 1
        // investContext.state.boardParam.searchContent !== '' ||
        // investContext.state.boardParam.searchUser !== '' ||
        // investContext.state.boardParam.page !== 1
      ) {
        handleSetSearchInput() // 검색 세팅
      }
    }
    await getList(boardParam)
  }, [boardParam])

  return (
    <>
      {/* Header */}

      <PageLayout currentMenu={'invest'} currentCate={'recomendRcept'} currentPage={'vnentrLonSgshPrtRceptView'}>
        <Stack direction="row" spacing={8}>
          {/* Side Menu */}
          {/* End of Side Menu */}

          <Box sx={{ width: '100%' }}>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}></Breadcrumbs>

            <Stack direction={'column'} spacing={4} alignItems="center">
              <Stack direction={'column'} spacing={2} sx={{ width: '100%' }}>
                <Stack direction={'row'} alignItems="flex-end" spacing={1}>
                  <Typography
                    flexGrow={1}
                    variant="h1"
                    sx={{ lineHeight: '2.375rem', fontSize: '1.875rem', fontWeight: 'bold' }}
                  >
                    IBK벤처대출 추천 접수(VC)
                  </Typography>
                  <IconButton
                    onClick={handleExcelDownload}
                    sx={{
                      p: 0.75,
                      border: `1px solid ${grey[400]}`,
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: `${grey[100]}`
                      }
                    }}
                  >
                    <InsertDriveFileIcon sx={{ color: '#5FB742' }} />
                  </IconButton>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <BtaSelect_copy poHandleChange={onSelectActive2} defaultValue="">
                      <MenuItem value="">전체</MenuItem>
                      <MenuItem value={'RST01001'}>추천 완료</MenuItem>
                      <MenuItem value={'RST01002'}>보완요청(VC)</MenuItem>
                      <MenuItem value={'RST01003'}>부완수정제출(VC)</MenuItem>
                      <MenuItem value={'RST01004'}>자료 요청(기업)</MenuItem>
                    </BtaSelect_copy>
                  </FormControl>

                  <IconButton
                    sx={{
                      p: 0.875,
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark
                      }
                    }}
                    onClick={handleReset}
                  >
                    <RefreshIcon color={'white'} />
                  </IconButton>
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
                        <TableCell align="center">NO</TableCell>
                        <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                          회사명
                        </TableCell>
                        <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                          사업자번호
                        </TableCell>
                        <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                          추천투자기관
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
                      {vnemtrlonReqstList.map((row, index) => (
                        <TableRow
                          key={row.vnentrlonId}
                          sx={{
                            '&:hover': {
                              backgroundColor: '#eee',
                              cursor: 'pointer'
                            }
                          }}
                          onClick={(e) =>
                            e.target.nodeName !== 'LABEL' &&
                            e.target.nodeName !== 'INPUT' &&
                            history.push(
                              `${ROUTER_NAMES.INVEST_RECOMENDRCEPT_VNENTRLONSGSHPRTRCEPTDETAILVIEW}/${row.vnentrlonId}`
                            )
                          }
                        >
                          <TableCell align="center" component="th" scope="row">
                            {row.rvsRnum}
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            {row.etnm}
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            {StringUtils.bizNum(row.rcmdEnprBzn)}
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            {row.invmEnprNm}
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            {dateFormat(row.rgsnTs, true)}
                          </TableCell>
                          <TableCell
                            align="center"
                            component="th"
                            scope="row"
                            sx={
                              () => {
                                if (row.recomendSttus === 'RST01001') {
                                  return { color: theme.palette.warning.main }
                                }
                              }
                              // {color:theme.palette.warning.main}
                            }
                          >
                            {row.recomendSttusNm}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Stack>

              <Pagination
                page={page}
                count={pageCount}
                selected={false}
                variant="outlined"
                shape="rounded"
                onChange={handlePaging}
                // hidePrevButton={true}

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
                  <BtaSelect_copy poHandleChange={onSelectActive} defaultValue="searchComNm">
                    <MenuItem value="searchComNm">회사명</MenuItem>
                    <MenuItem value="searchRcmdEnrpBzn">사업자번호</MenuItem>
                  </BtaSelect_copy>
                </FormControl>

                <TextField
                  placeholder={placholder ? placholder : '회사명'}
                  size="small"
                  // id="filled-search"
                  // label="Search field"
                  // type="search"
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
                  onClick={onSearch}
                >
                  <SearchIcon color={'white'} />
                </IconButton>

                {/* <Button variant="contained"><SearchIcon/></Button> */}
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </PageLayout>
    </>
  )
}

export default VnentrLonSgshPrtRceptView
