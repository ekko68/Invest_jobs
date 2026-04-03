package com.ibk.sb.restapi.biz.api.mypage.company;

import com.ibk.sb.restapi.app.annotation.SkipCheckAspect;
import com.ibk.sb.restapi.app.common.constant.ComCode;
import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.vo.CustomUser;
import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.app.common.vo.PostSimpleBodyVO;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.biz.service.admin.repo.AdminVcRepo;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminVcConvertRequestVO;
import com.ibk.sb.restapi.biz.service.banner.BannerService;
import com.ibk.sb.restapi.biz.service.admin.vo.BannerVO;
import com.ibk.sb.restapi.biz.service.company.CompanyService;
import com.ibk.sb.restapi.biz.service.company.vo.base.CompanyBasicVO;
import com.ibk.sb.restapi.biz.service.company.vo.base.CompanyIntroMediaVO;
import com.ibk.sb.restapi.biz.service.company.vo.base.CompanyMemberVO;
import com.ibk.sb.restapi.biz.service.company.vo.invest.CompanyInvestVO;
import com.ibk.sb.restapi.biz.service.company.vo.invest.InvmCnvrsRegSaveToVcVO;
import com.ibk.sb.restapi.biz.service.company.vo.product.CompanyProductVO;
import com.ibk.sb.restapi.biz.service.company.vo.product.ProductListGroupVO;
import com.ibk.sb.restapi.biz.service.fund.FundService;
import com.ibk.sb.restapi.biz.service.kipris.KiprisService;
import com.ibk.sb.restapi.biz.service.kipris.vo.KiprisSummaryVO;
import com.ibk.sb.restapi.biz.service.kipris.vo.KiprisTotalVO;
import com.ibk.sb.restapi.biz.service.kipris.vo.RequestSearchKiprisVO;
import com.ibk.sb.restapi.biz.service.platform.vo.stamp.CommerceSealVO;
import com.ibk.sb.restapi.biz.service.seal.SealService;
import com.ibk.sb.restapi.biz.service.vc.VentureCapitalService;
import com.ibk.sb.restapi.biz.service.vc.vo.summary.VentureCapitalSummaryVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;

