package com.ibk.sb.restapi.biz.service.ir.repo;

import com.ibk.sb.restapi.biz.service.ir.vo.base.InvestRelationVO;
import com.ibk.sb.restapi.biz.service.ir.vo.base.IrInvestVO;
import com.ibk.sb.restapi.biz.service.ir.vo.base.IrSupportFundVO;
import com.ibk.sb.restapi.biz.service.ir.vo.extra.*;
import com.ibk.sb.restapi.biz.service.ir.vo.finance.IrDebtVO;
import com.ibk.sb.restapi.biz.service.ir.vo.finance.IrFinanceVO;
import com.ibk.sb.restapi.biz.service.ir.vo.history.IrHistoryVO;
import com.ibk.sb.restapi.biz.service.ir.vo.member.IrMemberVO;
import com.ibk.sb.restapi.biz.service.ir.vo.plan.*;
import com.ibk.sb.restapi.biz.service.ir.vo.progress.IrProgressVO;
import com.ibk.sb.restapi.biz.service.ir.vo.progress.RequestIRProgressVO;
import com.ibk.sb.restapi.biz.service.ir.vo.stockholder.IrStockHolderVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface InvestorRelationRepo {

    /** SELECT **/
    // 작업 진행도 조회
    public IrProgressVO selectCompanyIRProgress(@Param("utlinsttId") String utlinsttId);

    // 기업 IR 기본정보 조회 (기본정보, 투자유치정보리스트, 기관지원금정보리스트)
    public InvestRelationVO selectCompanyIR(@Param("utlinsttId") String utlinsttId);
    public List<IrInvestVO> selectCompanyIRInvestList(@Param("utlinsttId") String utlinsttId);
    public List<IrSupportFundVO> selectCompanyIRSupportFundList(@Param("utlinsttId") String utlinsttId);

    // 기업 IR 주요연혁 리스트 조회
    public List<IrHistoryVO> selectCompanyIRHistoryList(@Param("utlinsttId") String utlinsttId);

    // 기업 IR 주요인력 리스트 조회
    public List<IrMemberVO> selectCompanyIRMemberList(@Param("utlinsttId") String utlinsttId);

    // 기업 IR 주주현황 리스트 조회
    public List<IrStockHolderVO> selectCompanyIRStockHolderList(@Param("utlinsttId") String utlinsttId);

    // 기업 IR 재무정보 조회(재무정보, 채무정보 리스트)
    public IrFinanceVO selectCompanyIRFinance(@Param("utlinsttId") String utlinsttId);
    public List<IrDebtVO> selectCompanyIRDebtList(@Param("utlinsttId") String utlinsttId);

    // 기업 IR 제품/기술/시장 정보 조회
    // - 제품 : 주요제품, 주요매출처 리스트
    // - 기술 : 보유기술 정보, 지적재산권 리스트
    // - 시장 : 시장리서치, 시장 타겟 리스트, 시장 플레이어 리스트
    public IrProductVO selectCompanyIRProduct(@Param("utlinsttId") String utlinsttId);
    public List<IrMainSaleVO> selectCompanyMainSaleList(@Param("utlinsttId") String utlinsttId);

    public IrTechVO selectCompanyIRTech(@Param("utlinsttId") String utlinsttId);
    public List<IrIpStateVO> selectCompanyIRIPStateList(@Param("utlinsttId") String utlinsttId);

    public IrMarketVO selectCompanyIRMarket(@Param("utlinsttId") String utlinsttId);
    public List<IrMarketTargetVO> selectCompanyIRMarketTargetList(@Param("utlinsttId") String utlinsttId);
    public List<IrMarketPlayerVO> selectCompanyIRMarketPlayerList(@Param("utlinsttId") String utlinsttId);


    // 기업 IR 성과 및 계획 정보 조회
    // - 성과 : 투자, 수상실적, 수출, 정책자금 리스트
    // - 계획 : 계획 리스트
    public List<IrInvestResultVO> selectCompanyIRInvestResultList(@Param("utlinsttId") String utlinsttId);
    public List<IrAwardResultVO> selectCompanyIRAwardResultList(@Param("utlinsttId") String utlinsttId);
    public List<IrExportResultVO> selectCompanyIRExportResultList(@Param("utlinsttId") String utlinsttId);
    public List<IrPolicyFundVO> selectCompanyIRPolicyFundList(@Param("utlinsttId") String utlinsttId);

    public List<IrMainPlanVO> selectCompanyIRMainPlanList(@Param("utlinsttId") String utlinsttId);


    /** INSERT **/
    // 작업 진행률 등록
    public Integer insertCompanyIRProgress(RequestIRProgressVO requestIRProgressVO);

    // 기업 IR 기본정보 등록 (기본정보, 투자유치정보, 기관지원금정보)
    public Integer insertCompanyIR(InvestRelationVO investRelationVO);
    public Integer insertCompanyIRInvest(IrInvestVO irInvestVO);
    public Integer insertCompanyIRSupportFund(IrSupportFundVO irSupportFundVO);

    // 기업 IR 주요연혁 등록
    public Integer insertCompanyIRHistory(IrHistoryVO irHistoryVO);

    // 기업 IR 주요인력 등록
    public Integer insertCompanyIRMember(IrMemberVO irMemberVO);

    // 기업 IR 주주현황 등록
    public Integer insertCompanyIRStockHolder(IrStockHolderVO irStockHolderVO);

    // 기업 IR 재무정보 등록 (재무정보, 채무정보)
    public Integer insertCompanyIRFinance(IrFinanceVO irFinanceVO);
    public Integer insertCompanyIRDebt(IrDebtVO irDebtVO);

    // 기업 IR 제품/기술/시장 등록
    // 제품 : 제품설명, 주요매출처
    // 기술 : 보유기술, 지적재사권
    // 시장 : 시장, 시장타겟, 시장플레이어
    public Integer insertCompanyIRProduct(IrProductVO irProductVO);
    public Integer insertCompanyIRMainSale(IrMainSaleVO irMainSaleVO);

    public Integer insertCompanyIRTech(IrTechVO irTechVO);
    public Integer insertCompanyIRIPState(IrIpStateVO irIpStateVO);

    public Integer insertCompanyIRMarket(IrMarketVO irMarketVO);
    public Integer insertCompanyIRMarketTarget(IrMarketTargetVO irMarketTargetVO);
    public Integer insertCompanyIRMarketPlayer(IrMarketPlayerVO irMarketPlayerVO);

    // 기업 IR 성과 및 계획 등록
    // 성과 : 투자, 수상, 수출, 정책자금
    // 계획
    public Integer insertCompanyIRInvestResult(IrInvestResultVO irInvestResultVO);
    public Integer insertCompanyIRAwardResult(IrAwardResultVO irAwardResultVO);
    public Integer insertCompanyIRExportResult(IrExportResultVO irExportResultVO);
    public Integer insertCompanyIRPolicyFund(IrPolicyFundVO irPolicyFundVO);

    public Integer insertCompanyIRMainPlan(IrMainPlanVO irMainPlanVO);


    /** UPDATE **/
    // IR 작성 진행도 업데이트
    public Integer updateCompanyIRProgress(RequestIRProgressVO requestIRProgressVO);

    // 기업 IR 기본정보 수정 (기본정보)
    public Integer updateCompanyIR(InvestRelationVO investRelationVO);

    // 기업 IR 재무정보 수정
    public Integer updateCompanyIRFinance(IrFinanceVO irFinanceVO);

    // 기업 IR 제품(설명)/기술(보유기술)/시장(시장리서치) 수정
    public Integer updateCompanyIRProduct(IrProductVO irProductVO);
    public Integer updateCompanyIRTech(IrTechVO irTechVO);
    public Integer updateCompanyIRMarket(IrMarketVO irMarketVO);


    /** DELETE(UPDATE) **/


    /** DELETE **/
    // 기업 IR 기존 투자유치정보 제거
    public Integer deleteCompanyIRInvestList(@Param("utlinsttId") String utlinsttId);

    // 기업 IR 기존 기관지원금정보 제거
    public Integer deleteCompanyIRSupportFundList(@Param("utlinsttId") String utlinsttId);

    // 기업 IR 기존 연혁정보 제거
    public Integer deleteCompanyIRHistoryList(@Param("utlinsttId") String utlinsttId);

    // 기업 IR 기존 주요인력정보 제거
    public Integer deleteCompanyIRMemberList(@Param("utlinsttId") String utlinsttId);

    // 기업 IR 기존 주주정보 제거
    public Integer deleteCompanyIRStockHolderList(@Param("utlinsttId") String utlinsttId);

    // 기업 IR 기존 채무정보 제거
    public Integer deleteCompanyIRDebtList(@Param("utlinsttId") String utlinsttId);

    // 기업 IR 기존 제품 주요 매출처 제거
    public Integer deleteCompanyIRMainSaleList(@Param("utlinsttId") String utlinsttId);

    // 기업 IR 기존 기술 지적재산권 제거
    public Integer deleteCompanyIRIPStateList(@Param("utlinsttId") String utlinsttId);

    // 기업 IR 기존 시장 목표 제거
    public Integer deleteCompanyIRMarketTargetList(@Param("utlinsttId") String utlinsttId);

    // 기업 IR 기존 시장 플레이어 제거
    public Integer deleteCompanyIRMarketPlayerList(@Param("utlinsttId") String utlinsttId);

    // 기업 IR 기존 투자 성과 제거
    public Integer deleteCompanyIRInvestResultList(@Param("utlinsttId") String utlinsttId);

    // 기업 IR 기존 수상 실적 제거
    public Integer deleteCompanyIRAwardResultList(@Param("utlinsttId") String utlinsttId);

    // 기업 IR 기존 수출 실적 제거
    public Integer deleteCompanyIRExportResultList(@Param("utlinsttId") String utlinsttId);

    // 기업 IR 기존 정책 자금 제거
    public Integer deleteCompanyIRPolicyFundList(@Param("utlinsttId") String utlinsttId);

    // 기업 IR 기존 주요 계획 제거
    public Integer deleteCompanyIRMainPlanList(@Param("utlinsttId") String utlinsttId);

}
