package com.ibk.sb.restapi.biz.api.admin;

import com.ibk.sb.restapi.app.common.vo.AdminUserVO;
import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.biz.service.admin.AdminDocumentService;
import com.ibk.sb.restapi.biz.service.admin.vo.DocumentVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestBodyAdminVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestListBodyAdminVO;
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

import java.util.List;

@Api(tags = {"운영자 포탈 - 문서 관리 API"})
@RestController
@Slf4j
@RequestMapping(path = {"/api/admin/document", "/api/iv/v1/admin/document"}, produces={MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class AdminDocumentController {

    private final AdminDocumentService service;

    @ApiOperation(value = "운영자 포탈 - 문서 관리 목록 조회")
    @ApiImplicitParams(value = {
            @ApiImplicitParam(name = "searchContent", value = "조회 조건 (내용)", dataType = "String"),
            @ApiImplicitParam(name = "searchUser", value = "조회 조건", dataType = "String"),
            @ApiImplicitParam(name = "page", value = "current page number", dataType = "Integer"),
            @ApiImplicitParam(name = "record", value = "size per page", dataType = "Integer"),
            @ApiImplicitParam(name = "pageSize", value = "size of pagination", dataType = "Integer")
    })
    @GetMapping("/list")
    public ResponseData list(RequestSearchVO searchParams) throws Exception {
        PagingVO<DocumentVO> list = service.searchDocumentList(searchParams);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(list)
                .build();
    }

    @ApiOperation(value = "운영자 포탈 - 문서 관리 상세 조회")
    @ApiImplicitParam(name = "dcmnId", value = "문서 관리 ID", dataType = "String")
    @GetMapping("/detail")
    public ResponseData detail(@RequestParam("dcmnId") String dcmnId) throws Exception {
        DocumentVO result = service.findDocumentDetail(dcmnId);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    @ApiOperation(value = "운영자 포탈 - 문서 관리 등록")
    @PostMapping("/save")
    public ResponseData save(@RequestBody RequestBodyAdminVO<DocumentVO> requestBodyAdminVO) throws Exception {
        boolean result = service.saveDocument(requestBodyAdminVO);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    @ApiOperation(value = "운영자 포탈 - 문서 관리 삭제")
    @PostMapping("/delete")
    public ResponseData delete(@RequestBody RequestListBodyAdminVO<String> requestListBodyAdminVO) throws Exception {
        boolean result = service.deleteDocument(requestListBodyAdminVO);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();

    }

}
