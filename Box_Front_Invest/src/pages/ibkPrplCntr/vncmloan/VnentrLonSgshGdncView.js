import {
  Add,
  AddOutlined,
  ArrowForward,
  EmailOutlined,
  FiberManualRecordOutlined,
  HeadsetMicOutlined,
  HomeOutlined,
  NotificationsNoneOutlined,
  PersonOutlineOutlined,
  Remove
} from '@mui/icons-material'
import {
  Grid,
  AppBar,
  Badge,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  useTheme,
  Pagination,
  PaginationItem,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Avatar,
  TextField,
  InputAdornment
} from '@mui/material'
import { BtNavSelect } from 'components/bt/BtNavSelect'
import { BtContentGrid } from 'components/bt/BtContentGrid'
import { BtTabContext } from 'components/bt/BtTabContext'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { useHistory } from 'react-router-dom'
import ROUTER_NAMES from 'modules/consts/RouterConst'
import Header from 'components/header/Header'

// import Grid from '@mui/material/Unstable_Grid2';

const VnentrLonSgshGdncView = () => {
  const theme = useTheme()
  const history = useHistory()

  return (
    <>
      <Container maxWidth="false" disableGutters sx={{ maxWidth: '1280px', px: '1.25rem' }}>
        <Stack spacing={4} direction={'column'} sx={{ py: 5 }}>
          {/* 내정보 */}
          <Paper sx={{ p: 4 }}>
            <Stack direction={'column'} alignItems={'center'} spacing={3}>
              <Typography variant="h3">IBK 벤처대출</Typography>
              <Typography variant="body1">초기 투자를 받은 유망 스타트업에 낮은 금리로 제공하는 대출 상품</Typography>
              <Stack direction={'row'} spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => history.push(ROUTER_NAMES.VNENTR_LON_SGSH_REG_VIEW)}
                  disableElevation
                >
                  추천서 제출
                </Button>
                <Button
                  variant="contained"
                  onClick={() => history.push(ROUTER_NAMES.VNENTR_LON_SGSH_LIST_VIEW)}
                  disableElevation
                >
                  추천 내역 보기
                </Button>
              </Stack>
            </Stack>
          </Paper>
          <Paper sx={{ p: 4 }}>
            <Stack direction={'column'} spacing={3}>
              <Stack direction={'row'} alignItems={'center'} spacing={1}>
                <Typography variant="h2" sx={{ width: '12rem' }}>
                  지원대상
                </Typography>
                <Typography flexGrow={1} variant="body1">
                  「IBK벤처대출」협약 벤처투자기관이 투자하고 추천한 중소기업, 당행 직접투자기업 및 투자를 유치한 IBK
                  창공기업
                </Typography>
              </Stack>
              <Divider />
              <Stack direction={'row'} alignItems={'center'} spacing={1}>
                <Typography variant="h2" sx={{ width: '12rem' }}>
                  지원한도
                </Typography>
                <Typography flexGrow={1} variant="body1">
                  투자유치금액(2년 이내)의 일정비율 범위 이내
                  <br />
                  ① 창업 3년 이내 : 100% 이내, 최대 6억원
                  <br />
                  ② 창업 3년 이후 : 50% 이내, 최대 10억원
                  <br />
                </Typography>
              </Stack>
              <Divider />
              <Stack direction={'row'} alignItems={'center'} spacing={1}>
                <Typography variant="h2" sx={{ width: '12rem' }}>
                  자금용도
                </Typography>
                <Typography flexGrow={1} variant="body1">
                  운전자금
                </Typography>
              </Stack>
              <Divider />
              <Stack direction={'row'} alignItems={'center'} spacing={1}>
                <Typography variant="h2" sx={{ width: '12rem' }}>
                  지원방식
                </Typography>
                <Typography flexGrow={1} variant="body1">
                  일반신용대출과 신주인수권부사채(BW)의 결합방식
                </Typography>
              </Stack>
              <Divider />
              <Stack direction={'row'} alignItems={'center'} spacing={1}>
                <Typography variant="h2" sx={{ width: '12rem' }}>
                  금리
                </Typography>
                <Typography flexGrow={1} variant="body1">
                  [신용대출] 산출금리에서 최대 1.2%p 감면
                  <br />
                  [신주인수권부사채] 개별약정에 따름
                </Typography>
              </Stack>
              <Divider />
              <Stack direction={'row'} alignItems={'center'} spacing={1}>
                <Typography variant="h2" sx={{ width: '12rem' }}>
                  만기(상환방법)
                </Typography>
                <Typography flexGrow={1} variant="body1">
                  [신용대출] 6년(2년 거치 4년 분할상환)
                  <br />
                  [신주인수권부사채] 6년(만기 일시상환)/ 6년(2년 거치 4년 분할상환)
                </Typography>
              </Stack>
              <Divider />
              <Stack direction={'row'} alignItems={'center'} spacing={1}>
                <Typography variant="h2" sx={{ width: '12rem' }}>
                  BW 운용
                </Typography>
                <Typography flexGrow={1} variant="body1">
                  분리형 BW : 신주인수권부사채 만기 6년, 신주인수권 행사기간 10년
                </Typography>
              </Stack>
              <Divider />
              <Stack direction={'row'} alignItems={'center'} spacing={1}>
                <Typography variant="h2" sx={{ width: '12rem' }}>
                  BW 단가
                </Typography>
                <Typography flexGrow={1} variant="body1">
                  IBK벤처대출 실행 직전 유치한 벤처투자기관의 투자단가 반영
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </>
  )
}

export default VnentrLonSgshGdncView
