package com.ibk.sb.restapi.biz.service.prplcm.repo;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.ibk.sb.restapi.biz.service.admin.vo.PrplCmVO;
import com.ibk.sb.restapi.biz.service.prplcm.vo.RequestPropsalCompanyPageVo;

@Mapper
public interface ProposalCompanyRepo {

	// 투자 기업 추천 이력 조회
    List<PrplCmVO> selectProposalCompanyList(RequestPropsalCompanyPageVo inVO);

    // 나의 투자 기업 추천 이력 조회
    List<PrplCmVO> searchProposalCompanyMyList(RequestPropsalCompanyPageVo inVO);
    
    // 투자 기업 추천 상세 조회
    PrplCmVO selectProposalCompany(@Param("utlinsttId") String utlinsttId,
			 					   @Param("rcmdId") String rcmdId);
    
    // 투자 기업 추천 취소 요청
    Integer cancelPrplCm(@Param("utlinsttId") String utlinsttId,
						 @Param("rcmdId") String rcmdId,
						 @Param("amnnUserId") String amnnUserId);
    
    // 투자 기업 추천 등
    Integer insertProposalCompany(PrplCmVO prplCmVO);

    // 투자 기업 추천 id 카운트
    Integer countProposalIdTotal();
}
