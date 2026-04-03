package com.ibk.sb.restapi.biz.api.admin;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

import com.ibk.sb.restapi.app.common.vo.PostSimpleBodyVO;
import com.ibk.sb.restapi.biz.service.audit.InvestAuditService;
import com.ibk.sb.restapi.biz.service.audit.vo.InvestAuditVO;
import com.ibk.sb.restapi.biz.service.common.vo.ComFileInfoVO;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ibk.sb.restapi.app.common.vo.BadgePagingVO;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.biz.service.admin.AdminAuditService;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminInvestAuditDetailVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminInvestAuditPageVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminInvestAuditSummaryVO;
import com.ibk.sb.restapi.biz.service.audit.vo.InvestAuditSummaryVO;
import com.ibk.sb.restapi.biz.service.audit.vo.RequestSearchInvestAuditPageVO;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;

@Api(tags = {"운영자 포탈 - 투자희망신청현황"})
@RestController
@RequestMapping(path = {"/api/admin/audit", "/api/iv/v1/admin/audit"}, produces={MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class AdminAuditController {

    private final AdminAuditService adminAuditService;

    /** ================================ Get Method Mapping ================================ **/
    /**
     * (운영자) 투자심사요청 목록 조회
     * @param adminInvestAuditPageVO
     * @return
     */
    @ApiOperation(value = "(운영자) 투자희망신청현황 목록 조회")
    @GetMapping("/list")
    public ResponseData adminAuditList(AdminInvestAuditPageVO adminInvestAuditPageVO) throws Exception{

        BadgePagingVO<AdminInvestAuditSummaryVO> requestList = adminAuditService.searchAdminAuditList(adminInvestAuditPageVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(requestList)
                .build();
    }

    /**
     * (운영자) 투자심사요청 상세 조회
     * @param invmExntRqstId
     * @return
     */
    @ApiOperation(value = "(운영자) 투자심사요청 상세 조회")
    @GetMapping("/detail/{id}")
    public ResponseData adminAuditDetail(@PathVariable("id") String invmExntRqstId) throws Exception{

        AdminInvestAuditDetailVO resultList = adminAuditService.searchAdminAuditDetail(invmExntRqstId);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(resultList)
                .build();
    }


    /** ================================ Post Method Mapping ================================ **/
    /**
     *
     * @param adminInvestAuditPageVO
     * @param response
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "투자심사요청 내역 엑셀 다운로드")
    @PostMapping("/excel/list")
    public ResponseData adminAuditListExcelDownload(@RequestBody AdminInvestAuditPageVO adminInvestAuditPageVO, HttpServletResponse response) throws Exception {
        adminAuditService.excelDownloadAuditAdmin(adminInvestAuditPageVO, response);

        return null;
    }

    /**
     *
     * @param adminInvestAuditPageVO
     * @param response
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "투자심사요청 세부내용 엑셀 다운로드")
    @PostMapping("/excel/detail")
    public ResponseData adminAuditDeatilExcelDownload(@RequestBody AdminInvestAuditPageVO adminInvestAuditPageVO, HttpServletResponse response) throws Exception {
        adminAuditService.excelDownloadAuditDetailAdmin(adminInvestAuditPageVO, response);

        return null;
    }

    /**
     *
     * @param comFileInfoVO
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "선택 파일 zip 다운로드")
    @PostMapping("/file/download")
    public ResponseData selectFileDownload(@RequestBody List<ComFileInfoVO> comFileInfoVO) throws Exception {
        String result = adminAuditService.selectZipFileDownload(comFileInfoVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    /**
     *
     * @param investAuditVO
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "추천직원 및 영업점 수정")
    @PostMapping("/recommend/save")
    public ResponseData updateRecommendData(@RequestBody InvestAuditVO investAuditVO) throws Exception {
        adminAuditService.updateRecommendAudit(investAuditVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    /**
     * @param investAuditVO
     * @return
     */
    @ApiOperation(value = "투자심사 진행")
    @PostMapping("/evaluate/progress")
    public ResponseData progressEvaluating(@RequestBody InvestAuditVO investAuditVO) throws Exception {
        adminAuditService.adminProgressEvaluating(investAuditVO.getInvmExntRqstId());

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    /**
     *
     * @param adminInvestAuditDetailVO
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "심사결과 등록 및 수정")
    @PostMapping("/result/update")
    public ResponseData updateAuditResult(@RequestBody AdminInvestAuditDetailVO adminInvestAuditDetailVO) throws Exception {
        adminAuditService.adminProgressUpdateAudit(adminInvestAuditDetailVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }
}
