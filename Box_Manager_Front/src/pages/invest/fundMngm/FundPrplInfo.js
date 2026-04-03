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
import { BtaSelect } from '../../../components/BtaSelect'
import React, { useState, useEffect, useRef, useCallback } from 'react'
import Api from '../../../modules/consts/Api'
import CommonAxios from '../../../modules/utils/CommonAxios'
import {
  getConfig,
  getPostConfig,
  generateKey,
  excelDownloadIvtByPostConfigOption
} from '../../../modules/utils/CommonUtils'
import { BtaSelect_copy } from '../../../components/BtaSelect/BtaSelect_copy'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { useHistory } from 'react-router-dom'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import moment from 'moment'

const FundPrplInfo = (props) => {
  const pages = ['투자BOX', '커머스BOX', '관리자계정']

  const theme = useTheme()
  const [list, setList] = useState([])
  const [paging, setPaging] = useState({})
  const pageRef = useRef(1)
  const totalPageRef = useRef(1)
  const selData = useRef('')
  const chkSearchType = useRef()
  const history = useHistory()
  const [sel, setSel] = useState('all')
  const [searchSel, setSearchSel] = useState('fundId')
  const searchText = useRef('')

  // 제안받은 펀드 리스트 조회
  const loadAdminFundList = async () => {
    let auditStgState = selData.current === undefined ? '' : selData.current
    if (selData.current === 'all') {
      auditStgState = ''
    }

    let fundNm = ''
    let prmNm = ''
    if (chkSearchType.current === 'fundId') {
      fundNm = searchText.current.value
    } else {
      prmNm = searchText.current.value
    }

    const params = {
      page: 1,
      record: 20,
      pageSize: 5,
      searchFund: fundNm,
      searchPrn: prmNm,
      auditStg: auditStgState
    }
    console.log('params = ', params)
    let res = await CommonAxios('IVT', getConfig(Api.adminFund.fundPrplInfoList, params))

    if (res.data.code === '200') {
      selData.current = ''
      const response = res.data.data
      console.log('response = ', response)
      setPaging({
        endPage: response.endPage,
        next: response.next,
        page: response.page,
        prev: response.prev,
        record: response.record,
        startPage: response.startPage,
        total: response.total,
        totalPage: response.totalPage
      })

      const resArr = []
      response.list.forEach((item) => {
        const resObj = {
          seq: res.data.data.total,
          auditStg: item.auditStg,
          fundId: item.fundId,
          fundNm: item.fundNm,
          fundPtrn: item.fundPtrn,
          prnNm: item.prnNm,
          utlinsttId: item.utlinsttId,
          wody: item.wody,
          orgzTrgpft: item.orgzTrgpft,
          rgsnTs: item.rgsnTs
        }
        resArr.push(resObj)
      })
      let cnt = 0
      for (let i = response.startPage; i <= response.endPage; i++) {
        cnt++
      }
      totalPageRef.current = cnt
      setList(resArr)
    }
  }

  // 페이징
  const handlePaging = useCallback(
    (event, param) => {
      let params = {
        ...paging,
        page: param
      }
      pageRef.current = param
      setPaging(params)
      loadAdminFundList()
    },
    [paging]
  )

  // 상태 셀렉트박스
  const onSelectActive = useCallback((selected) => {
    selData.current = selected
    setSel(selected)
    setSearchSel('fundId')
    searchText.current.value = ''
    loadAdminFundList()
  }, [])

  // 검색 셀렉트박스
  const onSelectActive2 = (selected) => {
    searchText.current.value = ''
    chkSearchType.current = selected
    setSearchSel(selected)
  }

  // 계속작성 클릭 시 등록화면 이동
  const loadDetail = (item) => {
    const url = ROUTER_NAMES.INVEST_FUNDMNGM_FUNDPRPLVIEW + '?fundId=' + item.fundId
    history.push(url, { ...item })
  }

  // 새로고침
  const refreshSelBox = useCallback(() => {
    selData.current = ''
    setSel('all')
    chkSearchType.current = 'fundId'
    searchText.current.value = ''
    setSearchSel('fundId')
    loadAdminFundList()
  }, [sel])

  // == excel download
  const handleExcelDownload = async () => {
    const params = {
      page: pageRef.current,
      record: 20,
      pageSize: 5
    }

    await excelDownloadIvtByPostConfigOption(
      // content-disposition header 인코딩이 utf-8로 세팅할 경우에도 깨지는 현상 있음 -> 사용자 지정 파일명 세팅
      getPostConfig(Api.adminFund.fundPrplListExcel, params),
      '제안받은 펀드' + moment(new Date()).format('YYYYMMDD')
    )
  }

  useEffect(() => {
    chkSearchType.current = 'fundId'
    selData.current = ''
    loadAdminFundList()
  }, [])

  return (
    <>
      {/* Header */}
      <PageLayout currentMenu={'invest'} currentCate={'fundMngm'} currentPage={'fundPrplInfo'}>
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
                    제안받은 펀드
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
                    <BtaSelect_copy defaultValue={sel} poHandleChange={onSelectActive}>
                      <MenuItem value={'all'}>전체</MenuItem>
                      <MenuItem value={'AUD01001'}>제출완료</MenuItem>
                      <MenuItem value={'AUD01002'}>심사중</MenuItem>
                      <MenuItem value={'AUD01003'}>심사 완료 - 수락</MenuItem>
                      <MenuItem value={'AUD01004'}>심사 완료 - 일부 수락</MenuItem>
                      <MenuItem value={'AUD01005'}>심사 완료 - 거절</MenuItem>
                      <MenuItem value={'AUD01006'}>심사 완료 - 보류</MenuItem>
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
                    onClick={refreshSelBox}
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
                        <TableCell align="center">제안번호</TableCell>
                        <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                          펀드명
                        </TableCell>
                        <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                          운용사명
                        </TableCell>
                        <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                          제안일
                        </TableCell>
                        <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                          금액
                        </TableCell>
                        <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                          상태
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {list.map((data, i) => (
                        <TableRow
                          key={generateKey()}
                          sx={{ '&:hover': { backgroundColor: theme.palette.primary.light, cursor: 'pointer' } }}
                          onClick={() => loadDetail(data)}
                        >
                          <TableCell align="center" component="th" scope="row">
                            {data.seq - i}
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            {data.fundNm}
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            {data.prnNm}
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            {data.rgsnTs}
                          </TableCell>
                          <TableCell align="center" component="th" scope="row">
                            {data.orgzTrgpft}억원
                          </TableCell>
                          <TableCell align="center" component="th" scope="row" sx={{ color: theme.palette.info.main }}>
                            {(data.auditStg === 'AUD01001' && '제출 완료') ||
                              (data.auditStg === 'AUD01002' && '심사중') ||
                              (data.auditStg === 'AUD01003' && '심사 완료 - 수락') ||
                              (data.auditStg === 'AUD01004' && '심사 완료 - 일부 수락') ||
                              (data.auditStg === 'AUD01005' && '심사 완료 - 거절') ||
                              (data.auditStg === 'AUD01006' && '심사 완료 - 보류')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Stack>

              <Pagination
                count={totalPageRef.current}
                variant="outlined"
                shape="rounded"
                hidePrevButton={true}
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
                  <BtaSelect_copy defaultValue={searchSel} poHandleChange={onSelectActive2}>
                    <MenuItem value={'fundId'}>펀드명</MenuItem>
                    <MenuItem value={'prnNm'}>운용사명</MenuItem>
                  </BtaSelect_copy>
                </FormControl>
                <TextField size="small" inputRef={(val) => (searchText.current = val)} sx={{ width: '32rem' }} />

                <IconButton
                  onClick={loadAdminFundList}
                  sx={{
                    py: 0.875,
                    px: 1.25,
                    backgroundColor: theme.palette.secondary.main,
                    borderRadius: 1,
                    '&:hover': {
                      backgroundColor: theme.palette.secondary.dark
                    }
                  }}
                >
                  <SearchIcon color={'white'} />
                </IconButton>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </PageLayout>
    </>
  )
}

export default FundPrplInfo
