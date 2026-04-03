package com.ibk.sb.restapi.biz.service.admin;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.biz.service.admin.repo.AdminProposalCompanyRepo;
import com.ibk.sb.restapi.biz.service.admin.vo.PrplCmVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestBodyAdminVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestPrplcmVO;
import com.ibk.sb.restapi.biz.service.common.CommonFileService;
import com.ibk.sb.restapi.biz.service.common.vo.ComFileInfoVO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminProposalCompanyService {

	private final AdminProposalCompanyRepo repo;
	private final CommonFileService fileService;
	Logger logger = LoggerFactory.getLogger(this.getClass());
	/**
	 * 투자 기업 추천 이력 조회
	 * 
	 * @param pageVO
	 * @return
	 * @throws Exception
	 */
	public PagingVO<PrplCmVO> proposalCompanyList(RequestPrplcmVO inVO) throws Exception {

		List<PrplCmVO> ProposalCompanyList = repo.selectProposalCompanyList(inVO);

		return new PagingVO<>(inVO, ProposalCompanyList);
	}

	/**
	 * 투자 기업 추천 이력 상세 조회
	 * 
	 * @param rcmdEnprNm
	 * @return
	 * @throws Exception
	 */
	public PrplCmVO proposalCompanyView(String utlinsttId, String rcmdEnprBzn) throws Exception {

		int insCnt = 0;
		
		PrplCmVO prplCmVO = repo.selectProposalCompany(utlinsttId, rcmdEnprBzn);
		
		if(prplCmVO.getOprtrCnfaYn() != "Y"){
			insCnt = repo.updateOprtrCnfaYn(utlinsttId, rcmdEnprBzn);
		};

		if(insCnt < 1) throw new BizException(StatusCode.MNB0004);
		
		if (prplCmVO == null) {
			throw new BizException(StatusCode.MNB0003);
		}
		
		if (prplCmVO.getAtchmnfl() != null) {
			List<ComFileInfoVO> fileList01 = new ArrayList<>();

			String atchmnfl = prplCmVO.getAtchmnfl();

			String[] arrTemp01 = atchmnfl.split(",");

			for (int i = 0; i < arrTemp01.length; i++) {
				String fileId = arrTemp01[i].trim();
				if (!fileId.equals("")) {
					fileList01.add(fileService.searchFile(fileId));
				}
			}

			prplCmVO.setAtchmnfl2(fileList01 == null ? new ArrayList<>() : fileList01);
		}
		

		return prplCmVO;
	}
	
	/**
	 * 투자 기업 추천 이력 메모 저장
	 * 
	 * @param prplCmVO
	 * @return
	 * @throws Exception
	 */
	public boolean proposalCompanySave(RequestBodyAdminVO<PrplCmVO> requestBodyAdminVO) throws Exception {

		// 관리자 계정 확인
        if(!(requestBodyAdminVO.getAdminUser() != null && requestBodyAdminVO.getAdminUser().checkAdminAccess())) throw new BizException(StatusCode.COM0005);

        if(requestBodyAdminVO.getParams() == null) throw new BizException(StatusCode.MNB0002);
    	
        // 벤처대출추천접수 정보 저장
        int insCnt = 0;
        
        requestBodyAdminVO.getParams().setRgsnUserId(requestBodyAdminVO.getAdminUser().getAdminUserId());
        requestBodyAdminVO.getParams().setAmnnUserId(requestBodyAdminVO.getAdminUser().getAdminUserId());
		
		insCnt = repo.updateProposalCompany(requestBodyAdminVO.getParams());
		
		if(insCnt < 1) throw new BizException(StatusCode.MNB0004);
		
		return true;
	}
}
