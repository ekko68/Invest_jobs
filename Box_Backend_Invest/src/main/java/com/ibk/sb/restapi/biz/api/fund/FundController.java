package com.ibk.sb.restapi.biz.api.fund;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.biz.service.common.CommonFileService;
import com.ibk.sb.restapi.biz.service.fund.FundService;
import com.ibk.sb.restapi.biz.service.fund.vo.opcmlInfo.FundOpcmInfoVO;
import com.ibk.sb.restapi.biz.service.fund.vo.prdInfo.FundPrdtInfoPageVO;
import com.ibk.sb.restapi.biz.service.fund.vo.prdInfo.FundPrdtInfoVO;
import com.ibk.sb.restapi.biz.service.platform.PlatformDocumentService;
import com.ibk.sb.restapi.biz.service.platform.vo.document.infotechscrap.InfotechScrapFinanceSummaryVO;
import com.ibk.sb.restapi.biz.service.support.SupportService;


import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;

@Api(tags = {"간접투자 펀드제안 API"})
@RestController
@RequestMapping(path = {"/api/fund", "/api/iv/v1/fund"}, produces = {MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class FundController {
	
	 private final FundService fundService;
	 
	 /** ================================ Get Method Mapping ================================ **/
	
	@ApiOperation(value = "펀드제안 목록 조회")
    @GetMapping("/list")
    public ResponseData searchFundList(FundPrdtInfoPageVO params) throws Exception {

		PagingVO<FundPrdtInfoVO> fundList = fundService.searchFundList(params);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(fundList)
                .build();
    }

    @ApiOperation(value = "나의 펀드제안 목록 조회")
    @GetMapping("/myList")
    public ResponseData searchFundMyList(FundPrdtInfoPageVO params) throws Exception {

        PagingVO<FundPrdtInfoVO> fundList = fundService.searchFundMyList(params);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(fundList)
                .build();
    }

    @ApiOperation(value = "펀드제안 제안펀드 등록 - step1/계속작성")
    @GetMapping("/info/save/{id}")
    public ResponseData continueSaveFundStep1(@PathVariable("id") String id) throws Exception {

    	FundPrdtInfoVO fundPrdtInfoVo = fundService.searchFundPrdtInfo(id);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(fundPrdtInfoVo)
                .build();
    }
    
    @ApiOperation(value = "펀드제안 제안펀드 등록 - step2/계속작성")
    @GetMapping("/opcm/save/{id}")
    public ResponseData continueSaveFundStep2(@PathVariable("id") String id) throws Exception {

    	FundOpcmInfoVO fundOpcmInfoVO = fundService.searchFundOpcmInfo(id);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(fundOpcmInfoVO)
                .build();
    }
    
    @ApiOperation(value = "펀드제안 제안펀드 등록 - step2 상세보기")
    @GetMapping("/opcm/detail/{id}")
    public ResponseData detailFundStep2(@PathVariable("id") String id) throws Exception {

    	HashMap<String, Object> searchDetailObj = fundService.detailFundOpcmInfo(id);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(searchDetailObj)
                .build();
    }
    
    @ApiOperation(value = "펀드제안 제안펀드 답변보기- step3")
    @GetMapping("/message/view/{id}")
    public ResponseData replyconFundStep3(@PathVariable("id") String id) throws Exception {
    	
    	FundPrdtInfoVO fundPrdtInfoVO = fundService.searchFundReplycon(id);
    	
    	return ResponseData.builder()
    			.code(HttpStatus.OK.value())
    			.message(HttpStatus.OK.getReasonPhrase())
    			.data(fundPrdtInfoVO)
    			.build();
    }
    
    @ApiOperation(value = "주요 주주 구성 양식 다운로드")
    @PostMapping("/excel/download")
    public ResponseData stockListExcelDownload(FundPrdtInfoPageVO searchParams, HttpServletResponse response) throws Exception {
    	fundService.stockListExcelDownload(searchParams, response);
    	
    	return null;
    }
    
    @ApiOperation(value = "펀드제안 불러오기 조회")
    @GetMapping("/load/list")
    public ResponseData loadFundList(String utlinsttId) throws Exception {

    	List<FundPrdtInfoVO> fundList = fundService.loadFundList(utlinsttId);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(fundList)
                .build();
    }
    
	/** ================================ Post Method Mapping ================================ **/
    

    @ApiOperation(value = "펀드제안 제안펀드 제안 취소")
    @PostMapping("/cancle/{id}")
    public ResponseData cancleFundPrdtInfo(@RequestBody FundOpcmInfoVO vo) throws Exception {
    	fundService.fundPrdtInfoCancle(vo);
    	
    	return ResponseData.builder()
    			.code(HttpStatus.OK.value())
    			.message(HttpStatus.OK.getReasonPhrase())
    			.build();
    }
	
    @ApiOperation(value = "펀드제안 복사본 만들기")
    @PostMapping("/copy")
    public ResponseData copyFundPrdtInfo(@RequestBody FundPrdtInfoVO vo) throws Exception {
    	String res = fundService.fundPrdtInfoCopy(vo);
    	
    	return ResponseData.builder()
    			.code(HttpStatus.OK.value())
    			.message(HttpStatus.OK.getReasonPhrase())
    			.data(res)
    			.build();
    }

    @ApiOperation(value = "펀드제안 제안펀드 등록 - step1")
    @PostMapping("/info/save")
    public ResponseData insertFundPrdtInfoStep1(@RequestBody FundPrdtInfoVO fundPrdtInfoVo) throws Exception {
    	String res = fundService.insertFundPrdtInfoStep1(fundPrdtInfoVo);
    	
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(res)
                .build();
    }
    
    @ApiOperation(value = "펀드제안 제안펀드 등록 - step2")
    @PostMapping("/opcm/save")
    public ResponseData insertFundPrdtInfoStep2(@RequestBody FundOpcmInfoVO fundOpcmInfoVO) throws Exception {
    	HashMap<String , Object> result = fundService.insertFundPrdtInfoStep2(fundOpcmInfoVO);
    	
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }
    
    @ApiOperation(value = "재무재표 스크래핑")
    @PostMapping("/B1003")
    public ResponseData searchInfotechHometaxFinance(@RequestBody HashMap<String, String> map) throws Exception {

    	List<InfotechScrapFinanceSummaryVO> resultInfotech = fundService.searchInfotechHometaxFinance(map);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(resultInfotech)
                .build();
    }
    
    @ApiOperation(value = "주주 구성 엑셀 파일 업로드 후 데이터 화면 출력")
    @PostMapping(path = {"/excel/upload"}, consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseData uploadExcelFile(@RequestPart(value = "file") MultipartFile file) throws Exception {
    	
    	List<Map<String, String>> resultExcel = fundService.readXLSXFile(file);
        
    	return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(resultExcel)
                .build();
    }

    @ApiOperation(value = "VC추천딜 펀드제안 등록 정보전송")
    @PostMapping("/rgsnFundPrpl")
    public ResponseData rgsnFundPrplInfo(@RequestBody FundOpcmInfoVO fundOpcmInfoVO) throws Exception {

        fundService.vcRcmdReq(fundOpcmInfoVO.getFundId(), "rgsn");

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    @ApiOperation(value = "VC추천딜 펀드제안 취소 정보전송")
    @PostMapping("/cnclFundPrpl")
    public ResponseData cnclFundPrplInfo(@RequestBody FundOpcmInfoVO fundOpcmInfoVO) throws Exception {

        fundService.vcRcmdReq(fundOpcmInfoVO.getFundId(), "cncl");

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

}
