import {
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  IconButton,
  TextField
} from '@mui/material'
import Api from 'modules/consts/Api'
import SearchIcon from '@mui/icons-material/Search'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import { createKey } from 'modules/utils/CommonUtils'
import DateUtils from 'modules/utils/DateUtils'
import QueryUtils from 'modules/utils/QueryUtils'
import { exeFunc, getFunc, setFunc } from 'modules/utils/ReactUtils'
import ResponseUtils from 'modules/utils/ResponseUtils'
import { StringUtils } from 'modules/utils/StringUtils'
import Paging from 'pageComponents/common/Paging'
import FundConfirm from 'pageComponents/ibkPrplCntr/fund/FundConfirm'
import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import NoResult from 'components/common/NoResult'

const FundPrplInfoLIstView = (props) => {
  const theme = useTheme()
  const history = useHistory()
  const commonContext = useContext(CommonContext)
  const [list, setList] = useState([])
  const pagingRef = useRef()
  const pageRef = useRef(1)
  const totalPageRef = useRef(1)
  const popupRef = useRef()
  const idRef = useRef()
  const searchInputValue = useRef()
  const [searchInput, setSearchInput] = useState(QueryUtils.getQuery(props).fundNm) // 검색

  // 리스트 조회
  const loadFundList = useCallback(
    async (pageNumber) => {
      const params = {
        utlinsttId: idRef.current,
        page: pageNumber,
        searchFundName: searchInputValue.current,
        record: 10,
        pageSize: 5
      }

      const fundListObject = await ResponseUtils.getSimpleResponse(Api.fund.fundList, params, true)
      console.log('pageRfundListObjecteload = ', fundListObject)

      if (fundListObject !== null) {
        if (fundListObject.list.length > 0) {
          fundListObject.list.map((item, i) => {
            if (item.fundPtrn === 'FNP01001') {
              item.fundPtrn = '벤처투자조합'
            } else if (item.fundPtrn === 'FNP01002') {
              item.fundPtrn = '신기술투자조합'
            } else if (item.fundPtrn === 'FNP01003') {
              item.fundPtrn = '일반 PEF'
            } else if (item.fundPtrn === 'FNP01004') {
              item.fundPtrn = '전문투자형 PEF'
            } else if (item.fundPtrn === 'FNP01005') {
              item.fundPtrn = '기타'
            }

            if (item.fundDsnc === 'BLIND') {
              item.fundDsnc = '블라인드'
            } else if (item.fundDsnc === 'PRJT') {
              item.fundDsnc = '프로젝트'
            } else {
              item.fundDsnc = '-'
            }
          })
          pageRef.current = fundListObject['page']
          totalPageRef.current = fundListObject['totalPage']
          setFunc(pagingRef, 'setPaging', fundListObject)
          setList(fundListObject['list'])
        } else {
          setList([])
        }
      }
    },
    [list]
  )

  const isMounted = useRef(false) // useEffect에서 mount 유무 동기확인을 위함

  // Enter + 검색
  const onKeyPress = (e) => {
    e.key === 'Enter' && loadFundList()
  }

  useEffect(() => {
    if (commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
      isMounted.current = true
      idRef.current = commonContext.state.user.info.groupId
      commonContext.actions.pageMountPathCheck(history, async () => {
        await loadFundList()
      })
    }
  }, [commonContext.state.user])

  // 페이징
  const onChangePage = (pageNumber) => {
    pageReload(pageNumber)
  }

  // 페이지 번호 조회
  const pageReload = async (pageNumber = 1) => {
    commonContext.actions.pageMountPathCheck(history, async () => {
      await loadFundList(pageNumber)
    })
  }

  // 상세화면 이동
  const loadDetail = (item) => {
    const pagingInfo = getFunc(pagingRef, 'getPaging')
    if (item.auditStg === 'save') {
      const url =
        ROUTER_NAMES.FUND_PRPL_INFO_STEP +
        '?utlinsttId=' +
        commonContext.state.user.info.groupId +
        '&fundId=' +
        item.fundId +
        '&page=' +
        pagingInfo.page
      history.push(url)
    } else if (item.auditStg === 'AUD01001' || item.auditStg === 'AUD01002' || item.auditStg === 'cancel') {
      const url =
        ROUTER_NAMES.FUND_PRPL_INFO_STEP_VIEW +
        '?utlinsttId=' +
        commonContext.state.user.info.groupId +
        '&fundId=' +
        item.fundId +
        '&page=' +
        pagingInfo.page
      history.push(url, { ...item })
    } else if (item.auditStg === 'AUD01003') {
      const url =
        ROUTER_NAMES.FUND_PRPL_INFO_STEP_VIEW3 +
        '?utlinsttId=' +
        commonContext.state.user.info.groupId +
        '&fundId=' +
        item.fundId +
        '&page=' +
        pagingInfo.page
      history.push(url, { ...item })
    }
  }

  return (
    <>
      <Container maxWidth="false" disableGutters sx={{ maxWidth: '1280px', px: '1.25rem' }}>
        <Stack spacing={4} direction={'column'} sx={{ py: 5 }}>
          {/* 내정보 */}
          <Stack spacing={1} alignItems={'center'}>
            <Stack direction={'row'} alignItems="flex-end" spacing={1}>
              <TextField
                placeholder={'펀드명으로 검색'}
                size="small"
                sx={{ width: '32rem' }}
                value={searchInput}
                onChange={(e) => {
                  searchInputValue.current = e.target.value
                  setSearchInput(e.target.value)
                }}
                onKeyDown={onKeyPress}
              />
              <Button
                disableElevation
                color="primary"
                variant="contained"
                onClick={() => {
                  loadFundList()
                }}
              >
                검색
              </Button>
            </Stack>
          </Stack>
          <Paper sx={{ p: 4 }}>
            <Stack direction={'column'} spacing={3}>
              <TableContainer component={Paper} sx={{ borderRadius: 0, boxShadow: 'none' }}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
                  <TableHead sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
                    <TableRow>
                      <TableCell align="center" sx={{ color: theme.palette.text.sub }}>
                        작성일
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ borderLeft: `1px solid ${theme.palette.divider}`, color: theme.palette.text.sub }}
                      >
                        펀드명
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ borderLeft: `1px solid ${theme.palette.divider}`, color: theme.palette.text.sub }}
                      >
                        펀드유형
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ borderLeft: `1px solid ${theme.palette.divider}`, color: theme.palette.text.sub }}
                      >
                        펀드구분
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ borderLeft: `1px solid ${theme.palette.divider}`, color: theme.palette.text.sub }}
                      >
                        결성목표액 (억원)
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ borderLeft: `1px solid ${theme.palette.divider}`, color: theme.palette.text.sub }}
                      >
                        상태
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ borderLeft: `1px solid ${theme.palette.divider}`, color: theme.palette.text.sub }}
                      ></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {list?.length > 0 ? (
                      list.map((item, i) => (
                        <TableRow sx={{ backgroundColor: theme.palette.background.tableOddRow }} key={createKey()}>
                          <TableCell align="center" component="th" scope="row">
                            {DateUtils.customDateFormat(item.wody, 'yyyy-MM-dd')}
                          </TableCell>
                          <TableCell
                            align="center"
                            component="th"
                            scope="row"
                            sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                          >
                            {item.fundNm}
                          </TableCell>
                          <TableCell
                            align="center"
                            component="th"
                            scope="row"
                            sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                          >
                            {item.fundPtrn}
                          </TableCell>
                          <TableCell
                            align="center"
                            component="th"
                            scope="row"
                            sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                          >
                            {item.fundDsnc}
                          </TableCell>
                          <TableCell
                            align="center"
                            component="th"
                            scope="row"
                            sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                          >
                            {StringUtils.comma(item.orgzTrgpft)}
                          </TableCell>
                          <TableCell
                            align="center"
                            component="th"
                            scope="row"
                            sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                          >
                            {(item.auditStg === 'AUD01001' && (
                              <Chip label="제출 완료" color="primary" sx={{ borderRadius: 1, width: '10rem' }} />
                            )) ||
                              (item.auditStg === 'AUD01002' && (
                                <Chip
                                  label="심사중"
                                  sx={{
                                    borderRadius: 1,
                                    width: '10rem',
                                    backgroundColor: theme.palette.inProgress.main,
                                    color: theme.palette.text.contrastText
                                  }}
                                />
                              )) ||
                              (item.auditStg === 'AUD01003' && (
                                <Chip
                                  label="심사 완료 - 수락"
                                  sx={{
                                    borderRadius: 1,
                                    width: '10rem',
                                    backgroundColor: theme.palette.info.main,
                                    color: theme.palette.text.contrastText
                                  }}
                                />
                              )) ||
                              (item.auditStg === 'AUD01004' && (
                                <Chip
                                  label="심사 완료 - 일부 수락"
                                  sx={{
                                    borderRadius: 1,
                                    width: '10rem',
                                    backgroundColor: theme.palette.info.main,
                                    color: theme.palette.text.contrastText
                                  }}
                                />
                              )) ||
                              (item.auditStg === 'AUD01005' && (
                                <Chip
                                  label="심사 완료 - 거절"
                                  sx={{
                                    borderRadius: 1,
                                    width: '10rem',
                                    backgroundColor: theme.palette.info.main,
                                    color: theme.palette.text.contrastText
                                  }}
                                />
                              )) ||
                              (item.auditStg === 'AUD01006' && (
                                <Chip
                                  label="심사 완료 - 보류"
                                  sx={{
                                    borderRadius: 1,
                                    width: '10rem',
                                    backgroundColor: theme.palette.info.main,
                                    color: theme.palette.text.contrastText
                                  }}
                                />
                              )) ||
                              (item.auditStg === 'save' && (
                                <Chip
                                  label="작성중"
                                  sx={{
                                    borderRadius: 1,
                                    width: '10rem',
                                    backgroundColor: theme.palette.inProgress.main,
                                    color: theme.palette.text.contrastText
                                  }}
                                />
                              )) ||
                              (item.auditStg === 'cancel' && (
                                <Chip
                                  label="제안 취소"
                                  sx={{
                                    borderRadius: 1,
                                    width: '10rem',
                                    backgroundColor: theme.palette.error.light,
                                    color: theme.palette.text.contrastText
                                  }}
                                />
                              ))}
                          </TableCell>
                          <TableCell
                            align="center"
                            component="th"
                            scope="row"
                            sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                          >
                            {(item.auditStg === 'save' && (
                              <Button
                                color="primary"
                                size="small"
                                variant="outlined"
                                sx={{ width: '100%' }}
                                onClick={() => loadDetail(item)}
                              >
                                계속작성
                              </Button>
                            )) ||
                              ((item.auditStg === 'AUD01001' ||
                                item.auditStg === 'AUD01002' ||
                                item.auditStg === 'cancel') && (
                                <Button
                                  color="primary"
                                  size="small"
                                  variant="outlined"
                                  sx={{ width: '100%' }}
                                  onClick={() => loadDetail(item)}
                                >
                                  상세보기
                                </Button>
                              )) ||
                              ((item.auditStg === 'AUD01003' ||
                                item.auditStg === 'AUD01004' ||
                                item.auditStg === 'AUD01005' ||
                                item.auditStg === 'AUD01006') && (
                                <Button
                                  color="primary"
                                  size="small"
                                  variant="outlined"
                                  sx={{ width: '100%' }}
                                  onClick={() => history.push(ROUTER_NAMES.FUND_PRPL_INFO_STEP_VIEW3, { ...item })}
                                >
                                  답변보기
                                </Button>
                              ))}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <td colSpan={6}>
                        <NoResult
                          msg={'아직 IBK에 제안하신 펀드가 없습니다.'}
                          style={{ marginTop: '20px', marginBottom: '20px' }}
                        />
                      </td>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <Stack alignItems={'center'}>
                <Paging ref={pagingRef} onChangePage={onChangePage} onPrev={onChangePage} onNext={onChangePage} />
              </Stack>
              <Stack spacing={1} alignItems={'center'}>
                <Stack direction={'row'} alignItems="flex-end" spacing={1}>
                  <Box flexGrow={1} />
                  <Button
                    disableElevation
                    color="primary"
                    variant="contained"
                    onClick={() => exeFunc(popupRef, 'open', '')}
                  >
                    신규 펀드 제안
                  </Button>
                  <FundConfirm ref={popupRef} theme={theme} vo={list} />
                </Stack>
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </>
  )
}

export default FundPrplInfoLIstView
