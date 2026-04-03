package com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.ts;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("Ivt107M")
@NoArgsConstructor
public class Ivt107M extends TsIvtBaseVO {
    @JsonProperty("INVM_APLC_MNGM_NO")
    private String invmAplcMngmNo;
    @JsonProperty("BSUN_ADR_SRN")
    private Integer bsunAdrSrn;
    @JsonProperty("USIS_ID")
    private String usisId;
    @JsonProperty("PRCP_BSUN_YN")
    private String prcpBsunYn;
    @JsonProperty("BSUN_NM")
    private String bsunNm;
    @JsonProperty("BSUN_BZN")
    private String bsunBzn;
    @JsonProperty("BSUN_ZPCD")
    private String bsunZpcd;
    @JsonProperty("BSUN_ADR")
    private String bsunAdr;
    @JsonProperty("BSUN_DTL_ADR")
    private String bsunDtlAdr;
}
