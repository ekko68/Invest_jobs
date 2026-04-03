package com.ibk.sb.restapi.biz.api.batch;

import com.ibk.sb.restapi.app.annotation.SkipCheckAspect;
import com.ibk.sb.restapi.app.common.constant.AlarmCode;
import com.ibk.sb.restapi.app.common.util.DateUtil;
import com.ibk.sb.restapi.app.common.util.StringUtil;
import com.ibk.sb.restapi.app.common.vo.AdminUserVO;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.biz.service.audit.vo.InvestAuditVO;
import com.ibk.sb.restapi.biz.service.batch.BatchService;
import com.ibk.sb.restapi.biz.service.batch.vo.batch.AgrRqstVO;
import com.ibk.sb.restapi.biz.service.batch.vo.batch.UpdateAgreementCompanyVO;
import com.ibk.sb.restapi.biz.service.batch.vo.batch.UpdateCompanyVO;
import com.ibk.sb.restapi.biz.service.company.CompanyService;
import com.ibk.sb.restapi.biz.service.company.vo.base.CompanyBasicVO;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.RequestAlarmVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.transaction.UnexpectedRollbackException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;

@Api(tags = {"투자박스 배치 서비스 API"})
@Slf4j
@RestController
@RequestMapping(path = {"/api/batch", "/api/iv/v1/batch"}, produces={"application/json"})
@RequiredArgsConstructor
public class BatchController {

    private final BatchService service;

    /*
     * Exception 처리 >
     *
     * Tx Rollback 전파와 관련하여
     *
     * 최종적으로 각 서비스마다 트랜잭션을 분리하기 위해 + throws exception 서비스를 처리하기 위해
     * controller에서 UnexpectedRollbackException을 catch함
     *
     * 각 서비스는 내부적으로 알림 등의 다른 서비스를 호출해야하는 경우를 대비하여
     * 이러한 서비스들은 try-catch 처리를 통해 rollback 마크 전파를 막는다
     *
     * 목록 배치 등록 작업시 위와 같은 방식으로 반복문 등은 controller에서 돌림으로서
     * log를 남기되 rollback이 발생해도 다음 서비스 실행을 실패시키지 않도록 처리한다.
     */

    @ApiOperation(value = "기업 기본 정보 갱신")
    @PostMapping("/utlinstt/update")
    public void updateEnprInfo(@RequestBody HashMap<String, List<UpdateCompanyVO>> companyVOList) throws Exception {

        log.info("service Name : 가입 사업자 주요 정보 갱신");
        log.info("update list size : " + companyVOList.size());

        for(UpdateCompanyVO updateData : companyVOList.get("companyVOList")) {
            try {
                // 기업 가입 날짜
                updateData.setEnprJnngDt(DateUtil.convertUtilDateToSqlDate(DateUtil.convertStringToDate(updateData.getRegistDt(), "yyyyMMddhhmmss")));

                service.updateUsisInfo(updateData);
            } catch (UnexpectedRollbackException ure) {
                log.error("Fail Transaction Update USIS Data : {} (USIS ID : {})", ure.getMessage(), updateData.getUtlinsttId());
            }
        }
    }

    @ApiOperation(value = "기간만료 투자심사 상태변경 처리 및 알림 발송처리")
    @PostMapping("/audit/alarm")
    public void batchExpiredAudit() throws Exception {
        List<InvestAuditVO> expireTargetList = service.searchBatchExpiredAuditList();

        // 기간만료 알림 요청 인스턴스 생성
        RequestAlarmVO requestAlarmVO = new RequestAlarmVO(AlarmCode.AlarmCodeEnum.AUDIT_OVER_TIME);

        // 각 투자심사 기간만료 처리 및 알림 발송
        AdminUserVO adminUserVO = new AdminUserVO(" ");
        for(InvestAuditVO auditVO : expireTargetList) {
            /**
             * sendExpiredAuditAlarm service 내부에서 try-catch Exception 처리를 하더라도
             * transaction rollback mark가 발생하는 경우 호출 메서드 (컨트롤러)로 UnexpectedRollbackException 이 throw 되므로
             * 해당 부분만 롤백처리하고 반복문을 넘기기 위해 추가로 try-catch 처리
             */
            try {
                service.sendExpiredAuditAlarm(auditVO, requestAlarmVO, adminUserVO);
            } catch (UnexpectedRollbackException ure) {
                log.error("Fail Transaction Send Audit Expire Alarm : {} (Audit ID : {})", ure.getMessage(), auditVO.getInvmExntRqstId());
            }
        }
    }

