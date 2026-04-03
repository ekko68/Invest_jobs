package com.ibk.sb.restapi.biz.service.platform.vo.document.infotechcertkey;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InfotechClientKeyVO {

    // 이용기관 ID
    private String usisId;

    // 사업자 등록번호
    private String usisBzn;

    // 인증서 키값
    private String clientCertKey;
}
