package com.ibk.sb.restapi.biz.api.mypage.vc;

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

import java.util.List;

import javax.servlet.http.HttpServletResponse;

@Slf4j
@RestController
@Api(tags = {"투자사 마이페이지 투자심사 서비스 API"})
@RequestMapping(path = {"/api/my/vc/audit", "/api/iv/v1/my/vc/audit"}, produces = {MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class MyVcAuditController {

    private final InvestAuditService investAuditService;

    private final InvestorRelationService investorRelationService;

    private final MessageService messageService;

    /** ================================ Get Method Mapping ================================ **/

    /**
     * Category: 마이페이지(투자사)
     * Page: 대시보드
     * 받은 투자심사요청 목록 조회
     * @return
     */
    @ApiOperation(value = "받은 투자심사요청 목록 조회")
    @GetMapping("/request/list")
    public ResponseData searchVCAuditRequestList() throws Exception {
        BadgeListVO<InvestAuditSummaryVO> requestList = investAuditService.searchDashBoardAuditList(IvtCode.AuditListTypeEnum.VC_RECEIVE);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(requestList)
                .build();
    }

    /**
     * Category: 마이페이지(투자사)
     * Page: 대시보드
     * 보낸 투자심사제안 목록 조회
     * @return
     */
    @ApiOperation(value = "보낸 투자심사제안 목록 조회")
    @GetMapping("/suggest/list")
    public ResponseData searchVCAuditSuggestList() throws Exception {
        BadgeListVO<InvestAuditSummaryVO> suggestList = investAuditService.searchDashBoardAuditList(IvtCode.AuditListTypeEnum.VC_SEND);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(suggestList)
                .build();
    }
    

    /**
     * Category: 마이페이지(투자사)
     * Page: 투자심사요청
     * 받은 투자심사요청 목록 조회
     * @return
     */
    @ApiOperation(value = "받은 투자심사요청 목록 조회")
    @GetMapping("/receive/list")
    public ResponseData searchVCAuditReceiveList(RequestSearchInvestAuditPageVO requestSearchInvestAuditPageVO) throws Exception {
        BadgePagingVO<InvestAuditSummaryVO> requestPaging = investAuditService.searchAuditListByLoginUserInfo(requestSearchInvestAuditPageVO, IvtCode.AuditListTypeEnum.VC_RECEIVE);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(requestPaging)
                .build();
    }

    /**
     * Category: 마이페이지(투자사)
     * Page: 투자심사요청
     * 보낸 투자심사제안 목록 조회
     * @return
     */
    @ApiOperation(value = "보낸 투자심사제안 목록 조회")
    @GetMapping("/send/list")
    public ResponseData searchVCAuditSendList(RequestSearchInvestAuditPageVO requestSearchInvestAuditPageVO) throws Exception {
        BadgePagingVO<InvestAuditSummaryVO> suggestPaging = investAuditService.searchAuditListByLoginUserInfo(requestSearchInvestAuditPageVO, IvtCode.AuditListTypeEnum.VC_SEND);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(suggestPaging)
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
     * Category: 마이페이지(투자사)
     * Page: 투자심사요청
     * 투자심사요청 정보 조회
     * @return
     */
    @ApiOperation(value = "투자심사요청 정보 조회")
    @GetMapping("/detail/{id}")
    public ResponseData searchInvestAudit(@PathVariable("id") String id) throws Exception {
        InvestAuditVO investAuditVO = investAuditService.searchInvestAudit(id);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(investAuditVO)
                .build();
    }

    /**
     * Category: 마이페이지(투자사)
     * Page: 투자사 전용페이지
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
     * Category: 마이페이지(투자사)
     * Page: 투자심사요청
     * IR 자료 미리보기 조회
     * @return
     */
    @ApiOperation(value = "IR 자료 미리보기 조회")
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
     * Category: 마이페이지(투자사)
     * Page: 투자심사요청
     * 간편서류 다운로드
     * TODO :  삭제 예정
     * @return
     */
//    @GetMapping("/api/iv/v1/my/vc/audit/simple/download")
//    public ResponseData downloadCompanySimpleDocument() throws Exception {
//        return ResponseData.builder()
//                .code(HttpStatus.OK.value())
//                .message(HttpStatus.OK.getReasonPhrase())
//                .build();
//    }
    
    /** ================================ Post Method Mapping ================================ **/

    /**
     * Category: 마이페이지(투자사)
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
     * Category: 마이페이지(투자사)
     * Page: 투자심사요청
     * 답변 메시지 보내기
     * @return
     */
    @ApiOperation(value = "답변 메시지 보내기")
    @PostMapping("/message/reply")
    public ResponseData replyAuditMessage(@RequestBody MessageVO auditMessageVO) throws Exception {
        messageService.replyMessage(auditMessageVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    /**
     * Category: 마이페이지(투자사)
     * Page: 투자심사요청
     * 투자심사 진행
     * @return
     */
    @ApiOperation(value = "투자심사 진행")
    @PostMapping("/evaluate/progress")
    public ResponseData progressEvaluating(@RequestBody PostSimpleBodyVO.SimpleIdBody postSimpleBodyVO) throws Exception {
        investAuditService.progressEvaluating(postSimpleBodyVO.getId());

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }


    /**
     * Category: 마이페이지(투자사)
     * Page: 투자심사요청
     * 투자 심사하기
     * @return
     */
    @ApiOperation(value = "투자희망기업 좋아요 정보 갱신")
    @PostMapping("/evaluate/complete")
    public ResponseData progressComplete(@RequestBody InvestAuditVO investAuditVO) throws Exception {
        investAuditService.progressComplete(investAuditVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }
    
    /**
     * 
     * @param RequestSearchInvestAuditPageVO
     * @param response
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "투자심사요청 내역 엑셀 다운로드")
    @PostMapping("/excel/list")
    public ResponseData auditListExcelDownload(@RequestBody RequestSearchInvestAuditPageVO requestSearchInvestAuditPageVO, HttpServletResponse response) throws Exception {
    	investAuditService.excelDownloadAudit(requestSearchInvestAuditPageVO, response);
    	
        return null;
    }
    
    /**
     * 
     * @param RequestSearchInvestAuditPageVO
     * @param response
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "투자심사요청 세부내용 엑셀 다운로드")
    @PostMapping("/excel/detail")
    public ResponseData auditDeatilExcelDownload(@RequestBody RequestSearchInvestAuditPageVO requestSearchInvestAuditPageVO, HttpServletResponse response) throws Exception {
    	investAuditService.excelDownloadAuditDetail(requestSearchInvestAuditPageVO, response);
    	
        return null;
    }
    
    /**
     * 
     * @param InvestAuditVO
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "추천직원 및 영업점 수정")
    @PostMapping("/recommend/save")
    public ResponseData updateRecommendData(@RequestBody InvestAuditVO investAuditVO) throws Exception {
    	investAuditService.updateRecommendAudit(investAuditVO);
    	
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

}
