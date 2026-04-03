package com.ibk.sb.restapi.biz.service.company.vo.base;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("CompanyInterestVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class CompanyInterestVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_CNRN_FILD_L
     * DESC : 기업 관심분야 목록
     */

    // 이용기관(회사) ID
    private String utlinsttId;

    // 관심분야 순번
    private Integer cnrnFildSqn;

    // 관심분야명
    private String cnrnFildNm;

}
