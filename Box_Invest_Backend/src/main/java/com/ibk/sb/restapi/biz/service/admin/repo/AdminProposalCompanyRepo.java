package com.ibk.sb.restapi.biz.service.admin.repo;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.ibk.sb.restapi.biz.service.admin.vo.PrplCmVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestPrplcmVO;

@Mapper
public interface AdminProposalCompanyRepo {

	// 투자 기업 추천 이력 조회
    List<PrplCmVO> selectProposalCompanyList(RequestPrplcmVO inVO);
    
    // 투자 기업 추천 상세 조회
    PrplCmVO selectProposalCompany(@Param("utlinsttId") String utlinsttId,
			 					   @Param("rcmdEnprBzn") String rcmdEnprBzn);
    
    int updateOprtrCnfaYn(@Param("utlinsttId") String utlinsttId,
						  @Param("rcmdEnprBzn") String rcmdEnprBzn);
    
    int updateProposalCompany(@Param("params") PrplCmVO prplCmVO);
}
