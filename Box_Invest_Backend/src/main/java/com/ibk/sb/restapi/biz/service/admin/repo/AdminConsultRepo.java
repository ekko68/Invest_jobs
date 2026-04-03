package com.ibk.sb.restapi.biz.service.admin.repo;


import com.ibk.sb.restapi.biz.service.admin.vo.ConsultingVO;
import com.ibk.sb.restapi.biz.service.admin.vo.request.RequestSearchVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdminConsultRepo {

    // 운영자 포탈 - 기업 컨설팅 의뢰 목록 조회
    List<ConsultingVO> selectConsultList(RequestSearchVO params);

    // 운영자 포탈 - 기업 컨설팅 의뢰 상세 조회
    ConsultingVO selectConsultDetail(@Param("cnsgReqsId") String cnsgReqsId);

    // 운영자 포탈 - 컨설팅 답변 처리
    boolean udpateConsultReplayAnswer(@Param("params") ConsultingVO params);

}
