package com.ibk.sb.restapi.biz.service.platform.vo.document.infotechcertkey;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RequestEncryptedCertVO {

    /** 프론트에서 RSA 공개키 암호화 처리 된 인증서 정보 및 패스워드 정보 */

    // 3분할 된 인증서 pem 암호화 값 (begin, end 제외)
//    private String encSignCertFirst;
//    private String encSignCertSecond;
//    private String encSignCertThird;
    private List<String> encSignCertStrList;

    // 3분할 된 인증서 개인키 pem 암호화 값 (begin, end 제외)
//    private String encSignPriFirst;
//    private String encSignPriSecond;
//    private String encSignPriThird;
    private List<String> encSignPriStrList;

    // 사용자 패스워드 암호화 값
    private String encSignPw;

    // 인증서 만료일 (yyyyMMdd)
    private String atshExpyYmd;
}
