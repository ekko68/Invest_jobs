package com.ibk.sb.restapi.biz.api.common;

import com.ibk.sb.restapi.app.common.util.SecureEncUtil;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.biz.service.common.SecureEncodeService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Api(tags = {"투자박스 암호화 API"})
@RestController
@Slf4j
@RequestMapping(path = {"/api/secure", "/api/iv/v1/secure"}, produces={MediaType.APPLICATION_JSON_VALUE})
@RequiredArgsConstructor
public class SecureEncodeController {

    private final SecureEncodeService secureEncodeService;

    /**
     * 투자박스 공개키 발급
     * @return
     * @throws Exception
     */
    @PostMapping("/public/key")
    @ApiOperation(value = "투자박스 공개키 발급")
    public ResponseData createLoginPublicKey() throws Exception {
        SecureEncUtil.RsaPublicSpecData result = secureEncodeService.searchServerRsaPublicKeyFileSpec();

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }
}
