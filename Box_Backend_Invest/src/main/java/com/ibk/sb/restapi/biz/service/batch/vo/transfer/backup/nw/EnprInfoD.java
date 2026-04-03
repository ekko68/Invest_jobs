package com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.nw;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("EnprInfoD")
@NoArgsConstructor
public class EnprInfoD extends NwIvtBaseVO {
    /** 기업 상세 정보 */
    @JsonProperty("UTLINSTT_ID")
    private String utlinsttId;
    @JsonProperty("ENFM_CLSF_CD")
    private String enfmClsfCd;
    @JsonProperty("ENPR_DSNC_CLSF_CD")
    private String enprDsncClsfCd;
    @JsonProperty("BSUN_DWAR_CD")
    private String bsunDwarCd;
    @JsonProperty("EMP_CNT")
    private Integer empCnt;
    @JsonProperty("BTNM")
    private String btnm;
    @JsonProperty("BZST_NM")
    private String bzstNm;
    @JsonProperty("MSRN_AMSL_YEAR")
    private String msrnAmslYear;
    @JsonProperty("MSRN_AMSL_AMT")
    private Long msrnAmslAmt;
    @JsonProperty("LSTN_YN")
    private String lstnYn;
    @JsonProperty("ENPR_INRD_CON")
    private String enprInrdCon;
    @JsonProperty("CREW_RTRV")
    private Long crewRtrv;
    @JsonProperty("ATRW_STPL_COSN_YN")
    private String atrwStplCosnYn;
    @JsonProperty("RCMD_ENPR_STUP_YN")
    private String rcmdEnprStupYn;
}
