package com.ibk.sb.restapi.biz.service.platform;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.util.DateUtil;
import com.ibk.sb.restapi.app.common.util.FileUtil;
import com.ibk.sb.restapi.app.common.vo.CustomUser;
import com.ibk.sb.restapi.biz.service.common.CommonFileService;
import com.ibk.sb.restapi.biz.service.common.SecureEncodeService;
import com.ibk.sb.restapi.biz.service.common.repo.CommonFileRepo;
import com.ibk.sb.restapi.biz.service.common.vo.ComFileInfoVO;
import com.ibk.sb.restapi.biz.service.common.vo.RequestBinaryFileSaveVO;
import com.ibk.sb.restapi.biz.service.platform.constant.CmmScpConst;
import com.ibk.sb.restapi.biz.service.platform.constant.PlatformStatusEnum;
import com.ibk.sb.restapi.biz.service.platform.feign.BoxOpenDocumentFeign;
import com.ibk.sb.restapi.biz.service.platform.repo.ScrappingDocumentRepo;
import com.ibk.sb.restapi.biz.service.platform.vo.document.cmmscp.InfotechContentVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.cmmscp.InfotechScpTemplateVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.cmmscp.RequestCmmScpVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.infotechcertkey.InfotechClientKeyVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.infotechcertkey.IntotechSaveCertResultVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.infotechcertkey.RequestEncryptedCertVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.nicescrap.*;
import com.ibk.sb.restapi.biz.service.platform.vo.document.infotechcertkey.RequestInfotechCertVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.infotechscrap.InfotechScrapBizLicenseSummaryVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.infotechscrap.InfotechScrapFinanceSummaryVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.infotechscrap.InfotechScrapTxtnVatCerlsnVO;
import com.ibk.sb.restapi.biz.service.platform.vo.response.BoxListResponseVO;
import com.ibk.sb.restapi.biz.service.platform.vo.response.BoxResponseVO;

import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletResponse;
import javax.xml.bind.DatatypeConverter;

import java.io.OutputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Month;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;


@Slf4j
@Service
@RequiredArgsConstructor
public class PlatformDocumentService {

    private final BoxOpenDocumentFeign documentFeign;

    private final ScrappingDocumentRepo documentRepo;

    private final SecureEncodeService secureEncodeService;

    private final FileUtil fileUtil;

    private final CommonFileService commonFileService;
    
    private final CommonFileRepo commonFileRepo;
    
    /*
    INFOTECH SCRAPPING
     */

    /**
     * 신규 공통 스크래핑 서비스 조회 (인포텍)
     * @param baseRequest
     * @param convertClass
     * @param addParam
     * @param <T>
     * @return
     * @throws Exception
     */
    public <T>  T searchCmmScpInfotechData (RequestCmmScpVO baseRequest, Class<T> convertClass, Map<String, String> addParam) throws Exception {
        // return set
        T result = null;

        // create mapper instance
        ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        // base request convert to map, and final request set
        HashMap<String, String> requestMap = mapper.convertValue(baseRequest, HashMap.class);
        if(addParam != null) requestMap.putAll(addParam);
        // call api
        BoxListResponseVO<HashMap<String, Object>> response = documentFeign.getCmmScpData(requestMap);
        
        if(response == null) throw new BizException(StatusCode.MNB0001, StatusCode.MNB0001.getMessage());
        if(!response.getSTATUS().equals(PlatformStatusEnum.OK.getStatus())) {
            log.error("Cmm Scrapping API Network Err : {}", response.getRSLT_MSG());
            throw new BizException(StatusCode.MNB0003, response.getRSLT_MSG());
        }

        // template convert
        if(response.getRSLT_DATA() == null || response.getRSLT_DATA().size() <= 0) throw new BizException(StatusCode.MNB0003, StatusCode.MNB0003.getMessage());
        if(!response.getRSLT_DATA().get(0).containsKey(baseRequest.getDocCd())) throw new BizException(StatusCode.MNB0003, StatusCode.MNB0003.getMessage());
        InfotechScpTemplateVO template = mapper.convertValue(response.getRSLT_DATA().get(0).get(baseRequest.getDocCd()), InfotechScpTemplateVO.class);        	

        // template status code check
        if(!template.getResCd().equals(PlatformStatusEnum.OK.getStatus())) {
            log.error("Cmm Scrapping API Infotech Err : {}", template.getResMsg());
            throw new BizException(StatusCode.MNB0003, template.getResMsg());
        }
        if(template.getOut() == null) throw new BizException(StatusCode.MNB0003, StatusCode.MNB0003.getMessage());
        if(!template.getOut().getResCd().equals(PlatformStatusEnum.OK.getStatus())
            || template.getOut().getErrYn().equals(IvtCode.YnTypeEnum.Y.name())) {
            log.error("Cmm Scrapping API Infotech Err In One Depth Out --> ResMsg : {}", template.getOut().getResMsg());
            log.error("Cmm Scrapping API Infotech Err In One Depth Out --> ErrMsg : {}", template.getOut().getErrMsg());
            throw new BizException(StatusCode.MNB0003, template.getOut().getErrMsg());
        }

        // 2 depth out convert
        result = mapper.convertValue(template.getOut().getOut(), convertClass);
        
        return result;
    }

