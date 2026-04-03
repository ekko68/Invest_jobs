package com.ibk.sb.restapi.biz.service.fund.vo.prdInfo;

import org.apache.ibatis.type.Alias;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.PageVO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Alias("FundPrdtInfoPageVO")
@JsonIgnoreProperties({
        "delYn", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class FundPrdtInfoPageVO extends PageVO  {
	
	// 이용기관(회사) 
    private String utlinsttId;
    // 검색 조건 추가 -> 펀드면
    private String searchFundName;
}
