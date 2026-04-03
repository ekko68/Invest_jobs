package com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.ts;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("Ivt401H")
@NoArgsConstructor
public class Ivt401H extends TsIvtBaseVO {
    @JsonProperty("INVM_APLC_PSST_SRN")
    private String invmAplcPsstSrn;
    @JsonProperty("USIS_ID")
    private String usisId;
    @JsonProperty("INVM_APLC_MNGM_NO")
    private String invmAplcMngmNo;
    @JsonProperty("PGRS_CON")
    private String pgrsCon;
    @JsonProperty("PGRS_STTS_CD")
    private String pgrsSttsCd;
}