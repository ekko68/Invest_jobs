package com.ibk.sb.restapi.biz.api.common;

import com.ibk.sb.restapi.app.common.constant.ComGroupCode;
import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.vo.BadgeListVO;
import com.ibk.sb.restapi.app.common.vo.PostSimpleBodyVO;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.biz.service.common.CommonService;
import com.ibk.sb.restapi.biz.service.common.vo.*;
import com.ibk.sb.restapi.biz.service.platform.PlatformAdditionalAuditService;
import com.ibk.sb.restapi.biz.service.platform.PlatformAlarmService;
import com.ibk.sb.restapi.biz.service.platform.PlatformFileService;
import com.ibk.sb.restapi.biz.service.platform.constant.PlatformTerms;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.ReceiveAlarmVO;
import com.ibk.sb.restapi.biz.service.platform.vo.common.IbkBranchVO;
import com.ibk.sb.restapi.biz.service.platform.vo.common.IbkBrncEmpResVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.infotechcertkey.InfotechClientKeyVO;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

@Api(tags = {"투자박스 공통 API"})
@Slf4j
@RestController
@RequestMapping(path = {"/api/common", "/api/iv/v1/common"}, produces = {MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class CommonController {

    private final CommonService commonService;

    private final PlatformAlarmService alarmService;
    private final PlatformFileService platformFileService;
    private final PlatformAdditionalAuditService platformAdditionalAuditService;

    /** ================================ Get Method Mapping ================================ **/

    /**
     * 투자박스 코드 관련
     */

    @ApiOperation(value = "(투자)분야목록 조회")
    @GetMapping("/category/list")
    public ResponseData searchCategoryList() throws Exception {

        List<InvestFieldVO> fieldList = commonService.searchInvestFieldList();
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(fieldList)
                .build();
    }

    @ApiOperation(value = "활용기술 목록 조회")
    @GetMapping("/tech/list")
    public ResponseData searchTechList() throws Exception {

        List<UtilTechVO> techList = commonService.searchTechList();
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(techList)
                .build();
    }

    @ApiOperation(value = "(사업장) 지역 목록 조회")
    @GetMapping("/region/list")
    public ResponseData searchRegionList() throws Exception {

        List<ComCodeVO> codeList = commonService.searchComCodeList(ComGroupCode.BIZ_ADR);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(codeList)
                .build();
    }

    @ApiOperation(value = "기업구분 목록 조회")
    @GetMapping("/company/type/list")
    public ResponseData searchCompanyTypeList() throws Exception {

        List<ComCodeVO> codeList = commonService.searchComCodeList(ComGroupCode.COMPANY_TYPE);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(codeList)
                .build();
    }

    @ApiOperation(value = "기업형태 목록 조회")
    @GetMapping("/company/shape/list")
    public ResponseData searchCompanyShapeList() throws Exception {

        List<ComCodeVO> codeList = commonService.searchComCodeList(ComGroupCode.COMPANY_SHAPE);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(codeList)
                .build();
    }

    @ApiOperation(value = "투자사 유형 목록 조회")
    @GetMapping("/vc/type/list")
    public ResponseData searchVCTypeList() throws Exception {

        List<ComCodeVO> codeList = commonService.searchComCodeList(ComGroupCode.INVEST_TYPE);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(codeList)
                .build();
    }

    @ApiOperation(value = "투자희망단계 목록 조회")
    @GetMapping("/invest/step/list")
    public ResponseData searchInvestStepList() throws Exception {

        List<ComCodeVO> codeList = commonService.searchComCodeList(ComGroupCode.INVEST_HOPE_STEP);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(codeList)
                .build();
    }

    @ApiOperation(value = "투자희망금액 목록 조회")
    @GetMapping("/invest/amount/list")
    public ResponseData searchInvestAmountList() throws Exception {

        List<ComCodeVO> codeList = commonService.searchComCodeList(ComGroupCode.INVEST_HOPE_AMT);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(codeList)
                .build();
    }

    @ApiOperation(value = "컨설팅유형 목록 조회")
    @GetMapping("/consulting/type/list")
    public ResponseData searchConsultingTypeList() throws Exception {

        List<ComCodeVO> codeList = commonService.searchComCodeList(ComGroupCode.CONSULT_TYPE);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(codeList)
                .build();
    }

    @ApiOperation(value = "컨설팅 상태 목록 조회")
    @GetMapping("/consulting/step/list")
    public ResponseData searchConsultingStepList() throws Exception {

        List<ComCodeVO> codeList = commonService.searchComCodeList(ComGroupCode.CONSULT_STATUS);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(codeList)
                .build();
    }

    @ApiOperation(value = "메시지 유형 목록 조회")
    @GetMapping("/message/type/list")
    public ResponseData searchMessageTypeList() throws Exception {

        List<ComCodeVO> codeList = commonService.searchComCodeList(ComGroupCode.MESSAGE_TYPE);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(codeList)
                .build();
    }

    @ApiOperation(value = "(IR 지표) 국내외 구분 지표 목록 조회")
    @GetMapping("/ir/domestic/list")
    public ResponseData searchIRDomesticTypeList() throws Exception {

        List<ComCodeVO> codeList = commonService.searchComCodeList(ComGroupCode.IR_REGION);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(codeList)
                .build();
    }

    @ApiOperation(value = "(IR 지표) 지적재산권 상태 정보 조회 목록 조회")
    @GetMapping("/ir/ip/status/list")
    public ResponseData searchIRIPStatusList() throws Exception {

        List<ComCodeVO> codeList = commonService.searchComCodeList(ComGroupCode.IR_IP);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(codeList)
                .build();
    }

    @ApiOperation(value = "(IR 지표) 주요지표 목록 조회")
    @GetMapping("/ir/index/list")
    public ResponseData searchIRIndexList() throws Exception {

        List<ComCodeVO> codeList = commonService.searchComCodeList(ComGroupCode.IR_INDICATOR);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(codeList)
                .build();
    }

    @ApiOperation(value = "Q&A 상태 목록 리스트")
    @GetMapping("/qa/status/list")
    public ResponseData searchQnaStatusList() throws Exception {

        List<ComCodeVO> codeList = commonService.searchComCodeList(ComGroupCode.QNA_STATUS);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(codeList)
                .build();
    }

    @ApiOperation(value = "Q&A 유형 목록 리스트")
    @GetMapping("/qa/type/list")
    public ResponseData searchQnaTypeList() throws Exception {

        List<ComCodeVO> codeList = commonService.searchComCodeList(ComGroupCode.QNA_TYPE);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(codeList)
                .build();
    }

    @ApiOperation(value = "투자사 전환 상태 코드 목록 조회")
    @GetMapping("/vc/convert/status/list")
    public ResponseData searchVcConvertStatusList() throws Exception {
        List<ComCodeVO> codeList = commonService.searchComCodeList(ComGroupCode.INVEST_CONVERT_STATUS);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(codeList)
                .build();
    }

    @ApiOperation(value="투자박스 공통 코드 전체 목록 조회")
    @PostMapping("/code/all")
    public ResponseData searchAllIvtComCodeList() throws Exception {

        AllIvtCmCdListVO allCode = AllIvtCmCdListVO.builder()
                .categoryList(commonService.searchInvestFieldList())
                .techList(commonService.searchTechList())
                .regionList(commonService.searchComCodeList(ComGroupCode.BIZ_ADR))
                .prmrInvmTpbsList(commonService.searchComCodeList(ComGroupCode.PRMR_INVM_TPBS))
                .companyTypeList(commonService.searchComCodeList(ComGroupCode.COMPANY_TYPE))
                .companyShapeList(commonService.searchComCodeList(ComGroupCode.COMPANY_SHAPE))
                .vcTypeList(commonService.searchComCodeList(ComGroupCode.INVEST_TYPE))
                .investStepList(commonService.searchComCodeList(ComGroupCode.INVEST_HOPE_STEP))
                .investAmountList(commonService.searchComCodeList(ComGroupCode.INVEST_HOPE_AMT))
                .consultingTypeList(commonService.searchComCodeList(ComGroupCode.CONSULT_TYPE))
                .consultingStepList(commonService.searchComCodeList(ComGroupCode.CONSULT_STATUS))
                .messageTypeList(commonService.searchComCodeList(ComGroupCode.MESSAGE_TYPE))
                .irDomesticList(commonService.searchComCodeList(ComGroupCode.IR_REGION))
                .irIpStatusList(commonService.searchComCodeList(ComGroupCode.IR_IP))
                .irIndexList(commonService.searchComCodeList(ComGroupCode.IR_INDICATOR))
                .qaStatusList(commonService.searchComCodeList(ComGroupCode.QNA_STATUS))
                .qaTypeList(commonService.searchComCodeList(ComGroupCode.QNA_TYPE))
                .vcConvertStatusList(commonService.searchComCodeList(ComGroupCode.INVEST_CONVERT_STATUS))
                .auditStepTypeList(commonService.searchComCodeList(ComGroupCode.AUDIT_STEP))
                .auditResultTypeList(commonService.searchComCodeList(ComGroupCode.AUDIT_RESULT))
                .build();

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(allCode)
                .build();
    }

    /** 알림 메시지 관련 */

    @ApiOperation(value = "투자박스 미수신 알림 유무 조회")
    @GetMapping("/alarm/invest/unread")
    public ResponseData searchInvestAlarmUnreadYn() throws Exception {

        boolean isUnread = alarmService.searchUnreadReceiveInvestAlarm();
        Map<String, String> result = new HashMap<>();
        result.put("unreadYn", isUnread ? IvtCode.YnTypeEnum.Y.name() : IvtCode.YnTypeEnum.N.name());

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    @ApiOperation(value = "투자박스 알림 리스트 조회")
    @GetMapping("/alarm/invest/list")
    public ResponseData searchReceiveInvestAlarmList(@RequestParam("page") Integer page, @RequestParam("record") Integer record) throws Exception {

        BadgeListVO<ReceiveAlarmVO> alarmList = alarmService.searchReceiveInvestHeaderAlarmList(page, record, IvtCode.YnTypeEnum.Y);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(alarmList)
                .build();
    }

    /** IBK 영업점 조회 관련 */

    @ApiOperation(value = "IBK 영업점 조회")
    @PostMapping("/ibk/brnc/list")
    public ResponseData searchIbkBranchList(@RequestBody PostSimpleBodyVO.SimpleSearchContent simpleSearchContent) throws Exception {

        List<IbkBranchVO> result = platformAdditionalAuditService.searchIbkBranchList(simpleSearchContent.getSearchContent());

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    @ApiOperation(value = "IBK 영업점 직원 조회")
    @PostMapping("/ibk/brnc/emp/list")
    public ResponseData searchIbkBranchEmployeeList (@RequestBody CmRequestBodyVO.SearchBrncEmp requestBody) throws Exception {

        List<IbkBrncEmpResVO.EmpInfoVO> result =
                platformAdditionalAuditService.searchBrncEmpList(requestBody.getBrcd(), requestBody.getEmpNm());

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    /** 약관 조회 관련 */

    @ApiOperation(value = "개인정보 처리방침 약관 조회") // todo : 약관 재확인
    @PostMapping("/terms/box/personal/info")
    public ResponseData searchIbkTermsFileNumberBoxPersonalInfo() throws Exception {

        String termsFileNum = platformFileService.searchTermsFileNumber(PlatformTerms.PlatformTermsEnum.PERSONAL_INFO);

        Map<String, String> result = new HashMap<>();
        result.put("termsFileNum", termsFileNum);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    @ApiOperation(value = "IBK BOX 서비스 제공 약관 조회") // todo : 약관 재확인
    @PostMapping("/terms/box/service/info")
    public ResponseData searchIbkTermsFileNumberBoxService() throws Exception {

        String termsFileNum = platformFileService.searchTermsFileNumber(PlatformTerms.PlatformTermsEnum.BOX_SERVICE);

        Map<String, String> result = new HashMap<>();
        result.put("termsFileNum", termsFileNum);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    @ApiOperation(value = "IBK BOX 고객정보 자동 수집 서비스 약관 조회")
    @PostMapping("/terms/box/auto/collect")
    public ResponseData searchIbkTermsFileNumberBoxAutoCollect() throws Exception {

        String collectMandatoryTermsFileNum = platformFileService.searchTermsFileNumber(PlatformTerms.PlatformTermsEnum.AUTO_SCP_COLLECT);
        String collectChoiceTermsFileNum = platformFileService.searchTermsFileNumber(PlatformTerms.PlatformTermsEnum.AUTO_SCP_COLLECT_CHOICE);
        String tradeViewTermsFileNum = platformFileService.searchTermsFileNumber(PlatformTerms.PlatformTermsEnum.AUTO_SCP_TRADE_VIEW);

        Map<String, String> result = new HashMap<>();
        result.put("collectMandatoryTermsFileNum", collectMandatoryTermsFileNum);
        result.put("collectChoiceTermsFileNum", collectChoiceTermsFileNum);
        result.put("tradeViewTermsFileNum", tradeViewTermsFileNum);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    /** ================================ Post Method Mapping ================================ **/

    @ApiOperation(value = "알림 수신 확인")
    @PostMapping("/alarm/check")
    public ResponseData checkReceiveAlarm(@RequestBody PostSimpleBodyVO.SimpleIdBody postSimpleBodyVO) throws Exception {

        boolean isUnread = alarmService.checkReceiveAlarm(postSimpleBodyVO.getId());
        Map<String, String> result = new HashMap<>();
        result.put("unreadYn", isUnread ? IvtCode.YnTypeEnum.Y.name() : IvtCode.YnTypeEnum.N.name());

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    @ApiOperation(value = "기간별 방문자 카운트")
    @PostMapping("/visitor/count")
    public ResponseData countInvestBoxVisitor() throws Exception {

        /**
         * 현재 : 투자박스 메인화면 마운트 시 카운팅함
         */

        commonService.saveConnectHistory();

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }
}
