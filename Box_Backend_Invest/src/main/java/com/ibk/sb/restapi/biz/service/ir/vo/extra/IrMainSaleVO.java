package com.ibk.sb.restapi.biz.service.ir.vo.extra;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("IrMainSaleVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum", "rgsnUserNm", "amnnUserNm", "rvsRnum"
})
public class IrMainSaleVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_IR_P_SALE_L
     * DESC : 기업IR 주요 매출처 정보
     */


    // 이용기관(회사) ID
    private String utlinsttId;

    // 매출처 순번
    private Integer amplSqn;

    // 지역 코드 (국내, 해외)
    private String areaDsncCd;

    // 매출 내용
    private String amslCon;

    // 매출 금액
    private Long amslAmt;

    // 매출 비중
    private Double amslRlim;

    /** JOIN **/
    private String areaDsncNm;
}
