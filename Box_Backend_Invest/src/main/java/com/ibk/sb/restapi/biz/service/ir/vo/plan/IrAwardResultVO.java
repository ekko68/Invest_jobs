package com.ibk.sb.restapi.biz.service.ir.vo.plan;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("IrAwardResultVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum", "rgsnUserNm", "amnnUserNm", "rvsRnum"
})
public class IrAwardResultVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_IR_A_AWRD_L
     * DESC : 기업IR 성과 수상실적 정보
     */

    // 이용기관(회사) ID
    private String utlinsttId;

    // 수상 실적 순번
    private Integer beawAcrsSqn;

    // 개최 장소
    private String hldPlac;

    // 수상 내역
    private String beawHst;

    // 수상 날짜
    private String beawDt;

}
