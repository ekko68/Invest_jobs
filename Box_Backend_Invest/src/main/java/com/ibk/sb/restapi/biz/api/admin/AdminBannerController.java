package com.ibk.sb.restapi.biz.api.admin;

import com.ibk.sb.restapi.app.common.constant.ComCode;
import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.vo.AdminUserVO;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.biz.service.admin.AdminBannerService;
import com.ibk.sb.restapi.biz.service.admin.vo.BannerVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestBodyAdminVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestListBodyAdminVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Api(tags = {"운영자 포탈 - 투자박스 배너 API"})
@RestController
@Slf4j
@RequestMapping(path = {"/api/admin/banner", "/api/iv/v1/admin/banner"}, produces={MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class AdminBannerController {

    private final AdminBannerService service;

    @ApiOperation(value = "운영자 포탈 - 배너 목록 조회 (투자 메인 상단)")
    @GetMapping("/main/top/list")
    public ResponseData mainTopList() throws Exception {
        List<BannerVO> list = service.searchBannerList(ComCode.MAIN_BANNER_TOP.getCode());
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(list)
                .build();
    }

    @ApiOperation(value = "운영자 포탈 - 배너 저장 (투자 메인 상단)")
    @PostMapping("/main/top/save")
    public ResponseData mainTopSave(@RequestBody RequestListBodyAdminVO<BannerVO> requestListBodyAdminVO) throws Exception {
        boolean result = service.saveBanner(ComCode.MAIN_BANNER_TOP, requestListBodyAdminVO);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    @ApiOperation(value = "운영자 포탈 - 배너 목록 조회 (투자 메인 하단)")
    @GetMapping("/main/bottom/list")
    public ResponseData mainBottomList() throws Exception {
        List<BannerVO> list = service.searchBannerList(ComCode.MAIN_BANNER_BOTTOM.getCode());
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(list)
                .build();
    }

    @ApiOperation(value = "운영자 포탈 - 배너 저장 (투자 메인 하단)")
    @PostMapping("/main/bottom/save")
    public ResponseData mainBottomSave(@RequestBody RequestListBodyAdminVO<BannerVO> requestListBodyAdminVO) throws Exception {
        boolean result = service.saveBanner(ComCode.MAIN_BANNER_BOTTOM, requestListBodyAdminVO);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    @ApiOperation(value = "운영자 포탈 - 배너 목록 조회 (기업정보 메인 하단)")
    @GetMapping("/company/bottom/list")
    public ResponseData companyBottomList() throws Exception {
        List<BannerVO> list = service.searchBannerList(ComCode.COMPANY_BANNER_BOTTOM.getCode());
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(list)
                .build();
    }

    @ApiOperation(value = "운영자 포탈 - 배너 저장 (기업정보 메인 하단)")
    @PostMapping("/company/bottom/save")
    public ResponseData companyBottomSave(@RequestBody RequestListBodyAdminVO<BannerVO> requestListBodyAdminVO) throws Exception {
        boolean result = service.saveBanner(ComCode.COMPANY_BANNER_BOTTOM, requestListBodyAdminVO);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    @ApiOperation(value = "운영자 포탈 - 배너 목록 조회 (마이페이지 / 기업)")
    @GetMapping("/mypage/company/list")
    public ResponseData mypageCompanyList() throws Exception {
        List<BannerVO> list = service.searchBannerList(ComCode.MYPAGE_BANNER_COMPANY.getCode());
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(list)
                .build();
    }

    @ApiOperation(value = "운영자 포탈 - 배너 저장 (마이페이지 / 기업)")
    @PostMapping("/mypage/company/save")
    public ResponseData mypageCompanySave(@RequestBody RequestListBodyAdminVO<BannerVO> requestListBodyAdminVO) throws Exception {
        boolean result = service.saveBanner(ComCode.MYPAGE_BANNER_COMPANY, requestListBodyAdminVO);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    @ApiOperation(value = "운영자 포탈 - 배너 목록 조회 (마이페이지 / 투자사)")
    @GetMapping("/mypage/vc/list")
    public ResponseData mypageVcList() throws Exception {
        List<BannerVO> list = service.searchBannerList(ComCode.MYPAGE_BANNER_VC.getCode());
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(list)
                .build();
    }

    @ApiOperation(value = "운영자 포탈 - 배너 저장 (마이페이지 / 투자사)")
    @PostMapping("/mypage/vc/save")
    public ResponseData mypageVcSave(@RequestBody RequestListBodyAdminVO<BannerVO> requestListBodyAdminVO) throws Exception {
        boolean result = service.saveBanner(ComCode.MYPAGE_BANNER_VC, requestListBodyAdminVO);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    @ApiOperation(value = "운영자 포탈 - 노출 여부 저장")
    @PostMapping("/display")
    public ResponseData updateDisplay(@RequestBody RequestBodyAdminVO<BannerVO> requestBodyAdminVO) throws Exception {
        boolean result = service.updateDisplay(requestBodyAdminVO);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }
}
