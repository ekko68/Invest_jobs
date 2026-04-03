package com.ibk.sb.restapi.biz.api.common;

import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.jwt.ExtraIbkJwtUtil;
import com.ibk.sb.restapi.app.common.vo.CustomUser;
import com.ibk.sb.restapi.app.common.vo.PostSimpleBodyVO;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.biz.service.common.CommonFileService;
import com.ibk.sb.restapi.biz.service.common.vo.ComFileInfoVO;
import com.ibk.sb.restapi.biz.service.common.vo.RequestBinaryFileSaveVO;
import com.ibk.sb.restapi.biz.service.company.CompanyService;
import com.ibk.sb.restapi.biz.service.company.vo.base.CompanyBasicVO;
import com.ibk.sb.restapi.biz.service.platform.PlatformDocumentService;
import com.ibk.sb.restapi.biz.service.platform.vo.document.infotechcertkey.IntotechSaveCertResultVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.infotechcertkey.RequestEncryptedCertVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.infotechcertkey.RequestInfotechCertVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.nicescrap.NiceSimpleDocGroupVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.nicescrap.RequestSearchIvtNiceDocVO;
import com.ibk.sb.restapi.biz.service.platform.vo.stamp.CommerceSealVO;
import com.ibk.sb.restapi.biz.service.seal.SealService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.bind.DatatypeConverter;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Api(tags = {"투자박스 서류(스크래핑/eform) API"})
@Slf4j
@RestController
@RequestMapping(path = {"/api/doc", "/api/iv/v1/doc"}, produces = {MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class DocumentController {

    private final PlatformDocumentService platformDocumentService;

    private final CommonFileService commonFileService;

    private final SealService sealService;

    private final ExtraIbkJwtUtil extraIbkJwtUtil;
    
    private final CompanyService companyService;
    
    @ApiOperation(value = "간편서류 제출 전 클라우드 공동인증서 확인")
    @PostMapping("/infotech/simple/clientcertKey")
    public ResponseData searchInfotechClientCertKey() throws Exception {
    	String clientCertKey = "";
    	HashMap<String, Object> map = new HashMap<String, Object>();
    	
		CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		
		CompanyBasicVO companyBasicVO = new CompanyBasicVO();
		companyBasicVO.setUtlinsttId(user.getUserGroupId());
		
		// 사업자번호 조회
		companyBasicVO = companyService.setCompanyBasicPlatformInfo(companyBasicVO);
		
		// 사업자번호(bizrno) 로 ClientCertKey 조회
        String bzn = companyBasicVO.getBizrno();
        try {    			
			if (StringUtils.hasLength(bzn)) {
				clientCertKey = platformDocumentService.searchInfotechClientKey(bzn);
			}
			map.put("clientCertKey", clientCertKey);
			map.put("bzn", bzn);
			map.put("utlinsttId", user.getUserGroupId());
   	        
		}catch(BizException bx) {
            return ResponseData.builder()
                .code(bx.getErrorCode())
                .message(clientCertKey)
                .build();
		}
        
		return ResponseData.builder()
				.code(HttpStatus.OK.value())
				.message(HttpStatus.OK.getReasonPhrase())
				.data(map)
				.build();
    }
    
    @ApiOperation(value = "간편서류 infotech 스크래핑 사업자등록증")
    @PostMapping("/infotech/simple/bzn")
    public ResponseData searchInfotechBzn(@RequestBody HashMap<String , String> params) throws Exception {
        String papersPresentnDt = LocalDateTime.now(ZoneId.of("Asia/Seoul")).format(DateTimeFormatter.ofPattern("yyyyMMddHHmm"));
        
        Map<String, Object> reqParam = new HashMap();
        reqParam.put("bzn", params.get("bzn"));
        reqParam.put("clientCertKey", params.get("clientCertKey"));
        reqParam.put("utlinsttId", params.get("utlinsttId"));
        reqParam.put("fileNm", UUID.randomUUID().toString());
        reqParam.put("papersPresentnDt", papersPresentnDt);
        platformDocumentService.searchBznInfotechList(reqParam);
		
		return ResponseData.builder()
				.code(HttpStatus.OK.value())
				.message(HttpStatus.OK.getReasonPhrase())
				.data(reqParam)
				.build();
    }

    @ApiOperation(value = "간편서류 infotech 스크래핑 납세증명 조회")
    @PostMapping("/infotech/simple/tax")
    public ResponseData searchInfotechTax(@RequestBody HashMap<String , String> params) throws Exception {
        String papersPresentnDt = LocalDateTime.now(ZoneId.of("Asia/Seoul")).format(DateTimeFormatter.ofPattern("yyyyMMddHHmm"));

        Map<String, Object> reqParam = new HashMap();
        reqParam.put("bzn", params.get("bzn"));
        reqParam.put("clientCertKey", params.get("clientCertKey"));
        reqParam.put("utlinsttId", params.get("utlinsttId"));
        reqParam.put("fileNm", UUID.randomUUID().toString());
        reqParam.put("papersPresentnDt", papersPresentnDt);
        platformDocumentService.searchTaxInfotechList(reqParam);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(reqParam)
                .build();
    }
    
    @ApiOperation(value = "간편서류 infotech 스크래핑 표준재무정보증명 조회")
    @PostMapping("/infotech/simple/financial")
    public ResponseData searchInfotechFinancial(@RequestBody HashMap<String , String> params) throws Exception {
        
        Map<String, String> reqParam = new HashMap<String, String>();
        reqParam.put("bzn", params.get("bzn"));
        reqParam.put("clientCertKey", params.get("clientCertKey"));
        reqParam.put("utlinsttId", params.get("utlinsttId"));
        reqParam.put("fileNm", params.get("fileNm"));
        reqParam.put("papersPresentnDt", params.get("papersPresentnDt"));
        
        platformDocumentService.searchFinancialInfotechList(reqParam);
        
		return ResponseData.builder()
				.code(HttpStatus.OK.value())
				.message(HttpStatus.OK.getReasonPhrase())
				.build();
    }
    
    @ApiOperation(value = "간편서류 infotech 스크래핑 법인세 신고내역 조회")
    @PostMapping("/infotech/simple/law")
    public ResponseData searchInfotechLaw(@RequestBody HashMap<String , String> params) throws Exception {
        List list = platformDocumentService.searchLawInfotechList(params.get("bzn"), params.get("clientCertKey"));
		
		return ResponseData.builder()
				.code(HttpStatus.OK.value())
				.message(HttpStatus.OK.getReasonPhrase())
				.data(list)
				.build();
    }
    
    @ApiOperation(value = "간편서류 infotech 스크래핑 부가세 신고내역 조회")
    @PostMapping("/infotech/simple/vat")
    public ResponseData searchInfotechVat(@RequestBody HashMap<String , String> params) throws Exception {
        
        List list = platformDocumentService.searchVatInfotechList(params.get("bzn"), params.get("clientCertKey"));
		
		return ResponseData.builder()
				.code(HttpStatus.OK.value())
				.message(HttpStatus.OK.getReasonPhrase())
				.data(list)
				.build();
    }
    
    @ApiOperation(value = "간편서류 infotech 스크래핑 후 pdfHex값 파일 변환")
    @PostMapping("/infotech/simple/pdf")
    public ResponseData infotechGetPdfFile(@RequestBody HashMap<String , String> params) throws Exception {
    	
    	try {
    		CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    		
			 //pdfHex binary로 변환 
			 byte[] decode = DatatypeConverter.parseHexBinary(params.get("pdfHex").toString());
			 
			 RequestBinaryFileSaveVO saveTaxFileInfo = RequestBinaryFileSaveVO.builder()
					 .binary(decode)
					 .mime("application/pdf")
					 .ext("pdf")
					 .fileNm(params.get("papersPresentnDt")+ "_" + params.get("strTxnrmYm")+ "_" +params.get("docType") + "_" + user.getUserGroupId() +"_"+params.get("fileNm")+".pdf")
					 .build();
			 
			 commonFileService.uploadBinaryFile(saveTaxFileInfo, IvtCode.YnTypeEnum.N);
    		
    		return ResponseData.builder()
    				.code(HttpStatus.OK.value())
    				.message(HttpStatus.OK.getReasonPhrase())
    				.build();
    	} catch (BizException bx) {
    		
            return ResponseData.builder()
                    .code(bx.getErrorCode())
                    .message(StatusCode.COM0000.getMessage())
                    .build();
    	}
    }
    
    @ApiOperation(value = "간편서류 infotech 스크래핑 목록 조회")
    @GetMapping("/infotech/simple/list")
    public ResponseData searchInfotechSimpleDocList() throws Exception {
    	CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        List<ComFileInfoVO> resultList = platformDocumentService.searchInfotechSimpleDocList(user.getUserGroupId());

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(resultList)
                .build();
    }
    

    @ApiOperation(value = "간편서류 NICE 스크래핑 키 생성")
    @PostMapping("/nice/simple/key/save")
    public ResponseData createNiceSimpleDocKey() throws Exception {
        Map<String, String> result = platformDocumentService.createNiceMnbSimpleDocKey();

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    @ApiOperation(value = "간편서류 NICE 스크래핑 목록 조회")
    @GetMapping("/nice/simple/list")
    public ResponseData searchNiceSimpleDocList() throws Exception {
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        RequestSearchIvtNiceDocVO request = new RequestSearchIvtNiceDocVO(user.getUserGroupId(), user.getUsername());
        request.setLimitObj((long)1);
        request.setTargetKeyList(null);
        List<NiceSimpleDocGroupVO> resultList = platformDocumentService.searchNiceMnbSimpleDocList(request);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(resultList)
                .build();
    }

    /**
     * @param postSimpleBodyVO
     * @param response
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "간편서류 파일 다운로드")
    @PostMapping("/nice/simple/download")
    public ResponseData downloadNiceSimpleDocFile(@RequestBody PostSimpleBodyVO.SimpleIdBody postSimpleBodyVO, HttpServletResponse response) throws Exception {

        // NICE 스크래핑 파일 다운로드
        platformDocumentService.downloadNiceSimpleDocFile(postSimpleBodyVO.getId(), response);
        // 파일 다운로드가 정상 진행되는 경우 response 객체를 사용하기 때문에 ResponseData return이 없음
        return null;
    }

    @ApiOperation(value = "INFOTECH 스크래핑 인증키 발급")
    @PostMapping("/infotech/cert/key/save")
    public ResponseData saveInfotechCertKey(@RequestBody RequestEncryptedCertVO requestEncryptedCertVO) throws Exception {

        IntotechSaveCertResultVO result = platformDocumentService.saveInfotechCertificate(requestEncryptedCertVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

//    @PostMapping(path = {"/nda/eform/contract/upload"}, consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE})
//    public ResponseData uploadNdaEformPdf(@RequestPart(value = "file") MultipartFile file
//            , @RequestPart("tokenBody") Map<String, String> tokenBody
//            , HttpServletRequest request) throws Exception {
    @ApiOperation(value = "NDA PDF 업로드")
    @PostMapping("/nda/eform/contract/upload")
    public ResponseData uploadNdaEformPdf(@RequestBody Map<String, String> body, HttpServletRequest request) throws Exception {

        extraIbkJwtUtil.setUserDetailByJwtNextFilter(body.get("ivtAuthToken"), request);

        RequestBinaryFileSaveVO saveFileInfo = RequestBinaryFileSaveVO.builder()
                // IBK GW 특수문자 이슈로 base64 urlencoder, urldecoder를 사용해야함
//                .binary(Base64.getUrlDecoder().decode(body.get("fileBinary")))
                .binary(body.get("fileBinary"), Base64.getUrlDecoder())
                .mime(body.get("fileMime"))
                .ext(body.get("fileExt"))
                .fileNm(body.get("fileNm"))
                .build();

        if(!saveFileInfo.validateAllField()) {
            log.error("NDA PDF 업로드 정보 파라미터 오류");
            throw new BizException(StatusCode.MNB0002);
        }

        ComFileInfoVO fileInfoVO = commonFileService.uploadBinaryFile(saveFileInfo, IvtCode.YnTypeEnum.Y);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(fileInfoVO)
                .build();
    }

    /**
     * @param requestInfotechCertVO
     * @param request
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "인감정보 infotech 인증 확인")
    @PostMapping("/seal/infotech/cert")
    public ResponseData sealInfotechCert(@RequestBody RequestInfotechCertVO requestInfotechCertVO, HttpServletRequest request) throws Exception {

        extraIbkJwtUtil.setUserDetailByJwtNextFilter(requestInfotechCertVO.getIvtAuthToken(), request);

        CommerceSealVO sealVO = sealService.sealInfotechCert(requestInfotechCertVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(sealVO)
                .build();
    }
}
