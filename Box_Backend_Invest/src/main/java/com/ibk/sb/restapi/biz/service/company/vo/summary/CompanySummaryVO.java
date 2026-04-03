package com.ibk.sb.restapi.biz.service.company.vo.summary;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("CompanySummaryVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class CompanySummaryVO extends CompanySummaryBaseVO {

    // 회사 연차
    private Integer yearCnt;

    // 업종
    private String btnm;

    /**JOIN**/

    // 이용기관 소개정보
    private String enprInrdCon;

    // 추천기업 설정 여부
//    private String rcmdYn;
    private String rcmdEnprStupYn;

    // 투자희망여부
    private String invmHopeYn;
}
