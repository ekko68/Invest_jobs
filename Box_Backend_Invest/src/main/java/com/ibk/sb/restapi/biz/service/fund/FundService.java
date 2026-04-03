package com.ibk.sb.restapi.biz.service.fund;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;

import javax.servlet.http.HttpServletResponse;

import com.ibk.sb.restapi.biz.service.fund.vo.opcmlInfo.*;
import com.ibk.sb.restapi.biz.service.fund.vo.prdInfo.*;
import com.ibk.sb.restapi.biz.service.platform.feign.BoxOpenDocumentFeign;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.util.StringValueResolver;
import org.springframework.web.multipart.MultipartFile;

import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFileUtil;
import com.ibk.sb.restapi.app.common.util.excel.ExcelFormVO;
import com.ibk.sb.restapi.app.common.vo.CustomUser;
import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.biz.service.common.CommonService;
import com.ibk.sb.restapi.biz.service.common.vo.ComFileInfoVO;
import com.ibk.sb.restapi.biz.service.fund.repo.FundRepo;
import com.ibk.sb.restapi.biz.service.ir.InvestorRelationService;
import com.ibk.sb.restapi.biz.service.ir.repo.InvestorRelationRepo;
import com.ibk.sb.restapi.biz.service.ir.vo.base.InvestRelationVO;
import com.ibk.sb.restapi.biz.service.ir.vo.finance.IrFinanceVO;
import com.ibk.sb.restapi.biz.service.ir.vo.stockholder.IrStockHolderVO;
import com.ibk.sb.restapi.biz.service.platform.PlatformAccountService;
import com.ibk.sb.restapi.biz.service.platform.PlatformDocumentService;
import com.ibk.sb.restapi.biz.service.platform.vo.account.MainUserVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.infotechscrap.InfotechScrapFinanceSummaryVO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class FundService {
	
	private final FundRepo fundRepo;
	
	private final InvestorRelationRepo investorRelationRepo;
	
	private final InvestorRelationService investorRelationService;
	
	private final PlatformDocumentService platformDocumentService;
	
    private final PlatformAccountService platformAccountService;

	private final BoxOpenDocumentFeign documentFeign;

	/**
     * 펀드제안 목록 조회
     * @param params
     * @return
     * @throws Exception
     */
    public PagingVO<FundPrdtInfoVO> searchFundList(FundPrdtInfoPageVO params) throws Exception  {
    	// 펀드제안 목록 조회
    	List<FundPrdtInfoVO> fundList = fundRepo.searchFundList(params);
    	fundList = fundList == null ? new ArrayList<>() : fundList;
    	
        return new PagingVO<>(params, fundList);
    }

	/**
	 * 나의 펀드제안 목록 조회
	 * @param params
	 * @return
	 * @throws Exception
	 */
	public PagingVO<FundPrdtInfoVO> searchFundMyList(FundPrdtInfoPageVO params) throws Exception  {
		// 펀드제안 목록 조회
		List<FundPrdtInfoVO> fundMyList = fundRepo.searchFundMyList(params);
		fundMyList = fundMyList == null ? new ArrayList<>() : fundMyList;

		return new PagingVO<>(params, fundMyList);
	}
    
    /**
     * 펀드제안 불러오기 조회
     * @param utlinsttId
     * @return
     * @throws Exception
     */
    public List<FundPrdtInfoVO> loadFundList(String utlinsttId) throws Exception  {
    	// 펀드제안 목록 조회
    	List<FundPrdtInfoVO> fundList = fundRepo.loadFundList(utlinsttId);
    	
        return fundList;
    }
    
    /**
     * 펀드제안 제안펀드 등록 - step1 / 계속작성
     * @param fundId
     * @return
     * @throws Exception
     */
    public FundPrdtInfoVO searchFundPrdtInfo(String fundId) throws Exception {

        FundPrdtInfoVO fundPrdtInfoVO = fundRepo.searchFundPrdtInfo(fundId);
        List<PrmrLpChcFildVO> prmrLpChcFildVO = fundRepo.searchPrmrLpChcFild(fundPrdtInfoVO.getFundId());
        fundPrdtInfoVO.setPrmrLpChcFild(prmrLpChcFildVO);
        List<FncnEnlsPsstListVO> fncnEnlsPsstListVO = fundRepo.searchFncnEnlsPsstList(fundPrdtInfoVO.getFundId());
        fundPrdtInfoVO.setFncnEnlsPsst(fncnEnlsPsstListVO);
        
        return fundPrdtInfoVO;
    }
    
    /**
     * 펀드제안 제안펀드 등록 - step2 / 계속작성
     * @param fundId
     * @return
     * @throws Exception
     */
    public FundOpcmInfoVO searchFundOpcmInfo(String fundId) throws Exception {

    	FundOpcmInfoVO fundOpcmInfoVO = fundRepo.searchFundOpcmInfo(fundId);
    	if(fundOpcmInfoVO != null) {
    		// 운용인력 유지율 매핑 조회
    		List<OpratnHnfMntncVO> opratnHnfMntncList = fundRepo.searchOpratnHnfMntnc(fundOpcmInfoVO.getFundId());
    		fundOpcmInfoVO.setOpratnHmfMntnc(opratnHnfMntncList);
    		
    		// 주주정보 조회
    		List<FundStchCnfgVO> fundStchCnfgList = fundRepo.searchFundStchCnfg(fundOpcmInfoVO.getFundId());
    		fundOpcmInfoVO.setFundStchCnfgList(fundStchCnfgList);
    		
    		// 제안 펀드 참여 운용인력 조회
    		List<ProFundPartcptnVO> searchProFundPartcptn = fundRepo.searchProFundPartcptn(fundOpcmInfoVO.getFundId());
    		fundOpcmInfoVO.setProFundPartcptn(searchProFundPartcptn);
    		
    		// 운용인력 징계여부
    		List<OpratnHnfInfoDscplLVO> opratnHnfInfoDscplL = fundRepo.searchopratnHnfInfoDscpl(fundOpcmInfoVO.getFundId());
    		fundOpcmInfoVO.setOpratnHnfInfoDscplL(opratnHnfInfoDscplL);
    		
    		// 첨부된 파일 정보 불러오기
			String[] strFileList = fundOpcmInfoVO.getManagedtaAtchmnfl().split(",");
			List<ComFileInfoVO> fileList = new ArrayList<>();
			for(int i=0 ; i<strFileList.length ; i++) {
				ComFileInfoVO fileInfoVO = fundRepo.searchFileInfo(strFileList[i].toString());
				fileList.add(i, fileInfoVO);
			}
			fundOpcmInfoVO.setManagedtaAtchmnflList(fileList);
    	}

        return fundOpcmInfoVO;
    }
    
    /**
     * 펀드제안 제안펀드 등록 - step2 - 상세
     * @param utlinsttId
     * @return
     * @throws Exception
     */
    public HashMap<String, Object> detailFundOpcmInfo(String utlinsttId) throws Exception {
    	HashMap<String, Object> resultObj = new HashMap<String, Object>();
    	InvestRelationVO investRelationVO = investorRelationRepo.selectCompanyIR(utlinsttId);
    	if(investRelationVO != null) {
    		// 주주정보 조회
    		// 조회 아이디 세팅
    		String userGroupId = investorRelationService.getSearchGroupId(investRelationVO.getUtlinsttId());
    		List<IrStockHolderVO> stockHolderList = investorRelationRepo.selectCompanyIRStockHolderList(userGroupId);
    		// 재무정보 조회
    		IrFinanceVO irFinanceVO = investorRelationRepo.selectCompanyIRFinance(userGroupId);
    		
    		resultObj.put("irFinance", irFinanceVO);		
    		resultObj.put("investRelation", investRelationVO);
    		resultObj.put("stockHolderList", stockHolderList);
    	}
    	
        return resultObj;
    }
	
	/**
     * 펀드제안 제안펀드 등록 - step1
     * @param fundPrdtInfoVo
     * @throws Exception
     */
    public String insertFundPrdtInfoStep1(FundPrdtInfoVO fundPrdtInfoVo) throws Exception {
    	// 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String fundIdStr = fundPrdtInfoVo.getFundId() == null ? "" : (String) fundPrdtInfoVo.getFundId();
    	// 수정 건 or 신규 건 체크
        FundPrdtInfoVO fundPrdtInfo = fundRepo.searchFundPrdtInfo(fundIdStr);
        if(fundPrdtInfo == null) {
			/** 등록 **/
			int fundId = fundRepo.countFundIdTotal();
			LocalDate getDate = LocalDate.now(ZoneId.of("Asia/Seoul"));
			String currentYm = String.valueOf(getDate).replace("-", "");
			fundPrdtInfoVo.setFundId("BFR"+ currentYm.substring(2,6) +String.format("%03d", fundId));
			fundPrdtInfoVo.setRgsnUserId(user.getUsername());
			fundRepo.insertFundPrdtInfoStep1(fundPrdtInfoVo);
        }else {
        	/** 이미 작성된 값을 수정 시 **/
        	fundPrdtInfoVo.setAmnnUserId(user.getUsername());
        	fundRepo.updateFundPrdtInfoStep1(fundPrdtInfoVo);
        }

        // 주요LP 데이터 셋팅
        for (PrmrLpChcFildVO item : fundPrdtInfoVo.getPrmrLpChcFild()) {
            item.setFundId((String) fundPrdtInfoVo.getFundId());

            if(StringUtils.hasLength(item.getInvstInst())) {
         	   if(fundPrdtInfo == null) {       
         		   item.setRgsnUserId(user.getUsername());
          			fundRepo.insertPrmrLpChcFild(item);
          		}else {
          			if(item.getRgsnUserId().equals("")) {
        				// 추가저장시
        				item.setRgsnUserId(user.getUsername());
        				fundRepo.insertPrmrLpChcFild(item);
        			}else {
        				item.setAmnnUserId(user.getUsername());
        				fundRepo.updatePrmrLpChcFild(item);
        			}
          		}
            }
        }
        
       // 출자자 모집현황 데이터 셋팅
       for (FncnEnlsPsstListVO item : fundPrdtInfoVo.getFncnEnlsPsst()) {
           item.setFundId((String) fundPrdtInfoVo.getFundId());

           if(StringUtils.hasLength(item.getInvstInst())) {
        	   if(fundPrdtInfo == null) {       
        		   item.setRgsnUserId(user.getUsername());
        		   fundRepo.insertFncnEnlsPsst(item);
         		}else {
         			if(item.getRgsnUserId().equals("")) {
        				// 추가저장시
        				item.setRgsnUserId(user.getUsername());
        				fundRepo.insertFncnEnlsPsst(item);
        			}else {
        				item.setAmnnUserId(user.getUsername());
        				fundRepo.updateFncnEnlsPsst(item);
        			}
         		}
           }
       }

       return fundPrdtInfoVo.getFundId();
    }
    
    /**
     * 펀드제안 제안펀드 등록 - step2
     * @param fundOpcmInfoVO
     * @throws Exception
     */
    public HashMap<String , Object> insertFundPrdtInfoStep2(FundOpcmInfoVO fundOpcmInfoVO) throws Exception {
		HashMap<String, Object> result = new HashMap<>();

    	// 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        FundOpcmInfoVO fundOpcmInfo = fundRepo.searchFundOpcmInfo(fundOpcmInfoVO.getFundId());
        IrFinanceVO irFinanceVO = fundOpcmInfoVO.getIrInfo();
        // ID 정보 세팅
        irFinanceVO.setUtlinsttId(user.getUserGroupId());
        irFinanceVO.setRgsnUserId(user.getUsername());
        irFinanceVO.setAmnnUserId(user.getUsername());
		
        if(fundOpcmInfo == null) {
        	/** 등록 **/
        	fundOpcmInfoVO.setRgsnUserId(user.getUsername());
        	fundRepo.insertFundPrdtInfoStep2(fundOpcmInfoVO);
        }else {
        	fundOpcmInfoVO.setAmnnUserId(user.getUsername());
        	fundRepo.updateFundPrdtInfoStep2(fundOpcmInfoVO);
        }
        if(fundOpcmInfoVO.getProgrsStg().equals("AUD01001")) {
        	fundRepo.updateFundAuditStg(fundOpcmInfoVO.getFundId());
        }
        
    	/** 재무정보 등록 / 수정 **/
        if (investorRelationRepo.selectCompanyIRFinance(user.getUserGroupId()) == null) {
            // 재무정보 등록
            investorRelationRepo.insertCompanyIRFinance(irFinanceVO);
        }else {
            // 재무정보 수정
            investorRelationRepo.updateCompanyIRFinance(irFinanceVO);
        }
        
        /** 주주 정보 등록 && 수정 **/
		for (FundStchCnfgVO item : fundOpcmInfoVO.getFundStchCnfgList()) {
			// 펀드Id 세팅
			item.setFundId(fundOpcmInfoVO.getFundId());

			// 주주명만 있는 경우만 insert
			if(StringUtils.hasLength(item.getStchNm())) {
				if(fundOpcmInfo == null) {
					item.setRgsnUserId(user.getUsername());
					fundRepo.insertFundStchCnfg(item);
				}else {
					if(item.getRgsnUserId().equals("")) {
						// 추가저장시
						item.setRgsnUserId(user.getUsername());
						fundRepo.insertFundStchCnfg(item);
					}else {
						item.setAmnnUserId(user.getUsername());
						fundRepo.updateFundStchCnfg(item);
					}
				}
			}
		}

        // 제안펀드 참여 운용 인력
        for (ProFundPartcptnVO item : fundOpcmInfoVO.getProFundPartcptn()) {
            // 펀드Id 세팅
            item.setFundId(fundOpcmInfoVO.getFundId());
      
            // 제안펀드 참여 운용 인력명이 있는 경우만 insert
            if(StringUtils.hasLength(item.getPartcptnNm())) {
            	if(fundOpcmInfo == null) {
            		item.setRgsnUserId(user.getUsername());
        			fundRepo.insertProFundPartcptn(item); 
        		}else {
        			if(item.getRgsnUserId().equals("")) {
        				// 추가저장시
        				item.setRgsnUserId(user.getUsername());
        				fundRepo.insertProFundPartcptn(item);
        			}else {
        				item.setAmnnUserId(user.getUsername());
        				fundRepo.updateProFundPartcptn(item);      					    					
        			}
        		}
            }
        }
        
        // 운용인력 유지율
        for (OpratnHnfMntncVO item : fundOpcmInfoVO.getOpratnHmfMntnc()) {
            // 펀드Id 세팅
            item.setFundId(fundOpcmInfoVO.getFundId());
      
            // 운용인력명이 있는 경우만 insert
            if(StringUtils.hasLength(item.getOpratnHnfNm())) {
            	if(fundOpcmInfo == null) {
    				item.setRgsnUserId(user.getUsername());
    				if(item.getRm().equals("")) {
    					item.setRm(" ");
    				}
    				fundRepo.insertOpratnHnfMntnc(item); 
    			}else {
    				if(item.getRgsnUserId().equals("")) {
    					// 추가저장시
    					if(item.getRm().equals("")) {
        					item.setRm(" ");
        				}
    					item.setRgsnUserId(user.getUsername());
        				fundRepo.insertOpratnHnfMntnc(item);
    				}else {
    					item.setAmnnUserId(user.getUsername());
    					fundRepo.updateOpratnHnfMntnc(item);      					    					
    				}
    			}
            }
        }
        
        // 관리 인력 운용징계여부 
        for (OpratnHnfInfoDscplLVO item : fundOpcmInfoVO.getOpratnHnfInfoDscplL()) {
            // 펀드Id 세팅
            item.setFundId(fundOpcmInfoVO.getFundId());
      
            // 관리 인력명이 있는 경우만 insert
            if(StringUtils.hasLength(item.getName())) {
            	if(fundOpcmInfo == null) {
            		item.setRgsnUserId(user.getUsername());
            		if(item.getRmrk().equals("")) {
    					item.setRmrk(" ");
    				}
        			fundRepo.insertOpratnHnfInfoDscpl(item); 
        		}else {
        			if(item.getRgsnUserId().equals("")) {
        				// 추가저장시
        				if(item.getRmrk().equals("")) {
        					item.setRmrk(" ");
        				}
        				item.setRgsnUserId(user.getUsername());
        				fundRepo.insertOpratnHnfInfoDscpl(item);
        			}else {
        				item.setAmnnUserId(user.getUsername());
        				fundRepo.updateOpratnHnfInfoDscpl(item);      					    					
        			}
        		}
            }
        }
        
        if(!fundOpcmInfoVO.getProgrsStg().equals("save")) {
        	HashMap<String, Object> req = new HashMap<>();
        	req.put("prnNm", fundOpcmInfoVO.getPrnNm());
        	req.put("rprNm", fundOpcmInfoVO.getRprNm());
        	req.put("userId", fundOpcmInfoVO.getRgsnUserId());
        	req.put("fundNm", fundOpcmInfoVO.getFundNm());
        	// 제안 시 혁신투자부에 이메일 및 sms로 알림
//       		commonService.sendEmailSms(req, "fund");
        }
		result.put("fund", fundOpcmInfoVO);
		return result;
    }
    
    /**
     * 제안 취소
     * @param vo
     * @throws Exception
     */
    public void fundPrdtInfoCancle(FundOpcmInfoVO vo) throws Exception {
    	fundRepo.fundPrdtInfoCancle(vo);
    	fundRepo.fundOpertrInfoCancle(vo);
        // 접수한 담당자 이름 및 연락처 조회
        MainUserVO mainUserVO = platformAccountService.searchMainUser(vo.getRgsnUserId(), vo.getUtlinsttId());
        
		HashMap<String, Object> req = new HashMap<>();
		req.put("prnNm", vo.getPrnNm() == null ? mainUserVO.getBplcNm() :vo.getPrnNm());
		req.put("userNm", mainUserVO.getUserNm());
		req.put("userId", vo.getRgsnUserId());
		req.put("fundNm", vo.getFundNm());
		// 제안 취소 시 혁신투자부에 이메일 및 sms로 알림
//		commonService.sendEmailSms(req, "fundCancel");
    }
    
    /**
     * 펀드제안 제안펀드 답변보기- step3
     * @param fundId
     * @throws Exception
     */
    public FundPrdtInfoVO searchFundReplycon(String fundId) throws Exception {
    	FundPrdtInfoVO fundPrdtInfo = fundRepo.searchFundPrdtInfo(fundId);
    	return fundPrdtInfo;
    }
    
    /**
     * 주요 주주 구성 양식 다운로드
     * @param params
     * @param response
     * @throws Exception
     */
    public void stockListExcelDownload(FundPrdtInfoPageVO params, HttpServletResponse response) throws Exception {

        params.setPage(null);
        params.setRecord(null);
    	
        ExcelFormVO excelFormVO = new ExcelFormVO(FundIrStockExcelVO.class, null);

        ExcelFileUtil.excelDownload(excelFormVO, response);
    }
    
    /**
     * 펀드제안 복사본 만들기
     * @param fundPrdtInfoVo
     * @throws Exception
     */
    public String fundPrdtInfoCopy(FundPrdtInfoVO fundPrdtInfoVo) throws Exception {
    	// 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
    	/** 등록 **/
        fundPrdtInfoVo.setRgsnUserId(user.getUsername());
		int fundId = fundRepo.countFundIdTotal();
		LocalDate getDate = LocalDate.now(ZoneId.of("Asia/Seoul"));
		String currentYm = String.valueOf(getDate).replace("-", "");
		fundPrdtInfoVo.setFundId("BFR"+ currentYm.substring(2,6) +String.format("%03d", fundId));
		fundPrdtInfoVo.setRgsnUserId(user.getUsername());
    	fundRepo.insertFundPrdtInfoStep1(fundPrdtInfoVo);
        
    	// 주요LP 데이터 셋팅
        for (PrmrLpChcFildVO item : fundPrdtInfoVo.getPrmrLpChcFild()) {
            item.setFundId(fundPrdtInfoVo.getFundId());
            item.setRgsnUserId(user.getUsername());

            if(StringUtils.hasLength(item.getInvstInst())) {
            	fundRepo.insertPrmrLpChcFild(item);
            }
        }
        
       // 출자자 모집현황 데이터 셋팅
       for (FncnEnlsPsstListVO item : fundPrdtInfoVo.getFncnEnlsPsst()) {
           item.setFundId(fundPrdtInfoVo.getFundId());
           item.setRgsnUserId(user.getUsername());

           if(StringUtils.hasLength(item.getInvstInst())) {
        	   fundRepo.insertFncnEnlsPsst(item);
           }
       }
       
       return fundPrdtInfoVo.getFundId();
    }
    
    /**
     * 재무재표
     * @param map
     * @throws Exception
     */
    public List<InfotechScrapFinanceSummaryVO> searchInfotechHometaxFinance(HashMap<String, String> map) throws Exception {
        // 과세기간 기준 설정 (최근 3개년도 1~12)
        List<InfotechScrapFinanceSummaryVO> list = new ArrayList();
        LocalDate getDate = LocalDate.now(ZoneId.of("Asia/Seoul"));
        String currentYm = String.valueOf(getDate).replace("-", "");
        int count = 0;
        String txnrmStrtYm = "";
        String txnrmEndYm = "";
        String searchYear = "";
        
        for(int i=0 ; i<4 ; i++) {
			 if(currentYm.substring(4,6) == "06") {
	        	txnrmStrtYm = LocalDate.of(LocalDate.now(ZoneId.of("Asia/Seoul")).getYear() - i, Month.JANUARY, 1).format(DateTimeFormatter.ofPattern("yyyyMM"));
	        	txnrmEndYm = LocalDate.of(LocalDate.now(ZoneId.of("Asia/Seoul")).getYear() - i, Month.DECEMBER, 1).format(DateTimeFormatter.ofPattern("yyyyMM"));
	        	searchYear = LocalDate.of(LocalDate.now(ZoneId.of("Asia/Seoul")).getYear() - i, Month.DECEMBER, 1).format(DateTimeFormatter.ofPattern("yyyy"));
			 }else {
	        	txnrmStrtYm = LocalDate.of(LocalDate.now(ZoneId.of("Asia/Seoul")).getYear() - (1+i), Month.JANUARY, 1).format(DateTimeFormatter.ofPattern("yyyyMM"));
	        	txnrmEndYm = LocalDate.of(LocalDate.now(ZoneId.of("Asia/Seoul")).getYear() - (1+i), Month.DECEMBER, 1).format(DateTimeFormatter.ofPattern("yyyyMM"));
	        	searchYear = LocalDate.of(LocalDate.now(ZoneId.of("Asia/Seoul")).getYear() - (1+i), Month.DECEMBER, 1).format(DateTimeFormatter.ofPattern("yyyy"));
			 }
        	InfotechScrapFinanceSummaryVO financialData = null;
        	// 스크래핑 데이터 조회 (표준재무제표 정보)
        	financialData = platformDocumentService
        			.searchInfotechHometaxFinanceInfo(
        					map.get("clientCertKey"), map.get("bzn")
        					, txnrmStrtYm, txnrmEndYm);
        	
        	if(financialData.getErrYn().equals(IvtCode.YnTypeEnum.N.name())) {
        		financialData.setSearchYear(searchYear);
        		list.add(count , financialData); 
        		count++;
        	}
        }

        return list;
    }
    
    /**
     * 엑셀파일을 List<Map<String,String>> 으로 변환
     * @param file
     * @throws Exception
     */
	public static List<Map<String, String>> readXLSXFile(MultipartFile file) throws Exception {
        
		List<Map<String, String>> dataList = new ArrayList<>();

		  try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
	            Sheet sheet = workbook.getSheetAt(0);  // 첫 번째 시트를 가져옴
	            Iterator<Row> rowIterator = sheet.iterator();

	            boolean isFirstRow = true;  // 첫 번째 줄은 헤더이므로 스킵
	            List<String> headers = new ArrayList<>();

	            while (rowIterator.hasNext()) {
	                Row row = rowIterator.next();

	                if (isFirstRow) {
	                    isFirstRow = false;

	                    // 헤더 정보 저장
	                    Iterator<Cell> cellIterator = row.cellIterator();
	                    while (cellIterator.hasNext()) {
	                        Cell cell = cellIterator.next();
	                        headers.add(cell.getStringCellValue());
	                    }
	                    continue;
	                }

	                // 데이터 저장
	                Map<String, String> data = new HashMap<>();
	                Iterator<Cell> cellIterator = row.cellIterator();
	                int columnIndex = 0;
	                
	                while (cellIterator.hasNext()) {
	                    Cell cell = cellIterator.next();
	                    
	                    String header = headers.get(columnIndex);
	                    
	                    if(header.equals("주주명") ) {
	                    	data.put("stchNm", cell.getStringCellValue());	                    	
	                    }else if(header.equals("지분액(원)")) {
	                    	data.put("cmscAmt", String.valueOf((int)cell.getNumericCellValue()));	
	                    }else if(header.equals("지분율(%)")) {
	                    	if(cell.getNumericCellValue() == Math.rint(cell.getNumericCellValue())) {
	                    		data.put("prra", String.valueOf((int)cell.getNumericCellValue()));		                    		
	                    	}else {
	                    		data.put("prra", String.valueOf(cell.getNumericCellValue()));
	                    	}
	                    }else if(header.equals("비고")) {
	                    	data.put("rmrk", cell.getStringCellValue());	
	                    }
	                    columnIndex++;
	                }
	                if(data.size() != 0) {
	                	dataList.add(data);	                	
	                }
	            }
	        } catch (BizException e) {
	            // 예외 처리 필요
	            throw new BizException(StatusCode.COM0000);
	        }
        
		return dataList;
	}

	/**
	 * VC추천딜 OAP 데이터 전송
	 * @param fundId
	 * @throws Exception
	 */
	public void vcRcmdReq(String fundId, String type) throws Exception {
		HashMap<String, Object> map = new HashMap<>();

		FundPrdtInfoVO fundPrdtInfoVO = this.searchFundPrdtInfo(fundId);
		FundOpcmInfoVO fundOpcmInfoVO = this.searchFundOpcmInfo(fundId);

		if(type.equals("cncl")) {
			HashMap<String, Object> cnclMap = new HashMap<>();
			cnclMap.put("fundRcmdId", fundPrdtInfoVO.getFundId());
			documentFeign.postVcFundCnclData(cnclMap);
		}else {
			// 펀드제안 기본정보 STEP1 TB_BOX_IVT_PRDT_FUND_INFO_M
			map.put("fundRcmdId", fundPrdtInfoVO.getFundId());	 // 펀드ID

			if(fundPrdtInfoVO.getFundPtrn().equals("FNP01001")) {// 펀드유형
				map.put("prplFundTcd", "01");
			} else if (fundPrdtInfoVO.getFundPtrn().equals("FNP01002")) {
				map.put("prplFundTcd", "02");
			} else if (fundPrdtInfoVO.getFundPtrn().equals("FNP01003")) {
				map.put("prplFundTcd", "03");
			}else if (fundPrdtInfoVO.getFundPtrn().equals("FNP01004")) {
				map.put("prplFundTcd", "04");
			}else if (fundPrdtInfoVO.getFundPtrn().equals("FNP01005")) {
				map.put("prplFundTcd", "99");
			}

			map.put("fundOrgzGoalAmt", fundPrdtInfoVO.getOrgzTrgpft().toString());				// 결성목표액
			map.put("ibkFncnPrplAmt", fundPrdtInfoVO.getIbkInvstmntPrplAmt().toString());		// ibk출자 제안 금액
			map.put("bserRt", fundPrdtInfoVO.getStdrErnRt().toString());						// 기준수익률(IRR)
			map.put("asceTrmNyy", fundPrdtInfoVO.getCntnncPdyy());								// 존속 기간년수
			map.put("otcmRmnrRt", fundPrdtInfoVO.getRsltMendngIrrExcessErn().toString());		// 성과보수율
			map.put("ivtmNyy", fundPrdtInfoVO.getInvtPdyy());									// 투자기간(년)
			map.put("mngmRmnrRt", fundPrdtInfoVO.getMngMendngRt().toString());					// 관리보수(%)

			if(fundPrdtInfoVO.getPmntMthd().equals("PMT01001")) { // 납부방식
				map.put("fnmnPmntMcd", "1");
			} else if (fundPrdtInfoVO.getPmntMthd().equals("PMT01002")) {
				map.put("fnmnPmntMcd", "2");
			} else if (fundPrdtInfoVO.getPmntMthd().equals("PMT01003")){
				map.put("fnmnPmntMcd", "3");
			}

			map.put("ivtgCon", fundPrdtInfoVO.getInvtTgt());				// 투자대상
			map.put("rplyCon", fundPrdtInfoVO.getRplyCon());					// 답변내용
			String wody = new SimpleDateFormat("yyyyMMdd").format(fundPrdtInfoVO.getWody());
			map.put("wrtnTs", wody); 											// 작성일시
			map.put("fundNm", fundPrdtInfoVO.getFundNm()); 						// 펀드명
			map.put("opcmFncnAmt", String.valueOf(fundPrdtInfoVO.getGpFncnInfo())); 			// gp출자금액
			map.put("prdoBaseYmd", fundPrdtInfoVO.getProposalDocBaseDay().replaceAll("-",""));  	// 제안서 기준일

			if(fundPrdtInfoVO.getFundDsnc().equals("BLIND")) { // 펀드구분
				map.put("prplFundDcd", "1");
			}else if(fundPrdtInfoVO.getFundDsnc().equals("PRJT")) {
				map.put("prplFundDcd", "2");
			}else {
				map.put("prplFundDcd", fundPrdtInfoVO.getFundDsnc());
			}

			// 펀드제안 STEP1 주요LP 지원 및 선정분야 TB_BOX_IVT_PRMR_LP_CHC_FILD_R
			List<Object> vcRcmdPrmrLpChcFildList = new ArrayList<>();

			for(int i=0 ; i<fundPrdtInfoVO.getPrmrLpChcFild().size() ; i++ ) {
				HashMap<String,Object> hashMap = new HashMap<>();

				hashMap.put("fundRcmdId", fundPrdtInfoVO.getPrmrLpChcFild().get(i).getFundId());		// 펀드ID
				hashMap.put("rgsnSqn", fundPrdtInfoVO.getPrmrLpChcFild().get(i).getSqn().toString());	// 순번
				hashMap.put("fncnInttNm", fundPrdtInfoVO.getPrmrLpChcFild().get(i).getInvstInst());		// 출자기관명
				hashMap.put("sprnFildCon", fundPrdtInfoVO.getPrmrLpChcFild().get(i).getSprnFild());		// 지원분야내용
				hashMap.put("sprnAmt", fundPrdtInfoVO.getPrmrLpChcFild().get(i).getSprnAmt().toString());// 지원금액

				vcRcmdPrmrLpChcFildList.add(i, hashMap);
			}
			map.put("fncnBsnsSprnFildListRowcount", String.valueOf(vcRcmdPrmrLpChcFildList.size()));
			map.put("fncnBsnsSprnFildList", vcRcmdPrmrLpChcFildList);

			// 펀드제안 STEP1 출자모집현황 TB_BOX_IVT_FNCN_ENLS_PSST_R
			List<Object> vcRcmdFundFncnEnlsList = new ArrayList<>();

			for(int i=0 ; i<fundPrdtInfoVO.getFncnEnlsPsst().size() ; i++ ) {
				HashMap<String,Object> hashMap = new HashMap<>();

				hashMap.put("fundRcmdId",fundPrdtInfoVO.getFncnEnlsPsst().get(i).getFundId());			// 펀드ID
				hashMap.put("rgsnSqn",String.valueOf(fundPrdtInfoVO.getFncnEnlsPsst().get(i).getSqn()));// 순번
				hashMap.put("fncnInttNm",fundPrdtInfoVO.getFncnEnlsPsst().get(i).getInvstInst());		// 출자기관
				hashMap.put("fncnAmt", fundPrdtInfoVO.getFncnEnlsPsst().get(i).getInvstMny());// 출자금액
				hashMap.put("fncnRto",String.valueOf(fundPrdtInfoVO.getFncnEnlsPsst().get(i).getRate()));// 비율

				vcRcmdFundFncnEnlsList.add(i, hashMap);
			}
			map.put("fnnrEnlsPsstListRowcount", String.valueOf(vcRcmdFundFncnEnlsList.size()));
			map.put("fnnrEnlsPsstList", vcRcmdFundFncnEnlsList);

			// 펀드제안 운용사 상세정보 STEP2 TB_BOX_IVT_OPERTR_INFO_R
			map.put("opcmNm", fundOpcmInfoVO.getPrnNm());					// 운용사명
			map.put("bzn", fundOpcmInfoVO.getBzn());						// 사업자번호
			map.put("rpdirNm", fundOpcmInfoVO.getRprNm());					// 대표이사명
			map.put("cmpnAdr", fundOpcmInfoVO.getAdres());					// 회사소재지
			map.put("incrYmd", fundOpcmInfoVO.getIncrYmd());				// 설립년월일
			map.put("fundSttgYmd", fundOpcmInfoVO.getFundOprTs());			// 펀드운용시작일
			map.put("cptsTtalAmt", fundOpcmInfoVO.getCptsTtsm().toString());		// 자본총금액
			map.put("cptsTtsmAmt", fundOpcmInfoVO.getCptsTtsm().toString());		// 자본총계
			map.put("pcapAmt", fundOpcmInfoVO.getPayCapl().toString());				// 납입자본금
			map.put("adcpYn", fundOpcmInfoVO.getDscplYn());							// 징계여부
			map.put("astTtsmAmt", fundOpcmInfoVO.getAstTtsmAmt().toString());		// 자산총계
			map.put("lbltTtsmAmt", fundOpcmInfoVO.getLbltCpstAmt().toString());		// 부채총계
			map.put("boerAmt", fundOpcmInfoVO.getBsnErn().toString());				// 영업수익
			map.put("bsopExp", fundOpcmInfoVO.getBsnCt().toString());				// 영업비용
			map.put("ctnpAmt", fundOpcmInfoVO.getCtnpAmt().toString());				// 당기순이익
			map.put("by1AstTtsmAmt", fundOpcmInfoVO.getAstTtsmAmt1y().toString());		// 자산총계1Y
			map.put("by2AstTtsmAmt", fundOpcmInfoVO.getAstTtsmAmt2y().toString());		// 자산총계2Y
			map.put("by1LbltTtsmAmt", fundOpcmInfoVO.getLbltCpstAmt1y().toString());	// 부채총계1Y
			map.put("by2LbltTtsmAmt", fundOpcmInfoVO.getLbltCpstAmt2y().toString());	// 부채총계2Y
			map.put("by1CptsTtsmAmt", fundOpcmInfoVO.getCptsTtsmAmt1y().toString());	// 자본총계1Y
			map.put("by2CptsTtsmAmt", fundOpcmInfoVO.getCptsTtsmAmt2y().toString());	// 자본총계2Y
			map.put("by1BsopErnnAmt", fundOpcmInfoVO.getBsnErn1y().toString());			// 영업수익1Y
			map.put("by2BsopErnnAmt", fundOpcmInfoVO.getBsnErn2y().toString());			// 영업수익2Y
			map.put("by1BsopExpAmt", fundOpcmInfoVO.getBsnCt1y().toString());			// 영업비용1Y
			map.put("by2BsopExpAmt", fundOpcmInfoVO.getBsnCt2y().toString());			// 영업비용2Y
			map.put("by1CtnpAmt", fundOpcmInfoVO.getCtnpAmt1y().toString());			// 당기순이익1Y
			map.put("by2CtnpAmt", fundOpcmInfoVO.getCtnpAmt2y().toString());			// 당기순이익2Y
			map.put("mnivFundCnt", fundOpcmInfoVO.getOpratnScaleCo().toString());		// 운용규모수
			map.put("mnivFundAmt", fundOpcmInfoVO.getOpratnScaleAm().toString());		// 운용규모액
			map.put("blndFundCnt", fundOpcmInfoVO.getBlindCo().toString());				// 불라인드수
			map.put("blndFundAmt", fundOpcmInfoVO.getBlindAm().toString());				// 불라인드액
			map.put("prjFundCnt", fundOpcmInfoVO.getPrjctCo().toString());				// 프로젝트수
			map.put("prjFundAmt", fundOpcmInfoVO.getPrjctAm().toString());				// 프로젝트액
			map.put("lqdnFundErnnRt", fundOpcmInfoVO.getLqdFundErnrt());	// 청산펀드수익률IRR(%)
			map.put("fundExhsRt", fundOpcmInfoVO.getFundExhsRt().trim().equals("") ? "0" : fundOpcmInfoVO.getFundExhsRt());			// 펀드소진율
			map.put("opcmMnivHmrsCnt", fundOpcmInfoVO.getOpratnHnfInfoTotCo().toString());	// 운용인력정보[총 운용인력수]
			map.put("rprsFundMgrNm", fundOpcmInfoVO.getOpratnHnfInfoMngrNm());	// 운용인력정보[대표 펀드 매니저명]
			map.put("mnivHmrsAdcpYn", fundOpcmInfoVO.getOpratnHnfInfoDscplYn());	// 운용인력정보[운용인력징계여부]
			map.put("whrsAdemCnt", fundOpcmInfoVO.getManageHnfInfoTotCo().toString());			// 관리인력정보[총 운용인력수]
			map.put("qlcrHoldEmpCnt", fundOpcmInfoVO.getManageHnfInfoHnf().toString());		// 관리인력정보[전문자격증 보유인력]
			map.put("jntOpcmYn", fundOpcmInfoVO.getCogpYn());						// CO-GP여부
			map.put("rprsOpcmNm", fundOpcmInfoVO.getMajorPrnNm());					// 주운용사명

			// 펀드제안 STEP2 관리인력 TB_BOX_IVT_OPRATN_HNF_INFO_DSCPL_L
			List<Object> vcRcmdFundDscplList = new ArrayList<>();
			for(int i=0 ; i<fundOpcmInfoVO.getOpratnHnfInfoDscplL().size() ; i++) {
				HashMap<String,Object> hashMap = new HashMap<>();

				hashMap.put("fundRcmdId",fundOpcmInfoVO.getOpratnHnfInfoDscplL().get(i).getFundId());		// 펀드ID
				hashMap.put("rgsnSqn",fundOpcmInfoVO.getOpratnHnfInfoDscplL().get(i).getSqn().toString());	// 순번
				hashMap.put("mngmPrsnNm",fundOpcmInfoVO.getOpratnHnfInfoDscplL().get(i).getName());			// 관리인명
				hashMap.put("crrTrm",fundOpcmInfoVO.getOpratnHnfInfoDscplL().get(i).getRmdp());				// 리스크 관리경력
				hashMap.put("rmrkCon",fundOpcmInfoVO.getOpratnHnfInfoDscplL().get(i).getRmrk() != null ?
						fundOpcmInfoVO.getOpratnHnfInfoDscplL().get(i).getRmrk() : "");			// 비고내용

				vcRcmdFundDscplList.add(i, hashMap);
			}
			map.put("opcmMngmHmrsListRowcount", String.valueOf(vcRcmdFundDscplList.size()));
			map.put("opcmMngmHmrsList", vcRcmdFundDscplList);

			// 펀드제안 STEP2 운용사 유지율 TB_BOX_IVT_OPRATN_HNF_MNTNC_RT_R
			List<Object> vcRcmdFundOpratnHnfList = new ArrayList<>();
			for(int i=0 ; i<fundOpcmInfoVO.getOpratnHmfMntnc().size() ; i++) {
				HashMap<String,Object> hashMap = new HashMap<>();

				hashMap.put("fundRcmdId",fundOpcmInfoVO.getOpratnHmfMntnc().get(i).getFundId());		// 펀드ID
				hashMap.put("rgsnSqn",fundOpcmInfoVO.getOpratnHmfMntnc().get(i).getSqn().toString());	// 순번
				hashMap.put("opcmHmrsNm",fundOpcmInfoVO.getOpratnHmfMntnc().get(i).getOpratnHnfNm());	// 관리인명
				hashMap.put("hlofYn",fundOpcmInfoVO.getOpratnHmfMntnc().get(i).getNowHffcYn());			// 리스크 관리경력
				hashMap.put("rmrkCon",fundOpcmInfoVO.getOpratnHmfMntnc().get(i).getRm());				// 비고내용

				vcRcmdFundOpratnHnfList.add(i, hashMap);
			}
			map.put("mnivHmrsHlofInfoListRowcount", String.valueOf(vcRcmdFundOpratnHnfList.size()));
			map.put("mnivHmrsHlofInfoList", vcRcmdFundOpratnHnfList);

			// 펀드제안 STEP2 제안펀드 정보 TB_BOX_IVT_PROPSE_FUND_PARTCPTN_R
			List<Object> vcRcmdFundPartCptnList = new ArrayList<>();
			for(int i=0 ; i<fundOpcmInfoVO.getProFundPartcptn().size() ; i++) {
				HashMap<String,Object> hashMap = new HashMap<>();

				hashMap.put("fundRcmdId",fundOpcmInfoVO.getProFundPartcptn().get(i).getFundId());				// 펀드ID
				hashMap.put("rgsnSqn",fundOpcmInfoVO.getProFundPartcptn().get(i).getSqn().toString());			// 순번
				if(fundOpcmInfoVO.getProFundPartcptn().get(i).getHmrsDsnc().equals("HMRS01")) {					// 인력구분
					hashMap.put("opcmHmrsDcd", "1");
				} else {
					hashMap.put("opcmHmrsDcd", "2");
				}
				hashMap.put("ptcnNm",fundOpcmInfoVO.getProFundPartcptn().get(i).getPartcptnNm());				// 참여자명
				hashMap.put("invmCrrNyy",fundOpcmInfoVO.getProFundPartcptn().get(i).getInvtCareer().toString());// 투자경력년수
				hashMap.put("ctsvNyy",fundOpcmInfoVO.getProFundPartcptn().get(i).getCnwkYyCnt().toString());	// 근속년수
				hashMap.put("msrnYy5InvmAmt",fundOpcmInfoVO.getProFundPartcptn().get(i).getFiveFyerInvmAmt().toString());				// 최근 5년 투자금액
				hashMap.put("msrnYy10InvmAcrsAmt",fundOpcmInfoVO.getProFundPartcptn().get(i).getTenFyerInvmRtrvlacrsInvt().toString());	// 최근 10년 투자 실적금액
				hashMap.put("msrnYy10RtrvAcrsAmt",fundOpcmInfoVO.getProFundPartcptn().get(i).getTenFyerInvmRtrvlacrsRtrvl().toString());// 최근 10년 회수 실적금액

				vcRcmdFundPartCptnList.add(i, hashMap);
			}
			map.put("invvMnivHmrsListRowcount", String.valueOf(vcRcmdFundPartCptnList.size()));
			map.put("invvMnivHmrsList", vcRcmdFundPartCptnList);

			// 펀드제안 STEP2 주주 정보 TB_BOX_IVT_FUND_STCH_CNFG_L
			List<Object> vcRcmdFundPrskInfoList = new ArrayList<>();
			for(int i=0 ; i<fundOpcmInfoVO.getFundStchCnfgList().size() ; i++) {
				HashMap<String,Object> hashMap = new HashMap<>();

				hashMap.put("fundRcmdId",fundOpcmInfoVO.getFundStchCnfgList().get(i).getFundId());			// 펀드ID
				hashMap.put("rgsnSqn",String.valueOf(fundOpcmInfoVO.getFundStchCnfgList().get(i).getRgsnSqn()));// 등록순번
				hashMap.put("stchNm",fundOpcmInfoVO.getFundStchCnfgList().get(i).getStchNm());				// 주주명
				hashMap.put("prtnAmt",String.valueOf(fundOpcmInfoVO.getFundStchCnfgList().get(i).getPrtnAmt()));			// 지분금액
				hashMap.put("prtnRt",String.valueOf(fundOpcmInfoVO.getFundStchCnfgList().get(i).getPrtnRto()));				// 지분율
				hashMap.put("rmrkCon",fundOpcmInfoVO.getFundStchCnfgList().get(i).getRmrk() != null ?
						fundOpcmInfoVO.getFundStchCnfgList().get(i).getRmrk() : "");				// 비고

				vcRcmdFundPrskInfoList.add(i, hashMap);
			}
			map.put("opcmPrskInfoListRowcount", String.valueOf(vcRcmdFundPrskInfoList.size()));
			map.put("opcmPrskInfoList", vcRcmdFundPrskInfoList);
			documentFeign.postVcFundData(map);
		}
	}

}
