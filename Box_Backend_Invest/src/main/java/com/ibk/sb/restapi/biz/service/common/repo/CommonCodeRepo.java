package com.ibk.sb.restapi.biz.service.common.repo;

import com.ibk.sb.restapi.app.common.constant.ComCode;
import com.ibk.sb.restapi.biz.service.common.vo.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CommonCodeRepo {

    // 분야목록 조회
    public List<InvestFieldVO> selectInvestFieldList();

    // 분야목록 + 이미지 리스트 조회
    public List<InvestFieldVO> selectInvestFieldWithImageList();

    // 활용기술 조회
    public List<UtilTechVO> selectUtilTechList();

    // 공통코드 조회
    public List<ComCodeVO> selectComCode(@Param("grpCdId") String grpCdId);

}
