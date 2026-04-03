package com.ibk.sb.restapi.biz.api.vc;

import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.vo.CustomUser;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.biz.service.audit.InvestAuditService;
import com.ibk.sb.restapi.biz.service.audit.vo.InvestAuditVO;
import com.ibk.sb.restapi.biz.service.ir.InvestorRelationService;
import com.ibk.sb.restapi.biz.service.ir.vo.IrPreviewVO;
import com.ibk.sb.restapi.biz.service.ir.vo.progress.IrProgressVO;
import com.ibk.sb.restapi.biz.service.vc.VentureCapitalService;
import com.ibk.sb.restapi.biz.service.vc.vo.base.VcMemberVO;
import com.ibk.sb.restapi.biz.service.vc.vo.base.VentureCapitalDetailVO;
import com.ibk.sb.restapi.biz.service.vc.vo.pagelink.VcPageDetailVO;
import com.ibk.sb.restapi.biz.service.vc.vo.portfolio.VcPortfolioVO;
import com.ibk.sb.restapi.biz.service.vc.vo.request.RequestSearchVcVO;
import com.ibk.sb.restapi.biz.service.vc.vo.request.RequestVcMemberVO;
import com.ibk.sb.restapi.biz.service.vc.vo.request.RequestVcPortfolioVO;
import com.ibk.sb.restapi.biz.service.vc.vo.summary.VentureCapitalSummaryVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;

@Slf4j
@RestController
@Api(tags = {"투자박스 투자사 서비스 API"})
@RequestMapping(path = {"/api/vc", "/api/iv/v1/vc"}, produces = {MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class VentureCapitalController {

    private final VentureCapitalService vcService;

    private final InvestAuditService investAuditService;

    private final InvestorRelationService investorRelationService;

    /** ================================ Get Method Mapping ================================ **/

    /**
     * Category: 투자기관 정보
     * Page: 목록 화면
     * 투자자 목록 조회
     * @return
     */
    @ApiOperation(value = "투자자 목록 조회")
    @GetMapping("/info/list")
    public ResponseData searchVCList(RequestSearchVcVO requestSearchVCVO) throws Exception {

        PagingVO<VentureCapitalSummaryVO> vcList = vcService.searchVCList(requestSearchVCVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(vcList)
                .build();
    }

    /**
     * Category: 투자기관 정보
     * Page: 상세 화면
     * 투자기관 상세 조회
     * @return
     */
    @ApiOperation(value = "투자기관 상세 조회")
    @GetMapping("/info/detail/{id}")
    public ResponseData searchVC(@PathVariable("id") String id) throws Exception {

        VentureCapitalDetailVO vc = vcService.searchVC(id);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(vc)
                .build();
    }

    /**
     * Category: 투자기관 정보
     * Page: 상세 화면
     * 포토폴리오 목록 조회
     * @return
     */
    @ApiOperation(value = "포토폴리오 목록 조회")
    @GetMapping("/portfolio/list")
    public ResponseData searchPortfolioList(RequestVcPortfolioVO requestVCPortfolioVO) throws Exception {

        PagingVO<VcPortfolioVO> portfolioList = vcService.searchPortfolioList(requestVCPortfolioVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(portfolioList)
                .build();
    }

    /**
     * Category: 투자기관 정보
     * Page: 상세 화면
     * 대표심사역 목록 조회
     * @return
     */
    @ApiOperation(value = "대표심사역 목록 조회")
    @GetMapping("/member/list")
    public ResponseData searchVCMemberList(RequestVcMemberVO requestVCMemberVO) throws Exception {

        PagingVO<VcMemberVO> memberList = vcService.searchVCMemberList(requestVCMemberVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(memberList)
                .build();
    }


    /**
     * 자사(기업)과 심사 진행중인 투자사인지 확인
     * @param invmCmpId
     * @return
     */
    @ApiOperation(value = "자사(기업)과 심사 진행중인 투자사인지 확인")
    @GetMapping("/audit/ongoing")
    public ResponseData searchOngoingAudit(@RequestParam("invmCmpId") String invmCmpId) throws Exception {

        boolean isOngoing = investAuditService.checkAuditOngoing(invmCmpId, null);
        HashMap<String, String> result = new HashMap<>();
        result.put("ongoingYn", isOngoing ? IvtCode.YnTypeEnum.Y.name() : IvtCode.YnTypeEnum.N.name());

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    /**
     * Category: 투자기관 정보
     * Page: 상세화면
     * 기업 요청 제한 확인
     * @return
     */
    @ApiOperation(value = "기업 요청 제한 확인")
    @GetMapping("/audit/company/limit")
    public ResponseData checkAuditRequestLimit(@RequestParam("invmCmpId") String invmCmpId, @RequestParam(value = "tcbCheckYn", required = false) String tcbCheckYn) throws Exception {

//        int requestCnt = investAuditService.searchRequestAuditCount();
//        HashMap<String, String> result = new HashMap<>();
//        result.put("limitYn", requestCnt < 5 ? "N" : "Y");

        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        HashMap result = investAuditService.checkBeforeAuditLimit(
                user.getUserGroupId()
                , invmCmpId
                , (StringUtils.hasLength(tcbCheckYn) && tcbCheckYn.equals(IvtCode.YnTypeEnum.N.name())) ? IvtCode.YnTypeEnum.N : IvtCode.YnTypeEnum.Y
        );

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    /**
     * Category: 투자기관 정보
     * Page: 상세화면
     * 투자심사요청 기업 IR 조회
     * @return
     */
    @ApiOperation(value = "투자심사요청 기업 IR 조회")
    @GetMapping("/audit/company/ir")
    public ResponseData searchRequestAuditCompanyIR() throws Exception {

        IrProgressVO progressVO = investorRelationService.searchIRProgress();

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(progressVO)
                .build();
    }

    /**
     * Category: 투자기관 정보
     * Page: 상세화면
     * 투자심사요청 기업 IR 미리보기
     * @return
     */
    @ApiOperation(value = "투자심사요청 기업 IR 미리보기")
    @GetMapping("/audit/company/ir/preview")
    public ResponseData searchRequestAuditCompanyIRPreview(@RequestParam("tabType") String tabType) throws Exception {

        IrPreviewVO previewVO = investorRelationService.searchIRPreview(tabType, null);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(previewVO)
                .build();
    }

    /**
     * Category: 투자사페이지
     * Page: 투자사페이지
     * 투자사 전용 페이지 화면 정보 조회
     * @return
     */
    @ApiOperation(value = "투자사 전용 페이지 화면 정보 조회")
    @GetMapping("/weblink/page/{id}")
    public ResponseData searchVCWeblink(@PathVariable("id") String id) throws Exception {

        VcPageDetailVO pageDetail = vcService.searchVCPage(id);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(pageDetail)
                .build();
    }



    /** ================================ Post Method Mapping ================================ **/

    /**
     * 투자심사요청 (기업 -> 투자사)
     * Category: 투자기관 정보
     * Page: 상세화면
     * @return
     */
    @ApiOperation(value = "투자심사요청 (기업 -> 투자사)")
    @PostMapping("/audit/request/save")
    public ResponseData saveInvestAuditRequest(@RequestBody InvestAuditVO investAuditVO) throws Exception {

        investAuditService.saveInvestAuditRequest(investAuditVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }
}
