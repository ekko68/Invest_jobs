package com.ibk.sb.restapi.biz.api.admin;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

import com.ibk.sb.restapi.biz.service.common.vo.ComCodeVO;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.biz.service.admin.AdminVncmLoanService;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminAgisVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminVncmLoanAplcVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminVncmLoanVO;
import com.ibk.sb.restapi.biz.service.admin.vo.BprRequestVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestBodyAdminVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestVncmLoanVO;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.ReceiveEmailVO;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.ReceiveSmsVO;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.RequestEmailVO;
import com.ibk.sb.restapi.biz.service.platform.vo.alarm.RequestSmsVO;
import com.ibk.sb.restapi.biz.service.platform.vo.response.BoxListResponseVO;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Api(tags = {"운영자 포탈 - 벤처대출 API"})
@RestController
@Slf4j
@RequestMapping(path = {"/api/admin/vncmloan", "/api/iv/v1/admin/vncmloan"}, produces={MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class AdminVncmLoanController {

    private final AdminVncmLoanService service;
    
    @ApiOperation(value = "운영자 포탈 - 벤처대출 추천 목록 조회")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(name = "searchComNm", value = "회사명", dataType = "String"),
            @ApiImplicitParam(name = "searchRcmdEnrpBzn", value = "사업자번호", dataType = "String"),
            @ApiImplicitParam(name = "page", value = "current page number", dataType = "Integer"),
            @ApiImplicitParam(name = "record", value = "size per page", dataType = "Integer"),
            @ApiImplicitParam(name = "pageSize", value = "size of pagination", dataType = "Integer")
    })
    @GetMapping("/rcmd/list")
    public ResponseData list(RequestVncmLoanVO searchParams) throws Exception {
        PagingVO<AdminVncmLoanVO> list = service.searchVncmLoanList(searchParams);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(list)
                .build();
    }
    
    @ApiOperation(value = "운영자 포탈 - 벤처대출 추천 상세 조회")
    @ApiImplicitParams(value = {
    		@ApiImplicitParam(name = "vnentrlonId", value = "식별번호", dataType = "String"),
    		@ApiImplicitParam(name = "rcmdEnprBzn", value = "제안 기업 사업자 번호", dataType = "String")
    })
    @GetMapping("/rcmd/detail")
    public ResponseData detail(@RequestParam("vnentrlonId") String vnentrlonId, @RequestParam("rcmdEnprBzn") String rcmdEnprBzn) throws Exception {
    	AdminVncmLoanVO result = service.searchVncmLoan(vnentrlonId, rcmdEnprBzn);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    @ApiOperation(value = "운영자 포탈 - 벤처대출 추천 코드 조회")
    @GetMapping("/rcmd/code")
    public ResponseData detail() throws Exception {
        List<ComCodeVO> result = service.searchVncmLoanCodes();
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }
    @ApiOperation(value = "운영자포탈 - 벤처대출 추천 상세 저장")
    @PostMapping("/rcmd/save")
    public ResponseData save(@RequestBody RequestBodyAdminVO<AdminVncmLoanVO> requestBodyAdminVO) throws Exception {
        boolean result = service.saveVncmLoan(requestBodyAdminVO);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    @ApiOperation(value = "운영자포탈 - bpr전송")
    @PostMapping("/bprsave")
    public ResponseData bprSave(@ModelAttribute RequestBodyAdminVO<BprRequestVO> bprRequestVO) throws Exception {
        boolean resopnce = service.saveBpr(bprRequestVO.getParams());
        return ResponseData.builder()
                .code(resopnce?HttpStatus.OK.value():HttpStatus.BAD_REQUEST.value())
                .message(resopnce?HttpStatus.OK.getReasonPhrase():HttpStatus.BAD_REQUEST.getReasonPhrase())
                .build();
    }

    @ApiOperation(value = "운영자 포탈 - 벤처대출 신청 목록 조회")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(name = "searchComNm", value = "회사명", dataType = "String"),
            @ApiImplicitParam(name = "searchRcmdEnrpBzn", value = "사업자번호", dataType = "String"),
            @ApiImplicitParam(name = "searchRecomendSttus", value = "진행상태코드", dataType = "String"),
            @ApiImplicitParam(name = "searchUtlinsttId", value = "이용기관ID", dataType = "String"),
            @ApiImplicitParam(name = "page", value = "current page number", dataType = "Integer"),
            @ApiImplicitParam(name = "record", value = "size per page", dataType = "Integer"),
            @ApiImplicitParam(name = "pageSize", value = "size of pagination", dataType = "Integer")
    })
    @GetMapping("/aplc/list")
    public ResponseData list02(RequestVncmLoanVO searchParams) throws Exception {
        PagingVO<AdminVncmLoanAplcVO> list = service.searchVncmLoanAplcList(searchParams);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(list)
                .build();
    }

    @ApiOperation(value = "운영자 포탈 - 벤처대출 신청 상세 조회")
    @ApiImplicitParams(value = {
    		@ApiImplicitParam(name = "vnentrlonId", value = "식별번호", dataType = "String"),
    		@ApiImplicitParam(name = "bzn", value = "사업자번호", dataType = "String")
    })
    @GetMapping("/aplc/detail")
    public ResponseData detail02(@RequestParam("vnentrlonId") String vnentrlonId, @RequestParam("bzn") String bzn) throws Exception {
    	AdminVncmLoanAplcVO result = service.searchVncmLoanAplc(vnentrlonId, bzn);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    @ApiOperation(value = "운영자 포탈 - 벤처대출 신청 상태 저장")
    @PostMapping(path = {"/aplc/save"})
    public ResponseData save02(@RequestBody RequestBodyAdminVO<AdminVncmLoanAplcVO> requestBodyAdminVO) throws Exception {

    	service.saveVncmLoanAplc(requestBodyAdminVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    @ApiOperation(value = "운영자 포탈 - 협약 벤처투자기관 관리 조회")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(name = "searchComNm", value = "회사명", dataType = "String"),
            @ApiImplicitParam(name = "searchRcmdEnrpBzn", value = "사업자번호", dataType = "String"),
            @ApiImplicitParam(name = "page", value = "current page number", dataType = "Integer"),
            @ApiImplicitParam(name = "record", value = "size per page", dataType = "Integer"),
            @ApiImplicitParam(name = "pageSize", value = "size of pagination", dataType = "Integer")
    })
    @GetMapping("/agis/list")
    public ResponseData agisList(RequestVncmLoanVO searchParams) throws Exception {
        PagingVO<AdminAgisVO> list = service.searchAgisList(searchParams);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(list)
                .build();
    }

    @ApiOperation(value = "운영자 포탈 - 협약 벤처투자기관 관리 상세")
    @ApiImplicitParam(name = "agremVnentrSeq", value = "시퀀스번호", dataType = "Integer")
    @GetMapping("/agis/detail")
    public ResponseData agisDetail(@RequestParam("agremVnentrSeq") int agremVnentrSeq) throws Exception {
    	AdminAgisVO result = service.searchAgisDetail(agremVnentrSeq);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    @ApiOperation(value = "운영자 포탈 - 협약 벤처투자기관 관리 저장")
    @PostMapping(
    		path = {"/agis/save"}
    		, consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public ResponseData agisSave(
    		@RequestPart(value = "file", required = false) List<MultipartFile> file,
            @RequestPart(value = "json") AdminAgisVO adminAgisVO) throws Exception {
        boolean result = service.saveAgis(file, adminAgisVO);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }
    
    @ApiOperation(value = "운영자 포탈 - 이메일 보내기")
    @PostMapping("/rcmd/sendEmail")
    public ResponseData sendEmail(@RequestBody RequestBodyAdminVO<RequestEmailVO> requestBodyAdminVO) throws Exception {
    	BoxListResponseVO<ReceiveEmailVO> result = service.emlSndgInq(requestBodyAdminVO);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }
    
    @ApiOperation(value = "운영자 포탈 - SMS 보내기")
    @PostMapping("/rcmd/sendSms")
    public ResponseData sendSms(@RequestBody RequestBodyAdminVO<RequestSmsVO> requestBodyAdminVO) throws Exception {
    	BoxListResponseVO<ReceiveSmsVO> result = service.sndgSms(requestBodyAdminVO);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }
    
    @ApiOperation(value = "운영자 포탈 - 협약 벤처투자기관 관리 엑셀 다운로드")
    @PostMapping("/agis/excel")
    public ResponseData agisListExcelDownload(@RequestBody RequestVncmLoanVO searchParams, HttpServletResponse response) throws Exception {
    	service.excelDownload(searchParams, response);
    	
        return null;
    }
    
    @ApiOperation(value = "운영자 포탈 - 벤처대출 추천접수(VC) 엑셀 다운로드")
    @PostMapping("/rcmd/excel/vc")
    public ResponseData rcmdListExcelDownload(@RequestBody RequestVncmLoanVO searchParams, HttpServletResponse response) throws Exception {
    	service.excelDownloadVC(searchParams, response);
    	
        return null;
    }
    
    @ApiOperation(value = "운영자 포탈 - 벤처대출 추천접수(기업) 엑셀 다운로드")
    @PostMapping("/rcmd/excel/rc")
    public ResponseData rcmdCmListExcelDownload(@RequestBody RequestVncmLoanVO searchParams, HttpServletResponse response) throws Exception {
    	service.excelDownloadRC(searchParams, response);
    	
        return null;
    }
}
