package com.ibk.sb.restapi.biz.service.user;

import com.ibk.sb.restapi.app.common.constant.IvtCode;
import com.ibk.sb.restapi.app.common.constant.StatusCode;
import com.ibk.sb.restapi.app.common.exception.BizException;
import com.ibk.sb.restapi.app.common.util.FileUtil;
import com.ibk.sb.restapi.app.common.util.StringUtil;
import com.ibk.sb.restapi.app.common.vo.CustomUser;
import com.ibk.sb.restapi.biz.service.platform.PlatformAccountService;
import com.ibk.sb.restapi.biz.service.platform.vo.account.MainUserVO;
import com.ibk.sb.restapi.biz.service.user.vo.LoginUserVO;
import com.ibk.sb.restapi.biz.service.user.vo.UserGroupMappingVO;
import com.ibk.sb.restapi.biz.service.vc.VentureCapitalService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final PlatformAccountService platformAccountService;

    private final VentureCapitalService vcService;

    private final FileUtil fileUtil;

    /**
     * 로그인한 유저정보 조회
     * @return
     * @throws Exception
     */
    public LoginUserVO searchLoginUserInfo() throws Exception {

        //로그인한 유저 정보 획득
        CustomUser user = (CustomUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        // 권한 조회
        List<String> authorities =  user.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList());

        // TODO: 로그인 유저정보 변수명 추후 수정 협의
        // 우선 기존의 TMP 정보 그대로 세팅함
        LoginUserVO loginUserVO = LoginUserVO.builder()
                .id(user.getUsername())
                .groupId(user.getUserGroupId())
                .name(user.getUserGroupName())
                .userNm(user.getUserNm())
                .userAuth(authorities != null && authorities.size() > 0 ? authorities.get(0) : "")
                .type(user.getUserGroupType())
                .cprSe(user.getCprSe())
                .userProfileImgUrl(user.getUserProfileImgUrl())
                .groupLogoImgUrl(user.getUserGroupLogoUrl())
                .build();

        return loginUserVO;
    }


    /** Mapping **/


    /**
     * 유저 그룹 매핑 정보 조회 처리
     * @return
     * @throws Exception
     */
    public UserGroupMappingVO getUserGroupMapping(String userId, String utlinsttId) throws Exception {

        // 사용자 - 이용기관 정보 조회
        MainUserVO mainUserVO = platformAccountService.searchMainUser(userId, utlinsttId);

        if(mainUserVO == null) {
            throw new BizException(StatusCode.COM9998);
        }

        // 사용자 프로필 파일 아이디 세팅
        String profileImgId = StringUtil.hasLengthWithTrim(mainUserVO.getUserImageInfo())
                ? mainUserVO.getUserImageInfo() : mainUserVO.getUserBassImageInfo();


        // 이용기관 매핑이 안된 일반 사용자일 경우
        if(!StringUtils.hasLength(utlinsttId)) return UserGroupMappingVO.builder()
                .userId(userId)
                .userNm(mainUserVO.getUserNm())
                .userProfileImgUrl(fileUtil.setMainboxLogoUrl(profileImgId))
                .userAuth(mainUserVO.getAuthorCode())
                .build();


        // TODO : 개발 완료후 반드시 삭제처리
        // 테스트용 아이디 법인 사용자 전환
//        final List<String> testLoginGroupIdList = Arrays.asList();
//
//        boolean isTestId = false;
//        if(StringUtils.hasLength(mainUserVO.getUtlinsttId())) {
//            for(String testGroupId : testLoginGroupIdList) {
//                if(testGroupId.equals(mainUserVO.getUtlinsttId())) {
//                    isTestId = true;
//                    break;
//                }
//            }
//        }


        // 이용기관 로고 파일 아이디 세팅
        String logoFileId = StringUtil.hasLengthWithTrim(mainUserVO.getCmpnyLogoImageFile())
                ? mainUserVO.getCmpnyLogoImageFile() : mainUserVO.getCmpnyLogoBassImageFile();

        // 이용기관이 투자사인지 확인
        boolean isVc = vcService.checkVentureCapital(utlinsttId);

        return UserGroupMappingVO.builder()
                .userId(userId)
                .userNm(mainUserVO.getUserNm())
                .userProfileImgUrl(fileUtil.setMainboxLogoUrl(profileImgId))
                .userGroupId(mainUserVO.getUtlinsttId())
                .userAuth(mainUserVO.getAuthorCode())
                .userGroupName(mainUserVO.getBplcNm())
                .userGroupBizNum(mainUserVO.getBizrno())
                .usisTypeEnum(isVc ? IvtCode.UsisTypeEnum.VC : IvtCode.UsisTypeEnum.COMPANY)
//                .cprSe(isTestId ? IvtCode.MainBoxUsisCprSeEnum.CORPORATION.getCode() : mainUserVO.getCprSe())
                .cprSe(mainUserVO.getCprSe())
                .userGroupLogoUrl(fileUtil.setMainboxLogoUrl(logoFileId))
                .reprsntTelno(mainUserVO.getReprsntTelno())
                .build();
    }

}