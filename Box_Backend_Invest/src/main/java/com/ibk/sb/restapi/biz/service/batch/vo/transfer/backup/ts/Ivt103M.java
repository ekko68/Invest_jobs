package com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.ts;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("Ivt103M")
@NoArgsConstructor
public class Ivt103M extends TsIvtBaseVO {
    @JsonProperty("RGSN_SRN")   // 주의 : 103M의 경우 Varchar로 되어있음
    private String rgsnSrn;
    @JsonProperty("USIS_ID")
    private String usisId;
    @JsonProperty("INVM_APLC_MNGM_NO")
    private String invmAplcMngmNo;
    @JsonProperty("INVM_YMD")
    private String invmYmd;
    @JsonProperty("INVM_INTT_NM")
    private String invmInttNm;
    @JsonProperty("INVM_AMT")
    private Long invmAmt;
    @JsonProperty("ETVL_AMT")
    private Long etvlAmt;
    @JsonProperty("INVM_STG_ID")
    private String invmStgId;
}