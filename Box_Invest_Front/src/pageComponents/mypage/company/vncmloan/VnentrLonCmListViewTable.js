import {
  Button,
  Paper,
  useTheme,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Typography
} from '@mui/material'
import { createKey } from 'modules/utils/CommonUtils'

import { VncmloanStatus, VncmloanCode } from 'modules/consts/BizConst'
import DateUtils from 'modules/utils/DateUtils'
import { StringUtils } from './../../../../modules/utils/StringUtils'
import { exeFunc } from 'modules/utils/ReactUtils'
import AlertPopup from 'pageComponents/common/pop/AlertPopup'
import { useRef } from 'react'

/**
 * @typedef {object} TableRowData
 * @property {string} rgsnTs
 * @property {string} invmEnprNm
 * @property {string} bzn
 * @property {'자료요청'|'대출접수'|'보완자료요청'|'보완자료제출'|'심사중'|'대출승인'|'대출거절'|'비고' } recomendSttusCmNm
 * @property {'RST01004'|'RST02001'|'RST02002'|'RST02003'|'RST02004'|'RST02005'|'RST02006'|'RST02007' } recomendSttusCm
 */

/**
 * @typedef {object} Props
 * @property {Array<TableRowData>} tableData
 * @property {function(TableRowData): void} onClickInputInfo
 * @property {function(TableRowData): void} onClickDetailedInfo
 */

/**
 * @param {Props} props
 *
 */
const VnentrLonCmListViewTable = (props) => {
  const { tableData, onClickInputInfo, onClickDetailedInfo } = props
  const theme = useTheme()
  const alertPop = useRef()

  /**
   * @param {TableRowData} tableData
   */
  const makeButton = (tableData) => {
    switch (tableData.recomendSttusCm) {
      case VncmloanCode.DATA_REQUEST:
        return buttonInputInfo(onClickInputInfo, tableData)
      default:
        return buttonDetailedInfo(onClickDetailedInfo, tableData)
    }
  }

  const alertRecomendSttusCmNm = (message) => {
    exeFunc(alertPop, 'open', message)
  }

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 0, boxShadow: 'none' }}>
      <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
        <TableHead sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
          <TableRow>
            <TableCell align="center" sx={{ color: theme.palette.text.sub }}>
              추천일
            </TableCell>
            <TableCell
              align="center"
              sx={{ borderLeft: `1px solid ${theme.palette.divider}`, color: theme.palette.text.sub }}
            >
              추천투자기관
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

            <TableCell
              align="center"
              sx={{ borderLeft: `1px solid ${theme.palette.divider}`, color: theme.palette.text.sub }}
            ></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((tableRowData, index) => {
            const isOddRow = index % 2 === 0

            return (
              <TableRow
                sx={isOddRow ? { backgroundColor: theme.palette.background.tableOddRow } : {}}
                key={createKey()}
              >
                <TableCell align="center" component="th" scope="row">
                  {DateUtils.customDateFormat(tableRowData.rgsnTs, 'yyyy-MM-dd')}
                </TableCell>
                <TableCell
                  align="center"
                  component="th"
                  scope="row"
                  sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                >
                  {tableRowData.invmEnprNm}
                </TableCell>
                <TableCell
                  align="center"
                  component="th"
                  scope="row"
                  sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                >
                  {StringUtils.bizNum(tableRowData.bzn)}
                </TableCell>
                <TableCell
                  align="center"
                  component="th"
                  scope="row"
                  sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                >
                  {/* || VncmloanStatus.DATA_REQUEST 는 임시로 넣은것 CmNm을 받아올 수 있으면 제거 */}
                  {/* {tableRowData?.recomendSttusCmNm || VncmloanStatus.DATA_REQUEST} */}
                  {(tableRowData?.recomendSttusCm === 'RST02007' && (
                    <Typography
                      onClick={() => alertRecomendSttusCmNm(tableRowData.recomendSttusCmRm)}
                      size="small"
                      sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                    >
                      {tableRowData?.recomendSttusCmNm}
                    </Typography>
                  )) ||
                    (tableRowData?.recomendSttusCm !== 'RST02007' && tableRowData?.recomendSttusCmNm)}
                </TableCell>
                <TableCell
                  align="center"
                  component="th"
                  scope="row"
                  sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}
                >
                  {makeButton(tableRowData)}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      <AlertPopup ref={alertPop} />
    </TableContainer>
  )
}

const buttonInputInfo = (onClick, dataToPass) => {
  return (
    <Button variant="contained" onClick={() => onClick(dataToPass)} disableElevation>
      정보 입력
    </Button>
  )
}

const buttonDetailedInfo = (onClick, dataToPass) => {
  return (
    <Button variant="contained" onClick={() => onClick(dataToPass)} disableElevation>
      상세 내역
    </Button>
  )
}

export default VnentrLonCmListViewTable
