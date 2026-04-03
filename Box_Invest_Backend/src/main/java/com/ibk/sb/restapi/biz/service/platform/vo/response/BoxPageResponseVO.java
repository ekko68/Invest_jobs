package com.ibk.sb.restapi.biz.service.platform.vo.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BoxPageResponseVO<T> {

    @JsonProperty("STATUS")
    private String STATUS;

    @JsonProperty("START_PAGE")
    private Long START_PAGE;

    @JsonProperty("END_PAGE")
    private Long END_PAGE;

    @JsonProperty("TOTAL_PAGE")
    private Long TOTAL_PAGE;

    @JsonProperty("RSLT_CNT")
    private Long RSLT_CNT;

    @JsonProperty("RSLT_LIST")
    private List<T> RSLT_LIST;
}
