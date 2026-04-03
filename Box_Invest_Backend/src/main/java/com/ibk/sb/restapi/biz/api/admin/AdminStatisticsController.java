package com.ibk.sb.restapi.biz.api.admin;

import com.ibk.sb.restapi.app.common.constant.ComCode;
import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.biz.service.admin.AdminStatisticsService;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminStatisticsSearchVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminStatisticsVO;
import com.ibk.sb.restapi.biz.service.common.vo.VisitorCountVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;

@Api(tags = {"운영자 포탈 - 통계 API"})
@RestController
@Slf4j
@RequestMapping(path = {"/api/admin/statistics", "/api/iv/v1/admin/statistics"}, produces={MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class AdminStatisticsController {

    private final AdminStatisticsService service;

    @ApiOperation(value = "운영자 포탈 - 기간별 방문자 목록 조회")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(name = "searchFromDate", value = "조회 날짜 (from / YYYYMMDD)", dataType = "String"),
            @ApiImplicitParam(name = "searchToDate", value = "조회 날짜 (to / YYYYMMDD)", dataType = "String"),
            @ApiImplicitParam(name = "page", value = "current page number", dataType = "Integer"),
            @ApiImplicitParam(name = "record", value = "size per page", dataType = "Integer"),
            @ApiImplicitParam(name = "pageSize", value = "size of pagination", dataType = "Integer")
    })
    @GetMapping("/visitor")
    public ResponseData visitorList(AdminStatisticsSearchVO searchParams) throws Exception {
        PagingVO<VisitorCountVO> list = service.searchVisitorStatList(searchParams);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(list)
                .build();
    }

    @ApiOperation(value = "운영자 포탈 - 기간별 방문자 총계 조회")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(name = "searchFromDate", value = "조회 날짜 (from / YYYYMMDD)", dataType = "String"),
            @ApiImplicitParam(name = "searchToDate", value = "조회 날짜 (to / YYYYMMDD)", dataType = "String")
    })
    @GetMapping("/visitor/total")
    public ResponseData visitorTotal(AdminStatisticsSearchVO searchParams) throws Exception {
        int total = service.searchVisitorStatTotal(searchParams);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(total)
                .build();
    }

    @ApiOperation(value = "운영자 포탈 - 기간별 방문자 엑셀 다운로드")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(name = "searchFromDate", value = "조회 날짜 (from / YYYYMMDD)", dataType = "String"),
            @ApiImplicitParam(name = "searchToDate", value = "조회 날짜 (to / YYYYMMDD)", dataType = "String")
    })
    @GetMapping("/visitor/excel/download")
    public ResponseData visitorExcelDownload(AdminStatisticsSearchVO searchParams, HttpServletResponse response) throws Exception {
        service.visitorStatListExcelDownload(searchParams, response);
        return null;
    }

    @ApiOperation(value = "운영자 포탈 - 진행중 투자심사요청 목록 조회 / 기업 -> 투자사")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(name = "searchFromDate", value = "조회 날짜 (from / YYYYMMDD)", dataType = "String"),
            @ApiImplicitParam(name = "searchToDate", value = "조회 날짜 (to / YYYYMMDD)", dataType = "String"),
            @ApiImplicitParam(name = "page", value = "current page number", dataType = "Integer"),
            @ApiImplicitParam(name = "record", value = "size per page", dataType = "Integer"),
            @ApiImplicitParam(name = "pageSize", value = "size of pagination", dataType = "Integer")
    })
    @GetMapping("/exam/request")
    public ResponseData examRequestList(AdminStatisticsSearchVO searchParams) throws Exception {

        PagingVO<AdminStatisticsVO> list = service.searchIvExamStatList(ComCode.AUDIT_REQUEST, searchParams);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(list)
                .build();
    }

    @ApiOperation(value = "운영자 포탈 - 진행중 투자심사요청 총계")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(name = "searchFromDate", value = "조회 날짜 (from / YYYYMMDD)", dataType = "String"),
            @ApiImplicitParam(name = "searchToDate", value = "조회 날짜 (to / YYYYMMDD)", dataType = "String"),
    })
    @GetMapping("/exam/request/total")
    public ResponseData examRequestTotal(AdminStatisticsSearchVO searchParams) throws Exception {
        int total = service.searchIvExamStatTotal(ComCode.AUDIT_REQUEST, searchParams);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(total)
                .build();
    }

    @ApiOperation(value = "운영자 포탈 - 진행중 투자심사제안 목록 조회 / 투자사 -> 기업")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(name = "searchFromDate", value = "조회 날짜 (from / YYYYMMDD)", dataType = "String"),
            @ApiImplicitParam(name = "searchToDate", value = "조회 날짜 (to / YYYYMMDD)", dataType = "String"),
            @ApiImplicitParam(name = "page", value = "current page number", dataType = "Integer"),
            @ApiImplicitParam(name = "record", value = "size per page", dataType = "Integer"),
            @ApiImplicitParam(name = "pageSize", value = "size of pagination", dataType = "Integer")
    })
    @GetMapping("/exam/suggest")
    public ResponseData examSuggestList(AdminStatisticsSearchVO searchParams) throws Exception {
        PagingVO<AdminStatisticsVO> list = service.searchIvExamStatList(ComCode.AUDIT_SUGGEST, searchParams);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(list)
                .build();
    }

    @ApiOperation(value = "운영자 포탈 - 진행중 투자심사제안 총계")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(name = "searchFromDate", value = "조회 날짜 (from / YYYYMMDD)", dataType = "String"),
            @ApiImplicitParam(name = "searchToDate", value = "조회 날짜 (to / YYYYMMDD)", dataType = "String"),
    })
    @GetMapping("/exam/suggest/total")
    public ResponseData examSuggestTotal(AdminStatisticsSearchVO searchParams) throws Exception {
        int total = service.searchIvExamStatTotal(ComCode.AUDIT_SUGGEST, searchParams);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(total)
                .build();
    }

    @ApiOperation(value = "운영자 포탈 - 투자심사완료 목록 조회")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(name = "searchFromDate", value = "조회 날짜 (from / YYYYMMDD)", dataType = "String"),
            @ApiImplicitParam(name = "searchToDate", value = "조회 날짜 (to / YYYYMMDD)", dataType = "String"),
            @ApiImplicitParam(name = "page", value = "current page number", dataType = "Integer"),
            @ApiImplicitParam(name = "record", value = "size per page", dataType = "Integer"),
            @ApiImplicitParam(name = "pageSize", value = "size of pagination", dataType = "Integer")
    })
    @GetMapping("/exam/complete")
    public ResponseData examCompleteList(AdminStatisticsSearchVO searchParams) throws Exception {
        PagingVO<AdminStatisticsVO> list = service.searchIvExamStatList(ComCode.AUDIT_COMPLETE, searchParams);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(list)
                .build();
    }

    @ApiOperation(value = "운영자 포탈 - 투자심사완료 총계")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(name = "searchFromDate", value = "조회 날짜 (from / YYYYMMDD)", dataType = "String"),
            @ApiImplicitParam(name = "searchToDate", value = "조회 날짜 (to / YYYYMMDD)", dataType = "String"),
    })
    @GetMapping("/exam/complete/total")
    public ResponseData examCompleteTotal(AdminStatisticsSearchVO searchParams) throws Exception {
        int total = service.searchIvExamStatTotal(ComCode.AUDIT_COMPLETE, searchParams);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(total)
                .build();
    }

    @ApiOperation(value = "운영자 포탈 - 투자심사요청 엑셀 다운로드")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(name = "searchFromDate", value = "조회 날짜 (from / YYYYMMDD)", dataType = "String"),
            @ApiImplicitParam(name = "searchToDate", value = "조회 날짜 (to / YYYYMMDD)", dataType = "String"),
    })
    @GetMapping("/exam/request/excel/download")
    public ResponseData examRequestListExcelDownload(AdminStatisticsSearchVO searchParams, HttpServletResponse response) throws Exception {
        service.ivExamStatExcelDownload(ComCode.AUDIT_REQUEST, searchParams, response);
        return null;
    }

    @ApiOperation(value = "운영자 포탈 - 투자심사제안 엑셀 다운로드")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(name = "searchFromDate", value = "조회 날짜 (from / YYYYMMDD)", dataType = "String"),
            @ApiImplicitParam(name = "searchToDate", value = "조회 날짜 (to / YYYYMMDD)", dataType = "String"),
    })
    @GetMapping("/exam/suggest/excel/download")
    public ResponseData examSuggestListExcelDownload(AdminStatisticsSearchVO searchParams, HttpServletResponse response) throws Exception {
        service.ivExamStatExcelDownload(ComCode.AUDIT_SUGGEST, searchParams, response);
        return null;
    }

    @ApiOperation(value = "운영자 포탈 - 투자심사완료 엑셀 다운로드")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(name = "searchFromDate", value = "조회 날짜 (from / YYYYMMDD)", dataType = "String"),
            @ApiImplicitParam(name = "searchToDate", value = "조회 날짜 (to / YYYYMMDD)", dataType = "String"),
    })
    @GetMapping("/exam/complete/excel/download")
    public ResponseData examCompleteListExcelDownload(AdminStatisticsSearchVO searchParams, HttpServletResponse response) throws Exception {
        service.ivExamStatExcelDownload(ComCode.AUDIT_COMPLETE, searchParams, response);
        return null;
    }

}