    /**
     * NDA Infotech 인증서 확인
     * 대출박스 NDA Eform에서 cert hash 추출
     * -> 투자박스에서 로그인된 사용자의 매핑기업 사업자등록번호로 확인 By infotech 사업자등록증 조회
     *
     * @param requestInfotechCertVO
     * @return
     * @throws Exception
     */
    public boolean checkCertInfoInfotechByBizLicense(RequestInfotechCertVO requestInfotechCertVO) throws Exception {

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // RequestBody 설정
        Map<String, String> body = new HashMap<>();
        body.put("signCert", requestInfotechCertVO.getSignCert());
        body.put("signPri", requestInfotechCertVO.getSignPri());
        body.put("signPw", requestInfotechCertVO.getSignPw());

        String userBizNo = user.getUserGroupBizNum().replaceAll("[^0-9]", "");
        body.put("bizNo", userBizNo);

        // 잘못된 인증서로 조회할 경우 1차적으로 사업자번호가 인증서와 맞지 않아 사업자등록증 조회에서 에러가 발생
        BoxResponseVO<InfotechScrapBizLicenseSummaryVO> responseVO = documentFeign.getInfotechHometaxBizLicense(body);
        if (responseVO == null) throw new BizException(StatusCode.MNB0001);

        if (responseVO.getRSLT_DATA().getErrYn().equals(IvtCode.YnTypeEnum.Y.name())) {
            log.error("INFOTECH SCRAPPING ERROR : {}", responseVO.getRSLT_DATA().getErrMsg());
            if(StringUtils.hasLength(responseVO.getRSLT_DATA().getErrMsg())){
                String errMsg = responseVO.getRSLT_DATA().getErrMsg();
                if(errMsg.startsWith("[LOGIN-014] 국세청홈택스에 등록된 인증서가 아닙니다")) throw new BizException(StatusCode.BIZ2000);
                else if(errMsg.startsWith("[B0001] 입력한 사업자 등록번호를 확인해주시기 바랍니다")) throw new BizException(StatusCode.BIZ2001);
            }
            throw new BizException(StatusCode.MNB0003);
        }

        // 위에서 에러가 발생하지 않더라도 사업자번호 다시 비교조회 처리
        if (StringUtils.hasLength(responseVO.getRSLT_DATA().getTxprDscmNoEncCntn())) {
            return responseVO.getRSLT_DATA()
                    .getTxprDscmNoEncCntn()
                    .replaceAll("[^0-9]", "")
                    .equals(userBizNo);
        } else {
            throw new BizException(StatusCode.MNB0003);
        }
    }

    /**
     * 로그인 회원 사업자번호 - 기존 INFOTECH ClientKey 조회
     *
     * @return
     * @throws Exception
     */
    public String searchInfotechClientKeyByLoginData() throws Exception {

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        return searchInfotechClientKey(user.getUserGroupBizNum());
    }

    /**
     * 사업자번호 - INFOTECH ClientKey 조회
     *
     * @param usisBzn
     * @return
     * @throws Exception
     */
    public String searchInfotechClientKey(String usisBzn) throws Exception {
        if (!StringUtils.hasLength(usisBzn)) throw new BizException(StatusCode.COM0005);
        
    	// RequestBody 설정
    	Map<String, String> body = new HashMap();
    	body.put("usisBzn", usisBzn.replaceAll("[^0-9]", ""));
    	
    	// 인증서 정보 조회
    	BoxResponseVO<InfotechClientKeyVO> responseVO = documentFeign.getInfotechClientKey(body);
    	
    	// 통신 자체에 문제가 생긴 경우
    	if (responseVO == null) throw new BizException(StatusCode.MNB0001, StatusCode.MNB0001.getMessage());
    	// API의 Biz Exception인 경우
    	else if (!responseVO.getSTATUS().equals(PlatformStatusEnum.OK.getStatus())) {
    		log.error("responseVO.getRSLT_MSG() = > "+ responseVO.getRSLT_MSG());
    		return responseVO.getSTATUS() + "/" +responseVO.getRSLT_MSG();
    	}

    	return responseVO.getRSLT_DATA().getClientCertKey();
    }

