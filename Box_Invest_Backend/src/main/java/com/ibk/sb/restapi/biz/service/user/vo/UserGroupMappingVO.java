package com.ibk.sb.restapi.biz.service.user.vo;

import com.ibk.sb.restapi.app.common.constant.IvtCode;
import lombok.*;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Alias("UserGroupMappingVO")
public class UserGroupMappingVO {

    // 사용자 아이디
    private String userId;

    // 사용자명
    private String userNm;

    // 이용기관 아이디
    private String userGroupId;

    // 이용기관명
    private String userGroupName;

    // 이용기관 타입
    private IvtCode.UsisTypeEnum usisTypeEnum;

    // 권한
    private String userAuth;

    // 사업자 구분 (0001: 개인 | 0002: 법인)
    private String cprSe;

    // 이용기관 사업자번호
    private String userGroupBizNum;

    // 사용자 프로필 이미지
    private String userProfileImgUrl;

    // 이용기관 로고 URl
    private String userGroupLogoUrl;
    
    //연락처
    private String reprsntTelno;

}
