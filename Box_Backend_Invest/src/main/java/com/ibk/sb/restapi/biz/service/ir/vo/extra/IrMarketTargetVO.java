package com.ibk.sb.restapi.biz.service.ir.vo.extra;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("IrMarketTargetVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum", "rgsnUserNm", "amnnUserNm", "rvsRnum"
})
public class IrMarketTargetVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_IR_P_GOAL_L
     * DESC : 기업IR 시장 주요 목표 정보
     */


    // 이용기관(회사) ID
    private String utlinsttId;

    // 주요 목표 순번
    private Integer prmrGoalSqn;

    // 지역 코드 (국내, 해외)
    private String areaDsncCd;

    // 주요 목표 내용
    private String prmrGoalCon;

    // 주요 목표 금액
    private Long prmrGoalAmt;

    /** JOIN **/
    // 지역코드명
    private String areaDsncNm;

}