    /**
     * INFOTECH 사용자 인증서 등록
     *
     * @param requestEncryptedCertVO
     * @return
     * @throws Exception
     */
//    public IntotechSaveCertResultVO saveInfotechCertificate(RequestInfotechCertVO requestInfotechCertVO) throws Exception {
    public IntotechSaveCertResultVO saveInfotechCertificate(RequestEncryptedCertVO requestEncryptedCertVO) throws Exception {
        // 공개키 파일로 암호화 된 파라미터 복호화
        RequestInfotechCertVO requestInfotechCertVO = RequestInfotechCertVO.builder()
                .signCert(
                        secureEncodeService.decryptStrListByRsaPrivateKeyFile(requestEncryptedCertVO.getEncSignCertStrList())
                                .stream().reduce("", String::concat)
                )
                .signPri(
                        secureEncodeService.decryptStrListByRsaPrivateKeyFile(requestEncryptedCertVO.getEncSignPriStrList())
                                .stream().reduce("", String::concat)
                )
                .signPw(
                    secureEncodeService.decryptByStrRsaPrivateKeyFile(requestEncryptedCertVO.getEncSignPw())
                )
                .build();

        // 추출 인증서 정보 유무 확인
        if (!StringUtils.hasLength(requestInfotechCertVO.getSignCert())
                || !StringUtils.hasLength(requestInfotechCertVO.getSignPri())
                || !StringUtils.hasLength(requestInfotechCertVO.getSignPw())) {
            throw new BizException(StatusCode.COM0007);
        }

        // 추출된 인증서 정보로 사업자등록증 조회 및 로그인 정보 사업자번호와 대조 확인
        // 메서드 내부 api 통신을 통해 조회 시점에서 StatusCode.BIZ2001 throw exception 될 수 있음
        if(!checkCertInfoInfotechByBizLicense(requestInfotechCertVO)) throw new BizException(StatusCode.BIZ2001);

        // MNB 인포텍 등록정보 설정
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        requestInfotechCertVO.setUsisId(user.getUserGroupId());
        requestInfotechCertVO.setUsisBzn(user.getUserGroupBizNum().replaceAll("[^0-9]", ""));
        requestInfotechCertVO.setRgsrId(user.getUsername());

        // 프론트에서 전달받은 인증서 만료일 yyyyMMdd 체크 확인 및 반환 값 set
        requestInfotechCertVO.setAtshExpyYmd(
                DateUtil.checkFormat(requestEncryptedCertVO.getAtshExpyYmd()));

        // 기존에 만료되지 않은 인증키가 존재하는지 확인
        String beforeClientCertKey = searchInfotechClientKeyByLoginData();
        if(beforeClientCertKey == null) beforeClientCertKey = "";

        // 인증키 존재 유무에 따른 MNB 등록/수정 api 호출
        BoxResponseVO<IntotechSaveCertResultVO> responseVO;
        if (!StringUtils.hasLength(beforeClientCertKey.trim())) {
            // 인포텍 ClientKey 등록
            responseVO = documentFeign.postSaveInfotechCertificate(requestInfotechCertVO);
        } else {
            requestInfotechCertVO.setClientCertKey(beforeClientCertKey);
            // 인포텍 ClientKey 수정
            responseVO = documentFeign.postUpdateInfotechCertificate(requestInfotechCertVO);
        }

        if (responseVO.getSTATUS() == null) throw new BizException(StatusCode.MNB0001);
        else if (!responseVO.getSTATUS().equals(PlatformStatusEnum.OK.getStatus())) {
            log.error(responseVO.getRSLT_MSG());
            if (responseVO.getRSLT_DATA() != null && StringUtils.hasLength(responseVO.getRSLT_DATA().getErrMsg())) log.error(responseVO.getRSLT_DATA().getErrMsg());
            throw new BizException(StatusCode.MNB0002);
        }

        return responseVO.getRSLT_DATA();
    }

    /**
     * INFOTECH Hometax 사업자등록증 조회
     *
     * @param clientCertKey
     * @param bizrno
     * @return
     * @throws Exception
     */
    public InfotechScrapBizLicenseSummaryVO searchInfotechHometaxBizInfo(String clientCertKey, String bizrno) throws Exception {
        if (!(StringUtils.hasLength(clientCertKey) && StringUtils.hasLength(bizrno))) throw new BizException(StatusCode.COM9998);

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("clientCertKey", clientCertKey);
        requestBody.put("bizNo", bizrno);
        
        BoxResponseVO<InfotechScrapBizLicenseSummaryVO> response = documentFeign.getInfotechHometaxBizLicense(requestBody);

        if (!(response != null && response.getSTATUS().equals(PlatformStatusEnum.OK.getStatus()) && response.getRSLT_DATA() != null)) throw new BizException(StatusCode.MNB0001);
        if (response.getRSLT_DATA().getErrYn().equals(IvtCode.YnTypeEnum.Y.name())) {
            log.error("INFOTECH SCRAPPING ERROR : {}", response.getRSLT_DATA().getErrMsg());
            throw new BizException(StatusCode.COM0000,response.getRSLT_DATA().getErrMsg());
        }
        return response.getRSLT_DATA();
    }

