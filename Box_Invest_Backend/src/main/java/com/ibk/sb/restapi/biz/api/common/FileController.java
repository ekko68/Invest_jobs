package com.ibk.sb.restapi.biz.api.common;

import com.ibk.sb.restapi.app.annotation.SkipCheckAspect;
import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.biz.service.common.CommonFileService;
import com.ibk.sb.restapi.biz.service.common.vo.ComFileInfoVO;
import com.ibk.sb.restapi.biz.service.platform.PlatformFileService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.util.Map;

@Api(tags = {"투자박스 공통 파일 관리 API"})
@RestController
@RequestMapping(value = {"/api/file","/api/iv/v1/file"})
@Slf4j
@RequiredArgsConstructor
public class FileController {

    private final CommonFileService fileService;
    private final PlatformFileService platformFileService;

    @ApiOperation(value = "파일 업로드")
    @PostMapping(
            path = {"/upload"}
            , consumes = {MediaType.MULTIPART_FORM_DATA_VALUE}
    )
    public ResponseData uploadFile(@RequestPart(value = "file") MultipartFile file) throws Exception {

        ComFileInfoVO fileInfoVO = fileService.uploadFile(file, IvtCode.YnTypeEnum.N);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(fileInfoVO)
                .build();
    }

    @ApiOperation(value="커머스박스 파일 업로드 전송")
    @PostMapping(path = {"/upload/commerce"}, consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseData uploadCommerceSealImage (@RequestPart(value="file") MultipartFile file) throws Exception {

        Map<String, String> result = platformFileService.uploadToCommerceFile(file);

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    @ApiOperation(value = "파일 다운로드")
    @GetMapping("/download/{id}")
    public ResponseData downloadFile(@PathVariable("id") String id, HttpServletResponse response) throws Exception {

        fileService.downloadFile(id, response, IvtCode.YnTypeEnum.N);

        // 파일 다운로드가 정상 진행되는 경우 response 객체를 사용하기 때문에 ResponseData return이 없음
        return null;
    }

    @ApiOperation(value = "이미지 파일 랜더링")
    @SkipCheckAspect
    @GetMapping("/render/image/{fileId}")
    public void downloadImageFile(@PathVariable("fileId") String fileId, HttpServletResponse response) {
        try {
            fileService.downloadImageFile(fileId, response);
        } catch(BizException bx) {
            log.error("Fail Trace", bx);
        } catch(Exception ex) {
            log.error("Fail Trace", ex);
        }
    }

    @ApiOperation(value = "NDA 체결 PDF 다운로드")
    @GetMapping("/download/nda/pdf/{id}")
    public ResponseData downloadNdaPdfFile(@PathVariable("id") String id, HttpServletResponse response) throws Exception {
        fileService.downloadFile(id, response, IvtCode.YnTypeEnum.Y);
        return null;
    }

//    @GetMapping("/download/base64/{fileId}")
//    public ResponseData downloadImageFileBase64(@PathVariable("fileId") String fileId) throws Exception {
//
//        String base64 = fileService.getImageBase64(fileId, false);
//
//        return ResponseData.builder()
//                .code(HttpStatus.OK.value())
//                .message(HttpStatus.OK.getReasonPhrase())
//                .data(base64)
//                .build();
//    }
}