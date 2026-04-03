package com.ibk.sb.restapi.biz.service.ir.vo.plan;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("IrMainPlanVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum", "rgsnUserNm", "amnnUserNm", "rvsRnum"
})
public class IrMainPlanVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_IR_A_PLAN_L
     * DESC : 기업IR 주요계획 정보
     */

    // 이용기관(회사) ID
    private String utlinsttId;

    // 주요 계획 순번
    private Integer prmrPlanSqn;

    // 주요지표 구분
    private String prmrIndeDsnc;
    
    // 현재 지표
    private String psntIndeCon;

    // 3개월 목표
    private String mn3IndeCon;

    // 6개월 목표
    private String mn6IndeCon;

    // 9개월 목표
    private String mn9IndeCon;

    /** JOIN **/
    // 지표 구분 명
    private String prmrIndeNm;

}
