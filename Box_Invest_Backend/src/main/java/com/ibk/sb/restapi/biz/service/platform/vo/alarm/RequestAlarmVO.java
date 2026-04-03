package com.ibk.sb.restapi.biz.service.platform.vo.alarm;

import com.ibk.sb.restapi.app.common.constant.AlarmCode;
import com.ibk.sb.restapi.biz.service.platform.vo.account.UsisUserVO;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RequestAlarmVO {

    /**
     * Alarm Enum 기준 alarm 발송 기본정보 세팅
     * @param alarmEnum
     */
    public RequestAlarmVO(AlarmCode.AlarmCodeEnum alarmEnum) {
        this.alrtId = alarmEnum.getAlarmId();
        this.alrtTtlNm = alarmEnum.getTitle();
    }

    /**
     * AlarmEnum, AlarmLinkEnum 기준 alarm 발송 기본정보 세팅
     * @param alarmEnum
     */
    public RequestAlarmVO(AlarmCode.AlarmCodeEnum alarmEnum, AlarmCode.AlarmLinkEnum alarmLinkEnum) {
        this.alrtId = alarmEnum.getAlarmId();
        this.alrtTtlNm = alarmEnum.getTitle();
        this.pcLinkUrlCon = alarmLinkEnum.getBaseUrl();
    }

    /**
     * 알림 발송 Request
     */

    // 알림ID
    private String alrtId;

    // 수신자구분코드
    // 알림수신자의권한코드정보
    // C:총괄괄리자/M:관리자/U:사용자
    private String rcvrDcd;

    // 알림제목명
    private String alrtTtlNm;

    // 알림내용
    private String alrtCon;

    // 알림대류구분코드
    private String alrtLrdvDcd;

    // 알림중분류구분코드
    private String alrtMddvCd;

    // 알림여부
    private String alrtYn;

    // 푸시여부
    private String pushYn;

    // 알림발송일시
    private String alrtSndgTs;

    // IBKBOX서비스구분코드
    private String ibkboxSvcDcd;

    // PC링크URL내용
    private String pcLinkUrlCon;

    // 배열개수
    private String arrayCnt;

    // 시스템최종변경ID
    private String sysLsmdId;

    // 배열 -> 대상 리스트
    private List<RequestAlarmTargetVO> array;


    /** 안 쓰는 파라미터는 아예 제외 */
//    // 모바일링크URL내용
//    private String mblLinkUrlCon;
//
//    // 기타정보1
//    private String etc1;
//
//    // 기타정보2
//    private String etc2;
//
//    // 기타정보3
//    private String etc3;
//
//    // 기타정보4
//    private String etc4;
//
//    // 기타정보5
//    private String etc5;
}
