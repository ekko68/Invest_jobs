package com.ibk.sb.restapi.biz.service.batch.repo;

import com.ibk.sb.restapi.biz.service.audit.vo.InvestAuditStageVO;
import com.ibk.sb.restapi.biz.service.audit.vo.InvestAuditVO;
import com.ibk.sb.restapi.biz.service.batch.vo.transfer.*;
import com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.nw.*;
import com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.ts.*;
import com.ibk.sb.restapi.biz.service.batch.vo.transfer.result.TransferExntStatusVO;
import com.ibk.sb.restapi.biz.service.batch.vo.transfer.result.TransferMappingVO;
import com.ibk.sb.restapi.biz.service.common.vo.ComFileInfoVO;
import com.ibk.sb.restapi.biz.service.company.vo.base.CompanyBasicVO;
import com.ibk.sb.restapi.biz.service.company.vo.invest.CompanyInvestFieldVO;
import com.ibk.sb.restapi.biz.service.company.vo.invest.CompanyInvestHopeVO;
import com.ibk.sb.restapi.biz.service.company.vo.invest.CompanyUtilTechVO;
import com.ibk.sb.restapi.biz.service.company.vo.product.CompanyProductVO;
import com.ibk.sb.restapi.biz.service.ir.vo.base.InvestRelationVO;
import com.ibk.sb.restapi.biz.service.ir.vo.base.IrInvestVO;
import com.ibk.sb.restapi.biz.service.ir.vo.extra.IrProductVO;
import com.ibk.sb.restapi.biz.service.ir.vo.progress.IrProgressVO;
import com.ibk.sb.restapi.biz.service.ir.vo.stockholder.IrStockHolderVO;
import com.ibk.sb.restapi.biz.service.vc.vo.portfolio.VcPortfolioVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.sql.Timestamp;
import java.util.List;

@Mapper
public interface DataTransferRepo {

    /** 기등록 이관건 확인 */

    // 기등록 이관건 확인
    public TransferMappingVO selectTransferMappingData(@Param("asiUtlinsttId") String asiUtlinsttId,
                                                       @Param("asiInvmaplcMnno") String asiInvmaplcMnno);

    // 기등록 투자심사 이관 정보 파일 삭제
    public Integer updateInvmExntFileDelYnById(@Param("invmExntRqstId") String invmExntRqstId);
    // 기등록 투자심사 이관 정보 삭제
    public Integer deleteInvmExntDataById(@Param("invmExntRqstId") String invmExntRqstId);
    // 기등록 투자심사 이관 진행도 삭제
    public Integer deleteInvmExntPsgsById(@Param("invmExntRqstId") String invmExntRqstId);

    // 이관 매핑 정보 병합
    public Integer mergeTransferMapping(TransferMappingVO transferMappingVO);

//    // 이관 매핑 정보 기업정보갱신 사용여부 수정
//    // 매핑 정보 등록 후 같은 트랜잭션 내에서 한번만 수정 되므로 따로 수정일시 컬럼 없음
//    // ENPR_INFO_TRCT_BASE_YN = Y는 해당 투자심사요청건으로 기업정보 갱신 프로세스가 진행된 적이 있음을 남기기 위해 이후 N으로 수정을 하지 않음
//    // -> 다시 N으로 바꿀 경우 수정관련 컬럼 추가를 고려
//    public Integer updateTransferMappingBaseYn(@Param("asiUtlinsttId") String asiUtlinsttId,
//                                               @Param("asiInvmaplcMnno") String asiInvmaplcMnno,
//                                               @Param("enprInfoTrctBaseYn") String enprInfoTrctBaseYn);

    /** 투자심사건별 조회 등록 : (신규 생성 투자심사아이디 기준 등록) */

    // 기존 투자심사신청 리스트 조회 : 이력 정보 함께 조회
    public List<BeforeIvt101MVO> selectBeforeExntRqstAllList(@Param("startRange") Integer startRange,
                                                             @Param("endRange") Integer endRange);

