import RefreshIcon from '@mui/icons-material/Refresh'
import { Box, IconButton, PaginationItem, Stack, useTheme } from '@mui/material'
import { grey } from '@mui/material/colors'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

/**
 * @typedef {object} TableRowData
 * @property {number} rnum
 * @property {string} etnm
 * @property {string} bzn
 * @property {string} invmEnprNm
 * @property {string} rgsnTs
 * @property {'대출 접수(기업)'|'보완 요청(기업)'|'보완 자료 제출(기업)'|'심사중'|'대출 승인'|'대출 거절'} recomendSttusCmNm
 */

/**
 * @typedef {object} Props
 * @property {Array<TableRowData>} tableData
 */

/**
 * @param {Props} props
 *
 */
const CmListViewTable = (props) => {
  const { tableData, onClickRow } = props
  const theme = useTheme()

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
    <>
      <TableContainer component={Paper} sx={{ borderRadius: 0, boxShadow: 'none' }}>
        <Table sx={{ minWidth: 650 }} aria-label="cmListTable">
          <TableHead
            sx={{
              borderTop: `1px solid ${theme.palette.secondary.main}`,
              backgroundColor: theme.palette.lightBlueGrey.main
            }}
          >
            <TableRow>
              <TableCell align="center">no</TableCell>
              <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                회사명
              </TableCell>
              <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                사업자번호
              </TableCell>
              <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                추천투자기관
              </TableCell>
              <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                재무 담당자명
              </TableCell>
              <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                재무 담당자 연락처
              </TableCell>
              <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                추천일
              </TableCell>
              <TableCell align="center" sx={{ borderLeft: `1px solid ${grey[300]}` }}>
                상태
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((rowData) => {
              return (
                <TableRow
                  key={rowData.rnum}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#eee',
                      cursor: 'pointer'
                    }
                  }}
                  onClick={() => {
                    onClickRow(rowData)
                  }}
                >
                  <TableCell align="center" component="th" scope="row">
                    {rowData.rnum}
                  </TableCell>
                  <TableCell align="center" component="th" scope="row">
                    {rowData.etnm}
                  </TableCell>
                  <TableCell align="center" component="th" scope="row">
                    {formatBzn(rowData.bzn)}
                  </TableCell>
                  <TableCell align="center" component="th" scope="row">
                    {rowData.invmEnprNm}
                  </TableCell>
                  <TableCell align="center" component="th" scope="row">
                    {rowData.rsprNm}
                  </TableCell>
                  <TableCell align="center" component="th" scope="row">
                    {rowData.rsprCnplTpn}
                  </TableCell>
                  <TableCell align="center" component="th" scope="row">
                    {formatDate(rowData.rgsnTs.substring(0, 8))}
                  </TableCell>
                  <TableCell align="center" component="th" scope="row" sx={{ color: theme.palette.warning.main }}>
                    {rowData.recomendSttusCmNm}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default CmListViewTable
