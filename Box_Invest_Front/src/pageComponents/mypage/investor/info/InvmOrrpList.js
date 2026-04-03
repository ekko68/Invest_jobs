import React, { useState, useEffect, useCallback, useContext, useRef } from 'react'

import { FiberManualRecordOutlined, HomeOutlined } from '@mui/icons-material'
import { Button, Divider, Paper, Stack, Typography, useTheme, Pagination, PaginationItem } from '@mui/material'

import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import InvmOrrpListViewPopupRegister from 'pageComponents/ibkPrplCntr/InvmOrrpListViewPopupRegister'
import InvmOrrpListViewPopupModify from 'pageComponents/ibkPrplCntr/InvmOrrpListViewPopupModify'
import InvmOrrpListViewTable from 'pageComponents/ibkPrplCntr/InvmOrrpListViewTable'

import CommonAxios, { getPostConfig, fileDownload } from 'modules/utils/CommonAxios'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import ResponseUtils from 'modules/utils/ResponseUtils'
import Api from 'modules/consts/Api'
import { exeFunc } from 'modules/utils/ReactUtils'
import { AlertLabels } from 'modules/consts/BizConst'

const InvmOrrpList = () => {
  const theme = useTheme()
  const commonContext = useContext(CommonContext)
  const alertPopup = useRef()

  const [operationData, setOperationData] = useState([])
  const [isRegisterPopup, setIsRegisterPopup] = useState(false)
  const [isModifyPopup, setIsModifyPopup] = useState(false)
  const [modifiedOperationReport, setModifiedOperationReport] = useState(null)

  const [page, setPage] = useState(1)
  const [pageCount, setPageCount] = useState(10)

  useEffect(async () => {
    if (commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck) {
      await loadOrrpList(page)
    }
  }, [commonContext.state.user])

  const loadOrrpList = async (pageNum) => {
    const params = {
      page: pageNum,
      record: 5
    }

    const response = await ResponseUtils.getSimpleResponse(Api.my.vc.operationReportList, params, true)
    if (!response) return

    const { page, totalPage, list } = response
    setOperationData(list)
    setPageCount(totalPage)
    setPage(page)
    return true
  }

  const registerOperationReport = async (rptDsnc, file) => {
    const params = new FormData()

    params.append('reqReportList', file)
    params.append('rptDsnc', rptDsnc)
    params.append('lada', currentDate())

    const res = await CommonAxios(getPostConfig(Api.my.vc.operationReportSave, params), true)
    if (res?.data?.code == '200') {
      return true
    } else {
      exeFunc(alertPopup, 'open', AlertLabels.notSaved)
    }
  }

  const modifyOperationReport = async (modifiedOperationReport, rptDsnc, file) => {
    const params = new FormData()

    params.append('invtId', modifiedOperationReport.invtId)
    params.append('rptDsncPrev', modifiedOperationReport.rptDsnc)

    params.append('rptDsnc', rptDsnc)

    if (file.file) {
      params.append('reqReportList', file.file)
    }
    params.append('lada', currentDate())
    const res = await CommonAxios(getPostConfig(Api.my.vc.operationReportSave, params), true)
    if (res?.data?.code == '200') {
      return true
    } else {
      exeFunc(alertPopup, 'open', AlertLabels.notSaved)
    }
  }

  const download = useCallback((file) => {
    commonContext.actions.callbackAfterSessionRefresh(
      async () => {
        await fileDownload(file)
      },
      true,
      true
    )
  }, [])

  const currentDate = () => {
    let currentDate = new Date()
    const offset = currentDate.getTimezoneOffset()
    currentDate = new Date(currentDate.getTime() - offset * 60 * 1000)
    return currentDate.toISOString().split('T')[0]
  }

  const handlePageChange = async (event, pageNum) => {
    await loadOrrpList(pageNum)
  }

  return (
    <>
      <Stack spacing={1}>
        <Stack direction={'row'} alignItems="flex-end" spacing={1}>
          <Typography sx={{ fontWeight: '500', fontSize: '16px', fontFamily: 'Noto Sans KR' }} flexGrow={1}>
            투자 운용 보고서
          </Typography>
          <Button
            disableElevation
            color="primary"
            variant="contained"
            size="large"
            onClick={() => {
              setIsRegisterPopup(true)
            }}
          >
            등록하기
          </Button>
        </Stack>
        <Divider />
      </Stack>
      <Paper sx={{ p: 4 }}>
        <Stack direction={'column'} spacing={1}>
          <Stack direction={'column'} spacing={1}>
            <Typography sx={{ fontWeight: '500', fontSize: '18px', fontFamily: 'Noto Sans KR' }}>
              <FiberManualRecordOutlined color="primary" sx={{ mr: 1, fontSize: '1rem' }} />
              자산현황 신고
            </Typography>
          </Stack>
          <InvmOrrpListViewTable
            tableData={operationData}
            onClickFileName={(rowData) => download({ fileId: rowData.fileId, fileNm: rowData.fileNm })}
            onClickModify={(rowData) => {
              setModifiedOperationReport(rowData)
              setIsModifyPopup(true)
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
      {isRegisterPopup && (
        <InvmOrrpListViewPopupRegister
          onCancel={() => {
            setIsRegisterPopup(false)
          }}
          onRegister={async (rptDsnc, file) => {
            const success = await registerOperationReport(rptDsnc, file)
            if (success) {
              setIsRegisterPopup(false)
              await loadOrrpList(1)
            }
          }}
        />
      )}
      {isModifyPopup && (
        <InvmOrrpListViewPopupModify
          initSection={modifiedOperationReport.rptDsnc}
          initFile={{ fileId: modifiedOperationReport.fileId, fileNm: modifiedOperationReport.fileNm }}
          onCancel={() => {
            setIsModifyPopup(false)
          }}
          onSave={async (section, file) => {
            const success = await modifyOperationReport(modifiedOperationReport, section, file)
            if (success) {
              setIsModifyPopup(false)
              await loadOrrpList(1)
            }
          }}
        />
      )}
      <AlertPopup ref={alertPopup} />
    </>
  )
}

export default InvmOrrpList