@Slf4j
@RestController
@Api(tags = {"기업 마이페이지 서비스 API"})
@RequestMapping(path = {"/api/my/company", "/api/iv/v1/my/company"}, produces = {MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class MyCompanyController {

    private final CompanyService companyService;

    private final BannerService bannerService;

    private final VentureCapitalService vcService;

    private final KiprisService kiprisService;
    private final FundService fundService;
    private final SealService sealService;
    private final AdminVcRepo repo;
    /** ================================ Get Method Mapping ================================ **/

    /**
     * Category: 마이페이지(기업)
     * Page: 대시보드
     * 추천 투자사 목록 조회
     *
     * @return
     */
    @ApiOperation(value = "추천 투자사 목록 조회")
    @GetMapping("/recommend/vc/list")
    public ResponseData searchRecommendVCList() throws Exception {
        List<VentureCapitalSummaryVO> recommendVCList = vcService.searchRecommendVCList();

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(recommendVCList)
                .build();
    }

    /**
     * Category: 마이페이지(기업)
     * Page: 대시보드
     * 배너정보 조회
     *
     * @return
     */
    @ApiOperation(value = "배너정보 조회")
    @GetMapping("/banner")
    public ResponseData searchBanner() throws Exception {
        List<BannerVO> bannerList = bannerService.searchMainBannerList(ComCode.MYPAGE_BANNER_COMPANY);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(bannerList)
                .build();
    }


    /**
     * Category: 마이페이지(기업)
     * Page: 내정보
     * 기업 기본 정보 조회
     *
     * @return
     */
    @ApiOperation(value = "기업 기본 정보 조회")
    @GetMapping("/basic/info/detail")
    public ResponseData searchCompany() throws Exception {
        CompanyBasicVO companyBasicVO = companyService.searchCompanyBasic();

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(companyBasicVO)
                .build();
    }

    /**
     * Category: 마이페이지(기업)
     * Page: 내정보
     * 진행중 투자사 전환 요청건 확인
     *
     * @return
     */
    @ApiOperation(value = "진행중 투자사 전환 요청건 확인")
    @GetMapping("/vc/convert/check/request")
    public ResponseData searchConvertRequestAvailable() throws Exception {

        HashMap<String, String> result = vcService.searchConvertRequestAvailable();

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    /**
     * Category: 마이페이지(기업)
     * Page: 내정보
     * 기업 지적재산권 탭별 총계 조회
     *
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "기업 지적재산권 탭별 총계 조회")
    @GetMapping("/kipris/tab/total")
    public ResponseData searchKiprisTabTotal() throws Exception {
        KiprisTotalVO result = kiprisService.searchKiprisTabTotal();

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    /**
     * Category: 마이페이지(기업)
     * Page: 내정보
     * 기업 보유 지적재산권 현황 조회 (특허)
     *
     * @return
     */
    @ApiOperation(value = "기업 보유 지적재산권 현황 조회 (특허)")
    @GetMapping("/kipris/ip/list")
    public ResponseData searchCompanyKiprisIpList(RequestSearchKiprisVO requestSearchKiprisVO) throws Exception {
        PagingVO<KiprisSummaryVO> kiprisIpList = kiprisService.searchKiprisPagingList(requestSearchKiprisVO, IvtCode.KiprisTypeEnum.IP);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(kiprisIpList)
                .build();
    }

    /**
     * Category: 마이페이지(기업)
     * Page: 내정보
     * 기업 보유 지적재산권 현황 조회 (상표)
     *
     * @return
     */
    @ApiOperation(value = "기업 보유 지적재산권 현황 조회 (상표)")
    @GetMapping("/kipris/trademark/list")
    public ResponseData searchCompanyKiprisTradeMarkList(RequestSearchKiprisVO requestSearchKiprisVO) throws Exception {
        PagingVO<KiprisSummaryVO> kiprisTradeMarkList = kiprisService.searchKiprisPagingList(requestSearchKiprisVO, IvtCode.KiprisTypeEnum.TRADEMARK);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(kiprisTradeMarkList)
                .build();
    }

    /**
     * Category: 마이페이지(기업)
     * Page: 내정보
     * 기업 보유 지적재산권 현황 조회 (디자인)
     *
     * @return
     */
    @ApiOperation(value = "기업 보유 지적재산권 현황 조회 (디자인)")
    @GetMapping("/kipris/design/list")
    public ResponseData searchCompanyKiprisDesignList(RequestSearchKiprisVO requestSearchKiprisVO) throws Exception {
        PagingVO<KiprisSummaryVO> kiprisDesignList = kiprisService.searchKiprisPagingList(requestSearchKiprisVO, IvtCode.KiprisTypeEnum.DESIGN);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(kiprisDesignList)
                .build();
    }

    /**
     * Category: 마이페이지(기업)
     * Page: 내정보
     * 기업 제품정보 목록 조회
     *
     * @return
     */
    @ApiOperation(value = "기업 제품정보 목록 조회")
    @GetMapping("/product/list")
    public ResponseData searchCompanyProductList() throws Exception {
        ProductListGroupVO productListGroupVO = companyService.searchCompanyProductListGroup();

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(productListGroupVO)
                .build();
    }

    /**
     * Category: 마이페이지(기업)
     * Page: 내정보
     * 투자희망기업 좋아요 정보 갱신
     *
     * @return
     */
    @ApiOperation(value = "투자희망기업 좋아요 정보 갱신")
    @GetMapping("/product/detail/{id}")
    public ResponseData searchCompanyProduct(@PathVariable("id") String id) throws Exception {
        CompanyProductVO productVO = companyService.searchCompanyProduct(id, null);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(productVO)
                .build();
    }

    /**
     * Category: 마이페이지(기업)
     * Page: 내정보
     * 기업 주요제품정보 삭제
     *
     * @param postSimpleBodyVO
     * @return
     */
    @ApiOperation(value = "기업 주요제품정보 삭제")
    @PostMapping("/product/delete")
    public ResponseData deleteCompanyProduct(@RequestBody PostSimpleBodyVO.SimpleIdBody postSimpleBodyVO) throws Exception {
        companyService.deleteCompanyProduct(postSimpleBodyVO.getId());

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    /**
     * Category: 마이페이지(기업)
     * Page: 내정보
     * 투자희망 조회
     *
     * @return
     */
    @ApiOperation(value = "투자희망 조회")
    @GetMapping("/invest/hope/detail")
    public ResponseData searchCompanyInvestHope() throws Exception {
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if(!user.checkGroup(IvtCode.UsisTypeEnum.COMPANY)) throw new BizException(StatusCode.COM0005);

        CompanyInvestVO investInfo = companyService.searchCompanyInvestHope(user.getUserGroupId());

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(investInfo)
                .build();
    }

    /**
     * Category: 마이페이지(기업)
     * Page: 내정보
     * 팀원정보 조회
     *
     * @return
     */
    @ApiOperation(value = "팀원정보 조회")
    @GetMapping("/member/list")
    public ResponseData searchCompanyMemberList() throws Exception {
        List<CompanyMemberVO> memberList = companyService.searchCompanyMemberList();

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(memberList)
                .build();
    }

    /**
     * Category: 마이페이지(기업)
     * Page: 내정보
     * 소개영상 조회
     *
     * @return
     */
    @ApiOperation(value = "소개영상 조회")
    @GetMapping("/intro/media/list")
    public ResponseData searchCompanyIntroMediaList() throws Exception {
        List<CompanyIntroMediaVO> mediaList = companyService.searchCompanyIntroMedia();

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(mediaList)
                .build();
    }

    /**
     * Category: 마이페이지(기업)
     * Page: 내정보
     * 인감 정보 조회
     *
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "인감 정보 조회")
    @GetMapping("/seal")
    public ResponseData searchCompanySealInfo() throws Exception {
        CommerceSealVO commerceSealVO = sealService.searchUsisSealInfo();

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(commerceSealVO)
                .build();
    }

    /** ================================ Post Method Mapping ================================ **/

    /**
     * Category: 마이페이지(기업)
     * Page: 내정보
     * 투자사 전환 요청
     *
     * @return
     */
    @ApiOperation(value = "투자사 전환 요청")
    @SkipCheckAspect
    @PostMapping("/vc/convert/request")
    public ResponseData requestConvertToVC(@RequestBody PostSimpleBodyVO.SimpleFileBody licenseFile) throws Exception {

        try {
            AdminVcConvertRequestVO result = vcService.requestConvertToVC(licenseFile);

            return ResponseData.builder()
                    .code(HttpStatus.OK.value())
                    .data(result)
                    .message(HttpStatus.OK.getReasonPhrase())
                    .build();

        } catch (BizException bx) {
            if (bx.getErrorCode().equals(StatusCode.BIZ0003.getCode())) {
                return ResponseData.builder()
                        .code(bx.getErrorCode())
                        .data(bx.getData())
                        .message(bx.getErrorMsg())
                        .build();
            } else {
                log.error("Fail Business Exception Trace : ", bx);
                return ResponseData.builder()
                        .code(bx.getErrorCode())
                        .message(bx.getErrorMsg())
                        .build();
            }

        } catch (Exception e) {
            log.error("Fail Exception Trace : ", e);
            return ResponseData.builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message(StatusCode.COM0000.getMessage())
                    .build();
        }
    }

    /**
     * Category: 마이페이지(기업)
     * Page: 내정보
     * 투자사 전환 요청 정보 등록
     * InvmCnvrsRegSaveToVcVO
     * @return
     */
    @ApiOperation(value = "투자사 전환 요청 정보 등록")
    @SkipCheckAspect
    @PostMapping(path = {"/vc/convert/invmCnvrsRegSave"}, consumes = {MediaType.MULTIPART_FORM_DATA_VALUE,MediaType.APPLICATION_JSON_VALUE})
    public ResponseData invmCnvrsRegSaveToVc(
            @RequestPart(value = "invmCnvrsRegSaveToVcVO") InvmCnvrsRegSaveToVcVO invmCnvrsRegSaveToVcVO,
            @RequestPart(value = "file") MultipartFile file) throws Exception {

        log.debug("Fail Business Exception Trace : ", invmCnvrsRegSaveToVcVO);

        try {
            AdminVcConvertRequestVO result = vcService.invmCnvrsRegSaveToVc(invmCnvrsRegSaveToVcVO,file);

            return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .data(result)
                .message(HttpStatus.OK.getReasonPhrase())
                .build();

        } catch (BizException bx) {
            if (bx.getErrorCode().equals(StatusCode.BIZ0003.getCode())) {
                return ResponseData.builder()
                    .code(bx.getErrorCode())
                    .data(bx.getData())
                    .message(bx.getErrorMsg())
                    .build();
            } else {
                log.error("Fail Business Exception Trace : ", bx);
                return ResponseData.builder()
                        .code(bx.getErrorCode())
                        .message(bx.getErrorMsg())
                        .build();
            }

        } catch (Exception e) {
            log.error("Fail Exception Trace : ", e);
            return ResponseData.builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message(StatusCode.COM0000.getMessage())
                    .build();
        }
    }

    /**
     * Category: 마이페이지(기업)
     * Page: 내정보
     * 투자사 전환요청 반려 확인
     *
     * @return
     */
    @ApiOperation(value = "투자사 전환요청 반려 확인")
    @PostMapping("/vc/convert/check/result")
    public ResponseData checkConvertResult(@RequestBody AdminVcConvertRequestVO adminVcConvertRequestVO) throws Exception {

        vcService.checkConvertResult(adminVcConvertRequestVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    /**
     * Category: 마이페이지(기업)
     * Page: 내 정보
     * 기본정보 등록/수정
     *
     * @return
     */
    @ApiOperation(value = "기본정보 등록/수정")
    @PostMapping("/basic/info/save")
    public ResponseData saveCompany(@RequestBody CompanyBasicVO companyBasicVO) throws Exception {
        companyService.saveCompany(companyBasicVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    /**
     * Category: 마이페이지(기업)
     * Page: 내 정보
     * 주요제품 등록/수정
     *
     * @return
     */
    @ApiOperation(value = "주요제품 등록/수정")
    @PostMapping("/product/save")
    public ResponseData saveCompanyProduct(@RequestBody CompanyProductVO companyProductVO) throws Exception {
        companyService.saveCompanyProduct(companyProductVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    /**
     * Category: 마이페이지(기업)
     * Page: 내 정보
     * 투자희망 등록/수정
     *
     * @return
     */
    @ApiOperation(value = "투자희망 등록/수정")
    @PostMapping("/invest/hope/save")
    public ResponseData saveCompanyInvestHope(@RequestBody CompanyInvestVO companyInvestVO) throws Exception {
        companyService.saveCompanyInvestHope(companyInvestVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    /**
     * Category: 마이페이지(기업)
     * Page: 내 정보
     * 팀원정보 등록/수정
     *
     * @return
     */
    @ApiOperation(value = "팀원정보 등록/수정")
    @PostMapping("/member/save")
    public ResponseData saveCompanyMember(@RequestBody List<CompanyMemberVO> memberList) throws Exception {
        companyService.saveCompanyMember(memberList);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    /**
     * Category: 마이페이지(기업)
     * Page: 내 정보
     * 소개영상 등록/수정
     *
     * @return
     */
    @ApiOperation(value = "소개영상 등록/수정")
    @PostMapping("/intro/media/save")
    public ResponseData saveCompanyIntroMedia(@RequestBody List<CompanyIntroMediaVO> introMediaVOnList) throws Exception {
        companyService.saveCompanyIntroMedia(introMediaVOnList);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    /**
     * Category: 마이페이지(기업)
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
    public ResponseData saveCompanySealInfo(@RequestPart(value = "file", required = false) MultipartFile file,
                                            @RequestPart(value = "json") CommerceSealVO commerceSealVO) throws Exception {
        CommerceSealVO result = sealService.saveUsisSealInfo(file, commerceSealVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }
}
