package com.ibk.sb.restapi.biz.service.platform.vo.document.nicescrap;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RequestNiceMnbKeyVO {

    /**
     * 초기화 데이터는 메인박스 인증키 가져오기 (cert//getBankCode.do) 컨트롤러 참조
     */

    // 상품코드
    private String scpgSvcDcd = "001";

    // 작업요청 BOX
    private String ibkboxSvcDcd = "MNB";

    // 작업시작구분 (01 : 요청)
    private String jobSttsDcd = "01";

    // NICE 작업요청 : NICE의 경우 리턴시 API호출을 위한 DATA ID (타 서비스에서 없을 경우 스페이스 한자리)
    private String scpgrOfrKeyNo = " ";

    // 작업결과 (작업 결과 구분 코드 01(정상 완료) 02(작업 실패) 03(작업 취소) 04(시스템 에러,장애))
    private String jobRsltDcd = "01";

    // 작업결과내용
    private String jobRsltMsgCon = "정상완료";

    // 요청자
    private String sysLsmdId;

}
