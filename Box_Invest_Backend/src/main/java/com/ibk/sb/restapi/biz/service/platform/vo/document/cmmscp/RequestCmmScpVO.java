package com.ibk.sb.restapi.biz.service.platform.vo.document.cmmscp;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.*;

import java.util.HashMap;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RequestCmmScpVO {
    private String clientCertKey;
    private String bizNo;
    private String docCd;
    private String scpType;
}
