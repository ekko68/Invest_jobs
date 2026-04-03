package com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.nw;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("IrPPrdtD")
@NoArgsConstructor
public class IrPPrdtD extends NwIvtBaseVO {
    /** 기업IR 제품 정보 */
    @JsonProperty("UTLINSTT_ID")
    private String utlinsttId;
    @JsonProperty("PRDT_DESC")
    private String prdtDesc;
    @JsonProperty("PRDT_CHRC")
    private String prdtChrc;
}
