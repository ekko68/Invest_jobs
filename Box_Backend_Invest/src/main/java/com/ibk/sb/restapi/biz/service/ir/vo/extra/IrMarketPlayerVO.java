package com.ibk.sb.restapi.biz.service.ir.vo.extra;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("IrMarketPlayerVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum", "rgsnUserNm", "amnnUserNm", "rvsRnum"
})
public class IrMarketPlayerVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_IR_P_PTCN_L
     * DESC : 기업IR 시장 참여자 정보
     */

    // 이용기관(회사) ID
    private String utlinsttId;

    // 시장 참여자 순번
    private Integer mrktPtcnSqn;

    // 지역 코드
    private String areaDsncCd;

    // 시장 참여자 명
    private String mrktPtcnNm;

    // 시장 참여자 내용
    private String mrktPtcnCon;

    // 매출 금액
    private Long amslAmt;

    /** JOIN **/
    // 지역명
    private String areaDsncNm;

}
