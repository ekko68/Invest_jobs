import { useState, useEffect } from 'react'

import { Box, IconButton, PaginationItem, Stack, useTheme } from '@mui/material'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import { grey } from '@mui/material/colors'
import Pagination from '@mui/material/Pagination'
import Typography from '@mui/material/Typography'

import PageLayout from 'components/PageLayout'

import CmListViewTable from 'pageComponents/invest/recomendRcept/CmListViewTable'
import CmListViewTableUtil from 'pageComponents/invest/recomendRcept/CmListViewTableUtil'
import CmListViewSearchBar from 'pageComponents/invest/recomendRcept/CmListViewSearchBar'

import ROUTER_NAMES from 'modules/consts/RouterConst'
import { getVnemtrlonAplcList, getVncmLoanCodeList } from 'modules/consts/InvestApi'
import { useHistory } from 'react-router-dom'
import { excelDownloadIvtByPostConfigOption, getPostConfig } from 'modules/utils/CommonUtils'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'
import Api from 'modules/consts/Api'
import moment from 'moment'

const MgVnentrLonCmListView = () => {
  const theme = useTheme()
  const history = useHistory()

  const rowCountPerPage = 20
  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(10)
  const [tableData, setTableData] = useState([])

  const [codeList, setCodeList] = useState([])
  const [searchOption, setSearchOption] = useState({ category: '회사명', keyword: '', status: '전체' })

  useEffect(() => {
    getList(page)
    getCodes()
  }, [])

  useEffect(() => {
    getList(1)
  }, [searchOption])

  const moveCmDetailView = (data) => {
    history.push(ROUTER_NAMES.INVEST_RECOMENDRCEPT_MGVNENTRLONCMDETAILVIEW, data)
  }
  const handlePageChange = async (event, pageNum) => {
    await getList(pageNum)
  }

  const handleSearch = async () => {
    await getList(1)
  }

  const makeSearchPramas = () => {
    const { category, status, keyword } = searchOption
    const categoryConverter = {
      회사명: 'searchComNm',
      사업자번호: 'searchRcmdEnrpBzn'
    }

    let newParam = {}
    if (status !== '전체') {
      newParam['searchRecomendSttus'] = status
    }
    if (keyword) {
      if (category === '사업자번호') {
        newParam[categoryConverter[category]] = keyword.trim().replace('-', '')
      } else {
        newParam[categoryConverter[category]] = keyword
      }
    }

    return newParam
  }

  const handleFilterChange = async (status) => {
    setSearchOption((pre) => {
      return { ...pre, status }
    })
  }

  const refresh = async () => {
    await getList(page)
  }

  const getList = async (newPage) => {
    let params = { page: newPage, record: rowCountPerPage, ...makeSearchPramas() }
    let res = await getVnemtrlonAplcList(params)
    if (res.data.code === '200') {
      const { totalPage, list, page } = res.data.data
      setTableData(list)
      setPageCount(totalPage)
      setPage(page)
    }
  }

  // == excel download
  const handleExcelDownload = async () => {
    //vnemtrlonReqst data
    const boardParam = {
      searchComNm: '', // 회사명
      searchRcmdEnrpBzn: '', // 사업자번호
      searchRecomendSttus: '', // 추천상태
      page: 1,
      record: 10
    }

    await excelDownloadIvtByPostConfigOption(
      // content-disposition header 인코딩이 utf-8로 세팅할 경우에도 깨지는 현상 있음 -> 사용자 지정 파일명 세팅
      getPostConfig(Api.invest.vncmloanRcmdRcListExcelDownload, boardParam),
      '_IBK벤처대출 추천 접수(기업)' + moment(new Date()).format('YYYYMMDD')
    )
  }

  const getCodes = async () => {
    const resCodes = await getVncmLoanCodeList()

    if (resCodes?.data?.code === '200') {
      const codeList = resCodes?.data?.data?.list
      const rst02CodeList = codeList.filter((code) => code.comCdId.startsWith('RST02'))

      setCodeList(rst02CodeList)
    }
  }
  return (
    <>
      <PageLayout currentMenu={'invest'} currentCate={'recomendRcept'} currentPage={'mgVnentrLonCmListView'}>
        <Stack direction="row" spacing={8}>
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
                    IBK벤처대출 접수(기업)
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

                  <CmListViewTableUtil
                    onChangeStatusFilter={handleFilterChange}
                    onClickRefresh={refresh}
                    codeList={codeList}
                  />
                </Stack>
                <CmListViewTable tableData={tableData} onClickRow={moveCmDetailView} />
              </Stack>

              <Pagination
                page={page}
                count={pageCount}
                onChange={handlePageChange}
                variant="outlined"
                shape="rounded"
                hidePrevButton={true}
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
              <CmListViewSearchBar
                onChangeCategory={(category) => {
                  setSearchOption((pre) => {
                    return { ...pre, category }
                  })
                }}
                onChangeKeyword={(keyword) => {
                  setSearchOption((pre) => {
                    return { ...pre, keyword }
                  })
                }}
                onClickSearch={handleSearch}
              />
            </Stack>
          </Box>
        </Stack>
      </PageLayout>
    </>
  )
}

export default MgVnentrLonCmListView
