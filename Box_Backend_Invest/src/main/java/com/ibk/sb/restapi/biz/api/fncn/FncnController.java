package com.ibk.sb.restapi.biz.api.fncn;

import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.biz.service.common.vo.ComCodeVO;
import com.ibk.sb.restapi.biz.service.fncn.FncnService;
import com.ibk.sb.restapi.biz.service.fncn.vo.*;
import com.ibk.sb.restapi.biz.service.fund.vo.prdInfo.FundPrdtInfoPageVO;
import com.ibk.sb.restapi.biz.service.fund.vo.prdInfo.FundPrdtInfoVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Objects;

@Api(tags = {"출자사업 API"})
@RestController
@RequestMapping(path = {"/api/fncn", "/api/iv/v1/fncn"}, produces = {MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class FncnController {

    public final FncnService fncnService;

    /** ================================ Get Method Mapping ================================ **/
    @ApiOperation(value = "출자사업 공고 목록 조회")
    @GetMapping("/pban/list")
    public ResponseData searchFncnPbanList(FncnBsnsEnlsPageVO params) throws Exception {

        PagingVO<FncnBsnsPbanBasicVO> fncnBsnsList = fncnService.searchFncnPbanList(params);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(fncnBsnsList)
                .build();
    }

    @ApiOperation(value = "출자사업 공고 상세")
    @GetMapping("/pban/detail/{id}")
    public ResponseData detailFncnBsnsPban(@PathVariable("id") String id) throws Exception {

        FncnBsnsPbanBasicVO fncnBsnsPbanBasicVO = fncnService.detailFncnBsnsPban(id);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(fncnBsnsPbanBasicVO)
                .build();
    }

    @ApiOperation(value = "나의 출자사업 신청 목록 조회")
    @GetMapping("/rcip/my/list")
    public ResponseData searchFncnBsnsMyList(FncnBsnsEnlsPageVO params) throws Exception {

        PagingVO<FncnBsnsRcipVO> fncnBsnsMyList = fncnService.searchFncnBsnsMyList(params);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(fncnBsnsMyList)
                .build();
    }

    @ApiOperation(value = "출자사업 접수 상세")
    @GetMapping("/rcip/my/detail/{id}")
    public ResponseData detailMyFncnBsns(@PathVariable("id") String id) throws Exception {

        FncnBsnsRcipVO resultList = fncnService.detailMyFncnBsns(id);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(resultList)
                .build();
    }

    /**
     * 출자사업 공고 지원분야 항목 조회
     * @return
     */
    @ApiOperation(value = "출자사업 공고 지원분야 항목 조회")
    @GetMapping("/rcip/enls/list")
    public ResponseData fncnBsnsEnlsFildList(@RequestParam("fncnBsnsPbanCd") String id) throws Exception{

        List<FncnBsnsEnlsFildVO> enlsFildList = fncnService.searchEnlsFildList(id);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(enlsFildList)
                .build();
    }

    /** ================================ Post Method Mapping ================================ **/

    @ApiOperation(value = "출자사업 접수 등록")
    @PostMapping("/rcip/save")
    public ResponseData insertFncnBsnsRcip(@RequestBody FncnBsnsRcipVO fncnBsnsRcipVO) throws Exception {
        HashMap<String, Object> result = fncnService.insertFncnBsnsRcip(fncnBsnsRcipVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    @ApiOperation(value = "출자사업 접수 취소")
    @PostMapping("/rcip/cancel")
    public ResponseData cancelFncnBsnsRcip(@RequestBody FncnBsnsRcipVO fncnBsnsRcipVO) throws Exception {
        fncnService.fncnBsnsRcipCancel(fncnBsnsRcipVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    @ApiOperation(value = "출자사업 접수 정보전송")
    @PostMapping("/rcip/rgsnFncnBsnsRcip")
    public ResponseData rgsnFncnBsnsRcipInfo(@RequestBody FncnBsnsRcipVO fncnBsnsRcipVO) throws Exception {
        fncnService.fncnBsnsReq(fncnBsnsRcipVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }
}
