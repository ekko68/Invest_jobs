package com.ibk.sb.restapi.biz.service.ir.vo.extra;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("IrMarketVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum", "rgsnUserNm", "amnnUserNm", "rvsRnum"
})
public class IrMarketVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_IR_P_MKRT_D
     * DESC : 기업IR 시장 정보
     */

    // 이용기관(회사) ID
    private String utlinsttId;

    // 시장조사 설명
    private String mrktInvgDesc;

    // 시장 특징
    private String mrktChrc;

}
