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
import { grey } from '@mui/material/colors'
import PageLayout from 'components/PageLayout'
import { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min'
import { BtaSelect_copy } from '../../../components/BtaSelect/BtaSelect_copy'
import MuiCommSelect from 'components/BtaSelect/MuiCommSelect'
import NoResult from 'components/NoResult'
import { UserContext } from 'modules/common/UserContext'
import Api from 'modules/consts/Api'
import { IVT_CODE } from 'modules/consts/BizCode'
import { getEtcList } from 'modules/consts/InvestApi'
import { excelDownloadIvtByPostConfigOption, getPostConfig } from 'modules/utils/CommonUtils'
import moment from 'moment'

const InvmCnvrsEtcInfoView = () => {
  const theme = useTheme()
  //추가 코드
  const location = useLocation()
  let path = location.pathname
  let category = path.split('/')
  const userContext = useContext(UserContext)
  const selectRef = useRef()
  //vnemtrlonReqst data
  const boardParamData = {
    cmpnNm: '', // 회사명
    bzn: '', // 사업자번호
    dsnc: '', // 추천상태
    page: 1,
    record: 10
  }
  const [boardParam, setBoardParam] = useState(boardParamData)
  const [invmCnvrsEtcInfoList, setInvmCnvrsEtcInfoList] = useState([])
  const [paging, setPaging] = useState({})
  const [searchInput, setSearchInput] = useState('') // 검색
  const [selectList, setSelectList] = useState({
    active: 'cmpnNm'
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
  const getList = async (params) => {
    let res
    if (params) {
      res = await getEtcList(params)
    } else {
      res = await getEtcList()
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
  // 목록 불러온 후 체크박스 설정
  const handleSetCheckbox = (data) => {
    // console.log(data);
    let tempList = data.map((d) => (d['checkbox'] = { ...d, checkbox: { id: d.pbnsId, value: '', status: false } }))
    setInvmCnvrsEtcInfoList(tempList)
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
        record: 10
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
  /**
   * 입력 구분 검색 이벤트
   */
  const onSearch = () => {
    handleSearch()
  }
  // Enter + 검색
  const onKeyPress = (e) => {
    e.key === 'Enter' && handleSearch()
  }
  /**
   * 검색 클릭시 페이지 초기화, 조건중 나머지값 초기화
   */
  const handleSearch = () => {
    let params = {}
    let _searchInput = searchInput.trim()
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
  }

  // 검색 조건
  const onSelectActive = (selected) => {
    if (selected === 'cmpnNm') {
      setPlacholder('회사명')
    } else {
      setPlacholder('사업자번호')
    }
    setSelectList((pre) => ({ ...pre, active: selected }))
  }

  // 콤보 박스 검색 조건
  const handleOptions = (selected) => {
    let params = {
      ...boardParam,
      dsnc: selected === 'ALL' ? '' : selected
    }
    setBoardParam(params)
  }

  /**
   * excel download
   */
  const handleExcelDownload = async () => {
    console.log('handleExcelDownload')
    await excelDownloadIvtByPostConfigOption(
      // content-disposition header 인코딩이 utf-8로 세팅할 경우에도 깨지는 현상 있음 -> 사용자 지정 파일명 세팅
      getPostConfig(Api.invest.convertEtcListExcelDownload, boardParam),
      '기타입력항목관리_' + moment(new Date()).format('YYYYMMDD')
    )
  }
  /**
   * 페이징 처리
   */
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
  // 투자 구분 코드 변환
  const changeItemDsnc = (item) => {
    switch (item) {
      case 'ETC01001':
        return '관심비즈니스분야'
      case 'ETC01002':
        return '활용기술'
      case 'ETC01003':
        return '주요투자업종'
      default:
        return '주요투자단계'
    }
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
      <PageLayout currentMenu={'invest'} currentCate={'vcMngm'} currentPage={'InvmCnvrsEtcInfoView'}>
        <Stack direction="row" spacing={8}>
          {/* Side Menu */}
          {/* End of Side Menu */}
          <Box sx={{ width: '100%' }}>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}></Breadcrumbs>
            <Stack direction={'column'} spacing={4} alignItems="center">
              <Stack direction={'column'} spacing={2} sx={{ width: '100%' }}>
                <MuiCommSelect
                  pageTitle={'기타 입력 항목 관리'}
                  handleExcelDownload={handleExcelDownload}
                  defaultValue="ALL"
                  optionList={IVT_CODE.FDCD_LIST}
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
                      <TableRow>
                        <TableCell align="center">NO</TableCell>
                        <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                          입력 항목
                        </TableCell>
                        <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                          구분
                        </TableCell>
                        <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                          등록일
                        </TableCell>
                        <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                          등록자 ID
                        </TableCell>
                        <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                          등록자명
                        </TableCell>
                        <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                          회사명
                        </TableCell>
                        <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                          사업자번호
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {invmCnvrsEtcInfoList?.length > 0 ? (
                        invmCnvrsEtcInfoList.map((item, idx) => (
                          <TableRow key={item.key}>
                            <TableCell align="center" component="th" scope="row">
                              {item.rvsRnum}
                            </TableCell>
                            <TableCell align="center" component="th" scope="row">
                              {item.inpiItm}
                            </TableCell>
                            <TableCell align="center" component="th" scope="row">
                              {changeItemDsnc(item.dsnc)}
                            </TableCell>
                            <TableCell align="center" component="th" scope="row">
                              {item.rgsnTs ? moment(item.rgsnTs).format('YYYY-MM-DD') : ''}
                            </TableCell>
                            <TableCell align="center" component="th" scope="row">
                              {item.rgsrId}
                            </TableCell>
                            <TableCell align="center" component="th" scope="row">
                              {item.rgsrNm}
                            </TableCell>
                            <TableCell align="center" component="th" scope="row">
                              {item.cmpnNm}
                            </TableCell>
                            <TableCell align="center" component="th" scope="row">
                              {item.bzn}
                            </TableCell>
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

export default InvmCnvrsEtcInfoView
