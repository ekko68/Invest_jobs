package com.ibk.sb.restapi.biz.service.fncn.vo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.PageVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("FncnBsnsEnlsPageVO")
@JsonIgnoreProperties({
        "delYn", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class FncnBsnsEnlsPageVO extends PageVO {
    // 검색 조건 추가 -> 제목
    private String searchName;

    // 검색 정렬 조건
    private String searchFncnBsnsPbanDcd;
    
    // 나의 출자사업 검색 정렬 조건
    private String searchFncnBsnsPgrsScd;
    
    // 등록 ID
    private String searchIibsFrrgId;

}