    // 투자 심사 결과 정보 조회
    // 이력에 0006(심사완료) 정보가 있는 경우 심사관리번호 + 기업아이디 + 최신 일련번호를 기준으로 조회
    // 현재 2023.08.09 기준 운영, 개발 모두 실제 데이터가 없으며
    // 관련 로직도 찾아볼수 없는 상태기에 정확한 정보를 확인할 수는 없음
    // -> 우선 서비스에서는 관련 부분 주석처리, 추후에 정말로 필요한 경우 수정해서 쓸것
    public BeforeIvt301MVO selectBeforeExntRsltData(@Param("invmAplcMngmNo") String invmAplcMngmNo,
                                                    @Param("usisId") String usisId);

    /*=========================================================*/

    // 투자심사신청 정보 등록
    public Integer insertTransferExntData(InvestAuditVO tranferAuditData);

    // 투자심사신청 진행 이력 병합
    // 기존 코드가 0001~0004 까지는 요청에 편입되기 때문에 해당 레코드의 경우 update처리
    public Integer mergeTransferExntHistoryData(InvestAuditStageVO tranferAuditHistoryData);

    // 투자심사신청 정보 심사결과 정보 갱신
    // 신청 진행 이력 중 0006 (심사처리)가 있는 경우 해당 정보 업데이트
    public Integer updateTransferExntRsltData(InvestAuditVO tranferAuditRsltData);

    // 투자심사 결과 승인된 건에 대해 비공개로 포트폴리오 등록
    public Integer insertTransferVcPortfolio(VcPortfolioVO vcPortfolioVO);

    /*========================================================= */

    // 이관 등록 투자심사건 최종 진행 상태별 통계 목록 조회
    public List<TransferExntStatusVO> selectTransferExntPgsgStatsticList(@Param("invmExntRqstIdList") List<String> invmExntRqstIdList);
    // 이관 등록 투자심사건 심사결과 상태별 통계 목록 조회
    public List<TransferExntStatusVO> selectTransferExntRsltStatsticList(@Param("invmExntRqstIdList") List<String> invmExntRqstIdList);

    /** 기업별 최신 정보 등록, 갱신 */

    /*=========================================================*/

    // 기업별 최신 투자심사신청 리스트 조회 : 각 일련번호가 앞인 주 사업장 정보까지 함께 조회
    public List<BeforeIvt101MVO> selectBeforeUsisRcntExntList(@Param("startRange") Integer startRange,
                                                              @Param("endRange") Integer endRange);

    /*=========================================================*/

    // 신규 투자박스 현재 상세정보 테이블 조회
    public CompanyBasicVO selectExistCompDetailData(@Param("utlinsttId") String utlinsttId);

    // 신규 투자박스 현재 비즈니스 분야 목록 조회
    public List<CompanyInvestFieldVO> selectExistCompIvtFieldList(@Param("utlinsttId") String utlinsttId);
    // 신규 투자박스 현재 활용기술 목록 조회
    public List<CompanyUtilTechVO> selectExistCompTechList(@Param("utlinsttId") String utlinsttId);

    // 비즈니스 (투자) 분야 코드 검색 By 분야명
    public List<String> selectInvestFieldCdListByFieldNm(@Param("fieldNmList") List<String> fieldNmList);
    // 활용기술 코드 검색 By 분야명
    public List<String> selectUtilTechCdListByTechNm(@Param("techNmList") List<String> techNmList);

    // 신규 투자박스 현재 투자희망정보 테이블 조회
    public CompanyInvestHopeVO selectExistCompIvtHopeData(@Param("utlinsttId") String utlinsttId);

    /*=========================================================*/

    // IR 기존 진행도 조회 (마지막 업데이트 날짜 확인을 위함)
    public IrProgressVO selectUsisIrLastUpdateProgress(@Param("utlinsttId") String utlinsttId);

    // 신규 투자박스 현재 IR 제품정보 테이블 조회
    public IrProductVO selectExistCompIrProdData(@Param("utlinsttId") String utlinsttId);

