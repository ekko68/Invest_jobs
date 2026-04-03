package com.ibk.sb.restapi.biz.service.vc.vo.base;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("VcInterestVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class VcInterestVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_CNRN_FILD_L
     * DESC : 기업 관심분야 목록 -> 기업 CompanyInterestVO와 공통
     */

    // 이용기관(회사) ID
    private String utlinsttId;

    // 관심분야 순번
    private Integer cnrnFildSqn;

    // 관심분야명
    private String cnrnFildNm;

}
