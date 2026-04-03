package com.ibk.sb.restapi.biz.service.platform.vo.alarm;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RequestCheckAlarmVO {

    /**
     * 알림 수신 완료 처리 Request
     */

    // 개인회원ID
    private String idmbId;

    // 이용기관ID
    private String usisId;

    // 알림전체여부
    private String alrtAllYn;

    // 알림발송번호
    private List<String> list;

    /** 안 쓰는 파라미터는 아예 제외 */
    // 알림대분류코드
//    private String alrtLrdvDcd;

}
