package com.ibk.sb.restapi.biz.service.vc.vo.invest;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("VcInvestFieldVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class VcInvestFieldVO extends BaseTableVO {

    /**
     * Mapping Table : TB_BOX_IVT_ENPR_IVFL_R
     * DESC : 기업별 투자 분야 -> CompanyInvestFieldVO와 공통
     */

    // 이용기관(회사) ID
    private String utlinsttId;

    // 투자분야 코드
    private String invmFildCd;

    // 투자분야명
    private String invmFildNm;

    // 투자분야 시퀀스
    private Integer ivflSqn;
    
}