    @ApiOperation(value = "포괄적 동의 처리 기업 스크래핑 데이터 업데이트")
    @PostMapping("/agreement/ir/update")
    public ResponseData batchAgreementUpdate(@RequestBody AgrRqstVO agrRqstVO) throws Exception {

        // 배치 서비스 타입이 "search" 인 경우, 업데이트 대상 리스트 조회
        if(agrRqstVO.getType().equals("search")) {
            // 포괄적 동의 기업(기업사업자번호-ClientKey) 리스트 조회
            List<String> companyBasicList = service.searchAgreementUpdateCompanyList();
            return ResponseData.builder()
                    .code("200")
                    .data(companyBasicList)
                    .build();
        }

        boolean successFlg = true;
        List<String> errMessage = new ArrayList<>();

        // 포괄적 동의 만료 처리 ===============================
        // TODO : 포괄적 동의 유효 기간 등 재확인
        // =============================== 포괄적 동의 만료 처리
        // 배치 서비스 타입이 "update" 인 경우, 인포텍 스크래핑 후, IR 데이터 업데이트
        if(agrRqstVO.getType().equals("update")) {
            // 각 키별 업데이트 처리
            AdminUserVO adminUserVO = new AdminUserVO(" ");

            // update 요청 데이터
            CompanyBasicVO requestData = agrRqstVO.getRequestData();

            // 업데이트 동의 요청 기업 데이터 셋팅
            UpdateAgreementCompanyVO item = service.setUpdateAgreementCompanyVO(requestData);

            // 업데이트 동의 요청 기업 데이터 가 존재하지 않는 경우,
            if(item == null) {
                return ResponseData.builder()
                        .code("400")
                        .message("not exist UpdateAgreementCompanyVO")
                        .build();
            }

            /*
             * INFOTECH 스크래핑 데이터 기업 IR 기본정보 갱신
             */
            try {
                service.updateClientDataToIrBasic(item, adminUserVO);
            } catch (UnexpectedRollbackException ure) {
                log.error("Fail Transaction Update INFOTECH Business License Data to IR : {} (Company ID : {})", ure.getMessage(), item.getUtlinsttId());
                successFlg = false;
                errMessage.add("Fail Transaction Update INFOTECH Business License Data to IR");
            }

            /*
             * INFOTECH 스크래핑 데이터 기업 IR 재무정보 갱신
             */
            try {
                // 법인 사업자일 경우에만 갱신처리 (IBK API 정책)
                if(StringUtil.hasLengthWithTrim(item.getJurirno())) {
                    service.updateClientDataToIrFinance(item, adminUserVO);
                } else {
                    log.info("Skip Update INFOTECH Financial Data to IR : No Jurirno (Company ID : {})", item.getUtlinsttId());
                    successFlg = false;
                    errMessage.add("Skip Update INFOTECH Financial Data to IR : No Jurirno (Company ID :" + item.getUtlinsttId() + ")");
                }
            } catch (UnexpectedRollbackException ure) {
                log.error("Fail Transaction Update INFOTECH Financial Data to IR : {} (Company ID : {})", ure.getMessage(), item.getUtlinsttId());
                successFlg = false;
                errMessage.add("Fail Transaction Update INFOTECH Financial Data to IR : (Company ID :" + item.getUtlinsttId() + ")");
            }
        }

        if(!successFlg) {
            String message = errMessage.stream().collect(Collectors.joining());
            return ResponseData.builder()
                    .code("400")
                    .message(message)
                    .build();
        }

        return ResponseData.builder()
                .code("200")
                .build();
    }
}