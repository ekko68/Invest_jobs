package com.ibk.sb.restapi.biz.service.batch.vo.transfer.backup.nw;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.ibatis.type.Alias;

@Getter
@Setter
@Alias("IrBBsinM")
@NoArgsConstructor
public class IrBBsinM extends NwIvtBaseVO {
    /** 기업IR 기본 정보 */
    @JsonProperty("UTLINSTT_ID")
    private String utlinsttId;
    @JsonProperty("BNNM")
    private String bnnm;
    @JsonProperty("ENPR_DSNC_CD")
    private String enprDsncCd;
    @JsonProperty("BZN")
    private String bzn;
    @JsonProperty("COL")
    private String col;
    @JsonProperty("RPRNM")
    private String rprnm;
    @JsonProperty("EMP_CNT")
    private Integer empCnt;
    @JsonProperty("BTNM")
    private String btnm;
    @JsonProperty("CGN")
    private String cgn;
    @JsonProperty("CNPL")
    private String cnpl;
    @JsonProperty("HMPG_URL_ADR")
    private String hmpgUrlAdr;
    @JsonProperty("ADR")
    private String adr;
    @JsonProperty("ZPCD")
    private String zpcd;
    @JsonProperty("CPFN_AMT")
    private Long cpfnAmt;
    @JsonProperty("PVPR_AMT")
    private Long pvprAmt;
    @JsonProperty("TTIS_STCNT")
    private Long ttisStcnt;
    @JsonProperty("ACPR")
    private String acpr;
    @JsonProperty("ETVL_AMT")
    private String etvlAmt;
    @JsonProperty("INVM_MNY_USUS")
    private String invmMnyUsus;
    @JsonProperty("INVM_RTRV_PLAN_CON")
    private String invmRtrvPlanCon;
}