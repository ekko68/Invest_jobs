package com.ibk.sb.restapi.biz.service.company.vo.summary;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("CompanyRecommendVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class CompanyRecommendVO extends CompanySummaryBaseVO {

    // 소개문구
    private String enprInrdCon;

    // 투자희망단계
    private String invmStgCd;
    private String invmStgNm;

    // 투자희망금액
    private String invmAmtCd;
    private String invmAmtNm;

}