    /**
     * INFOTECH Hometax 표준재무제표증명 조회
     *
     * @param clientCertKey
     * @param bizrno
     * @param txnrmStrtYm
     * @param txnrmEndYm
     * @return
     * @throws Exception
     */
    public InfotechScrapFinanceSummaryVO searchInfotechHometaxFinanceInfo(String clientCertKey, String bizrno, String txnrmStrtYm, String txnrmEndYm) throws Exception {
        if (!(StringUtils.hasLength(clientCertKey) && StringUtils.hasLength(bizrno)
                && StringUtils.hasLength(txnrmStrtYm) && StringUtils.hasLength(txnrmEndYm))) throw new BizException(StatusCode.COM9998);

        Map<String, String> requestBody = new HashMap<>();
        requestBody.put("clientCertKey", clientCertKey);
        requestBody.put("bizNo", bizrno);
        requestBody.put("txnrmStrtYm", txnrmStrtYm);
        requestBody.put("txnrmEndYm", txnrmEndYm);

        BoxResponseVO<InfotechScrapFinanceSummaryVO> response = documentFeign.getInfotechHometaxFinancialStatements(requestBody);
        if (!(response != null && response.getSTATUS().equals(PlatformStatusEnum.OK.getStatus()) && response.getRSLT_DATA() != null)) throw new BizException(StatusCode.MNB0001);
        if (response.getRSLT_DATA().getErrYn().equals(IvtCode.YnTypeEnum.Y.name()) && !response.getRSLT_DATA().getErrMsg().contains("요청 문서가 발급불가 상태입니다.")) {
            log.error("INFOTECH SCRAPPING ERROR : {}", response.getRSLT_DATA().getErrMsg());
            throw new BizException(StatusCode.COM0000, response.getRSLT_DATA().getErrMsg());
        }
        return response.getRSLT_DATA();
    }

    /**
     * Infotech 간편서류 목록 조회 (사업자등록증)
     * @return
     * @throws Exception
     */
    public void searchBznInfotechList(Map<String, Object> reqParam) throws Exception {
    	
		if(StringUtils.hasLength((CharSequence) reqParam.get("clientCertKey"))) {
	       	 // 사업자 등록증
	       	 RequestCmmScpVO bznScpReq = RequestCmmScpVO.builder()
	 			.clientCertKey((String) reqParam.get("clientCertKey"))
			 	.bizNo((String) reqParam.get("bzn"))
			 	.scpType(CmmScpConst.ScpTypeEnum.INFOTECH_CLOUD.getCode())
			 	.docCd(CmmScpConst.DocTypeEnum.INFOTECH_BIZ_LICENSE.getCode())
			 	.build();
	    	 Map<String, String> bznParam = new HashMap<>();	 
	    	 bznParam.put("pdfYnE101", IvtCode.YnTypeEnum.Y.name());
	    	 bznParam.put("recordYn", "N");
	    	
	 		 InfotechContentVO.E101PdfOnly scpE101Rslt = this.searchCmmScpInfotechData(bznScpReq, InfotechContentVO.E101PdfOnly.class, bznParam);
	 		 if(scpE101Rslt != null && StringUtils.hasLength(scpE101Rslt.getPdfHex())) {
				//pdfHex binary로 변환 
	 			String e101PdfHex = scpE101Rslt.getPdfHex();
	            byte[] decode = DatatypeConverter.parseHexBinary(e101PdfHex.toString());
	            
	   	        RequestBinaryFileSaveVO saveBznFileInfo = RequestBinaryFileSaveVO.builder()
                    .binary(decode)
                    .mime("application/pdf")
                    .ext("pdf")
                    .fileNm(reqParam.get("papersPresentnDt") + "_e101_" + reqParam.get("utlinsttId") + "_" +reqParam.get("fileNm")+".pdf")
                    .build();
	   	        
	   	        commonFileService.uploadBinaryFile(saveBznFileInfo, IvtCode.YnTypeEnum.N);
	 		 }
		}
    }

