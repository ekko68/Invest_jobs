package com.ibk.sb.restapi.biz.service.user.vo;

import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("UserVO")
public class UserVO {

    // 메인BOX 사용자의ID
    private String userId;

    // 메인박스사용자명
    private String userNm;

    // 사용자생년월일
    private String brthdy;

    // 성별구분코드(PBMB0044) 0001:남자, 0002:여자
    private String sexds;

    // 사용자 생일에 대한 양력음력구분여부
    private String slrcldLrrSe;

    // 사용자의 국적이 한국여부
    private String nativeFrgnrSe;

    // 사용자 로그인패스워드
    private String password;

    // 패스워드 입력오류횟수
    private String passwordErrorCo;

    // 패스워드 사용 연장횟수
    private String passwordExtnCo;

    // 패스워드 변경자ID
    private String passwordUpdusrId;

    // 패스워드 변경일시
    private String passwordUpdtDt;

    // 사용자 자택전화번호
    private String ownhomTelno;

    // 사용자휴대전화번호
    private String moblphonNo;

    // 사용자개인팩스번호
    private String reprsntFxnum;

    // 사용자대표이메일
    private String email;

    // 사용자의 본인인증구분. 공인인증서휴대폰
    private String indvdlCrtfcSe;

    // 사용자 가입방식 구분. 초대인지여부
    private String indvdlSsbypSe;

    // 사용자 본인인증시 발생되는코드1
    private String indvdlCrtfcCodeOne;

    // 사용자 본인인증시 발생되는코드2
    private String indvdlCrtfcCodeTwo;

    // 사용자 소개이미지정보
    private String userImageInfo;

    // 회원의 현재 상태를 구분하는코드
    private String mberSttusCode;

    // 사용자 시스템 관리자구분
    private String sysUserSeValue;

    //개인정보보호동의여부
    private String indvdlInfoscrAgreAt;

    //개인정보보호동의일시
    private String indvdlInfoscrAgreAtDt;

    //사용자기본이미지파일
    private String userBassImageInfo;

    // 최초 등록한이용기관ID
    private String registUtlinstt;

    // 최초 등록한등록자ID
    private String registId;

    // 최초 등록할 때의일시
    private String registDt;

    // 최초의 등록이용기관 이후 수정한기관
    private String updtUtlinstt;

    // 등록자 이후 수정시 해당 수정자의ID
    private String updtId;

    // 등록 이후 수정할 때의일시
    private String updtDt;

    // sso사용자인증서DN
    private String ssoDn;

    //SSO사용자상태구분
    private String ssoStatus;

    //SSO사용자보안정책구분
    private String ssoUrpyCode;

    //SSO사용자타입구분
    private String ssoUserType;

    // 사용자최종로그인IP
    private String ssoLastLoginIp;

    // 사용자최종로그인시간
    private String ssoLastLoginTime;

    // 사용자현재로그인IP
    private String ssoLoginIp;

    // 사용자 현재 로그인 브라우저정보
    private String ssoLoginBr;

    // 사용자 현재 로그인시간
    private String ssoLoginTime;

    // 사용자최종접속시간
    private String ssoAccessTime;

    // 사용자의초기설정구분값
    private String eryyDtrmnSe;

    // 패스워드 재설정시 확인하기 위한값
    private String passwordUpdtCfrm;

    // 패스워드 재설정시 확인하기시간
    private String passwordUpdtCfrmDt;

    //유입구분코드
    private String inflDcd;

    //예비창업자여부
    private String prepFnrYn;

    //간편비밀번호설정여부
    private String simpPwdStupYn;

    //계정상태
    private String acitStts;
}
