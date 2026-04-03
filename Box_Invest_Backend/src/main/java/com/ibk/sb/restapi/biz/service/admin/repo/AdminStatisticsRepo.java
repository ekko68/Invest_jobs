package com.ibk.sb.restapi.biz.service.admin.repo;

import com.ibk.sb.restapi.biz.service.admin.vo.AdminStatisticsSearchVO;
import com.ibk.sb.restapi.biz.service.admin.vo.AdminStatisticsVO;
import com.ibk.sb.restapi.biz.service.common.vo.VisitorCountVO;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface AdminStatisticsRepo {

    /**
     * 운영자 포탈 - 통계 (기간별 방문자 현황)
     * @param params
     * @return
     */
    List<VisitorCountVO> selectVisitorStatList(AdminStatisticsSearchVO params);

    /**
     * 운영자 포탈 - 통계 (기간별 방문자 총계)
     * @param params
     * @return
     */
    Integer selectVisitorStatTotal(AdminStatisticsSearchVO params);

    /**
     * 운영자 포탈 - 통계 (투자심사 단계별 통계 조회)
     * @param params
     * @return
     */
    List<AdminStatisticsVO> selectIvExamStatList(AdminStatisticsSearchVO params);

    /**
     * 운영자 포탈 - 통계 (투자심사 단계별 통계 총합 조회)
     * @param params
     * @return
     */
    int selectIvExamStatTotal(AdminStatisticsSearchVO params);

}
