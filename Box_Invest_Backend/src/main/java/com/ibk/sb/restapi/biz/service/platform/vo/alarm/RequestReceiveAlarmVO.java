package com.ibk.sb.restapi.biz.service.platform.vo.alarm;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequestReceiveAlarmVO {

    // 개인회원ID
    private String idmbId;

    // 이용기관ID
    private String usisId;

    // 알림대분류코드
    private String alrtLrdvDcd;

    // 알림중분류코드
    private String alrtMddvCd;

    // 알림전체여부 ("N" 수신건수만 표현)
    private String alrtAllYn;

    // 현재건수
    private String cnt;

    // 조회할건수
    private String inqCnt;

}