    // 신규 투자박스 현재 IR 기본정보 테이블 조회
    public InvestRelationVO selectExistCompIrBasicData(@Param("utlinsttId") String utlinsttId);

    // 신규 투자박스 현재 IR 주주정보 리스트 조회
    public List<IrStockHolderVO> selectExistCompIrStckList(@Param("utlinsttId") String utlinsttId);

    // 신규 투자박스 현재 IR 기존투자유치 리스트 조회
    public List<IrInvestVO> selectExistCompIrIvtList(@Param("utlinsttId") String utlinsttId);

    /*=========================================================*/

    // 기업별 최신 투자심사 주주 정보 조회
    public List<BeforeIvt102MVO> selectBeforeUsisRcntStkHldrList(@Param("invmAplcMngmNo") String invmAplcMngmNo,
                                                                 @Param("usisId") String usisId);

    // 기업별 최신 투자심사 기존 투자 유치 정보 조회
    public List<BeforeIvt103MVO> selectBeforeUsisRcntIvtSetList(@Param("invmAplcMngmNo") String invmAplcMngmNo,
                                                                @Param("usisId") String usisId);

    /*=========================================================*/

    // 기존 TOBE 비즈니스 분야 목록 정보 삭제
    public Integer deleteTransferUsisBizFieldByUsisId(@Param("utlinsttId") String utlinsttId);
    // 기존 TOBE 활용기술 목록 정보 삭제
    public Integer deleteTransferUsisTechByUsisId(@Param("utlinsttId") String utlinsttId);

    // 기존 TOBE IR 제품정보 삭제
    public Integer deleteTransferUsisIrProdDataByUsisId(@Param("utlinsttId") String utlinsttId);
    // 기존 TOBE IR 주주정보 삭제
    public Integer deleteTransferUsisIrStkHldrData(@Param("utlinsttId") String utlinsttId);
    // 기존 TOBE IR 투자 삭제
    public Integer deleteTransferUsisIrIvtSetData(@Param("utlinsttId") String utlinsttId);

    /*=========================================================*/

    // 기업 상세정보 병합
    public Integer mergeTransferUsisData(CompanyBasicVO trasnferCompData);

    // 비즈니스 (투자) 분야 코드 등록
    public Integer insertTransferUsisBizField(CompanyInvestFieldVO companyInvestFieldVO);
    // 활용기술 코드 등록
    public Integer insertTransferUsisTech(CompanyUtilTechVO companyUtilTechVO);

    // 기업 투자희망정보 병합
    public Integer mergeTransferUsisIvtHopeData(CompanyInvestHopeVO transferCompIvtHopData);

    // 기업 제품정보 등록
    public Integer insertTransferUsisProdData(CompanyProductVO transferCompProdData);

    // IR 제품정보 등록 (기존 신규 투자박스 데이터가 없는 경우만 이관처리)
    public Integer insertTransferUsisIrProdData(IrProductVO irProductVO);

    // IR 기본정보 병합
    public Integer mergeTransferUsisIrBasicData(InvestRelationVO transferIrBasicData);

    // IR 주주정보 등록
    public Integer insertTransferUsisIrStkHldrData(IrStockHolderVO transferIrStkHldrData);

    // IR 투자유치정보 등록
    public Integer insertTransferUsisIrIvtSetData(IrInvestVO transferIrIvtData);

    // IR 진행도 병합
    // 현재 기준 이관시 진행률이 업데이트 되는 탭 : 주주, 기술정보 (주주 유무 5%, 제품 5%, 제품설명 5%)
    // 해당 진행도 업데이트는 기존에 해당요소가 없는 경우에만 적용된다.
    // stkHldrTabRt, prdtTabRt 모두 null일 경우 service에서 실행시키지 않음
    public Integer mergeTransferIrProgressData (TransferIrProgressVO transferIrProgressVO);

    // 간편서류제출 이력 병합
    // 기업별 간편서류키 이력 정보 병합
    // TOBE 테이블과 대조하여 없는 키 값들만 입력처리함
    public Integer insertTransferNiceDocKeyData();


