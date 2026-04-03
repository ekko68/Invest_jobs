package com.ibk.sb.restapi.app.common.util.excel;

import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.ContentDisposition;
import org.springframework.http.MediaType;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletResponse;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.Map;

@Slf4j
public class ExcelFileUtil {

    /** Excel Module은 복잡도가 있어 기존 File Util에서 분리하여 Package 구성함 */

    /**
     * 엑셀 파일 구성 및 다운로드
     * @param excelFormVO
     * @param response
     * @throws Exception
     */
    public static void excelDownload(ExcelFormVO excelFormVO, HttpServletResponse response) throws Exception {

        String fileName = StringUtils.hasLength(excelFormVO.getTitle()) ? excelFormVO.getTitle() + ".xlsx" : "통합문서.xlsx";

        // 파일 헤더 세팅
        response.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;");
//        response.setHeader("Content-Type", MediaType.APPLICATION_OCTET_STREAM_VALUE);
//        response.setHeader("Content-Disposition", "attachment; filename*=utf-8\"" + URLEncoder.encode(fileName, "UTF-8") + "\"");
        response.setHeader("Content-Disposition", "attachment; filename=\"" + new String(fileName.getBytes(StandardCharsets.UTF_8), StandardCharsets.ISO_8859_1) + "\"");
//        ContentDisposition contentDisposition = ContentDisposition.attachment().filename(fileName, StandardCharsets.UTF_8).build();
        response.setHeader("Content-Transfer-Encoding", "binary");
        response.setHeader("Pragma", "no-cache;");
        response.setHeader("Expires", "-1;");

        // 파일 다운로드 CORS 처리를 위한 헤더 세팅
        response.setHeader("Access-Control-Allow-Origin", "*");

        // try-with-resource
        try (Workbook workbook = new XSSFWorkbook();
             OutputStream outputStream = response.getOutputStream();) {
            // 엑셀 시트 생성 : title
            Sheet sheet = workbook.createSheet(StringUtils.hasLength(excelFormVO.getTitle()) ? excelFormVO.getTitle() : "sheet1");

            // 현재 엑셀 로우넘 커서
            int rowNum = 0;

            if (excelFormVO.getColumnList() != null && excelFormVO.getColumnList().size() > 0 && excelFormVO.getRowList() != null) {

                /** 테이블 헤더 타이틀 생성 */
                if (excelFormVO.getHeaderTitle() != null) {
                    if (StringUtils.hasLength(excelFormVO.getHeaderTitle())) {
                        // 셀 스타일
                        CellStyle titleCellStyle = workbook.createCellStyle();

                        // 폰트 설정
                        Font font = workbook.createFont();
                        font.setBold(true);
                        titleCellStyle.setFont(font);

                        // 정렬 설정
                        titleCellStyle.setAlignment(HorizontalAlignment.CENTER);

                        // 셀병합
                        if (excelFormVO.getColumnList().size() > 1) {
                            sheet.addMergedRegion(new CellRangeAddress(rowNum, rowNum, 0, excelFormVO.getColumnList().size() - 1));
                        }

                        // 타이틀 세팅
                        Row titleHeader = sheet.createRow(rowNum++);
                        Cell titleHeaderCell = titleHeader.createCell(0);

                        titleHeaderCell.setCellStyle(titleCellStyle);
                        titleHeaderCell.setCellValue(excelFormVO.getHeaderTitle());
                    }
                }

                /** 테이블 헤더 컬럼 생성 */
                Row header = sheet.createRow(rowNum++);

                // 컬럼 헤더 스타일
                CellStyle columnHeaderStyle = workbook.createCellStyle();
                columnHeaderStyle.setAlignment(HorizontalAlignment.CENTER);

                int colCnt = 0;
                for (String colKey : excelFormVO.getColumnList()) {

                    // 컬럼 너비 추가 설정
                    if (excelFormVO.getAddWidthMap() != null) sheet.setColumnWidth(colCnt, sheet.getColumnWidth(colCnt) + excelFormVO.getAddWidthMap().get(colKey));

                    // Cell 생성
                    Cell columnHeaderCell = header.createCell(colCnt);
                    columnHeaderCell.setCellStyle(columnHeaderStyle);

                    // 테이블 컬러명 매핑 정보가 있을 경우 헤더명 세팅
                    // 해당 컬러명 맵은 설정 컬럼명이 없을 경우 필드변수명이 디폴트로 들어가도록 설정되어있음
                    if (excelFormVO.getColNmMap() != null) columnHeaderCell.setCellValue(excelFormVO.getColNmMap().get(colKey));
                    else columnHeaderCell.setCellValue(colKey);

                    colCnt++;
                }


                /** 테이블 로우정보 작성 */

                // 기본 데이터 셀 스타일
                CellStyle dataCellStyle = workbook.createCellStyle();
                dataCellStyle.setAlignment(HorizontalAlignment.CENTER);

                CellStyle dataNumberCellStyle = workbook.createCellStyle();
                dataNumberCellStyle.setAlignment(HorizontalAlignment.RIGHT);

                for (Map<String, Object> item : excelFormVO.getRowList()) {
                    Row row = sheet.createRow(rowNum++);

                    // 각 컬럼 key를 기준으로 정보 추출
                    // poi 라이브러리 처리 가능 오브젝트 타입으로 세팅 -> 해당 객체 타입이 아닐 경우 "입력불가능한타입"로 데이터 세팅
                    colCnt = 0;
                    for (String colKey : excelFormVO.getColumnList()) {
                        // Cell 생성
                        Cell dataCell = row.createCell(colCnt);

                        // null일 경우 공백 텍스트 삽입
                        if (item.get(colKey) == null) {
                            dataCell.setCellValue("");
                        }

                        // 기본 가운데 정렬
                        else if (item.get(colKey) instanceof String) {
                            dataCell.setCellStyle(dataCellStyle);
                            dataCell.setCellValue((String) item.get(colKey));
                        } else if (item.get(colKey) instanceof Boolean) {
                            dataCell.setCellStyle(dataCellStyle);
                            dataCell.setCellValue((Boolean) item.get(colKey));
                        }

                        // java.sql 날짜 관련 처리
                        // Date instanceof 체크를 먼저할 경우 상속관계로 그쪽으로 빠져버림 주의
                        else if(item.get(colKey) instanceof java.sql.Timestamp) {
                            dataCell.setCellStyle(dataCellStyle);
                            dataCell.setCellValue(
                                    ((java.sql.Timestamp) item.get(colKey)).toLocalDateTime().format(DateTimeFormatter.ISO_DATE_TIME).toString()
                            );
                        }
                        else if(item.get(colKey) instanceof java.sql.Date) {
                            dataCell.setCellStyle(dataCellStyle);
                            dataCell.setCellValue(
                                    ((java.sql.Date) item.get(colKey)).toLocalDate().format(DateTimeFormatter.ISO_DATE).toString()
                            );
                        }
                        else if (item.get(colKey) instanceof Date) {
                            dataCell.setCellStyle(dataCellStyle);
                            dataCell.setCellValue((Date) item.get(colKey));
                        }

                        // 숫자 오른쪽 정렬
                        // setCellValue에 Long 타입 지원은 되지 않으므로 오른쪽 정렬 + String 변환 처리
                        else if (item.get(colKey) instanceof Double) {
                            dataCell.setCellStyle(dataNumberCellStyle);
                            dataCell.setCellValue((Double) item.get(colKey));
                        } else if (item.get(colKey) instanceof Integer) {
                            dataCell.setCellStyle(dataNumberCellStyle);
                            dataCell.setCellValue((Integer) item.get(colKey));
                        } else if (item.get(colKey) instanceof Long) {
                            dataCell.setCellStyle(dataNumberCellStyle);
                            dataCell.setCellValue(Long.toString((Long) item.get(colKey)));
                        } else {
                            dataCell.setCellValue("입력불가능한타입");
                        }

                        // 만약 사용자 설정이 있을 경우 덮어씌움
                        if(excelFormVO.getHorizontalAlignmentMap().get(colKey) != null) {
                            CellStyle customCellStyle = workbook.createCellStyle();
                            customCellStyle.setAlignment(excelFormVO.getHorizontalAlignmentMap().get(colKey));
                            dataCell.setCellStyle(customCellStyle);
                        }


                        colCnt++;
                    }
                }

                /** 테이블 총계 Row 생성 */
                if (excelFormVO.getLastTotalRowNm() != null && excelFormVO.getLastTotalRowData() != null) {
                    if (StringUtils.hasLength(excelFormVO.getLastTotalRowNm())) {
                        // 셀 스타일
                        CellStyle lastCellTitleStyle = workbook.createCellStyle();
                        CellStyle lastCellDataStyle = workbook.createCellStyle();
                        CellStyle lastCellNumberDataStyle = workbook.createCellStyle();

                        // 폰트 설정
                        Font font = workbook.createFont();
                        font.setBold(true);
                        lastCellTitleStyle.setFont(font);
                        lastCellDataStyle.setFont(font);
                        lastCellNumberDataStyle.setFont(font);

                        // 정렬 설정
                        lastCellTitleStyle.setAlignment(HorizontalAlignment.CENTER);
                        lastCellDataStyle.setAlignment(HorizontalAlignment.CENTER);
                        lastCellNumberDataStyle.setAlignment(HorizontalAlignment.RIGHT);

                        // 총계 데이터 셀병합
                        if (excelFormVO.getColumnList().size() > 2) {
                            sheet.addMergedRegion(new CellRangeAddress(rowNum, rowNum, 1, excelFormVO.getColumnList().size() - 1));
                        }

                        // 타이틀 세팅
                        Row lastRow = sheet.createRow(rowNum++);
                        Cell lastRowTitle = lastRow.createCell(0);
                        Cell lastRowData = lastRow.createCell(1);

                        lastRowTitle.setCellStyle(lastCellTitleStyle);
                        lastRowTitle.setCellValue(excelFormVO.getLastTotalRowNm());

                        // 기본 가운데 정렬
                        if (excelFormVO.getLastTotalRowData() instanceof String) {
                            lastRowData.setCellStyle(lastCellDataStyle);
                            lastRowData.setCellValue((String) excelFormVO.getLastTotalRowData());
                        } else if (excelFormVO.getLastTotalRowData() instanceof Boolean) {
                            lastRowData.setCellStyle(lastCellDataStyle);
                            lastRowData.setCellValue((Boolean) excelFormVO.getLastTotalRowData());
                        } else if (excelFormVO.getLastTotalRowData() instanceof Date) {
                            lastRowData.setCellStyle(lastCellDataStyle);
                            lastRowData.setCellValue((Date) excelFormVO.getLastTotalRowData());
                        }

                        // 숫자 오른쪽 정렬
                        // setCellValue에 Long 타입 지원은 되지 않으므로 오른쪽 정렬 + String 변환 처리
                        else if (excelFormVO.getLastTotalRowData() instanceof Double) {
                            lastRowData.setCellStyle(lastCellNumberDataStyle);
                            lastRowData.setCellValue((Double) excelFormVO.getLastTotalRowData());
                        } else if (excelFormVO.getLastTotalRowData() instanceof Integer) {
                            lastRowData.setCellStyle(lastCellNumberDataStyle);
                            lastRowData.setCellValue((Integer) excelFormVO.getLastTotalRowData());
                        } else if (excelFormVO.getLastTotalRowData() instanceof Long) {
                            lastRowData.setCellStyle(lastCellNumberDataStyle);
                            lastRowData.setCellValue(Long.toString((Long) excelFormVO.getLastTotalRowData()));
                        } else {
                            lastRowData.setCellValue("데이터 없음");
                        }
                    }
                }

                // 엑셀 구성 및 다운로드
                workbook.write(outputStream);
            }
        }
    }
}