    /**
     * Infotech 간편서류 목록 조회 (납세여부)
     * @return
     * @throws Exception
     */
    public void searchTaxInfotechList(Map<String, Object> reqParam) throws Exception {

        if(StringUtils.hasLength((CharSequence) reqParam.get("clientCertKey"))) {
            // 납세사실증명
            RequestCmmScpVO taxScpReq = RequestCmmScpVO.builder()
                .clientCertKey((String) reqParam.get("clientCertKey"))
                .bizNo((String) reqParam.get("bzn"))
                .scpType(CmmScpConst.ScpTypeEnum.INFOTECH_CLOUD.getCode())
                .docCd("E103")
                .build();
            Map<String, String> taxParam = new HashMap<>();
            taxParam.put("pdfYnE103", IvtCode.YnTypeEnum.Y.name());
            taxParam.put("recordYn", "N");

            InfotechContentVO.E101PdfOnly scpE103Rslt = this.searchCmmScpInfotechData(taxScpReq, InfotechContentVO.E101PdfOnly.class, taxParam);
            if(scpE103Rslt != null && StringUtils.hasLength(scpE103Rslt.getPdfHex())) {
                //pdfHex binary로 변환
                String e103PdfHex = scpE103Rslt.getPdfHex();
                byte[] decode = DatatypeConverter.parseHexBinary(e103PdfHex.toString());

                RequestBinaryFileSaveVO saveTaxFileInfo = RequestBinaryFileSaveVO.builder()
                    .binary(decode)
                    .mime("application/pdf")
                    .ext("pdf")
                    .fileNm(reqParam.get("papersPresentnDt") + "_e103_" + reqParam.get("utlinsttId") + "_" +reqParam.get("fileNm")+".pdf")
                    .build();

                commonFileService.uploadBinaryFile(saveTaxFileInfo, IvtCode.YnTypeEnum.N);
            }
        }
    }
    
    /**
     * Infotech 간편서류 목록 조회 (표준 재무 제표 증명)
     * @return
     * @throws Exception
     */
    public void searchFinancialInfotechList(Map<String, String> reqParam) throws Exception { 
    	// 표준 재무 제표 증명 5년
		RequestCmmScpVO financialScpReq = RequestCmmScpVO.builder()
			 .clientCertKey(reqParam.get("clientCertKey"))
			 .bizNo(reqParam.get("bzn"))
			 .scpType(CmmScpConst.ScpTypeEnum.INFOTECH_CLOUD.getCode())
			 .docCd("E102")
			 .build();
		LocalDate getDate = LocalDate.now(ZoneId.of("Asia/Seoul"));
		String currentYm = String.valueOf(getDate).replace("-", "");
		
		for(int i=0 ; i<5 ; i++) {
			Map<String, String> financialParam = new HashMap<>();
			String txnrmStrtYm = "";
			String txnrmEndYm = "";
			if(currentYm.substring(4,6) == "06") {
				txnrmStrtYm = LocalDate.of(LocalDate.now(ZoneId.of("Asia/Seoul")).getYear() - i, Month.JANUARY, 1).format(DateTimeFormatter.ofPattern("yyyyMM"));
				txnrmEndYm = LocalDate.of(LocalDate.now(ZoneId.of("Asia/Seoul")).getYear() - i, Month.DECEMBER, 1).format(DateTimeFormatter.ofPattern("yyyyMM"));
			}else {
				txnrmStrtYm = LocalDate.of(LocalDate.now(ZoneId.of("Asia/Seoul")).getYear() - (1+i), Month.JANUARY, 1).format(DateTimeFormatter.ofPattern("yyyyMM"));
				txnrmEndYm = LocalDate.of(LocalDate.now(ZoneId.of("Asia/Seoul")).getYear() - (1+i), Month.DECEMBER, 1).format(DateTimeFormatter.ofPattern("yyyyMM"));
			}
		 	financialParam.put("txnrmStrtYmE102", txnrmStrtYm);
			financialParam.put("txnrmEndYmE102", txnrmEndYm);
			financialParam.put("pdfYnE102", IvtCode.YnTypeEnum.Y.name());
			financialParam.put("recordYn", "N");
			
			InfotechContentVO.E101PdfOnly scpE102Rslt = this.searchCmmScpInfotechData(financialScpReq, InfotechContentVO.E101PdfOnly.class, financialParam);
			 
			if(scpE102Rslt != null && StringUtils.hasLength(scpE102Rslt.getPdfHex())) {
				//pdfHex binary로 변환 
				String e102PdfHex = scpE102Rslt.getPdfHex();
				byte[] decode = DatatypeConverter.parseHexBinary(e102PdfHex.toString());
			
				RequestBinaryFileSaveVO saveTaxFileInfo = RequestBinaryFileSaveVO.builder()
				 .binary(decode)
				 .mime("application/pdf")
				 .ext("pdf")
				 .fileNm(reqParam.get("papersPresentnDt") + "_" + txnrmStrtYm + "_e102_" + reqParam.get("utlinsttId") + "_" + reqParam.get("fileNm")+".pdf")
				 .build();
				commonFileService.uploadBinaryFile(saveTaxFileInfo, IvtCode.YnTypeEnum.N);
			}
		 }
    }
    
