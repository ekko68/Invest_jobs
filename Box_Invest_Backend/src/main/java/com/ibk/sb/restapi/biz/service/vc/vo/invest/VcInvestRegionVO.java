package com.ibk.sb.restapi.biz.service.vc.vo.invest;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("VcInvestRegionVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum"
})
public class VcInvestRegionVO extends BaseTableVO {

    /**
     * Mapping Table : TB_BOX_IVT_INVM_AREA_R
     * DESC : 기업별 투자지역 맵핑 정보
     */

    // 이용기관(회사) ID
    private String utlinsttId;

    // 투자 지역 코드 ID
    private String invmAreaCdId;

    /** JOIN */
    // 투자 지역 코드명
    private String invmAreaCdNm;

}
