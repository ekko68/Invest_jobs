package com.ibk.sb.restapi.biz.service.admin;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Service;

import com.ibk.sb.restapi.app.common.util.excel.ExcelFileUtil;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFormVO;
import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.biz.service.admin.repo.AdminFundRepo;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminFundExcelVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminFundPrdInfoPageVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminFundPrdtInfoVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminRCmdExcelVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestVncmLoanVO;
import com.ibk.sb.restapi.biz.service.common.vo.ComFileInfoVO;
import com.ibk.sb.restapi.biz.service.fund.repo.FundRepo;
import com.ibk.sb.restapi.biz.service.fund.vo.opcmlInfo.OpratnHnfInfoDscplLVO;
import com.ibk.sb.restapi.biz.service.fund.vo.opcmlInfo.OpratnHnfMntncVO;
import com.ibk.sb.restapi.biz.service.fund.vo.opcmlInfo.ProFundPartcptnVO;
import com.ibk.sb.restapi.biz.service.ir.InvestorRelationService;
import com.ibk.sb.restapi.biz.service.ir.repo.InvestorRelationRepo;
import com.ibk.sb.restapi.biz.service.ir.vo.stockholder.IrStockHolderVO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminFundService {
	
	private final AdminFundRepo adminFundRepo;
	
	private final FundRepo fundRepo;
	
	private final InvestorRelationService investorRelationService;
	
	private final InvestorRelationRepo investorRelationRepo;
	
	/**
     * 제안받은 펀드 목록 조회
     * @param AdminFundPrdtInfoPageVO
     * @return
     * @throws Exception
     */
    public PagingVO<AdminFundPrdtInfoVO> searchAdminFundList(AdminFundPrdInfoPageVO adminFundPrdInfoPageVO) throws Exception  {
    	// 공지사항 리스트 조회
    	List<AdminFundPrdtInfoVO> fundList = adminFundRepo.searchAdminFundList(adminFundPrdInfoPageVO);
    	fundList = fundList == null ? new ArrayList<>() : fundList;
    	
        return new PagingVO<>(adminFundPrdInfoPageVO, fundList);
    }
    
    /**
     * 제안받은 펀드 상세 조회
     * @param fundId
     * @return
     * @throws Exception
     */
    public List searchAdminFundDetail(String fundId) throws Exception  {
    	// 리스트 조회
    	List result  = new ArrayList<>();
    	ArrayList<HashMap<String, Object>> getDetailData = adminFundRepo.searchAdminFundDetail(fundId);
    	
    	// 주주정보 조회
    	// 조회 아이디 세팅
        String userGroupId = investorRelationService.getSearchGroupId((String) getDetailData.get(0).get("utlinsttId"));
        List<IrStockHolderVO> stockHolderList = investorRelationRepo.selectCompanyIRStockHolderList(userGroupId);
        
        // 제안 펀드 참여 운용인력 조회
        List<ProFundPartcptnVO> searchProFundPartcptn = fundRepo.searchProFundPartcptn(fundId);
        
   	 	// 운용인력 유지율 매핑 조회
        List<OpratnHnfMntncVO> opratnHnfMntncList = fundRepo.searchOpratnHnfMntnc(fundId);
        
        // 운용인력 징계여부
		List<OpratnHnfInfoDscplLVO> opratnHnfInfoDscplL = fundRepo.searchopratnHnfInfoDscpl(fundId);
		
        // 첨부된 파일 정보 불러오기
		String[] strFileList = (String[]) getDetailData.get(0).get("managedtaAtchmnfl").toString().split(",");
		List<ComFileInfoVO> fileList = new ArrayList<>();
		for(int i=0 ; i<strFileList.length ; i++) {
			ComFileInfoVO fileInfoVO = fundRepo.searchFileInfo(strFileList[i].toString());
			fileList.add(i, fileInfoVO);
		}
        result.add(0, getDetailData);
        result.add(1,stockHolderList);
        result.add(2,searchProFundPartcptn);
        result.add(3,opratnHnfMntncList);
        result.add(4, opratnHnfInfoDscplL);
        result.add(5,fileList);
        
        return result;
    }
    
    /**
     * 답변등록
     * @param adminFundPrdtInfoVO
     * @return
     * @throws Exception
     */
    public void updateFundReplyCon(AdminFundPrdtInfoVO adminFundPrdtInfoVO) throws Exception  {

    	adminFundRepo.updateFundReplyCon(adminFundPrdtInfoVO); 
    	adminFundRepo.updateProgrsStg(adminFundPrdtInfoVO); 
    }
    
    /**
     * 제안받은 펀드 엑셀 다운로드
     * @param RequestVncmLoanVO
     * @param HttpServletResponse
     * @throws Exception
     */
    public void excelDownloadFund(AdminFundPrdInfoPageVO adminFundPrdInfoPageVO, HttpServletResponse response) throws Exception {

    	adminFundPrdInfoPageVO.setPage(null);
    	adminFundPrdInfoPageVO.setRecord(null);
    	
    	List<AdminFundExcelVO> fundExcelList = adminFundRepo.excelDownloadFund(adminFundPrdInfoPageVO);
    	
    	for (int i=0 ; i<fundExcelList.size() ; i++) {
    		fundExcelList.get(i).setSeq(fundExcelList.size()-i);
    		
    		if(fundExcelList.get(i).getAuditStg().equals("AUD01001")) {
    			fundExcelList.get(i).setAuditStgNm("제출완료");
    		}else if(fundExcelList.get(i).getAuditStg().equals("AUD01002")) {
    			fundExcelList.get(i).setAuditStgNm("심사중");
    		}else if(fundExcelList.get(i).getAuditStg().equals("AUD01003")) {
    			fundExcelList.get(i).setAuditStgNm("심사완료 - 수락");
    		}else if(fundExcelList.get(i).getAuditStg().equals("AUD01004")) {
    			fundExcelList.get(i).setAuditStgNm("심사완료 - 일부수락");
    		}else if(fundExcelList.get(i).getAuditStg().equals("AUD01005")) {
    			fundExcelList.get(i).setAuditStgNm("심사완료 - 거절");
    		}else if(fundExcelList.get(i).getAuditStg().equals("AUD01006")) {
    			fundExcelList.get(i).setAuditStgNm("심사완료 - 보류");
    		}
    		fundExcelList.get(i).setOrgzTrgpftNm(fundExcelList.get(i).getOrgzTrgpft() + "억원");
        }
    	
        ExcelFormVO excelFormVO = new ExcelFormVO(AdminFundExcelVO.class, fundExcelList, "제안받은 펀드");
        excelFormVO.setHeaderTitle("제안받은 펀드");

        ExcelFileUtil.excelDownload(excelFormVO, response);
    }
}