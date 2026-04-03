package com.ibk.sb.restapi.biz.service.platform.vo.common;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class IbkBrncEmpResVO {

    // call fail
    private String msgCd;
    private String mnmsgCntn;

    // call success
    private String empNextkeyEmn;
    private String empNextkeyRsptDcd;
    private String empNextkeyJbclCd;
    private String empRowcount;

    private List<EmpInfoVO> emp;

    @Getter
    @Setter
    public static class EmpInfoVO {
        // 사번
        private String emn;
        // 직원명
        private String emm;
        // 직책명
        private String dum;
        // 소속 영업점코드
        private String blngBrcd;

        /** 필요한 필드는 추후 주석 해제 후 코멘트 추가 */
//        private String jbttCd;
//        private String ducd;
//        private String jbclCd;
//        private String mndtCd;
//        private String brm;
//        private String rsptDcd;
//        private String beteamCd;
//        private String blngNm;
//        private String etbnYmd;
//        private String cpn;
//        private String userRgsnBrcd;
//        private String ogznAttcd;
//        private String cctnYn;
    }
}
