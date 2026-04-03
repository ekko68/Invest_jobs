package com.ibk.sb.restapi.biz.api.batch;

import com.fasterxml.jackson.core.json.JsonReadFeature;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.vo.ResponseData;
import com.ibk.sb.restapi.biz.service.batch.DataTransferService;
import com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.RequestTransferInvmVO;
import com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.ResultUpdateTableVO;
import com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.nw.NwIvtBackupVO;
import com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.ts.TsIvtBackupVO;
import com.ibk.sb.restapi.biz.service.batch.vo.transfer.result.ResultTransferVO;
import io.swagger.annotations.Api;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Api(tags = {"투자박스 데이터이관 서비스 API"})
@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping(path = {"/api/data/transfer", "/api/iv/v1/data/transfer"}, produces={"application/json"})
public class DataTransferController {

    private final DataTransferService dataTransferService;

    @Value("${spring.profiles.active:}")
    private String activeProfile;
    @Value("${ivt.open.date:}")
    private String ivtOpenDate;

    enum TransferTypeEnum {
        ALL, EXNT, USIS, SCRAPPING
    }

    /**
     * 투자박스 데이터 이관
     *
     * 기존 전체 프로세스 이행 기준 작업 시
     * 데이터량이 많아 범위를 설정하여 작업할 수 있도록 수정
     *
     * 투자심사정보, 기업정보는 TOBE 특성상 기존 이관 프로세스상 범위지정이 들어갈 경우 한번에 처리할 시 애매한 부분이 있으므로
     * 범위와 더불어 Type을 추가하여 처리함
     *
     * 일회성 API 서비스 이므로 기등록된 하나의 컨트롤러를 수정하여 활용
     *
     * Request Ex )
     *
     * 1. 기존대로 전체 프로세스 실행
     * -> settingTranferInvmId 필수, transferType = ALL
     *
     * 2. 투자심사정보만 이관
     * -> settingTranferInvmId 필수, transferType = EXNT, startRange-endRange는 필요에 따라
     *
     * 3. 기업정보, IR 정보 이관
     * -> transferType = USIS, startRange-endRange는 필요에 따라
     *
     * 4. 스크래핑 키 정보
     * -> transferType = SCRAPPING
     */
    @PostMapping
    public ResponseData beforeDataTransfer(@RequestBody RequestTransferInvmVO requestTransferInvmVO) throws Exception {

        // 운영 환경일 경우 profile에 설정한 오픈날짜를 기준으로 접근 제한을 설정한다.
        if(activeProfile.equals(IvtCode.ProfileNameEnum.PROD.getName())) {
            if(!StringUtils.hasLength(ivtOpenDate)
                    || LocalDate.now(ZoneId.of("Asia/Seoul")).isAfter(LocalDate.parse(ivtOpenDate, DateTimeFormatter.ofPattern("yyyyMMdd")))) {
                throw new BizException(StatusCode.COM0005);
            }
        }

        ResultTransferVO result;

        if(requestTransferInvmVO.getTransferType().equals(TransferTypeEnum.ALL.name())) {
            result = dataTransferService.beforeDataTransferAllProcess(requestTransferInvmVO.getSettingTranferInvmId());
        }
        else if (requestTransferInvmVO.getTransferType().equals(TransferTypeEnum.EXNT.name())) {
            result = dataTransferService.transferExntData(requestTransferInvmVO);
        }
        else if (requestTransferInvmVO.getTransferType().equals(TransferTypeEnum.USIS.name())) {
            result = dataTransferService.transferUsisData(requestTransferInvmVO);
        }
        else if (requestTransferInvmVO.getTransferType().equals(TransferTypeEnum.SCRAPPING.name())) {
            result = dataTransferService.transferNiceScrappingKey();
        }
        else {
            result = ResultTransferVO.builder().message("타입 정보를 잘못 입력했습니다.").build();
        }

        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    /**
     * AS-IS 투자박스 데이터 등록
     * @param requestMap
     * @return
     */
    @PostMapping("/asis/base/save")
    public ResponseData saveAsisBaseIvtBoxTableByJson(@RequestBody HashMap<String, String> requestMap) throws Exception {

        // 운영 환경일 경우 profile에 설정한 오픈날짜를 기준으로 접근 제한을 설정한다.
        if(activeProfile.equals(IvtCode.ProfileNameEnum.PROD.getName())) {
            if(!StringUtils.hasLength(ivtOpenDate)
                    || LocalDate.now(ZoneId.of("Asia/Seoul")).isAfter(LocalDate.parse(ivtOpenDate, DateTimeFormatter.ofPattern("yyyyMMdd")))) {
                throw new BizException(StatusCode.COM0005);
            }
        }

        // 정책 제한으로 인해 json file을 base64 string으로 한번 수정하여 받는다.
        String base64Str = requestMap.get("JsonBase64EncStr");
        if(!StringUtils.hasLength(base64Str)) throw new BizException(StatusCode.COM9998);

        // json enc binary mapping
        // 특수문자 삭제를 위해 Base64.getUrlEncoder로 인코딩함 -> 디코딩도 맞춰줄것
        byte[] binary = Base64.getUrlDecoder().decode(base64Str);

        TsIvtBackupVO transData = JsonMapper.builder()
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
                .enable(JsonReadFeature.ALLOW_UNESCAPED_CONTROL_CHARS)  // escape 컨트롤 처리
                .build().readValue(binary, TsIvtBackupVO.class);

        List<ResultUpdateTableVO> result = dataTransferService.saveBaseIvtBoxBaseTableByJsonFile(transData);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }

    /**
     * TO-BE 투자박스 백업 데이터 복구
     * todo : 데이터 이관 완료 후 주석처리
     * @param requestMap
     * @return
     */
    @PostMapping("/tobe/backup/recover")
    public ResponseData recoverTobeTableByBackupJson(@RequestBody HashMap<String, String> requestMap) throws Exception {

        // 운영 환경일 경우 profile에 설정한 오픈날짜를 기준으로 접근 제한을 설정한다.
        if(activeProfile.equals(IvtCode.ProfileNameEnum.PROD.getName())) {
            if(!StringUtils.hasLength(ivtOpenDate)
                    || LocalDate.now(ZoneId.of("Asia/Seoul")).isAfter(LocalDate.parse(ivtOpenDate, DateTimeFormatter.ofPattern("yyyyMMdd")))) {
                throw new BizException(StatusCode.COM0005);
            }
        }

        // 정책 제한으로 인해 json file을 base64 string으로 한번 수정하여 받는다.
        String base64Str = requestMap.get("JsonBase64EncStr");
        if(!StringUtils.hasLength(base64Str)) throw new BizException(StatusCode.COM9998);

        // json enc binary mapping
        // 특수문자 삭제를 위해 Base64.getUrlEncoder로 인코딩함 -> 디코딩도 맞춰줄것
        byte[] binary = Base64.getUrlDecoder().decode(base64Str);

        NwIvtBackupVO backupVO = JsonMapper.builder()
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
                .enable(JsonReadFeature.ALLOW_UNESCAPED_CONTROL_CHARS)  // escape 컨트롤 처리
                .build().readValue(binary, NwIvtBackupVO.class);

        // 파일 물리 삭제 여부 처리
        IvtCode.YnTypeEnum filePhysicalDelYn =
                StringUtils.hasLength(requestMap.get("filePhysicalDelYn")) && IvtCode.YnTypeEnum.Y.name().equals(requestMap.get("filePhysicalDelYn"))
                    ? IvtCode.YnTypeEnum.Y : IvtCode.YnTypeEnum.N;

        List<ResultUpdateTableVO> result = dataTransferService
                .recoverTargetIvtTableByBackupJsonFile(backupVO, filePhysicalDelYn);
        return ResponseData.builder()
                .code(HttpStatus.OK.value())
                .message(HttpStatus.OK.getReasonPhrase())
                .data(result)
                .build();
    }
}
