package com.ibk.sb.restapi.biz.service.admin.repo;

import com.ibk.sb.restapi.biz.service.admin.vo.*;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestSearchEtcVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestVcConvertConsultingCancelVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestVcConvertQnaCancelVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestVcConvertSearchVO;
import com.ibk.sb.restapi.biz.service.company.vo.invest.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface AdminVcRepo {

    /**
     * 투자희망기업 마이페이지 -> 투자사 전환 요청 관련
     * 투자사 전환요청, 투자사 목록 유무 조회
     */

    // 투자사 목록 기존 데이터 확인
    public AdminConvertVcHistoryVO selectVcByUsisIdWithoutFilterUseYn (@Param("utlinsttId") String utlinsttId);

    // 투자사 목록 등록
    public Integer insertVcListStandBy(AdminConvertVcHistoryVO adminConvertVcHistoryVO);

    // 투자사 전환요청
    public Integer insertRequestConvertVC(AdminVcConvertRequestVO vcConvertRequestVO);

    // 투자사 전환요청 간접투자 추가
    public Integer insertRequestConvertVCNew(InvmCnvrsRegSaveToVcVO vcConvertRequestVO);

    // 인력정보 등록
    public Integer insertCnvrsHnfInfo(CnvrsHnfInfoVO cnvrsHnfInfoVOList);

    // 기타항목 등록
    public Integer insertEtcInptItmMngm(EtcInptItmMngmVO etcInptItmMngmVO);

    // 기타 항목 삭제
    public Integer deleteEtcInptItmMngm(String utlinsttId);
    /**
     * 운영자 포탈 - 투자사 회원관리 (투자사 전환 목록 조회)
     *
     * @return
     */
    List<AdminConvertSummaryVO> selectVcConvertList(RequestVcConvertSearchVO params);

    /**
     * 운영자 포탈 - 투자사 (운영보고서 목록 조회)
     *
     * @return
     */
    List<OrrpInfoVO> selectOrrpInfo(@Param("utlinsttId") String utlinsttId);

    /**
     * 운영자 포탈 - 투자사 (출자 목록 조회)
     *
     * @return
     */
    List<FncnInfoVO> selectFncnInfoList(@Param("utlinsttId") String utlinsttId);

    /**
     * 운영자 포탈 - 투자사 회원관리 (투자사 전환 목록 조회 간접투자 신규)
     *
     * @return
     */
    List<AdminConvertSummaryNewVO> selectVcConvertListNew(RequestSearchEtcVO params);
    
    /**
     * 운영자 포탈 - 투자사 기타 항목 목록
     *
     * @return
     */
    List<EtcInptItmMngmVO> searchVcEtcList(RequestSearchEtcVO params);

    /**
     * 운영자 포탈 - 투자사 전환 등록 정보 조회 : 간접투자 신규 추가
     *
     * @return
     */
    Optional<InvmCnvrsRegSaveToVcVO> selectConvertInfo(@Param("utlinsttId") String utlinsttId);

    /** selectConvertInfo
     * 운영자 포탈 - 투자사 회원관리 (최근 투자사 전환 요청 정보 조회)
     *
     * @return
     */
    AdminVcConvertRequestVO selectRecentVcConvertRequest(@Param("utlinsttId") String utlinsttId);

    /**
     * 운영자 포탈 - 투자사 전환 이력 등록
     * @param params
     * @return
     */
    Integer insertVcListConvertHistory(AdminConvertVcHistoryVO params);

    /**
     * 운영자 포탈 - 투자사 전환 출자 정보 등록
     * @param params
     * @return
     */
    Integer insertFncnInfo(FncnInfoVO params);


    /**
     * 운영자 포탈 - 투자사 전환 출자 정보 삭제
     * @param params
     * @return
     */
    public Integer deleteFncnInfo(String utlinsttId);
    
    /**
     * 운영자 포탈 - 투자사 목록 상태 수정
     * @param params
     * @return
     */
    Integer updateVcListConvertStatus(AdminConvertVcHistoryVO params);

    /**
     * 운영자 포탈 - 투자사 전환 상태 수정
     *
     * @param params
     * @return
     */
    Integer updateVcConvertRequest(AdminVcConvertRequestVO params);

    /**
     * 운영자 포탈 - 투자사 전환 상태 수정
     *
     * @param params
     * @return
     */
    Integer updateVcConvertRequestNew(RequestSearchEtcVO params);

    /**
     * 운영자 포탈 - 투자사 전환 기업 대기상태 컨설팅 취소처리
     */
    Integer cancelStandbyConsulting(RequestVcConvertConsultingCancelVO requestVcConvertConsultingCancelVO);

    /**
     * 운영자 포탈 - 투자사 전환 기업 완료, 만료 처리 안 된 투자심사 만료처리
     */
    Integer cancelAuditOngoing(@Param("utlinsttId") String utlinsttId,
                               @Param("rgsnUserId") String rgsnUserId,
                               @Param("AUDIT_SUGGEST") String AUDIT_SUGGEST,
                               @Param("AUDIT_REQUEST") String AUDIT_REQUEST,
                               @Param("AUDIT_EVALUATE") String AUDIT_EVALUATE,
                               @Param("AUDIT_EXPIRED") String AUDIT_EXPIRED);

    /**
     * 운영자 포탈 - 투자사 전환 기업 대기 상태 Qna 취소처리
     */
//    Integer cancelStandbyQna(RequestVcConvertQnaCancelVO requestVcConvertQnaCancelVO);
}
