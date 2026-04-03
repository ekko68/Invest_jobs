package com.ibk.sb.restapi.biz.service.user.repo;

import com.ibk.sb.restapi.biz.service.user.vo.UserCompanyVO;
import com.ibk.sb.restapi.biz.service.user.vo.UserVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface UserInfoRepo {

    // 회원 - 기업 매핑정보 조회
    public UserCompanyVO selectUserCompanyByUserId(String userId);

}
