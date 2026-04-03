package com.ibk.sb.restapi.biz.service.platform.vo.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
public class BoxResponseVO<T> {

    @JsonProperty("STATUS")
    private String STATUS;

    @JsonProperty("MESSAGE")
    private String MESSAGE;

    @JsonProperty("RSLT_MSG")
    private String RSLT_MSG;

    @JsonProperty("RSLT_DATA")
    private T RSLT_DATA;
}
