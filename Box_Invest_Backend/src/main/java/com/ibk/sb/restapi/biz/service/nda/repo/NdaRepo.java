package com.ibk.sb.restapi.biz.service.nda.repo;

import com.ibk.sb.restapi.biz.service.ir.vo.base.InvestRelationVO;
import com.ibk.sb.restapi.biz.service.nda.vo.NdaVO;
import com.ibk.sb.restapi.biz.service.nda.vo.RequestSearchNdaVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface NdaRepo {

    // TODO : 서명인 컬럼 추가 후 수정

    // NDA 요청 목록 조회
    public List<NdaVO> selectNdaList(RequestSearchNdaVO requestSearchNdaVO);

    // NDA 상태별 카운트 조회
    public Integer selectNdaListStatusCnt(RequestSearchNdaVO requestSearchNdaVO);

    // NDA 상세 조회
    public NdaVO selectNda(@Param("ndaCnttId") String ndaCnttId);

    // 기업 NDA Eform 초기정보 조회
    public InvestRelationVO selectNdaFormEnprInitData(@Param("utlinsttId") String utlinsttId);

    // NDA 서명 데이터 조회
    public NdaVO selectNdaSignData(@Param("ndaCnttId") String ndaCnttId);

    // NDA 요청 서명 제출
    public Integer insertRequestNdaSign(NdaVO ndaVO);

    // NDA 최종 서명(수락) 제출
    public Integer updateAcceptNdaSign(NdaVO ndaVO);

    // NDA 요청 반려
    public Integer cancelNdaRequest(@Param("ndaCnttId") String ndaCnttId,
                                    @Param("pgrsSttsCd") String pgrsSttsCd,
                                    @Param("amnnUserId") String amnnUserId);
}
