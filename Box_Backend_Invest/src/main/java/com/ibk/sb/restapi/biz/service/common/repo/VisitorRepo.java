package com.ibk.sb.restapi.biz.service.common.repo;

import com.ibk.sb.restapi.biz.service.common.vo.VisitorCountVO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface VisitorRepo {

    // 투자박스 일일 방문자 카운트 병합
    public Integer mergeInvestBoxVisitorCount(VisitorCountVO visitorCountVO);

}
