package com.ibk.sb.restapi.biz.service.platform.vo.document.infotechcertkey;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RequestInfotechCertVO {

    // 인증서 정보
    private String signCert;
    // 개인키 정보
    private String signPri;
    // 인증서 비밀번호
    private String signPw;

    /** 대출 to 투자로 해당 RequestBody를 받는 경우 */
    private String ivtAuthToken;

    /** INFOTECH 인증서 MNB 등록정보 */

    // 어플리케이션 코드 (IBK 고정)
    private final String appCd = "IBK";
    // 인증키값 (등록 요청시 공백)
    private String clientCertKey;
    // 이용기관 ID
    private String usisId;
    // 이용기관 사업자번호
    private String usisBzn;
    // 사용자 ID
    private String rgsrId;
    // 인증서 만료일자
    private String atshExpyYmd;
}
