package com.ibk.sb.restapi.biz.service.audit.repo;

import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.biz.service.audit.vo.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface InvestAuditRepo {

    /**
     * SELECT
     **/
    // 메인화면 투자심사 리스트 조회
    public List<ApplySummaryVO> selectMainAuditApplyList(RequestSearchInvestAuditVO requestSearchInvestAuditVO);

    // 상태별 투자심사 리스트 조회 (범용성 위해 수정)
    // 시작, 결과 상태코드 -> 단일 선택에서 복수 선택으로 선택범위 확장 (null 입력으로 시작범위 혹은 종료범위만 설정 가능)
    // 필요 데이터 추가시 JOIN 확인 후 확장 (현재 기업명 정도만 JOIN 중)
    public List<InvestAuditSummaryVO> selectAuditByStatus(RequestSearchInvestAuditByStatusVO requestSearchInvestAuditByStatusVO);

    // 진행중 투자심사 확인
    // 요청기업 ID, 제안투자사 ID
    public InvestAuditStageVO selectOngoingAudit(@Param("invmCmpId") String invmCmpId,
                                                 @Param("rqstEnprId") String rqstEnprId);

    // 최근 투자사 심사 제한기간 내 투자심사요청 이력 정보 조회
    public InvestAuditSummaryVO selectRecentLimitPeriodAudit(@Param("rqstEnprId") String rqstEnprId,
                                                             @Param("invmCmpId") String invmCmpId,
                                                             @Param("AUDIT_REQUEST_CODE") final String AUDIT_REQUEST_CODE);

    // 투자심사 제안 / 요청 페이징 목록 조회
    // 투자심사 제안부터 시작하는 목록 VS 투자심사 요청부터 시작하는 목록은 분리됨
    // 투자사가 제안한 투자심사는 기업 투자요청 제한 사항에 포함되지 않는다.
    public List<InvestAuditSummaryVO> selectInvestAuditList(RequestSearchInvestAuditPageVO requestSearchInvestAuditPageVO);

    // 투자심사 진행도 조회
    public List<InvestAuditStageVO> selectInvestAuditProgress(@Param("invmExntRqstId") String invmExntRqstId);

    // 투자심사 정보 조회
    public InvestAuditVO selectInvestAudit(RequestSearchInvestAuditVO requestSearchInvestAuditVO);

    // 엑셀 투자심사 제안 / 요청,제안 목록 조회
    public List<InvestAuditExcelVO> selectExcelAuditList(RequestSearchInvestAuditPageVO requestSearchInvestAuditPageVO);
    
    // 엑셀 투자심사 제안 / 요청,제안 상세 조회
    public List<InvestAuditDetailExcelVO> selectExcelAuditDetail(RequestSearchInvestAuditPageVO requestSearchInvestAuditPageVO);

    // 메인화면 ibk 투자한 기업 수 및 금액 조회
    public List<InvestAuditSummaryVO> selectIbkAuditDetail(RequestSearchInvestAuditByStatusVO requestSearchInvestAuditByStatusVO);
    
    /**
     * INSERT
     **/

    // 투자심사 제안/요청 등록
    public Integer insertInvestAudit(InvestAuditVO investAuditVO);

    // 투자심사 진행 이력 등록 (제안 / 요청 / 심사 / 심사완료 / 취소 / 기간만료(batch))
//    public Integer insertInvestAuditStage(InvestAuditStageVO investAuditStageVO);
    public Integer insertInvestAuditStage(@Param("invmExntRqstId") String invmExntRqstId,
                                          @Param("invmExntPgsgCd") String invmExntPgsgCd,
                                          @Param("rgsnUserId") String rgsnUserId);

    /**
     * UPDATE
     **/

    // 투자심사 제안 -> 요청 수정
    public Integer updateInvestAuditRequest(InvestAuditVO investAuditVO);

    // 투자 심사 (심사총평 업데이트)
    public Integer updateInvestAuditEvaluateMsg(InvestAuditVO investAuditVO);

    // 추천직원 및 영업점 수정
    public Integer updateRecommendAudit(InvestAuditVO investAuditVO);
    
}
