package com.ibk.sb.restapi.biz.api.admin;

import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.biz.service.admin.AdminCompanyService;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestListBodyAdminVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestSearchEtcVO;
import com.ibk.sb.restapi.biz.service.company.CompanyService;
import com.ibk.sb.restapi.biz.service.company.vo.base.CompanyBasicVO;
import com.ibk.sb.restapi.biz.service.company.vo.request.RequestSearchCompanyVO;
import com.ibk.sb.restapi.biz.service.company.vo.summary.CompanySummaryVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@Api(tags = {"운영자 포탈 - 추천기업관리 API"})
@Slf4j
@RestController
@RequestMapping(path = {"/api/admin/company", "/api/iv/v1/admin/company"}, produces={MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class AdminCompanyController {

    private final AdminCompanyService service;
    private final CompanyService companyService;
    @ApiOperation(value = "운영자 포탈 - 기업 목록 조회")
    @GetMapping("/list")
//    public ResponseData searchCompanyList(RequestRcmdCompanySearchVO requestRcmdCompanySearchVO) throws Exception {
    public ResponseData searchCompanyList(RequestSearchCompanyVO requestSearchCompanyVO) throws Exception {

//        PagingVO<CompanySummaryVO> list = service.searchCompanyList(requestRcmdCompanySearchVO);
        PagingVO<CompanySummaryVO> list = service.searchCompanyList(requestSearchCompanyVO);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(list)
                .build();
    }

    @ApiOperation(value = "운영자 포탈 - 추천기업 목록 등록")
    @PostMapping("/recommend/save")
    public ResponseData saveCompanyRecommend(@RequestBody RequestListBodyAdminVO<String> requestListBodyAdminVO) throws Exception {

        service.saveCompanyRecommend(requestListBodyAdminVO);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    @ApiOperation(value = "운영자 포탈 - 추천기업 목록 삭제")
    @PostMapping("/recommend/delete")
    public ResponseData deleteCompanyRecommend(@RequestBody RequestListBodyAdminVO<String> requestListBodyAdminVO) throws Exception {

        service.deleteCompanyRecommend(requestListBodyAdminVO);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    @ApiOperation(value = "운영자 포탈 - 투자사 전환 상세 조회 간접투자 신규 추가")
    @GetMapping("/basicInfo/detail")
    public ResponseData basicInfoDetail(RequestSearchEtcVO requestSearchEtcVO) throws Exception {
//        CompanyBasicVO companyBasicVO = companyService.searchCompanyBasic();

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(null)
                .build();
    }
}
