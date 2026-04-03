package com.ibk.sb.restapi.biz.api.admin;
import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.app.common.vo.PostSimpleBodyVO;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.biz.service.admin.AdminVcService;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminConvertSummaryNewVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminConvertSummaryVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestBodyAdminVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestListBodyAdminVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestSearchEtcVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestVcConvertSearchVO;
import com.ibk.sb.restapi.biz.service.company.vo.invest.EtcInptItmMngmVO;
import com.ibk.sb.restapi.biz.service.company.vo.invest.FncnInfoVO;
import com.ibk.sb.restapi.biz.service.company.vo.invest.InvmCnvrsRegSaveToVcVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.util.Optional;

@Api(tags = {"운영자 포탈 - 투자사 회원관리 API"})
@RestController
@Slf4j
@RequestMapping(path = {"/api/admin/vc", "/api/iv/v1/admin/vc"}, produces={MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class AdminVcController {

    private final AdminVcService service;
    @ApiOperation(value = "운영자 포탈 - 투자사 전환 목록 조회")
    @GetMapping("/list")
    public ResponseData list(RequestVcConvertSearchVO requestVcConvertSearchVO) throws Exception {
        PagingVO<AdminConvertSummaryVO> list = service.searchVcConvertList(requestVcConvertSearchVO);
        return ResponseData.builder()
            .code(HttpStatus.OK.value())
            .message(HttpStatus.OK.getReasonPhrase())
            .data(list)
            .build();
    }
    @ApiOperation(value = "운영자 포탈 - 투자사 전환 목록 조회 간접투자 신규 추가")
    @GetMapping("/newList")
    public ResponseData newList(RequestSearchEtcVO requestSearchEtcVO) throws Exception {
        PagingVO<AdminConvertSummaryNewVO> list = service.selectVcConvertListNew(requestSearchEtcVO);
        return ResponseData.builder()
            .code(HttpStatus.OK.value())
            .message(HttpStatus.OK.getReasonPhrase())
            .data(list)
            .build();
    }

    @ApiOperation(value = "운영자 포탈 - 투자사 전환 기타 항목 목록")
    @GetMapping("/etcList")
    public ResponseData etcList(RequestSearchEtcVO requestSearchEtcVO) throws Exception {
        PagingVO<EtcInptItmMngmVO> list = service.searchVcEtcList(requestSearchEtcVO);
        return ResponseData.builder()
            .code(HttpStatus.OK.value())
            .message(HttpStatus.OK.getReasonPhrase())
            .data(list)
            .build();
    }

    @ApiOperation(value = "운영자 포탈 - 투자사 전환 상세 조회 간접투자 신규 추가")
    @GetMapping("/basicInfo/detail")
    public ResponseData basicInfoDetail(@RequestParam("id") String id ) throws Exception {
        Optional<InvmCnvrsRegSaveToVcVO> invmCnvrsRegSaveToVcVO = service.searchCompanyBasic(id);

    return ResponseData.builder()
            .code(HttpStatus.OK.value())
            .message(HttpStatus.OK.getReasonPhrase())
            .data(invmCnvrsRegSaveToVcVO)
            .build();
    }

//    @ApiOperation(value = "운영자포탈 - 투자사 전환 요청 승인")
    @ApiOperation(value = "운영자포탈 - 투자희망기업 -> 투자사 전환") // 기본 전환요청 -> 승인, 반려 일방향 프로세스에서 토글식으로 변환
    @PostMapping("/accept")
    public ResponseData convertToInvestor(@RequestBody RequestListBodyAdminVO<FncnInfoVO> requestBodyAdminVO) throws Exception {
        boolean result = service.convertToInvestor(requestBodyAdminVO);
        return ResponseData.builder()
            .code(HttpStatus.OK.value())
            .message(HttpStatus.OK.getReasonPhrase())
            .data(result)
            .build();
    }

//    @ApiOperation(value = "운영자 포탈 - 투자사 전환 요청 반려")
    @ApiOperation(value = "운영자 포탈 - 투자사 -> 투자희망기업 전환") // 기본 전환요청 -> 승인, 반려 일방향 프로세스에서 토글식으로 변환
    @PostMapping("/deny")
    public ResponseData convertToCompany(@RequestBody RequestListBodyAdminVO<FncnInfoVO> requestBodyAdminVO) throws Exception {
        boolean result = service.convertToCompany(requestBodyAdminVO);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }
    
    @ApiOperation(value = "운영자 포탈 - 투자사 -> 투자희망기업 전환") // 기본 전환요청 -> 승인, 반려 일방향 프로세스에서 토글식으로 변환
    @PostMapping("/saveFncnInfo")
    public ResponseData saveFncnInfo(@RequestBody RequestListBodyAdminVO<FncnInfoVO> requestBodyAdminVO) throws Exception {
        boolean result = service.saveFncnInfo(requestBodyAdminVO);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    @ApiOperation(value = "운영자 포탈 - 투자사 전환 목록 엑셀 다운로드")
    @PostMapping("/convert/excel/download")
    public ResponseData downloadExcelFileConvertList (@RequestBody RequestVcConvertSearchVO requestVcConvertSearchVO, HttpServletResponse response) throws Exception {
        service.convertListExcelDownload(requestVcConvertSearchVO, response);
        return null;
    }

    @ApiOperation(value = "운영자 포탈 - 전환 대상 사업자등록증 파일 다운로드")
    @PostMapping("/convert/target/license/download")
    public ResponseData downloadLicenseFile(@RequestBody PostSimpleBodyVO.SimpleIdBody simpleIdBody,
                                            HttpServletResponse response) throws Exception {
        service.licenseFileDownload(simpleIdBody.getId(), response);
        return null;
    }

    @ApiOperation(value = "운영자 포탈 - 투자사 전환 기타 항목 정보 다운로드")
    @PostMapping("/convert/excel/etc/download")
    public ResponseData downloadExcelFileEtcList (@RequestBody RequestSearchEtcVO requestSearchEtcVO,HttpServletResponse response) throws Exception {
        service.etcListExcelDownload(requestSearchEtcVO, response);
        return null;
    }

    @ApiOperation(value = "운영자 포탈 - 투자사 전환 목록 정보 다운로드")
    @PostMapping("/convert/excel/vcList/download")
    public ResponseData downloadExcelFileVcList (@RequestBody RequestSearchEtcVO requestSearchEtcVO,HttpServletResponse response) throws Exception {
        service.vcListExcelDownload(requestSearchEtcVO, response);
        return null;
    }
}