    /**
     * Infotech 간편서류 목록 조회 (법인세 신고내역)
     * @return
     * @throws Exception
     */
    public List searchLawInfotechList(String bznNo, String clientCertKey) throws Exception { 
    	 // 법인세 신고내역 3년
    	List list = new ArrayList();
    	LocalDate getDate = LocalDate.now(ZoneId.of("Asia/Seoul"));
    	String currentYm = String.valueOf(getDate).replace("-", "");
    	String lawTxnrmStrtY = "";
        for(int i=0 ; i<3 ; i++) {
            if(currentYm.substring(4,6) == "06") {
                lawTxnrmStrtY = LocalDate.of(LocalDate.now(ZoneId.of("Asia/Seoul")).getYear() - i, Month.JANUARY, 1).format(DateTimeFormatter.ofPattern("yyyy"));
            }else {
                lawTxnrmStrtY = LocalDate.of(LocalDate.now(ZoneId.of("Asia/Seoul")).getYear() - (1+i), Month.JANUARY, 1).format(DateTimeFormatter.ofPattern("yyyy"));
            }
            // 과세기간 기준 설정 (최근5개년도 1~12)
            RequestCmmScpVO lawScpReq = RequestCmmScpVO.builder()
             .clientCertKey(clientCertKey)
             .bizNo(bznNo)
             .scpType(CmmScpConst.ScpTypeEnum.INFOTECH_CLOUD.getCode())
             .docCd("E105")
             .build();
            Map<String, String> lawParam = new HashMap<>();
            lawParam.put("pdfYnE105", IvtCode.YnTypeEnum.Y.name());
            lawParam.put("appCdE105", "ibk");
            lawParam.put("orgCdE105", "hometax");
            lawParam.put("svcCdE105", "Z5004");
            lawParam.put("itrfCdE105", "31");
            lawParam.put("yyyyE105", lawTxnrmStrtY);
            lawParam.put("recordYn", "N");

            // create mapper instance
            ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
            // base request convert to map, and final request set
            HashMap<String, String> requestMap = mapper.convertValue(lawScpReq, HashMap.class);
            if(lawParam != null) requestMap.putAll(lawParam);
            // call api
            BoxListResponseVO<HashMap<String, Object>> response = documentFeign.getCmmScpData(requestMap);
            if (!response.getRSLT_DATA().isEmpty()){ // 수정
                list.add(i , response.getRSLT_DATA().get(0).get("E105"));
            }
        }
		return list;
    }
    
    /**
     * Infotech 간편서류 목록 조회 (부가가치세 신고내역)
     * @return
     * @throws Exception
     */
    public List searchVatInfotechList(String bznNo, String clientCertKey) throws Exception { 
		 // 부가가치세 신고내역 5년
    	 List list = new ArrayList();
         LocalDate getDate = LocalDate.now(ZoneId.of("Asia/Seoul"));
         String currentYm = String.valueOf(getDate).replace("-", "");
         String vatTxnrmStrtY = "";
         
    	 // 과세기간 기준 설정 (최근5개년도 1~12)
		 for(int i=0 ; i<5 ; i++) {
			 if(currentYm.substring(4,6) == "06") {
				 vatTxnrmStrtY = LocalDate.of(LocalDate.now(ZoneId.of("Asia/Seoul")).getYear() - i, Month.JANUARY, 1).format(DateTimeFormatter.ofPattern("yyyy"));
			 }else {
				 vatTxnrmStrtY = LocalDate.of(LocalDate.now(ZoneId.of("Asia/Seoul")).getYear() - (1+i), Month.JANUARY, 1).format(DateTimeFormatter.ofPattern("yyyy"));
			 }
	   		 
	   		 RequestCmmScpVO vatScpReq = RequestCmmScpVO.builder()
				 .clientCertKey(clientCertKey)
				 .bizNo(bznNo)
				 .scpType(CmmScpConst.ScpTypeEnum.INFOTECH_CLOUD.getCode())
				 .docCd("E107")
				 .build();
	   		 Map<String, String> vatParam = new HashMap<>();
	   		 vatParam.put("pdfYnE107", IvtCode.YnTypeEnum.Y.name());
	   		 vatParam.put("appCdE107", "ibk");
	   		 vatParam.put("orgCdE107", "hometax");
	   		 vatParam.put("svcCdE107", "Z5004");
	   		 vatParam.put("itrfCdE107", "41");
	   		 vatParam.put("yyyyE107", vatTxnrmStrtY);
	   		 vatParam.put("recordYn", "N");
	   		
			 // create mapper instance
	         ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
	         // base request convert to map, and final request set
	         HashMap<String, String> requestMap = mapper.convertValue(vatScpReq, HashMap.class);
	         if(vatParam != null) requestMap.putAll(vatParam);
	         // call api
	         BoxListResponseVO<HashMap<String, Object>> response = documentFeign.getCmmScpData(requestMap);
	         
	         if (!response.getRSLT_DATA().isEmpty()){ // 수정
	        	 list.add(i , response.getRSLT_DATA().get(0).get("E107"));
	         }
		 }
		 return list;
    }
    
