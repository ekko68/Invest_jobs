package com.ibk.sb.restapi.biz.service.ir.vo.finance;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("IrDebtVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum", "rgsnUserNm", "amnnUserNm", "rvsRnum"
})
public class IrDebtVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_IR_F_DEBT_D
     * DESC : 기업 채무 정보
     */

    // 이용기관(회사) ID
    private String utlinsttId;

    // 차입처 순번
    private Integer brngPlceSqn;

    // 차입처명
    private String brngPlceNm;

    // 차입처 금액
    private Long brngPlceAmt;

    // 만기날짜
    private String expiDt;

    // 이자율
    private Double intRt;

    // 상환조건 내용
    private String rpmnCndtCon;
}
