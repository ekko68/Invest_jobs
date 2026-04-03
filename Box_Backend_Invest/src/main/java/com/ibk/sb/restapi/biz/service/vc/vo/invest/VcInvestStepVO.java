package com.ibk.sb.restapi.biz.service.vc.vo.invest;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("VcInvestStepVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class VcInvestStepVO extends BaseTableVO {

    /**
     * Mapping Table : TB_BOX_IVT_INVM_STG_R
     * DESC : 투자사 투자단계 매핑정보 -> CompanyUtilTechVO와 공통
     */

    // 이용기관(회사) ID
    private String utlinsttId;

    // 투자 단계 ID
    private String invmStgCd;

    /** JOIN **/
    // 투자단계명
    private String invmStgNm;
}
