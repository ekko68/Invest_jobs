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
  TextField,
  useTheme
} from '@mui/material'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import { BtaSelect_copy } from 'components/bt/BtSelect/BtaSelect_copy'
import NoResult from 'components/common/NoResult'
import Api from 'modules/consts/Api'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import { CommonContext } from 'modules/contexts/common/CommomContext'
import { createKey } from 'modules/utils/CommonUtils'
import DateUtils from 'modules/utils/DateUtils'
import QueryUtils from 'modules/utils/QueryUtils'
import { getFunc, setFunc } from 'modules/utils/ReactUtils'
import ResponseUtils from 'modules/utils/ResponseUtils'
import { StringUtils } from 'modules/utils/StringUtils'
import Paging from 'pageComponents/common/Paging'
import { useContext, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'

// import Grid from '@mui/material/Unstable_Grid2';

const PrplCmListView = (props) => {
  const theme = useTheme()
  const history = useHistory()
  const [list, setList] = useState([])
  const pagingRef = useRef()
  const pageRef = useRef(1)
  const totalPageRef = useRef(1)
  const searchInputValue = useRef()
  const [selectList, setSelectList] = useState({
    active: 'cmpnNm'
  })
  const [searchInput, setSearchInput] = useState(QueryUtils.getQuery(props).fundNm) // 검색
  const isMounted = useRef(false) // useEffect에서 mount 유무 동기확인을 위함
  //commonContext의 현재값 반환
  const commonContext = useContext(CommonContext)

  //투자기업 목록 가져오는 함수
  const prplCmList = async (pageNumber) => {
    //api 호출 파라미터
    const params = {
      page: pageNumber,
      cmpnNm: selectList.active === 'cmpnNm' ? searchInputValue.current : '',
      bizNum: selectList.active === 'bizNum' ? searchInputValue.current : '',
      record: 10,
      pageSize: 5
    }

    //api 호출 및 데이터 업데이트
    const prplCmListObject = await ResponseUtils.getSimpleResponse(Api.ibkPrplCntr.prplCmList, params, true)

    if (prplCmListObject) {
      pageRef.current = prplCmListObject['page'] //페이지
      totalPageRef.current = prplCmListObject['totalPage'] //총 페이지
      setFunc(pagingRef, 'setPaging', prplCmListObject) //페이징 업데이트
      setList(prplCmListObject['list']) //목록 상태 업데이트
    }
  }
  // Enter + 검색
  const onKeyPress = (e) => {
    e.key === 'Enter' && prplCmList()
  }

  const onChangePage = (pageNumber) => {
    commonContext.actions.pageMountPathCheck(history, async () => {
      await prplCmList(pageNumber)
    })
  }

  //상세페이지 이동 함수
  const onClickDetail = (item) => {
    //현재 페이지 가져옴
    const pagingInfo = getFunc(pagingRef, 'getPaging')
    //상세페이지 url 생성
    const url = ROUTER_NAMES.PRPL_CM_DETAIL_VIEW + '?rcmdId=' + item['rcmdId'] + '&page=' + pagingInfo.page
    //url 적용후 이동
    history.push(url)
  }

  useEffect(() => {
    if (commonContext.state.user.isLoaded && !commonContext.state.user.isPageMountCheck && !isMounted.current) {
      isMounted.current = true

      commonContext.actions.pageMountPathCheck(history, async () => {
        await prplCmList()
      })
    }
  }, [commonContext.state.user])

  return (
    <>
      <Container maxWidth="false" disableGutters sx={{ maxWidth: '1280px', px: '1.25rem' }}>
        <Stack spacing={4} direction={'column'} sx={{ py: 5 }}>
          {/* 내정보 */}
          <Stack spacing={1} alignItems={'center'}>
            <Stack direction={'row'} alignItems="flex-end" spacing={1}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <BtaSelect_copy
                  poHandleChange={(selected) => {
                    setSelectList((pre) => ({
                      ...pre,
                      active: selected
                    }))
                  }}
                  defaultValue="cmpnNm"
                >
                  <MenuItem value="cmpnNm">회사명</MenuItem>
                  <MenuItem value="bizNum">사업자번호</MenuItem>
                </BtaSelect_copy>
              </FormControl>
              <TextField
                placeholder={''}
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
                  prplCmList()
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
                        추천회사명
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ borderLeft: `1px solid ${theme.palette.divider}`, color: theme.palette.text.sub }}
                      >
                        사업자번호
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ borderLeft: `1px solid ${theme.palette.divider}`, color: theme.palette.text.sub }}
                      >
                        주요사업
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{ borderLeft: `1px solid ${theme.palette.divider}`, color: theme.palette.text.sub }}
                      >
                        상태
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {list?.length > 0 ? (
                      list.map((item, i) => (
                        <TableRow
                          key={createKey()}
                          sx={{
                            '&:hover': {
                              backgroundColor: '#eee',
                              cursor: 'pointer'
                            }
                          }}
                          onClick={() => onClickDetail(item)}
                        >
                          <TableCell align="center" component="th" scope="row">
                            {DateUtils.customDateFormat(item['rgsnTs'], 'yyyy-MM-dd')}
                          </TableCell>
                          <TableCell
                            align="center"
                            component="th"
                            scope="row"
                            sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                          >
                            {item.rcmdEnprNm}
                          </TableCell>
                          <TableCell
                            align="center"
                            component="th"
                            scope="row"
                            sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                          >
                            {StringUtils.bizNum(item.rcmdEnprBzn)}
                          </TableCell>
                          <TableCell
                            align="center"
                            component="th"
                            scope="row"
                            sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                          >
                            {item.mainBiz}
                          </TableCell>
                          {item.sbmsStts === 'Y' && (
                            <TableCell
                              align="center"
                              component="th"
                              scope="row"
                              sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                            >
                              <Chip label="제출 완료" color="primary" sx={{ borderRadius: 1, width: '10rem' }} />
                            </TableCell>
                          )}
                          {item.sbmsStts === 'N' && (
                            <TableCell
                              align="center"
                              component="th"
                              scope="row"
                              sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                            >
                              <Chip
                                label="추천 취소"
                                sx={{
                                  borderRadius: 1,
                                  width: '10rem',
                                  backgroundColor: theme.palette.error.light,
                                  color: theme.palette.text.contrastText
                                }}
                              />
                            </TableCell>
                          )}
                        </TableRow>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5}>
                          <NoResult
                            msg={'등록된 추천기업이 없습니다.'}
                            style={{ marginTop: '40px', marginBottom: '40px' }}
                          />
                        </td>
                      </tr>
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
                    onClick={() => history.push(ROUTER_NAMES.PRPL_CM_WRITE_VIEW)}
                  >
                    투자기업 추천
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </>
  )
}

export default PrplCmListView
