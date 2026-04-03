package com.ibk.sb.restapi.biz.service.platform.constant;

import lombok.AllArgsConstructor;
import lombok.Getter;

public class CmmScpConst {
    @AllArgsConstructor
    public enum ScpTypeEnum {

        MYDATA("A", "MyData"),
        MINISTRY("B", "행안부"),
        NICE("C", "NICE"),
        INFOTECH_ONETIME("D", "인포텍(1회)"),
        INFOTECH_CLOUD("E", "인포텍(클라우드)"),
        CREDIT_FINANCE("F", "여신금융협회");

        @Getter
        private final String code;
        @Getter
        private final String name;
    }

    @AllArgsConstructor
    public enum DocTypeEnum {

        INFOTECH_BIZ_LICENSE("E101", "인포텍 사업자등록증 조회");

        @Getter
        private final String code;
        @Getter
        private final String name;
    }
}
