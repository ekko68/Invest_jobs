package com.ibk.sb.restapi.biz.service.ir.vo.plan;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("IrInvestResultVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum", "rgsnUserNm", "amnnUserNm", "rvsRnum"
})
public class IrInvestResultVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_IR_A_ATRN_L
     * DESC : 기업IR 성과 투자유치 정보
     */

    // 이용기관(회사) ID
    private String utlinsttId;

    // 투자 성과 순번
    private Integer invmOtcmSqn;

    // 투자 구분 내용
    private String indiCon;

    // 투자 금액
    private Long invmAmt;

    // 투자 날짜
    private String invmDt;

}
