package com.ibk.sb.restapi.biz.api.consult;

import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.biz.service.admin.vo.ConsultingVO;
import com.ibk.sb.restapi.biz.service.consult.ConsultService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Api(tags = {"투자박스 컨설팅 탭 API"})
@RestController
@Slf4j
@RequestMapping(path={"/api/consulting", "/api/iv/v1/consulting"}, produces = {MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class ConsultController {

    private final ConsultService consultService;

    /** ================================ Get Method Mapping ================================ **/


    /** ================================ Post Method Mapping ================================ **/

    @ApiOperation(value = "컨설팅 신청하기")
    @PostMapping("/save")
    public ResponseData saveConsultingApply(@RequestBody ConsultingVO consultingVO) throws Exception {

        consultService.saveConsultingApply(consultingVO);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }
}
