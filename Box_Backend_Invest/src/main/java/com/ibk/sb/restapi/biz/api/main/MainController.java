package com.ibk.sb.restapi.biz.api.main;

import com.ibk.sb.restapi.app.common.constant.ComCode;
import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.biz.service.audit.InvestAuditService;
import com.ibk.sb.restapi.biz.service.audit.vo.InvestAuditApplyVO;
import com.ibk.sb.restapi.biz.service.banner.BannerService;
import com.ibk.sb.restapi.biz.service.admin.vo.BannerVO;
import com.ibk.sb.restapi.app.common.vo.PageVO;
import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.biz.service.common.CommonService;
import com.ibk.sb.restapi.biz.service.common.vo.InvestFieldVO;
import com.ibk.sb.restapi.biz.service.company.CompanyService;
import com.ibk.sb.restapi.biz.service.company.vo.base.CompanyFavoriteVO;
import com.ibk.sb.restapi.biz.service.company.vo.summary.CompanySummaryVO;
import com.ibk.sb.restapi.biz.service.company.vo.summary.RecentCompanyVO;
import com.ibk.sb.restapi.biz.service.company.vo.request.RequestSearchCompanyVO;
import com.ibk.sb.restapi.biz.service.vc.VentureCapitalService;
import com.ibk.sb.restapi.biz.service.vc.vo.portfolio.PortfolioFundAmountVO;
import com.ibk.sb.restapi.biz.service.vc.vo.summary.VcPageSummaryVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@Api(tags = {"투자박스 메인화면 API"})
@RestController
@Slf4j
@RequestMapping(path = {"/api/main", "/api/iv/v1/main"}, produces = {MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class MainController {

    private final CommonService commonService;

    private final InvestAuditService auditService;

    private final BannerService bannerService;

    private final CompanyService companyService;

    private final VentureCapitalService vcService;


    /** ================================ Get Method Mapping ================================ **/

    @ApiOperation(value = "상단 배너 목록 조회")
    @GetMapping("/banner/top")
    public ResponseData searchBannerTop() throws Exception {

        List<BannerVO> bannerList = bannerService.searchMainBannerList(ComCode.MAIN_BANNER_TOP);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(bannerList)
                .build();
    }

    @ApiOperation(value = "하단 배너 목록 조회")
    @GetMapping("/banner/bottom")
    public ResponseData searchBannerBottom() throws Exception {

        List<BannerVO> bannerList = bannerService.searchMainBannerList(ComCode.MAIN_BANNER_BOTTOM);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(bannerList)
                .build();
    }

    @ApiOperation(value = "(투자)분야 목록 조회")
    @GetMapping("/category/image/list")
    public ResponseData searchFieldImageList() throws Exception {

        List<InvestFieldVO> investFieldList = commonService.searchInvestFieldWithImageList();

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(investFieldList)
                .build();
    }

    @ApiOperation(value = "분야별 기업조회")
    @GetMapping("/company/field")
    public ResponseData searchFieldMatchCompanyList(RequestSearchCompanyVO requestSearchCompanyVO) throws Exception {

        // 필드와 페이징 정보만 제외하고 검색정보 날림
        RequestSearchCompanyVO requestVO = new RequestSearchCompanyVO();
        requestVO.setPage(requestSearchCompanyVO.getPage());
        requestVO.setRecord(requestSearchCompanyVO.getRecord());
        requestVO.setPageSize(requestSearchCompanyVO.getPageSize());
        requestVO.setInvmFildCd(requestSearchCompanyVO.getInvmFildCd());

        PagingVO<CompanySummaryVO> companyList = companyService.searchCompanyList(requestVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(companyList)
                .build();
    }

    @ApiOperation(value = "투자 유치 신청 현황 조회")
    @GetMapping("/invest/req/status")
    public ResponseData searchInvestRequestStatus() throws Exception {

        InvestAuditApplyVO applyVO = auditService.searchAuditApply();

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(applyVO)
                .build();
    }

    @ApiOperation(value = "최신 등록 기업 목록 조회")
    @GetMapping("/company/recent/list")
    public ResponseData searchRecentCompanyList(PageVO pageVO) throws Exception {

        PagingVO<RecentCompanyVO> recentCompanyList = companyService.searchRecentCompanyList(pageVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(recentCompanyList)
                .build();
    }

    @ApiOperation(value = "총 펀드금액 조회")
    @GetMapping("/vc/fund/info")
    public ResponseData searchFundAmount() throws Exception {

        PortfolioFundAmountVO fundAmountVO = vcService.searchFundAmount();

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(fundAmountVO)
                .build();
    }


    @ApiOperation(value = "투자사 전용 페이지 목록 조회")
    @GetMapping("/vc/weblink/list")
    public ResponseData searchMainVCPageList() throws Exception {

        List<VcPageSummaryVO> pageList = vcService.searchMainVCPageList();

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(pageList)
                .build();
    }

    @ApiOperation(value = "협약기관에 등록 되지않은 VC체크")
    @GetMapping(path = {"/vc/check"})
    public ResponseData searchVcUser() throws Exception {
    	
    	HashMap<String, Object> map = commonService.searchVcUserCheck();
    	
    	return ResponseData.builder()
    			.code(HttpStatus.OK.value())
    			.message(HttpStatus.OK.getReasonPhrase())
    			.data(map)
    			.build();
    }


    /** ================================ Post Method Mapping ================================ **/
    
    
    /**
     * Category: 메인화면
     * Page: 메인화면
     * 기업 즐겨찾기 수정
     * TODO : 삭제대기
     * @return
     */
//    @PostMapping("/company/favorite/save")
//    public ResponseData saveCompanyFavorite(@RequestBody CompanyFavoriteVO companyFavoriteVO) throws Exception {
//
//        companyService.saveFavoriteCompany(companyFavoriteVO);
//
//        return ResponseData.builder()
//                .code(HttpStatus.OK.value())
//                .message(HttpStatus.OK.getReasonPhrase())
//                .build();
//    }

}
