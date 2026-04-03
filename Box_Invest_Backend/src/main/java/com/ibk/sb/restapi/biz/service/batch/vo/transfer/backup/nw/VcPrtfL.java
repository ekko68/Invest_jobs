package com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.nw;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("VcPrtfL")
@NoArgsConstructor
public class VcPrtfL extends NwIvtBaseVO {
    /** 투자사 포트폴리오 목록 */
    @JsonProperty("UTLINSTT_ID")
    private String utlinsttId;
    @JsonProperty("PRTF_ID")
    private String prtfId;
    @JsonProperty("INVM_FILD_CD")
    private String invmFildCd;
    @JsonProperty("UTLZ_TCHN_CD")
    private String utlzTchnCd;
    @JsonProperty("INVM_ENPR_NM")
    private String invmEnprNm;
    @JsonProperty("INVM_ENPR_LGTY_IMG_ID")
    private String invmEnprLgtyImgId;
    @JsonProperty("INVM_STG_CD")
    private String invmStgCd;
    @JsonProperty("INVM_AMT")
    private String invmAmt;
    @JsonProperty("INVM_PRFR_DT")
    private String invmPrfrDt;
    @JsonProperty("OPPB_YN")
    private String oppbYn;
    @JsonProperty("DEL_YN")
    private String delYn;
}
