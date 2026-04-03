package com.ibk.sb.restapi.biz.service.platform.vo.document.cmmscp;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class InfotechScpTemplateVO<T> {
    private String reqTm;
    private String reqTmSs;

    private String resCd;
    private String resTm;
    private String resTmSs;
    private String reqCd;
    private String resMsg;

    private OneDepthOut<T> out;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OneDepthOut<K> {
        private String cookieData;
        private String cookie;
        private String errMsg;
        private String appCd;
        private String reqCd;
        private String svcCd;
        private String resMsg;
        private List<Object> list;
        private String isSession;

        private String uid;
        private List<Object> infotechLog;
        private String orgCd;
        private String resCd;
        private String device;
        private String errYn;
        private String outTime;

        private K out;
    }
}
