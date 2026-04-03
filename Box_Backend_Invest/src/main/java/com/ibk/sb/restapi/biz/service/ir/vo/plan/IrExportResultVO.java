package com.ibk.sb.restapi.biz.service.ir.vo.plan;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("IrExportResultVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum", "rgsnUserNm", "amnnUserNm", "rvsRnum"
})
public class IrExportResultVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_IR_A_EXPT_L
     * DESC : 기업IR 성과 수출 정보
     */

    // 이용기관(회사) ID
    private String utlinsttId;

    // 수출 내역 순번
    private Integer eprtHstSqn;

    // 수출 대상
    private String eprtTgt;

    // 수출 금액
    private Long eprtAmt;

    // 수출 날짜
    private String eprtDt;

}
