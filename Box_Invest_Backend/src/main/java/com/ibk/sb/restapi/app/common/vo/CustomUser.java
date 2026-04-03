package com.ibk.sb.restapi.app.common.vo;


import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import org.springframework.security.core.CredentialsContainer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.StringUtils;

import java.io.Serializable;
import java.util.*;

/** 기존 Spring Security User 클래스 참조 **/
public class CustomUser implements UserDetails, Serializable, CredentialsContainer {

    // serialVersionUID는 IDE 자동생성번호 사용
    private static final long serialVersionUID = -8512715648856716422L;
    
    // UserDetails 기본 멤버
    private final String username;
    private String password;
    private final Set<GrantedAuthority> authorities;
    private final boolean accountNonExpired;
    private final boolean accountNonLocked;
    private final boolean credentialsNonExpired;
    private final boolean enabled;

    // 로그인 유저명
    private final String userNm;

    // 회원 소속 그룹 아이디
    private final String userGroupId;

    // 소속 그룹명
    private final String userGroupName;

    // 회원 소속 그룹 타입 (기업, 투자사) 
    private final String userGroupType;

    // 기업 회원 사업자 분류 (개인 : 0001, 법인 : 0002)
    private final String cprSe;

    // 소속 그룹 사업자번호
    private final String userGroupBizNum;

    // 사용자 프로필 이미지 URL
    private final String userProfileImgUrl;

    // 이용기관 로고 이미지 URL
    private final String userGroupLogoUrl;
    
    //연락처
    private final String reprsntTelno;
    
    /** CustomUser 생성자 **/
    public CustomUser(
            String username, Collection<? extends GrantedAuthority> authorities,
            String userNm, String userGroupId, String userGroupName, IvtCode.UsisTypeEnum usisTypeEnum, String cprSe, String userGroupBizNum, String userProfileImgUrl, String userGroupLogoUrl, String reprsntTelno) {

        if(!StringUtils.hasLength(username)) {
            throw new BizException(StatusCode.COM0001);
        }

        this.username = username;
        this.password = null;
        this.authorities = Collections.unmodifiableSet(sortAuthorities(authorities)); // 변경불가 Collection 처리

        this.userNm = userNm;
        this.userGroupId = userGroupId;
        this.userGroupName = userGroupName;
        this.userGroupType = usisTypeEnum != null ? usisTypeEnum.getType() : null;
        this.cprSe = cprSe;
        this.userGroupBizNum = userGroupBizNum;
        this.userProfileImgUrl = userProfileImgUrl;
        this.userGroupLogoUrl = userGroupLogoUrl;
        this.reprsntTelno = reprsntTelno;
        /** 필요시 accountNonExpired 등 기본 멤버 세팅하는 생성자 추가 **/
        this.enabled = true;
        this.accountNonExpired = true;
        this.credentialsNonExpired = true;
        this.accountNonLocked = true;
    }

    // Set Sort + Set Null 체크
    public static SortedSet<GrantedAuthority> sortAuthorities(Collection<? extends GrantedAuthority> authorities) {
        if (authorities == null) {
            throw new BizException(StatusCode.COM0001);
        }
        SortedSet<GrantedAuthority> sortedAuthorities = new TreeSet<>(new CustomUser.AuthorityComparator());
        Iterator iterator = authorities.iterator();

        while (iterator.hasNext()) {
            GrantedAuthority grantedAuthority = (GrantedAuthority) iterator.next();
            if (grantedAuthority == null) {
                throw new BizException(StatusCode.COM0001);
            }
            sortedAuthorities.add(grantedAuthority);
        }

        return sortedAuthorities;
    }

    // 기존 User 클래스 기준 : username
    public boolean equals(Object object) {
        if(object instanceof CustomUser) {
            return this.username.equals(((CustomUser)object).getUsername());
        } else {
            return false;
        }
    }

    // 기존 User 클래스 기준 : username
    public int hashCode() { return this.username.hashCode(); }

    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(this.getClass().getName()).append(" [");
        sb.append("Username=").append(this.username).append(", ");
        sb.append("Password=[PROTECTED], ");
        sb.append("Enabled=").append(this.enabled).append(", ");
        sb.append("AccountNonExpired=").append(this.accountNonExpired).append(", ");
        sb.append("AccountNonLocked=").append(this.accountNonLocked).append(", ");
        sb.append("CredentialsNonExpired=").append(this.credentialsNonExpired).append(", ");
        sb.append("Granted Authorities=").append(this.authorities).append(", ");
        sb.append("UserNm=").append(this.userNm).append(", ");
        sb.append("UserGroupId=").append(this.userGroupId).append(", ");
        sb.append("UserGroupName=").append(this.userGroupName).append(", ");
        sb.append("UserGroupType").append(this.userGroupType).append(", ");
        sb.append("cprSe").append(this.cprSe).append(", ");
        sb.append("UserGroupBizNum").append(this.userGroupBizNum).append(", ");
        sb.append("UserProfileImgUrl").append(this.userProfileImgUrl).append(", ");
        sb.append("UserGroupLogoUrl").append(this.userGroupLogoUrl).append("]");
        sb.append("reprsntTelno").append(this.reprsntTelno).append("]");

        return sb.toString();
    }

    // 그룹 타입 (기업, 투자사) 구분 확인 메서드
    public boolean checkGroup(IvtCode.UsisTypeEnum usisTypeEnum) {

        if(!usisTypeEnum.getType().equals(this.userGroupType)) {
            return false;
        }

        return true;
    }
    
    @Override
    public void eraseCredentials() {
        this.password = null;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.authorities;
    }

    @Override
    public String getPassword() {
        return this.password;
    }

    @Override
    public String getUsername() {
        return this.username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return this.accountNonExpired;
    }

    @Override
    public boolean isAccountNonLocked() {
        return this.accountNonLocked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return this.credentialsNonExpired;
    }

    @Override
    public boolean isEnabled() {
        return this.enabled;
    }

    public String getUserNm() { return this.userNm; }

    public String getUserGroupId() {
        return this.userGroupId;
    }

    public String getUserGroupName() { return this.userGroupName; }

    public String getUserGroupType() {
        return this.userGroupType;
    }

    public String getCprSe() { return this.cprSe; }

    public String getUserGroupBizNum() { return this.userGroupBizNum; }

    public String getUserProfileImgUrl() { return this.userProfileImgUrl; }

    public String getUserGroupLogoUrl() { return this.userGroupLogoUrl; }
    
    public String getReprsntTelno() {return this.reprsntTelno;}

    // Set element Null 체크 + compare 정의
    private static class AuthorityComparator implements Comparator<GrantedAuthority>, Serializable {
        private static final long serialVersionUID = -8512715648856716422L;

        private AuthorityComparator() {}

        public int compare(GrantedAuthority g1, GrantedAuthority g2) {
            if(g2.getAuthority() == null) {
                return -1;
            } else {
                return g1.getAuthority() == null ? 1 : g1.getAuthority().compareTo(g2.getAuthority());
            }
        }
    }
}
