package com.ibk.sb.restapi.biz.service.admin.repo;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface AdminCompanyRepo {

    // 운영자포탈 - 추천기업정보 병합
    public Integer mergeCompanyRecommend(@Param("utlinsttId") String utlinsttId,
                                          @Param("rcmdEnprStupYn") String rcmdEnprStupYn,
                                          @Param("rgsnUserId") String rgsnUserId,
                                          @Param("amnnUserId") String amnnUserId);
}
