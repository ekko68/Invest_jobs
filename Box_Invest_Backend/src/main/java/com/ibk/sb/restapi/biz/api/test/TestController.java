package com.ibk.sb.restapi.biz.api.test;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.json.JsonReadFeature;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.util.FileUtil;
import com.ibk.sb.restapi.app.common.vo.PostSimpleBodyVO;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.biz.service.batch.BatchService;
import com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.nw.NwIvtBackupVO;
import com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.ts.TsIvtBackupVO;
import com.ibk.sb.restapi.biz.service.kipris.KiprisService;
import com.ibk.sb.restapi.biz.service.kipris.vo.RequestSearchKiprisVO;
import com.ibk.sb.restapi.biz.service.platform.PlatformAccountService;
import com.ibk.sb.restapi.biz.service.platform.PlatformAdditionalAuditService;
import com.ibk.sb.restapi.biz.service.platform.PlatformDocumentService;
import com.ibk.sb.restapi.biz.service.platform.PlatformFileService;
import com.ibk.sb.restapi.biz.service.platform.vo.account.MainCompanyVO;
import com.ibk.sb.restapi.biz.service.platform.vo.account.MainUserVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.cmmscp.InfotechContentVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.cmmscp.RequestCmmScpVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.infotechcertkey.RequestInfotechCertVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.nicescrap.NiceSimpleDocGroupVO;
import com.ibk.sb.restapi.biz.service.platform.vo.document.nicescrap.RequestSearchIvtNiceDocVO;
import com.ibk.sb.restapi.biz.service.test.TestService;
import com.ibk.sb.restapi.biz.service.test.vo.RequestTestPagingVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Slf4j
@RestController
@RequestMapping(path = {"/api/test", "/api/iv/v1/test"}, produces = {MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class TestController {

    private final TestService testService;

    @Value("${spring.profiles.active:}")
    private String activeProfile;

    @GetMapping("/version")
    public ResponseData getVersion() throws Exception {
    	
    	String version = "2022-10-05 11:00 배포";
    	
    	 return ResponseData.builder()
                 .code(HttpStatus.OK.value())
                 .message(HttpStatus.OK.getReasonPhrase())
                 .data(version)
                 .build();
    }

    /**
     * DB 접속 테스트
     * @return
     */
    @GetMapping("/connect/dual")
    public ResponseData testConnectDual() throws Exception {
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(testService.testConnectDual())
                .build();
    }


    @PostMapping("/json/encoding")
    public ResponseData testJsonEncoding(@RequestPart("file") MultipartFile file, HttpServletResponse response) throws Exception {
//        byte[] base64Enc = Base64.getEncoder().encode(file.getBytes());

        byte[] base64Enc = Base64.getUrlEncoder().withoutPadding().encode(file.getBytes());

        String result = new String(base64Enc, StandardCharsets.UTF_8);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
//        byte[] binary = Base64.getDecoder().decode(result);

//        NwIvtBackupVO backupData = new ObjectMapper()
//                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
//                .readValue(binary, NwIvtBackupVO.class);
//
//        log.info("check data : {}", backupData.getExntRqstMList().get(0).getInvmExntRqstId());
    }

    @PostMapping("/json/encoding/dec")
    public ResponseData testJsonEncodingDec(@RequestPart("file") MultipartFile file, HttpServletResponse response) throws Exception {
        byte[] base64Enc = Base64.getEncoder().encode(file.getBytes());

        String result = new String(base64Enc, StandardCharsets.UTF_8);

        byte[] binary = Base64.getDecoder().decode(result);

//        TsIvtBackupVO backupData = new ObjectMapper()
//                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
//                .configure(JsonParser.Feature.ALLOW_UNQUOTED_CONTROL_CHARS, true)
//                .readValue(binary, TsIvtBackupVO.class);

        TsIvtBackupVO backupVO = JsonMapper.builder()
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
                .enable(JsonReadFeature.ALLOW_UNESCAPED_CONTROL_CHARS)
                .build().readValue(binary, TsIvtBackupVO.class);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(backupVO)
                .build();
//        byte[] binary = Base64.getDecoder().decode(result);

//        NwIvtBackupVO backupData = new ObjectMapper()
//                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
//                .readValue(binary, NwIvtBackupVO.class);
//
//        log.info("check data : {}", backupData.getExntRqstMList().get(0).getInvmExntRqstId());
    }

    @PostMapping("/json/decoding")
    public ResponseData testJsonDecoding(@RequestPart("file") MultipartFile file) throws Exception {
        String content = new String(file.getBytes(), StandardCharsets.UTF_8);
        log.info(content);

        byte[] binary = Base64.getDecoder().decode(content);

        TsIvtBackupVO backupVO = JsonMapper.builder()
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
                .enable(JsonReadFeature.ALLOW_UNESCAPED_CONTROL_CHARS)
                .build().readValue(binary, TsIvtBackupVO.class);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(backupVO)
                .build();
    }

    @PostMapping("/json/decoding/str")
    public ResponseData testJsonDecodingStr(@RequestBody PostSimpleBodyVO.SimpleSearchContent content) throws Exception {

        byte[] binary = Base64.getUrlDecoder().decode(content.getSearchContent());

        NwIvtBackupVO backupVO = JsonMapper.builder()
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
                .enable(JsonReadFeature.ALLOW_UNESCAPED_CONTROL_CHARS)
                .build().readValue(binary, NwIvtBackupVO.class);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(backupVO)
                .build();
    }
}
