package com.ibk.sb.restapi.biz.service.platform.vo.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BoxMsgResponseVO {

    @JsonProperty("STATUS")
    private String STATUS;

    @JsonProperty("RSLT_MSG")
    private String RSLT_MSG;
}