    /**
     * Infotech 간편서류 제출 서류함 목록 조회
     * @return
     * @throws Exception
     */
    public List<ComFileInfoVO> searchInfotechSimpleDocList(String utlinsttId) throws Exception { 
    	 List<ComFileInfoVO> list = new ArrayList<ComFileInfoVO>();
    	 List<ComFileInfoVO> result = new ArrayList<ComFileInfoVO>();
         try {
        	 list = commonFileRepo.selectInfotechFileInfo(utlinsttId);
             if(list.size() > 0) {
                 String[] compareStr = list.get(0).getFileNm().split("_");
                 for(int i=0 ; i<list.size() ; i++) {
                     if(list.get(i).getFileNm().contains(compareStr[0])) {
                         result.add(i, list.get(i));
                     }
                 }
             }
         } catch(BizException bx) {
        	 throw new BizException(StatusCode.COM0000, bx.getMessage());
         }
		 return result;
    }
    
    /*
    NICE SCRAPPING
     */

    /**
     * 메인박스 Nice Scrapping 은행키 정보 조회
     * 기존에는 이용원장 조회에서 neisBsnmCrtfcNo 필드로 함께 조회된 것 같으나
     * -> 현재 스크래핑 요청 box api로 따로 조회하여 처리하는 듯함
     * <p>
     * -> 메인박스 인증키 가져오기 (cert//getBankCode.do) 컨트롤러 참조
     *
     * @return
     * @throws Exception
     */
    public Map<String, String> createNiceMnbSimpleDocKey() throws Exception {

        // 로그인 정보 조회
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 키 조회 (Main Box 이용원장 조회 neisBsnmCrtfcNo)
        // 위 주석 내용대로 사용하지 않음
//        MainCompanyVO mainCompanyVO = platformAccountService.searchMainCompanyByBizNum(user.getUserGroupBizNum());
//        if(!StringUtils.hasLength(mainCompanyVO.getNeisBsnmCrtfcNo())) throw new BizException(StatusCode.COM9998);

        // 요청 데이터 설정 (아이디 제외 VO에 메인박스 맞춰 초기값 설정 되어있음)
        RequestNiceMnbKeyVO requestVO = new RequestNiceMnbKeyVO();
        requestVO.setSysLsmdId(user.getUsername());

        NiceMnbKeyVO niceMnbKeyVO = documentFeign.getMnbNiceSimpleDocKey(requestVO);

        if (!(niceMnbKeyVO != null && niceMnbKeyVO.getJobRsltDcd().equals("01"))) throw new BizException(StatusCode.MNB0003);

        // 투자박스 테이블 키 이력 등록
        documentRepo.insertNiceSimpleDocKey(
                NiceIvtKeyVO.builder()
                        .utlinsttId(user.getUserGroupId())
                        .simpDocRgsnId(niceMnbKeyVO.getScpgRqstKeyNo())
                        .rgsnUserId(user.getUsername())
                        .amnnUserId(user.getUsername())
                        .build()
        );

        // 프론트 키 데이터 전송
        Map<String, String> result = new HashMap<>();
        result.put("docKey", niceMnbKeyVO.getScpgRqstKeyNo());
        result.put("bizrno", user.getUserGroupBizNum());

        return result;
    }

