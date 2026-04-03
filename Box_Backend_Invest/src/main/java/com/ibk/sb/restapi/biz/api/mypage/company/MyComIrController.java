package com.ibk.sb.restapi.biz.api.mypage.company;

import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.biz.service.ir.InvestorRelationService;
import com.ibk.sb.restapi.biz.service.ir.vo.base.InvestRelationVO;
import com.ibk.sb.restapi.biz.service.ir.vo.extra.IrExtraVO;
import com.ibk.sb.restapi.biz.service.ir.vo.finance.IrFinanceVO;
import com.ibk.sb.restapi.biz.service.ir.vo.history.IrHistoryGroupVO;
import com.ibk.sb.restapi.biz.service.ir.vo.history.IrHistoryVO;
import com.ibk.sb.restapi.biz.service.ir.vo.member.IrMemberVO;
import com.ibk.sb.restapi.biz.service.ir.vo.plan.IrPlanAndResultVO;
import com.ibk.sb.restapi.biz.service.ir.vo.progress.IrProgressVO;
import com.ibk.sb.restapi.biz.service.ir.vo.stockholder.IrStockHolderVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
@Api(tags = {"기업 마이페이지 IR 서비스 API"})
@RequestMapping(path = {"/api/my/company/ir", "/api/iv/v1/my/company/ir"}, produces = {MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class MyComIrController {

    private final InvestorRelationService irService;

    /** ================================ Get Method Mapping ================================ **/


    /**
     * Category: 마이페이지
     * Page: IR
     * IR 작성 진행도 조회
     * @return
     */
    @ApiOperation(value = "IR 작성 진행도 조회")
    @GetMapping("/progress")
    public ResponseData searchCompanyIRProgress() throws Exception {
        IrProgressVO progressVO = irService.searchIRProgress();

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(progressVO)
                .build();
    }

    /**
     * Category: 마이페이지
     * Page: IR
     * IR 기본정보 조회
     * @return
     */
    @ApiOperation(value = "IR 기본정보 조회")
    @GetMapping("/basic/detail")
    public ResponseData searchCompanyIR() throws Exception {
        InvestRelationVO investRelationVO = irService.searchIR(null);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(investRelationVO)
                .build();
    }

    /**
     * Category: 마이페이지
     * Page: IR
     * IR 주요연혁 조회
     * @return
     */
    @ApiOperation(value = "IR 주요연혁 조회")
    @GetMapping("/history/group/list")
    public ResponseData searchCompanyIRHistoryGroupList() throws Exception {
        List<IrHistoryVO> historyList = new ArrayList<>();
        List<IrHistoryGroupVO> historyGroupList = irService.searchIRHistoryGroupList(null);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(historyGroupList.size() > 0 ? historyGroupList : historyList)
                .build();
    }

    /**
     * Category: 마이페이지
     * Page: IR
     * IR 수정용 연혁 조회 (그룹 없는 리스트)
     * @return
     */
    @ApiOperation(value = "IR 수정용 연혁 조회 (그룹 없는 리스트)")
    @GetMapping("/history/list")
    public ResponseData searchCompanyIRHistoryList() throws Exception {
        List<IrHistoryVO> historyList = irService.searchIRHistoryList();

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(historyList)
                .build();
    }

    /**
     * Category: 마이페이지
     * Page: IR
     * IR 주요인력 조회
     * @return
     */
    @ApiOperation(value = "IR 주요인력 조회")
    @GetMapping("/member/list")
    public ResponseData searchCompanyIRMemberList() throws Exception {
        List<IrMemberVO> memberList = irService.searchIRMemberList(null);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(memberList)
                .build();
    }

    /**
     * Category: 마이페이지
     * Page: IR
     * IR 주주현황 조회
     * @return
     */
    @ApiOperation(value = "IR 주주현황 조회")
    @GetMapping("/stockholders/list")
    public ResponseData searchCompanyIRStockHolderList() throws Exception {
        List<IrStockHolderVO> stockHolderList = irService.searchIRStockHolderList(null);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(stockHolderList)
                .build();
    }

    /**
     * Category: 마이페이지
     * Page: IR
     * IR 재무정보 조회
     * @return
     */
    @ApiOperation(value = "IR 재무정보 조회")
    @GetMapping("/financial/detail")
    public ResponseData searchCompanyIRFinance() throws Exception {
        IrFinanceVO finance = irService.searchIRFinance(null);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(finance)
                .build();
    }

    /**
     * Category: 마이페이지
     * Page: IR
     * IR 제품/기술/시장 정보 조회
     * @return
     */
    @ApiOperation(value = "IR 제품/기술/시장 정보 조회")
    @GetMapping("/extrainfo/detail")
    public ResponseData searchCompanyIRExtra() throws Exception {
        IrExtraVO irExtra = irService.searchIRExtra(null);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(irExtra)
                .build();
    }

    /**
     * Category: 마이페이지
     * Page: IR
     * IR 성과 및 계획 정보 조회
     * @return
     */
    @ApiOperation(value = "IR 성과 및 계획 정보 조회")
    @GetMapping("/plan/detail")
    public ResponseData searchCompanyIRPlanAndResult() throws Exception {
        IrPlanAndResultVO planAndResult = irService.searchIRPlanAndResult(null);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(planAndResult)
                .build();
    }


    /** ================================ Post Method Mapping ================================ **/

    /**
     * Category: 마이페이지
     * Page: IR
     * IR 기본정보 입력/수정
     * @return
     */
    @ApiOperation(value = "IR 기본정보 입력/수정")
    @PostMapping("/basic/save")
    public ResponseData saveCompanyIR(@RequestBody InvestRelationVO investRelationVO) throws Exception {
        irService.saveCompanyIR(investRelationVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    /**
     * Category: 마이페이지
     * Page: IR
     * IR 주요연혁 정보 입력/수정
     * @return
     */
    @ApiOperation(value = "IR 주요연혁 정보 입력/수정")
    @PostMapping("/history/save")
    public ResponseData saveCompanyIRHistory(@RequestBody List<IrHistoryVO> irHistoryList) throws Exception {
        irService.saveCompanyIRHistory(irHistoryList);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    /**
     * Category: 마이페이지
     * Page: IR
     * IR 주요인력 정보 입력/수정
     * @return
     */
    @ApiOperation(value = "IR 주요인력 정보 입력/수정")
    @PostMapping("/member/save")
    public ResponseData saveCompanyIRMember(@RequestBody List<IrMemberVO> irMemberList) throws Exception {
        irService.saveCompanyIRMember(irMemberList);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    /**
     * Category: 마이페이지
     * Page: IR
     * IR 주주현황 정보 입력/수정
     * @return
     */
    @ApiOperation(value = "IR 주주현황 정보 입력/수정")
    @PostMapping("/stockholders/save")
    public ResponseData saveCompanyIRStockHolder(@RequestBody List<IrStockHolderVO> irStockHolderList) throws Exception {
        irService.saveCompanyIRStockHolder(irStockHolderList);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    /**
     * Category: 마이페이지
     * Page: IR
     * IR 재무정보 입력/수정
     * @return
     */
    @ApiOperation(value = "IR 재무정보 입력/수정")
    @PostMapping("/financial/save")
    public ResponseData saveCompanyIRFinance(@RequestBody IrFinanceVO irFinanceVO) throws Exception {
        irService.saveCompanyIRFinance(irFinanceVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    /**
     * Category: 마이페이지
     * Page: IR
     * IR 제품/기술/시장 정보 입력/수정
     * @return
     */
    @ApiOperation(value = "IR 제품/기술/시장 정보 입력/수정")
    @PostMapping("/extrainfo/save")
    public ResponseData saveCompanyIRExtra(@RequestBody IrExtraVO irExtraVO) throws Exception{
        irService.saveCompanyIRExtra(irExtraVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    /**
     * Category: 마이페이지
     * Page: IR
     * IR 성과 및 계획 정보 입력/수정
     * @return
     */
    @ApiOperation(value = "IR 성과 및 계획 정보 입력/수정")
    @PostMapping("/plan/save")
    public ResponseData saveCompanyIRPlanAndResult(@RequestBody IrPlanAndResultVO irPlanAndResultVO) throws Exception {
        irService.saveCompanyIRPlanAndResult(irPlanAndResultVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

}
