import RefreshIcon from '@mui/icons-material/Refresh'
import SearchIcon from '@mui/icons-material/Search'
import { Box, IconButton, Stack, useTheme } from '@mui/material'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import { grey } from '@mui/material/colors'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
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
import Pagination from 'components/Pagination'
import dayjs from 'dayjs'
import { getTotalNumberBoard } from 'modules/common'
import { UserContext } from 'modules/common/UserContext'
import { getProposalCompanyList } from 'modules/consts/InvestApi'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { useCallback, useContext, useEffect, useLayoutEffect, useState, useRef } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { BtaSelect_copy } from '../../../components/BtaSelect/BtaSelect_copy'

const PrplCm = (props) => {
  const theme = useTheme()

  const location = useLocation()
  let path = location.pathname
  let category = path.split('/')
  const userContext = useContext(UserContext)
  const history = useHistory()
  const [sel, setSel] = useState('all')
  const [searchSel, setSearchSel] = useState('searchContent')
  const pageRef = useRef(1)
  const activeRef = useRef('')
  const searchConRef = useRef('')
  
  const boardParamData = {
    searchStatus: '',
    searchContent: '', // 회사명
    searchUser: '', // 사업자번호
    page: 1,
    record: 20
  }
  const [boardParam, setBoardParam] = useState(boardParamData)
  const [prplCmList, setPrplCmList] = useState([])
  const [paging, setPaging] = useState({})
  const [searchInput, setSearchInput] = useState('') // 검색
  const [selectList, setSelectList] = useState({
    active: 'searchContent'
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
  
  // ===== 목록조회
  const getList = async () => {

    let params = {}
    const _searchInput = searchConRef.current === '' ? searchInput.trim() : searchConRef.current
    selectList.active === 'searchContent'
      ? (params = {
          page: pageRef.current,
          searchStatus: activeRef.current,
          searchContent: _searchInput,
          searchUser: '',
          record: 20
        })
      : (params = {
          page: pageRef.current,
          searchStatus: activeRef.current,
          searchContent: '',
          searchUser: _searchInput,
          record: 20
        })
    let res = await getProposalCompanyList(params)

    if (res.data.code === '200') {
      const response = res.data.data
      setPaging({
        endPage: res.data.data.endPage,
        next: res.data.data.next,
        page: res.data.data.page,
        prev: res.data.data.prev,
        record: 20,
        startPage: res.data.data.startPage,
        total: res.data.data.total,
        totalPage: res.data.data.totalPage
      })

      getFullPage(res.data.data)
      setPrplCmList(response.list)
    }
  }

  // ====== 검색
  const handleSetSearchInput = (initial) => {
    // 렌더링시 조건값이 남아있으면 그대로 값 설정
    if (initial) {
      setBoardParam({
        searchStatus: '',
        searchContent: '', // 제목
        searchUser: '', // 작성자
        page: pageRef.current,
        record: 20
      })
    } else {
      let searchContent = boardParam.searchContent
      let searchUser = boardParam.searchUser
      searchContent !== ''
        ? (onSelectActive('searchContent'), setSearchInput(searchContent))
        : searchUser !== ''
        ? (onSelectActive('searchUser'), setSearchInput(searchUser))
        : (onSelectActive('searchContent'), setSearchInput(''))
    }
  }
  // 검색
  const onSearch = () => {
    pageRef.current = 1
    getList()
  }
  // Enter + 검색
  const onKeyPress = (e) => {
    e.key === 'Enter' && onSearch()
  }

  const StringUtils = {
    bizNum: (value) => {
      return String(value).replace(/(\d{3})(\d{2})(\d{5})/g, '$1-$2-$3')
    }
  }

  // 검색 조건 하단
  const onSelectActive = (selected) => {
    if (selected === 'searchContent') {
      setPlacholder('회사명')
    } else {
      setPlacholder('사업자번호')
    }
    setSearchSel(selected)
    setSelectList({
      ...selectList,
      active: selected
    })
  }

  // 검색 조건 상단
  const onSelectActive2 = (selected) => {
    pageRef.current = 1
    setSel(selected)
    
    activeRef.current = selected

    getList()
  }

  // 페이지이동
  const linktoPage = (utlinsttId, rcmdEnprBzn) => {
    const url =
      ROUTER_NAMES.INVEST_RCMDENPRMNGM_PRPLCMVIEW + '?utlinsttId=' + utlinsttId + '&rcmdEnprBzn=' + rcmdEnprBzn

    history.push(url, {pageNum : boardParam.page, searchContent : searchInput, activeOption : searchSel , searchStatus : activeRef.current})
  }

  const formatDate = (value) => {
    const formatedDate = dayjs(value).format('YYYY-MM-DD')
    return formatedDate
  }

  // ===== 페이징
  const handlePaging = (event) => {
    let params = {
      ...boardParam,
      page: event.page
    }
    pageRef.current = event.page
    setBoardParam(params)
    getList()
  }

  // ===== 초기화
  const handleReset = useCallback(() => {
    pageRef.current = 1
    activeRef.current = ''
    searchConRef.current = ''
    handleSetSearchInput(true) // 검색 세팅
    setSearchInput('')
    setSel('all')
    setPlacholder('회사명')
    setSearchSel('searchContent')

    getList()
  }, [activeRef, pageRef])

  useLayoutEffect(() => {
    if (category[2] !== userContext.state.category) {
      userContext.actions.setCategory(category[2])
      handleReset()
    }
  }, [userContext.state.category])

  useEffect(async () => {
    if (category[2] === userContext.state.category) {
      if (
        boardParam.searchStatus !== '' ||
        boardParam.searchContent !== '' ||
        boardParam.searchUser !== '' ||
        boardParam.page !== 1
      ) {
        handleSetSearchInput() // 검색 세팅
      }
    }
    if(props.location.state !== undefined) {
      pageRef.current = props.location.state.pageNum
      activeRef.current = props.location.state.searchStatus
      searchConRef.current = props.location.state.searchContent
      setSearchSel(props.location.state.activeOption)
      setSearchInput(props.location.state.searchContent)
      setSel(props.location.state.searchStatus)
    }
    
    await getList()
  }, [])

  return (
    <>
      {/* Header */}

      <PageLayout currentMenu={'invest'} currentCate={'rcmdEnprMngm'} currentPage={'prplCm'}>
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
                    추천받은 기업 리스트
                  </Typography>

                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <BtaSelect_copy poHandleChange={onSelectActive2} defaultValue={sel}>
                      <MenuItem value={'all'}>전체</MenuItem>
                      <MenuItem value={'Y'}>읽음</MenuItem>
                      <MenuItem value={'N'}>읽지않음</MenuItem>
                    </BtaSelect_copy>
                  </FormControl>

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
                          회사명
                        </TableCell>
                        <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                          사업자번호
                        </TableCell>
                        <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                          추천 VC
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
                      {(!prplCmList || prplCmList.length === 0) && (
                        <tr>
                          <td colSpan={6}>
                            <NoResult />
                          </td>
                        </tr>
                      )}
                      {prplCmList.map((prplcm, idx) => (
                        <TableRow
                          key={'prplcm_board_item_' + idx}
                          sx={{
                            '&:hover': {
                              backgroundColor: '#eee',
                              cursor: 'pointer'
                            }
                          }}
                          onClick={() => linktoPage(prplcm.utlinsttId, prplcm.rcmdEnprBzn)}
                        >
                          <TableCell align="center" component="th" scope="row">
                            {getTotalNumberBoard(paging.total, paging.page, paging.record, idx)}
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            {prplcm.rcmdEnprNm}{' '}
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            {StringUtils.bizNum(prplcm.rcmdEnprBzn)}
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            {prplcm.prnNm}
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            {prplcm.mainBiz}
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            {prplcm.sbmsStts === 'N' ? (
                              <span style={{ color: 'red' }}>추천취소</span>
                            ) : (
                              formatDate(prplcm.rgsnTs)
                            )}
                          </TableCell>
                          <TableCell
                            align="center"
                            component="th"
                            scope="row"
                            sx={{ color: theme.palette.secondary.main }}
                          >
                            {prplcm.oprtrCnfaYn === 'Y' ? '읽음' : '읽지않음'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Stack>
              <div className={'paging_wrap'}>{paging && <Pagination pagingData={paging} handlePaging={handlePaging} />}</div>                  

              <Stack direction={'row'} spacing={1}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <BtaSelect_copy poHandleChange={onSelectActive} defaultValue={searchSel}>
                    <MenuItem value="searchContent">회사명</MenuItem>
                    <MenuItem value="searchUser">사업자번호</MenuItem>
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

export default PrplCm
