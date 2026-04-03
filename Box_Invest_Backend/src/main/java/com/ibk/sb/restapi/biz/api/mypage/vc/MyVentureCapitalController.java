package com.ibk.sb.restapi.biz.api.mypage.vc;

import com.ibk.sb.restapi.app.common.constant.ComCode;
import com.ibk.sb.restapi.app.common.vo.PostSimpleBodyVO;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.app.common.vo.PageVO;
import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminVcConvertRequestVO;
import com.ibk.sb.restapi.biz.service.banner.BannerService;
import com.ibk.sb.restapi.biz.service.admin.vo.BannerVO;
import com.ibk.sb.restapi.biz.service.company.CompanyService;
import com.ibk.sb.restapi.biz.service.company.vo.summary.CompanyRecommendVO;
import com.ibk.sb.restapi.biz.service.platform.vo.stamp.CommerceSealVO;
import com.ibk.sb.restapi.biz.service.seal.SealService;
import com.ibk.sb.restapi.biz.service.vc.VentureCapitalService;
import com.ibk.sb.restapi.biz.service.vc.vo.base.VcMemberVO;
import com.ibk.sb.restapi.biz.service.vc.vo.base.VcOperationReportVO;
import com.ibk.sb.restapi.biz.service.vc.vo.invest.VcInvestDetailVO;
import com.ibk.sb.restapi.biz.service.vc.vo.portfolio.VcPortfolioVO;
import com.ibk.sb.restapi.biz.service.vc.vo.request.RequestVcOperationReportVO;
import com.ibk.sb.restapi.biz.service.vc.vo.request.RequestVcSaveOperationReportVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@Api(tags = {"투자사 마이페이지 서비스 API"})
@RequestMapping(path = {"/api/my/vc", "/api/iv/v1/my/vc"}, produces = {MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class MyVentureCapitalController {

    private final VentureCapitalService vcService;

    private final BannerService bannerService;

    private final CompanyService companyService;

    private final SealService sealService;


    /** ================================ Get Method Mapping ================================ **/

    /**
     * Category: 마이페이지(투자사)
     * Page: 대시보드
     * 추천 기업 목록 조회
     * @return
     */
    @ApiOperation(value = "추천 기업 목록 조회")
    @GetMapping("/recommend/company/list")
    public ResponseData searchRecommendCompanyList() throws Exception {
        List<CompanyRecommendVO> recommendList = companyService.searchRecommendCompanyList();

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(recommendList)
                .build();
    }

    /**
     * Category: 마이페이지(투자사)
     * Page: 대시보드
     * 배너정보 조회
     * @return
     */
    @ApiOperation(value = "배너정보 조회")
    @GetMapping("/banner")
    public ResponseData searchBanner() throws Exception {
        List<BannerVO> bannerList = bannerService.searchMainBannerList(ComCode.MYPAGE_BANNER_VC);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(bannerList)
                .build();
    }

    /**
     * Category: 마이페이지(투자사)
     * Page: 내정보
     * 기본정보 조회
     * @return
     */
    @ApiOperation(value = "기본정보 조회")
    @GetMapping("/basic/info/detail")
    public ResponseData searchVC() throws Exception {
        VcInvestDetailVO vc = vcService.searchVC();

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(vc)
                .build();
    }

    /**
     * Category: 마이페이지(투자사)
     * Page: 내정보
     * 포트폴리오 투자 목록 조회
     * @return
     */
    @ApiOperation(value = "포트폴리오 투자 목록 조회")
    @GetMapping("/portfolio/invest/list")
    public ResponseData searchVCPortfolioList(PageVO pageVO) throws Exception {
        PagingVO<VcPortfolioVO> portfolioList = vcService.searchVCPortfolioList(pageVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(portfolioList)
                .build();
    }

    /**
     * Category: 마이페이지(투자사)
     * Page: 내정보
     * 대표심사역 목록 조회
     * @return
     */
    @ApiOperation(value = "대표심사역 목록 조회")
    @GetMapping("/member/list")
    public ResponseData searchVCMemberList() throws Exception {
        List<VcMemberVO> memberList = vcService.searchVCMemberList();

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(memberList)
                .build();
    }

    /**
     * Category: 마이페이지(투자사)
     * Page: 내정보
     * 인감 정보 조회
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "인감 정보 조회")
    @GetMapping("/seal")
    public ResponseData searchVCSealInfo() throws Exception {
        CommerceSealVO commerceSealVO = sealService.searchUsisSealInfo();

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(commerceSealVO)
                .build();
    }


    /**
     * Category: 마이페이지(투자사)
     * Page: 내정보
     * 투자 운용 보고서 조회
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "투자 운용 보고서 조회")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(name = "page", value = "current page number", dataType = "Integer"),
            @ApiImplicitParam(name = "record", value = "size per page", dataType = "Integer"),
            @ApiImplicitParam(name = "pageSize", value = "size of pagination", dataType = "Integer")
    })
    @GetMapping("/orrp/list")
    public ResponseData searchOperationReportInfo(RequestVcOperationReportVO searchParams) throws Exception {
        PagingVO<VcOperationReportVO> list = vcService.searchOperationReportList(searchParams);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(list)
                .build();
    }

    /** ================================ Post Method Mapping ================================ **/

    /**
     * Category: 마이페이지(투자사)
     * Page: 내 정보
     * 기본정보 등록/수정
     * @return
     */
    @ApiOperation(value = "기본정보 등록/수정")
    @PostMapping("/basic/info/save")
    public ResponseData saveVC(@RequestBody VcInvestDetailVO vcInvestDetailVO) throws Exception {
        vcService.saveVC(vcInvestDetailVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    /**
     * Category: 마이페이지(기업)
     * Page: 내정보
     * 투자사 전환요청 확인
     * @return
     */
    @ApiOperation(value = "투자사 전환요청 확인")
    @PostMapping("/convert/check/result")
    public ResponseData checkConvertResult(@RequestBody AdminVcConvertRequestVO adminVcConvertRequestVO) throws Exception {

        vcService.checkConvertResult(adminVcConvertRequestVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    /**
     * Category: 마이페이지(투자사)
     * Page: 내 정보
     * 포트폴리오 등록/수정
     * @return
     */
    @ApiOperation(value = "포트폴리오 등록/수정")
    @PostMapping("/portfolio/save")
    public ResponseData saveVCPortfolio(@RequestBody VcPortfolioVO portfolio) throws Exception {
        vcService.saveVCPortfolio(portfolio);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    /**
     * Category: 마이페이지(투자사)
     * Page: 내 정보
     * 대표심사역 등록/수정
     * @return
     */
    @ApiOperation(value = "대표심사역 등록/수정")
    @PostMapping("/member/save")
    public ResponseData saveVCMember(@RequestBody List<VcMemberVO> memberList) throws Exception {
        vcService.saveVCMember(memberList);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    /**
     * Category: 마이페이지(투자사)
     * Page: 내정보
     * 대표심사역 삭제
     * @return
     */
    @ApiOperation(value = "대표심사역 삭제")
    @PostMapping("/member/delete")
    public ResponseData deleteVCMember(@RequestBody PostSimpleBodyVO.SimpleIdBody postSimpleBodyVO) throws Exception {
        vcService.deleteVCMember(postSimpleBodyVO.getId());

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    /**
     * Category: 마이페이지(투자사)
     * Page: 내정보
     * 인감 정보 등록/수정
     *
     * 기존 RequestPart로 json과 file을 함께 받는 방식에서 변경
     * -> httpEntity로 먼저 처리요청한 file upload와 이후 조회처리가 동기로 처리되지 않움,
     * -> Thread.sleep으로 interval을 두는 것보다 front에서 파일업로드를 별도로 호출하여 promise 처리하는 것으로 변경
     *
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "인감 정보 등록/수정")
    @PostMapping(path = {"/seal/save"}, consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public ResponseData saveInvestorSealInfo(@RequestPart(value = "file", required = false) MultipartFile file,
                                             @RequestPart(value = "json") CommerceSealVO commerceSealVO) throws Exception {
        CommerceSealVO result = sealService.saveUsisSealInfo(file, commerceSealVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    /**
     * Category: 마이페이지(투자사)
     * Page: 내 정보
     * 투자 운용 보고서 등록/수정
     * @return
     */
    @ApiOperation(value = "투자 운용 보고서 등록/수정")
    @PostMapping(
            path = {"/orrp/save"}
            , consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseData saveOperationReport(@ModelAttribute RequestVcSaveOperationReportVO vcOperationReportVO) throws Exception {
        vcService.saveVCOperationReport(vcOperationReportVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }
}
