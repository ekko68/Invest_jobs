package com.ibk.sb.restapi.biz.service.admin;

import java.io.*;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;

import com.ibk.sb.restapi.app.common.util.FileUtil;
import com.ibk.sb.restapi.biz.service.audit.InvestAuditService;
import com.ibk.sb.restapi.biz.service.audit.vo.*;
import com.ibk.sb.restapi.biz.service.platform.PlatformFileService;
import com.ibk.sb.restapi.biz.service.platform.feign.BoxOpenMnbFileFeign;
import com.ibk.sb.restapi.biz.service.platform.vo.common.BoxFileResVO;
import feign.Response;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;
import org.springframework.util.StringUtils;

import com.fasterxml.jackson.databind.type.TypeFactory;
import com.ibk.sb.restapi.app.common.constant.AlarmCode;
import com.ibk.sb.restapi.app.common.constant.ComCode;
import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.util.StringUtil;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFileUtil;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFormVO;
import com.ibk.sb.restapi.app.common.vo.BadgePagingVO;
import com.ibk.sb.restapi.app.common.vo.CustomUser;
import com.ibk.sb.restapi.biz.service.admin.repo.AdminAuditRepo;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminInvestAuditDetailVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminInvestAuditExcelDetailVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminInvestAuditExcelVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminInvestAuditPageVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminInvestAuditSummaryVO;
import com.ibk.sb.restapi.biz.service.admin.vo.VncmLoanVO;
import com.ibk.sb.restapi.biz.service.audit.repo.InvestAuditRepo;
import com.ibk.sb.restapi.biz.service.common.repo.CommonFileRepo;
import com.ibk.sb.restapi.biz.service.common.vo.ComFileInfoVO;
import com.ibk.sb.restapi.biz.service.company.repo.CompanyRepo;
import com.ibk.sb.restapi.biz.service.company.vo.invest.CompanyInvestFieldVO;
import com.ibk.sb.restapi.biz.service.company.vo.invest.CompanyUtilTechVO;
import com.ibk.sb.restapi.biz.service.ir.InvestorRelationService;
import com.ibk.sb.restapi.biz.service.ir.repo.InvestorRelationRepo;
import com.ibk.sb.restapi.biz.service.ir.vo.base.IrInvestVO;
import com.ibk.sb.restapi.biz.service.ir.vo.stockholder.IrStockHolderVO;
import com.ibk.sb.restapi.biz.service.platform.PlatformAccountService;
import com.ibk.sb.restapi.biz.service.platform.PlatformAdditionalAuditService;
import com.ibk.sb.restapi.biz.service.platform.constant.PlatformStatusEnum;
import com.ibk.sb.restapi.biz.service.platform.feign.BoxOpenCommonFeign;
import com.ibk.sb.restapi.biz.service.platform.vo.account.MainCompanyVO;
import com.ibk.sb.restapi.biz.service.platform.vo.account.MainUserVO;
import com.ibk.sb.restapi.biz.service.platform.vo.common.IbkBranchVO;
import com.ibk.sb.restapi.biz.service.platform.vo.common.IbkBrncEmpResVO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminAuditService {

	private final InvestAuditRepo investAuditRepo;

	private final AdminAuditRepo adminAuditRepo;

	private final PlatformAccountService platformAccountService;

	private final PlatformAdditionalAuditService platformAdditionalAuditService;

	private final InvestorRelationService investorRelationService;

	private final CompanyRepo companyRepo;

	private final CommonFileRepo commonFileRepo;

	private final InvestAuditService investAuditService;

	private final PlatformFileService platformFileService;

	@Value("${com.ibk.api.upload.doc.path:}") String docPath;

	/**
	 * 투자희망신청현황 페이징조회
	 * @param adminInvestAuditPageVO
	 * @throws Exception
	 */
	public BadgePagingVO<AdminInvestAuditSummaryVO> searchAdminAuditList(AdminInvestAuditPageVO adminInvestAuditPageVO) throws Exception  {

		// 리스트 조회
		List<AdminInvestAuditSummaryVO> auditList = adminAuditRepo.adminSelectAuditList(adminInvestAuditPageVO);

		// 뱃지 카운트 조회 (필요시 수정 : 현재 각 탭별 전체 크기)
		HashMap<String, Integer> badgeMap = new HashMap<>();

		RequestSearchInvestAuditByStatusVO badgeRequest = new RequestSearchInvestAuditByStatusVO(
				null, null, adminInvestAuditPageVO.getUtlinsttId(), adminInvestAuditPageVO.getComType()
		);

		List<InvestAuditSummaryVO> receive = null;
		IvtCode.TransmitTypeEnum listType = null;

		// 기업 받은 제안 전체
		badgeRequest.setEndStgCdList(Arrays.asList(ComCode.AUDIT_EVALUATE.getCode()));
		receive = investAuditRepo.selectAuditByStatus(badgeRequest);
		listType = IvtCode.TransmitTypeEnum.RECEIVE;
		receive = receive == null ? new ArrayList<>() : receive;
		badgeMap.put(IvtCode.TransmitTypeEnum.RECEIVE.name(), receive.size());

		return new BadgePagingVO<>(adminInvestAuditPageVO, auditList, receive.size(), badgeMap);
	}

	/**
	 * 투자희망신청현황 상세조회
	 * @param invmExntRqstId
	 * @throws Exception
	 */
	public AdminInvestAuditDetailVO searchAdminAuditDetail(String invmExntRqstId) throws Exception {
		// 기본정보 조회
		AdminInvestAuditDetailVO res = adminAuditRepo.searchAdminAuditDetail(invmExntRqstId);
		MainUserVO mainUserVO = platformAccountService.searchMainUser(res.getRgsnUserId(), res.getUtlinsttId());
		res.setUserNm(mainUserVO.getUserNm());
		res.setMoblphonNo(mainUserVO.getMoblphonNo());
		MainCompanyVO comInfo = platformAccountService.searchMainCompanyById(res.getUtlinsttId());

		if(res.getAnncDatFileId() != null) {
			ComFileInfoVO annc = commonFileRepo.selectFileInfo(res.getAnncDatFileId());
			res.setAnnc(annc);
		}else {
			ComFileInfoVO addt = commonFileRepo.selectFileInfo(res.getAddtDocFileId());
			res.setAddt(addt);
		}

		res.setMainBizCd(comInfo.getMainBizcnd());
		res.setMainBizCdNm(comInfo.getMainBizcndNm());

		List<IbkBranchVO> result = platformAdditionalAuditService.searchIbkBranchList(res.getBrcd());
		if (result.size() > 0)  {
			res.setBrcdNm(result.get(0).getKrnBrm());
		}

		// 주주정보 셋팅
		List<IrStockHolderVO> stockHolderList = investorRelationService.searchIRStockHolderList(res.getUtlinsttId());
		res.setIrStchList(stockHolderList == null ? new ArrayList<>() : stockHolderList);

		// 비즈니스분야 셋팅
		List<CompanyInvestFieldVO> investFieldList = companyRepo.selectCompanyInvestFieldList(res.getUtlinsttId());
		res.setBsinList(investFieldList == null ? new ArrayList<>() : investFieldList);

		// 활용기술 셋팅
		List<CompanyUtilTechVO> techList = companyRepo.selectCompanyUtilTechList(res.getUtlinsttId());
		res.setTechUtilList(techList == null ? new ArrayList<>() : techList);

		// 기존투자유치 셋팅
		List<VncmLoanVO> investList = adminAuditRepo.searchAdminVncmLoanInvestList(res.getUtlinsttId());
		res.setInvestList(investList == null ? new ArrayList<>() : investList);

		// 제출 서류 셋팅
		// 간편서류 목록 조회
        List<ComFileInfoVO> fileInfoVO = commonFileRepo.selectInfotechFileInfo(res.getInvmExntRqstId());
		res.setInfotechDoc(fileInfoVO == null ? new ArrayList<>() : fileInfoVO);

		return res;
	}

	/**
	 * 전체목록 엑셀 다운로드
	 * @param adminInvestAuditPageVO
	 * @param response
	 * @throws Exception
	 *
	 */
	public void excelDownloadAuditAdmin(AdminInvestAuditPageVO adminInvestAuditPageVO, HttpServletResponse response) throws Exception {

		adminInvestAuditPageVO.setPage(null);
		adminInvestAuditPageVO.setRecord(null);
		List<AdminInvestAuditExcelVO> auditList = null;

		// 기업 받은 제안 전체
		adminInvestAuditPageVO.setListStartType(IvtCode.AuditListTypeEnum.VC_RECEIVE);
		auditList = adminAuditRepo.adminExcelAuditList(adminInvestAuditPageVO);

		for(int i=0; i < auditList.size() ; i++) {
			auditList.get(i).setSeq(auditList.size()-i);
			MainCompanyVO comInfo = platformAccountService.searchMainCompanyById(auditList.get(i).getRqstEnprId());
			auditList.get(i).setMainBizcndNm(comInfo.getMainBizcndNm());
			List<IbkBranchVO> result = platformAdditionalAuditService.searchIbkBranchList(auditList.get(i).getBrcd());
			auditList.get(i).setBrcdNm(result.get(0).getKrnBrm());
			if(auditList.get(i).getInvmExntPgsgCd().equals("EXN00001")) {
				auditList.get(i).setInvmExntPgsgNm("신청");
			}
		}
		ExcelFormVO excelFormVO = new ExcelFormVO(AdminInvestAuditExcelVO.class, auditList, "투자희망신청현황 리스트");
		excelFormVO.setHeaderTitle("투자희망신청현황 리스트");

		ExcelFileUtil.excelDownload(excelFormVO, response);
	}

	/**
	 * 세부내용  엑셀 다운로드
	 * @param adminInvestAuditPageVO
	 * @param response
	 * @throws Exception
	 */
	public void excelDownloadAuditDetailAdmin(AdminInvestAuditPageVO adminInvestAuditPageVO, HttpServletResponse response) throws Exception {

		adminInvestAuditPageVO.setPage(null);
		adminInvestAuditPageVO.setRecord(null);
		List<AdminInvestAuditExcelDetailVO> auditList = null;

		// 기업 받은 제안 전체
		adminInvestAuditPageVO.setListStartType(IvtCode.AuditListTypeEnum.VC_RECEIVE);
		auditList = adminAuditRepo.adminExcelAuditDetail(adminInvestAuditPageVO);

		for(int i=0; i < auditList.size() ; i++) {
			auditList.get(i).setSeq(auditList.size()-i);
			MainCompanyVO comInfo = platformAccountService.searchMainCompanyById(auditList.get(i).getRqstEnprId());
			auditList.get(i).setMainBizcnd(comInfo.getMainBizcnd());
			auditList.get(i).setMainBizcndNm(comInfo.getMainBizcndNm());
			List<IbkBranchVO> result = platformAdditionalAuditService.searchIbkBranchList(auditList.get(i).getBrcd());
			auditList.get(i).setBrcd(result.get(0).getKrnBrm());
			if(auditList.get(i).getInvmExntPgsgCd().equals("EXN00001")) {
				auditList.get(i).setInvmExntPgsgNm("신청");
			}
		}
		ExcelFormVO excelFormVO = new ExcelFormVO(AdminInvestAuditExcelDetailVO.class, auditList, "투자희망신청현황 상세내역 리스트");
		excelFormVO.setHeaderTitle("투자희망신청현황 상세내역 리스트");

		ExcelFileUtil.excelDownload(excelFormVO, response);
	}

	/**
	 * 선택 파일 다운로드
	 * @param comFileInfoVO
	 * @throws Exception
	 */
	public String selectZipFileDownload(List<ComFileInfoVO> comFileInfoVO) throws Exception{

		String fileId = UUID.randomUUID().toString();
		boolean isUnix = File.separator.equals("/");
		String filePath =  this.docPath = isUnix ? docPath.replace("\\", File.separator) : docPath.replace("/", File.separator);
		String folder = platformFileService.makeFolder(filePath, fileId);
		File zipFile = new File(filePath+folder, fileId + ".zip");
		byte[] buf = new byte[4096];

		try (ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(zipFile))){
			for(ComFileInfoVO cfVO: comFileInfoVO) {
				File file = new File(filePath + "/" + cfVO.getFilePath());

				try(FileInputStream in = new FileInputStream(filePath+ "/" + cfVO.getFilePath())) {
					ZipEntry zf = new ZipEntry(file.getName());
					zos.putNextEntry(zf);
					int len = 0;
					while ((len = in.read(buf)) > 0) {
						zos.write(buf, 0, len);
					}
					zos.closeEntry();
				}
			}

		} catch (IOException e) {
			System.out.println("error!!"+ e);
		}

		ComFileInfoVO uploadFile = ComFileInfoVO.builder()
				.fileId(fileId)
				.fileNm(zipFile.getName())
				.filePath(folder+"/"+zipFile.getName())
				.filePtrn("application/zip")
				.fileEtns("zip")
				.fileSize(zipFile.getTotalSpace())
				.build();
		commonFileRepo.insertFileInfo(uploadFile);

		return fileId;
	}

	/**
	 * 추천직원 및 영업점 수정
	 * @param investAuditVO
	 * @throws Exception
	 */
	public void updateRecommendAudit (InvestAuditVO investAuditVO) throws Exception {
		investAuditVO.setAmnnUserId(investAuditVO.getAmnnUserId());
		investAuditRepo.updateRecommendAudit(investAuditVO);
	}

	/**
	 * 심사중 상태 전환
	 * @param auditId
	 * @throws Exception
	 */
	public void adminProgressEvaluating(String auditId) throws Exception {

		if(!StringUtils.hasLength(auditId)) {
			throw new BizException(StatusCode.COM0005);
		}

		// 투자심사 정보 조회
		InvestAuditVO investAuditVO = investAuditRepo.selectInvestAudit(new RequestSearchInvestAuditVO(auditId));

		// 유효성 검사
		if(investAuditVO == null) {
			throw new BizException(StatusCode.MNB0003);
		}

		// 투자심사 상태 유효성 확인
		if(!investAuditVO.getInvmExntPgsgCd().equals(ComCode.AUDIT_REQUEST.getCode())) {
			throw new BizException(StatusCode.COM0005);
		}

		// 투자심사 심사중 상태 추가
		investAuditRepo.insertInvestAuditStage(
				auditId, ComCode.AUDIT_EVALUATE.getCode(), investAuditVO.getRgsnUserId());
	}

	/**
	 * 심사결과 등록 및 수정
	 * @param adminInvestAuditDetailVO
	 * @throws Exception
	 */
	public void adminProgressUpdateAudit (AdminInvestAuditDetailVO adminInvestAuditDetailVO) throws Exception {
		adminAuditRepo.adminProgressUpdateAudit(adminInvestAuditDetailVO);
		InvestAuditStageVO investAuditStageVO = new InvestAuditStageVO();
		investAuditStageVO.setInvmExntRqstId(adminInvestAuditDetailVO.getInvmExntRqstId());
		investAuditStageVO.setRgsnUserId(adminInvestAuditDetailVO.getAmnnUserId());

		if(adminInvestAuditDetailVO.getExntRsltCd().equals("EXN01000") || adminInvestAuditDetailVO.getExntRsltCd().equals("EXN01001") ||
				adminInvestAuditDetailVO.getExntRsltCd().equals("EXN01002")) {
			investAuditStageVO.setInvmExntPgsgCd("EXN00003");
		}

		adminAuditRepo.adminInsertInvestAuditStage(investAuditStageVO);
	}
}
