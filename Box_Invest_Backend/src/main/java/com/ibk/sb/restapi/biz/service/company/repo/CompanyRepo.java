package com.ibk.sb.restapi.biz.service.company.repo;

import com.ibk.sb.restapi.biz.service.company.vo.base.*;
import com.ibk.sb.restapi.biz.service.company.vo.invest.CompanyInvestFieldVO;
import com.ibk.sb.restapi.biz.service.company.vo.invest.CompanyInvestHopeVO;
import com.ibk.sb.restapi.biz.service.company.vo.invest.CompanyUtilTechVO;
import com.ibk.sb.restapi.biz.service.company.vo.product.CompanyProductVO;
import com.ibk.sb.restapi.biz.service.company.vo.product.ProductKeywordVO;
import com.ibk.sb.restapi.biz.service.company.vo.request.RequestSearchCompanyVO;
import com.ibk.sb.restapi.biz.service.company.vo.summary.CompanyProductSummaryVO;
import com.ibk.sb.restapi.biz.service.company.vo.summary.CompanyRecommendVO;
import com.ibk.sb.restapi.biz.service.company.vo.summary.CompanySummaryVO;
import com.ibk.sb.restapi.biz.service.company.vo.summary.RecentCompanyVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CompanyRepo {

    /** SELECT **/

    // 추천 기업 목록 조회
    public List<CompanyRecommendVO> selectRecommendCompanyList(@Param("utlinsttId") String utlinsttId);

    // 메인화면 (최근) 기업정보 리스트 조회
    public List<RecentCompanyVO> selectRecentCompanyList(RequestSearchCompanyVO requestSearchCompanyVO);

    // 기업정보 페이지 기업 리스트 조회
    public List<CompanySummaryVO> selectCompanyList(RequestSearchCompanyVO requestSearchCompanyVO);

    // 기업 기본 정보 조회
    public CompanyBasicVO selectCompanyBasic(@Param("utlinsttId") String utlinsttId,
                                             @Param("loginUsisId") String loginUsisId);

    // 기업 관심분야 태그 리스트 조회
    public List<CompanyInterestVO> selectCompanyInterestTagList(@Param("utlinsttId") String utlinsttId);

    // 기업 제품 리스트 조회
    public List<CompanyProductSummaryVO> selectCompanyProductList(@Param("utlinsttId") String utlinsttId);

    // 기업 제품 상세 조회
    public CompanyProductVO selectCompanyProduct(@Param("utlinsttId") String utlinsttId,
                                                 @Param("prdtId") String prdtId);

    // 제품 키워드 리스트 조회
    public List<ProductKeywordVO> selectProductKeywordList(@Param("utlinsttId") String utlinsttId,
                                                           @Param("prdtId") String prdtId);

    // 기업 투자분야 리스트 조회
    public List<CompanyInvestFieldVO> selectCompanyInvestFieldList(@Param("utlinsttId") String utlinsttId);

    // 기업 활용기술 리스트 조회
    public List<CompanyUtilTechVO> selectCompanyUtilTechList(@Param("utlinsttId") String utlinsttId);

    // 기업 투자희망 조회
    public CompanyInvestHopeVO selectCompanyInvestHope(@Param("utlinsttId") String utlinsttId);

    // 기업 팀원목록 조회
    public List<CompanyMemberVO> selectCompanyMemberList(@Param("utlinsttId") String utlinsttId);

    // 기업 소개영상 목록 조회
    public List<CompanyIntroMediaVO> selectCompanyIntroMediaList(@Param("utlinsttId") String utlinsttId);

    // 이용기관 좋아요 매핑 조회 (prfnUsisId가 대상 이용기관임)
    public CompanyPreferenceVO selectCompanyPreferenceMapping(@Param("utlinsttId") String utlinsttId,
                                                              @Param("prfnUsisId") String prfnUsisId);

    /** MERGE **/
    // 기업 자동갱신 약관 동의 갱신
    public Integer mergeCompanyIRAgreement(CompanyBasicVO companyBasicVO);
//    public Integer insertCompanyIRAgreement(CompanyBasicVO companyBasicVO);
//    public Integer updateCompanyIRAgreement(CompanyBasicVO companyBasicVO);

    // 기업 투자박스 마이페이지 기본정보 갱신
    public Integer mergeCompanyInvestBasic(CompanyBasicVO companyBasicVO);
//    public Integer insertCompanyInvestBasic(CompanyBasicVO companyBasicVO);
//    public Integer updateCompanyInvestBasic(CompanyBasicVO companyBasicVO);

    // 기업 상세화면 조회수 증가
    public Integer mergeCompanyViewCount(@Param("utlinsttId") String utlinsttId);

    /** INSERT **/

    // 기업 투자박스 전용 기본정보 저장
//    public Integer insertCompanyInvestBasic(CompanyBasicVO companyBasicVO);

    // 기업 관심분야 태그 정보 저장
    public Integer insertCompanyInterestTag(CompanyInterestVO companyInterestVO);

    // 기업 제품정보 등록
    public Integer insertCompanyProduct(CompanyProductVO companyProductVO);

    // 기업 제품 키워드 정보 저장
    public Integer insertProductKeyword(ProductKeywordVO productKeywordVO);

    // 기업 투자분야 등록
    public Integer insertCompanyInvestField(CompanyInvestFieldVO investFieldVO);

    // 기업 활용기술 등록
    public Integer insertCompanyUtilTech(CompanyUtilTechVO utilTechVO);

    // 기업 투자희망 등록
    public Integer insertCompanyInvestHope(CompanyInvestHopeVO companyInvestHopeVO);

    // 기업 팀원정보 등록
    public Integer insertCompanyMember(CompanyMemberVO companyMemberVO);

    // 기업 소개영상 등록
    public Integer insertCompanyIntroMedia(CompanyIntroMediaVO companyIntroMediaVO);

    // 기업 좋아요 매핑 등록
    public Integer insertCompanyPreferenceMapping(CompanyPreferenceVO companyPreferenceVO);

    /** UPDATE **/

    // 기업 제품 수정
    public Integer updateCompanyProduct(CompanyProductVO companyProductVO);

    // 기업 투자희망 수정
    public Integer updateCompanyInvestHope(CompanyInvestHopeVO companyInvestHopeVO);

    // 기업 팀원정보 수정
    public Integer updateCompanyMember(CompanyMemberVO companyMemberVO);

    /** DELETE (UPDATE) **/
    // 기업 제품 논리 삭제
    public Integer deleteCompanyProduct(@Param("utlinsttId") String utlinsttId,
                                        @Param("prdtId") String prdtId,
                                        @Param("amnnUserId") String amnnUserId);

    /** DELETE **/

    // 기업 팀원 삭제
    public Integer deleteCompanyMember(@Param("utlinsttId") String utlinsttId,
                                       @Param("tmmbId") String tmmbId);

    // 기업 관심분야태그 삭제
    public Integer deleteCompanyInterestTagList(@Param("utlinsttId") String utlinsttId);

    // 제품키워드 목록 삭제
    public Integer deleteProductKeywordList(@Param("utlinsttId") String utlinsttId,
                                            @Param("prdtId") String prdtId);

    // 기업 투자분야 전체 삭제
    public Integer deleteCompanyInvestFieldList(@Param("utlinsttId") String utlinsttId);

    // 기업 활용기술 전체 삭제
    public Integer deleteCompanyUtilTechList(@Param("utlinsttId") String utlinsttId);

    // 기업 소개영상목록 삭제
    public Integer deleteCompanyIntroMediaList(@Param("utlinsttId") String utlinsttId);

    // 기업 좋아요 매핑 삭제 (prfnUsisId가 대상 이용기관)
    public Integer deleteCompanyPreferenceMapping(@Param("utlinsttId") String utlinsttId,
                                                              @Param("prfnUsisId") String prfnUsisId);
}
