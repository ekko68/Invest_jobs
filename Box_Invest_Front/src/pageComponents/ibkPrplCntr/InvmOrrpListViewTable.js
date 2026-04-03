import {
  Button,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme
} from '@mui/material'
import { createKey } from 'modules/utils/CommonUtils'

/**
 * @typedef {object} TableRowData
 * @property {string} rptDsnc
 * @property {string} lada
 * @property {string} fileNm
 * @property {string} fileId
 */

/**
 * @typedef {object} Props
 * @property {Array<TableRowData>} tableData
 * @property {function(TableRowData): void} onClickModify
 */

/**
 * @param {Props} props
 *
 */
const InvmOrrpListViewTable = (props) => {
  const { tableData, onClickFileName, onClickModify } = props
  const theme = useTheme()

  return (
    <>
      <TableContainer component={Paper} sx={{ borderRadius: 0, boxShadow: 'none' }}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
          <TableHead
            sx={{
              borderTop: `2px solid ${theme.palette.primary.main}`
            }}
          >
            <TableRow>
              <TableCell align="center" sx={{ color: theme.palette.text.sub }}>
                구분
              </TableCell>
              <TableCell align="center" sx={{ color: theme.palette.text.sub }}>
                최종 제출일
              </TableCell>
              <TableCell align="center" sx={{ color: theme.palette.text.sub }}>
                파일명
              </TableCell>
              <TableCell align="center" sx={{ color: theme.palette.text.sub }}>
                수정
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData &&
              tableData.map((tableRow, index) => {
                return (
                  <TableRow key={createKey()} sx={{ backgroundColor: theme.palette.background.tableOddRow }}>
                    <TableCell align="center" component="th" scope="row">
                      {tableRow.rptDsnc}
                    </TableCell>
                    <TableCell align="center" component="th" scope="row">
                      {tableRow.lada}
                    </TableCell>
                    <TableCell align="center" component="th" scope="row">
                      <Typography
                        sx={{ color: theme.palette.primary.main, textDecoration: 'underline', cursor: 'pointer' }}
                        onClick={() => {
                          onClickFileName(tableRow)
                        }}
                      >
                        {tableRow.fileNm}
                      </Typography>
                    </TableCell>
                    <TableCell align="center" component="th" scope="row">
                      <Button
                        variant="outlined"
                        disableElevation
                        onClick={() => {
                          onClickModify(tableRow)
                        }}
                      >
                        수정
                      </Button>
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

export default InvmOrrpListViewTable
