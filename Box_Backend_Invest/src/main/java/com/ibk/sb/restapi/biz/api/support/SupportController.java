package com.ibk.sb.restapi.biz.api.support;

import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.biz.service.admin.vo.NoticeVO;
import com.ibk.sb.restapi.biz.service.admin.vo.QnaVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestSearchVO;
import com.ibk.sb.restapi.biz.service.support.SupportService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@Api(tags = {"투자박스 고객지원 서비스 API"})
@RequestMapping(path = {"/api/support", "/api/iv/v1/support"}, produces={MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class SupportController {

    private final SupportService supportService;

    /**
     * Category : 고객지원
     * Page : 공지사항 목록
     * @param requestSearchVO
     * @return
     */
    @ApiOperation(value = "공지사항 목록")
    @GetMapping("/notice/list")
    public ResponseData searchNoticeList(RequestSearchVO requestSearchVO) throws Exception {

        PagingVO<NoticeVO> noticeList = supportService.searchNoticeList(requestSearchVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(noticeList)
                .build();
    }

    /**
     * Category : 고객지원
     * Page : 공지사항 상세
     * @param pbnsId
     * @return
     */
    @ApiOperation(value = "공지사항 상세")
    @GetMapping("/notice/detail/{id}")
    public ResponseData searchNotice(@PathVariable("id") String pbnsId) throws Exception {

        NoticeVO notice = supportService.searchNotice(pbnsId);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(notice)
                .build();
    }

    /**
     * Category : 고객지원
     * Page : Q&A 목록
     * @param requestSearchVO
     * @return
     */
    @ApiOperation(value = "Q&A 목록")
    @GetMapping("/qa/list")
    public ResponseData searchQnaList(RequestSearchVO requestSearchVO) throws Exception {

        PagingVO<QnaVO> qaList = supportService.searchQnaList(requestSearchVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(qaList)
                .build();
    }

    /**
     * Category : 고객지원
     * Page : Q&A 상세
     * @param id
     * @return
     */
    @ApiOperation(value = "Q&A 상세")
    @GetMapping("/qa/detail/{id}")
    public ResponseData searchQna(@PathVariable("id") String id) throws Exception {

        QnaVO qnaVO = supportService.searchQna(id);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(qnaVO)
                .build();
    }

    /**
     * Category : 고객지원
     * Page : Q&A 등록
     * @param qnaVO
     * @return
     */
    @ApiOperation(value = "Q&A 등록")
    @PostMapping("/qa/save")
    public ResponseData saveQna(@RequestBody QnaVO qnaVO) throws Exception {

        supportService.saveQna(qnaVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    /**
     * Category : 고객지원
     * Page : Q&A 취소
     * @param qnaVO
     * @return
     */
    @ApiOperation(value = "Q&A 취소")
    @PostMapping("/qa/cancel")
    public ResponseData cancelQna(@RequestBody QnaVO qnaVO) throws Exception {

        supportService.cancelQna(qnaVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

}
