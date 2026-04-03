package com.ibk.sb.restapi.biz.service.platform.constant;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
public enum PlatformStatusEnum {
    OK("0000", "SUCCESS"),
    ERR("9999", "ERROR");

    @Getter
    private final String status;
    @Getter
    private final String msg;
}