    /** ============ Backup Data Insert ============ */

    /* TO-BE 투자박스 : 투자심사요청, 투자심사진행단계, 간편서류이력
                     기업상세, 기업제품, 기업투자희망, 기업 비즈니스분야, 기업 활용기술
                     기업 IR (기본, 투자유치, 주주, 제품, 진행도)*/

    // 현재 투자심사 파일아이디 리스트 조회
    public List<String> selectExntRqstAtchFileList();
    // 현재 제품정보 파일아이디 리스트 조회
    public List<String> selectEnprPrdtAtchFileList();
    // 현재 포트폴리오 파일아이디 리스트 조회
    public List<String> selectVcPrtfAtchFileList();

    // 각 테이블 레코드 삭제, 백업 데이터 등록

    public Integer deleteExntTransferMapping();
    public Integer deleteExntTransferUnMapping();

    public Integer deleteExntRqstMAll();
    public Integer insertExntRqstMBackup(ExntRqstM exntRqstM);

    public Integer deleteExntPgsgRAll();
    public Integer insertExntPgsgRBackup(ExntPgsgR exntPgsgR);

    public Integer deleteSimpDocLAll();
    public Integer insertSimpDocLBackup(SimpDocL simpDocL);

    public Integer deleteEnprInfoDAll();
    public Integer insertEnprInfoDBackup(EnprInfoD enprInfoD);

    public Integer deleteEnprPrdtLAll();
    public Integer insertEnprPrdtLBackup(EnprPrdtL enprPrdtL);

    public Integer deleteEnprIvflRAll();
    public Integer insertEnprIvflRBackup(EnprIvflR enprIvflR);

    public Integer deleteEnprTchnRAll();
    public Integer insertEnprTchnRBackup(EnprTchnR enprTchnR);

    public Integer deleteInvmHopeDAll();
    public Integer insertInvmHopeDBackup(InvmHopeD invmHopeD);

    public Integer deleteIrBBsinMAll();
    public Integer insertIrBBsinMBackup(IrBBsinM irBBsinM);

    public Integer deleteIrBInvmDAll();
    public Integer insertIrBInvmDBackup(IrBInvmD irBInvmD);

    public Integer deleteIrPPrdtDAll();
    public Integer insertIrPPrdtDBackup(IrPPrdtD irPPrdtD);

    public Integer deleteIrSStchLAll();
    public Integer insertIrSStchLBackup(IrSStchL irSStchL);

    public Integer deleteIrPgrsRtDAll();
    public Integer insertIrPgrsRtDBackup(IrPgrsRtD irPgrsRtD);

    public Integer deleteVcPrtfLAll();
    public Integer insertVcPrtfLBackup(VcPrtfL vcPrtfL);

    /* AS-IS 투자박스 : 101M, 102M, 103M, 107M, 201M, 301M, 401H */

    public Integer deleteIvt101MAll();
    public Integer insertIvt101MTsData(Ivt101M ivt101M);

    public Integer deleteIvt102MAll();
    public Integer insertIvt102MTsData(Ivt102M ivt102M);

    public Integer deleteIvt103MAll();
    public Integer insertIvt103MTsData(Ivt103M ivt103M);

    public Integer deleteIvt107MAll();
    public Integer insertIvt107MTsData(Ivt107M ivt107M);

    public Integer deleteIvt201MAll();
    public Integer insertIvt201MTsData(Ivt201M ivt201M);

    public Integer deleteIvt301MAll();
    public Integer insertIvt301MTsData(Ivt301M ivt301M);

    public Integer deleteIvt401HAll();
    public Integer insertIvt401HTsData(Ivt401H ivt401H);

    // 논리삭제파일 복구
    // 논리삭제파일 복구의 경우 특수 케이스이므로 commonFile에 두지 않고 여기에 repo를 설정함
    public Integer recoverFileInfoDelYnInOnlyTable(@Param("fileId") String fileId,
                                                   @Param("amnnUserId") String amnnUserId);
}