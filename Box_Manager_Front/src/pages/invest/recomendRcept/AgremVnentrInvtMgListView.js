import RefreshIcon from '@mui/icons-material/Refresh'
import SearchIcon from '@mui/icons-material/Search'
import { Box, IconButton, PaginationItem, Stack, useTheme } from '@mui/material'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import Button from '@mui/material/Button'
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
import NoResult from 'components/NoResult'
import PageLayout from 'components/PageLayout'
import { getTotalNumberBoard } from 'modules/common'
import { InvestContext } from 'modules/common/InvestContext'
import { UserContext } from 'modules/common/UserContext'
import { getVncmloanAgisList } from 'modules/consts/InvestApi'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { useContext, useEffect, useLayoutEffect, useState, useCallback, useRef } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { BtaSelect_copy } from '../../../components/BtaSelect/BtaSelect_copy'
import { excelDownloadIvtByPostConfigOption, getPostConfig } from 'modules/utils/CommonUtils'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import Api from 'modules/consts/Api'
import moment from 'moment'

const AgremVnentrInvtMgListView = () => {
  const pages = ['투자BOX', '커머스BOX', '관리자계정']

  const theme = useTheme()

  const location = useLocation()
  let path = location.pathname
  let category = path.split('/')
  const userContext = useContext(UserContext)
  const { userInfo } = userContext.state
  const investContext = useContext(InvestContext)
  const history = useHistory()
  const [total, setTotal] = useState(0)
  const [totalY, setTotalY] = useState(0)
  const [totalN, setTotalN] = useState(0)
  const selectRef = useRef()

  const boardParamData = {
    searchComNm: '', // 회사명
    searchRcmdEnrpBzn: '', // 사업자번호
    page: 1,
    record: 20
  }
  const [boardParam, setBoardParam] = useState(boardParamData)
  const [agremVnentrInvtMgList, setAgremVnentrInvtMgList] = useState([])
  const [paging, setPaging] = useState({})
  const [searchInput, setSearchInput] = useState('') // 검색
  const [selectList, setSelectList] = useState({
    active: 'searchComNm'
  })

  const [fullPage, setFullPage] = useState(0)
  const getFullPage = (data) => {
    let cnt = 0
    for (let i = data.startPage; i <= data.endPage; i++) {
      cnt++
    }
    setFullPage(cnt)
  }

  const [placholder, setPlacholder] = useState('')

  // 목록조회
  const getList = useCallback(
    async (params) => {
      let res
      if (params) {
        res = await getVncmloanAgisList(params)
      } else {
        res = await getVncmloanAgisList()
      }

      if (res.data.code === '200') {
        const response = res.data.data

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
        setTotal(res.data.data.total)
        setTotalY(res.data.data.list[0].agremY)
        setTotalN(res.data.data.list[0].agremN)

        getFullPage(res.data.data)
        setAgremVnentrInvtMgList(response.list)
      }
    },
    [agremVnentrInvtMgList, total, totalY, totalN]
  )

  // 검색
  const handleSetSearchInput = (initial) => {
    // 렌더링시 조건값이 남아있으면 그대로 값 설정
    if (initial) {
      setBoardParam({
        searchComNm: '', // 제목
        searchRcmdEnrpBzn: '', // 작성자
        page: 1,
        record: 20
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
          record: 20
        })
      : (params = {
          page: 1,
          searchComNm: '',
          searchRcmdEnrpBzn: _searchInput,
          record: 20
        })
    setBoardParam(params)
  }
  // 문자열 변환
  const StringUtils = {
    bizNum: (value) => {
      return String(value).replace(/(\d{3})(\d{2})(\d{5})/g, '$1-$2-$3')
    }
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
      ...boardParam
    }
    // investContext.actions.handleSetSearch(params)
    setBoardParam(params)
  }

  // 페이징
  const handlePaging = (event, param) => {
    let params = {
      ...boardParam,
      page: param
    }

    setBoardParam(params)
  }

  // 초기화
  const handleReset = () => {
    handleSetSearchInput(true) // 검색 세팅
    setSearchInput('')
  }

  // == excel download
  const handleExcelDownload = async () => {
    await excelDownloadIvtByPostConfigOption(
      // content-disposition header 인코딩이 utf-8로 세팅할 경우에도 깨지는 현상 있음 -> 사용자 지정 파일명 세팅
      getPostConfig(Api.invest.vncmloanAgisListExcelDownload, boardParam),
      '협약 벤처투자기관 관리_' + moment(new Date()).format('YYYYMMDD')
    )
  }

  useLayoutEffect(() => {
    if (category[2] !== userContext.state.category) {
      userContext.actions.setCategory(category[2])
      handleReset()
    }
  }, [userContext.state.category])

  useEffect(async () => {
    if (category[2] === userContext.state.category) {
      if (boardParam.searchComNm !== '' || boardParam.searchRcmdEnrpBzn !== '' || boardParam.page !== 1) {
        handleSetSearchInput() // 검색 세팅
      }
    }
    await getList(boardParam)
  }, [boardParam])

  return (
    <>
      {/* Header */}

      <PageLayout currentMenu={'invest'} currentCate={'recomendRcept'} currentPage={'agremVnentrInvtMgListView'}>
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
                    협약 벤처투자기관 관리
                  </Typography>

                  <Typography color={'grey'} variant="body2">
                    총 {total}건(협약중 {totalY}건, 협약해제 {totalN}
                    개)
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
                  <Button
                    color="secondary"
                    variant="contained"
                    sx={{ color: theme.palette.white.main, boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
                    onClick={() => history.push(`${ROUTER_NAMES.INVEST_RECOMENDRCEPT_AGREMVNENTRINVTMGDETAILVIEW}`)}
                  >
                    등록
                  </Button>

                  <IconButton
                    onClick={handleReset}
                    sx={{
                      p: 0.875,
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark
                      }
                    }}
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
                          투자기관명
                        </TableCell>
                        <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                          사업자번호
                        </TableCell>
                        <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                          협약체결일
                        </TableCell>
                        <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                          협약만기일
                        </TableCell>
                        <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                          협약여부
                        </TableCell>
                        <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                          협약서 첨부여부
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {(!agremVnentrInvtMgList || agremVnentrInvtMgList.length === 0) && (
                        <tr>
                          <td colSpan={6}>
                            <NoResult />
                          </td>
                        </tr>
                      )}
                      {agremVnentrInvtMgList.map((agremVnentrInvtMg, idx) => (
                        <TableRow
                          key={'agremVnentrInvtMg_board_item_' + idx}
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
                              `${ROUTER_NAMES.INVEST_RECOMENDRCEPT_AGREMVNENTRINVTMGDETAILVIEW}/${agremVnentrInvtMg.agremVnentrSeq}`
                            )
                          }
                        >
                          <TableCell align="center" component="th" scope="row">
                            {getTotalNumberBoard(paging.total, paging.page, paging.record, idx)}
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            {agremVnentrInvtMg.invmEnprNm}
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            {StringUtils.bizNum(agremVnentrInvtMg.bzn)}
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            {agremVnentrInvtMg.agremCnclsde}
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            {agremVnentrInvtMg.agremExprtnde}
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            {agremVnentrInvtMg.agremYn === 'Y' ? '협약' : '협약 해제'}
                          </TableCell>
                          <TableCell
                            align="center"
                            component="th"
                            scope="row"
                            sx={{ color: theme.palette.secondary.main }}
                          >
                            {agremVnentrInvtMg.agrmntAtchmnfl === ' ' ? 'N' : 'Y'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Stack>

              <Pagination
                count={fullPage}
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

export default AgremVnentrInvtMgListView
