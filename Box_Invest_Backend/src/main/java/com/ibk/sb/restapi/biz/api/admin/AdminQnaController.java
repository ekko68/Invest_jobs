package com.ibk.sb.restapi.biz.api.admin;

import com.ibk.sb.restapi.app.common.vo.AdminUserVO;
import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.biz.service.admin.AdminQnaService;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminQnaVO;
import com.ibk.sb.restapi.biz.service.admin.vo.QnaVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestBodyAdminVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestSearchVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@Api(tags = {"운영자 포탈 - Q&A API"})
@RestController
@Slf4j
@RequestMapping(path = {"/api/admin/qna", "/api/iv/v1/admin/qna"}, produces={MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class AdminQnaController {

    private final AdminQnaService service;

    @ApiOperation(value = "운영자 포탈 - Q&A 목록 조회")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(name = "searchContent", value = "조회 조건 (내용)", dataType = "String"),
            @ApiImplicitParam(name = "page", value = "current page number", dataType = "Integer"),
            @ApiImplicitParam(name = "record", value = "size per page", dataType = "Integer"),
            @ApiImplicitParam(name = "pageSize", value = "size of pagination", dataType = "Integer")
    })
    @GetMapping("/list")
    public ResponseData list(RequestSearchVO searchParams) throws Exception {
        PagingVO<QnaVO> list = service.searchQnaList(searchParams);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(list)
                .build();
    }

    @ApiOperation(value = "운영자 포탈 - Q&A 상세 조회")
    @ApiImplicitParam(name = "inqrSbjcId", value = "조회 요청 게시물 ID", required = true, dataType = "String")
    @GetMapping("/detail")
    public ResponseData detail(@RequestParam("inqrSbjcId") String inqrSbjcId) throws Exception {
        QnaVO result = service.searchQna(inqrSbjcId);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    @ApiOperation(value = "운영자 포탈 - Q&A 답변 등록")
    @PostMapping("/reply")
    public ResponseData reply(@RequestBody RequestBodyAdminVO<AdminQnaVO> requestBodyAdminVO) throws Exception {
        boolean result = service.replayQnaAnswer(requestBodyAdminVO);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

}
