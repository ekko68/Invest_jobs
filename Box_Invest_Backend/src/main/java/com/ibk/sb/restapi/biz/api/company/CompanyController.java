package com.ibk.sb.restapi.biz.api.company;

import com.ibk.sb.restapi.app.common.constant.ComCode;
import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.vo.*;
import com.ibk.sb.restapi.biz.service.audit.InvestAuditService;
import com.ibk.sb.restapi.biz.service.audit.vo.InvestAuditVO;
import com.ibk.sb.restapi.biz.service.banner.BannerService;
import com.ibk.sb.restapi.biz.service.admin.vo.BannerVO;
import com.ibk.sb.restapi.biz.service.company.CompanyService;
import com.ibk.sb.restapi.biz.service.company.vo.base.CompanyDetailVO;
import com.ibk.sb.restapi.biz.service.company.vo.product.CompanyProductVO;
import com.ibk.sb.restapi.biz.service.message.vo.RequestBizAskMessageVO;
import com.ibk.sb.restapi.biz.service.company.vo.request.RequestSearchCompanyVO;
import com.ibk.sb.restapi.biz.service.company.vo.summary.CompanySummaryVO;
import com.ibk.sb.restapi.biz.service.message.MessageService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@Api(tags = {"투자박스 기업정보 탭 API"})
@RestController
@Slf4j
@RequestMapping(path={"/api/company", "/api/iv/v1/company"}, produces = {MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    private final BannerService bannerService;

    private final InvestAuditService investAuditService;

    private final MessageService messageService;

    /** ================================ Get Method Mapping ================================ **/


    @ApiOperation(value = "기업 목록 조회")
    @GetMapping("/info/list")
    public ResponseData searchCompanyList(RequestSearchCompanyVO requestVO) throws Exception {

        PagingVO<CompanySummaryVO> result = companyService.searchCompanyList(requestVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    @ApiOperation(value = "기업 목록 페이지 배너정보 조회")
    @GetMapping("/banner")
    public ResponseData searchCompanyBanner() throws Exception {

        List<BannerVO> bannerList = bannerService.searchMainBannerList(ComCode.COMPANY_BANNER_BOTTOM);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(bannerList)
                .build();
    }

    @ApiOperation(value = "기업 기본정보 상세 조회")
    @GetMapping("/info/detail/{id}")
    public ResponseData searchCompanyBasic(@PathVariable(name = "id") String id) throws Exception {

        CompanyDetailVO companyDetailVO = companyService.searchCompany(id);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(companyDetailVO)
                .build();
    }

    @ApiOperation(value = "기업 제품 상세보기")
    @GetMapping("/product/detail")
    public ResponseData searchCompanyProduct(@RequestParam("utlinsttId") String utlinsttId, @RequestParam("prdtId") String prdtId) throws Exception {

        CompanyProductVO product = companyService.searchCompanyProduct(prdtId, utlinsttId);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(product)
                .build();
    }

    @ApiOperation(value = "자사(투자사)와 심사 진행중 기업 여부 확인")
    @GetMapping("/audit/ongoing")
    public ResponseData searchOngoingAudit(@RequestParam("rqstEnprId") String rqstEnprId) throws Exception {

        boolean isOngoing = investAuditService.checkAuditOngoing(null, rqstEnprId);
        HashMap<String, String> result = new HashMap<>();
        result.put("ongoingYn", isOngoing ? IvtCode.YnTypeEnum.Y.name() : IvtCode.YnTypeEnum.N.name());

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    /** @todo : API 신청 필요 */
    @ApiOperation(value = "투자심사 제안 가능 기업 확인 : 투자사가 IBK 특정 사업부인 경우 기업의 TCB 확인")
    @PostMapping("/audit/limit")
    public ResponseData checkAuditSuggestLimit(@RequestBody PostSimpleBodyVO.SimpleIdBody rqstEnprIdBody) throws Exception {
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        HashMap result = investAuditService.checkBeforeAuditLimit(rqstEnprIdBody.getId(), user.getUserGroupId(), IvtCode.YnTypeEnum.Y);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }



    /** ================================ Post Method Mapping ================================ **/

    /**
     * 투자희망기업 좋아요 정보 갱신
     * @param simpleIdBody
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "투자희망기업 좋아요 정보 갱신")
    @PostMapping("/like/toggle/save")
    public ResponseData updateToggleLike(@RequestBody PostSimpleBodyVO.SimpleIdBody simpleIdBody) throws Exception {

        HashMap<String, String> result = new HashMap<>();
        result.put("isPrefer", companyService.updateToggleLike(simpleIdBody.getId())
                ? IvtCode.YnTypeEnum.Y.name() : IvtCode.YnTypeEnum.N.name());

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    @ApiOperation(value = "투자심사제안 (투자사 -> 기업)")
    @PostMapping("/audit/suggest/save")
    public ResponseData saveInvestAuditSuggest(@RequestBody InvestAuditVO investAuditVO) throws Exception {

        String invmExntRqstId = investAuditService.saveInvestAuditSuggest(investAuditVO);

        HashMap<String, String> result = new HashMap<>();
        result.put("invmExntRqstId", invmExntRqstId);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }
    
    @ApiOperation(value = "사업문의 요청")
    @PostMapping("/business/ask")
    public ResponseData saveBizAsk(@RequestBody RequestBizAskMessageVO requestBizAskMessageVO) throws Exception {

        messageService.saveBizAsk(requestBizAskMessageVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }
}
