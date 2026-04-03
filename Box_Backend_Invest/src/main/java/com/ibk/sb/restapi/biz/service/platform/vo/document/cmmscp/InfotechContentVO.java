package com.ibk.sb.restapi.biz.service.platform.vo.document.cmmscp;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import java.util.Map;

public class InfotechContentVO {
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class E101PdfOnly {
        private String pdfHex;
        private String txnrmStrtYm;
        private String errMsg;
//        private Map<String, Object> data;
//        private Map<String, String> userInfo;
    }
}
