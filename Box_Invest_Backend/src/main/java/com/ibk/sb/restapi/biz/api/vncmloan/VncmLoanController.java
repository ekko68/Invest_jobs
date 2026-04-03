package com.ibk.sb.restapi.biz.api.vncmloan;

import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.app.common.vo.PostSimpleBodyVO;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.biz.service.admin.vo.VncmLoanVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestVncmLoanVO;
import com.ibk.sb.restapi.biz.service.platform.PlatformDocumentService;
import com.ibk.sb.restapi.biz.service.platform.vo.document.infotechcertkey.InfotechClientKeyVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.infotechscrap.InfotechScrapBizLicenseSummaryVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.infotechscrap.InfotechScrapTxtnVatCerlsnVO;
import com.ibk.sb.restapi.biz.service.vncmloan.VncmLoanService;
import com.ibk.sb.restapi.biz.service.vncmloan.vo.VncmLoanAplcCountVO;
import com.ibk.sb.restapi.biz.service.vncmloan.vo.VncmLoanAplcVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;

import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@Api(tags = {"IBK 제안센터 탭 API"})
@RestController
@Slf4j
@RequestMapping(path={"/api/vncmloan", "/api/iv/v1/vncmloan"}, produces = {MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class VncmLoanController {

    private final VncmLoanService vncmloanService;
    private final PlatformDocumentService platformDocumentService;

    @ApiOperation(value = "벤처대출 추천내역 조회")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(name = "page", value = "current page number", dataType = "Integer"),
            @ApiImplicitParam(name = "record", value = "size per page", dataType = "Integer"),
            @ApiImplicitParam(name = "pageSize", value = "size of pagination", dataType = "Integer")
    })
    @GetMapping("/prpl/list")
    public ResponseData list(RequestVncmLoanVO searchParams) throws Exception {
        PagingVO<VncmLoanVO> list = vncmloanService.searchVncmLoanList(searchParams);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(list)
                .build();
    }

    @ApiOperation(value = "나의 벤처대출 추천내역 조회")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(name = "page", value = "current page number", dataType = "Integer"),
            @ApiImplicitParam(name = "record", value = "size per page", dataType = "Integer"),
            @ApiImplicitParam(name = "pageSize", value = "size of pagination", dataType = "Integer")
    })
    @GetMapping("/prpl/myList")
    public ResponseData myList(RequestVncmLoanVO searchParams) throws Exception {
        PagingVO<VncmLoanVO> list = vncmloanService.searchVncmLoanMyList(searchParams);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(list)
                .build();
    }

    @ApiOperation(value = "벤처대출신청 추천 상세조회")
    @GetMapping("/prpl/detail")
    public ResponseData getDetail(@RequestParam("vnentrlonId") String vnentrlonId) throws Exception {

        VncmLoanVO result = vncmloanService.getDetail(vnentrlonId);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    @ApiOperation(value = "마이페이지(기업) - 벤처대출 신청내역 조회")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(name = "page", value = "current page number", dataType = "Integer"),
            @ApiImplicitParam(name = "record", value = "size per page", dataType = "Integer"),
            @ApiImplicitParam(name = "pageSize", value = "size of pagination", dataType = "Integer")
    })
    @GetMapping("/aplc/list")
    public ResponseData list02(RequestVncmLoanVO searchParams) throws Exception {
        PagingVO<VncmLoanAplcVO> list = vncmloanService.searchVncmLoanAplcList(searchParams);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(list)
                .build();
    }
    @ApiOperation(value = "마이페이지(기업)- 벤처대출 추천 여부 및 자료요청 확인")
    @GetMapping("/aplc/count")
    public ResponseData count() throws Exception {
        VncmLoanAplcCountVO data = vncmloanService.getCountByRecommendStatus();

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(data)
                .build();
    }
    @ApiOperation(value = "마이페이지(기업) - 벤처대출 신청 상세 조회")
    @ApiImplicitParam(name = "vnentrlonId", value = "식별번호", dataType = "String")
    @GetMapping("/aplc/detail")
    public ResponseData detail02(@RequestParam("vnentrlonId") String vnentrlonId) throws Exception {
    	VncmLoanAplcVO result = vncmloanService.searchVncmLoanAplc(vnentrlonId);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    @ApiOperation(value = "벤처대출 추천서 제출")
    @PostMapping(path = {"/prpl/save"}, consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseData save(@ModelAttribute VncmLoanVO vncmLoanVO) throws Exception {

        vncmloanService.saveVncmLoanApply(vncmLoanVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    @ApiOperation(value = "마이페이지(기업) - 벤처대출 신청 등록")
    @PostMapping(
            path = {"/aplc/save"}
            , consumes = {MediaType.MULTIPART_FORM_DATA_VALUE}
    )
    public ResponseData save02(@ModelAttribute VncmLoanAplcVO vncmLoanAplcVO) throws Exception {

        vncmloanService.saveVncmLoanAplc(vncmLoanAplcVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    @ApiOperation(value = "마이페이지(기업)벤처대출 신청 취소")
    @PostMapping(
            path = {"/aplc/cancel"}
            , consumes = {MediaType.MULTIPART_FORM_DATA_VALUE}
    )
    public ResponseData cancel(@ModelAttribute VncmLoanAplcVO vncmLoanAplcVO) throws Exception {

        vncmloanService.saveVncmLoanAplcCancel(vncmLoanAplcVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }
    
    @ApiOperation(value = "필요서류 자동 제출(사업자등록)")
    @PostMapping(path = {"/aplc/B1001"})
    public ResponseData searchInfotechBznFile() throws Exception {
    	
    	HashMap<String, Object> map = vncmloanService.searchInfotechBznFile();

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(map)
                .build();
    }
    
    @ApiOperation(value = "필요서류 자동 제출(부가가치 과세표준증명)")
    @PostMapping(path = {"/aplc/B4009"})
    public ResponseData searchInfotechFile() throws Exception {
    	
    	HashMap<String, Object> map = vncmloanService.searchInfotechTaxVatFile();

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(map)
                .build();
    }
    
    @ApiOperation(value = "투자 유치 명세 조회")
    @ApiImplicitParams(value = {
    @ApiImplicitParam(name = "page", value = "current page number", dataType = "Integer"),
    @ApiImplicitParam(name = "record", value = "size per page", dataType = "Integer"),
    @ApiImplicitParam(name = "pageSize", value = "size of pagination", dataType = "Integer")
    })
    @GetMapping("/prpl/invest/list")
    public ResponseData vncmInvestList(RequestVncmLoanVO searchParams) throws Exception {
        PagingVO<VncmLoanVO> list = vncmloanService.getVncmInvestList(searchParams);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(list)
                .build();
    }
}
