import { Chip, Paper, useTheme, TableContainer, Table, TableBody, TableRow, TableHead, TableCell } from '@mui/material'
import { createKey } from 'modules/utils/CommonUtils'
import { RecVncmloanStatus, RecVncmloanCode, VncmloanStatus, VncmloanCode } from 'modules/consts/BizConst'
import NoResult from 'components/common/NoResult'

/**
 * @typedef {object} TableRowData
 * @property {string} rgsnTs - 제출일
 * @property {string} etnm - 추천회사명
 * @property {string} businessNum - 사업자번호
 * @property {'RST01001'|'RST01002'|'RST01003'|'RST01004'|'RST02001'|'RST02002'|'RST02003'|'RST02004'|'RST02005'|'RST02006'} recomendSttus
 * 상태
 */

/**
 * @typedef {object} Props
 * @property {Array<TableRowData>} tableData
 * @property {function(TableRowData): void} onClickSupplementRequest
 */

/**
 * @param {Props} props
 *
 */
const VnentrLonSgshListViewTable = (props) => {
  const { tableData, onClickSupplementRequest } = props
  const theme = useTheme()

  /**
   * @param {TableRowData} rowData
   */
  const makeChip = (rowData) => {
    switch (rowData.recomendSttus) {
      case RecVncmloanCode.RECOMMEND_COMPLETE:
        return <ChipRecommendComplete />
      case RecVncmloanCode.REQUEST_SUPPLEMENT:
        return <ChipSupplementRequest onClickSupplementRequest={() => onClickSupplementRequest(rowData)} />
      case RecVncmloanCode.CORRECT_SUPPLEMENTARY_DATA:
        return <ChipSupplementComplete />
      case VncmloanCode.LOAN_APPROVE:
        return <ChipLoanApproval />
      case VncmloanCode.LOAN_CANCEL:
        return <ChipLoanRefusal />
      default: // 심사중
        return <ChipUnderReview />
    }
  }
  const formatBzn = (bzn) => {
    // '617-86-11111'
    if (bzn && bzn.length > 5) {
      return `${bzn.substring(0, 3)}-${bzn.substring(3, 5)}-${bzn.substring(5, bzn.length)}`
    }
    return bzn
  }
  const formatDate = (date) => {
    // 'YYYY-MM-DD'
    if (date && date.length > 6) {
      return `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, date.length)}`
    }
    return date
  }

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 0, boxShadow: 'none' }}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
        <TableHead sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
          <TableRow>
            <TableCell align="center" sx={{ color: theme.palette.text.sub }}>
              제출일
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
              상태
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData?.length > 0 ? (
            tableData.map((tableRowData, index) => {
              const isOddRow = index % 2 === 0

              return (
                <TableRow
                  sx={isOddRow ? { backgroundColor: theme.palette.background.tableOddRow } : {}}
                  key={createKey()}
                >
                  <TableCell align="center" component="th" scope="row">
                    {formatDate(tableRowData.rgsnTs.substring(0, 8))}
                  </TableCell>
                  <TableCell
                    align="center"
                    component="th"
                    scope="row"
                    sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                  >
                    {tableRowData.etnm}
                  </TableCell>
                  <TableCell
                    align="center"
                    component="th"
                    scope="row"
                    sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                  >
                    {formatBzn(tableRowData.rcmdEnprBzn)}
                  </TableCell>
                  <TableCell
                    align="center"
                    component="th"
                    scope="row"
                    sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                  >
                    {makeChip(tableRowData)}
                  </TableCell>
                </TableRow>
              )
            })
          ) : (
            <td colSpan={4}>
              <NoResult
                msg={'아직 벤처기업을 위해 제출하신 대출 추천서가 없습니다.'}
                style={{ marginTop: '20px', marginBottom: '20px' }}
              />
            </td>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

const ChipRecommendComplete = () => {
  // return <Chip label="추천 완료" color="primary" sx={{ borderRadius: 1, width: '10rem' }} />
  return <Chip label="접수 완료" color="primary" sx={{ borderRadius: 1, width: '10rem' }} />
}

const ChipSupplementRequest = ({ onClickSupplementRequest }) => {
  const theme = useTheme()
  return (
    <Chip
      label="보완 요청"
      sx={{
        borderRadius: 1,
        width: '10rem',
        backgroundColor: theme.palette.error.light,
        color: theme.palette.text.contrastText
      }}
      onClick={onClickSupplementRequest}
    />
  )
}

const ChipSupplementComplete = () => {
  const theme = useTheme()
  return (
    <Chip
      label="보완 수정 제출"
      sx={{
        borderRadius: 1,
        width: '10rem',
        backgroundColor: theme.palette.inProgress.main,
        color: theme.palette.text.contrastText
      }}
    />
  )
}
const ChipUnderReview = () => {
  const theme = useTheme()
  return (
    <Chip
      label="심사중"
      sx={{
        borderRadius: 1,
        width: '10rem',
        backgroundColor: theme.palette.inProgress.main,
        color: theme.palette.text.contrastText
      }}
    />
  )
}
const ChipLoanApproval = () => {
  const theme = useTheme()
  return (
    <Chip
      label="대출 승인"
      sx={{
        borderRadius: 1,
        width: '10rem',
        backgroundColor: theme.palette.info.main,
        color: theme.palette.text.contrastText
      }}
    />
  )
}

const ChipLoanRefusal = () => {
  const theme = useTheme()
  return (
    <Chip
      label="대출 거절"
      sx={{
        borderRadius: 1,
        width: '10rem',
        backgroundColor: theme.palette.info.main,
        color: theme.palette.text.contrastText
      }}
    />
  )
}

export default VnentrLonSgshListViewTable
