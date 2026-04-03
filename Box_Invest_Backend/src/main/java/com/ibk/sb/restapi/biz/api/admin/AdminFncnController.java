package com.ibk.sb.restapi.biz.api.admin;

import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.biz.service.admin.AdminFncnService;
import com.ibk.sb.restapi.biz.service.admin.vo.*;
import com.ibk.sb.restapi.biz.service.common.vo.ComCodeVO;
import com.ibk.sb.restapi.biz.service.fund.vo.prdInfo.FundPrdtInfoVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.List;

@Api(tags = {"출자사업 운영자포탈 API"})
@RestController
@RequestMapping(path = {"/api/admin/fncn", "/api/iv/v1/admin/fncn"}, produces = {MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class AdminFncnController {

    public final AdminFncnService adminFncnService;

    /** ================================ Get Method Mapping ================================ **/
    /**
     * (운영자) 출자사업 공고 목록 조회
     * @param adminFncnBsnsPageVO
     * @return
     */
    @ApiOperation(value = "(운영자) 출자사업 공고 목록 조회")
    @GetMapping("/pban/list")
    public ResponseData adminFncnBsnsPbanList(AdminFncnBsnsPageVO adminFncnBsnsPageVO) throws Exception{

        PagingVO<AdminFncnBsnsPbanBasicVO> fncnBsnsList = adminFncnService.searchAdminFncnBsnsPbanList(adminFncnBsnsPageVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(fncnBsnsList)
                .build();
    }

    /**
     * (운영자) 출자사업 공고 상세 조회
     * @param fncnId
     * @return
     */
    @ApiOperation(value = "(운영자) 출자사업 공고 상세 조회")
    @GetMapping("/pban/detail/{id}")
    public ResponseData adminFncnBsnsPbanDetail(@PathVariable("id") String fncnId) throws Exception{

        AdminFncnBsnsPbanBasicVO fncnList = adminFncnService.searchAdminFncnBsnsPbanDetail(fncnId);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(fncnList)
                .build();
    }

    /**
     * (운영자) 출자사업 접수 목록 조회
     * @param adminFncnBsnsPageVO
     * @return
     */
    @ApiOperation(value = "(운영자) 출자사업 접수 목록 조회")
    @GetMapping("/rcip/list")
    public ResponseData adminFncnBsnsRcipList(AdminFncnBsnsPageVO adminFncnBsnsPageVO) throws Exception{

        PagingVO<AdminFncnBsnsRcipVO> fncnBsnsRcipList = adminFncnService.searchAdminFncnBsnsRcipList(adminFncnBsnsPageVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(fncnBsnsRcipList)
                .build();
    }

    /**
     * (운영자) 출자사업 공고 상세 조회
     * @param fncnId
     * @return
     */
    @ApiOperation(value = "(운영자) 출자사업 접수 상세 조회")
    @GetMapping("/rcip/detail/{id}")
    public ResponseData adminFncnBsnsRcipDetail(@PathVariable("id") String fncnId) throws Exception{

        AdminFncnBsnsRcipVO fncnList = adminFncnService.searchAdminFncnBsnsRcipDetail(fncnId);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(fncnList)
                .build();
    }

    /**
     * (운영자) 출자사업 공고 지원분야 항목 조회
     * @return
     */
    @ApiOperation(value = "(운영자) 출자사업 공고 지원분야 항목 조회")
    @GetMapping("/pban/enls/list")
    public ResponseData adminFncnBsnsEnlsFildList() throws Exception{

        List<ComCodeVO> enlsFildList = adminFncnService.searchAdminFncnBsnsEnlsFildList();

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(enlsFildList)
                .build();
    }

    /** ================================ Post Method Mapping ================================ **/

    /**
     * (운영자) 출자사업 공고 등록 및 수정
     * @param adminFncnBsnsPbanBasicVO
     * @return
     */
    @ApiOperation(value = "출자사업 공고 등록 및 수정")
    @PostMapping("/pban/save")
    public ResponseData insertAdminFncnBsns(@RequestBody AdminFncnBsnsPbanBasicVO adminFncnBsnsPbanBasicVO) throws Exception {
        HashMap<String, Object> result = adminFncnService.insertAdminFncnBsnsPban(adminFncnBsnsPbanBasicVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }
    /**
     * (운영자) 출자사업 공고 엑셀 다운로드
     * @param adminFncnBsnsPageVO
     * @param response
     * @return
     */
    @ApiOperation(value = "운영자 포탈 - 출자사업 공고 엑셀 다운로드")
    @PostMapping("/pban/list/excel")
    public ResponseData pbanListExcelDownload(@RequestBody AdminFncnBsnsPageVO adminFncnBsnsPageVO, HttpServletResponse response) throws Exception {
        adminFncnService.excelDownloadFncnPban(adminFncnBsnsPageVO, response);

        return null;
    }

    /**
     * (운영자) 출자사업 접수 엑셀 다운로드
     * @param adminFncnBsnsPageVO
     * @param response
     * @return
     */
    @ApiOperation(value = "운영자 포탈 - 출자사업 접수 엑셀 다운로드")
    @PostMapping("/rcip/list/excel")
    public ResponseData rcipListExcelDownload(@RequestBody AdminFncnBsnsPageVO adminFncnBsnsPageVO, HttpServletResponse response) throws Exception {
        adminFncnService.excelDownloadFncnRcip(adminFncnBsnsPageVO, response);

        return null;
    }

    /**
     * (운영자) 출자사업 공고 상태 변경
     * @param adminFncnBsnsPbanBasicVO
     * @return
     */
    @ApiOperation(value = "(운영자) 출자사업 공고 상태 변경")
    @PostMapping("/pban/state/update")
    public ResponseData adminFncnBsnsPbanStateUpd(@RequestBody AdminFncnBsnsPbanBasicVO adminFncnBsnsPbanBasicVO) throws Exception{

        adminFncnService.updateAdminFncnBsnsPbanState(adminFncnBsnsPbanBasicVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    /**
     * (운영자) 출자사업 접수 상태 변경
     * @param adminFncnBsnsRcipVO
     * @return
     */
    @ApiOperation(value = "(운영자) 출자사업 접수 상태 변경")
    @PostMapping("/rcip/state/update")
    public ResponseData adminFncnBsnsRcipStateUpd(@RequestBody AdminFncnBsnsRcipVO adminFncnBsnsRcipVO) throws Exception{

        adminFncnService.updateAdminFncnBsnsRcipState(adminFncnBsnsRcipVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    /**
     * (운영자) 출자사업 모집분야 항목 등록 및 수정
     * @param comCodeVO
     * @return
     */
    @ApiOperation(value = "(운영자) 출자사업 모집분야 항목 등록 및 수정")
    @PostMapping("/pban/enls/save")
    public ResponseData adminFncnBsnsEnlsFildSave(@RequestBody List<ComCodeVO> comCodeVO) throws Exception{

        adminFncnService.saveAdminFncnBsnsEnlsFild(comCodeVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    /**
     * (운영자) 출자사업 모집분야 항목 삭제
     * @param comCodeVO
     * @return
     */
    @ApiOperation(value = "(운영자) 출자사업 모집분야 항목 삭제")
    @PostMapping("/pban/enls/delete")
    public ResponseData adminFncnBsnsEnlsFildDelete(@RequestBody ComCodeVO comCodeVO) throws Exception{

        adminFncnService.deleteAdminFncnBsnsEnlsFild(comCodeVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    /**
     * (운영자) 출자사업 공고 접수 정보 등록
     * @param adminFncnBsnsPbanBasicVO
     * @return
     */
    @ApiOperation(value = "(운영자) 출자사업 공고 접수 정보 등록")
    @PostMapping("/pban/rgsnFncnBsnsPban")
    public ResponseData rgsnFncnBsnsPbanInfo(@RequestBody AdminFncnBsnsPbanBasicVO adminFncnBsnsPbanBasicVO) throws Exception{

        adminFncnService.adminFncnBsnsPbanReq(adminFncnBsnsPbanBasicVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

}
