package com.ibk.sb.restapi.biz.service.admin.repo;

import java.util.List;

import com.ibk.sb.restapi.biz.service.audit.vo.InvestAuditStageVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.ibk.sb.restapi.biz.service.admin.vo.AdminInvestAuditDetailVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminInvestAuditExcelDetailVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminInvestAuditExcelVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminInvestAuditPageVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminInvestAuditSummaryVO;
import com.ibk.sb.restapi.biz.service.admin.vo.VncmLoanVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestVncmLoanVO;

@Mapper
public interface AdminAuditRepo {

	// 투자희망신청현황 페이징조회
	public List<AdminInvestAuditSummaryVO> adminSelectAuditList(AdminInvestAuditPageVO adminInvestAuditPageVO);

	// 투자희망신청현황 상세조회
	public AdminInvestAuditDetailVO searchAdminAuditDetail(@Param("invmExntRqstId") String invmExntRqstId);

	// 투자희망신청현황 리스트 엑셀 다운로드
	public List<AdminInvestAuditExcelVO> adminExcelAuditList(AdminInvestAuditPageVO adminInvestAuditPageVO);

	// 투자희망신청현황 세부 엑셀 다운로드
	public List<AdminInvestAuditExcelDetailVO> adminExcelAuditDetail(AdminInvestAuditPageVO adminInvestAuditPageVO);

	// 투자희망신청현황 심사결과 상태변경
	public int adminProgressUpdateAudit(AdminInvestAuditDetailVO adminInvestAuditDetailVO);

	// 심사결과 등록 및 수정
	public int adminInsertInvestAuditStage(InvestAuditStageVO investAuditStageVO);

	// 투자희망신청현황 투자 유치 명세 내역 조회
	public List<VncmLoanVO> searchAdminVncmLoanInvestList(@Param("utlinsttId") String utlinsttId);
}
