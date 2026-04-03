package com.ibk.sb.restapi.biz.api.mypage.company;

import com.ibk.sb.restapi.app.common.constant.ComCode;
import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.vo.*;
import com.ibk.sb.restapi.biz.service.audit.InvestAuditService;
import com.ibk.sb.restapi.biz.service.audit.vo.InvestAuditStageVO;
import com.ibk.sb.restapi.biz.service.audit.vo.InvestAuditSummaryVO;
import com.ibk.sb.restapi.biz.service.audit.vo.InvestAuditVO;
import com.ibk.sb.restapi.biz.service.audit.vo.RequestSearchInvestAuditPageVO;
import com.ibk.sb.restapi.biz.service.ir.InvestorRelationService;
import com.ibk.sb.restapi.biz.service.ir.vo.IrPreviewVO;
import com.ibk.sb.restapi.biz.service.ir.vo.progress.IrProgressVO;
import com.ibk.sb.restapi.biz.service.message.MessageService;
import com.ibk.sb.restapi.biz.service.message.vo.MessageSummaryVO;
import com.ibk.sb.restapi.biz.service.message.vo.MessageVO;
import com.ibk.sb.restapi.biz.service.message.vo.RequestAuditMessageVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@Api(tags = {"기업 마이페이지 투자심사 API"})
@Slf4j
@RestController
@RequestMapping(path = {"/api/my/company/audit", "/api/iv/v1/my/company/audit"}, produces = {MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class MyComAuditController {

    private final InvestAuditService investAuditService;

    private final InvestorRelationService investorRelationService;

    private final MessageService messageService;

    /** ================================ Get Method Mapping ================================ **/

    @ApiOperation(value = "받은 투자심사제안 목록 조회")
    @GetMapping("/suggest/list")
    public ResponseData searchCompanyAuditSuggestList() throws Exception {

        BadgeListVO<InvestAuditSummaryVO> suggestList = investAuditService.searchDashBoardAuditList(IvtCode.AuditListTypeEnum.COMPANY_RECEIVE);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(suggestList)
                .build();
    }

    @ApiOperation(value = "보낸 투자심사요청 목록 조회")
    @GetMapping("/request/list")
    public ResponseData searchCompanyAuditRequestList() throws Exception {

        BadgeListVO<InvestAuditSummaryVO> requestList = investAuditService.searchDashBoardAuditList(IvtCode.AuditListTypeEnum.COMPANY_SEND);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(requestList)
                .build();
    }

    @ApiOperation(value = "받은 투자심사제안 목록 조회 (페이징)")
    @GetMapping("/receive/list")
    public ResponseData searchCompanyAuditReceiveList(RequestSearchInvestAuditPageVO requestSearchInvestAuditPageVO) throws Exception {

        BadgePagingVO<InvestAuditSummaryVO> suggestPaging = investAuditService.searchAuditListByLoginUserInfo(requestSearchInvestAuditPageVO, IvtCode.AuditListTypeEnum.COMPANY_RECEIVE);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(suggestPaging)
                .build();
    }

    /**
     * Category: 마이페이지(기업)
     * Page: 투자심사요청
     * 보낸 투자심사요청 목록 조회 (페이징)
     * @return
     */
    @ApiOperation(value = "보낸 투자심사요청 목록 조회 (페이징)")
    @GetMapping("/send/list")
    public ResponseData searchCompanyAuditSendList(RequestSearchInvestAuditPageVO requestSearchInvestAuditPageVO) throws Exception {

        BadgePagingVO<InvestAuditSummaryVO> requestPaging = investAuditService.searchAuditListByLoginUserInfo(requestSearchInvestAuditPageVO, IvtCode.AuditListTypeEnum.COMPANY_SEND);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(requestPaging)
                .build();
    }

    /**
     * Category: 마이페이지(기업)
     * Page: 투자심사요청
     * 보낸 투자심사요청 개수 조회
     * @return
     */
    @ApiOperation(value = "보낸 투자심사요청 개수 조회")
    @GetMapping("/send/count")
    public ResponseData searchCompanyAuditSendCount() throws Exception {

        int requestCnt = investAuditService.searchRequestAuditCount();
        HashMap<String, Integer> result = new HashMap<>();
        result.put("requestCnt", requestCnt);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    /**
     * Category: 마이페이지(투자사)
     * Page: 투자심사요청
     * 투자심사요청 진행정보 조회
     * @return
     */
    @ApiOperation(value = "투자심사요청 진행정보 조회")
    @GetMapping("/progress/{id}")
    public ResponseData searchInvestAuditProgress(@PathVariable("id") String id) throws Exception {

        List<InvestAuditStageVO> auditProgress = investAuditService.searchAuditProgress(id);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(auditProgress)
                .build();
    }

    /**
     * Category: 마이페이지(기업)
     * Page: 투자심사요청
     * 투자심사요청 정보 조회
     * @return
     */
    @ApiOperation(value = "투자심사요청 정보 조회")
    @GetMapping("/detail/{id}")
    public ResponseData searchInvestAudit(@PathVariable("id") String id) throws Exception {

        InvestAuditVO investAuditVO = investAuditService.searchInvestAudit(id);

        // 투자희망기업의 경우 상세 조회에서 투자예정금액, 비고 조회가 비공개처리되므로 조회 데이터에서 null처리시킨다
        investAuditVO.setInvmPrfrScdlAmt(null);
        investAuditVO.setInvmPrfrScdlAmtStr("");
        investAuditVO.setExntRsltRmrk("");

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(investAuditVO)
                .build();
    }

    /** Message **/

    /**
     * Category: 마이페이지(기업)
     * Page: 투자심사요청
     * 투자심사 메시지 목록 조회
     * @return
     */
    @ApiOperation(value = "투자심사 메시지 목록 조회")
    @GetMapping("/message/list")
    public ResponseData searchAuditMessageList(RequestAuditMessageVO requestAuditMessageVO) throws Exception {

        BadgePagingVO<MessageSummaryVO> auditMessageList = messageService.searchAuditMessageListWithLoginInfo(requestAuditMessageVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(auditMessageList)
                .build();
    }

    /**
     * Category: 마이페이지(기업)
     * Page: 투자심사요청
     * 메시지 정보 조회
     * @return
     */
    @ApiOperation(value = "메시지 정보 조회")
    @GetMapping("/message/detail/{id}")
    public ResponseData searchAuditMessage(@PathVariable("id") String id) throws Exception {

        MessageVO auditMessageVO = messageService.searchMessageWithLoginInfo(id);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(auditMessageVO)
                .build();
    }

    /**
     * Category: 마이페이지(기업)
     * Page: 투자심사요청
     * 기업 IR 조회
     * @return
     */
    @ApiOperation(value = "기업 IR 조회")
    @GetMapping("/request/ir")
    public ResponseData searchRequestAuditCompanyIR() throws Exception {

        IrProgressVO progressVO = investorRelationService.searchIRProgress();

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(progressVO)
                .build();
    }

    /**
     * Category: 마이페이지(기업)
     * Page: 투자심사요청
     * 기업 IR 미리보기 (투자심사요청용)
     * @return
     */
    @ApiOperation(value = "기업 IR 미리보기 (투자심사요청용)")
    @GetMapping("/request/ir/preview")
    public ResponseData searchRequestAuditCompanyIRPreview(@RequestParam("tabType") String tabType) throws Exception {

        IrPreviewVO previewVO = investorRelationService.searchIRPreview(tabType, null);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(previewVO)
                .build();
    }

    /**
     * Category: 마이페이지(기업)
     * Page: 투자심사요청
     * IR 자료 미리보기 조회 (투자심사 상세 페이지 미리보기용)
     * @return
     */
    @ApiOperation(value = "IR 자료 미리보기 조회 (투자심사 상세 페이지 미리보기용)")
    @GetMapping("/ir/preview")
    public ResponseData searchAuditCompanyIRPreview(@RequestParam("tabType") String tabType, @RequestParam("invmExntRqstId") String invmExntRqstId) throws Exception {

        IrPreviewVO previewVO = investorRelationService.searchAuditIRPreview(tabType, invmExntRqstId);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(previewVO)
                .build();
    }

    /**
     * Category: 마이페이지(기업)
     * Page: 투자심사요청
     * 간편서류 다운로드
     * TODO : 삭제 예정
     * @return
     */
//    @SkipCheckAspect
//    @GetMapping("/simple/download/{id}")
//    public void downloadCompanySimpleDocument(@PathVariable("id") String id, HttpServletResponse response) {
//        try {
//
//
//        } catch(BizException bx) {
//            log.error("Fail Trace", bx);
//
//        }catch(Exception ex) {
//            log.error("Fail Trace", ex);
//        }
//    }

    /** ================================ Post Method Mapping ================================ **/

    /**
     * 기업 자동 갱신 동의 여부 갱신
     * TODO : 삭제 예정 (투자심사요청 제출 시 한번에 처리)
     * @return
     */
//    @PostMapping("/ir/agreement/save")
//    public ResponseData saveAuditIRAgreement(@RequestBody PostYnVO postYnVO) throws Exception {
//
//        companyService.saveCompanyIRAgreement(postYnVO.getCheckYn());
//
//        return ResponseData.builder()
//                .code(HttpStatus.OK.value())
//                .message(HttpStatus.OK.getReasonPhrase())
//                .build();
//    }

    /**
     * 간편서류제출 키 발급
     * TODO : 삭제 예정 (공통 컨트롤러 처리)
     * @return
     * @throws Exception
     */
//    @PostMapping("/simple/doc/key/save")
//    public ResponseData createSimpleDocKey() throws Exception {
//        Map<String, String> result = companyService.createSimpleDocKey();
//
//        return ResponseData.builder()
//                .code(HttpStatus.OK.value())
//                .message(HttpStatus.OK.getReasonPhrase())
//                .data(result)
//                .build();
//    }

    /**
     * Category: 마이페이지(기업)
     * Page: 투자심사요청
     * 투자심사요청 입력
     * @return
     */
    @ApiOperation(value = "투자심사요청 입력")
    @PostMapping("/request/save")
    public ResponseData saveInvestAuditRequest(@RequestBody InvestAuditVO investAuditVO) throws Exception {

        investAuditService.saveInvestAuditRequest(investAuditVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    /** Message **/

    /**
     * Category: 마이페이지(기업)
     * Page: 투자심사요청
     * 메시지 보내기
     * @return
     */
    @ApiOperation(value = "메시지 보내기")
    @PostMapping("/message/send")
    public ResponseData sendAuditMessage(@RequestBody MessageVO auditMessageVO) throws Exception {

        messageService.sendAuditMessage(auditMessageVO, IvtCode.YnTypeEnum.N, ComCode.MESSAGE_AUDIT, IvtCode.YnTypeEnum.Y);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    /**
     * Category: 마이페이지
     * Page: 투자심사요청
     * 메시지 답장하기
     * @return
     */
    @ApiOperation(value = "메시지 답장하기")
    @PostMapping("/message/reply")
    public ResponseData replyAuditMessage(@RequestBody MessageVO auditMessageVO) throws Exception {

        messageService.replyMessage(auditMessageVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    /**
     * Category: 마이페이지(기업)
     * Page: 투자심사요청
     * 투자심사요청 신청 취소
     * @param postSimpleBodyVO
     * @return
     */
    @ApiOperation(value = "투자심사요청 신청 취소")
    @PostMapping("/request/cancel")
    public ResponseData cancelInvestAuditRequest(@RequestBody PostSimpleBodyVO.SimpleIdBody postSimpleBodyVO) throws Exception {

        investAuditService.cancelAudit(postSimpleBodyVO.getId());

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }
}
