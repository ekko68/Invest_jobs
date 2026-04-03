package com.ibk.sb.restapi.biz.service.platform.vo.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MainJwtResponseVO {

    @JsonProperty("STATUS")
    private String STATUS;

    @JsonProperty("JWT")
    private String JWT;

    @JsonProperty("MESSAGE")
    private String MESSAGE;

}
