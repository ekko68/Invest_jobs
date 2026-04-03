package com.ibk.sb.restapi.biz.service.platform.vo.document.nicescrap;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NiceMnbKeyVO {

    // 스크래핑요청번호
    private String scpgRqstKeyNo;
    // 상품코드
    private String scpgSvcDcd;
    // 작업요청BOX
    private String ibkboxSvcDcd;
    // 작업시작시간
    private String jobSttgTs;
    // 작업시작구분
    private String jobSttsDcd;
    // NICE작업요청키
    private String scpgrOfrKeyNo;
    // 작업결과
    private String jobRsltDcd;
    // 작업결과내용
    private String jobRsltMsgCon;
    // 완료시간
    private String jobFnshTs;

    private String delYn;

    
    // 요청자
    private String sysLsmdId;
    // 요청시간
    private String sysLsmdTs;

}
