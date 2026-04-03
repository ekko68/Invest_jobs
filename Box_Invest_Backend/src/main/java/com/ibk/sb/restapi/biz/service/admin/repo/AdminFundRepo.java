package com.ibk.sb.restapi.biz.service.admin.repo;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.ibk.sb.restapi.biz.service.admin.vo.AdminFundExcelVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminFundPrdInfoPageVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminFundPrdtInfoVO;

@Mapper
public interface AdminFundRepo {
	
	// 제안받은 펀드 목록 조회
	List<AdminFundPrdtInfoVO> searchAdminFundList(AdminFundPrdInfoPageVO adminFundPrdInfoPageVO);
	
	// 제안받은 펀드 상세 조회
	ArrayList<HashMap<String, Object>> searchAdminFundDetail(@Param("fundId") String fundId);
	
	// 답변 등록
	void updateFundReplyCon(AdminFundPrdtInfoVO adminFundPrdtInfoVO);
	
	// 진행단계 수정
	void updateProgrsStg(AdminFundPrdtInfoVO adminFundPrdtInfoVO);
	
	// 제안받은 펀드 목록 엑셀 다운로드
	List<AdminFundExcelVO> excelDownloadFund(AdminFundPrdInfoPageVO adminFundPrdInfoPageVO);
}
