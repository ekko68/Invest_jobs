package com.ibk.sb.restapi.biz.api.bizrno;

import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.biz.service.audit.InvestAuditService;
import com.ibk.sb.restapi.biz.service.audit.vo.RequestSearchInvestAuditPageVO;
import com.ibk.sb.restapi.biz.service.ir.InvestorRelationService;
import com.ibk.sb.restapi.biz.service.message.MessageService;
import com.ibk.sb.restapi.biz.service.message.vo.RequestAuditMessageVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@Api(tags = {"IBK 투자그룹 제공 API"})
@Slf4j
@RestController
@RequestMapping(path = {"/api/bizrno/invest/audit", "/api/iv/v1/bizrno/invest/audit"}, produces = {MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class BizrnoInvestAuditController {

    private final InvestAuditService investAuditService;

    private final MessageService messageService;

    private final InvestorRelationService irService;

    /**
     * 신규 요구사항 추가
     * IBK 내부적으로 로그인 인증 없이 사업자 번호 기준으로 투자심사정보 조회 처리를 위한 API Controller
     */

    @ApiOperation(value = "받은 투자심사 목록 조회")
    @GetMapping("/receive/list")
    public ResponseData searchReceiveAuditPagingByBizNum(RequestSearchInvestAuditPageVO requestVO) throws Exception {

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(investAuditService.searchAuditListByBizNum(requestVO, IvtCode.TransmitTypeEnum.RECEIVE))
                .build();
    }

    @ApiOperation(value = "보낸 투자심사 목록 조회")
    @GetMapping("/send/list")
    public ResponseData searchSendAuditPagingByBizNum(RequestSearchInvestAuditPageVO requestVO) throws Exception {

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(investAuditService.searchAuditListByBizNum(requestVO, IvtCode.TransmitTypeEnum.SEND))
                .build();
    }

    @ApiOperation(value = "투자심사 진행도 조회")
    @GetMapping("/progress/{id}")
    public ResponseData searchProgressAudit(@PathVariable("id") String id) throws Exception {

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(investAuditService.searchAuditProgress(id))
                .build();
    }

    @ApiOperation(value = "투자심사 상세정보 조회")
    @GetMapping("/detail/{id}")
    public ResponseData searchDetailAudit(@PathVariable("id") String id) throws Exception {

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(investAuditService.searchInvestAudit(id))
                .build();
    }

    @ApiOperation(value = "투자심사 메시지 목록 조회")
    @GetMapping("/message/list")
    public ResponseData searchAuditMessagePagingByBizNum(RequestAuditMessageVO requestAuditMessageVO) throws Exception {

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(messageService.searchAuditMessageListWithBiznum(requestAuditMessageVO))
                .build();
    }

    @ApiOperation(value = "투자심사 메시지 상세 조회")
    @GetMapping("/message/detail")
    public ResponseData searchAuditMessageDetailByBizNum(@RequestParam("msgId") String msgId, @RequestParam("bizrno") String bizrno) throws Exception {

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(messageService.searchMessageWithBizNum(msgId, bizrno))
                .build();
    }

    @ApiOperation(value = "투자심사 기업 IR 조회 (기본정보)")
    @GetMapping("/ir/basic")
    public ResponseData searchAuditIrBasicByBizNum(@RequestParam("invmExntRqstId") String invmExntRqstId, @RequestParam("bizrno") String bizrno) throws Exception {

        String companyId = irService.searchIrCompanyIdByBizNumAndAuditId(invmExntRqstId, bizrno);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(irService.searchIR(companyId))
                .build();
    }

    @ApiOperation(value = "투자심사 기업 IR 조회 (연혁정보)")
    @GetMapping("/ir/history")
    public ResponseData searchAuditIrHistoryByBizNum(@RequestParam("invmExntRqstId") String invmExntRqstId, @RequestParam("bizrno") String bizrno) throws Exception {

        String companyId = irService.searchIrCompanyIdByBizNumAndAuditId(invmExntRqstId, bizrno);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(irService.searchIRHistoryGroupList(companyId))
                .build();
    }

    @ApiOperation(value = "투자심사 기업 IR 조회 (팀원정보)")
    @GetMapping("/ir/member")
    public ResponseData searchAuditIrMemberByBizNum(@RequestParam("invmExntRqstId") String invmExntRqstId, @RequestParam("bizrno") String bizrno) throws Exception {

        String companyId = irService.searchIrCompanyIdByBizNumAndAuditId(invmExntRqstId, bizrno);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(irService.searchIRMemberList(companyId))
                .build();
    }

    @ApiOperation(value = "투자심사 기업 IR 조회 (주주현황)")
    @GetMapping("/ir/stockholder")
    public ResponseData searchAuditIrStockholderByBizNum(@RequestParam("invmExntRqstId") String invmExntRqstId, @RequestParam("bizrno") String bizrno) throws Exception {

        String companyId = irService.searchIrCompanyIdByBizNumAndAuditId(invmExntRqstId, bizrno);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(irService.searchIRStockHolderList(companyId))
                .build();
    }

    @ApiOperation(value = "투자심사 기업 IR 조회 (재무현황)")
    @GetMapping("/ir/finance")
    public ResponseData searchAuditIrFinanceByBizNum(@RequestParam("invmExntRqstId") String invmExntRqstId, @RequestParam("bizrno") String bizrno) throws Exception {

        String companyId = irService.searchIrCompanyIdByBizNumAndAuditId(invmExntRqstId, bizrno);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(irService.searchIRFinance(companyId))
                .build();
    }

    @ApiOperation(value = "투자심사 기업 IR 조회 (제품/기술/시장)")
    @GetMapping("/ir/extra")
    public ResponseData searchAuditIrExtraByBizNum(@RequestParam("invmExntRqstId") String invmExntRqstId, @RequestParam("bizrno") String bizrno) throws Exception {

        String companyId = irService.searchIrCompanyIdByBizNumAndAuditId(invmExntRqstId, bizrno);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(irService.searchIRExtra(companyId))
                .build();
    }

    @ApiOperation(value = "투자심사 기업 IR 조회 (성과/계획)")
    @GetMapping("/ir/plan")
    public ResponseData searchAuditIrPlanByBizNum(@RequestParam("invmExntRqstId") String invmExntRqstId, @RequestParam("bizrno") String bizrno) throws Exception {

        String companyId = irService.searchIrCompanyIdByBizNumAndAuditId(invmExntRqstId, bizrno);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(irService.searchIRPlanAndResult(companyId))
                .build();
    }

}
