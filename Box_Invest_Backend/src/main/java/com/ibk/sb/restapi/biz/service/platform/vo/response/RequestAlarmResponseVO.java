package com.ibk.sb.restapi.biz.service.platform.vo.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequestAlarmResponseVO {

    /**
     * 알림 발송 Response
     */

    // 등록결과 00:성공 01 실패
    private String regRslt;

    // 알림발송번호
    private String alrtSndgNo;

    // 등록결과메시지
    private String regRsltMsg;

    // 알림수신수
    private String alrtRcvCnt;

    // 알림수신거부수
    private String alrtRcvRfslCnt;

}
