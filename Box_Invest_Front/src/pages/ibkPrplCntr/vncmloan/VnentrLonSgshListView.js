import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom'

import { Box, Button, Container, Paper, Stack, useTheme, Pagination, PaginationItem } from '@mui/material'

import PopupConfirm from 'components/popups/PopupConfirm'
import PopupFooter from 'components/popups/PopupFooter'

import VnentrLonSgshListViewTable from 'pageComponents/ibkPrplCntr/vncmloan/VnentrLonSgshListViewTable'

import ROUTER_NAMES from 'modules/consts/RouterConst'
import Api from 'modules/consts/Api'
import CommonAxios, { getConfig } from 'modules/utils/CommonAxios'
import { CommonContext } from 'modules/contexts/common/CommomContext'

const VnentrLonSgshListView = () => {
  const theme = useTheme()
  const history = useHistory()
  const commonContext = useContext(CommonContext)

  const sizePerPage = 10
  const [isPopup, setIsPopup] = useState(false)
  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(10)
  const [tableData, setTableData] = useState([])
  const [selectedRowData, setSelectedRowData] = useState(null)

  const handleTableEvent = (rowData) => {
    setSelectedRowData(rowData)
    setIsPopup(true)
  }
  const onConfirmPopup = () => {
    history.push(ROUTER_NAMES.VNENTR_LON_SGSH_REG_VIEW, { data: selectedRowData })
  }

  const handlePageChange = async (event, pageNum) => {
    await getList(pageNum)
  }

  useEffect(async () => {
    if (commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck) {
      commonContext.actions.pageMountPathCheck(history, async () => {
        await getList(page)
      })
    }
  }, [commonContext.state.user])

  const getList = async (pageNum) => {
    const res = await CommonAxios(getConfig(Api.vncmloan.prplList, { page: pageNum, record: sizePerPage }), true)
    if (res?.data?.code == '200') {
      const { totalPage, list, page } = res.data.data
      setTableData(list)
      setPageCount(totalPage)
      setPage(page)
    }
  }

  return (
    <>
      {isPopup ? (
        <PopupConfirm
          handlePopup={() => {
            setIsPopup(false)
          }}
        >
          <div className="popup_content_wrap">
            <div className="text grey black">{selectedRowData.invtInsttDlivMsg || '전달받은 메세지 없음'}</div>
          </div>
          <PopupFooter>
            <div className="btn_group gap">
              <Button className={'blue'} variant="contained" onClick={() => onConfirmPopup()}>
                확인
              </Button>
            </div>
          </PopupFooter>
        </PopupConfirm>
      ) : (
        <></>
      )}

      <Container maxWidth="false" disableGutters sx={{ maxWidth: '1280px', px: '1.25rem' }}>
        <Stack spacing={4} direction={'column'} sx={{ py: 5 }}>
          <Stack spacing={1}>
            <Stack direction={'row'} alignItems="flex-end" spacing={1}>
              <Box flexGrow={1} />
              <Button
                disableElevation
                color="primary"
                variant="contained"
                onClick={() => history.push(ROUTER_NAMES.VNENTR_LON_SGSH_REG_VIEW)}
              >
                신규 대출 추천서 제출
              </Button>
            </Stack>
          </Stack>

          <Paper sx={{ p: 4 }}>
            <Stack direction={'column'} spacing={3}>
              <VnentrLonSgshListViewTable
                tableData={tableData}
                onClickSupplementRequest={(rowData) => {
                  handleTableEvent(rowData)
                }}
              />
              <Stack alignItems={'center'}>
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
    </>
  )
}

export default VnentrLonSgshListView
