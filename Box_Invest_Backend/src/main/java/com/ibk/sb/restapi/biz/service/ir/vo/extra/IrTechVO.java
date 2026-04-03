package com.ibk.sb.restapi.biz.service.ir.vo.extra;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.ibk.sb.restapi.app.common.vo.BaseTableVO;
import lombok.Getter;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("IrTechVO")
@JsonIgnoreProperties({
        "delYn", "imgFileId", "imgUrl", "rgsnUserId", "rgsnTs", "amnnUserId", "amnnTs",
        "totalCnt", "rnum", "rgsnUserNm", "amnnUserNm", "rvsRnum"
})
public class IrTechVO extends BaseTableVO {

    /**
     * Table : TB_BOX_IVT_IR_P_TECH_D
     * DESC : 기업IR 보유 기술 정보
     */

    // 이용기관(회사) ID
    private String utlinsttId;

    // 보유 기술 설명
    private String holdTchnDesc;

    // 보유 기술 특징
    private String holdTchnChrc;

}
