package com.ibk.sb.restapi.biz.service.prplcm;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.ibk.sb.restapi.biz.service.fund.repo.FundRepo;
import com.ibk.sb.restapi.biz.service.platform.feign.BoxOpenDocumentFeign;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.vo.CustomUser;
import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.biz.service.admin.vo.BoxIvtFileVO;
import com.ibk.sb.restapi.biz.service.admin.vo.PrplCmVO;
import com.ibk.sb.restapi.biz.service.common.CommonFileService;
import com.ibk.sb.restapi.biz.service.common.CommonService;
import com.ibk.sb.restapi.biz.service.common.vo.ComFileInfoVO;
import com.ibk.sb.restapi.biz.service.prplcm.repo.ProposalCompanyRepo;
import com.ibk.sb.restapi.biz.service.prplcm.vo.RequestPropsalCompanyPageVo;
import com.ibk.sb.restapi.biz.service.vncmloan.repo.VncmLoanRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ProposalCompanyService {

	private final ProposalCompanyRepo proposalCompanyRepo;
	private final CommonFileService fileService;
	private final VncmLoanRepo vncmLoanRepo;
	private final CommonService commonService;
	private final BoxOpenDocumentFeign documentFeign;
	private final FundRepo fundRepo;

	/**
	 * 투자 기업 추천 이력 조회
	 * 
	 * @param inVO
	 * @return
	 * @throws Exception
	 */
	public PagingVO<PrplCmVO> searchProposalCompanyList(RequestPropsalCompanyPageVo inVO) throws Exception {

		CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		inVO.setUserGroupId(user.getUserGroupId());

		List<PrplCmVO> ProposalCompanyList = proposalCompanyRepo.selectProposalCompanyList(inVO);

		return new PagingVO<>(inVO, ProposalCompanyList);
	}

	/**
	 * 나의 투자 기업 추천 이력 조회
	 *
	 * @param inVO
	 * @return
	 * @throws Exception
	 */
	public PagingVO<PrplCmVO> searchProposalCompanyMyList(RequestPropsalCompanyPageVo inVO) throws Exception {

		CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		inVO.setUserGroupId(user.getUserGroupId());

		List<PrplCmVO> ProposalCompanyMyList = proposalCompanyRepo.searchProposalCompanyMyList(inVO);

		return new PagingVO<>(inVO, ProposalCompanyMyList);
	}

	/**
	 * 투자 기업 추천 이력 상세 조회
	 * 
	 * @param rcmdId
	 * @return
	 * @throws Exception
	 */
	public PrplCmVO searchProposalCompany(String rcmdId) throws Exception {

		CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		String utlinsttId = user.getUserGroupId();

		PrplCmVO prplCmVO = proposalCompanyRepo.selectProposalCompany(utlinsttId, rcmdId);

		if (prplCmVO == null) {
			throw new BizException(StatusCode.MNB0003);
		}

		if (prplCmVO.getAtchmnfl() != null) {
			List<ComFileInfoVO> fileList01 = new ArrayList<>();

			String atchmnfl = prplCmVO.getAtchmnfl();

			String[] arrTemp01 = atchmnfl.split(",");

			for(int i=0 ; i<arrTemp01.length ; i++) {
				ComFileInfoVO fileInfoVO = fundRepo.searchFileInfo(arrTemp01[i]);
				fileList01.add(i, fileInfoVO);
			}

			prplCmVO.setAtchmnfl2(fileList01 == null ? new ArrayList<>() : fileList01);
		}

		return prplCmVO;
	}

	/**
	 * 투자 기업 추천 요청 취소
	 * 
	 * @param prplCmVO
	 * @return
	 * @throws Exception
	 */
	public void cancelPrplCm(PrplCmVO prplCmVO) throws Exception {
		// 로그인 유저 정보 조회
		CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

		prplCmVO.setAmnnUserId(user.getUsername()); // 수정자명
		HashMap<String, Object> req = new HashMap<>();
		req.put("prnNm", prplCmVO.getPrnNm());
		req.put("rcmdEnprNm", prplCmVO.getRcmdEnprNm());
		req.put("userId", prplCmVO.getRgsnUserId());
		
		// 투자 기업 추천 요청 취소
		if(proposalCompanyRepo.cancelPrplCm(prplCmVO.getUtlinsttId(), prplCmVO.getRcmdId(), prplCmVO.getAmnnUserId()) > 0) {
			// 요청 취소 시 혁신투자부에 이메일 및 sms로 알림
//		 	commonService.sendEmailSms(req, "proposalCancel");
			System.out.println("취소");
		}else {
			throw new BizException(StatusCode.COM0000);
		}
	}

	/**
	 * 투자 기업 추천 등록
	 * 
	 * @param prplCmVO
	 * @throws Exception
	 */
	public HashMap<String, Object>  saveProposalCompany(List<MultipartFile> file, PrplCmVO prplCmVO) throws Exception {

		HashMap<String, Object> map = new HashMap<String, Object>();

		// 작성자 정보 세팅
		CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		String atchmnfl = "";

		prplCmVO.setUtlinsttId(user.getUserGroupId()); // 이용기관 회사ID
		prplCmVO.setPrnNm(user.getUserGroupName()); // 운용사명
		prplCmVO.setSbmsStts("Y"); // 추천 취소 여부
		prplCmVO.setRgsnUserId(user.getUsername()); // 등록자ID
		prplCmVO.setOprtrCnfaYn("N");

		if (file != null) {
			for (MultipartFile files : file) {
				ComFileInfoVO fileInfoVO = fileService.uploadFile(files, IvtCode.YnTypeEnum.N); // TB_BOX_IVT_FILE_ATCH_M
				String[] strFileId = fileInfoVO.getFileId().toString().split("-");																// insert
				atchmnfl += strFileId[0] + ",";
				BoxIvtFileVO boxIvtFileVO = new BoxIvtFileVO();

				boxIvtFileVO.setInvtId(prplCmVO.getUtlinsttId() + "-" + prplCmVO.getRcmdEnprBzn());
				boxIvtFileVO.setAtchDsnc("BSD0100301");
				boxIvtFileVO.setFileId(fileInfoVO.getFileId());
				boxIvtFileVO.setBsdsCd("BSD01003");
				boxIvtFileVO.setRgsnUserId(user.getUserGroupId());

				vncmLoanRepo.insertVncmLoanFileMapping(boxIvtFileVO); // TB_BOX_IVT_IDIV_ATCH_R
			}
		}

		int rcmdId = proposalCompanyRepo.countProposalIdTotal();
		LocalDate getDate = LocalDate.now(ZoneId.of("Asia/Seoul"));
		String currentYm = String.valueOf(getDate).replace("-", "");
		prplCmVO.setRcmdId("BER"+ currentYm.substring(2,6) +String.format("%03d", rcmdId));

		prplCmVO.setAtchmnfl(atchmnfl);
		proposalCompanyRepo.insertProposalCompany(prplCmVO);
		
		HashMap<String, Object> req = new HashMap<>();
		req.put("prnNm", prplCmVO.getPrnNm());
		req.put("rcmdEnprNm", prplCmVO.getRcmdEnprNm());
		req.put("userId", prplCmVO.getRgsnUserId());
		// 요청 등록 시 혁신투자부에 이메일 및 sms로 알림
//		commonService.sendEmailSms(req, "proposal");
		map.put("prplCmVO", prplCmVO);

		return map;
	}

	/**
	 * VC추천딜 데이터 연계
	 *
	 * @param prplCmVO
	 * @throws Exception
	 */
	public void vcRcmdDataReq(PrplCmVO prplCmVO, String type) throws Exception {

		if(type.equals("rgsn")) {
			List<String> fileUnqStrList = new ArrayList<>();
			HashMap<String, String> hashMap = new HashMap<>();

			// 간접투자 시스템 데이터 연계
			hashMap.put("enprRcmdId", prplCmVO.getRcmdId());				//추천ID
			hashMap.put("bzn", prplCmVO.getRcmdEnprBzn());					//사업자번호
			hashMap.put("opcmNm", prplCmVO.getPrnNm());						//운용사명
			hashMap.put("rscfNm", prplCmVO.getChrgAudofir());				//담당 심사역
			hashMap.put("cnplCon", prplCmVO.getCnpl());						//연락처
			hashMap.put("emlCon", prplCmVO.getEad());						//이메일
			hashMap.put("enprNm", prplCmVO.getRcmdEnprNm());				//기업명
			hashMap.put("prmrBsnsCon", prplCmVO.getMainBiz());				//주요사업내용
			hashMap.put("leadInvmOpcmNm", prplCmVO.getLeadInvstrPrnNm() != null ? prplCmVO.getLeadInvstrPrnNm() : "");	//리드투자자_운용사명
			hashMap.put("invmAmt", prplCmVO.getLeadInvstrAmount() != null ? prplCmVO.getLeadInvstrAmount().toString() : "0");			//리드투자자_금액

			if(prplCmVO.getLeadInvstrStep().equals("1")) { // 리드투자자_단계명
				hashMap.put("stgNm", "IR");
			} else if (prplCmVO.getLeadInvstrStep().equals("2")) {
				hashMap.put("stgNm", "투심");
			} else if (prplCmVO.getLeadInvstrStep().equals("3")) {
				hashMap.put("stgNm", "확정");
			} else if (prplCmVO.getLeadInvstrStep().equals("4")) {
				hashMap.put("stgNm", "미정");
			}

			hashMap.put("invmFnshYmd", prplCmVO.getInvmRndEndPnttm().replaceAll("-",""));						// 투자종료년월일
			hashMap.put("invmEnmtSumSttgAmt", prplCmVO.getTotInvmCnfmnAmt() != null ? prplCmVO.getTotInvmCnfmnAmt() : "0");		// 투자유치합계시작금액
			hashMap.put("invmEnmtFmtsEtvlSttgAmt", prplCmVO.getProgrsValue() != null ? prplCmVO.getProgrsValue() : "0");		// 투자유치이전기업가치시작금액
			hashMap.put("invmEnmtSumFnshAmt", prplCmVO.getTotInvmCnfmnAmtTo() != null ? prplCmVO.getTotInvmCnfmnAmtTo().toString() : "0");	// 투자유치합계종료금액
			hashMap.put("invmEnmtFmtsEtvlFnshAmt", prplCmVO.getProgrsValueTo() != null ? prplCmVO.getProgrsValueTo().toString() : "0");	// 투자유치이전기업가치종료금액
			hashMap.put("rcmdOpnnCon", prplCmVO.getRecomendOpinion());				// 추천의견내용
			hashMap.put("cnfaYn", prplCmVO.getOprtrCnfaYn());						// 확인여부
			hashMap.put("memoCon", prplCmVO.getSprnFild() != null ? prplCmVO.getSprnFild() : ""); // 메모내용
			hashMap.put("cnclYn", prplCmVO.getSbmsStts());							// 취소여부

			String [] testStr = prplCmVO.getAtchmnfl().split(",");
			for(int i=0; i<testStr.length ; i++) {
				String[] fileUnqStr = testStr[i].toString().split("-");
				fileUnqStrList.add(i , fileUnqStr[0].toString());
			}
			hashMap.put("fileUnqNo", fileUnqStrList.toString());			// 파일고유번호

			documentFeign.postVcPrplcmData(hashMap);
		}else {
			HashMap<String, String> cnclHashMap = new HashMap<>();
			cnclHashMap.put("enprRcmdId", prplCmVO.getRcmdId());
			documentFeign.postVcPrplcmCnclData(cnclHashMap);
		}
	}
}
