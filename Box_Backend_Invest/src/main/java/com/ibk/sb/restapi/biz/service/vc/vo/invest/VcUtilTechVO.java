package com.ibk.sb.restapi.biz.service.vc.vo.invest;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("VcUtilTechVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class VcUtilTechVO extends BaseTableVO {

    /**
     * Mapping Table : TB_BOX_IVT_ENPR_TCHN_R
     * DESC : 기업별 활용 기술 -> CompanyUtilTechVO와 공통
     */

    // 이용기관(회사) ID
    private String utlinsttId;

    // 활용기술 ID
    private String utlzTchnCd;

    // 활용기술명
    private String utlzTchnNm;

    // 활용기술시퀀스
    private Integer utlzTchnSqn;
}
