package com.ibk.sb.restapi.biz.service.platform.vo.document.infotechcertkey;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IntotechSaveCertResultVO {

    private String errYn;

    private String errMsg;

    // 인증서 키값
    private String clientCertKey;

    // 요청 일시
    private String reqTm;

    // 응답 일시
    private String resTm;
}
