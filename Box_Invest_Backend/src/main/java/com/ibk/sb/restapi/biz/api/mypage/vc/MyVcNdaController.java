package com.ibk.sb.restapi.biz.api.mypage.vc;

import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.vo.BadgePagingVO;
import com.ibk.sb.restapi.app.common.vo.PostSimpleBodyVO;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.biz.service.audit.InvestAuditService;
import com.ibk.sb.restapi.biz.service.audit.vo.TargetCompanyVO;
import com.ibk.sb.restapi.biz.service.nda.NdaService;
import com.ibk.sb.restapi.biz.service.nda.vo.FormInttVO;
import com.ibk.sb.restapi.biz.service.nda.vo.NdaVO;
import com.ibk.sb.restapi.biz.service.nda.vo.RequestSearchNdaVO;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@Api(tags = {"투자사 마이페이지 NDA 서비스 API"})
@RequestMapping(path = {"/api/my/vc/nda", "/api/iv/v1/my/vc/nda"}, produces = {MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class MyVcNdaController {

    private final NdaService ndaService;

    private final InvestAuditService auditService;

    /** ================================ Get Method Mapping ================================ **/

    /**
     * NDA 체결 대상 리스트 조회
     * -> 심사중, 심사완료 투자심사 대상 이용기관
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "NDA 체결 대상 리스트 조회")
    @GetMapping("/target/list")
    public ResponseData searchAuditNdaTargetCompanyList() throws Exception {

        List<TargetCompanyVO> targetList = auditService.searchAuditNdaTargetCompanyList();

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .data(targetList)
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    /**
     * Category: 마이페이지(투자사)
     * Page: NDA
     * 받은 NDA 목록 조회
     * @return
     */
    @ApiOperation(value = "받은 NDA 목록 조회")
    @GetMapping("/receive/list")
    public ResponseData searchReceiveNDAList(RequestSearchNdaVO requestSearchNdaVO) throws Exception {

        BadgePagingVO<NdaVO> result = ndaService.searchNdaList(requestSearchNdaVO, IvtCode.TransmitTypeEnum.RECEIVE);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    /**
     * Category: 마이페이지(투자사)
     * Page: NDA
     * 보낸 NDA 리스트 조회
     * @return
     */
    @ApiOperation(value = "보낸 NDA 리스트 조회")
    @GetMapping("/send/list")
    public ResponseData searchSendNDAList(RequestSearchNdaVO requestSearchNdaVO) throws Exception {

        BadgePagingVO<NdaVO> result = ndaService.searchNdaList(requestSearchNdaVO, IvtCode.TransmitTypeEnum.SEND);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    /**
     * Category: 마이페이지(투자사)
     * Page: NDA
     * NDA 체결 등록 이용기관 기본 설정 정보 조회
     * @return
     * @throws Exception
     */
    @ApiOperation(value = "NDA 체결 등록 이용기관 기본 설정 정보 조회")
    @GetMapping("/regist/form/intt")
    public ResponseData searchExsitNdaFormData() throws Exception {
        FormInttVO result = ndaService.searchExsitNdaFormData();

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    /**
     * Category: 마이페이지(투자사)
     * Page: NDA
     * NDA 체결문서 조회
     * @return
     */
    @ApiOperation(value = "NDA 체결문서 조회")
    @GetMapping("/contract/detail/{id}")
    public ResponseData searchNDAContractDocument(@PathVariable("id") String id) throws Exception {

        NdaVO result = ndaService.searchNda(id);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }


    /** ================================ Post Method Mapping ================================ **/

    /**
     * Category: 마이페이지(투자사)
     * Page: NDA
     * NDA 제출 (서명 요청)
     * @return
     */
    @ApiOperation(value = "NDA 제출 (서명 요청)")
    @PostMapping("/submit")
    public ResponseData submitNDA(@RequestBody NdaVO ndaVO) throws Exception {

        ndaService.requestNdaSign(ndaVO);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    /**
     * Category: 마이페이지(투자사)
     * Page: NDA 체결문서 최종 서명
     * @return
     */
    @ApiOperation(value = "NDA 체결문서 최종 서명")
    @PostMapping("/contract/sign")
    public ResponseData signNDAContract(@RequestBody NdaVO ndaVO) throws Exception {

        ndaService.acceptNdaSign(ndaVO);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }

    /**
     * Category: 마이페이지(투자사)
     * Page: NDA 체결문서 반려
     * @return
     */
    @ApiOperation(value = "NDA 체결문서 반려")
    @PostMapping("/contract/cancel")
    public ResponseData cancelNDAContract(@RequestBody PostSimpleBodyVO.SimpleIdBody postSimpleBodyVO) throws Exception {

        ndaService.cancelNdaSign(postSimpleBodyVO.getId());
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .build();
    }
}
