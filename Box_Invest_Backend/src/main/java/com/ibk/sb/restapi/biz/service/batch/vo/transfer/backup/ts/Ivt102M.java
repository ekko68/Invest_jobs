package com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.ts;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("Ivt102M")
@NoArgsConstructor
public class Ivt102M extends TsIvtBaseVO {
    @JsonProperty("RGSN_SRN")
    private Integer rgsnSrn;
    @JsonProperty("INVM_APLC_MNGM_NO")
    private String invmAplcMngmNo;
    @JsonProperty("USIS_ID")
    private String usisId;
    @JsonProperty("STCH_NM")
    private String stchNm;
    @JsonProperty("STCH_BIRT_YMD")
    private String stchBirtYmd;
    @JsonProperty("HLST_CNT")
    private Long hlstCnt;
}