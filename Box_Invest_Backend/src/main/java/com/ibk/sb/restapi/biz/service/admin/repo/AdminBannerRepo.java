package com.ibk.sb.restapi.biz.service.admin.repo;

import com.ibk.sb.restapi.biz.service.admin.vo.BannerVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdminBannerRepo {

    // 운영자포탈 - 배너 정보 등록
    int insertBannerInfo(@Param("bnnrComCdId") String bannerTypeCode,
                         @Param("bnnrSqn") int bnnrSqn,
                         @Param("params") BannerVO bannerVO);

    // 운영자포탈 - 배너 정보 수정
    int updateBannerInfo(@Param("bnnrComCdId") String bannerTypeCode,
                         @Param("bnnrSqn") int bnnrSqn,
                         @Param("params") BannerVO bannerVO);

    // 운영자포탈 - 배너 목록 조회
    List<BannerVO> selectBannerList(@Param("bnnrComCdId") String bnnrComCdId,
                                    @Param("activeDisplay") boolean activeDisplay);


    // 운영자포탈 - 배너 상세 조회
    BannerVO selectBannerInfo(@Param("bnnrComCdId") String bnnrComCdId,
                              @Param("bnnrSqn") int bnnrSqn);

    int updateDisplay(BannerVO params);
}
