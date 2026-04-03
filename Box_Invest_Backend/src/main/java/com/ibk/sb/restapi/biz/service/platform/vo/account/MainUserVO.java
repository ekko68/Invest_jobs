package com.ibk.sb.restapi.biz.service.platform.vo.account;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MainUserVO {

    /** 추후 필요한 항목은 추가 */

    private String userId;

    private String userNm;

    /** 권한 정보 */

    // 권한 코드 및 코드명
    // 개인일 경우 null이 아니라 N으로 옴
    private String authorCode;
    private String authorCodeNm;

    /** 사업자분류 */

    // 0001 : 개인사업자 | 0002 : 법인사업자
    private String cprSe;
    private String cprNm;

    /** 함께 받아오는 기업 정보 -> UserDetail에 필요한 부분 세팅 */

    // 이용기관 아이디
    private String utlinsttId;

    // 사업자번호
    private String bizrno;

    // 이용기관명
    private String bplcNm;

    // 사용자 프로필 이미지 파일
    private String userImageInfo;
    private String userBassImageInfo;

    // 이용기관 로고파일
    private String cmpnyLogoImageFile;
    private String cmpnyLogoBassImageFile;
    
    // 연락처
    private String reprsntTelno;
    
    // 휴대전화
    private String moblphonNo;
}
