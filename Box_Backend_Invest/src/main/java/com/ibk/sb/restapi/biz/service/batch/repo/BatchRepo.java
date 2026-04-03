package com.ibk.sb.restapi.biz.service.batch.repo;

import com.ibk.sb.restapi.biz.service.audit.vo.InvestAuditVO;
import com.ibk.sb.restapi.biz.service.batch.vo.batch.UpdateCompanyVO;
import com.ibk.sb.restapi.biz.service.company.vo.base.CompanyBasicVO;
import com.ibk.sb.restapi.biz.service.ir.vo.base.InvestRelationVO;
import com.ibk.sb.restapi.biz.service.ir.vo.finance.IrFinanceVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BatchRepo {

    /*
    Batch
     */

    // 기업 기본 정보 갱신
    Integer batchMergeEnprInfo(UpdateCompanyVO updateCompanyVO);

    // 기업 사업장 소재지 초기값 설정
    Integer batchInitEnprProvinceSite(@Param("utlinsttId") String utlinsttId,
                                      @Param("provinceNm") String provinceNm,
                                      @Param("GRP_CD") final String GRP_CD);

    // 기간만료 처리가 필요한 투자심사 리스트 조회
    List<InvestAuditVO> selectExpireAuditTargetList(@Param("AUDIT_SUGGEST_CODE") final String AUDIT_SUGGEST_CODE,
                                                    @Param("AUDIT_REQUEST_CODE") final String AUDIT_REQUEST_CODE,
                                                    @Param("AUDIT_EVALUATE_CODE") final String AUDIT_EVALUATE_CODE,
                                                    @Param("openDate") String openDate);

    // 투자심사 진행이력 등록 (기간만료 처리), InvestAuditRepo.insertInvestAuditStage와 동일
    public Integer insertBatchInvestAuditStage(@Param("invmExntRqstId") String invmExntRqstId,
                                               @Param("invmExntPgsgCd") String invmExntPgsgCd,
                                               @Param("rgsnUserId") String rgsnUserId);

    // 포괄적 동의 기업 리스트 조회
    List<String> selectAgreementUpdateCompanyList();

    // 기본정보 IR 이력 저장
    Integer insertIRBasicInfoHistroy(@Param("utlinsttId") String utlinsttId);

    // 재무정보 IR 이력 저장
    Integer insertIRFinancialInfoHisotry(@Param("utlinsttId") String utlinsttId);

    // 기본정보 IR 스크래핑 데이터 갱신
    Integer mergeIRBasicInfoFromInfotechScrapping(InvestRelationVO irFinanceVO);

    // 재무정보 IR 스크래핑 데이터 갱신
    Integer mergeIRFinancialInfoFromInfotechScrapping(IrFinanceVO irFinanceVO);


}
