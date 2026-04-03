package com.ibk.sb.restapi.biz.service.user.vo;

import lombok.*;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Alias("LoginUserVO")
public class LoginUserVO {

    // 로그인 유저 아이디
    private String id;
    
    // 로그인 유저 그룹 아이디
    private String groupId;

    // 로그인 유저 그룹명
    private String name;

    // 로그인 유저 사용자명
    private String userNm;

    // 로그인 유저 권한
    private String userAuth;

    // 로그인 유저 그룹타입
    private String type;

    // 로그인 유저 그룹 사업자구분
    private String cprSe;

    // 사용자 프로필 이미지 경로
    private String userProfileImgUrl;

    // 기업 로고 이미지 경로
//    private String profileImgUrl;
    private String groupLogoImgUrl;

}
