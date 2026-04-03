package com.ibk.sb.restapi.biz.service.ir.vo.plan;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("IrPolicyFundVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum", "rgsnUserNm", "amnnUserNm", "rvsRnum"
})
public class IrPolicyFundVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_IR_A_FUND_L
     * DESC : 기업IR 성과 정책자금 정보
     */


    // 이용기관(회사) ID
    private String utlinsttId;

    // 정책자금 순번
    private Integer plfnSqn;

    // 정책자금 내용
    private String plfnCon;

    // 정책자금 금액
    private Long plfnAmt;

    // 정책자금 집행일
    private String plfnPrfrDd;
}
