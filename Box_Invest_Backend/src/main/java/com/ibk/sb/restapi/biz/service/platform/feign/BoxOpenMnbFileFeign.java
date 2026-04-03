package com.ibk.sb.restapi.biz.service.platform.feign;

import com.ibk.sb.restapi.app.config.feign.FeignBoxKeyConfig;
import feign.Response;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * Timeout 관리 등 따로 처리 하기 위해 feign client name 분리
 */
@FeignClient(
        name="box-open-api-file",
        url="${feign.box-open-api.url}",
        configuration = FeignBoxKeyConfig.IvtKeyConfig.class)
public interface BoxOpenMnbFileFeign {

    /**
     * MainBox 파일 다운로드
     * 기존 투자박스 파일 이관시 사용
     * @param fileMngmNo
     * @param fileSqn
     * @return
     */
    @GetMapping(value="/api/mb/v1/invest/transfer/file/download")
    Response getMainFileDownload(@RequestParam("fileMngmNo") String fileMngmNo, @RequestParam("fileSqn") int fileSqn);
}
