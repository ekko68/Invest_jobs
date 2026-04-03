package com.ibk.sb.restapi.biz.service.consult.repo;

import com.ibk.sb.restapi.biz.service.admin.vo.ConsultingVO;
import com.ibk.sb.restapi.biz.service.consult.vo.ConsultingSummaryVO;
import com.ibk.sb.restapi.biz.service.consult.vo.RequestSearchConsultingVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ConsultRepo {
    
    // 기업 컨설팅 의뢰 목록 조회
    public List<ConsultingSummaryVO> selectCompanyConsultingList(RequestSearchConsultingVO requestSearchConsultingVO);
    
    // 기업 컨설팅 의뢰 상세 조회
    public ConsultingVO selectCompanyConsulting(@Param("cnsgReqsId") String cnsgReqsId);
    
    // 컨설팅 의뢰
    public Integer insertConsultingRequest(ConsultingVO consultingVO);

    // 컨설팅 의뢰 정보 수정
    public Integer updateConsultingRequest(ConsultingVO consultingVO);

    // 컨설팅 의뢰 상태변경
    public Integer updateConsultingStatus(@Param("cnsgReqsId") String cnsgReqsId,
                                          @Param("reqsInttId") String reqsInttId,
                                          @Param("cnsgSttsCd") String cnsgSttsCd,
                                          @Param("amnnUserId") String amnnUserId);

}