    /**
     * NICE 간편서류 스크래핑 목록 조회 (투자박스 키 기준)
     *
     * @param requestVO tagetKeyList이 null일 때 투자박스 기준 최신 제출일자의 서류를 가져옴
     * @return
     * @throws Exception
     */
    public List<NiceSimpleDocGroupVO> searchNiceMnbSimpleDocList(RequestSearchIvtNiceDocVO requestVO) throws Exception {

        // 기관 아이디 정보 설정
        Map<String, String> request = new HashMap<>();
        request.put("utlinsttId", requestVO.getUtlinsttId());
        // 목록 자체는 기업 아이디로 조회됨
        // 대표자 본인 아이디가 아닐 경우 소득금액증명원 등 서류 조회 제한이 있음
        request.put("userId", requestVO.getUserId());

        // 문서 목록 조회
        BoxListResponseVO<NiceMnbSimpleDocVO> searchList = documentFeign.getNiceMnbSimpleDocList(request);
        if (!(searchList != null && searchList.getSTATUS().equals(PlatformStatusEnum.OK.getStatus()))) {
            throw new BizException(StatusCode.MNB0001);
        }

        List<NiceMnbSimpleDocVO> originalList = searchList.getRSLT_DATA() != null ? searchList.getRSLT_DATA() : new ArrayList<>();

        // TODO : 목록 편집 -> 추가적으로 기획 정의가 생기면 편집
        // 최근 투자박스 제출 등록 건을 기준으로 조회
        if (requestVO.getTargetKeyList() == null) {
            List<String> docKeyList = documentRepo.selectNiceSimpleDocKey(requestVO.getUtlinsttId());
            requestVO.setTargetKeyList(docKeyList != null ? docKeyList : new ArrayList<>());
        }

        // 필터링 & 그룹핑
        Map<String, List<NiceMnbSimpleDocVO>> groupMap = originalList.stream()
                .filter(x -> requestVO.getTargetKeyList().contains(x.getScpgRqstNo()))
                .collect(Collectors.groupingBy(NiceMnbSimpleDocVO::getScpgRqstNo));

        // TargetKeyList에서 메인박스 조회시 유효하지 않은 key들은 논리삭제처리
        // 사용하는 간편서류키가 실제 사용 및 등록처리되는데 시간이 걸릴 수 있으므로 Table 등록일 기준 일정 시간이 지난 key를 대상으로 한다
        // 현재 기준 : 메인박스 리스트에 없는 키 + 키가 Table에 등록된지 1일이 지남
        requestVO.getTargetKeyList().removeAll(Arrays.asList(groupMap.keySet().toArray()));
        for(String deleteKey : requestVO.getTargetKeyList()) documentRepo.deleteNiceSimpleDocKey(deleteKey, requestVO.getUserId());

        // 조건에 따른 stream 필터 처리를 위해 Key Stream 변수를 별도 할당
        Stream<String> groupKeySetStream = groupMap.keySet().stream();

        // 기본 필터 및 정렬
        groupKeySetStream = groupKeySetStream
                .filter(x -> groupMap.get(x) != null && groupMap.get(x).size() > 0)
                // papersPresentnDt을 LocalDateTime으로 parse하는 getter 생성 및 LocalDateTime이 구현한 Comparable 사용
                // 날짜 내림차순(DESC) 정렬
                .sorted(Comparator.comparing(x -> groupMap.get(x).get(0).getPapersPresentnDtLocalDateTime()).reversed());

        // 값이 있을 경우만 limit 처리
        if (requestVO.getLimitObj() != null && requestVO.getLimitObj() > 0) {
            groupKeySetStream = groupKeySetStream.limit(requestVO.getLimitObj());
        }

        // 그룹 Map list 매핑
        List<NiceSimpleDocGroupVO> resultList = groupKeySetStream
                .map(x -> {
                    NiceSimpleDocGroupVO initGroup = new NiceSimpleDocGroupVO();
                    initGroup.setScpgRqstNo(x);
                    initGroup.setPapersPresentnDt(groupMap.get(x).get(0).getPapersPresentnDt());
                    initGroup.setDocList(groupMap.get(x));

                    return initGroup;
                })
                .collect(Collectors.toList());

        return resultList != null ? resultList : new ArrayList<>();
    }

    /**
     * NICE 간편서류 스크래핑 파일 다운로드
     * 메인박스 niceElcrFileDnld.do 컨트롤러 참조
     *
     * @param id
     * @param response
     * @throws Exception
     */
    public void downloadNiceSimpleDocFile(String id, HttpServletResponse response) throws Exception {

        // Nice 파일 Base64 Binary Return (id : papersAtchFlpthNm)
        NiceSimpleDocFileResponseVO niceFileResponse = documentFeign.getNiceSimpleDocFileInfo(id);

        // 파일다운로드 (파일명은 MNB 해당 Controller 참조)
        if (niceFileResponse != null && niceFileResponse.getItems() != null && niceFileResponse.getItems().getItem() != null) {

            // for 문으로 돌려야 하므로 fileUtils을 직접 사용
            try (OutputStream outputStream = response.getOutputStream()) {
                for (NiceSimpleDocFileResponseVO.Items.Item item : niceFileResponse.getItems().getItem()) {
                    // 파일명 : MNB 기준
                    String fileName = LocalDateTime
                            .now(ZoneId.of("Asia/Seoul"))
                            .format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")).toString() + ".pdf";

                    // MNB 기준 header set
                    response.setHeader("Content-Disposition", "attachment;filename=\"" + fileName + "\"");

                    // 추가 헤더
                    response.setContentType(MediaType.APPLICATION_PDF_VALUE);
                    response.setHeader("Content-Transfer-Encoding", "binary");

                    // 파일 다운로드 CORS 처리를 위한 헤더 세팅
                    response.setHeader("Access-Control-Allow-Origin", "*");

                    fileUtil.binaryFileDownload(item.getPdfB64EncBin(), outputStream);
                }
            }
        }
    }
    
 
}
