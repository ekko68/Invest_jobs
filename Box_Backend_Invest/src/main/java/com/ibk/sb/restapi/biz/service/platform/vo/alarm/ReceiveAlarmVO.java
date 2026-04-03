package com.ibk.sb.restapi.biz.service.platform.vo.alarm;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReceiveAlarmVO {

    /**
     * 알림 수신 Response
     */

    // 알림발송시간
    private String alrtSndgTs;

    // 알림수신자구분
    private String rcvrDcd;

    // 알림내용
    private String alrtCon;

    // 모바일연동화면정보
    private String mblLinkUrlCon;

    // 알림제목
    private String alrtTtlNm;

    // 알림발송번호
    private String alrtSndgNo;

    // 알림대분류코드
    private String alrtLrdvDcd;

    // 알림중분류코드
    private String alrtMddvCd;

    // PC연동화면정보
    private String pcLinkUrlCon;

    // 알림수신여부
    private String alrtRcvYn;

}
