import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { HomeOutlined } from '@mui/icons-material'
import { Box, Container, Paper, Stack, useTheme, Pagination, PaginationItem } from '@mui/material'

import { BtNavSelect } from 'components/bt/BtNavSelect'
import Header from 'components/header/Header'

import VnentrLonCmListViewTable from 'pageComponents/mypage/company/vncmloan/VnentrLonCmListViewTable'

import ROUTER_NAMES from 'modules/consts/RouterConst'
import Api from 'modules/consts/Api'
import CommonAxios, { getConfig } from 'modules/utils/CommonAxios'
import VnentrLonCmWrapper from 'pageComponents/mypage/company/vncmloan/Wrapper'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import NoResult from 'components/common/NoResult'

const VnentrLonCmListView = () => {
  const theme = useTheme()
  const history = useHistory()
  const commonContext = useContext(CommonContext)

  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(10)
  const [tableData, setTableData] = useState([])

  /**
   * 버튼 선택 시 ʻ마이페이지(기업) > 내정보 > IBK벤처대출 신청 등록’ 화면으로 이동
   */
  const moveRegistrationView = (data) => {
    const { vnentrlonId, recomendSttusCm, recomendSttusCmNm, utlinsttId, invmEnprNm } = data
    history.push(ROUTER_NAMES.VNENTR_LON_CM_REG_VIEW, {
      vnentrlonId,
      recomendSttusCm,
      recomendSttusCmNm,
      utlinsttId,
      invmEnprNm
    })
  }

  /**
   * 버튼 선택 시 ʻ마이페이지(기업) > 내정보 > IBK벤처대출 신청 상세’ 화면으로 이동
   */
  const moveDetailView = (data) => {
    history.push(ROUTER_NAMES.VNENTR_LON_CM_DETAIL_VIEW, data)
  }

  const handlePageChange = (event, pageNum) => {
    getList(pageNum)
  }

  useEffect(async () => {
    if (commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck) {
      commonContext.actions.pageMountPathCheck(history, async () => {
        await getList(page)
      })
    }
  }, [commonContext.state.user])

  const getList = async (pageNum) => {
    const params = {
      page: pageNum,
      record: 10,
      pageSize: 5
    }
    const res = await CommonAxios(getConfig(Api.vncmloan.aplcList, params), true)
    if (res?.data?.code == '200' && res.data.data) {
      const { totalPage, list, page } = res.data.data
      setTableData(list)
      setPageCount(totalPage)
      setPage(page)
    }
  }

  return (
    <>
      <VnentrLonCmWrapper>
        <Container maxWidth="false" disableGutters sx={{ maxWidth: '1280px', px: '1.25rem' }}>
          <Stack spacing={4} direction={'column'} sx={{ py: 5 }}>
            <Paper sx={{ p: 4 }}>
              <Stack direction={'column'} spacing={3}>
                <VnentrLonCmListViewTable
                  tableData={tableData}
                  onClickInputInfo={moveRegistrationView}
                  onClickDetailedInfo={moveDetailView}
                />
                <Stack alignItems={'center'}>
                  {tableData.length < 1 && <NoResult msg={'등록된 보완요청이 없습니다.'} />}
                  <Pagination
                    page={page}
                    count={pageCount}
                    onChange={handlePageChange}
                    variant="outlined"
                    shape="rounded"
                    renderItem={(item) => (
                      <PaginationItem
                        {...item}
                        sx={{
                          color: theme.palette.primary.main,
                          '&.Mui-selected': {
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.text.contrastText,
                            '&:hover': {
                              backgroundColor: theme.palette.primary.light
                            }
                          },
                          '&.MuiPaginationItem-previousNext': {
                            color: theme.palette.primary.main
                          }
                        }}
                      />
                    )}
                    sx={{ backgroundColor: theme.palette.background.white }}
                  />
                </Stack>
              </Stack>
            </Paper>
          </Stack>
        </Container>
      </VnentrLonCmWrapper>
    </>
  )
}

export default VnentrLonCmListView
