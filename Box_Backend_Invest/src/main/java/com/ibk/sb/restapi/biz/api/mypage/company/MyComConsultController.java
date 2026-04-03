package com.ibk.sb.restapi.biz.api.mypage.company;

import com.ibk.sb.restapi.app.common.vo.PagingVO;
import com.ibk.sb.restapi.app.common.vo.PostSimpleBodyVO;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.biz.service.admin.vo.ConsultingVO;
import com.ibk.sb.restapi.biz.service.consult.ConsultService;
import com.ibk.sb.restapi.biz.service.consult.vo.ConsultingSummaryVO;
import com.ibk.sb.restapi.biz.service.consult.vo.RequestSearchConsultingVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@Api(tags = {"기업 마이페이지 컨설팅 서비스 API"})
@RequestMapping(path = {"/api/my/company/consulting", "/api/iv/v1/my/company/consulting"}, produces = {MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class MyComConsultController {

    private final ConsultService consultService;

    /** ================================ Get Method Mapping ================================ **/

    /**
     * Category: 마이페이지(기업)
     * Page: 컨설팅
     * 컨설팅 리스트 목록 조회
     * @return
     */
    @ApiOperation(value = "컨설팅 리스트 목록 조회")
    @GetMapping("/list")
    public ResponseData searchCompanyConsultingList(RequestSearchConsultingVO requestSearchConsultingVO) throws Exception {

        PagingVO<ConsultingSummaryVO> consultingList = consultService.searchCompanyConsultingList(requestSearchConsultingVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(consultingList)
                .build();
    }

    /**
     * Category: 마이페이지(기업)
     * Page: 컨설팅
     * 컨설팅 상세 정보 조회
     * @return
     */
    @ApiOperation(value = "컨설팅 상세 정보 조회")
    @GetMapping("/detail/{id}")
    public ResponseData searchCompanyConsulting(@PathVariable("id") String id) throws Exception {

        ConsultingVO consultingVO = consultService.searchCompanyConsulting(id);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(consultingVO)
                .build();
    }

    /** ================================ Post Method Mapping ================================ **/

    /**
     * Category: 마이페이지(기업)
     * Page: 컨설팅
     * 컨설팅 의뢰정보 수정
     * @return
     */
    @ApiOperation(value = "컨설팅 의뢰정보 수정")
    @PostMapping("/save")
    public ResponseData saveCompanyConsulting(@RequestBody ConsultingVO consultingVO) throws Exception {

        consultService.updateConsulting(consultingVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    /**
     * Category: 마이페이지(기업)
     * Page: 컨설팅
     * 컨설팅 취소
     * @return
     */
    @ApiOperation(value = "컨설팅 취소")
    @PostMapping("/cancel")
    public ResponseData searchCompanyConsulting(@RequestBody PostSimpleBodyVO.SimpleIdBody postSimpleBodyVO) throws Exception {

        consultService.cancelConsulting(postSimpleBodyVO.getId());

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

}
