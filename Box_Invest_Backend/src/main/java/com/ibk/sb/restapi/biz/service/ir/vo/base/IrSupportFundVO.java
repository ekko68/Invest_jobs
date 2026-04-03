package com.ibk.sb.restapi.biz.service.ir.vo.base;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("IrSupportFundVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum", "rgsnUserNm", "amnnUserNm", "rvsRnum"
})
public class IrSupportFundVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_IR_B_SPRN_L
     * DESC : 기업IR 기관지원금 정보
     */

    // 이용기관(회사) ID
    private String utlinsttId;

    // 지원금 순번
    private Integer sprnMnySqn;

    // 지원금 유치 날짜
    private String sprnMnyEnmtDt;

    // 지원 기관명
    private String sprnInttNm;

    // 지원금액
    private Long sprnAmt;

}
