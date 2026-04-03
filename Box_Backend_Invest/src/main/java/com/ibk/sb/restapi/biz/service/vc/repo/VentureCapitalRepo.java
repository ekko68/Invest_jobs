package com.ibk.sb.restapi.biz.service.vc.repo;

import com.ibk.sb.restapi.biz.service.admin.vo.AdminVcConvertRequestVO;
import com.ibk.sb.restapi.biz.service.vc.vo.base.VcInterestVO;
import com.ibk.sb.restapi.biz.service.vc.vo.base.VcMemberVO;
import com.ibk.sb.restapi.biz.service.vc.vo.base.VcOperationReportVO;
import com.ibk.sb.restapi.biz.service.vc.vo.base.VentureCapitalBasicVO;
import com.ibk.sb.restapi.biz.service.vc.vo.invest.*;
import com.ibk.sb.restapi.biz.service.vc.vo.pagelink.VcPageBannerVO;
import com.ibk.sb.restapi.biz.service.vc.vo.pagelink.VcPageEventVO;
import com.ibk.sb.restapi.biz.service.vc.vo.pagelink.VcPageFaqVO;
import com.ibk.sb.restapi.biz.service.vc.vo.pagelink.VcPageMainVO;
import com.ibk.sb.restapi.biz.service.vc.vo.portfolio.*;
import com.ibk.sb.restapi.biz.service.vc.vo.request.*;
import com.ibk.sb.restapi.biz.service.vc.vo.summary.VcPageSummaryVO;
import com.ibk.sb.restapi.biz.service.vc.vo.summary.VentureCapitalSummaryVO;
import com.ibk.sb.restapi.biz.service.vncmloan.vo.RequestSearchVncmLoanVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface VentureCapitalRepo {

    /** SELECT **/


    // 투자사 확인 쿼리
    public VentureCapitalBasicVO selectIsVentureCapital(@Param("utlinsttId") String utlinsttId);

    // 추천 투자사 리스트 조회
    // 로그인 기업(투자사 아님) 아이디 기준
    // 일치 항목 개수 우선
    // 동일 카운트에 대해 가중치는 투자금액 / 분야 / 투자단계 순 -> 1.2 / 1.1 / 1의 가중치를 부여 (개수를 우선하기 위해 소수점으로 부여)
    public List<VentureCapitalSummaryVO> selectRecommendVCList(@Param("utlinsttId") String utlinsttId);
    
    // 투자사 페이지 목록 조회
    public List<VentureCapitalSummaryVO> selectVentureCapitalList(RequestSearchVcVO requestSearchVcVO);

    // 투자사 투자박스 전용 기본정보 조회
//    public VentureCapitalBasicVO selectVCInvestBasic(@Param("utlinsttId") String utlinsttId);

    // 투자사 기본정보 조회
    public VentureCapitalBasicVO selectVentureCapital(@Param("utlinsttId") String utlinsttId);

    // 투자사 관심분야 목록 조회 (마이페이지)
    public List<VcInterestVO> selectVCInterestTagList(@Param("utlinsttId") String utlinsttId);

    // 투자사 관심투자분야 목록 조회 (마이페이지)
    public List<VcInvestFieldVO> selectVCInvestFieldList(@Param("utlinsttId") String utlinsttId);

    // 투자사 관심활용기술 목록 조회 (마이페이지)
    public List<VcUtilTechVO> selectVCUtilTechList(@Param("utlinsttId") String utlinsttId);

    // 투자사 주요투자단계 목록 조회 (마이페이지)
    public List<VcInvestStepVO> selectVCInvestStepList(@Param("utlinsttId") String utlinsttId);

    // 투자사 주요투자지역 목록 조회 (마이페이지)
    public List<VcInvestRegionVO> selectVCInvestRegionList(@Param("utlinsttId") String utlinsttId);

    // 투자사 주요투자금액 조회 (마이페이지)
    public VcInvestAmountVO selectVCInvestAmount(@Param("utlinsttId") String utlinsttId);

    // 메인화면 총 펀드금액 조회
    public PortfolioFundAmountVO selectTotalFundAmount(@Param("oppbYn") String oppbYn);

    // 투자사 포트폴리오 목록 조회
    public List<VcPortfolioVO> selectVCPortfolioList(RequestVcPortfolioVO requestVcPortfolioVO);

    // 투자사 포트폴리오 항목 조회
    public VcPortfolioVO selectVCPortfolio(@Param("utlinsttId") String utlinsttId,
                                           @Param("prtfId") String prtfId);

    // 투자사 선호 투자유형 조회
    public List<VcPreferenceChartVO> selectVCPreferenceChart(@Param("utlinsttId") String utlinsttId);

    // 투자사 집행 지표 정보 조회
    public VcAuditExecuteIndicatorVO selectAuditExecuteIndicator(@Param("utlinsttId") String utlinsttId);

    // 투자사 투자집행 차트정보 조회
    public List<VcAuditExecuteChartVO> selectAuditExecuteChart(@Param("utlinsttId") String utlinsttId);

    // 투자사 대표심사역 페이징 리스트 조회
    public List<VcMemberVO> selectVCMemberPagingList(RequestVcMemberVO requestVcMemberVO);

    // 투자사 대표심사역 리스트 조회
    public List<VcMemberVO> selectVCMemberList(@Param("utlinsttId") String utlinsttId);

    // 투자 운용 보고서 단일 조회
    public VcOperationReportVO selectVCOperationReport(@Param("utlinsttId") String utlinsttId, @Param("rptDsnc") String rptDsnc);
    // 투자 운용 보고서 리스트 조회
    public List<VcOperationReportVO> selectVCOperationReportList(RequestVcOperationReportVO requestSearchVncmLoanVO);


    /** 투자사 전용 페이지 **/
    
    // 메인화면 투자사 전용 페이지 리스트 조회
    public List<VcPageSummaryVO> selectMainVCPageList();

    // 투자사 전용 페이지 리스트 조회
    public List<VcPageSummaryVO> selectVCPageList(RequestSearchVcPageVO requestSearchVcPageVO);

    // 투자사 전용 페이지 메인정보 조회
    public VcPageMainVO selectVCPageMain(@Param("invmCmpExusPageId") String invmCmpExusPageId);

    // 투자사 전용 페이지 이벤트 리스트 조회
    public List<VcPageEventVO> selectVCPageEventList(@Param("invmCmpExusPageId") String invmCmpExusPageId);

    // 투자사 전용 페이지 FAQ 리스트 조회
    public List<VcPageFaqVO> selectVCPageFAQList(@Param("invmCmpExusPageId") String invmCmpExusPageId);

    // 투자사 전용 페이지 배너 리스트 조회
    public List<VcPageBannerVO> selectVCPageBannerList(@Param("invmCmpExusPageId") String invmCmpExusPageId);

    /** MERGE **/
    // 투자사 투자박스 전용 기본정보 등록
    public Integer mergeVentureCapitalBasic(VentureCapitalBasicVO ventureCapitalBasicVO);
//    public Integer insertVentureCapitalBasic(VentureCapitalBasicVO ventureCapitalBasicVO);
//    public Integer updateVentureCapitalBasic(VentureCapitalBasicVO ventureCapitalBasicVO);

    /** INSERT **/

    // 투자사 대표심사역 등록
    public Integer insertVCMember(VcMemberVO vcMemberVO);
    
    // 투자사 관심분야 등록
    public Integer insertVCInterestTag(VcInterestVO interestVO);
    
    // 투자사 관심투자분야 등록
    public Integer insertVCInvestField(VcInvestFieldVO investFieldVO);

    // 투자사 관심활용기술 등록
    public Integer insertVCUtilTech(VcUtilTechVO utilTechVO);

    // 투자사 주요투자단계 등록
    public Integer insertVCInvestStep(VcInvestStepVO investStepVO);

    // 투자사 주요투자지역 등록
    public Integer insertVCInvestRegion(VcInvestRegionVO investRegionVO);
    
    // 투자사 주요투자금액 등록
    public Integer insertVCInvestAmount(VcInvestAmountVO investAmountVO);

    // 포트폴리오 정보 등록
    public Integer insertVCPortfolio(VcPortfolioVO vcPortfolioVO);

    // 투자 운용 보고서 등록
    public Integer insertVCOperationReport(VcOperationReportVO vcOperationReportVO);

    /** 투자사 전용 페이지 **/

    // 투자사 전용 페이지 메인정보 등록
    public Integer insertVCPageMain(VcPageMainVO pageMainVO);

    // 투자사 전용 페이지 이벤트정보 등록
    public Integer insertVCPageEvent(VcPageEventVO pageEventVO);

    // 투자사 전용 페이지 FAQ 정보 등록
    public Integer insertVCPageFAQ(VcPageFaqVO pageFaqVO);

    // 투자사 전용 페이지 배너정보 등록
    public Integer insertVCPageBanner(VcPageBannerVO pageBannerVO);


    /** UPDATE **/
    // 투자사 전환 요청 결과 알림 확인
    public Integer updateConvertResultCheck(AdminVcConvertRequestVO adminVcConvertRequestVO);

    // 투자사 상세화면 조회수 증가 처리
    public Integer updateVCViewCount(@Param("utlinsttId") String utlinsttId);

    // 투자사 타입 수정
    public Integer updateVentureCapitalInvestorData(VentureCapitalBasicVO ventureCapitalBasicVO);

    // 투자사 투자금액 수정
    public Integer updateVCInvestAmount(VcInvestAmountVO investAmountVO);

    // 포트폴리오 정보 수정
    public Integer updateVCPortfolio(VcPortfolioVO vcPortfolioVO);

    // 대표심사역 항목 수정
    public Integer updateVCMember(VcMemberVO vcMemberVO);

    // 투자 운용 보고서 수정
    public Integer updateVCOperationReport(VcOperationReportVO vcOperationReportVO);

    /** 투자사 전용 페이지 **/

    // 투자사 전용 페이지 메인정보 수정
    public Integer updateVCPageMain(VcPageMainVO pageMainVO);

    // 투자사 전용 페이지 메인정보 논리 삭제
    public Integer deleteVCPageMain(@Param("utlinsttId") String utlinsttId,
                                    @Param("invmCmpExusPageId") String invmCmpExusPageId,
                                    @Param("amnnUserId") String amnnUserId);

    /** DELETE **/

    // 대표심사역 삭제
    public Integer deleteVCMember(@Param("utlinsttId") String utlinsttId,
                                  @Param("rprsCrofId") String rprsCrofId);

    // 투자사 관심분야 리스트 삭제
    public Integer deleteVCInterestTagList(@Param("utlinsttId") String utlinsttId);
    
    // 투자사 관심투자분야 리스트 삭제
    public Integer deleteVCInvestFieldList(@Param("utlinsttId") String utlinsttId);
    
    // 투자사 관심활용기술 리스트 삭제
    public Integer deleteVCUtilTechList(@Param("utlinsttId") String utlinsttId);
    
    // 투자사 주요투자단계 리스트 삭제
    public Integer deleteVCInvestStepList(@Param("utlinsttId") String utlinsttId);

    // 투자사 주요투자지역 리스트 삭제
    public Integer deleteVCInvestRegionList(@Param("utlinsttId") String utlinsttId);

    // 투자사 투자금액 매핑 삭제
    public Integer deleteVCInvestAmount(@Param("utlinsttId") String utlinsttId);

    /** 투자사 전용 페이지 **/

    // 투자사 전용 페이지 이벤트 리스트 삭제
    public Integer deleteVCPageEventList(@Param("utlinsttId") String utlinsttId,
                                         @Param("invmCmpExusPageId") String invmCmpExusPageId);
    
    // 투자사 전용 페이지 FAQ 리스트 삭제
    public Integer deleteVCPageFAQList(@Param("utlinsttId") String utlinsttId,
                                       @Param("invmCmpExusPageId") String invmCmpExusPageId);
    
    // 투자사 전용 페이지 배너 리스트 삭제
    public Integer deleteVCPageBannerList(@Param("utlinsttId") String utlinsttId,
                                          @Param("invmCmpExusPageId") String invmCmpExusPageId);
    
}
