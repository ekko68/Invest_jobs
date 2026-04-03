package com.ibk.sb.restapi.biz.api.mypage.vc;

import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.app.common.vo.PostSimpleBodyVO;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.biz.service.vc.VentureCapitalService;
import com.ibk.sb.restapi.biz.service.vc.vo.request.RequestSearchVcPageVO;
import com.ibk.sb.restapi.biz.service.vc.vo.pagelink.VcPageDetailVO;
import com.ibk.sb.restapi.biz.service.vc.vo.summary.VcPageSummaryVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@Api(tags = {"투자사 마이페이지 투자사 전용 페이지 서비스 API"})
@RequestMapping(path = {"/api/my/vc/weblink", "/api/iv/v1/my/vc/weblink"}, produces = {MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class MyVcWeblinkController {

    private final VentureCapitalService vcService;

    /** ================================ Get Method Mapping ================================ **/

    /**
     * Category: 마이페이지(투자사)
     * Page: 투자사 전용페이지
     * 투자사 전용 페이지 목록 조회
     * @return
     */
    @ApiOperation(value = "투자사 전용 페이지 목록 조회")
    @GetMapping("/list")
    public ResponseData searchVCWeblinkList(RequestSearchVcPageVO requestVO) throws Exception {
        PagingVO<VcPageSummaryVO> pageList = vcService.searchVCPageList(requestVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(pageList)
                .build();
    }

    /**
     * Category: 마이페이지(투자사)
     * Page: 투자사 전용페이지
     * 투자사 전용 페이지 수정화면 상세 조회
     * @return
     */

    @ApiOperation(value = "투자사 전용 페이지 수정화면 상세 조회")
    @GetMapping({"/detail/{id}", "/detail"})
    public ResponseData searchVCWeblink(@PathVariable(value = "id", required = false) String id) throws Exception {
        VcPageDetailVO pageDetail = vcService.searchVCPage(id);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(pageDetail)
                .build();
    }

    /** ================================ Post Method Mapping ================================ **/

    /**
     * Category: 마이페이지(투자사)
     * Page: 투자사 전용페이지
     * 투자사 전용페이지 등록/수정
     * @return
     */
    @ApiOperation(value = "투자사 전용페이지 등록/수정")
    @PostMapping("/save")
    public ResponseData saveVCWeblink(@RequestBody VcPageDetailVO pageDetailVO) throws Exception {
        String invmCmpExusPageId = vcService.saveVCPage(pageDetailVO);

        Map<String, String> result = new HashMap<>();
        result.put("invmCmpExusPageId", invmCmpExusPageId);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .data(result)
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }


    /**
     * Category: 마이페이지(투자사)
     * Page: 투자사 전용페이지
     * 투자사 전용페이지 삭제
     * @return
     */
    @ApiOperation(value = "투자사 전용페이지 삭제")
    @PostMapping("/delete")
    public ResponseData deleteVCWeblink(@RequestBody PostSimpleBodyVO.SimpleIdBody postSimpleBodyVO) throws Exception {
        vcService.deleteVCPage(postSimpleBodyVO.getId());

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }
}
